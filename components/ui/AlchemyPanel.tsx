import React, { useState, useMemo } from 'react';
import type { PlayerState } from '../../types/character';
import { ALL_ITEMS } from '../../data/items/index';
import { ALL_RECIPES } from '../../data/alchemy_recipes';
import type { AlchemyRecipe } from '../../data/alchemy_recipes';
import { FaTimes, FaPercentage, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { GiBrain, GiFireBowl } from 'react-icons/gi';

interface AlchemyPanelProps {
    playerState: PlayerState;
    onClose: () => void;
    onCraft: (recipeId: string) => void;
}

const AlchemyPanel: React.FC<AlchemyPanelProps> = ({ playerState, onClose, onCraft }) => {
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

    const knownRecipes = useMemo(() => {
        return playerState.learnedRecipes
            .map(id => ALL_RECIPES.find(r => r.id === id))
            .filter((r): r is AlchemyRecipe => !!r);
    }, [playerState.learnedRecipes]);

    const selectedRecipe = useMemo(() => {
        return ALL_RECIPES.find(r => r.id === selectedRecipeId);
    }, [selectedRecipeId]);

    const inventoryMap = useMemo(() => {
        return playerState.inventory.reduce((acc, slot) => {
            acc[slot.itemId] = (acc[slot.itemId] || 0) + slot.quantity;
            return acc;
        }, {} as Record<string, number>);
    }, [playerState.inventory]);

    const canCraft = useMemo(() => {
        if (!selectedRecipe) return false;
        return selectedRecipe.ingredients.every(
            ing => (inventoryMap[ing.itemId] || 0) >= ing.quantity
        );
    }, [selectedRecipe, inventoryMap]);
    
    const successChance = useMemo(() => {
        if (!selectedRecipe) return 0;
        const chance = selectedRecipe.baseSuccessChance + playerState.attributes.ngoTinh * selectedRecipe.ngoTinhFactor;
        return Math.min(1, chance);
    }, [selectedRecipe, playerState.attributes.ngoTinh]);

    const resultItemDef = selectedRecipe ? ALL_ITEMS.find(i => i.id === selectedRecipe.resultItemId) : null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-900/80 border-2 border-orange-400/50 rounded-lg shadow-2xl shadow-orange-500/20 w-full max-w-4xl h-[70vh] flex flex-col backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                <header className="flex justify-between items-center border-b-2 border-orange-400/30 p-4 flex-shrink-0">
                    <h2 className="text-3xl font-bold text-orange-300 flex items-center gap-3"><GiFireBowl /> Luyện Đan</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Đóng"><FaTimes className="h-7 w-7" /></button>
                </header>

                <div className="flex-grow flex p-4 gap-4 overflow-hidden">
                    {/* Recipe List */}
                    <div className="w-1/3 bg-black/20 rounded-lg border border-gray-700 p-2 flex flex-col">
                        <h3 className="text-xl font-semibold text-yellow-300 p-2 border-b border-gray-600">Đan Phương Đã Học</h3>
                        <div className="flex-grow overflow-y-auto pr-2">
                            {knownRecipes.map(recipe => (
                                <button
                                    key={recipe.id}
                                    onClick={() => setSelectedRecipeId(recipe.id)}
                                    className={`w-full text-left p-3 my-1 rounded-md transition-colors ${selectedRecipeId === recipe.id ? 'bg-orange-600/40' : 'bg-gray-800/50 hover:bg-gray-700/60'}`}
                                >
                                    <span className="font-semibold text-white">{recipe.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Crafting Details */}
                    <div className="w-2/3 bg-black/20 rounded-lg border border-gray-700 p-4 flex flex-col">
                        {selectedRecipe && resultItemDef ? (
                            <>
                                <div className="text-center border-b border-gray-600 pb-4">
                                    <div className="mx-auto text-6xl w-24 h-24 flex items-center justify-center rounded-lg bg-gray-900/50 mb-2">{resultItemDef.icon}</div>
                                    <h3 className="text-2xl font-bold text-yellow-300">{selectedRecipe.name}</h3>
                                    <p className="text-sm text-gray-400 italic mt-1">{selectedRecipe.description}</p>
                                </div>
                                <div className="flex-grow my-4 overflow-y-auto pr-2 space-y-3">
                                    <h4 className="font-semibold text-lg text-white">Nguyên Liệu Cần Thiết:</h4>
                                    {selectedRecipe.ingredients.map(ing => {
                                        const itemDef = ALL_ITEMS.find(i => i.id === ing.itemId);
                                        const owned = inventoryMap[ing.itemId] || 0;
                                        const hasEnough = owned >= ing.quantity;
                                        return (
                                            <div key={ing.itemId} className={`flex items-center justify-between p-2 rounded-md ${hasEnough ? 'bg-green-800/30' : 'bg-red-800/30'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl">{itemDef?.icon}</div>
                                                    <span className="font-semibold">{itemDef?.name}</span>
                                                </div>
                                                <span className={`font-bold ${hasEnough ? 'text-green-300' : 'text-red-300'}`}>{owned} / {ing.quantity}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="mt-auto pt-4 border-t border-gray-600 space-y-3">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="font-semibold text-gray-300 flex items-center gap-2"><FaPercentage /> Tỷ Lệ Thành Công:</span>
                                        <span className="font-bold text-cyan-300">{(successChance * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="font-semibold text-gray-300 flex items-center gap-2"><GiBrain /> Ảnh hưởng Ngộ Tính:</span>
                                        <span className="font-bold text-green-300">+{(playerState.attributes.ngoTinh * selectedRecipe.ngoTinhFactor * 100).toFixed(1)}%</span>
                                    </div>
                                    <button 
                                        onClick={() => onCraft(selectedRecipe.id)}
                                        disabled={!canCraft}
                                        className="w-full mt-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg text-xl hover:scale-105 transition-transform disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                                    >
                                        Luyện Đan
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-center text-gray-500">
                                <p>Chọn một Đan Phương để bắt đầu luyện đan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlchemyPanel;