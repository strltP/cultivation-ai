import React, { useState, useMemo, useEffect } from 'react';
import type { PlayerState, NPC } from '../../types/character';
import type { Item, InventorySlot } from '../../types/item';
import { ALL_ITEMS } from '../../data/items/index';
import { INVENTORY_SIZE } from '../../constants';
import { FaGem, FaTimes } from 'react-icons/fa';
import { GiTwoCoins } from 'react-icons/gi';

interface TradePanelProps {
    playerState: PlayerState;
    setPlayerState: React.Dispatch<React.SetStateAction<PlayerState | null>>;
    npc: NPC;
    setNpc: (npc: NPC | null) => void;
    onClose: () => void;
}

const TradePanel: React.FC<TradePanelProps> = ({ playerState, setPlayerState, npc, setNpc, onClose }) => {
    const [selectedItem, setSelectedItem] = useState<{ type: 'player' | 'npc', item: Item, slot: InventorySlot | null, index: number } | null>(null);
    const [transactionQuantity, setTransactionQuantity] = useState(1);

    const handleSelectItem = (type: 'player' | 'npc', item: Item, slot: InventorySlot | null, index: number) => {
        setSelectedItem({ type, item, slot, index });
        setTransactionQuantity(1);
    };

    useEffect(() => {
        if (selectedItem?.type === 'npc') {
            const npcSaleItem = npc.forSale?.find(i => i.itemId === selectedItem.item.id);
            if (!npcSaleItem) {
                setSelectedItem(null);
            }
        }
         if (selectedItem?.type === 'player') {
            const playerInvItem = playerState.inventory?.[selectedItem.index];
            if (!playerInvItem || playerInvItem.itemId !== selectedItem.item.id) {
                 setSelectedItem(null);
            }
        }
    }, [npc.forSale, playerState.inventory, selectedItem]);
    
    const { maxBuy, maxSell, buyPrice, sellPrice, canBuy, canSell } = useMemo(() => {
        if (!selectedItem) {
            return { maxBuy: 0, maxSell: 0, buyPrice: 0, sellPrice: 0, canBuy: false, canSell: false };
        }

        const itemDef = selectedItem.item;
        const currentSellPrice = Math.floor((itemDef.value || 0) * 0.5);
        const npcSaleItem = selectedItem.type === 'npc' ? npc.forSale?.find(i => i.itemId === itemDef.id) : null;
        const currentBuyPrice = npcSaleItem ? Math.floor((itemDef.value || 0) * (npcSaleItem.priceModifier || 1)) : 0;
        
        const currentMaxSell = selectedItem.type === 'player' ? selectedItem.slot?.quantity || 0 : 0;

        let currentMaxBuy = 0;
        if (selectedItem.type === 'npc' && npcSaleItem && currentBuyPrice > 0) {
            const maxByStock = npcSaleItem.stock === -1 ? Infinity : npcSaleItem.stock;
            const maxByMoney = Math.floor(playerState.linhThach / currentBuyPrice);
            
            const existingStacks = playerState.inventory.filter(s => s.itemId === itemDef.id);
            const spaceInStacks = existingStacks.reduce((total, stack) => total + (itemDef.stackable - stack.quantity), 0);
            const emptySlots = INVENTORY_SIZE - playerState.inventory.length + (existingStacks.some(s => s.itemId === itemDef.id) ? 0 : -1);
            const spaceInNewStacks = Math.max(0, emptySlots * itemDef.stackable);
            const maxBySpace = spaceInStacks + spaceInNewStacks;
            
            currentMaxBuy = Math.floor(Math.min(maxByStock, maxByMoney, maxBySpace));
        }

        const currentCanSell = selectedItem.type === 'player' && currentMaxSell > 0 && transactionQuantity > 0 && transactionQuantity <= currentMaxSell;
        const currentCanBuy = selectedItem.type === 'npc' && currentMaxBuy > 0 && transactionQuantity > 0 && transactionQuantity <= currentMaxBuy;

        return { maxBuy: currentMaxBuy, maxSell: currentMaxSell, buyPrice: currentBuyPrice, sellPrice: currentSellPrice, canBuy: currentCanBuy, canSell: currentCanSell };

    }, [selectedItem, transactionQuantity, playerState, npc.forSale]);
    
    const handleQuantityChange = (amount: number | string) => {
        let value: number;
        if (typeof amount === 'string') {
            if (amount === '') {
                setTransactionQuantity(1);
                return;
            }
            value = parseInt(amount, 10);
            if (isNaN(value)) return;
        } else {
            value = transactionQuantity + amount;
        }

        let max = 1;
        if (selectedItem?.type === 'player') max = maxSell;
        if (selectedItem?.type === 'npc') max = maxBuy;
        
        setTransactionQuantity(Math.max(1, Math.min(value, max || 1)));
    };
    
    const handleMaxQuantity = () => {
        if (selectedItem?.type === 'player') setTransactionQuantity(maxSell);
        if (selectedItem?.type === 'npc') setTransactionQuantity(maxBuy);
    };

    const handleSell = () => {
        if (!canSell || !selectedItem || selectedItem.type !== 'player' || !selectedItem.slot) return;
        
        setPlayerState(prev => {
            if (!prev) return null;

            const totalPrice = sellPrice * transactionQuantity;

            // Update NPC in master list
            const newGeneratedNpcs = JSON.parse(JSON.stringify(prev.generatedNpcs));
            const npcsOnMap = newGeneratedNpcs[prev.currentMap] || [];
            const npcIndex = npcsOnMap.findIndex(n => n.id === npc.id);
            if (npcIndex === -1) return prev; 
            
            const currentNpc = npcsOnMap[npcIndex];
            currentNpc.linhThach = Math.max(0, currentNpc.linhThach - totalPrice);

            // Update player
            const newInventory = [...prev.inventory];
            const invItem = newInventory[selectedItem.index];
            if (invItem.quantity > transactionQuantity) {
                invItem.quantity -= transactionQuantity;
            } else {
                newInventory.splice(selectedItem.index, 1);
            }
            
            setSelectedItem(null);

            return { 
                ...prev, 
                inventory: newInventory, 
                linhThach: prev.linhThach + totalPrice,
                generatedNpcs: newGeneratedNpcs
            };
        });
    };

    const handleBuy = () => {
        if (!canBuy || !selectedItem || selectedItem.type !== 'npc') return;

        setPlayerState(prev => {
            if (!prev) return null;
            
            const totalPrice = buyPrice * transactionQuantity;

            // Update NPC in master list
            const newGeneratedNpcs = JSON.parse(JSON.stringify(prev.generatedNpcs));
            const npcsOnMap = newGeneratedNpcs[prev.currentMap] || [];
            const npcIndex = npcsOnMap.findIndex(n => n.id === npc.id);
            if (npcIndex === -1) return prev;
            
            const currentNpc = npcsOnMap[npcIndex];
            const saleItemIndex = currentNpc.forSale.findIndex((i: any) => i.itemId === selectedItem.item.id);
            if (saleItemIndex === -1) return prev;
            
            const saleItem = currentNpc.forSale[saleItemIndex];
            if (saleItem.stock !== -1) {
                saleItem.stock -= transactionQuantity;
                if (saleItem.stock <= 0) {
                    currentNpc.forSale.splice(saleItemIndex, 1);
                }
            }
            currentNpc.linhThach += totalPrice;

            // Update Player
            const newLinhThach = prev.linhThach - totalPrice;
            let newInventory = JSON.parse(JSON.stringify(prev.inventory));
            let remainingToBuy = transactionQuantity;
            const itemDef = selectedItem.item;
            if (itemDef.stackable > 1) {
                for (const slot of newInventory) {
                    if (remainingToBuy <= 0) break;
                    if (slot.itemId === itemDef.id && slot.quantity < itemDef.stackable) {
                        const canAdd = itemDef.stackable - slot.quantity;
                        const amountToStack = Math.min(remainingToBuy, canAdd);
                        slot.quantity += amountToStack;
                        remainingToBuy -= amountToStack;
                    }
                }
            }
            while (remainingToBuy > 0 && newInventory.length < INVENTORY_SIZE) {
                const amountForNewStack = Math.min(remainingToBuy, itemDef.stackable);
                newInventory.push({ itemId: itemDef.id, quantity: amountForNewStack });
                remainingToBuy -= amountForNewStack;
            }
            
            setSelectedItem(null);
            
            return { 
                ...prev, 
                inventory: newInventory, 
                linhThach: newLinhThach,
                generatedNpcs: newGeneratedNpcs 
            };
        });
    };

    const playerItems = playerState.inventory;
    const npcItems = (npc.forSale || []).map(saleItem => {
        const itemDef = ALL_ITEMS.find(i => i.id === saleItem.itemId);
        return itemDef ? { ...saleItem, def: itemDef } : null;
    }).filter((item): item is NonNullable<typeof item> => item !== null && item.stock !== 0);

    const selectedItemDef = selectedItem?.item;
    
    return (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-900/80 border-2 border-yellow-400/50 rounded-lg shadow-2xl shadow-yellow-500/20 w-full max-w-6xl h-[80vh] flex flex-col backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                <header className="flex justify-between items-center border-b-2 border-yellow-400/30 p-4 flex-shrink-0">
                    <h2 className="text-3xl font-bold text-yellow-300">Giao Dịch với {npc.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Đóng"><FaTimes className="h-7 w-7" /></button>
                </header>

                <div className="flex-grow flex p-4 gap-4 overflow-hidden">
                    {/* Player Inventory */}
                    <div className="w-2/5 bg-black/20 rounded-lg border border-gray-700 p-2 flex flex-col">
                        <h3 className="text-xl font-semibold text-blue-300 p-2 border-b border-gray-600 flex justify-between">
                            <span>Túi Đồ Của Bạn</span>
                            <span className="flex items-center gap-2 text-yellow-300">{playerState.linhThach.toLocaleString()} <FaGem /></span>
                        </h3>
                        <div className="grid grid-cols-5 gap-2 p-2 flex-grow content-start overflow-y-auto">
                            {playerItems.map((slot, index) => {
                                const itemDef = ALL_ITEMS.find(i => i.id === slot.itemId);
                                if (!itemDef) return null;
                                const isSelected = selectedItem?.type === 'player' && selectedItem.index === index;
                                return (
                                    <button key={index} onClick={() => handleSelectItem('player', itemDef, slot, index)} className={`relative aspect-square bg-gray-900/50 rounded-md border-2 transition-all ${isSelected ? 'border-yellow-400 scale-105' : 'border-gray-700'} ${itemDef.value ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}`} disabled={!itemDef.value}>
                                        <div className="flex items-center justify-center h-full text-3xl">{itemDef.icon}</div>
                                        {slot.quantity > 1 && <span className="absolute bottom-1 right-1 text-xs font-bold text-white bg-gray-800/80 px-1.5 py-0.5 rounded">{slot.quantity}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Item Details */}
                    <div className="w-1/5 flex-shrink-0 p-4 bg-black/20 rounded-lg border border-gray-700 flex flex-col justify-between items-center text-center">
                        {selectedItemDef ? (
                            <>
                                <div className="w-full">
                                    <div className="text-6xl mb-4">{selectedItemDef.icon}</div>
                                    <h4 className="text-xl font-bold text-white">{selectedItemDef.name}</h4>
                                    <p className="text-sm text-gray-400 italic my-2 h-24 overflow-y-auto">{selectedItemDef.description}</p>
                                </div>
                                <div className="w-full space-y-3">
                                    <div className="space-y-2">
                                        <label htmlFor="quantity-input" className="block text-sm font-medium text-gray-400">Số lượng</label>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleQuantityChange(-1)} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">-</button>
                                            <input id="quantity-input" type="number" value={transactionQuantity} onChange={(e) => handleQuantityChange(e.target.value)} className="w-full text-center bg-gray-800 border border-gray-600 rounded p-1" />
                                            <button onClick={() => handleQuantityChange(1)} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">+</button>
                                        </div>
                                        <button onClick={handleMaxQuantity} className="w-full text-sm py-1 bg-gray-600 rounded hover:bg-gray-500">Tối đa</button>
                                    </div>
                                    {selectedItem.type === 'player' && (
                                        <div className="w-full">
                                            <p className="text-lg text-gray-300">Tổng cộng: <span className="font-bold text-yellow-300">{(sellPrice * transactionQuantity).toLocaleString()}</span></p>
                                            <button onClick={handleSell} disabled={!canSell} className="mt-2 w-full bg-green-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Bán {transactionQuantity} cái</button>
                                        </div>
                                    )}
                                    {selectedItem.type === 'npc' && (
                                        <div className="w-full">
                                            <p className="text-lg text-gray-300">Tổng cộng: <span className="font-bold text-yellow-300">{(buyPrice * transactionQuantity).toLocaleString()}</span></p>
                                            <button onClick={handleBuy} disabled={!canBuy} className="mt-2 w-full bg-blue-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Mua {transactionQuantity} cái</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-gray-500">
                                <GiTwoCoins size={64} />
                                <p className="mt-4">Chọn một vật phẩm để giao dịch.</p>
                            </div>
                        )}
                    </div>
                    
                    {/* NPC Inventory */}
                    <div className="w-2/5 bg-black/20 rounded-lg border border-gray-700 p-2 flex flex-col">
                        <h3 className="text-xl font-semibold text-red-300 p-2 border-b border-gray-600 flex justify-between">
                            <span>Cửa Hàng</span>
                             <span className="flex items-center gap-2 text-yellow-300">{npc.linhThach.toLocaleString()} <FaGem /></span>
                        </h3>
                        <div className="grid grid-cols-5 gap-2 p-2 flex-grow content-start overflow-y-auto">
                           {npcItems.map((saleItem, index) => {
                                const isSelected = selectedItem?.type === 'npc' && selectedItem.item.id === saleItem.def.id;
                                return (
                                    <button key={`${saleItem.def.id}-${index}`} onClick={() => handleSelectItem('npc', saleItem.def, null, index)} className={`relative aspect-square bg-gray-900/50 rounded-md border-2 transition-all hover:bg-gray-700 ${isSelected ? 'border-yellow-400 scale-105' : 'border-gray-700'}`}>
                                        <div className="flex items-center justify-center h-full text-3xl">{saleItem.def.icon}</div>
                                        {saleItem.stock !== -1 && <span className="absolute bottom-1 right-1 text-xs font-bold text-white bg-gray-800/80 px-1.5 py-0.5 rounded">{saleItem.stock}</span>}
                                    </button>
                                )
                           })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradePanel;