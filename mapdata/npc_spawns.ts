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
            id: 'npc-lao-ma-1',
            baseId: 'lao_ma',
            position: { x: 450, y: 450 }
        },
        {
            type: 'procedural',
            poiIds: ['tht-poi-1', 'tht-poi-2'], // Luyện Đan Các, Tàng Kinh Các
            npcGenerationPrompt: `Tạo ra các tu sĩ, học giả, và trưởng lão đang nghiên cứu hoặc trông coi tại các địa điểm quan trọng trong thành. Cảnh giới từ Luyện Khí đến Trúc Cơ.`,
            count: 6
        }
    ],
    MO_LINH_THANH: [
        {
            type: 'procedural',
            poiIds: ['mlt-poi-1', 'mlt-poi-2', 'mlt-poi-3', 'mlt-poi-4'],
            npcGenerationPrompt: `Tạo ra các tu sĩ, khách quen, và nhân viên cho các địa điểm giải trí và luyện tập tại Mộ Linh Thành. Họ có thể là các tửu khách, võ tu, nghệ sĩ, hoặc những nhân vật bí ẩn. Cảnh giới của họ đa dạng, từ Luyện Khí đến Trúc Cơ.`,
            count: 8
        }
    ],
    THIEN_MA_TUU_LAU: [
        {
            id: 'npc-ly-tieu-nhi-1',
            baseId: 'ly_tieu_nhi',
            position: { x: 300, y: 350 }
        },
        {
            type: 'procedural',
            poiIds: [], // Spawns anywhere on this small map
            npcGenerationPrompt: 'Tạo ra các tửu khách đang uống rượu, bàn luận chuyện thiên hạ trong Thiên Mã Tửu Lâu. Họ có thể là tán tu, thương nhân, hoặc đệ tử các môn phái.',
            count: 4,
        }
    ],
    VAN_BAO_LAU: [
        {
            id: 'npc-van-bao-chuong-quy-1',
            baseId: 'van_bao_chuong_quy',
            position: { x: 300, y: 150 }
        }
    ],
    LUC_YEN_THON: [
        {
            id: 'npc-luc-thon-truong-1',
            baseId: 'luc_thon_truong',
            position: { x: 1000, y: 600 }
        },
        // Use the role-based system to spawn specific villagers within the village map's POIs.
        {
            type: 'procedural',
            poiIds: ['lyt-poi-2', 'lyt-poi-3'], // Targets the shop and residential area POIs
            usePoiRoles: true,
        }
    ],
    BAC_VUC: [
        {
            type: 'procedural',
            poiIds: ['bv-poi-ctm', 'bv-poi-htkt', 'bv-poi-ttm'],
            npcGenerationPrompt: 'Tạo ra các đệ tử và trưởng lão của các môn phái tu tiên tại vùng núi Vân Hàn Sơn lạnh giá. Họ có thể đang tuần tra, tu luyện, hoặc trao đổi với nhau. Cảnh giới từ Trúc Cơ đến Kết Tinh.',
            count: 10
        },
        {
            type: 'procedural',
            poiIds: ['bv-poi-tlt', 'bv-poi-dnt', 'bv-poi-tlth', 'bv-poi-hnth', 'bv-poi-dlth'],
            npcGenerationPrompt: 'Tạo ra các thị dân, thương nhân, và tán tu sinh sống trong các thành trì và thôn trấn của Bắc Vực. Họ có thể đang buôn bán, trò chuyện, hoặc vội vã đi lại. Cảnh giới chủ yếu là Luyện Khí.',
            count: 15
        }
    ],
    HUYEN_NGOC_THANH: [
        {
            type: 'procedural',
            poiIds: ['hth-poi-1', 'hth-poi-2', 'hth-poi-3', 'hth-poi-4', 'hth-poi-5'],
            npcGenerationPrompt: 'Tạo ra các tu sĩ, thị vệ, và thương nhân trong Huyền Ngọc Thành. Cảnh giới của họ từ Luyện Khí đến Trúc Cơ, phản ánh một thành phố sầm uất nhưng không phải là trung tâm quyền lực lớn nhất.',
            count: 10
        }
    ],
    THANH_VAN_MON: [
        // Updated to use the new role-based system
        {
            type: 'procedural',
            poiIds: ['tvm-poi-1', 'tvm-poi-2', 'tvm-poi-4'], // Target specific POIs on this map
            usePoiRoles: true,
        }
    ],
    DAI_HOANG: [
        {
            type: 'procedural',
            poiIds: ['dh-poi-2'], // Lạc Đà Trấn
            npcGenerationPrompt: `Tạo ra các tu sĩ và thương nhân tại một ốc đảo sa mạc. Họ là những người gan dạ, có thể là tán tu, thương nhân buôn bán vật liệu đặc biệt, hoặc những người tìm kiếm cơ hội trong vùng đất khắc nghiệt. Cảnh giới từ Trúc Cơ đến Kết Tinh.`,
            count: 8
        }
    ],
    DONG_HAI: [],
    LUU_LY_TONG: [],
    DUOC_VIEN: [
         {
            type: 'procedural',
            poiIds: [], // Spawns anywhere on this small map
            npcGenerationPrompt: 'Tạo ra 1-2 đệ tử trông coi Dược Viên. Họ là Luyện Khí Kỳ, am hiểu về linh thảo và có thể bán một số hạt giống cơ bản.',
            count: 2,
        }
    ],
};