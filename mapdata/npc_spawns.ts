import type { MapID } from '../types/map';
import type { NpcSpawnDefinition } from '../data/npcs/npc_types';

export const NPC_SPAWN_DEFINITIONS_BY_MAP: Record<MapID, NpcSpawnDefinition[]> = {
    THIEN_NAM: [
        // No NPCs should be generated for Lục Yên Thôn on the overworld map.
    ],
    HAC_AM_SAM_LAM: [
        {
            type: 'procedural_monster',
            areaId: 'hasl-area-1',
            monsterBaseIds: ['monster_da_lang'],
            count: 10,
            levelRange: [1, 4]
        },
        {
            type: 'procedural_monster',
            areaId: 'hasl-area-2',
            monsterBaseIds: ['monster_hac_ma_chu'],
            count: 8,
            levelRange: [2, 5]
        },
        {
            type: 'procedural_monster',
            areaId: 'hasl-area-3',
            monsterBaseIds: ['monster_da_lang', 'monster_hac_ma_chu'],
            count: 5,
            levelRange: [4, 7]
        }
    ],
    THAT_HUYEN_THANH: [
        {
            type: 'static',
            id: 'npc-lao-ma-1',
            baseId: 'lao_ma',
            position: { x: 450, y: 450 }
        },
        {
            type: 'procedural',
            roles: [
                {
                    role: 'Tu Sĩ',
                    count: 6,
                    generationPrompt: `Tạo ra các tu sĩ, học giả, và trưởng lão đang nghiên cứu hoặc trông coi tại các địa điểm quan trọng trong thành. Cảnh giới từ Luyện Khí đến Trúc Cơ.`,
                    poiIds: ['tht-poi-1', 'tht-poi-2'], // Luyện Đan Các, Tàng Kinh Các
                }
            ]
        }
    ],
    MO_LINH_THANH: [
        {
            type: 'procedural',
            roles: [
                {
                    role: 'Khách Nhân',
                    count: 8,
                    generationPrompt: `Tạo ra các tu sĩ, khách quen, và nhân viên cho các địa điểm giải trí và luyện tập tại Mộ Linh Thành. Họ có thể là các tửu khách, võ tu, nghệ sĩ, hoặc những nhân vật bí ẩn. Cảnh giới của họ đa dạng, từ Luyện Khí đến Trúc Cơ.`,
                    poiIds: ['mlt-poi-1', 'mlt-poi-2', 'mlt-poi-3', 'mlt-poi-4'],
                }
            ]
        }
    ],
    THIEN_MA_TUU_LAU: [
        {
            type: 'static',
            id: 'npc-ly-tieu-nhi-1',
            baseId: 'ly_tieu_nhi',
            position: { x: 300, y: 350 }
        },
        {
            type: 'procedural',
            roles: [
                {
                    role: 'Tửu Khách',
                    count: 4,
                    generationPrompt: 'Tạo ra các tửu khách đang uống rượu, bàn luận chuyện thiên hạ trong Thiên Mã Tửu Lâu. Họ có thể là tán tu, thương nhân, hoặc đệ tử các môn phái.',
                    poiIds: [], // Spawns anywhere on this small map
                }
            ]
        }
    ],
    VAN_BAO_LAU: [
        {
            type: 'static',
            id: 'npc-van-bao-chuong-quy-1',
            baseId: 'van_bao_chuong_quy',
            position: { x: 300, y: 150 }
        }
    ],
    LUC_YEN_THON: [
        {
            type: 'static',
            id: 'npc-luc-thon-truong-1',
            baseId: 'luc_thon_truong',
            position: { x: 1000, y: 600 }
        },
        {
            type: 'procedural',
            roles: [
                {
                    role: 'Tạp Hóa Lão Bản',
                    count: 1,
                    generationPrompt: `Tạo ra một vị Lão Bản trông coi tiệm tạp hóa duy nhất trong Lục Yên Thôn. Ông là một tu sĩ Luyện Khí Kỳ đã về già, bán một số vật phẩm cơ bản cho tu sĩ và dân làng.`,
                    poiIds: ['lyt-poi-2'] // Tiệm Tạp Hóa
                },
                {
                    role: 'Thợ Săn',
                    count: 2,
                    generationPrompt: `Tạo ra một Thợ Săn sống tại Lục Yên Thôn. Họ là những người phàm hoặc tu sĩ Luyện Khí cấp thấp, am hiểu về núi rừng xung quanh. Trang bị của họ đơn giản, thường là cung hoặc dao găm, và họ có thể bán một số da thú hoặc thảo dược cơ bản.`,
                    poiIds: ['lyt-poi-3'] // Nhà Dân
                },
                {
                    role: 'Nông Dân',
                    count: 3,
                    generationPrompt: `Tạo ra một Nông Dân hiền lành, chất phác của Lục Yên Thôn. Họ là phàm nhân, quanh năm bán mặt cho đất bán lưng cho trời. Họ không biết tu luyện nhưng có thể kể vài câu chuyện về thôn làng.`,
                    poiIds: ['lyt-poi-3'] // Nhà Dân
                }
            ]
        }
    ],
    BAC_VUC: [],
    HUYEN_NGOC_THANH: [
        {
            type: 'procedural',
            roles: [
                {
                    role: 'Cư Dân Thành Thị',
                    count: 10,
                    generationPrompt: 'Tạo ra các tu sĩ, thị vệ, và thương nhân trong Huyền Ngọc Thành. Cảnh giới của họ từ Luyện Khí đến Trúc Cơ, phản ánh một thành phố sầm uất nhưng không phải là trung tâm quyền lực lớn nhất.',
                    poiIds: ['hth-poi-1', 'hth-poi-2', 'hth-poi-3', 'hth-poi-4', 'hth-poi-5'],
                }
            ]
        }
    ],
    THANH_VAN_MON: [
        {
            type: 'procedural',
            roles: [
                {
                    role: 'Môn Chủ',
                    count: 1,
                    generationPrompt: `Tạo ra Môn Chủ của Thanh Vân Môn. Đây là một đại năng uy nghiêm, cảnh giới Kim Đan Hậu Kì hoặc Đỉnh Phong. Ngài mặc đạo bào lộng lẫy, khí chất phi phàm. Prompt của ngài phải thể hiện quyền uy và sự uyên bác của một người đứng đầu tông môn.`,
                    poiIds: ['tvm-poi-1'], // Chính Điện
                    titleChance: 0.3,
                },
                {
                    role: 'Phó Môn Chủ',
                    count: 2,
                    generationPrompt: `Tạo ra một Phó Môn Chủ của Thanh Vân Môn, đang ở Chính Điện. Họ là tu sĩ Kim Đan Sơ Kì hoặc Trung Kì, phụ trách các công việc quan trọng của tông môn. Tính cách có thể nghiêm nghị hoặc ôn hòa.`,
                    poiIds: ['tvm-poi-1'] // Chính Điện
                },
                {
                    role: 'Chấp Sự Trưởng Lão',
                    count: 2,
                    generationPrompt: `Tạo ra một vị Trưởng Lão Chấp Sự của Thanh Vân Môn, đang có mặt tại Chính Điện. Họ là tu sĩ Kết Tinh Đỉnh Phong, quản lý các sự vụ cụ thể. Họ thường bận rộn và ít nói.`,
                    poiIds: ['tvm-poi-1'] // Chính Điện
                },
                {
                    role: 'Thủ Các Trưởng Lão',
                    count: 1,
                    generationPrompt: `Tạo ra một Thủ Các Trưởng Lão trông coi Tàng Kinh Các của Thanh Vân Môn. Họ là một tu sĩ Kết Tinh Kỳ uyên bác, am hiểu vạn quyển công pháp. Tính cách có phần cổ quái, yêu sách như mạng.`,
                    poiIds: ['tvm-poi-2'] // Tàng Kinh Các
                },
                {
                    role: 'Chân Truyền Đệ Tử',
                    count: 2,
                    generationPrompt: `Tạo ra Chân Truyền Đệ Tử của Thanh Vân Môn, đang ở Tàng Kinh Các để tìm đọc công pháp. Họ là những thiên tài Trúc Cơ Kỳ, kiêu ngạo và tài năng.`,
                    poiIds: ['tvm-poi-2'], // Tàng Kinh Các
                    titleChance: 0.05,
                },
                {
                    role: 'Nội Môn Đệ Tử',
                    count: 5,
                    generationPrompt: `Tạo ra một Nội Môn Đệ Tử của Thanh Vân Môn, đang ở khu vực Đệ Tử Xá. Họ là tu sĩ Trúc Cơ Kỳ, là nòng cốt của tông môn, có thể đang tu luyện, trò chuyện hoặc vội vã đi làm nhiệm vụ.`,
                    poiIds: ['tvm-poi-4'] // Đệ Tử Xá
                },
                {
                    role: 'Ngoại Môn Đệ Tử',
                    count: 10,
                    generationPrompt: `Tạo ra một Ngoại Môn Đệ Tử của Thanh Vân Môn, đang ở khu vực Đệ Tử Xá. Họ là tu sĩ Luyện Khí Kỳ, đang nỗ lực tu luyện để mong có ngày được thăng cấp. Họ thường làm các công việc tạp vụ trong tông môn.`,
                    poiIds: ['tvm-poi-4'] // Đệ Tử Xá
                }
            ]
        }
    ],
    DAI_HOANG: [],
    DONG_HAI: [],
    LUU_LY_TONG: [],
    DUOC_VIEN: [
         {
            type: 'procedural',
            roles: [
                {
                    role: 'Dược Đồng',
                    count: 2,
                    generationPrompt: 'Tạo ra 1-2 đệ tử trông coi Dược Viên. Họ là Luyện Khí Kỳ, am hiểu về linh thảo và có thể bán một số hạt giống cơ bản.',
                    poiIds: [], // Spawns anywhere on this small map
                }
            ]
        }
    ],
};