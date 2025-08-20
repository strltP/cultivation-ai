import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import type { PlayerState, NPC, ChatMessage, NpcIntent, JournalEntry } from '../types/character';
import type { Interactable } from '../types/interaction';
import type { Item } from '../types/item';
import type { NpcDecision } from '../types/combat';
import { getCultivationInfo } from './cultivationService';
import { ALL_SKILLS } from '../data/skills/skills';
import { ALL_EQUIPMENT } from '../data/equipment';
import { EquipmentSlot, EQUIPMENT_SLOT_NAMES, ITEM_TIER_NAMES } from "../types/equipment";
import { ALL_ITEMS } from "../data/items/index";
import { LINH_CAN_TYPES } from "../types/linhcan";
import { REALM_PROGRESSION } from "../constants";
import { MAPS, POIS_BY_MAP, MAP_AREAS_BY_MAP } from "../mapdata";
import type { PointOfInterest } from '../types/map';
import { gameTimeToMinutes } from "./timeService";
import { CHINH_TAGS, TRUNG_LAP_TAGS, TA_TAGS } from '../data/personality_tags';


let ai: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export interface GeminiServiceResponse<T> {
    data: T;
    tokenCount: number;
}

const SYSTEM_INSTRUCTION_ONESHOT = `Bạn là một người quản trò (game master) sáng tạo và am hiểu cho một trò chơi nhập vai 'Tu Tiên'. Phản hồi của bạn phải có không khí, huyền bí và đúng với nhân vật. Hãy mô tả các sự kiện và đối thoại một cách sống động. Giữ cho câu trả lời ngắn gọn, thường là 2-3 câu. Luôn luôn nhập vai và sử dụng ngôn ngữ tiếng Việt phù hợp với bối cảnh tu tiên (ví dụ: lão phu, tại hạ, đạo hữu, linh khí...). Hãy xem xét thời gian trong ngày và mùa trong năm để điều chỉnh không khí của lời thoại.`;

const SYSTEM_INSTRUCTION_CHAT = `Bạn là một người quản trò (game master) sáng tạo và am hiểu cho một trò chơi nhập vai 'Tu Tiên'. Bạn sẽ nhập vai vào một NPC cụ thể và trò chuyện liên tục với người chơi. 
- Luôn luôn nhập vai và sử dụng ngôn ngữ tiếng Việt phù hợp với bối cảnh tu tiên và vai trò của NPC.
- Phản hồi của bạn phải có không khí, huyền bí và đúng với nhân vật.
- Giữ cho câu trả lời ngắn gọn, tự nhiên, thường là 2-4 câu.
- Hãy xem xét thời gian trong ngày và mùa trong năm để điều chỉnh không khí của lời thoại.
- Dựa vào lịch sử trò chuyện và toàn bộ bối cảnh được cung cấp để đưa ra những câu trả lời có tính kết nối và hợp lý.
- Đừng bao giờ phá vỡ vai diễn. Bạn là NPC, không phải là một AI.`;

interface GeminiInteractionResponse {
    dialogue: string;
    loot: { itemName: string; quantity: number }[];
    linhThach?: number;
}

const getHourPeriod = (hour: number) => {
    if (hour >= 5 && hour < 8) return "vào lúc rạng đông";
    if (hour >= 8 && hour < 12) return "vào buổi sáng";
    if (hour >= 12 && hour < 17) return "vào buổi chiều";
    if (hour >= 17 && hour < 20) return "vào lúc hoàng hôn";
    return "vào ban đêm";
}

export const createChatSession = (playerState: PlayerState, npc: NPC, history?: ChatMessage[]): Chat => {
    const client = getAIClient();
    const playerCultivationInfo = getCultivationInfo(playerState.cultivation);
    const npcCultivationInfo = getCultivationInfo(npc.cultivation);
    const timeOfDay = getHourPeriod(playerState.time.hour);
    const season = playerState.time.season;
    const age = playerState.time.year - npc.birthTime.year;

    // 1. Geography - NPC's CURRENT location
    const currentMap = MAPS[playerState.currentMap];
    const poisOnCurrentMap = POIS_BY_MAP[playerState.currentMap] || [];
    const areasOnCurrentMap = MAP_AREAS_BY_MAP[playerState.currentMap] || [];

    const npcArea = areasOnCurrentMap.find(area =>
        npc.position.x >= area.position.x - area.size.width / 2 &&
        npc.position.x <= area.position.x + area.size.width / 2 &&
        npc.position.y >= area.position.y - area.size.height / 2 &&
        npc.position.y <= area.position.y + area.size.height / 2
    );

    const npcPoi = poisOnCurrentMap.find(poi =>
        npc.position.x >= poi.position.x - poi.size.width / 2 &&
        npc.position.x <= poi.position.x + poi.size.width / 2 &&
        npc.position.y >= poi.position.y - poi.size.height / 2 &&
        npc.position.y <= poi.position.y + poi.size.height / 2
    );

    let locationParts: string[] = [];
    if (npcPoi) locationParts.push(npcPoi.name);
    if (npcArea) locationParts.push(npcArea.name);
    locationParts.push(currentMap.name);
    const npcLocationString = [...new Set(locationParts)].join(', ');

    // 2. Cultivation Realms
    const realmNames = REALM_PROGRESSION.map(r => r.name).join(', ');

    // 3. World Geography
    const POI_TYPE_MAP: Record<string, string> = {
        village: "Thôn Làng",
        city: "Thành Thị",
        sect: "Tông Môn",
        dungeon: "Bí Cảnh",
        landmark: "Địa Danh",
        building: "Công Trình",
    };
    
    const worldGeographyParts: string[] = [];
    for (const mapIdStr in MAPS) {
        const mapId = mapIdStr as keyof typeof MAPS;
        const map = MAPS[mapId];
        const areas = MAP_AREAS_BY_MAP[mapId] || [];
        const pois = POIS_BY_MAP[mapId] || [];

        pois.forEach(poi => {
            const parentArea = areas.find(area => 
                poi.position.x >= area.position.x - area.size.width / 2 &&
                poi.position.x <= area.position.x + area.size.width / 2 &&
                poi.position.y >= area.position.y - area.size.height / 2 &&
                poi.position.y <= area.position.y + area.size.height / 2
            );

            const poiTypeVietnamese = POI_TYPE_MAP[poi.type] || "Địa Điểm";

            if (parentArea) {
                worldGeographyParts.push(`- ${poi.name} (loại: ${poiTypeVietnamese}) nằm ở vùng ${parentArea.name}, thuộc đại lục ${map.name}.`);
            } else {
                 worldGeographyParts.push(`- ${poi.name} (loại: ${poiTypeVietnamese}) nằm ở đại lục ${map.name}.`);
            }
        });
    }
    const worldGeographyString = worldGeographyParts.join('\n');


    // 4. NPC self-awareness
    const attributesString = `Căn Cốt: ${npc.attributes.canCot}, Thân Pháp: ${npc.attributes.thanPhap}, Thần Thức: ${npc.attributes.thanThuc}, Ngộ Tính: ${npc.attributes.ngoTinh}, Cơ Duyên: ${npc.attributes.coDuyen}, Tâm Cảnh: ${npc.attributes.tamCanh}`;

    const skillsString = npc.learnedSkills
        .map(ls => ALL_SKILLS.find(s => s.id === ls.skillId)?.name)
        .filter(Boolean)
        .join(', ') || "Không có";

    const equipmentString = (Object.keys(npc.equipment) as EquipmentSlot[])
        .map((slot) => {
            const itemSlot = npc.equipment[slot];
            if (!itemSlot) return null;
            const itemName = ALL_ITEMS.find(i => i.id === itemSlot.itemId)?.name;
            return itemName ? `${EQUIPMENT_SLOT_NAMES[slot]}: ${itemName}` : null;
        })
        .filter(Boolean)
        .join(', ') || "Không có";

    const inventoryString = npc.inventory
        .map(invSlot => {
            const itemName = ALL_ITEMS.find(i => i.id === invSlot.itemId)?.name;
            return itemName ? `${invSlot.quantity}x ${itemName}` : null;
        })
        .filter(Boolean)
        .join(', ') || "Không có";

    const forSaleString = (npc.forSale || [])
        .map(saleItem => {
             const itemName = ALL_ITEMS.find(i => i.id === saleItem.itemId)?.name;
             return itemName ? `${itemName} (còn ${saleItem.stock})` : null;
        })
        .filter(Boolean)
        .join(', ') || "Không bán gì";
    
    const personalityString = npc.personalityTags?.join(', ') || 'Không rõ';

    // 5. World Events (Gossip System)
    const allJournalEntries: JournalEntry[] = [];
    for (const mapId in playerState.generatedNpcs) {
        for (const otherNpc of playerState.generatedNpcs[mapId]) {
            if (otherNpc.id !== npc.id && otherNpc.actionHistory) {
                allJournalEntries.push(...otherNpc.actionHistory);
            }
        }
    }
    const recentEvents = allJournalEntries
        .sort((a, b) => gameTimeToMinutes(b.time) - gameTimeToMinutes(a.time))
        .slice(0, 3) // Get the 3 most recent events
        .map(entry => `- ${entry.message}`);
    
    let recentEventsString = '';
    if (recentEvents.length > 0) {
        recentEventsString = `TIN TỨC GẦN ĐÂY TRONG GIANG HỒ (bạn có thể kể lại những chuyện này nếu được hỏi thăm tin tức)
${recentEvents.join('\n')}`;
    }

    // 6. NPC Current State (Dynamic Interaction)
    let currentStateString = '';
    if (npc.currentIntent && npc.intentProgress) {
        const allPois = Object.values(POIS_BY_MAP).flat();
        const destinationPoi = allPois.find(p => p.id === npc.currentIntent!.destinationPoiId);
        
        let locationStatus = '';
        if (npc.intentProgress.isTraveling) {
            locationStatus = `đang trên đường tới ${destinationPoi?.name || 'một nơi nào đó'}`;
        } else {
            locationStatus = `đang ở tại ${destinationPoi?.name || 'một nơi nào đó'}`;
        }

        currentStateString = `TRẠNG THÁI HIỆN TẠI CỦA BẠN
- Ý định: "${npc.currentIntent.description}" (${locationStatus}).
- Khi được hỏi đang làm gì, hãy trả lời dựa trên điều này. Ví dụ: "Ta đang trên đường đến Hắc Ám Sâm Lâm để tìm Huyết Tinh Chi." hoặc "Ta đang bận thu thập khoáng thạch ở Thiên Nguyên Sơn."`;
    }


    const initialNpcPrompt = `BỐI CẢNH THẾ GIỚI
- Hệ thống cảnh giới tu luyện trong thế giới này, từ thấp đến cao, là: ${realmNames}.
- Sơ đồ địa lý của thế giới:
${worldGeographyString}
${recentEventsString ? `\n${recentEventsString}\n` : ''}
THÔNG TIN VỀ BẢN THÂN BẠN (${npc.name})
- Chức vụ: ${npc.role}${npc.title ? `\n- Danh hiệu: ${npc.title}` : ''}
- Quyền lực: ${npc.power || 'Không rõ'} (trên thang điểm 100, quyền lực càng cao, địa vị càng lớn, thái độ càng uy nghiêm hoặc thâm sâu).
- Giới tính: ${npc.gender}
- Tuổi: ${age}
- Cảnh giới: ${npcCultivationInfo.name}
- Tính cách: ${personalityString}. **QUAN TRỌNG:** Hãy thể hiện những tính cách này trong lời thoại của bạn.
- Thuộc tính: ${attributesString}.
- Công pháp/Tâm pháp đã học: ${skillsString}.
- Trang bị đang mặc: ${equipmentString}.
- Vật phẩm trong túi đồ: ${inventoryString}.
- Vật phẩm đang bán: ${forSaleString}.
- Vai trò và tính cách cốt lõi: "${npc.prompt}"
${currentStateString ? `\n${currentStateString}\n` : ''}
BỐI CẢNH TRÒ CHUYỆN
- Bạn đang nói chuyện với một tu sĩ (${playerState.gender}) tên là '${playerState.name}', hiện đang ở cảnh giới ${playerCultivationInfo.name}.
- Bây giờ là ${timeOfDay} vào mùa ${season}.
- HỆ THỐNG TẶNG QUÀ: Người chơi có thể tặng bạn vật phẩm hoặc linh thạch. Khi bạn nhận được một tin nhắn hệ thống bắt đầu bằng "(Hệ thống: ...)", đó là một hành động tặng quà. Hãy phản hồi lại món quà dựa trên tính cách của bạn, giá trị của món quà, và mối quan hệ của bạn với người chơi.`;

    const geminiHistory = history?.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
    }));

    const chat = client.chats.create({
        model: 'gemini-2.5-flash',
        history: geminiHistory,
        config: {
            systemInstruction: `${SYSTEM_INSTRUCTION_CHAT}\n${initialNpcPrompt}`,
            temperature: 0.85,
        },
    });
    return chat;
}

