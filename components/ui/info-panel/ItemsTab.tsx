import React, { useState } from 'react';
import type { PlayerState } from '../../../types/character';
import { ALL_ITEMS } from '../../../data/items/index';
import { INVENTORY_SIZE } from '../../../constants';
import { calculateAllStats } from '../../../services/cultivationService';
import { ALL_SKILLS } from '../../../data/skills/skills';
import { FaBookOpen, FaPlusCircle } from 'react-icons/fa';
import { GiBrain, GiFireBowl } from 'react-icons/gi';

interface ItemsTabProps {
  playerState: PlayerState;
  setPlayerState: (updater: (prevState: PlayerState) => PlayerState) => void;
  onUseItem: (itemIndex: number) => void;
}

const ItemsTab: React.FC<ItemsTabProps> = ({ playerState, setPlayerState, onUseItem }) => {
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

    const inventorySlots = Array.from({ length: INVENTORY_SIZE }, (_, index) => {
        return playerState.inventory[index] || null;
    });

    const selectedSlot = selectedSlotIndex !== null ? inventorySlots[selectedSlotIndex] : null;
    const selectedItemDef = selectedSlot ? ALL_ITEMS.find(i => i.id === selectedSlot.itemId) : null;

    const handleSlotClick = (index: number) => {
        if (inventorySlots[index]) {
            setSelectedSlotIndex(index);
        } else {
            setSelectedSlotIndex(null);
        }
    };

    const handleLearnSkill = () => {
        if (!selectedItemDef || !selectedItemDef.skillId || selectedSlotIndex === null) return;
        const skillId = selectedItemDef.skillId;

        setPlayerState(prev => {
            if (!prev) return prev;

            if (prev.learnedSkills.some(s => s.skillId === skillId)) {
                // This state should be prevented by disabling the button, but as a safeguard.
                return prev;
            }

            // Create deep copies to avoid mutation issues
            const newInventory = JSON.parse(JSON.stringify(prev.inventory));
            
            const bookSlot = newInventory[selectedSlotIndex];
            if (!bookSlot || bookSlot.itemId !== selectedItemDef.id) return prev; // Safety check

            if (bookSlot.quantity > 1) {
                bookSlot.quantity -= 1;
            } else {
                newInventory.splice(selectedSlotIndex, 1);
            }
            
            const newLearnedSkills = [...prev.learnedSkills, { skillId, currentLevel: 1 }];
            const { finalStats, finalAttributes } = calculateAllStats(prev.attributes, prev.cultivation, prev.cultivationStats, newLearnedSkills, ALL_SKILLS, prev.equipment, ALL_ITEMS, prev.linhCan);
            
            setSelectedSlotIndex(null);

            return {
                ...prev,
                learnedSkills: newLearnedSkills,
                inventory: newInventory,
                attributes: finalAttributes,
                stats: finalStats,
                hp: Math.min(prev.hp, finalStats.maxHp), // Adjust HP to new maxHP if it changed
            };
        });
    };

    const handleUse = () => {
        if (selectedSlotIndex === null) return;
        
        if (selectedItemDef?.type === 'book') {
            handleLearnSkill();
        } else {
             onUseItem(selectedSlotIndex);
        }
        setSelectedSlotIndex(null); // Deselect after use
    };
    
    const isBook = selectedItemDef?.type === 'book';
    const isRecipe = selectedItemDef?.type === 'recipe';
    const isConsumable = selectedItemDef?.type === 'consumable';
    const isTool = selectedItemDef?.type === 'tool';

    const isSkillAlreadyLearned = isBook && selectedItemDef?.skillId ? playerState.learnedSkills.some(s => s.skillId === selectedItemDef.skillId) : false;
    const isRecipeAlreadyLearned = isRecipe && selectedItemDef?.recipeId ? playerState.learnedRecipes.some(r => r === selectedItemDef.recipeId) : false;

    return (
        <div className="flex h-full gap-4">
            {/* Inventory Grid */}
            <div className="grid grid-cols-8 gap-2 p-2 bg-black/20 rounded-lg border border-gray-700 flex-grow content-start overflow-y-auto">
                {inventorySlots.map((slot, index) => {
                    const itemDef = slot ? ALL_ITEMS.find(i => i.id === slot.itemId) : null;
                    const isSelected = index === selectedSlotIndex;
                    return (
                        <div
                            key={index}
                            onClick={() => handleSlotClick(index)}
                            className={`relative aspect-square bg-gray-900/50 rounded-md border-2 transition-all duration-150 ${
                                itemDef ? 'cursor-pointer hover:bg-gray-700/70' : 'border-gray-800'
                            } ${
                                isSelected ? 'border-yellow-400 scale-105 shadow-lg' : 'border-gray-700'
                            }`}
                            title={itemDef?.name || 'Ô trống'}
                        >
                            {itemDef && (
                                <>
                                    <div className="flex items-center justify-center h-full text-3xl">
                                        {itemDef.icon}
                                    </div>
                                    {slot.quantity > 1 && (
                                        <span className="absolute bottom-1 right-1 text-xs font-bold text-white bg-gray-800/80 px-1.5 py-0.5 rounded">
                                            {slot.quantity}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Item Details */}
            <div className="w-80 flex-shrink-0 bg-black/20 rounded-lg border border-gray-700 p-4 flex flex-col">
                {selectedItemDef && selectedSlot ? (
                    <>
                        <div className="text-center border-b border-gray-600 pb-4">
                            <div className="mx-auto text-6xl w-24 h-24 flex items-center justify-center rounded-lg bg-gray-900/50 mb-2">
                              {selectedItemDef.icon}
                            </div>
                            <h3 className="text-xl font-bold text-yellow-300">{selectedItemDef.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{selectedItemDef.type}</p>
                        </div>
                        <div className="flex-grow mt-4 text-gray-300 text-sm italic overflow-y-auto">
                            <p>{selectedItemDef.description}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-600 space-y-2">
                           {(isConsumable || isBook || isRecipe || isTool) && (
                                <button 
                                    onClick={handleUse}
                                    disabled={
                                        (isBook && isSkillAlreadyLearned) ||
                                        (isRecipe && isRecipeAlreadyLearned)
                                    }
                                    className="w-full flex items-center justify-center gap-2 bg-green-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isConsumable && <><FaPlusCircle /><span>Sử dụng</span></>}
                                    {isBook && <><FaBookOpen /><span>{isSkillAlreadyLearned ? 'Đã Lĩnh Ngộ' : 'Nghiên Cứu'}</span></>}
                                    {isRecipe && <><GiBrain /><span>{isRecipeAlreadyLearned ? 'Đã Học' : 'Lĩnh Ngộ'}</span></>}
                                    {isTool && <><GiFireBowl /><span>Luyện Đan</span></>}
                                </button>
                           )}
                           <button className="w-full bg-red-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed" disabled>
                                Hủy Bỏ
                           </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-gray-500">
                        <p>Chọn một vật phẩm để xem thông tin chi tiết.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemsTab;
