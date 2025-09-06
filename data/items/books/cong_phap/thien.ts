import React from 'react';
import type { Item } from '../../../../types/item';
import { GiBookCover } from 'react-icons/gi';

export const CONG_PHAP_BOOKS_THIEN: Item[] = [
    {
        id: 'book_phan_thien_hoa_hai',
        name: 'Phần Thiên Hỏa Hải - Cấm Thuật',
        description: 'Ghi chép cấm thuật Phần Thiên Hỏa Hải, có sức mạnh thiêu đốt vạn vật. Nghiên cứu có thể lĩnh ngộ công pháp này.',
        type: 'book',
        icon: React.createElement(GiBookCover, { className: "text-amber-500" }),
        stackable: 1,
        value: 30000,
        skillId: 'cong-phap-thien-1',
    },
    {
        id: 'book_tru_tien_kiem_quyet',
        name: 'Tru Tiên Kiếm Quyết - Cấm Thuật',
        description: 'Kiếm quyết tối thượng trong truyền thuyết, hủy thiên diệt địa. Nghiên cứu có thể lĩnh ngộ công pháp này.',
        type: 'book',
        icon: React.createElement(GiBookCover, { className: "text-red-400" }),
        stackable: 1,
        value: 50000,
        skillId: 'cong-phap-thien-2',
    },
    {
        id: 'book_hon_don_khai_thien',
        name: 'Hỗn Độn Khai Thiên - Cấm Thuật',
        description: 'Mô phỏng lại cảnh tượng Bàn Cổ khai thiên, một đòn tấn công mang theo sức mạnh hỗn độn nguyên thủy. Nghiên cứu có thể lĩnh ngộ công pháp này.',
        type: 'book',
        icon: React.createElement(GiBookCover, { className: "text-gray-200" }),
        stackable: 1,
        value: 60000,
        skillId: 'cong-phap-thien-3',
    },
];
