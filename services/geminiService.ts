import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import type { PlayerState, NPC, ChatMessage } from '../types/character';
import type { Interactable } from '../types/interaction';
import type { Item } from '../types/item';
import type { NpcDecision } from '../types/combat';
import { getCultivationInfo } from './cultivationService';
import { ALL_SKILLS } from '../data/skills/skills';
import { ALL_EQUIPMENT } from '../data/equipment';
import { EquipmentSlot, EQUIPMENT_SLOT_NAMES } from "../types/equipment";
import { ALL_ITEMS } from "../data/items/index";
import { LINH_CAN_TYPES } from "../types/linhcan";
import { REALM_PROGRESSION } from "../constants";
import { MAPS, POIS_BY_MAP, MAP_AREAS_BY_MAP } from "../mapdata";

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
            if (poi.type === 'nation') return;

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
    const attributesString = `Căn Cốt: ${npc.attributes.canCot}, Thân Pháp: ${npc.attributes.thanPhap}, Thần Thức: ${npc.attributes.thanThuc}, Ngộ Tính: ${npc.attributes.ngoTinh}`;

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
             return itemName ? `${itemName} (còn ${saleItem.stock === -1 ? 'vô hạn' : saleItem.stock})` : null;
        })
        .filter(Boolean)
        .join(', ') || "Không bán gì";

    const initialNpcPrompt = `BỐI CẢNH THẾ GIỚI
- Hệ thống cảnh giới tu luyện trong thế giới này, từ thấp đến cao, là: ${realmNames}.
- Sơ đồ địa lý của thế giới:
${worldGeographyString}
- Vị trí hiện tại của bạn là ở ${npcLocationString}.

THÔNG TIN VỀ BẢN THÂN BẠN (${npc.name})
- Chức vụ: ${npc.role}${npc.title ? `\n- Danh hiệu: ${npc.title}` : ''}
- Giới tính: ${npc.gender}
- Cảnh giới: ${npcCultivationInfo.name}
- Thuộc tính: ${attributesString}.
- Công pháp/Tâm pháp đã học: ${skillsString}.
- Trang bị đang mặc: ${equipmentString}.
- Vật phẩm trong túi đồ: ${inventoryString}.
- Vật phẩm đang bán: ${forSaleString}.
- Vai trò và tính cách cốt lõi: "${npc.prompt}"

BỐI CẢNH TRÒ CHUYỆN
- Bạn đang nói chuyện với một tu sĩ (${playerState.gender}) tên là '${playerState.name}', hiện đang ở cảnh giới ${playerCultivationInfo.name}.
- Bây giờ là ${timeOfDay} vào mùa ${season}.`;

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
    target: Interactable | NPC,
    possibleItems: Item[]
): Promise<GeminiInteractionResponse | null> => {
    try {
        const client = getAIClient();
        const cultivationInfo = getCultivationInfo(playerState.cultivation);
        const timeOfDay = getHourPeriod(playerState.time.hour);
        const season = playerState.time.season;
        
        let prompt: string;
        const isNpc = !('type' in target);

        if (isNpc) {
           // This path is now deprecated in favor of the chat system, but kept for potential fallback.
            const npc = target as NPC;
            prompt = `Nhân vật của tôi là một tu sĩ tên '${playerState.name}' ở cảnh giới ${cultivationInfo.name}. ${timeOfDay} vào mùa ${season}, họ gặp gỡ NPC '${npc.name}' (${npc.role}). Bối cảnh của NPC là: "${npc.prompt}". Hãy tạo một đoạn đối thoại ngắn (2-4 câu) cho NPC. NPC sẽ không cho bất kỳ vật phẩm hay linh thạch nào. Chỉ có đối thoại. Trả lời dưới dạng JSON.`;
        } else { // Interactable (only chests reach here)
             const itemNames = possibleItems.map(i => i.name).join(', ');
             prompt = `Nhân vật của tôi, một tu sĩ tên '${playerState.name}' ở cảnh giới ${cultivationInfo.name}, tương tác với một '${target.name}' ${timeOfDay} vào mùa ${season}. Nội dung của nó là: "${target.prompt}". 
Hãy tạo ra một đoạn đối thoại mô tả ngắn gọn (2-3 câu).
Sau đó, hãy quyết định xem họ có tìm thấy vật phẩm nào không. Nếu có, hãy chọn một hoặc hai vật phẩm từ danh sách sau: [${itemNames}]. Ngoài ra, có thể thưởng cho họ một lượng nhỏ Linh Thạch (0 đến 50).
Trả lời dưới dạng JSON.`;
        }


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
        
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as GeminiInteractionResponse;

    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        // Fallback for non-JSON or other errors
        return { 
            dialogue: "Một thế lực bí ẩn ngăn cản bạn thấu hiểu điều này. Thế gian vẫn im lặng.",
            loot: [],
            linhThach: 0,
        };
    }
};