export const getInteractionResponse = async (
    playerState: PlayerState, 
    target: Interactable,
    possibleItems: Item[]
): Promise<GeminiServiceResponse<GeminiInteractionResponse | null>> => {
    try {
        const client = getAIClient();
        const cultivationInfo = getCultivationInfo(playerState.cultivation);
        const timeOfDay = getHourPeriod(playerState.time.hour);
        const season = playerState.time.season;
        
        // This function now only handles Interactable types, specifically chests as per game logic.
        const itemNames = possibleItems.map(i => i.name).join(', ');
        const prompt = `Nhân vật của tôi, một tu sĩ tên '${playerState.name}' ở cảnh giới ${cultivationInfo.name}, tương tác với một '${target.name}' ${timeOfDay} vào mùa ${season}. Nội dung của nó là: "${target.prompt}". 
Hãy tạo ra một đoạn đối thoại mô tả ngắn gọn (2-3 câu).
Sau đó, hãy quyết định xem họ có tìm thấy vật phẩm nào không. Nếu có, hãy chọn một hoặc hai vật phẩm từ danh sách sau: [${itemNames}]. Ngoài ra, có thể thưởng cho họ một lượng nhỏ Linh Thạch (0 đến 50).
Trả lời dưới dạng JSON.`;


        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION_ONESHOT,
                temperature: 0.8,
                topP: 0.95,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        dialogue: { type: Type.STRING, description: "Nội dung đối thoại hoặc mô tả sự kiện." },
                        loot: {
                            type: Type.ARRAY,
                            description: "Danh sách vật phẩm người chơi nhận được. Có thể là mảng rỗng.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    itemName: { type: Type.STRING, description: "Tên chính xác của vật phẩm." },
                                    quantity: { type: Type.INTEGER, description: "Số lượng vật phẩm nhận được." }
                                },
                                required: ["itemName", "quantity"]
                            }
                        },
                        linhThach: { type: Type.INTEGER, description: "Số lượng Linh Thạch người chơi nhận được. Có thể là 0." }
                    },
                    required: ["dialogue", "loot"]
                }
            },
        });
        
        const tokenCount = response.usageMetadata?.totalTokenCount || 0;
        const jsonStr = response.text.trim();
        const data = JSON.parse(jsonStr) as GeminiInteractionResponse;
        return { data, tokenCount };

    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        // Fallback for non-JSON or other errors
        return { 
            data: { 
                dialogue: "Một thế lực bí ẩn ngăn cản bạn thấu hiểu điều này. Thế gian vẫn im lặng.",
                loot: [],
                linhThach: 0,
            },
            tokenCount: 0,
        };
    }
};


