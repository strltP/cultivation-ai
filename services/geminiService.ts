import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import type { PlayerState, NPC, ChatMessage, NpcIntent, JournalEntry, RelationshipType } from '../types/character';
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
import { getAffinityLevel } from './affinityService';
import { getMapHierarchyBreadcrumbs } from './mapService';
import { CHINH_TAGS, TRUNG_LAP_TAGS, TA_TAGS } from '../data/personality_tags';


let ai: GoogleGenAI | null = null;

export const getAIClient = (): GoogleGenAI => {
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
    
    // Affinity
    const affinityScore = playerState.affinity?.[npc.id] || 0;
    const affinityInfo = getAffinityLevel(affinityScore);

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
    // locationParts.push(currentMap.name); // Breadcrumbs will handle the map name
    const npcLocationString = [...new Set(locationParts)].join(', ') || 'không xác định';
    const mapHierarchyString = getMapHierarchyBreadcrumbs(playerState.currentMap);

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

    // 5. NPC Current State (Dynamic Interaction)
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

    // 6. NPC Relationships
    const allNpcs = Object.values(playerState.generatedNpcs).flat();
    const npcMap = new Map(allNpcs.map(n => [n.id, n]));

    const RELATIONSHIP_TEXT_MAP: Record<RelationshipType, string> = {
        father: 'Phụ Thân', mother: 'Mẫu Thân', son: 'Con Trai', daughter: 'Con Gái',
        older_brother: 'Huynh Trưởng', younger_brother: 'Đệ Đệ', older_sister: 'Tỷ Tỷ', younger_sister: 'Muội Muội',
        sibling: 'Huynh Đệ/Tỷ Muội', husband: 'Phu Quân', wife: 'Thê Tử',
        master: 'Sư Phụ', disciple: 'Đệ Tử',
        superior: 'Cấp Trên', subordinate: 'Cấp Dưới',
        peer_same_role: 'Đồng Môn', peer_different_role: 'Đồng Cấp',
        sworn_sibling: 'Huynh Đệ/Tỷ Muội Kết Nghĩa',
        adopted_father: 'Nghĩa Phụ', adopted_mother: 'Nghĩa Mẫu',
        adopted_son: 'Nghĩa Tử', adopted_daughter: 'Nghĩa Nữ',
    };

    const relationshipsString = (npc.relationships || [])
        .map(rel => {
            const targetNpc = npcMap.get(rel.targetNpcId);
            if (!targetNpc) return null;
            const relationshipName = RELATIONSHIP_TEXT_MAP[rel.type] || rel.type;
            
            // Hoàn toàn loại bỏ điểm thiện cảm và cấp độ quan hệ NPC-NPC khỏi context của AI
            return `- ${relationshipName}: ${targetNpc.name}`;
        })
        .filter(Boolean)
        .join('\n');

    let relationshipsSectionString = '';
    if (relationshipsString) {
        relationshipsSectionString = `QUAN HỆ VỚI CÁC NPC KHÁC (bạn có thể nhắc đến những người này trong cuộc trò chuyện)
${relationshipsString}`;
    }

    const initialNpcPrompt = `BỐI CẢNH THẾ GIỚI
- Hệ thống cảnh giới tu luyện trong thế giới này, từ thấp đến cao, là: ${realmNames}.
- Sơ đồ địa lý của thế giới:
${worldGeographyString}
THÔNG TIN VỀ BẢN THÂN BẠN (${npc.name})
- Chức vụ: ${npc.role}${npc.title ? `\n- Danh hiệu: ${npc.title}` : ''}
- Quyền lực: ${npc.power || 'Không rõ'} (trên thang điểm 100, quyền lực càng cao, địa vị càng lớn, thái độ càng uy nghiêm hoặc thâm sâu).
- Giới tính: ${npc.gender}
- Tuổi: ${age}
- Cảnh giới: ${npcCultivationInfo.name}
- Tính cách: ${personalityString}. **QUAN TRỌNG NHẤT:** Đây là những đặc điểm cốt lõi xác định con người của bạn. Bạn PHẢI luôn nhập vai và thể hiện những tính cách này một cách tự nhiên và nhất quán trong mọi lời thoại. Ví dụ, một người 'Kiêu ngạo' sẽ nói chuyện có phần bề trên, một người 'Nhân từ' sẽ nói chuyện ấm áp. Hãy diễn đạt các tính cách này, đừng chỉ lặp lại tên của chúng.
- Thuộc tính: ${attributesString}.
- Công pháp/Tâm pháp đã học: ${skillsString}.
- Trang bị đang mặc: ${equipmentString}.
- Vật phẩm trong túi đồ: ${inventoryString}.
- Vật phẩm đang bán: ${forSaleString}.
${relationshipsSectionString ? `\n${relationshipsSectionString}\n` : ''}
${currentStateString ? `\n${currentStateString}\n` : ''}
BỐI CẢNH TRÒ CHUYỆN
- Vị trí: ${mapHierarchyString} (Cụ thể: ${npcLocationString}).
- Bạn đang nói chuyện với một tu sĩ (${playerState.gender}) tên là '${playerState.name}', hiện đang ở cảnh giới ${playerCultivationInfo.name}.
- Mối quan hệ của bạn với người này: Mức độ thiện cảm hiện tại là ${affinityScore} (trên thang điểm từ -100 đến 100), được đánh giá là '${affinityInfo.level}'. **QUAN TRỌNG:** Hãy điều chỉnh thái độ và lời nói của bạn cho phù hợp với mức độ thiện cảm này. Ví dụ: nếu là 'Thù Địch', hãy nói chuyện cộc lốc, khinh miệt. Nếu là 'Tri Kỷ', hãy nói chuyện thân mật, cởi mở.
- Bây giờ là ${timeOfDay} vào mùa ${season}.
- HỆ THỐNG TẶNG QUÀ: Người chơi có thể tặng bạn vật phẩm hoặc linh thạch. Khi bạn nhận được một tin nhắn hệ thống bắt đầu bằng "(Hệ thống: ...)", đó là một hành động tặng quà. Hãy phản hồi lại món quà dựa trên tính cách của bạn, giá trị của món quà, và mối quan hệ của bạn với người chơi. Nếu thiện cảm tăng, hãy tỏ ra vui vẻ. Nếu giảm, hãy tỏ ra thất vọng hoặc không quan tâm.`;

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
        if (!response.text) {
            throw new Error("Gemini response for getInteractionResponse is empty.");
        }
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
        if (!response.text) {
            throw new Error("Gemini response for getNpcDefeatDecision is empty.");
        }
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