
import { useCallback } from 'react';
import type { PlayerState } from '../types/character';
import type { InventorySlot } from '../types/item';
import { ALL_ITEMS } from '../data/items/index';
import { INVENTORY_SIZE } from '../constants';

export const useInventoryManager = (
    setPlayerState: React.Dispatch<React.SetStateAction<PlayerState | null>>,
    setGameMessage: (message: string | null) => void,
    openTeleportUI: () => void,
    openAlchemyPanel: () => void,
) => {

    const handleAddLinhThach = useCallback((amount: number) => {
        if (amount <= 0) return;
        setPlayerState(prev => {
            if (!prev) return null;
            // Use setGameMessage inside to avoid overwriting other messages too quickly
            setGameMessage(`Nhận được ${amount.toLocaleString()} Linh Thạch!`);
            return { ...prev, linhThach: prev.linhThach + amount };
        });
    }, [setPlayerState, setGameMessage]);

    const handleAddItemToInventory = useCallback((itemIdToAdd: string, quantityToAdd: number) => {
        setPlayerState(prev => {
            if (!prev) return null;
    
            const itemDef = ALL_ITEMS.find(i => i.id === itemIdToAdd);
            if (!itemDef) {
                console.error(`Item with id ${itemIdToAdd} not found.`);
                return prev;
            }
    
            const newInventory: InventorySlot[] = JSON.parse(JSON.stringify(prev.inventory));
            let remainingQuantity = quantityToAdd;
    
            if (itemDef.stackable > 1) {
                for (const slot of newInventory) {
                    if (remainingQuantity <= 0) break;
                    if (slot.itemId === itemIdToAdd && slot.quantity < itemDef.stackable) {
                        const canAdd = itemDef.stackable - slot.quantity;
                        const amountToStack = Math.min(remainingQuantity, canAdd);
                        slot.quantity += amountToStack;
                        remainingQuantity -= amountToStack;
                    }
                }
            }
    
            while (remainingQuantity > 0 && newInventory.length < INVENTORY_SIZE) {
                const amountForNewStack = Math.min(remainingQuantity, itemDef.stackable);
                newInventory.push({ itemId: itemIdToAdd, quantity: amountForNewStack });
                remainingQuantity -= amountForNewStack;
            }
    
            if (remainingQuantity > 0) {
                setGameMessage("Túi Càn Khôn đã đầy!");
            }
            
            setGameMessage(`Nhận được: ${quantityToAdd}x ${itemDef.name}`);
    
            return { ...prev, inventory: newInventory };
        });
    }, [setPlayerState, setGameMessage]);

    const handleUseItem = useCallback((itemIndex: number) => {
        let isTeleport = false;
        let isAlchemy = false;

        setPlayerState(prev => {
            if (!prev) return null;

            const inventorySlot = prev.inventory[itemIndex];
            if (!inventorySlot) return prev;

            const itemDef = ALL_ITEMS.find(i => i.id === inventorySlot.itemId);
            if (!itemDef) return prev;

            let updatedPlayer = { ...prev };
            const messages: string[] = [];
            let shouldConsume = false;

            if (itemDef.type === 'recipe' && itemDef.recipeId) {
                const recipeId = itemDef.recipeId;
                if (updatedPlayer.learnedRecipes.includes(recipeId)) {
                    setGameMessage(`Bạn đã học đan phương "${itemDef.name}" rồi.`);
                    return prev; // Don't consume item if already learned
                }
                updatedPlayer.learnedRecipes = [...updatedPlayer.learnedRecipes, recipeId];
                messages.push(`lĩnh ngộ đan phương "${itemDef.name}"`);
                shouldConsume = true;
            } else if ((itemDef.type === 'consumable' || itemDef.type === 'tool') && itemDef.effects) {
                 if (itemDef.type === 'consumable') {
                    shouldConsume = true;
                 }
                 itemDef.effects.forEach(effect => {
                    switch (effect.type) {
                        case 'RESTORE_HP':
                            const hpRestored = Math.min(updatedPlayer.stats.maxHp, updatedPlayer.hp + effect.value) - updatedPlayer.hp;
                            updatedPlayer.hp += hpRestored;
                            if (hpRestored > 0) messages.push(`hồi phục ${hpRestored} Sinh Lực`);
                            break;
                        case 'RESTORE_QI':
                            const qiRestored = Math.min(updatedPlayer.stats.maxQi, updatedPlayer.qi + effect.value) - updatedPlayer.qi;
                            updatedPlayer.qi += qiRestored;
                            if (qiRestored > 0) messages.push(`hồi phục ${qiRestored} Chân Khí`);
                            break;
                        case 'RESTORE_MANA':
                             const manaRestored = Math.min(updatedPlayer.stats.maxMana, updatedPlayer.mana + effect.value) - updatedPlayer.mana;
                             updatedPlayer.mana += manaRestored;
                             if (manaRestored > 0) messages.push(`hồi phục ${manaRestored} Linh Lực`);
                            break;
                        case 'TELEPORT':
                            isTeleport = true;
                            messages.push('kích hoạt Truyền Tống Phù');
                            break;
                        case 'OPEN_ALCHEMY_PANEL':
                            isAlchemy = true;
                            messages.push('mở ra Tiểu Hình Đan Lô');
                            break;
                    }
                });
            } else {
                 // Not a usable item in this context (book, material, etc.)
                 return prev;
            }

            if (messages.length > 0) {
                setGameMessage(`Sử dụng ${itemDef.name}, ${messages.join(' và ')}.`);
            } else {
                 setGameMessage(`Sử dụng ${itemDef.name}, nhưng không có hiệu quả.`);
            }

            // Consume the item if it's consumable or a recipe
            if (shouldConsume) {
                const newInventory = [...prev.inventory];
                const slotToUpdate = newInventory[itemIndex];
                if (slotToUpdate.quantity > 1) {
                    slotToUpdate.quantity -= 1;
                } else {
                    newInventory.splice(itemIndex, 1);
                }
                updatedPlayer.inventory = newInventory;
            }
            
            return updatedPlayer;
        });

        if (isTeleport) {
            openTeleportUI();
        }
        if (isAlchemy) {
            openAlchemyPanel();
        }
    }, [setPlayerState, setGameMessage, openTeleportUI, openAlchemyPanel]);

    return {
        handleAddLinhThach,
        handleAddItemToInventory,
        handleUseItem,
    };
};
