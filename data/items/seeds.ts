
import React from 'react';
import type { Item } from '../../types/item';
import { GiEmberShot } from 'react-icons/gi';

export const SEEDS: Item[] = [
    {
        id: 'seed_linh_thao',
        name: 'Linh Thảo Hạt Giống',
        description: 'Hạt giống của Linh Thảo. Gieo xuống Linh Điền có thể mọc ra Linh Thảo.',
        type: 'seed',
        icon: React.createElement(GiEmberShot, { className: "text-yellow-600" }),
        stackable: 99,
        value: 2,
        growsIntoItemId: 'material_linh_thao',
        growthTimeMinutes: 1440, // 1 game day
    },
];