export const getNpcDefeatDecision = async (npc: NPC, player: PlayerState): Promise<NpcDecision> => {
    try {
        const client = getAIClient();
        const playerCultivationInfo = getCultivationInfo(player.cultivation);
        const npcCultivationInfo = getCultivationInfo(npc.cultivation!);

        const prompt = `Trong một trận đấu sinh tử, NPC '${npc.name}' (${npc.role}, giới tính ${npc.gender}${npc.title ? `, "${npc.title}"` : ''}, cảnh giới ${npcCultivationInfo.name}) đã đánh bại người chơi '${player.name}' (giới tính ${player.gender}, cảnh giới ${playerCultivationInfo.name}).
Bối cảnh của NPC là: "${npc.prompt}".
Dựa vào tính cách và bối cảnh của NPC, hãy quyết định xem NPC sẽ tha mạng hay kết liễu người chơi.
Hãy đưa ra một lời thoại ngắn gọn (1-2 câu) để NPC nói với người chơi, phản ánh quyết định đó.
Lưu ý: NPC có thể độc ác, kiêu ngạo, nhân từ, hoặc dửng dưng. Quyết định phải phù hợp với vai trò của họ. Ví dụ, một trưởng lão chính phái có thể tha mạng, một ma tu có thể kết liễu không do dự.`;

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
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as NpcDecision;
    } catch (error) {
        console.error("Error generating NPC defeat decision from Gemini:", error);
        // Fallback decision
        return {
            decision: 'spare',
            dialogue: "Hôm nay ta tha cho ngươi một mạng. Cút đi!"
        };
    }
};

export interface GeneratedNpcData {
    name: string;
    gender: 'Nam' | 'Nữ';
    role: string;
    title?: string;
    prompt: string;
    realmName: string; // e.g., "Kim Đan"
    levelDescription: string; // e.g., "Sơ Kì", "Tầng 5"
    attributes: {
        canCot: number;
        thanPhap: number;
        thanThuc: number;
        ngoTinh: number;
    };
    linhCan: { type: string, purity: number }[];
    linhThach: number;
    learnedSkillIds: string[];
    equipment?: Partial<Record<EquipmentSlot, { itemId: string }>>;
    inventory?: { itemId: string, quantity: number }[];
    forSale?: { itemId: string, stock: number, priceModifier?: number }[];
}

