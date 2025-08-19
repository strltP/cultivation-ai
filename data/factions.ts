import type { SkillTier } from '../types/skill';

// Định nghĩa cấu trúc cho ranh giới cảnh giới
export interface RealmBoundary {
    realmIndex: number;
    level: number;
}

// Cấu trúc mới, chi tiết hơn cho một vai trò trong phe phái
export interface FactionRole {
  name: string;
  power: number;
  
  // Các trường dữ liệu có cấu trúc để hướng dẫn AI
  rangeRealm: { 
      min: RealmBoundary;
      max: RealmBoundary;
  };
  ageRange: [number, number]; // [tuổi tối thiểu, tuổi tối đa]
  titleChance: number; // Tỉ lệ 0-1 để có danh hiệu
  titleThemes: string[]; // Gợi ý chủ đề cho danh hiệu
  personalityTags: string[]; // Gợi ý từ khóa về tính cách
  equipmentTierRange: [SkillTier, SkillTier]; // [phẩm chất tối thiểu, phẩm chất tối đa]

  // Hành vi trong game
  fixedPositionChance?: number; // 0-1, cơ hội ở yên một chỗ lâu sau khi hành động
}

export interface Faction {
  id: string;
  name: string;
  roles: FactionRole[];
}

export const FACTIONS: Faction[] = [
  {
    id: "THANH_VAN_MON",
    name: "Thanh Vân Môn",
    roles: [
      { 
        name: "Thái thượng trưởng lão", 
        power: 100, 
        rangeRealm: { min: { realmIndex: 4, level: 3 }, max: { realmIndex: 5, level: 1 } }, // Nguyên Anh Đỉnh Phong -> Hóa Thần Sơ Kì
        ageRange: [800, 1500],
        titleChance: 0.9,
        titleThemes: ['cổ xưa', 'ẩn thế', 'huyền bí', 'tổ sư'],
        personalityTags: ['thâm sâu khó lường', 'ít nói', 'uy nghiêm', 'cổ quái'],
        equipmentTierRange: ['DIA', 'THIEN'],
        fixedPositionChance: 0.9 
      },
      { 
        name: "Môn chủ", 
        power: 90, 
        rangeRealm: { min: { realmIndex: 4, level: 2 }, max: { realmIndex: 4, level: 3 } }, // Nguyên Anh Hậu Kì -> Đỉnh Phong
        ageRange: [350, 900],
        titleChance: 0.8,
        titleThemes: ['uy nghiêm', 'chưởng quản', 'tông môn', 'kiếm'],
        personalityTags: ['uy nghiêm', 'quyết đoán', 'trách nhiệm', 'lo cho tông môn'],
        equipmentTierRange: ['DIA', 'THIEN'],
        fixedPositionChance: 0.8 
      },
      { 
        name: "Phó môn chủ", 
        power: 80, 
        rangeRealm: { min: { realmIndex: 4, level: 0 }, max: { realmIndex: 4, level: 1 } }, // Nguyên Anh Sơ Kì -> Trung Kì
        ageRange: [300, 800],
        titleChance: 0.7,
        titleThemes: ['phụ tá', 'quản lý', 'trí tuệ'],
        personalityTags: ['cẩn thận', 'tỉ mỉ', 'trung thành', 'thông minh'],
        equipmentTierRange: ['DIA', 'DIA'],
        fixedPositionChance: 0.7 
      },
      { 
        name: "Trưởng lão", 
        power: 70, 
        rangeRealm: { min: { realmIndex: 3, level: 3 }, max: { realmIndex: 4, level: 0 } }, // Kim Đan Đỉnh Phong -> Nguyên Anh Sơ Kì
        ageRange: [250, 700],
        titleChance: 0.6,
        titleThemes: ['chấp sự', 'thủ các', 'truyền công', 'luyện đan', 'luyện khí'],
        personalityTags: ['nghiêm khắc', 'công chính', 'nóng nảy', 'hiền từ'],
        equipmentTierRange: ['HUYEN', 'DIA'],
        fixedPositionChance: 0.6 
      },
      { 
        name: "Chân truyền đệ tử", 
        power: 50, 
        rangeRealm: { min: { realmIndex: 1, level: 3 }, max: { realmIndex: 2, level: 3 } }, // Trúc Cơ Đỉnh Phong -> Kết Tinh Đỉnh Phong
        ageRange: [30, 120], // Có thể là thiên tài trẻ tuổi
        titleChance: 0.15,
        titleThemes: ['thiên tài', 'kiếm', 'tinh anh', 'hạt giống'],
        personalityTags: ['thiên phú cao', 'kiêu ngạo', 'chăm chỉ', 'lạnh lùng'],
        equipmentTierRange: ['HUYEN', 'HUYEN'],
      },
      { 
        name: "Nội môn đệ tử", 
        power: 30, 
        rangeRealm: { min: { realmIndex: 1, level: 0 }, max: { realmIndex: 1, level: 3 } }, // Trúc Cơ
        ageRange: [25, 80],
        titleChance: 0,
        titleThemes: [],
        personalityTags: ['nòng cốt', 'chăm chỉ', 'ghen tị', 'thân thiện'],
        equipmentTierRange: ['HOANG', 'HUYEN'],
      },
      { 
        name: "Ngoại môn đệ tử", 
        power: 10, 
        rangeRealm: { min: { realmIndex: 0, level: 6 }, max: { realmIndex: 0, level: 12 } }, // Luyện Khí Kỳ (tầng 7-13)
        ageRange: [16, 40],
        titleChance: 0,
        titleThemes: [],
        personalityTags: ['mới nhập môn', 'tạp vụ', 'hiếu kỳ', 'sợ sệt'],
        equipmentTierRange: ['HOANG', 'HOANG'],
      },
    ]
  },
  {
    id: "LUC_YEN_THON",
    name: "Lục Yên Thôn",
    roles: [
      { 
        name: "Trưởng thôn", 
        power: 100, 
        rangeRealm: { min: { realmIndex: 3, level: 0 }, max: { realmIndex: 4, level: 0 } }, // Kim Đan -> Nguyên Anh
        ageRange: [150, 600],
        titleChance: 0.1,
        titleThemes: ['ẩn dật', 'lão nông'],
        personalityTags: ['hiền từ', 'bí ẩn', 'thâm tàng bất lộ'],
        equipmentTierRange: ['HOANG', 'HUYEN'],
        fixedPositionChance: 0.95 
      },
      { 
        name: "Nguyên anh ẩn tu", 
        power: 100, 
        rangeRealm: { min: { realmIndex: 4, level: 0 }, max: { realmIndex: 4, level: 3 } }, // Nguyên Anh
        ageRange: [200, 800],
        titleChance: 0.5,
        titleThemes: ['ẩn tu', 'tiền bối', 'quy ẩn'],
        personalityTags: ['khó đoán', 'thích yên tĩnh', 'coi thường thế sự'],
        equipmentTierRange: ['HUYEN', 'DIA'],
        fixedPositionChance: 0.9 
      },
      { 
        name: "Lão bản", 
        power: 40, 
        rangeRealm: { min: { realmIndex: 1, level: 0 }, max: { realmIndex: 2, level: 3 } }, // Trúc Cơ -> Kết Tinh
        ageRange: [60, 200],
        titleChance: 0,
        titleThemes: [],
        personalityTags: ['thông thạo', 'tin tức', 'kinh doanh', 'khôn khéo'],
        equipmentTierRange: ['HOANG', 'HUYEN'],
        fixedPositionChance: 0.9 
      },
      { 
        name: "Thợ săn", 
        power: 20, 
        rangeRealm: { min: { realmIndex: 0, level: 3 }, max: { realmIndex: 0, level: 9 } }, // Luyện Khí (tầng 4-10)
        ageRange: [20, 60],
        titleChance: 0,
        titleThemes: [],
        personalityTags: ['dũng cảm', 'am hiểu núi rừng', 'trầm mặc'],
        equipmentTierRange: ['HOANG', 'HOANG'],
      },
      { 
        name: "Nông dân", 
        power: 5, 
        rangeRealm: { min: { realmIndex: 0, level: 0 }, max: { realmIndex: 0, level: 2 } }, // Luyện Khí (tầng 1-3)
        ageRange: [18, 90], // có thể là người già tư chất kém
        titleChance: 0,
        titleThemes: [],
        personalityTags: ['hiền lành', 'chất phác', 'chăm chỉ'],
        equipmentTierRange: ['HOANG', 'HOANG'],
      },
    ]
  },
   {
    id: "THAT_HUYEN_THANH",
    name: "Thất Huyền Thành",
    roles: [
      { 
        name: "Thành chủ", 
        power: 100, 
        rangeRealm: { min: { realmIndex: 4, level: 1 }, max: { realmIndex: 5, level: 0 } }, // Nguyên Anh Trung Kì -> Hóa Thần Sơ Kì
        ageRange: [400, 1200],
        titleChance: 0.8,
        titleThemes: ['thành chủ', 'cai quản', 'uy dũng'],
        personalityTags: ['uy nghiêm', 'quyền lực', 'công tư phân minh'],
        equipmentTierRange: ['DIA', 'THIEN'],
        fixedPositionChance: 0.85 
      },
      { 
        name: "Trưởng lão khách khanh", 
        power: 85, 
        rangeRealm: { min: { realmIndex: 4, level: 0 }, max: { realmIndex: 4, level: 2 } }, // Nguyên Anh Sơ -> Hậu Kì
        ageRange: [300, 1000],
        titleChance: 0.6,
        titleThemes: ['khách khanh', 'tự do', 'cường đại'],
        personalityTags: ['tự do', 'không thích ràng buộc', 'mạnh mẽ'],
        equipmentTierRange: ['DIA', 'DIA'],
        fixedPositionChance: 0.7 
      },
      { 
        name: "Thống lĩnh vệ binh", 
        power: 75, 
        rangeRealm: { min: { realmIndex: 3, level: 1 }, max: { realmIndex: 3, level: 3 } }, // Kim Đan Trung -> Đỉnh Phong
        ageRange: [150, 400],
        titleChance: 0.2,
        titleThemes: ['thống lĩnh', 'thiết huyết', 'sát phạt'],
        personalityTags: ['kỷ luật', 'nghiêm khắc', 'trung thành'],
        equipmentTierRange: ['HUYEN', 'DIA'],
        fixedPositionChance: 0.5 
      },
      { 
        name: "Chủ tiệm lớn", 
        power: 60, 
        rangeRealm: { min: { realmIndex: 2, level: 3 }, max: { realmIndex: 3, level: 2 } }, // Kết Tinh Đỉnh Phong -> Kim Đan Hậu Kì
        ageRange: [120, 500],
        titleChance: 0.1,
        titleThemes: ['thương nhân', 'giàu có', 'bảo vật'],
        personalityTags: ['tinh ranh', 'giỏi kinh doanh', 'khôn khéo'],
        equipmentTierRange: ['HUYEN', 'DIA'],
        fixedPositionChance: 0.9 
      },
      { 
        name: "Chủ tiệm nhỏ", 
        power: 40, 
        rangeRealm: { min: { realmIndex: 0, level: 9 }, max: { realmIndex: 1, level: 3 } }, // Luyện Khí Tầng 10 -> Trúc Cơ Đỉnh Phong
        ageRange: [40, 150],
        titleChance: 0,
        titleThemes: [],
        personalityTags: ['hòa đồng', 'buôn bán nhỏ', 'hiền lành'],
        equipmentTierRange: ['HOANG', 'HUYEN'],
        fixedPositionChance: 0.85 
      },
      { 
        name: "Tiểu nhị", 
        power: 8, 
        rangeRealm: { min: { realmIndex: 0, level: 1 }, max: { realmIndex: 0, level: 5 } }, // Luyện Khí Tầng 2-6
        ageRange: [16, 50],
        titleChance: 0,
        titleThemes: [],
        personalityTags: ['lanh lợi', 'nhanh nhẹn', 'khéo mồm'],
        equipmentTierRange: ['HOANG', 'HOANG'],
      },
      { 
        name: "Vệ binh", 
        power: 25, 
        rangeRealm: { min: { realmIndex: 1, level: 0 }, max: { realmIndex: 1, level: 1 } }, // Trúc Cơ Sơ -> Trung Kì
        ageRange: [25, 80],
        titleChance: 0,
        titleThemes: [],
        personalityTags: ['nghiêm túc', 'tuần tra', 'cảnh giác'],
        equipmentTierRange: ['HOANG', 'HUYEN'],
      },
      { 
        name: "Tán tu", 
        power: 15, 
        rangeRealm: { min: { realmIndex: 0, level: 6 }, max: { realmIndex: 2, level: 0 } }, // Luyện Khí Tầng 7 -> Kết Tinh Sơ Kì
        ageRange: [20, 300], // Rất đa dạng
        titleChance: 0.05,
        titleThemes: ['lãng du', 'cô độc', 'ẩn dật'],
        personalityTags: ['tự do', 'thích phiêu lưu', 'cảnh giác'],
        equipmentTierRange: ['HOANG', 'HUYEN'],
      },
      { 
        name: "Thường dân", 
        power: 5, 
        rangeRealm: { min: { realmIndex: 0, level: 0 }, max: { realmIndex: 0, level: 3 } }, // Luyện Khí Tầng 1-4
        ageRange: [16, 100],
        titleChance: 0,
        titleThemes: [],
        personalityTags: ['bình thường', 'hiền lành', 'sợ sệt'],
        equipmentTierRange: ['HOANG', 'HOANG'],
      },
    ]
  }
];