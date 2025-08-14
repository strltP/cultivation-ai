
import React from 'react';
import { ALL_ITEMS } from '../../../data/items/index';
import type { Item, ItemType } from '../../../types/item';

const ITEM_TYPE_NAMES: Record<ItemType, string> = {
    material: 'Nguyên Liệu',
    consumable: 'Tiêu Hao Phẩm',
    book: 'Sách Kỹ Năng',
    quest: 'Vật Phẩm Nhiệm Vụ',
    equipment: 'Trang Bị',
    seed: 'Hạt Giống',
    recipe: 'Đan Phương',
    tool: 'Công Cụ',
};

const ItemInfoCard: React.FC<{ itemDef: Item }> = ({ itemDef }) => {
    return (
        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex gap-4">
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-black/30 rounded-lg text-4xl">
                {itemDef.icon}
            </div>
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-yellow-300">{itemDef.name}</h3>
                <p className="text-gray-400 mt-1 text-sm italic">{itemDef.description}</p>
                <div className="text-xs text-gray-500 mt-2">
                    <span>Loại: {ITEM_TYPE_NAMES[itemDef.type]}</span>
                    <span className="mx-2">|</span>
                    <span>Tối đa: {itemDef.stackable}</span>
                </div>
            </div>
        </div>
    );
};

const VatPhamTab: React.FC = () => {
    const groupedItems = ALL_ITEMS.reduce((acc, item) => {
        const type = item.type;
        if (type === 'equipment') { // Exclude equipment from this tab
          return acc;
        }
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(item);
        return acc;
    }, {} as Record<string, Item[]>);

    const typeOrder: ItemType[] = ['material', 'seed', 'consumable', 'recipe', 'book', 'quest', 'tool'];

    return (
        <div className="space-y-8">
            {typeOrder.map(type => {
                if (!groupedItems[type] || groupedItems[type].length === 0) return null;
                
                return (
                    <div key={type}>
                        <h2 className="text-2xl font-bold text-yellow-200 mb-4 pb-2 border-b-2 border-yellow-200/50">
                            {ITEM_TYPE_NAMES[type]}
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {groupedItems[type].map(item => (
                                <ItemInfoCard key={item.id} itemDef={item} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default VatPhamTab;