export const getNpcDefeatDecision = async (npc: NPC, player: PlayerState): Promise<GeminiServiceResponse<NpcDecision>> => {
    try {
        const client = getAIClient();
        const playerCultivationInfo = getCultivationInfo(player.cultivation);
        const npcCultivationInfo = getCultivationInfo(npc.cultivation!);

        const prompt = `Trong một trận đấu sinh tử, NPC '${npc.name}' (${npc.role}, giới tính ${npc.gender}${npc.title ? `, "${npc.title}"` : ''}, cảnh giới ${npcCultivationInfo.name}) đã đánh bại người chơi '${player.name}' (giới tính ${player.gender}, cảnh giới ${playerCultivationInfo.name}).
Bản chất và tính cách cốt lõi của NPC là: "${npc.prompt}".
Các thẻ tính cách của NPC: ${npc.personalityTags?.join(', ') || 'Không có'}.

**QUAN TRỌNG:** Quyết định của bạn PHẢI tuyệt đối tuân theo bản chất và tính cách của NPC. Một NPC có thẻ 'Tà ác', 'Tàn nhẫn' SẼ KHÔNG tha mạng. Một NPC có thẻ 'Nhân từ', 'Hiền hòa' có thể sẽ tha mạng. Quyết định không phù hợp với nhân vật sẽ phá hỏng câu chuyện.

Dựa vào những điều trên, hãy quyết định xem NPC sẽ tha mạng ('spare') hay kết liễu ('kill') người chơi.
Sau đó, đưa ra một lời thoại ngắn gọn (1-2 câu) để NPC nói với người chơi, phản ánh quyết định đó.`;

        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION_ONESHOT,
                temperature: 0.9,
                topP: 1.0,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        decision: {
                            type: Type.STRING,
                            description: "Quyết định của NPC: 'spare' (tha mạng) hoặc 'kill' (kết liễu).",
                            enum: ['spare', 'kill']
                        },
                        dialogue: {
                            type: Type.STRING,
                            description: "Lời thoại của NPC nói với người chơi."
                        }
                    },
                    required: ["decision", "dialogue"]
                }
            }
        });
        const tokenCount = response.usageMetadata?.totalTokenCount || 0;
        const jsonStr = response.text.trim();
        const data = JSON.parse(jsonStr) as NpcDecision;
        return { data, tokenCount };
    } catch (error) {
        console.error("Error generating NPC defeat decision from Gemini:", error);
        // Fallback decision in case of error, still leans towards sparing to not be overly punitive on API failure.
        return {
            data: {
                decision: 'spare',
                dialogue: "Hôm nay ta tha cho ngươi một mạng. Cút đi!"
            },
            tokenCount: 0
        };
    }
};

