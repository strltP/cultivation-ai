

import type { PlayerState } from './types/character';
import type { CharacterAttributes, CombatStats } from './types/stats';

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
      { qiRequired: 500, levelName: "Tầng 1", bonuses: { maxHp: [40, 70], maxMana: [15, 30], attackPower: [1, 3], defensePower: 1, canCot: 1, thanPhap: 1, thanThuc: 1, ngoTinh: 1, coDuyen: 1, tamCanh: 1, maxThoNguyen: [2, 3] } },
      // Level index 1 (Tầng 2)
      { qiRequired: 800, levelName: "Tầng 2", bonuses: { maxHp: [50, 80], maxMana: [20, 35], attackPower: [2, 4], defensePower: 1, canCot: 1, tamCanh: 1, maxThoNguyen: [2, 3] } },
      // ... thêm các tầng khác của Luyện Khí
      { qiRequired: 1200, levelName: "Tầng 3", bonuses: { maxHp: [50, 80], maxMana: [20, 35], attackPower: [2, 4], defensePower: 1, thanPhap: 1, maxThoNguyen: [2, 3] } },
      { qiRequired: 1800, levelName: "Tầng 4", bonuses: { maxHp: [60, 90], maxMana: [25, 40], attackPower: [3, 5], defensePower: 2, thanThuc: 1, maxThoNguyen: [2, 3] } },
      { qiRequired: 2500, levelName: "Tầng 5", bonuses: { maxHp: [60, 90], maxMana: [25, 40], attackPower: [3, 5], defensePower: 2, ngoTinh: 1, coDuyen: 1, maxThoNguyen: [2, 3] } },
      { qiRequired: 3200, levelName: "Tầng 6", bonuses: { maxHp: [70, 100], maxMana: [30, 45], attackPower: [3, 6], defensePower: 2, canCot: 1, tamCanh: 1, maxThoNguyen: [2, 3] } },
      { qiRequired: 4000, levelName: "Tầng 7", bonuses: { maxHp: [70, 100], maxMana: [30, 45], attackPower: [3, 6], defensePower: 2, thanPhap: 1, maxThoNguyen: [2, 3] } },
      { qiRequired: 4600, levelName: "Tầng 8", bonuses: { maxHp: [80, 120], maxMana: [35, 50], attackPower: [4, 7], defensePower: 3, thanThuc: 1, maxThoNguyen: [2, 3] } },
      { qiRequired: 5200, levelName: "Tầng 9", bonuses: { maxHp: [80, 120], maxMana: [35, 50], attackPower: [4, 7], defensePower: 3, ngoTinh: 1, coDuyen: 1, maxThoNguyen: [2, 3] } },
      { qiRequired: 6000, levelName: "Tầng 10", bonuses: { maxHp: [90, 150], maxMana: [45, 60], attackPower: [5, 8], defensePower: 4, canCot: 2, thanPhap: 2, thanThuc: 2, ngoTinh: 2, coDuyen: 2, tamCanh: 2, maxThoNguyen: [3, 4] } },
      { qiRequired: 7200, levelName: "Tầng 11", bonuses: { maxHp: [100, 160], maxMana: [50, 70], attackPower: [5, 9], defensePower: 4, coDuyen: 1, maxThoNguyen: [3, 4] } },
      { qiRequired: 8600, levelName: "Tầng 12", bonuses: { maxHp: [110, 180], maxMana: [55, 80], attackPower: [5, 10], defensePower: 4, tamCanh: 1, maxThoNguyen: [3, 4] } },
      { qiRequired: 10500, levelName: "Tầng 13", bonuses: { maxHp: [180, 250], maxMana: [90, 120], attackPower: [10, 15], defensePower: [8, 12], canCot: 3, thanPhap: 3, thanThuc: 3, ngoTinh: 3, coDuyen: 3, tamCanh: 3, maxThoNguyen: [6, 8] } },
    ]
  },
  // Cảnh giới 1: Trúc Cơ
  {
    name: "Trúc Cơ",
    levels: [
      { qiRequired: 20000, levelName: "Sơ Kì", bonuses: { maxHp: [800, 1200], maxMana: [400, 600], attackPower: [40, 60], defensePower: [25, 35], canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 5, tamCanh: 5, maxThoNguyen: [25, 30] } },
      { qiRequired: 32000, levelName: "Trung Kì", bonuses: { maxHp: [1000, 1500], maxMana: [500, 700], attackPower: [50, 70], defensePower: [35, 45], canCot: 5, thanPhap: 5, thanThuc: 5, ngoTinh: 5, coDuyen: 5, tamCanh: 5, maxThoNguyen: [30, 35] } },
      { qiRequired: 72000, levelName: "Hậu Kì", bonuses: { maxHp: [1300, 1800], maxMana: [650, 850], attackPower: [65, 85], defensePower: [45, 55], canCot: 5, thanPhap: 5, thanThuc: 5, ngoTinh: 5, coDuyen: 5, tamCanh: 5, maxThoNguyen: [30, 40] } },
      { qiRequired: 100000, levelName: "Đỉnh Phong", bonuses: { maxHp: [1800, 2500], maxMana: [900, 1200], attackPower: [90, 120], defensePower: [60, 80], canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 10, tamCanh: 10, maxThoNguyen: [30, 40] } },
    ]
  },
  // Cảnh giới 2: Kết Tinh
  {
    name: "Kết Tinh",
    levels: [
      { qiRequired: 140000, levelName: "Sơ Kì", bonuses: { maxHp: [3500, 4500], maxMana: [1800, 2200], attackPower: [180, 220], defensePower: [130, 170], canCot: 20, thanPhap: 20, thanThuc: 20, ngoTinh: 20, coDuyen: 10, tamCanh: 10, maxThoNguyen: [20, 30] } },
      { qiRequired: 180000, levelName: "Trung Kì", bonuses: { maxHp: [4500, 5500], maxMana: [2300, 2700], attackPower: [230, 270], defensePower: [160, 200], canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 10, tamCanh: 10, maxThoNguyen: [25, 30] } },
      { qiRequired: 320000, levelName: "Hậu Kì", bonuses: { maxHp: [5500, 6500], maxMana: [2800, 3200], attackPower: [280, 320], defensePower: [200, 240], canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 10, tamCanh: 10, maxThoNguyen: [25, 35] } },
      { qiRequired: 400000, levelName: "Đỉnh Phong", bonuses: { maxHp: [7000, 9000], maxMana: [3500, 4500], attackPower: [350, 450], defensePower: [270, 330], canCot: 20, thanPhap: 20, thanThuc: 20, ngoTinh: 20, coDuyen: 20, tamCanh: 20, maxThoNguyen: [25, 30] } },
    ]
  },
  // Cảnh giới 3: Kim Đan
  {
    name: "Kim Đan",
    levels: [
      { qiRequired: 550000, levelName: "Sơ Kì", bonuses: { maxHp: [13000, 17000], maxMana: [6500, 8500], attackPower: [700, 900], defensePower: [500, 700], canCot: 40, thanPhap: 40, thanThuc: 40, ngoTinh: 40, coDuyen: 20, tamCanh: 20, maxThoNguyen: [50, 60] } },
      { qiRequired: 680000, levelName: "Trung Kì", bonuses: { maxHp: [16000, 20000], maxMana: [8000, 10000], attackPower: [900, 1100], defensePower: [650, 850], canCot: 20, thanPhap: 20, thanThuc: 20, ngoTinh: 20, coDuyen: 20, tamCanh: 20, maxThoNguyen: [55, 65] } },
      { qiRequired: 800000, levelName: "Hậu Kì", bonuses: { maxHp: [20000, 24000], maxMana: [10000, 12000], attackPower: [1100, 1300], defensePower: [800, 1000], canCot: 20, thanPhap: 20, thanThuc: 20, ngoTinh: 20, coDuyen: 20, tamCanh: 20, maxThoNguyen: [60, 70] } },
      { qiRequired: 940000, levelName: "Đỉnh Phong", bonuses: { maxHp: [27000, 33000], maxMana: [13000, 17000], attackPower: [1300, 1700], defensePower: [1000, 1400], canCot: 40, thanPhap: 40, thanThuc: 40, ngoTinh: 40, coDuyen: 40, tamCanh: 40, maxThoNguyen: [55, 65] } },
    ]
  },
  // Cảnh giới 4: Nguyên Anh
  {
    name: "Nguyên Anh",
    levels: [
      { qiRequired: 1200000, levelName: "Sơ Kì", bonuses: { maxHp: [45000, 55000], maxMana: [22000, 28000], attackPower: [2700, 3300], defensePower: [2200, 2800], canCot: 80, thanPhap: 80, thanThuc: 80, ngoTinh: 80, coDuyen: 40, tamCanh: 40, maxThoNguyen: [120, 160] } },
      { qiRequired: 1600000, levelName: "Trung Kì", bonuses: { maxHp: [55000, 65000], maxMana: [27000, 33000], attackPower: [3200, 3800], defensePower: [2700, 3300], canCot: 40, thanPhap: 40, thanThuc: 40, ngoTinh: 40, coDuyen: 40, tamCanh: 40, maxThoNguyen: [140, 160] } },
      { qiRequired: 2200000, levelName: "Hậu Kì", bonuses: { maxHp: [70000, 80000], maxMana: [35000, 40000], attackPower: [3900, 4500], defensePower: [3300, 3900], canCot: 40, thanPhap: 40, thanThuc: 40, ngoTinh: 40, coDuyen: 40, tamCanh: 40, maxThoNguyen: [150, 170] } },
      { qiRequired: 3800000, levelName: "Đỉnh Phong", bonuses: { maxHp: [90000, 110000], maxMana: [45000, 55000], attackPower: [4500, 5500], defensePower: [4000, 5000], canCot: 80, thanPhap: 80, thanThuc: 80, ngoTinh: 80, coDuyen: 80, tamCanh: 80, maxThoNguyen: [140, 160] } },
    ]
  },
  // Cảnh giới 5: Hóa Thần
  {
    name: "Hóa Thần",
    levels: [
      { qiRequired: 4500000, levelName: "Sơ Kì", bonuses: { maxHp: [180000, 220000], maxMana: [90000, 110000], attackPower: [9000, 11000], defensePower: [8000, 10000], canCot: 150, thanPhap: 150, thanThuc: 150, ngoTinh: 150, coDuyen: 80, tamCanh: 80, maxThoNguyen: [300, 320] } },
      { qiRequired: 6000000, levelName: "Trung Kì", bonuses: { maxHp: [230000, 270000], maxMana: [110000, 140000], attackPower: [11000, 13000], defensePower: [10000, 12000], canCot: 75, thanPhap: 75, thanThuc: 75, ngoTinh: 75, coDuyen: 75, tamCanh: 75, maxThoNguyen: [310, 330] } },
      { qiRequired: 8000000, levelName: "Hậu Kì", bonuses: { maxHp: [280000, 320000], maxMana: [130000, 170000], attackPower: [14000, 16000], defensePower: [12000, 14000], canCot: 75, thanPhap: 75, thanThuc: 75, ngoTinh: 75, coDuyen: 75, tamCanh: 75, maxThoNguyen: [320, 340] } },
      { qiRequired: 15000000, levelName: "Đỉnh Phong", bonuses: { maxHp: [360000, 440000], maxMana: [180000, 220000], attackPower: [18000, 22000], defensePower: [16000, 20000], canCot: 150, thanPhap: 150, thanThuc: 150, ngoTinh: 150, coDuyen: 150, tamCanh: 150, maxThoNguyen: [330, 350] } },
    ]
  },
  // Thêm các cảnh giới khác ở đây...
];

export const INITIAL_PLAYER_STATE: Omit<PlayerState, 'saveVersion'> = {
  name: "Đạo Hữu",
  gender: 'Nam',
  cultivation: { realmIndex: 0, level: -1 }, // Bắt đầu từ cấp -1 (Phàm Nhân)
  
  attributes: { // Thuộc tính cơ bản của phàm nhân
      canCot: 10,
      thanPhap: 10,
      thanThuc: 10,
      ngoTinh: 10,
      coDuyen: 10,
      tamCanh: 10,
  },
  // Chỉ số của phàm nhân.
  stats: {
    maxHp: 50, maxQi: 0, maxMana: 10, maxThoNguyen: 80, attackPower: 5, defensePower: 2,
    speed: 10, critRate: 0.01, critDamage: 1.5, armorPenetration: 0.0,
    kimDamageBonus: 0, mocDamageBonus: 0, thuyDamageBonus: 0, hoaDamageBonus: 0, thoDamageBonus: 0,
    phongDamageBonus: 0, loiDamageBonus: 0, bangDamageBonus: 0, quangDamageBonus: 0, amDamageBonus: 0,
  },
  cultivationStats: {}, // Chỉ số gốc từ tu luyện sẽ được lưu ở đây
  linhCan: [],
  activeEffects: [],
  affinity: {},
  
  learnedSkills: [
    // Bỏ kỹ năng mặc định, người chơi sẽ tự học
  ],
  learnedRecipes: [],
  inventory: [
    { itemId: 'weapon_thiet_kiem', quantity: 1 },
    { itemId: 'armor_da_giap', quantity: 1 },
    { itemId: 'consumable_truyen_tong_phu', quantity: 50},
    { itemId: 'consumable_phuong_hoang_niet_ban_hoa', quantity: 10},
    { itemId: 'consumable_cuu_u_huyen_thuy_tinh', quantity: 10},
    { itemId: 'consumable_bat_tu_than_moc_diep', quantity: 10},
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
  generatedInteractables: {},
  defeatedNpcIds: [],
  harvestedInteractableIds: [],
  journal: [],
  time: { year: 1, season: 'Xuân', month: 1, day: 1, hour: 8, minute: 0 },
  plantedPlots: [],
  respawningInteractables: [],
  initializedMaps: [],
};

export const INTERACTION_RADIUS = 60; // pixels
export const PLAYER_SPEED = 4; // pixels per frame
export const INVENTORY_SIZE = 30; // Number of slots in inventory

// Time Constants
export const DAYS_PER_MONTH = 30;
export const MONTHS_PER_YEAR = 12;
export const MOVEMENT_PIXELS_PER_MINUTE = 10; // Every 10 pixels of movement costs 1 minute.