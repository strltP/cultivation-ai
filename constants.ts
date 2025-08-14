

import type { PlayerState } from './types/character';
import type { CharacterAttributes, CombatStats } from './types/stats';
import { 
    MAPS, 
    POIS_BY_MAP, 
    INTERACTABLES_BY_MAP, 
    TELEPORT_GATES_BY_MAP, 
    MAP_AREAS_BY_MAP 
} from './mapdata';
// Removed calculateCombatStats import to break circular dependency

// Re-export all map data so other files don't need to change their imports
export { 
    MAPS, 
    POIS_BY_MAP, 
    INTERACTABLES_BY_MAP, 
    TELEPORT_GATES_BY_MAP, 
    MAP_AREAS_BY_MAP 
};

interface LevelProgression {
    qiRequired: number;
    levelName: string;
    bonuses: Partial<Record<keyof (CombatStats & CharacterAttributes), number | [number, number]>>;
}

interface RealmProgression {
    name: string;
    levels: LevelProgression[];
}

export const REALM_PROGRESSION: RealmProgression[] = [
  // Cảnh giới 0: Luyện Khí
  {
    name: "Luyện Khí",
    levels: [
      // Level index 0 (Tầng 1)
      { qiRequired: 1000, levelName: "Tầng 1", bonuses: { maxHp: [40, 70], maxMana: [15, 30], attackPower: [1, 3], defensePower: 1, canCot: 1, thanPhap: 1, thanThuc: 1, ngoTinh: 1, maxThoNguyen: [2, 5] } },
      // Level index 1 (Tầng 2)
      { qiRequired: 2000, levelName: "Tầng 2", bonuses: { maxHp: [50, 80], maxMana: [20, 35], attackPower: [2, 4], defensePower: 1, canCot: 1, maxThoNguyen: [2, 5] } },
      // ... thêm các tầng khác của Luyện Khí
      { qiRequired: 3000, levelName: "Tầng 3", bonuses: { maxHp: [50, 80], maxMana: [20, 35], attackPower: [2, 4], defensePower: 1, thanPhap: 1, maxThoNguyen: [2, 5] } },
      { qiRequired: 4000, levelName: "Tầng 4", bonuses: { maxHp: [60, 90], maxMana: [25, 40], attackPower: [3, 5], defensePower: 2, thanThuc: 1, maxThoNguyen: [2, 5] } },
      { qiRequired: 5000, levelName: "Tầng 5", bonuses: { maxHp: [60, 90], maxMana: [25, 40], attackPower: [3, 5], defensePower: 2, ngoTinh: 1, maxThoNguyen: [2, 5] } },
      { qiRequired: 6000, levelName: "Tầng 6", bonuses: { maxHp: [70, 100], maxMana: [30, 45], attackPower: [3, 6], defensePower: 2, canCot: 1, maxThoNguyen: [2, 5] } },
      { qiRequired: 7000, levelName: "Tầng 7", bonuses: { maxHp: [70, 100], maxMana: [30, 45], attackPower: [3, 6], defensePower: 2, thanPhap: 1, maxThoNguyen: [2, 5] } },
      { qiRequired: 8000, levelName: "Tầng 8", bonuses: { maxHp: [80, 120], maxMana: [35, 50], attackPower: [4, 7], defensePower: 3, thanThuc: 1, maxThoNguyen: [2, 5] } },
      { qiRequired: 9000, levelName: "Tầng 9", bonuses: { maxHp: [80, 120], maxMana: [35, 50], attackPower: [4, 7], defensePower: 3, ngoTinh: 1, maxThoNguyen: [2, 5] } },
      { qiRequired: 10000, levelName: "Tầng 10", bonuses: { maxHp: [90, 150], maxMana: [45, 60], attackPower: [5, 8], defensePower: 4, canCot: 2, thanPhap: 2, thanThuc: 2, ngoTinh: 2, maxThoNguyen: [3, 7] } },
      { qiRequired: 11000, levelName: "Tầng 11", bonuses: { maxHp: [100, 160], maxMana: [50, 70], attackPower: [5, 9], defensePower: 4, maxThoNguyen: [3, 7] } },
      { qiRequired: 12000, levelName: "Tầng 12", bonuses: { maxHp: [110, 180], maxMana: [55, 80], attackPower: [5, 10], defensePower: 4, maxThoNguyen: [3, 7] } },
      { qiRequired: 25000, levelName: "Tầng 13 (Đỉnh Phong)", bonuses: { maxHp: [180, 250], maxMana: [90, 120], attackPower: [10, 15], defensePower: 10, canCot: 3, thanPhap: 3, thanThuc: 3, ngoTinh: 3, maxThoNguyen: [10, 20] } },
    ]
  },
  // Cảnh giới 1: Trúc Cơ
  {
    name: "Trúc Cơ",
    levels: [
      { qiRequired: 50000, levelName: "Sơ Kì", bonuses: { maxHp: [800, 1200], maxMana: [400, 600], attackPower: [40, 60], defensePower: [25, 35], canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, maxThoNguyen: [20, 30] } },
      { qiRequired: 75000, levelName: "Trung Kì", bonuses: { maxHp: [1000, 1500], maxMana: [500, 700], attackPower: [50, 70], defensePower: [35, 45], canCot: 5, thanPhap: 5, thanThuc: 5, ngoTinh: 5, maxThoNguyen: [25, 40] } },
      { qiRequired: 100000, levelName: "Hậu Kì", bonuses: { maxHp: [1300, 1800], maxMana: [650, 850], attackPower: [65, 85], defensePower: [45, 55], canCot: 5, thanPhap: 5, thanThuc: 5, ngoTinh: 5, maxThoNguyen: [30, 50] } },
      { qiRequired: 150000, levelName: "Đỉnh Phong", bonuses: { maxHp: [1800, 2500], maxMana: [900, 1200], attackPower: [90, 120], defensePower: [60, 80], canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, maxThoNguyen: [40, 60] } },
    ]
  },
  // Cảnh giới 2: Kết Tinh
  {
    name: "Kết Tinh",
    levels: [
      { qiRequired: 250000, levelName: "Sơ Kì", bonuses: { maxHp: [3500, 4500], maxMana: [1800, 2200], attackPower: [180, 220], defensePower: [130, 170], canCot: 20, thanPhap: 20, thanThuc: 20, ngoTinh: 20, maxThoNguyen: [50, 70] } },
      { qiRequired: 500000, levelName: "Trung Kì", bonuses: { maxHp: [4500, 5500], maxMana: [2300, 2700], attackPower: [230, 270], defensePower: [160, 200], canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, maxThoNguyen: [60, 90] } },
      { qiRequired: 750000, levelName: "Hậu Kì", bonuses: { maxHp: [5500, 6500], maxMana: [2800, 3200], attackPower: [280, 320], defensePower: [200, 240], canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, maxThoNguyen: [70, 100] } },
      { qiRequired: 1000000, levelName: "Đỉnh Phong", bonuses: { maxHp: [7000, 9000], maxMana: [3500, 4500], attackPower: [350, 450], defensePower: [270, 330], canCot: 20, thanPhap: 20, thanThuc: 20, ngoTinh: 20, maxThoNguyen: [80, 120] } },
    ]
  },
  // Cảnh giới 3: Kim Đan
  {
    name: "Kim Đan",
    levels: [
      { qiRequired: 2000000, levelName: "Sơ Kì", bonuses: { maxHp: [13000, 17000], maxMana: [6500, 8500], attackPower: [700, 900], defensePower: [500, 700], canCot: 40, thanPhap: 40, thanThuc: 40, ngoTinh: 40, maxThoNguyen: [100, 150] } },
      { qiRequired: 4000000, levelName: "Trung Kì", bonuses: { maxHp: [16000, 20000], maxMana: [8000, 10000], attackPower: [900, 1100], defensePower: [650, 850], canCot: 20, thanPhap: 20, thanThuc: 20, ngoTinh: 20, maxThoNguyen: [120, 180] } },
      { qiRequired: 7000000, levelName: "Hậu Kì", bonuses: { maxHp: [20000, 24000], maxMana: [10000, 12000], attackPower: [1100, 1300], defensePower: [800, 1000], canCot: 20, thanPhap: 20, thanThuc: 20, ngoTinh: 20, maxThoNguyen: [150, 220] } },
      { qiRequired: 10000000, levelName: "Đỉnh Phong", bonuses: { maxHp: [27000, 33000], maxMana: [13000, 17000], attackPower: [1300, 1700], defensePower: [1000, 1400], canCot: 40, thanPhap: 40, thanThuc: 40, ngoTinh: 40, maxThoNguyen: [200, 300] } },
    ]
  },
  // Cảnh giới 4: Nguyên Anh
  {
    name: "Nguyên Anh",
    levels: [
      { qiRequired: 20000000, levelName: "Sơ Kì", bonuses: { maxHp: [45000, 55000], maxMana: [22000, 28000], attackPower: [2700, 3300], defensePower: [2200, 2800], canCot: 80, thanPhap: 80, thanThuc: 80, ngoTinh: 80, maxThoNguyen: [250, 350] } },
      { qiRequired: 40000000, levelName: "Trung Kì", bonuses: { maxHp: [55000, 65000], maxMana: [27000, 33000], attackPower: [3200, 3800], defensePower: [2700, 3300], canCot: 40, thanPhap: 40, thanThuc: 40, ngoTinh: 40, maxThoNguyen: [300, 400] } },
      { qiRequired: 70000000, levelName: "Hậu Kì", bonuses: { maxHp: [70000, 80000], maxMana: [35000, 40000], attackPower: [3900, 4500], defensePower: [3300, 3900], canCot: 40, thanPhap: 40, thanThuc: 40, ngoTinh: 40, maxThoNguyen: [350, 450] } },
      { qiRequired: 100000000, levelName: "Đỉnh Phong", bonuses: { maxHp: [90000, 110000], maxMana: [45000, 55000], attackPower: [4500, 5500], defensePower: [4000, 5000], canCot: 80, thanPhap: 80, thanThuc: 80, ngoTinh: 80, maxThoNguyen: [400, 500] } },
    ]
  },
  // Cảnh giới 5: Hóa Thần
  {
    name: "Hóa Thần",
    levels: [
      { qiRequired: 200000000, levelName: "Sơ Kì", bonuses: { maxHp: [180000, 220000], maxMana: [90000, 110000], attackPower: [9000, 11000], defensePower: [8000, 10000], canCot: 150, thanPhap: 150, thanThuc: 150, ngoTinh: 150, maxThoNguyen: [500, 700] } },
      { qiRequired: 400000000, levelName: "Trung Kì", bonuses: { maxHp: [230000, 270000], maxMana: [110000, 140000], attackPower: [11000, 13000], defensePower: [10000, 12000], canCot: 75, thanPhap: 75, thanThuc: 75, ngoTinh: 75, maxThoNguyen: [600, 800] } },
      { qiRequired: 700000000, levelName: "Hậu Kì", bonuses: { maxHp: [280000, 320000], maxMana: [130000, 170000], attackPower: [14000, 16000], defensePower: [12000, 14000], canCot: 75, thanPhap: 75, thanThuc: 75, ngoTinh: 75, maxThoNguyen: [700, 900] } },
      { qiRequired: 1000000000, levelName: "Đỉnh Phong", bonuses: { maxHp: [360000, 440000], maxMana: [180000, 220000], attackPower: [18000, 22000], defensePower: [16000, 20000], canCot: 150, thanPhap: 150, thanThuc: 150, ngoTinh: 150, maxThoNguyen: [800, 1200] } },
    ]
  },
  // Thêm các cảnh giới khác ở đây...
];


