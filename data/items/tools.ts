import React from 'react';
import type { Item } from '../../types/item';
import { GiFurnace } from 'react-icons/gi';

export const TOOLS: Item[] = [
    {
        id: 'tool_dan_lo_mini',
        name: 'Tiểu Hình Đan Lô',
        description: 'Một chiếc đan lô nhỏ gọn, có thể mang theo bên mình để luyện đan mọi lúc mọi nơi. Sử dụng từ túi đồ để mở giao diện luyện đan.',
        type: 'tool',
        icon: React.createElement(GiFurnace, { className: "text-orange-400" }),
        stackable: 1,
        value: 1200,
        effects: [{ type: 'OPEN_ALCHEMY_PANEL', value: 0 }],
    },
];
