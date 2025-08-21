import { useState, useCallback, useRef } from 'react';
import type { PlayerState, NPC, ChatMessage, ApiUsageStats } from '../types/character';
import type { Position } from '../types/common';
import type { Dialogue, Interactable } from '../types/interaction';
import type { MapID, PointOfInterest, TeleportLocation, GameMap } from '../types/map';
import { getInteractionResponse, createChatSession } from '../services/geminiService';
import { advanceTime, gameTimeToMinutes } from '../services/timeService';
import { ALL_ITEMS } from '../data/items/index';
import { ALL_INTERACTABLES } from '../data/interactables';
import { INTERACTION_RADIUS, INVENTORY_SIZE } from '../constants';
import type { InventorySlot } from '../types/item';
import type { Chat } from '@google/genai';
import { FACTIONS } from '../data/factions';
import { calculateGiftAffinityChange } from '../services/affinityService';

type InteractionDependencies = {
    handleAddItemToInventory: (itemIdToAdd: string, quantityToAdd: number) => void;
    handleAddLinhThach: (amount: number) => void;
    handleRemoveAndRespawn: (interactable: Interactable, respawnTimeMultiplier?: number) => void;
    handleChallenge: (npc: NPC) => void;
    handleInitiateTrade: (npc: NPC) => void;
    setPlantingPlot: (plot: Interactable | null) => void;
    setIsAlchemyPanelOpen: (isOpen: boolean) => void;
    addJournalEntry: (message: string) => void;
    allMaps: Record<string, GameMap>;
    trackApiCall: (functionName: keyof ApiUsageStats['calls'], tokenCount: number) => void;
};

type InteractionBlockers = { 
    isMapOpen: boolean; 
    isInfoPanelOpen: boolean;
    isWorldInfoPanelOpen: boolean;
    combatState: any; 
};