export const generateNpcs = async (generationPrompt: string, count: number): Promise<GeneratedNpcData[]> => {
    try {
        const client = getAIClient();
        const tamPhapSkills = ALL_SKILLS.filter(s => s.type === 'TAM_PHAP');
        const congPhapSkills = ALL_SKILLS.filter(s => s.type === 'CONG_PHAP');
        
        const equipmentInfo = ALL_EQUIPMENT.map(e => `id: ${e.id}, name: ${e.name}, slot: ${e.slot}, tier: ${e.tier}`).join('; ');
        const tamPhapInfo = tamPhapSkills.map(s => `${s.id} (${s.name})`).join(', ');
        const congPhapInfo = congPhapSkills.map(s => `${s.id} (${s.name})`).join(', ');

        const inventoryItems = ALL_ITEMS.filter(i => i.type === 'material' || i.type === 'consumable');
        const sellableItemsInfo = ALL_ITEMS.filter(i => i.value && i.value > 0).map(i => `id: ${i.id}, name: '${i.name}', type: ${i.type}`).join('; ');
        const linhCanTypesString = LINH_CAN_TYPES.join(', ');

        const prompt = `${generationPrompt}
Hãy tạo ra ${count} NPC độc đáo. Đối với mỗi NPC, hãy cung cấp:
1.  Tên tiếng Việt.
2.  Giới tính ('Nam' hoặc 'Nữ').
3.  Một chức vụ (role) phù hợp (ví dụ: 'Lão Dược Sư', 'Kiếm Tu Lãng Du', 'Trưởng Lão Tông Môn').
4.  Một danh hiệu (title) tu tiên tùy chọn, không bắt buộc, mang tính chất hào nhoáng (ví dụ: 'Kiếm Thánh', 'Huyết Ma', 'Bách Thảo Tiên Tử'). Để trống nếu không phù hợp.
5.  Một lời nhắc đối thoại ngắn gọn (1-2 câu) để mời tương tác.
6.  Cảnh giới tu luyện (ví dụ: 'Trúc Cơ', 'Kim Đan').
7.  Tiểu cảnh giới (ví dụ: 'Hậu Kì', 'Đỉnh Phong', hoặc 'Tầng 5' đối với Luyện Khí).
8.  Các thuộc tính cơ bản (Căn Cốt, Thân Pháp, Thần Thức, Ngộ Tính). Giá trị của thuộc tính phải phù hợp với cảnh giới của họ. Ví dụ: Luyện Khí (giá trị từ 10-30), Trúc Cơ (20-50), Kết Tinh (30-60), Kim Đan (40-80). Hãy phân bổ các điểm này để phản ánh vai trò của họ (ví dụ: pháp tu có Thần Thức và Ngộ Tính cao, hộ vệ có Căn Cốt cao).
9.  Một danh sách từ 1 đến 5 Linh Căn. Mỗi Linh Căn bao gồm 'type' (loại) và 'purity' (độ thuần khiết, 10-100). Loại Linh Căn phải nằm trong danh sách sau: [${linhCanTypesString}]. Linh Căn phải phù hợp với vai trò và cảnh giới của NPC.
10. Một danh sách ID kỹ năng đã học. Hãy chọn 1 Tâm Pháp từ danh sách sau: [${tamPhapInfo}]. Và chọn 1 hoặc 2 Công Pháp từ danh sách sau: [${congPhapInfo}]. Các kỹ năng phải phù hợp với vai trò và cảnh giới của họ.
11. Một lượng Linh Thạch (ví dụ, 0 đến 100) mà họ có thể đánh rơi.
12. Một bộ trang bị (equipment) từ danh sách sau, phù hợp với vai trò và cảnh giới. Chỉ cung cấp itemId. Không trang bị cho tất cả. Danh sách trang bị: [${equipmentInfo}]
13. Một túi đồ (inventory) chứa một vài vật phẩm từ danh sách sau. Có thể là một mảng rỗng. Danh sách vật phẩm: [${sellableItemsInfo}]
14. Một danh sách các vật phẩm để bán (forSale), phù hợp với vai trò của NPC (ví dụ: thợ rèn bán khoáng thạch, dược sư bán thảo dược). Có thể là một mảng rỗng. Mỗi vật phẩm bao gồm: 'itemId', 'stock' (số lượng, -1 là vô hạn), và có thể có 'priceModifier' (hệ số giá, ví dụ 1.5 là bán đắt hơn 50%). Danh sách vật phẩm có thể bán: [${sellableItemsInfo}]`;

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
                            name: { type: Type.STRING, description: "Tên tiếng Việt của NPC." },
                            gender: { type: Type.STRING, description: "Giới tính của NPC ('Nam' hoặc 'Nữ').", enum: ['Nam', 'Nữ'] },
                            role: { type: Type.STRING, description: "Chức vụ hoặc vai trò của NPC (ví dụ: 'Lão Dược Sư', 'Kiếm Tu Lãng Du')." },
                            title: { type: Type.STRING, description: "Danh hiệu tu tiên của NPC (ví dụ: 'Kiếm Thánh'). Có thể là chuỗi rỗng hoặc null nếu không có.", nullable: true },
                            prompt: { type: Type.STRING, description: "Một lời thoại ngắn gọn, trong vai nhân vật để người chơi tương tác." },
                            realmName: { type: Type.STRING, description: "Tên cảnh giới tu luyện của NPC (ví dụ: 'Trúc Cơ')." },
                            levelDescription: { type: Type.STRING, description: "Tiểu cảnh giới của NPC (ví dụ: 'Hậu Kì', 'Tầng 5')." },
                            attributes: {
                                type: Type.OBJECT,
                                properties: {
                                    canCot: { type: Type.INTEGER, description: "Thuộc tính Căn Cốt." },
                                    thanPhap: { type: Type.INTEGER, description: "Thuộc tính Thân Pháp." },
                                    thanThuc: { type: Type.INTEGER, description: "Thuộc tính Thần Thức." },
                                    ngoTinh: { type: Type.INTEGER, description: "Thuộc tính Ngộ Tính." },
                                },
                                required: ["canCot", "thanPhap", "thanThuc", "ngoTinh"],
                            },
                             linhCan: {
                                type: Type.ARRAY,
                                description: "Danh sách từ 1-5 Linh Căn của NPC.",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        type: { type: Type.STRING, description: `Loại Linh Căn, một trong: ${linhCanTypesString}` },
                                        purity: { type: Type.INTEGER, description: "Độ thuần khiết của Linh Căn (10-100)." }
                                    },
                                    required: ["type", "purity"]
                                }
                            },
                            linhThach: { type: Type.INTEGER, description: "Lượng Linh Thạch NPC có thể đánh rơi khi bị hạ gục." },
                            learnedSkillIds: {
                                type: Type.ARRAY,
                                description: "Một danh sách ID kỹ năng (Tâm Pháp và Công Pháp) mà NPC đã học. Chọn từ danh sách được cung cấp trong prompt.",
                                items: {
                                    type: Type.STRING
                                }
                            },
                             equipment: {
                                type: Type.OBJECT,
                                description: "Các vật phẩm NPC đang trang bị. Có thể là object rỗng.",
                                properties: {
                                    WEAPON: { type: Type.OBJECT, properties: { itemId: { type: Type.STRING } }, required: ["itemId"], nullable: true },
                                    HEAD: { type: Type.OBJECT, properties: { itemId: { type: Type.STRING } }, required: ["itemId"], nullable: true },
                                    ARMOR: { type: Type.OBJECT, properties: { itemId: { type: Type.STRING } }, required: ["itemId"], nullable: true },
                                    LEGS: { type: Type.OBJECT, properties: { itemId: { type: Type.STRING } }, required: ["itemId"], nullable: true },
                                    ACCESSORY: { type: Type.OBJECT, properties: { itemId: { type: Type.STRING } }, required: ["itemId"], nullable: true }
                                }
                            },
                            inventory: {
                                type: Type.ARRAY,
                                description: "Danh sách các vật phẩm trong túi đồ của NPC. Có thể là mảng rỗng.",
                                nullable: true,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        itemId: { type: Type.STRING, description: "ID chính xác của vật phẩm." },
                                        quantity: { type: Type.INTEGER, description: "Số lượng vật phẩm." }
                                    },
                                    required: ["itemId", "quantity"]
                                }
                            },
                            forSale: {
                                type: Type.ARRAY,
                                description: "Danh sách các vật phẩm NPC bán. Có thể là mảng rỗng.",
                                nullable: true,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        itemId: { type: Type.STRING, description: "ID vật phẩm để bán." },
                                        stock: { type: Type.INTEGER, description: "Số lượng trong kho (-1 là vô hạn)." },
                                        priceModifier: { type: Type.NUMBER, description: "Hệ số giá bán (ví dụ 1.5). Mặc định là 1.", nullable: true }
                                    },
                                    required: ["itemId", "stock"]
                                }
                            }
                        },
                        required: ["name", "gender", "role", "prompt", "realmName", "levelDescription", "attributes", "linhCan", "linhThach", "learnedSkillIds"]
                    }
                }
            },
        });
        
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);

        if (Array.isArray(result)) {
             return result as GeneratedNpcData[];
        }
        console.error("Gemini response is not an array:", result);
        return [];
    } catch (error) {
        console.error("Error generating NPCs from Gemini:", error);
        return [];
    }
};

export interface PlaceToName {
    id: string;
    type: string; // e.g., 'Đại Lục', 'Thành Thị'
    originalName: string;
}

export const generatePlaceNames = async (places: PlaceToName[]): Promise<Record<string, string>> => {
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
        
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr) as { places: { id: string; name: string }[] };
        
        if (result && Array.isArray(result.places)) {
            const nameMap = result.places.reduce((acc, place) => {
                acc[place.id] = place.name;
                return acc;
            }, {} as Record<string, string>);
            return nameMap;
        }

        console.error("Gemini response for place names is not in the expected format:", result);
        return {};

    } catch (error) {
        console.error("Error generating place names from Gemini:", error);
        return {};
    }
};