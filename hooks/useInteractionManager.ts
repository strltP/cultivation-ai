import { useState, useCallback, useRef } from 'react';
import type { PlayerState, NPC, ChatMessage } from '../types/character';
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

type InteractionDependencies = {
    handleAddItemToInventory: (itemIdToAdd: string, quantityToAdd: number) => void;
    handleAddLinhThach: (amount: number) => void;
    handleRemoveAndRespawn: (interactable: Interactable, respawnTimeMultiplier?: number) => void;
    handleChallenge: (npc: NPC) => void;
    handleInitiateTrade: (npc: NPC) => void;
    setPlantingPlot: (plot: Interactable | null) => void;
    setIsAlchemyPanelOpen: (isOpen: boolean) => void;
    allMaps: Record<string, GameMap>;
};

type InteractionBlockers = { 
    isMapOpen: boolean; 
    isInfoPanelOpen: boolean;
    isWorldInfoPanelOpen: boolean;
    combatState: any; 
};

export const useInteractionManager = (
    playerState: PlayerState,
    setPlayerState: React.Dispatch<React.SetStateAction<PlayerState | null>>,
    isLoading: boolean,
    setIsLoading: (loading: boolean) => void,
    setGameMessage: (message: string | null) => void,
    pendingInteraction: React.MutableRefObject<(() => void) | null>,
    interactionBlockers: InteractionBlockers,
    dependencies: InteractionDependencies
) => {
    const [activeDialogue, setActiveDialogue] = useState<Dialogue | null>(null);
    const [activeInteractionNpc, setActiveInteractionNpc] = useState<NPC | null>(null);
    const [activeInteractionInteractable, setActiveInteractionInteractable] = useState<Interactable | null>(null);
    const [viewingNpc, setViewingNpc] = useState<NPC | null>(null);
    const stopAllActions = useRef(() => {});

    // Chat state
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [chatTargetNpc, setChatTargetNpc] = useState<NPC | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
    
    const { handleAddItemToInventory, handleAddLinhThach, handleRemoveAndRespawn, handleChallenge, handleInitiateTrade, setPlantingPlot, setIsAlchemyPanelOpen, allMaps } = dependencies;

    const processInteraction = useCallback(async (target: Interactable) => {
        stopAllActions.current();
        setActiveInteractionInteractable(null);
        
        setPlayerState(p => p ? {...p, time: advanceTime(p.time, 5)} : p);
        const currentState = playerState ? { ...playerState, time: advanceTime(playerState.time, 5)} : null;
        if (!currentState) return;

        setIsLoading(true);
        const response = await getInteractionResponse(currentState, target, ALL_ITEMS);
        setIsLoading(false);

        if (!response) {
            setGameMessage("Tương tác thất bại, dường như có một sức mạnh vô hình cản trở.");
            return;
        }

        setActiveDialogue({ title: target.name, text: response.dialogue });
        
        if (response.linhThach && response.linhThach > 0) {
            handleAddLinhThach(response.linhThach);
        }

        if (response.loot && response.loot.length > 0) {
            response.loot.forEach(itemLoot => {
                const itemDef = ALL_ITEMS.find(i => i.name === itemLoot.itemName);
                if (itemDef) {
                    handleAddItemToInventory(itemDef.id, itemLoot.quantity);
                } else {
                    console.warn(`Received unknown item from Gemini: ${itemLoot.itemName}`);
                }
            });
        }
        
        if (target.type === 'chest') {
            handleRemoveAndRespawn(target as Interactable);
        }
    }, [playerState, setPlayerState, setIsLoading, setGameMessage, handleAddLinhThach, handleAddItemToInventory, handleRemoveAndRespawn]);

    const handleTeleport = useCallback((gate: TeleportLocation) => {
        stopAllActions.current();
        setIsLoading(true);
        const targetMapName = allMaps[gate.targetMap].name;
        setGameMessage(`Đang chuẩn bị truyền tống đến ${targetMapName}...`);

        setTimeout(() => {
            setPlayerState(prev => {
                if (!prev) return null;
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
    }, [setPlayerState, setIsLoading, setGameMessage, allMaps]);
    
    const handleEnterPoi = useCallback((poi: PointOfInterest) => {
        if (!poi.targetMap || !poi.targetPosition) return;
        stopAllActions.current();
        setIsLoading(true);
        setGameMessage(`Đang tiến vào ${poi.name}...`);
        
        setTimeout(() => {
            setPlayerState(prev => {
                if (!prev) return null;
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
    }, [setPlayerState, setIsLoading, setGameMessage]);

    const handleSpiritFieldClick = useCallback((plot: Interactable) => {
        const plantedPlot = playerState.plantedPlots?.find(p => p.plotId === plot.id);

        if (plantedPlot) {
            const seedDef = ALL_ITEMS.find(i => i.id === plantedPlot.seedId);
            if (!seedDef || !seedDef.growthTimeMinutes) {
                setGameMessage("Cây trồng này có vấn đề, không thể xác định thời gian lớn.");
                return;
            }

            const currentTimeMins = gameTimeToMinutes(playerState.time);
            const plantedTimeMins = gameTimeToMinutes(plantedPlot.plantedAt);
            const elapsedMins = currentTimeMins - plantedTimeMins;
            const grownItemDef = ALL_ITEMS.find(i => i.id === seedDef.growsIntoItemId);

            if (elapsedMins >= seedDef.growthTimeMinutes) {
                if (!grownItemDef) {
                    setGameMessage("Lỗi: Không tìm thấy vật phẩm trưởng thành từ hạt giống này.");
                    return;
                }

                setPlayerState(prev => {
                    if (!prev) return null;

                    const newPlantedPlots = (prev.plantedPlots || []).filter(p => p.plotId !== plot.id);
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

                    const timeAdvanced = advanceTime(prev.time, 5); // Harvesting takes 5 minutes
                    return { ...prev, plantedPlots: newPlantedPlots, inventory: newInventory, time: timeAdvanced };
                });
            } else {
                const progress = Math.round((elapsedMins / seedDef.growthTimeMinutes) * 100);
                setGameMessage(`${grownItemDef?.name || 'Cây trồng'} đang phát triển. Tiến độ: ${progress}%`);
            }
        } else {
            setPlantingPlot(plot);
        }
        setActiveInteractionInteractable(null);
    }, [playerState, setGameMessage, setPlantingPlot, setPlayerState]);


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
            setPlayerState(prev => prev ? ({...prev, targetPosition: prev.position}) : null);
            interactionFn();
        } else {
            const angle = Math.atan2(dy, dx);
            const targetX = target.position.x - Math.cos(angle) * (effectiveInteractionRadius * 0.9);
            const targetY = target.position.y - Math.sin(angle) * (effectiveInteractionRadius * 0.9);
            
            setPlayerState(prev => prev ? ({ ...prev, targetPosition: { x: targetX, y: targetY } }) : null);
            pendingInteraction.current = interactionFn;
        }
    }, [isLoading, interactionBlockers, playerState.position, setPlayerState, pendingInteraction, chatTargetNpc]);

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

        setPlayerState(p => p ? {...p, time: advanceTime(p.time, 10)} : p); // Gathering takes 10 minutes
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
            setGameMessage("Thu thập thất bại, bạn không tìm thấy gì cả.");
        }
        
        handleRemoveAndRespawn(interactable);

    }, [handleAddItemToInventory, handleRemoveAndRespawn, setGameMessage, setPlayerState, handleSpiritFieldClick, setIsAlchemyPanelOpen]);
    
    const handleViewInfoInteractable = useCallback((interactable: Interactable) => {
        setActiveInteractionInteractable(null);
        setPlayerState(p => p ? {...p, time: advanceTime(p.time, 1)} : p); // Viewing info takes 1 minute
        setActiveDialogue({ title: interactable.name, text: interactable.prompt });
    }, [setPlayerState]);

    const handleDestroyInteractable = useCallback((interactable: Interactable) => {
        setActiveInteractionInteractable(null);
        setPlayerState(p => p ? {...p, time: advanceTime(p.time, 2)} : p); // Destroying takes 2 minutes
        setGameMessage(`Bạn đã phá hủy ${interactable.name}. Thời gian hồi phục sẽ lâu hơn.`);
        handleRemoveAndRespawn(interactable, 4); // 4x respawn time multiplier
    }, [handleRemoveAndRespawn, setGameMessage, setPlayerState]);

    const handleStartChat = useCallback((npc: NPC) => {
        stopAllActions.current();
        setActiveInteractionNpc(null);
        const savedHistory = playerState.chatHistories?.[npc.id] || [];
        const chatSession = createChatSession(playerState, npc, savedHistory);
        setActiveChat(chatSession);
        setChatTargetNpc(npc);
        setChatHistory(savedHistory.length > 0 ? savedHistory : [{ role: 'model', text: npc.prompt }]);
    }, [playerState]);

    const handleSendMessage = useCallback(async (message: string) => {
        if (!activeChat || isChatLoading || !chatTargetNpc) return;

        const userMessage: ChatMessage = { role: 'user', text: message };
        setChatHistory(prev => [...prev, userMessage]);
        setIsChatLoading(true);

        try {
            const response = await activeChat.sendMessage({ message });
            const modelMessage: ChatMessage = { role: 'model', text: response.text };
            
            setChatHistory(prev => [...prev, modelMessage]);

            setPlayerState(p => {
                if (!p) return null;
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
    }, [activeChat, isChatLoading, chatTargetNpc, setPlayerState]);

    const handleCloseChat = useCallback(() => {
        setActiveChat(null);
        setChatTargetNpc(null);
        setChatHistory([]);
        setIsChatLoading(false);
    }, []);

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
        handleViewInfoInteractable,
        handleDestroyInteractable,
        handleInitiateTrade,
        handleStartChat,
        handleSendMessage,
        handleCloseChat,
        stopAllActions,
    };
};