export const INITIAL_PLAYER_STATE: PlayerState = {
  name: "Đạo Hữu",
  gender: 'Nam',
  cultivation: { realmIndex: 0, level: -1 }, // Bắt đầu từ cấp -1 (Phàm Nhân)
  
  attributes: { // Thuộc tính cơ bản của phàm nhân
      canCot: 10,
      thanPhap: 10,
      thanThuc: 10,
      ngoTinh: 10,
  },
  // Chỉ số của phàm nhân.
  stats: {
    maxHp: 50, maxQi: 0, maxMana: 10, maxThoNguyen: 80, attackPower: 5, defensePower: 2,
    speed: 10, critRate: 0.01, critDamage: 1.5, evasionRate: 0.01,
  },
  cultivationStats: {}, // Chỉ số gốc từ tu luyện sẽ được lưu ở đây
  linhCan: [],
  activeEffects: [],
  
  learnedSkills: [
    // Bỏ kỹ năng mặc định, người chơi sẽ tự học
  ],
  learnedRecipes: [],
  inventory: [
    { itemId: 'weapon_thiet_kiem', quantity: 1 },
    { itemId: 'armor_da_giap', quantity: 1 },
    { itemId: 'consumable_truyen_tong_phu', quantity: 5},
    { itemId: 'tool_dan_lo_mini', quantity: 1 },
  ],
  equipment: {},

  hp: 50,
  qi: 0,
  mana: 10,
  camNgo: 0,
  linhThach: 100,
  
  currentMap: 'LUC_YEN_THON',
  position: { x: 1000, y: 700 },
  targetPosition: { x: 1000, y: 700 },
  generatedNpcs: {},
  defeatedNpcIds: [],
  time: { year: 1, season: 'Xuân', month: 1, day: 1, hour: 8, minute: 0 },

  useRandomNames: false,
  nameOverrides: {},
};

export const INTERACTION_RADIUS = 60; // pixels
export const PLAYER_SPEED = 4; // pixels per frame
export const INVENTORY_SIZE = 30; // Number of slots in inventory

// Time Constants
export const DAYS_PER_MONTH = 30;
export const MONTHS_PER_YEAR = 12;
export const MOVEMENT_PIXELS_PER_MINUTE = 10; // Every 10 pixels of movement costs 1 minute.