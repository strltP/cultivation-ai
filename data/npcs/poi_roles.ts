// This file defines the social structure for specific Points of Interest (POIs).
// Instead of generating a random number of generic NPCs, this allows us to
// create a structured population with specific roles and quantities.

interface RoleDefinition {
    role: string;
    count: number;
    // A specific prompt for the AI to generate this role.
    generationPrompt: string;
}

export const POI_ROLE_DEFINITIONS: Record<string, RoleDefinition[]> = {
    // --- Lục Yên Thôn (spawns inside LUC_YEN_THON map) ---
    'lyt-poi-2': [ // Tiệm Tạp Hóa
        {
            role: 'Tạp Hóa Lão Bản',
            count: 1,
            generationPrompt: `Tạo ra một vị Lão Bản trông coi tiệm tạp hóa duy nhất trong Lục Yên Thôn. Ông là một tu sĩ Luyện Khí Kỳ đã về già, bán một số vật phẩm cơ bản cho tu sĩ và dân làng.`
        },
    ],
    'lyt-poi-3': [ // Nhà Dân
        {
            role: 'Thợ Săn',
            count: 2,
            generationPrompt: `Tạo ra một Thợ Săn sống tại Lục Yên Thôn. Họ là những người phàm hoặc tu sĩ Luyện Khí cấp thấp, am hiểu về núi rừng xung quanh. Trang bị của họ đơn giản, thường là cung hoặc dao găm, và họ có thể bán một số da thú hoặc thảo dược cơ bản.`
        },
        {
            role: 'Nông Dân',
            count: 3,
            generationPrompt: `Tạo ra một Nông Dân hiền lành, chất phác của Lục Yên Thôn. Họ là phàm nhân, quanh năm bán mặt cho đất bán lưng cho trời. Họ không biết tu luyện nhưng có thể kể vài câu chuyện về thôn làng.`
        },
    ],

    // --- Thanh Vân Môn ---
    // This applies to NPCs generated on the THANH_VAN_MON map
    'tvm-poi-1': [ // Chính Điện
        { 
            role: 'Môn Chủ', 
            count: 1, 
            generationPrompt: `Tạo ra Môn Chủ của Thanh Vân Môn. Đây là một đại năng uy nghiêm, cảnh giới Kim Đan Hậu Kì hoặc Đỉnh Phong. Ngài mặc đạo bào lộng lẫy, khí chất phi phàm. Prompt của ngài phải thể hiện quyền uy và sự uyên bác của một người đứng đầu tông môn.` 
        },
        { 
            role: 'Phó Môn Chủ', 
            count: 2, 
            generationPrompt: `Tạo ra một Phó Môn Chủ của Thanh Vân Môn, đang ở Chính Điện. Họ là tu sĩ Kim Đan Sơ Kì hoặc Trung Kì, phụ trách các công việc quan trọng của tông môn. Tính cách có thể nghiêm nghị hoặc ôn hòa.` 
        },
         { 
            role: 'Chấp Sự Trưởng Lão', 
            count: 3, 
            generationPrompt: `Tạo ra một vị Trưởng Lão Chấp Sự của Thanh Vân Môn, đang có mặt tại Chính Điện. Họ là tu sĩ Kết Tinh Đỉnh Phong, quản lý các sự vụ cụ thể. Họ thường bận rộn và ít nói.` 
        },
    ],
    'tvm-poi-2': [ // Tàng Kinh Các
        { 
            role: 'Thủ Các Trưởng Lão', 
            count: 1, 
            generationPrompt: `Tạo ra một Thủ Các Trưởng Lão trông coi Tàng Kinh Các của Thanh Vân Môn. Họ là một tu sĩ Kết Tinh Kỳ uyên bác, am hiểu vạn quyển công pháp. Tính cách có phần cổ quái, yêu sách như mạng.` 
        },
        { 
            role: 'Chân Truyền Đệ Tử', 
            count: 2, 
            generationPrompt: `Tạo ra Chân Truyền Đệ Tử của Thanh Vân Môn, đang ở Tàng Kinh Các để tìm đọc công pháp. Họ là những thiên tài Trúc Cơ Kỳ, kiêu ngạo và tài năng.` 
        },
    ],
    'tvm-poi-4': [ // Đệ Tử Xá
        { 
            role: 'Nội Môn Đệ Tử', 
            count: 10, 
            generationPrompt: `Tạo ra một Nội Môn Đệ Tử của Thanh Vân Môn, đang ở khu vực Đệ Tử Xá. Họ là tu sĩ Trúc Cơ Kỳ, là nòng cốt của tông môn, có thể đang tu luyện, trò chuyện hoặc vội vã đi làm nhiệm vụ.` 
        },
        { 
            role: 'Ngoại Môn Đệ Tử', 
            count: 20, 
            generationPrompt: `Tạo ra một Ngoại Môn Đệ Tử của Thanh Vân Môn, đang ở khu vực Đệ Tử Xá. Họ là tu sĩ Luyện Khí Kỳ, đang nỗ lực tu luyện để mong có ngày được thăng cấp. Họ thường làm các công việc tạp vụ trong tông môn.` 
        },
    ]
};