export const useInteractionManager = (
    playerState: PlayerState,
    updateAndPersistPlayerState: (updater: (prevState: PlayerState) => PlayerState) => void,
    isLoading: boolean,
    setIsLoading: (loading: boolean) => void,
    setGameMessage: (message: string | null) => void,
    pendingInteraction: React.MutableRefObject<(() => void) | null>,
    interactionBlockers: InteractionBlockers,
    dependencies: InteractionDependencies,
    stopAllActions: React.MutableRefObject<() => void>
) => {
    const [activeDialogue, setActiveDialogue] = useState<Dialogue | null>(null);
    const [activeInteractionNpc, setActiveInteractionNpc] = useState<NPC | null>(null);
    const [activeInteractionInteractable, setActiveInteractionInteractable] = useState<Interactable | null>(null);
    const [viewingNpc, setViewingNpc] = useState<NPC | null>(null);

    // Chat state
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [chatTargetNpc, setChatTargetNpc] = useState<NPC | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
    
    const { handleAddItemToInventory, handleAddLinhThach, handleRemoveAndRespawn, handleChallenge, handleInitiateTrade, setPlantingPlot, setIsAlchemyPanelOpen, addJournalEntry, allMaps, trackApiCall } = dependencies;

    const processInteraction = useCallback(async (target: Interactable) => {
        stopAllActions.current();
        setActiveInteractionInteractable(null);
        
        let currentStateWithAdvancedTime: PlayerState | null = null;

        updateAndPersistPlayerState(p => {
             if (!p) return p;
             const newState = {...p, time: advanceTime(p.time, 5)};
             currentStateWithAdvancedTime = newState;
             return newState;
        });

        if (!currentStateWithAdvancedTime) return;

        setIsLoading(true);
        const { data: response, tokenCount } = await getInteractionResponse(currentStateWithAdvancedTime, target, ALL_ITEMS);
        trackApiCall('getInteractionResponse', tokenCount);
        setIsLoading(false);

        if (!response) {
            setGameMessage("Tương tác thất bại, dường như có một sức mạnh vô hình cản trở.");
            return;
        }

        setActiveDialogue({ title: target.name, text: response.dialogue });
        
        const lootMessages: string[] = [];
        if (response.linhThach && response.linhThach > 0) {
            handleAddLinhThach(response.linhThach);
            lootMessages.push(`${response.linhThach} Linh Thạch`);
        }

        if (response.loot && response.loot.length > 0) {
            response.loot.forEach(itemLoot => {
                const itemDef = ALL_ITEMS.find(i => i.name === itemLoot.itemName);
                if (itemDef) {
                    handleAddItemToInventory(itemDef.id, itemLoot.quantity);
                    lootMessages.push(`${itemLoot.quantity}x ${itemDef.name}`);
                } else {
                    console.warn(`Received unknown item from Gemini: ${itemLoot.itemName}`);
                }
            });
        }

        if(lootMessages.length > 0) {
            addJournalEntry(`Mở ${target.name} và nhận được: ${lootMessages.join(', ')}.`);
        }
        
        if (target.type === 'chest') {
            handleRemoveAndRespawn(target as Interactable);
        }
    }, [updateAndPersistPlayerState, setIsLoading, setGameMessage, handleAddLinhThach, handleAddItemToInventory, handleRemoveAndRespawn, stopAllActions, addJournalEntry, trackApiCall]);

    const handleTeleport = useCallback((gate: TeleportLocation) => {
        stopAllActions.current();
        setIsLoading(true);
        const targetMapName = allMaps[gate.targetMap].name;
        setGameMessage(`Đang chuẩn bị truyền tống đến ${targetMapName}...`);

        setTimeout(() => {
            updateAndPersistPlayerState(prev => {
                if (!prev) return prev;
                const timeAdvanced = advanceTime(prev.time, 30); // Teleporting takes 30 minutes
                return {
                    ...prev,
                    currentMap: gate.targetMap,
                    position: gate.targetPosition,
                    targetPosition: gate.targetPosition,
                    time: timeAdvanced
                }
            });
            setIsLoading(false);
            setGameMessage(`Đã đến ${targetMapName}!`);
        }, 1500);
    }, [updateAndPersistPlayerState, setIsLoading, setGameMessage, allMaps, stopAllActions]);
    
    const handleEnterPoi = useCallback((poi: PointOfInterest) => {
        if (!poi.targetMap || !poi.targetPosition) return;

        // Faction Access Control
        if (poi.allowedFactionIds && poi.allowedFactionIds.length > 0) {
            // Player doesn't have a faction yet. This logic denies access if a faction is required.
            // When player factions are implemented, check playerState.factionId here.
            const playerFactionId = undefined; // Placeholder for player's faction
            if (!playerFactionId || !poi.allowedFactionIds.includes(playerFactionId)) {
                const faction = FACTIONS.find(f => f.id === poi.allowedFactionIds![0]);
                const factionName = faction ? `[${faction.name}]` : 'nơi này';
                setGameMessage(`Nơi đây là trọng địa của ${factionName}, không phận sự miễn vào!`);
                return;
            }
        }

        stopAllActions.current();
        setIsLoading(true);
        setGameMessage(`Đang tiến vào ${poi.name}...`);
        
        setTimeout(() => {
            updateAndPersistPlayerState(prev => {
                if (!prev) return prev;
                const timeAdvanced = advanceTime(prev.time, 1); // Entering POI takes 1 minute
                return {
                    ...prev,
                    currentMap: poi.targetMap as MapID,
                    position: poi.targetPosition as Position,
                    targetPosition: poi.targetPosition as Position,
                    time: timeAdvanced
                }
            });
            setIsLoading(false);
            setGameMessage(`Chào mừng đến ${poi.name}!`);
        }, 1500);
    }, [updateAndPersistPlayerState, setIsLoading, setGameMessage, stopAllActions, setGameMessage]);

    const handleSpiritFieldClick = useCallback((plot: Interactable) => {
        setActiveInteractionInteractable(null);
        let shouldOpenPlantingMenu = false;
    
        updateAndPersistPlayerState(prev => {
            if (!prev) return prev;
    
            const plantedPlot = prev.plantedPlots.find(p => p.plotId === plot.id);
    
            if (plantedPlot) {
                const seedDef = ALL_ITEMS.find(i => i.id === plantedPlot.seedId);
                if (!seedDef || !seedDef.growthTimeMinutes) {
                    setGameMessage("Cây trồng này có vấn đề, không thể xác định thời gian lớn.");
                    return prev;
                }
    
                const currentTimeMins = gameTimeToMinutes(prev.time);
                const plantedTimeMins = gameTimeToMinutes(plantedPlot.plantedAt);
                const elapsedMins = currentTimeMins - plantedTimeMins;
                const grownItemDef = ALL_ITEMS.find(i => i.id === seedDef.growsIntoItemId);
    
                if (elapsedMins >= seedDef.growthTimeMinutes) {
                    if (!grownItemDef) {
                        setGameMessage("Lỗi: Không tìm thấy vật phẩm trưởng thành từ hạt giống này.");
                        return prev;
                    }
    
                    const newPlantedPlots = prev.plantedPlots.filter(p => p.plotId !== plot.id);
                    let newInventory: InventorySlot[] = JSON.parse(JSON.stringify(prev.inventory));
                    const lootMessages: string[] = [];
                    let inventoryIsFull = false;
    
                    const harvestQuantity = Math.floor(Math.random() * 2) + 2; // Harvest 2-3 items
                    let remainingHarvest = harvestQuantity;
                    if (grownItemDef.stackable > 1) {
                        for (const slot of newInventory) {
                            if (remainingHarvest <= 0) break;
                            if (slot.itemId === grownItemDef.id && slot.quantity < grownItemDef.stackable) {
                                const canAdd = grownItemDef.stackable - slot.quantity;
                                const amountToStack = Math.min(remainingHarvest, canAdd);
                                slot.quantity += amountToStack;
                                remainingHarvest -= amountToStack;
                            }
                        }
                    }
                    while (remainingHarvest > 0) {
                        if (newInventory.length >= INVENTORY_SIZE) {
                            inventoryIsFull = true;
                            break;
                        }
                        const amountForNewStack = Math.min(remainingHarvest, grownItemDef.stackable);
                        newInventory.push({ itemId: grownItemDef.id, quantity: amountForNewStack });
                        remainingHarvest -= amountForNewStack;
                    }
                    lootMessages.push(`${harvestQuantity}x ${grownItemDef.name}`);
    
                    if (Math.random() < 0.5) { // 50% chance to get seed back
                        let remainingSeed = 1;
                        const seedDefId = seedDef.id;
                        if (seedDef.stackable > 1) {
                            for (const slot of newInventory) {
                                if (remainingSeed <= 0) break;
                                if (slot.itemId === seedDefId && slot.quantity < seedDef.stackable) {
                                    slot.quantity += 1;
                                    remainingSeed = 0;
                                }
                            }
                        }
                        if (remainingSeed > 0) {
                            if (newInventory.length < INVENTORY_SIZE) {
                                newInventory.push({ itemId: seedDefId, quantity: 1 });
                                lootMessages.push(`1x ${seedDef.name}`);
                            } else {
                                inventoryIsFull = true;
                            }
                        }
                    }
    
                    let finalMessage = `Thu hoạch thành công! Nhận được: ${lootMessages.join(', ')}.`;
                    if (inventoryIsFull) {
                        finalMessage += " Túi đồ đã đầy, một số vật phẩm có thể đã bị thất lạc.";
                    }
                    setGameMessage(finalMessage);
                    addJournalEntry(finalMessage);
    
                    const timeAdvanced = advanceTime(prev.time, 5); // Harvesting takes 5 minutes
                    return { ...prev, plantedPlots: newPlantedPlots, inventory: newInventory, time: timeAdvanced };
                } else {
                    const progress = Math.round((elapsedMins / seedDef.growthTimeMinutes) * 100);
                    setGameMessage(`${grownItemDef?.name || 'Cây trồng'} đang phát triển. Tiến độ: ${progress}%`);
                    return prev;
                }
            } else {
                shouldOpenPlantingMenu = true;
                return prev;
            }
        });
    
        if (shouldOpenPlantingMenu) {
            setPlantingPlot(plot);
        }
    }, [updateAndPersistPlayerState, setGameMessage, setPlantingPlot, addJournalEntry]);


    const handleGenericInteraction = useCallback((target: NPC | Interactable | TeleportLocation | PointOfInterest, interactionFn: () => void) => {
        if (isLoading || interactionBlockers.isMapOpen || interactionBlockers.isInfoPanelOpen || interactionBlockers.isWorldInfoPanelOpen || interactionBlockers.combatState || chatTargetNpc) return;
        stopAllActions.current();

        const dx = target.position.x - playerState.position.x;
        const dy = target.position.y - playerState.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let effectiveInteractionRadius = INTERACTION_RADIUS;
        if ('size' in target) {
            effectiveInteractionRadius = Math.max(INTERACTION_RADIUS, Math.min(target.size.width, target.size.height) / 2);
        }

        if (distance <= effectiveInteractionRadius) {
            updateAndPersistPlayerState(prev => prev ? ({...prev, targetPosition: prev.position}) : prev);
            interactionFn();
        } else {
            const angle = Math.atan2(dy, dx);
            const targetX = target.position.x - Math.cos(angle) * (effectiveInteractionRadius * 0.9);
            const targetY = target.position.y - Math.sin(angle) * (effectiveInteractionRadius * 0.9);
            
            updateAndPersistPlayerState(prev => prev ? ({ ...prev, targetPosition: { x: targetX, y: targetY } }) : prev);
            pendingInteraction.current = interactionFn;
        }
    }, [isLoading, interactionBlockers, playerState.position, updateAndPersistPlayerState, pendingInteraction, chatTargetNpc, stopAllActions]);

    const handleGatherInteractable = useCallback((interactable: Interactable) => {
        setActiveInteractionInteractable(null);

        // Handle specific logic for spirit fields here
        if (interactable.type === 'spirit_field') {
            handleSpiritFieldClick(interactable);
            return;
        }
         if (interactable.type === 'alchemy_furnace') {
            setIsAlchemyPanelOpen(true);
            return;
        }

        updateAndPersistPlayerState(p => p ? {...p, time: advanceTime(p.time, 10)} : p); // Gathering takes 10 minutes
        const template = ALL_INTERACTABLES.find(t => t.baseId === interactable.baseId);

        if (!template || !template.loot) {
            setGameMessage("Không có gì để thu thập ở đây.");
            handleRemoveAndRespawn(interactable);
            return;
        }

        let somethingFound = false;
        template.loot.forEach(lootRule => {
            if (Math.random() < lootRule.chance) {
                const quantity = Math.floor(Math.random() * (lootRule.quantity[1] - lootRule.quantity[0] + 1)) + lootRule.quantity[0];
                if (quantity > 0) {
                    handleAddItemToInventory(lootRule.itemId, quantity);
                    somethingFound = true;
                }
            }
        });
        
        // Add a chance to find a seed when gathering herbs
        if (interactable.type === 'herb' && Math.random() < 0.15) { // 15% chance
            handleAddItemToInventory('seed_linh_thao', 1);
        }
        
        if (!somethingFound) {
            const message = `Thu thập từ ${interactable.name} nhưng không tìm thấy gì cả.`;
            setGameMessage(message);
            addJournalEntry(message);
        }
        
        handleRemoveAndRespawn(interactable);

    }, [handleAddItemToInventory, handleRemoveAndRespawn, setGameMessage, updateAndPersistPlayerState, handleSpiritFieldClick, setIsAlchemyPanelOpen, addJournalEntry]);
    
    const handleViewInfoInteractable = useCallback((interactable: Interactable) => {
        setActiveInteractionInteractable(null);
        updateAndPersistPlayerState(p => p ? {...p, time: advanceTime(p.time, 1)} : p); // Viewing info takes 1 minute
        setActiveDialogue({ title: interactable.name, text: interactable.prompt });
    }, [updateAndPersistPlayerState]);

    const handleDestroyInteractable = useCallback((interactable: Interactable) => {
        setActiveInteractionInteractable(null);
        updateAndPersistPlayerState(p => p ? {...p, time: advanceTime(p.time, 2)} : p); // Destroying takes 2 minutes
        const message = `Bạn đã phá hủy ${interactable.name}. Thời gian hồi phục sẽ lâu hơn.`;
        setGameMessage(message);
        addJournalEntry(message);
        handleRemoveAndRespawn(interactable, 4); // 4x respawn time multiplier
    }, [handleRemoveAndRespawn, setGameMessage, updateAndPersistPlayerState, addJournalEntry]);

    const handleStartChat = useCallback((npcToChatWith: NPC) => {
        // Find the most up-to-date version of the NPC from the player state to prevent using a stale object.
        const freshNpc = playerState.generatedNpcs[playerState.currentMap]?.find(n => n.id === npcToChatWith.id);

        if (!freshNpc) {
             setGameMessage(`${npcToChatWith.name} đã không còn ở đây.`);
             setActiveInteractionNpc(null);
             return;
        }

        const npc = freshNpc; // Use the fresh data for chat initiation.

        if (npc.npcType === 'monster') {
            setGameMessage("Không thể trò chuyện với yêu thú.");
            setActiveInteractionNpc(null);
            return;
        }
        stopAllActions.current();
        setActiveInteractionNpc(null);
        const savedHistory = playerState.chatHistories?.[npc.id] || [];
        const chatSession = createChatSession(playerState, npc, savedHistory);
        setActiveChat(chatSession);
        setChatTargetNpc(npc);
        setChatHistory(savedHistory);
    }, [playerState, stopAllActions, setGameMessage]);

    const handleSendMessage = useCallback(async (message: string) => {
        if (!activeChat || isChatLoading || !chatTargetNpc) return;

        const userMessage: ChatMessage = { role: 'user', text: message };
        setChatHistory(prev => [...prev, userMessage]);
        setIsChatLoading(true);

        try {
            const response = await activeChat.sendMessage({ message });
            const tokenCount = response.usageMetadata?.totalTokenCount || 0;
            trackApiCall('sendMessage', tokenCount);
            
            const modelMessage: ChatMessage = { role: 'model', text: response.text };
            
            setChatHistory(prev => [...prev, modelMessage]);

            updateAndPersistPlayerState(p => {
                if (!p) return p;
                const oldSavedHistory = p.chatHistories?.[chatTargetNpc.id] || [];
                const newSavedHistory = [...oldSavedHistory, userMessage, modelMessage];
                const newChatHistories = { ...(p.chatHistories || {}), [chatTargetNpc.id]: newSavedHistory };
                return { ...p, chatHistories: newChatHistories, time: advanceTime(p.time, 1) };
            });

        } catch (error) {
            console.error("Error sending message to Gemini Chat:", error);
            const errorMessage: ChatMessage = { role: 'model', text: "Một thế lực bí ẩn đã cắt ngang cuộc trò chuyện của chúng ta..." };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsChatLoading(false);
        }
    }, [activeChat, isChatLoading, chatTargetNpc, updateAndPersistPlayerState, trackApiCall]);

    const handleCloseChat = useCallback(() => {
        setActiveChat(null);
        setChatTargetNpc(null);
        setChatHistory([]);
        setIsChatLoading(false);
    }, []);

    const handleGiftItem = useCallback((itemInventoryIndex: number, quantity: number) => {
        if (!chatTargetNpc) return;

        const itemSlot = playerState.inventory[itemInventoryIndex];
        if (!itemSlot || itemSlot.quantity < quantity) {
            setGameMessage("Không đủ vật phẩm để tặng.");
            return;
        }
        const itemDef = ALL_ITEMS.find(i => i.id === itemSlot.itemId);
        if (!itemDef) return;

        updateAndPersistPlayerState((p: PlayerState) => {
            if (!p) return p;
            const currentItemSlot = p.inventory[itemInventoryIndex];
            if (!currentItemSlot || currentItemSlot.quantity < quantity) {
                return p;
            }

            const newInventory = JSON.parse(JSON.stringify(p.inventory));
            if (newInventory[itemInventoryIndex].quantity > quantity) {
                newInventory[itemInventoryIndex].quantity -= quantity;
            } else {
                newInventory.splice(itemInventoryIndex, 1);
            }

            const newGeneratedNpcs = JSON.parse(JSON.stringify(p.generatedNpcs));
            const npcsOnMap = newGeneratedNpcs[p.currentMap] || [];
            const npcIndex = npcsOnMap.findIndex((n: NPC) => n.id === chatTargetNpc.id);
            
            if (npcIndex === -1) return p;

            const currentNpc = npcsOnMap[npcIndex];

            // --- AFFINITY LOGIC ---
            const currentAffinity = p.affinity?.[chatTargetNpc.id] || 0;
            const affinityChange = calculateGiftAffinityChange(currentNpc, itemDef, currentAffinity, 0);
            const newAffinityScore = Math.max(-100, Math.min(100, currentAffinity + affinityChange));
            const newAffinity = {
                ...p.affinity,
                [chatTargetNpc.id]: newAffinityScore,
            };

            // --- INVENTORY LOGIC ---
            if (!currentNpc.inventory) currentNpc.inventory = [];
            let remainingQuantity = quantity;
            if (itemDef.stackable > 1) {
                for (const npcSlot of currentNpc.inventory) {
                    if (remainingQuantity <= 0) break;
                    if (npcSlot.itemId === itemDef.id && npcSlot.quantity < itemDef.stackable) {
                        const canAdd = itemDef.stackable - npcSlot.quantity;
                        const amountToAdd = Math.min(remainingQuantity, canAdd);
                        npcSlot.quantity += amountToAdd;
                        remainingQuantity -= amountToAdd;
                    }
                }
            }
            while(remainingQuantity > 0) {
                const amountForNewStack = Math.min(remainingQuantity, itemDef.stackable);
                currentNpc.inventory.push({ itemId: itemDef.id, quantity: amountForNewStack });
                remainingQuantity -= amountForNewStack;
            }

            return { ...p, inventory: newInventory, generatedNpcs: newGeneratedNpcs, affinity: newAffinity };
        });
        
        handleSendMessage(`(Hệ thống: ${playerState.name} đã tặng bạn ${quantity}x ${itemDef.name}.)`);

    }, [chatTargetNpc, playerState, updateAndPersistPlayerState, handleSendMessage, setGameMessage]);

    const handleGiftLinhThach = useCallback((amount: number) => {
        if (!chatTargetNpc || amount <= 0) return;
        
        if (playerState.linhThach < amount) {
            setGameMessage("Không đủ Linh Thạch để tặng.");
            return;
        }

        updateAndPersistPlayerState((p: PlayerState) => {
            if (!p || p.linhThach < amount) return p;

            const newLinhThach = p.linhThach - amount;

            const newGeneratedNpcs = JSON.parse(JSON.stringify(p.generatedNpcs));
            const npcsOnMap = newGeneratedNpcs[p.currentMap] || [];
            const npcIndex = npcsOnMap.findIndex((n: NPC) => n.id === chatTargetNpc.id);

            if (npcIndex === -1) return p;

            const currentNpc = npcsOnMap[npcIndex];

            // --- AFFINITY LOGIC ---
            const currentAffinity = p.affinity?.[chatTargetNpc.id] || 0;
            const affinityChange = calculateGiftAffinityChange(currentNpc, null, currentAffinity, amount);
            const newAffinityScore = Math.max(-100, Math.min(100, currentAffinity + affinityChange));
            const newAffinity = {
                ...p.affinity,
                [chatTargetNpc.id]: newAffinityScore,
            };
            
            // --- LINHTHACH LOGIC ---
            currentNpc.linhThach = (currentNpc.linhThach || 0) + amount;

            return { ...p, linhThach: newLinhThach, generatedNpcs: newGeneratedNpcs, affinity: newAffinity };
        });

        handleSendMessage(`(Hệ thống: ${playerState.name} đã tặng bạn ${amount.toLocaleString()} Linh Thạch.)`);

    }, [chatTargetNpc, playerState, updateAndPersistPlayerState, handleSendMessage, setGameMessage]);

    return {
        activeDialogue, setActiveDialogue,
        activeInteractionNpc, setActiveInteractionNpc,
        activeInteractionInteractable, setActiveInteractionInteractable,
        viewingNpc, setViewingNpc,
        chatTargetNpc,
        chatHistory,
        isChatLoading,
        processInteraction,
        handleTeleport,
        handleEnterPoi,
        handleGenericInteraction,
        handleGatherInteractable,
        handleDestroyInteractable,
        handleViewInfoInteractable,
        handleInitiateTrade,
        handleStartChat,
        handleSendMessage,
        handleCloseChat,
        handleGiftItem,
        handleGiftLinhThach,
    };
};