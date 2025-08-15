import { useCallback } from 'react';
import type { PlayerState } from '../types/character';
import type { InventorySlot } from '../types/item';
import { ALL_ITEMS } from '../data/items/index';
import { INVENTORY_SIZE } from '../constants';

export const useInventoryManager = (
    playerState: PlayerState,
    updateAndPersistPlayerState: (updater: (prevState: PlayerState) => PlayerState) => void,
    setGameMessage: (message: string | null) => void,
    openTeleportUI: (itemIndex: number) => void,
    openAlchemyPanel: () => void,
) => {

    const handleAddLinhThach = useCallback((amount: number) => {
        if (amount <= 0) return;
        updateAndPersistPlayerState(prev => {
            if (!prev) return prev;
            // Use setGameMessage inside to avoid overwriting other messages too quickly
            setGameMessage(`Nhận được ${amount.toLocaleString()} Linh Thạch!`);
            return { ...prev, linhThach: prev.linhThach + amount };
        });
    }, [updateAndPersistPlayerState, setGameMessage]);

    const handleAddItemToInventory = useCallback((itemIdToAdd: string, quantityToAdd: number) => {
        updateAndPersistPlayerState(prev => {
            if (!prev) return prev;
    
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
    }, [updateAndPersistPlayerState, setGameMessage]);

    const handleUseItem = useCallback((itemIndex: number) => {
        const inventorySlot = playerState.inventory[itemIndex];
        if (!inventorySlot) return;

        const itemDef = ALL_ITEMS.find(i => i.id === inventorySlot.itemId);
        if (!itemDef) return;

        const isTeleport = itemDef.effects?.some(e => e.type === 'TELEPORT');
        const isAlchemy = itemDef.effects?.some(e => e.type === 'OPEN_ALCHEMY_PANEL');

        updateAndPersistPlayerState(prev => {
            if (!prev) return prev;

            const currentInventorySlot = prev.inventory[itemIndex];
            if (!currentInventorySlot) return prev;

            const currentItemDef = ALL_ITEMS.find(i => i.id === currentInventorySlot.itemId);
            if (!currentItemDef) return prev;

            let updatedPlayer = { ...prev };
            const messages: string[] = [];
            let shouldConsume = false;

            if (currentItemDef.type === 'recipe' && currentItemDef.recipeId) {
                const recipeId = currentItemDef.recipeId;
                if (updatedPlayer.learnedRecipes.includes(recipeId)) {
                    setGameMessage(`Bạn đã học đan phương "${currentItemDef.name}" rồi.`);
                    return prev; // Don't consume item if already learned
                }
                updatedPlayer.learnedRecipes = [...updatedPlayer.learnedRecipes, recipeId];
                messages.push(`lĩnh ngộ đan phương "${currentItemDef.name}"`);
                shouldConsume = true;
            } else if ((currentItemDef.type === 'consumable' || currentItemDef.type === 'tool') && currentItemDef.effects) {
                 if (currentItemDef.type === 'consumable') {
                    if (!isTeleport) { // Do not consume teleport talisman here
                        shouldConsume = true;
                    }
                 }
                 currentItemDef.effects.forEach(effect => {
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
                            messages.push('kích hoạt Truyền Tống Phù');
                            break;
                        case 'OPEN_ALCHEMY_PANEL':
                            messages.push('mở ra Tiểu Hình Đan Lô');
                            break;
                    }
                });
            } else {
                 // Not a usable item in this context (book, material, etc.)
                 return prev;
            }

            if (messages.length > 0) {
                setGameMessage(`Sử dụng ${currentItemDef.name}, ${messages.join(' và ')}.`);
            } else {
                 setGameMessage(`Sử dụng ${currentItemDef.name}, nhưng không có hiệu quả.`);
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
            openTeleportUI(itemIndex);
        }
        if (isAlchemy) {
            openAlchemyPanel();
        }
    }, [playerState, updateAndPersistPlayerState, setGameMessage, openTeleportUI, openAlchemyPanel]);

    return {
        handleAddLinhThach,
        handleAddItemToInventory,
        handleUseItem,
    };
};