export interface GeneratedNpcData {
    name?: string;
    gender: 'Nam' | 'Nữ';
    role: string;
    power: number;
    behaviors: string[];
    personalityTags: string[];
    title?: string;
    prompt: string;
    realmName: string; // e.g., "Kim Đan"
    levelDescription: string; // e.g., "Sơ Kì", "Tầng 5"
    attributes: {
        canCot: number;
        thanPhap: number;
        thanThuc: number;
        ngoTinh: number;
        coDuyen: number;
        tamCanh: number;
    };
    linhCan?: { type: string, purity: number }[]; // Made optional
    linhThach: number;
    camNgo: number;
    skillTiers: { // Replaced learnedSkillIds
        tamPhapTier: 'HOANG' | 'HUYEN' | 'DIA' | 'THIEN';
        congPhapTiers: ('HOANG' | 'HUYEN' | 'DIA' | 'THIEN')[];
    };
    equipmentTier: 'HOANG' | 'HUYEN' | 'DIA' | 'THIEN'; // Replaced equipment
}

const BEHAVIOR_TAGS_STRING = "'FIGHTER', 'HUNTER', 'GATHERER_HERB', 'GATHERER_ORE', 'TRADER', 'MEDITATOR', 'SCHOLAR', 'WANDERER'";

// Helper function to pick random unique elements from an array
const pickRandom = (arr: string[], num: number): string[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
};

const generatePersonalityTags = (): string[] => {
    const combinations = [
        { weights: [3, 0, 0], weight: 15 }, // 3 Chính
        { weights: [0, 0, 3], weight: 15 }, // 3 Tà
        { weights: [0, 3, 0], weight: 10 }, // 3 Trung Lập
        { weights: [2, 1, 0], weight: 15 }, // 2 Chính, 1 Trung Lập
        { weights: [2, 0, 1], weight: 10 }, // 2 Chính, 1 Tà
        { weights: [1, 2, 0], weight: 10 }, // 1 Chính, 2 Trung Lập
        { weights: [0, 2, 1], weight: 10 }, // 2 Trung Lập, 1 Tà
        { weights: [1, 0, 2], weight: 5 },  // 1 Chính, 2 Tà
        { weights: [0, 1, 2], weight: 5 },  // 1 Trung Lập, 2 Tà
        { weights: [1, 1, 1], weight: 15 }, // 1 của mỗi loại
    ];

    const totalWeight = combinations.reduce((sum, combo) => sum + combo.weight, 0);
    let random = Math.random() * totalWeight;
    let chosenCombination = combinations[0].weights;

    for (const combo of combinations) {
        if (random < combo.weight) {
            chosenCombination = combo.weights;
            break;
        }
        random -= combo.weight;
    }

    const [numChinh, numTrungLap, numTa] = chosenCombination;
    
    const tags: string[] = [];
    tags.push(...pickRandom(CHINH_TAGS, numChinh));
    tags.push(...pickRandom(TRUNG_LAP_TAGS, numTrungLap));
    tags.push(...pickRandom(TA_TAGS, numTa));

    return tags;
};

