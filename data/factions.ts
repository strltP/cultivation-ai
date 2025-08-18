export interface FactionRole {
  name: string;
  power: number;
  generationHint: string; // Hint for AI on what this role entails
  fixedPositionChance?: number; // 0-1, chance to stay idle for a long time after an action
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
      { name: "Thái thượng trưởng lão", power: 100, generationHint: "Nhân vật có tu vi cao nhất tông môn, có thể là Hóa Thần hoặc Nguyên Anh Đỉnh Phong. Rất hiếm khi xuất hiện, tính cách thâm sâu khó lường.", fixedPositionChance: 0.9 },
      { name: "Môn chủ", power: 90, generationHint: "Người đứng đầu tông môn, tu vi Nguyên Anh Hậu Kì hoặc Đỉnh Phong. Tính cách uy nghiêm, quyết đoán.", fixedPositionChance: 0.8 },
      { name: "Phó môn chủ", power: 80, generationHint: "Phụ tá cho Môn Chủ, tu vi Nguyên Anh Sơ Kì hoặc Trung Kì. Thường quản lý các sự vụ quan trọng.", fixedPositionChance: 0.7 },
      { name: "Trưởng lão", power: 70, generationHint: "Các trưởng lão có địa vị cao, tu vi Kim Đan Đỉnh Phong hoặc Nguyên Anh Sơ Kì. Có thể là Chấp Sự Trưởng Lão, Thủ Các Trưởng Lão, v.v.", fixedPositionChance: 0.6 },
      { name: "Chân truyền đệ tử", power: 50, generationHint: "Đệ tử hạt giống của tông môn, thiên phú cực cao, tu vi Trúc Cơ Đỉnh Phong hoặc Kết Tinh." },
      { name: "Nội môn đệ tử", power: 30, generationHint: "Đệ tử chính thức, tu vi Trúc Cơ. Là lực lượng nòng cốt." },
      { name: "Ngoại môn đệ tử", power: 10, generationHint: "Đệ tử mới nhập môn, tu vi Luyện Khí Kỳ. Thường làm các công việc tạp vụ." },
    ]
  },
  {
    id: "LUC_YEN_THON",
    name: "Lục Yên Thôn",
    roles: [
      { name: "Trưởng thôn", power: 100, generationHint: "Người đứng đầu thôn, bề ngoài là một lão nông hiền từ nhưng thực chất có thể là một đại năng đã về ở ẩn, tu vi không thể nhìn thấu (Kim Đan trở lên).", fixedPositionChance: 0.95 },
      { name: "Nguyên anh ẩn tu", power: 100, generationHint: "Một tu sĩ Nguyên Anh Kỳ chọn Lục Yên Thôn làm nơi quy ẩn. Bề ngoài có thể là một người bình thường (thợ săn, tiều phu, lão bản...). Rất hiếm gặp.", fixedPositionChance: 0.9 },
      { name: "Lão bản", power: 40, generationHint: "Chủ một tiệm tạp hóa hoặc tửu lầu. Am hiểu sự đời, tin tức linh thông, tu vi thường là Trúc Cơ hoặc Kết Tinh.", fixedPositionChance: 0.9 },
      { name: "Thợ săn", power: 20, generationHint: "Người phàm hoặc tu sĩ Luyện Khí cấp thấp, am hiểu núi rừng xung quanh. Trang bị đơn giản." },
      { name: "Nông dân", power: 5, generationHint: "Phàm nhân hiền lành, chất phác, quanh năm bán mặt cho đất bán lưng cho trời." },
    ]
  },
   {
    id: "THAT_HUYEN_THANH",
    name: "Thất Huyền Thành",
    roles: [
      { name: "Thành chủ", power: 100, generationHint: "Người cai quản thành, tu vi cao thâm, ít nhất là Nguyên Anh.", fixedPositionChance: 0.85 },
      { name: "Trưởng lão khách khanh", power: 85, generationHint: "Trưởng lão được mời về, không trực tiếp quản lý nhưng có địa vị cao.", fixedPositionChance: 0.7 },
      { name: "Thống lĩnh vệ binh", power: 75, generationHint: "Người chỉ huy vệ binh của thành, tu vi Kim Đan.", fixedPositionChance: 0.5 },
      { name: "Chủ tiệm lớn", power: 60, generationHint: "Chủ các cửa hàng lớn như Vạn Bảo Lâu, Luyện Đan Các. Tu vi Kết Tinh hoặc Kim Đan, giàu có.", fixedPositionChance: 0.9 },
      { name: "Chủ tiệm nhỏ", power: 40, generationHint: "Chủ các tiệm rèn, tửu lầu... Tu vi Luyện Khí hoặc Trúc Cơ.", fixedPositionChance: 0.85 },
      { name: "Tiểu nhị", power: 8, generationHint: "Nhân viên phục vụ trong các tửu lầu, nhà trọ. Tu vi Luyện Khí thấp." },
      { name: "Vệ binh", power: 25, generationHint: "Lính gác của thành, tu vi Trúc Cơ." },
      { name: "Tán tu", power: 15, generationHint: "Tu sĩ tự do sống trong thành, tu vi Luyện Khí hoặc Trúc Cơ." },
      { name: "Thường dân", power: 5, generationHint: "Người dân bình thường, không có tu vi." },
    ]
  }
];