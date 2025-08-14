import type { Item } from '../types/item';

export interface AlchemyIngredient {
    itemId: string;
    quantity: number;
}

export interface AlchemyRecipe {
    id: string;
    name: string;
    description: string;
    resultItemId: string;
    resultQuantity: [number, number]; // min/max
    ingredients: AlchemyIngredient[];
    requiredCultivationRealm: number; // realmIndex
    baseSuccessChance: number; // 0-1
    ngoTinhFactor: number; // bonus chance per NgoTinh point
    timeToCraftMinutes: number;
}

export const ALL_RECIPES: AlchemyRecipe[] = [
    {
        id: 'recipe_hoi_xuan_dan',
        name: 'Hồi Xuân Đan Phương',
        description: 'Công thức luyện chế Hồi Xuân Đan, một loại đan dược trị thương cơ bản.',
        resultItemId: 'consumable_hoi_xuan_dan',
        resultQuantity: [1, 2],
        ingredients: [
            { itemId: 'material_linh_thao', quantity: 3 },
        ],
        requiredCultivationRealm: 0, // Luyện Khí
        baseSuccessChance: 0.7,
        ngoTinhFactor: 0.005,
        timeToCraftMinutes: 15,
    },
    {
        id: 'recipe_tu_khi_dan',
        name: 'Tụ Khí Đan Phương',
        description: 'Công thức luyện chế Tụ Khí Đan, giúp tu sĩ Luyện Khí Kỳ nhanh chóng hồi phục chân khí.',
        resultItemId: 'consumable_tu_khi_dan',
        resultQuantity: [1, 2],
        ingredients: [
            { itemId: 'material_linh_thao', quantity: 2 },
            { itemId: 'material_han_bang_thao', quantity: 1 },
        ],
        requiredCultivationRealm: 0, // Luyện Khí
        baseSuccessChance: 0.65,
        ngoTinhFactor: 0.006,
        timeToCraftMinutes: 20,
    }
];