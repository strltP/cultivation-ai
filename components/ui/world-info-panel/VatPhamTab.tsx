

import React, { useState } from 'react';
import { ALL_ITEMS } from '../../../data/items/index';
import type { Item, ItemType } from '../../../types/item';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ITEM_TYPE_NAMES: Record<ItemType, string> = {
    material: 'Nguyên Liệu Yêu Thú',
    herb: 'Linh Dược',
    ore: 'Khoáng Thạch & Linh Mộc',
    consumable: 'Tiêu Hao Phẩm',
    book: 'Sách Kỹ Năng',
    quest: 'Vật Phẩm Nhiệm Vụ',
    equipment: 'Trang Bị',
    seed: 'Hạt Giống',
    recipe: 'Đan Phương',
    tool: 'Công Cụ',
};

const ITEMS_PER_PAGE = 6;

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
    const [currentPages, setCurrentPages] = useState<Record<string, number>>({});

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

    const typeOrder: ItemType[] = ['herb', 'ore', 'material', 'seed', 'consumable', 'recipe', 'book', 'quest', 'tool'];
    
    const handlePageChange = (type: ItemType, newPage: number) => {
        setCurrentPages(prev => ({ ...prev, [type]: newPage }));
    };

    return (
        <div className="space-y-8">
            {typeOrder.map(type => {
                const itemsForType = groupedItems[type];
                if (!itemsForType || itemsForType.length === 0) return null;

                const totalItems = itemsForType.length;
                const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
                const currentPage = currentPages[type] || 0;
                const startIndex = currentPage * ITEMS_PER_PAGE;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                const paginatedItems = itemsForType.slice(startIndex, endIndex);
                
                return (
                    <div key={type}>
                        <h2 className="text-2xl font-bold text-yellow-200 mb-4 pb-2 border-b-2 border-yellow-200/50">
                            {ITEM_TYPE_NAMES[type]}
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[368px]">
                            {paginatedItems.map(item => (
                                <ItemInfoCard key={item.id} itemDef={item} />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="mt-4 flex justify-center items-center gap-4">
                                <button
                                    onClick={() => handlePageChange(type, currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                                    aria-label="Trang trước"
                                >
                                    <FaChevronLeft />
                                </button>
                                <span className="text-gray-300 font-semibold">
                                    Trang {currentPage + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(type, currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1}
                                    className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                                    aria-label="Trang sau"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default VatPhamTab;