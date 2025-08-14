
import React from 'react';
import type { PlayerState } from '../../types/character';
import type { Interactable } from '../../types/interaction';
import { ALL_ITEMS } from '../../data/items';
import { FaTimes, FaSeedling } from 'react-icons/fa';

interface PlantingMenuProps {
    playerState: PlayerState;
    plot: Interactable;
    onClose: () => void;
    onPlant: (plotId: string, seedItemId: string, inventoryIndex: number) => void;
}

const PlantingMenu: React.FC<PlantingMenuProps> = ({ playerState, plot, onClose, onPlant }) => {
    const seedsInInventory = playerState.inventory
        .map((slot, index) => ({
            slot,
            index,
            itemDef: ALL_ITEMS.find(i => i.id === slot.itemId && i.type === 'seed'),
        }))
        .filter(item => item.itemDef);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 animate-fade-in" onClick={onClose}>
            <div
                className="bg-gray-900/80 border-2 border-green-400/50 rounded-lg shadow-2xl shadow-green-500/20 w-full max-w-md flex flex-col backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center border-b-2 border-green-400/30 p-4">
                    <h2 className="text-2xl font-bold text-green-300">Gieo Trồng</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Đóng">
                        <FaTimes className="h-7 w-7" />
                    </button>
                </header>

                <main className="p-4 flex-grow max-h-[60vh] overflow-y-auto">
                    {seedsInInventory.length > 0 ? (
                        <div className="space-y-3">
                            {seedsInInventory.map(({ slot, index, itemDef }) => {
                                if (!itemDef) return null;
                                const growsInto = ALL_ITEMS.find(i => i.id === itemDef.growsIntoItemId);
                                return (
                                    <div key={index} className="bg-gray-800/70 p-3 rounded-lg flex items-center gap-4 border border-gray-700">
                                        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-black/30 rounded-lg text-3xl">
                                            {itemDef.icon}
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-lg text-white">{itemDef.name} (x{slot.quantity})</h3>
                                            <p className="text-xs text-gray-400">
                                                Sẽ lớn thành: <span className="font-semibold text-green-300">{growsInto?.name || 'Không rõ'}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => onPlant(plot.id, itemDef.id, index)}
                                            className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2"
                                        >
                                            <FaSeedling />
                                            <span>Gieo</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            <p>Không có hạt giống nào trong túi đồ của bạn.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default PlantingMenu;