export const generateNpcs = async (generationPrompt: string, count: number, familyName?: string): Promise<GeminiServiceResponse<GeneratedNpcData[]>> => {
    try {
        const client = getAIClient();
        
        // Generate personality tags programmatically before calling the API
        const allPersonalityTags: string[][] = [];
        for (let i = 0; i < count; i++) {
            allPersonalityTags.push(generatePersonalityTags());
        }

        const prompt = `${generationPrompt}
Hãy tạo ra ${count} NPC độc đáo. Đối với mỗi NPC, hãy cung cấp:
1.  Giới tính ('Nam' hoặc 'Nữ').
2.  Sử dụng lại chính xác chức vụ (role) được cung cấp trong prompt.
3.  Sử dụng lại chính xác cấp độ quyền lực (power) được cung cấp trong prompt.
4.  Một danh sách từ 1 đến 3 thẻ hành vi (behaviors) từ danh sách sau để xác định AI của họ: [${BEHAVIOR_TAGS_STRING}].
5.  Một danh hiệu (title) tu tiên tùy chọn, dựa trên tỉ lệ và chủ đề đã cho. Nếu không có, để trống hoặc null.
6.  Một lời nhắc đối thoại ngắn gọn (1-2 câu) để mời tương tác. Lời nhắc này phải phản ánh các thẻ tính cách được cung cấp.
7.  Cảnh giới tu luyện (ví dụ: 'Trúc Cơ', 'Kim Đan'). Phải nằm trong khoảng đã cho.
8.  Tiểu cảnh giới (ví dụ: 'Hậu Kì', 'Tầng 5').
9.  Các thuộc tính cơ bản (Căn Cốt, Thân Pháp, Thần Thức, Ngộ Tính, Cơ Duyên, Tâm Cảnh) từ 5 đến 15. Phân bổ điểm để phản ánh vai trò.
10. Lượng Linh Thạch và Cảm Ngộ phù hợp với vai trò và cảnh giới.
11. **Phẩm chất (tier)** của 1 Tâm Pháp và 1-2 Công Pháp. Ví dụ: Tâm Pháp 'HUYEN', Công Pháp ['HOANG', 'HOANG'].
12. **Phẩm chất (tier)** chung cho bộ trang bị của họ. Ví dụ: 'HUYEN'.

**QUAN TRỌNG:** Dưới đây là danh sách các thẻ tính cách (personalityTags) đã được xác định trước cho mỗi NPC. Bạn PHẢI sử dụng chính xác các thẻ này khi tạo lời nhắc đối thoại (prompt) cho họ.
${allPersonalityTags.map((tags, index) => `NPC ${index + 1} có các tính cách: [${tags.join(', ')}]`).join('\n')}
`;

        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION_ONESHOT,
                temperature: 0.9,
                topP: 0.95,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            gender: { type: Type.STRING, description: "Giới tính của NPC ('Nam' hoặc 'Nữ').", enum: ['Nam', 'Nữ'] },
                            role: { type: Type.STRING, description: "Chức vụ hoặc vai trò của NPC." },
                            power: { type: Type.INTEGER, description: "Cấp độ quyền lực của NPC, từ 1-100.", nullable: true },
                            behaviors: {
                                type: Type.ARRAY,
                                description: `Một danh sách các thẻ hành vi từ: [${BEHAVIOR_TAGS_STRING}]`,
                                items: { type: Type.STRING }
                            },
                            title: { type: Type.STRING, description: "Danh hiệu tu tiên của NPC. Có thể là chuỗi rỗng hoặc null.", nullable: true },
                            prompt: { type: Type.STRING, description: "Một lời thoại ngắn gọn, trong vai nhân vật, phản ánh tính cách đã cho." },
                            realmName: { type: Type.STRING, description: "Tên cảnh giới tu luyện của NPC." },
                            levelDescription: { type: Type.STRING, description: "Tiểu cảnh giới của NPC." },
                            attributes: {
                                type: Type.OBJECT,
                                properties: {
                                    canCot: { type: Type.INTEGER, description: "Thuộc tính Căn Cốt." },
                                    thanPhap: { type: Type.INTEGER, description: "Thuộc tính Thân Pháp." },
                                    thanThuc: { type: Type.INTEGER, description: "Thuộc tính Thần Thức." },
                                    ngoTinh: { type: Type.INTEGER, description: "Thuộc tính Ngộ Tính." },
                                    coDuyen: { type: Type.INTEGER, description: "Thuộc tính Cơ Duyên (Vận may)." },
                                    tamCanh: { type: Type.INTEGER, description: "Thuộc tính Tâm Cảnh (Ý chí)." },
                                },
                                required: ["canCot", "thanPhap", "thanThuc", "ngoTinh", "coDuyen", "tamCanh"],
                            },
                            linhThach: { type: Type.INTEGER, description: "Lượng Linh Thạch NPC có." },
                            camNgo: { type: Type.INTEGER, description: "Lượng Cảm Ngộ NPC sở hữu." },
                            skillTiers: {
                                type: Type.OBJECT,
                                description: "Phẩm chất của các loại kỹ năng.",
                                properties: {
                                    tamPhapTier: { type: Type.STRING, description: "Phẩm chất Tâm Pháp.", enum: ['HOANG', 'HUYEN', 'DIA', 'THIEN']},
                                    congPhapTiers: {
                                        type: Type.ARRAY,
                                        description: "Danh sách phẩm chất của 1-2 Công Pháp.",
                                        items: { type: Type.STRING, enum: ['HOANG', 'HUYEN', 'DIA', 'THIEN'] }
                                    }
                                },
                                required: ["tamPhapTier", "congPhapTiers"]
                            },
                            equipmentTier: {
                                type: Type.STRING,
                                description: "Phẩm chất chung của bộ trang bị.",
                                enum: ['HOANG', 'HUYEN', 'DIA', 'THIEN']
                            }
                        },
                        required: ["gender", "role", "behaviors", "prompt", "realmName", "levelDescription", "attributes", "linhThach", "camNgo", "skillTiers", "equipmentTier"]
                    }
                }
            },
        });
        
        const tokenCount = response.usageMetadata?.totalTokenCount || 0;
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);

        if (Array.isArray(result) && result.length === count) {
             // Inject the pre-generated personality tags into the result
            const data = result.map((npcData, index) => ({
                ...npcData,
                personalityTags: allPersonalityTags[index]
            })) as GeneratedNpcData[];
            return { data, tokenCount };
        }
        console.error("Gemini response is not a valid array or count mismatch:", result);
        return { data: [], tokenCount };
    } catch (error) {
        console.error("Error generating NPCs from Gemini:", error);
        return { data: [], tokenCount: 0 };
    }
};

