import React from 'react';
import type { Item } from '../../types/item';
import { GiScrollQuill } from 'react-icons/gi';

export const QUEST_ITEMS: Item[] = [
    {
        id: 'quest_lao_ma_thu_tin',
        name: 'Thư của Lão Mã',
        description: 'Một bức thư đã ố vàng, được niêm phong cẩn thận. Dường như là thư của một người tên Lão Mã gửi cho con trai mình.',
        type: 'quest',
        icon: React.createElement(GiScrollQuill, { className: "text-amber-200" }),
        stackable: 1,
        value: 0,
    },
];
