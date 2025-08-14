import React from 'react';
import type { Item } from '../../types/item';
import { GiScrollQuill } from 'react-icons/gi';

export const RECIPES: Item[] = [
    {
        id: 'recipe_item_hoi_xuan_dan',
        name: 'Hồi Xuân Đan Phương',
        description: 'Ghi lại phương pháp luyện chế Hồi Xuân Đan. Sử dụng để học công thức.',
        type: 'recipe',
        icon: React.createElement(GiScrollQuill, { className: "text-green-300" }),
        stackable: 1,
        value: 300,
        recipeId: 'recipe_hoi_xuan_dan',
    },
    {
        id: 'recipe_item_tu_khi_dan',
        name: 'Tụ Khí Đan Phương',
        description: 'Ghi lại phương pháp luyện chế Tụ Khí Đan. Sử dụng để học công thức.',
        type: 'recipe',
        icon: React.createElement(GiScrollQuill, { className: "text-blue-300" }),
        stackable: 1,
        value: 400,
        recipeId: 'recipe_tu_khi_dan',
    },
];