export interface PlaceToName {
    id: string;
    type: string; // e.g., 'Đại Lục', 'Thành Thị'
    originalName: string;
}

export const generatePlaceNames = async (places: PlaceToName[]): Promise<GeminiServiceResponse<Record<string, string>>> => {
    try {
        const client = getAIClient();
        const placesString = JSON.stringify(places.map(p => ({ id: p.id, type: p.type, name: p.originalName })));

        const prompt = `Tôi đang tạo một thế giới cho game tu tiên. Dưới đây là danh sách các địa danh hiện có, bao gồm ID, loại địa danh, và tên gốc.
Hãy tạo ra các tên mới, mang đậm phong cách huyền huyễn, tiên hiệp cho mỗi địa danh. Tên mới phải độc đáo và phù hợp với loại địa danh.
Giữ nguyên ID của mỗi địa danh trong câu trả lời của bạn.

Dữ liệu đầu vào:
${placesString}

Yêu cầu trả về kết quả dưới dạng JSON theo schema đã cho.`;

        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "Bạn là một người sáng tạo thế giới (world-builder) chuyên về tiểu thuyết tiên hiệp và huyền huyễn. Phản hồi của bạn phải sáng tạo, giàu hình ảnh và đúng với không khí tu tiên. Chỉ trả lời bằng JSON.",
                temperature: 0.9,
                topP: 1.0,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                       places: {
                            type: Type.ARRAY,
                            description: "Danh sách các địa danh đã được đặt tên lại.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING, description: "ID gốc của địa danh." },
                                    name: { type: Type.STRING, description: "Tên mới, huyền huyễn cho địa danh." }
                                },
                                required: ["id", "name"]
                            }
                       }
                    },
                    required: ["places"]
                }
            },
        });
        
        const tokenCount = response.usageMetadata?.totalTokenCount || 0;
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr) as { places: { id: string; name: string }[] };
        
        if (result && Array.isArray(result.places)) {
            const nameMap = result.places.reduce((acc, place) => {
                acc[place.id] = place.name;
                return acc;
            }, {} as Record<string, string>);
            return { data: nameMap, tokenCount };
        }

        console.error("Gemini response for place names is not in the expected format:", result);
        return { data: {}, tokenCount };

    } catch (error) {
        console.error("Error generating place names from Gemini:", error);
        return { data: {}, tokenCount: 0 };
    }
};