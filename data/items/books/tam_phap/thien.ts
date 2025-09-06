import React from 'react';
import type { Item } from '../../../../types/item';
import { GiBookCover } from 'react-icons/gi';

export const TAM_PHAP_BOOKS_THIEN: Item[] = [
    {
        id: 'book_bat_diet_kim_than',
        name: 'Bất Diệt Kim Thân - Thần Quyển',
        description: 'Tâm pháp luyện thể tối thượng, thân thể trở nên bất hoại. Nghiên cứu có thể lĩnh ngộ tâm pháp này.',
        type: 'book',
        icon: React.createElement(GiBookCover, { className: "text-yellow-400" }),
        stackable: 1,
        value: 25000,
        skillId: 'tam-phap-thien-1',
    },
    {
        id: 'book_thanh_linh_tam_phap',
        name: 'Thánh Linh Tâm Pháp - Đế Kinh',
        description: 'Tâm pháp thượng cổ do Thánh Nhân sáng tạo. Nghiên cứu có thể lĩnh ngộ tâm pháp này.',
        type: 'book',
        icon: React.createElement(GiBookCover, { className: "text-fuchsia-400" }),
        stackable: 1,
        value: 40000,
        skillId: 'tam-phap-thien-2',
    },
    {
        id: 'book_dau_chien_thanh_phap',
        name: 'Đấu Chiến Thánh Pháp - Đế Kinh',
        description: 'Pháp môn chiến đấu chí cao, càng chiến càng mạnh. Nghiên cứu có thể lĩnh ngộ tâm pháp này.',
        type: 'book',
        icon: React.createElement(GiBookCover, { className: "text-orange-400" }),
        stackable: 1,
        value: 32000,
        skillId: 'tam-phap-thien-3',
    },
    {
        id: 'book_cuu_thien_than_hanh_bo',
        name: 'Cửu Thiên Thần Hành Bộ - Đế Kinh',
        description: 'Thân pháp thần diệu, bước một bước vượt Cửu Thiên. Nghiên cứu có thể lĩnh ngộ tâm pháp này.',
        type: 'book',
        icon: React.createElement(GiBookCover, { className: "text-indigo-300" }),
        stackable: 1,
        value: 28000,
        skillId: 'tam-phap-thien-4',
    },
];
