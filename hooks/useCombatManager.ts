import { useState, useCallback, useRef, useEffect } from 'react';
import type { PlayerState, NPC } from '../types/character';
import type { CombatState, CombatLogEntry, PlayerAction, NpcAction, NpcDecision, ActiveStatusEffect } from '../types/combat';
import type { Interactable } from '../types/interaction';
import * as combatService from '../services/combatService';
import { getNpcDefeatDecision } from '../services/geminiService';
import { ALL_SKILLS } from '../data/skills/skills';
import { EFFECT_TYPE_NAMES } from '../types/skill';
import { REALM_PROGRESSION } from '../constants';
import { ALL_ITEMS } from '../data/items/index';
import type { InventorySlot } from '../types/item';
import { INVENTORY_SIZE } from '../constants';
import { ALL_MONSTERS } from '../data/npcs/monsters';
import { advanceTime } from '../services/timeService';


export const useCombatManager = (
    playerState: PlayerState,
    setPlayerState: React.Dispatch<React.SetStateAction<PlayerState | null>>,
    setGameMessage: (message: string | null) => void,
    initialStopAllActions: () => void,
    handleAddItemToInventory: (itemId: string, quantity: number) => void,
    handleAddLinhThach: (amount: number) => void
) => {
    const [combatState, setCombatState] = useState<CombatState | null>(null);
    const stopAllActions = useRef(initialStopAllActions);

    const addCombatLog = useCallback((message: string, type: CombatLogEntry['type'] = 'info') => {
        setCombatState(cs => {
            if (!cs) return null;
            const newLogEntry: CombatLogEntry = { turn: cs.turn, message, type };
            return { ...cs, log: [...cs.log, newLogEntry] };
        });
    }, []);

    const showDamage = useCallback((target: 'player' | 'npc', amount: number | string, type: 'damage' | 'heal' | 'evade' | 'critical' | 'effect') => {
        setCombatState(cs => cs ? { ...cs, damageToShow: { target, amount, type } } : null);
        setTimeout(() => setCombatState(cs => cs ? { ...cs, damageToShow: undefined } : null), 1000);
    }, []);

    const handleChallenge = useCallback((npc: NPC) => {
        stopAllActions.current();
        setGameMessage(null);
        setCombatState({
            player: { ...playerState, activeEffects: [] },
            npc: { ...npc, activeEffects: [] }, // Create a copy for combat
            isPlayerTurn: playerState.stats.speed >= npc.stats.speed,
            turn: 1,
            log: [{ turn: 1, message: `Trận chiến với ${npc.name} đã bắt đầu!`, type: 'info' }],
            combatEnded: false,
            isProcessing: false,
        });
    }, [playerState, setGameMessage]);
    
    const closeCombatScreen = useCallback(() => {
        const cs = combatState;
        if (cs && cs.winner === 'npc' && cs.npcDecision?.decision === 'spare') {
            setPlayerState(prev => {
                    if (!prev) return null;
                    const finalHp = cs.player.hp <= 0 ? 1 : cs.player.hp;
                    return {...prev, hp: finalHp};
            });
        }
        setCombatState(null);
    }, [combatState, setPlayerState]);

    const handlePlayerDeathAndRespawn = useCallback(() => {
        const linhThachLost = playerState.linhThach - Math.floor(playerState.linhThach / 2);
        setGameMessage(`Bạn đã mất ${linhThachLost.toLocaleString()} Linh Thạch!`);
        
        setPlayerState(prev => {
            if (!prev) return null;

            return {
                ...prev,
                hp: Math.max(1, Math.round(prev.stats.maxHp * 0.1)),
                qi: 0,
                linhThach: Math.floor(prev.linhThach / 2),
                currentMap: 'THIEN_NAM',
                position: { x: 3800, y: 1800 },
                targetPosition: { x: 3800, y: 1800 },
            };
        });
        setCombatState(null);
    }, [playerState, setPlayerState, setGameMessage]);

    const handleKillNpc = useCallback(() => {
        if (!combatState || !combatState.npc) return;
        const { npc, camNgoGained = 0, player: playerInCombat } = combatState;
        const isMonster = npc.npcType === 'monster';

        // --- Calculate Loot ---
        const allLootItems: InventorySlot[] = [];
        if (isMonster && npc.lootTable) {
            npc.lootTable.forEach(loot => {
                if (Math.random() < loot.chance) {
                    const quantity = Math.floor(Math.random() * (loot.quantity[1] - loot.quantity[0] + 1)) + loot.quantity[0];
                    if (quantity > 0) allLootItems.push({ itemId: loot.itemId, quantity });
                }
            });
        } else if (!isMonster) {
             const lootableInventory = [...npc.inventory];
            Object.values(npc.equipment).forEach(equippedItem => {
                if (equippedItem && !lootableInventory.find(i => i.itemId === equippedItem.itemId)) {
                    lootableInventory.push(equippedItem);
                }
            });
            allLootItems.push(...lootableInventory);
        }
        
        // --- Create Loot Message ---
        const lootMessages: string[] = [];
        if (npc.linhThach > 0) {
            lootMessages.push(`${npc.linhThach.toLocaleString()} Linh Thạch`);
        }
        allLootItems.forEach(itemLoot => {
            const itemDef = ALL_ITEMS.find(i => i.id === itemLoot.itemId);
            if (itemDef) {
                lootMessages.push(`${itemLoot.quantity}x ${itemDef.name}`);
            }
        });
        const finalLootMessage = lootMessages.length > 0 ? ` Chiến lợi phẩm: ${lootMessages.join(', ')}.` : '';
        const gameWinMessage = `Đã kết liễu ${npc.name}. Nhận ${camNgoGained} Cảm Ngộ.${finalLootMessage}`;

        // --- Update Player State ---
        setPlayerState(p => {
            if (!p) return null;

            let newPlayerState = { ...p };

            // 1. Update player stats from combat
            newPlayerState.hp = playerInCombat.hp;
            newPlayerState.mana = playerInCombat.mana;
            newPlayerState.camNgo += camNgoGained;
            newPlayerState.activeEffects = [];
            
            // 2. Handle NPC state (defeat vs respawn)
            newPlayerState.defeatedNpcIds = [...new Set([...p.defeatedNpcIds, npc.id])];
            
            if (isMonster) {
                // Add monster to respawn queue
                if (npc.baseId && typeof npc.level === 'number') {
                    const template = ALL_MONSTERS.find(m => m.baseId === npc.baseId);
                    if (template && template.respawnTimeMinutes) {
                        const [min, max] = template.respawnTimeMinutes;
                        const respawnTimeMins = Math.floor(Math.random() * (max - min + 1)) + min;
                        const respawnAt = advanceTime(p.time, respawnTimeMins);
                        const newRespawningNpc = {
                            originalId: npc.id,
                            baseId: npc.baseId,
                            level: npc.level,
                            mapId: p.currentMap,
                            originalPosition: npc.position,
                            respawnAt,
                        };
                        newPlayerState.respawningNpcs = [...(p.respawningNpcs || []), newRespawningNpc];
                    }
                } else {
                    console.warn(`Attempted to kill monster (id: ${npc.id}, name: ${npc.name}) without a baseId or level. It will not respawn.`);
                }
            }
            
            // 3. Handle loot
            newPlayerState.linhThach += npc.linhThach;
            
            let newInventory: InventorySlot[] = JSON.parse(JSON.stringify(p.inventory));
            allLootItems.forEach(itemLoot => {
                const itemDef = ALL_ITEMS.find(i => i.id === itemLoot.itemId);
                if (!itemDef) return;

                let remainingQuantity = itemLoot.quantity;
                if (itemDef.stackable > 1) {
                    for (const slot of newInventory) {
                        if (remainingQuantity <= 0) break;
                        if (slot.itemId === itemLoot.itemId && slot.quantity < itemDef.stackable) {
                            const canAdd = itemDef.stackable - slot.quantity;
                            const amountToStack = Math.min(remainingQuantity, canAdd);
                            slot.quantity += amountToStack;
                            remainingQuantity -= amountToStack;
                        }
                    }
                }
                while (remainingQuantity > 0 && newInventory.length < INVENTORY_SIZE) {
                    const amountForNewStack = Math.min(remainingQuantity, itemDef.stackable);
                    newInventory.push({ itemId: itemDef.id, quantity: amountForNewStack });
                    remainingQuantity -= amountForNewStack;
                }
            });
            newPlayerState.inventory = newInventory;
            
            return newPlayerState;
        });

        // --- Final UI updates ---
        setTimeout(() => setGameMessage(gameWinMessage), 100);
        setCombatState(null);
    }, [combatState, setPlayerState, setGameMessage]);
    
    const handleSpareNpc = useCallback(() => {
        if (!combatState || !combatState.npc || combatState.npc.npcType === 'monster') return;
        const { npc, player: playerInCombat } = combatState;
        const camNgoGained = Math.floor((combatState.camNgoGained || 0) / 2);
    
        setGameMessage(`Bạn đã tha mạng cho ${npc.name} và nhận được ${camNgoGained} điểm Cảm Ngộ.`);
    
        setPlayerState(p => {
            if (!p) return null;
            
            const newPlayerState = { ...p };
            
            // Update player stats from combat
            newPlayerState.hp = playerInCombat.hp;
            newPlayerState.mana = playerInCombat.mana;
            newPlayerState.camNgo = p.camNgo + camNgoGained;
            newPlayerState.activeEffects = [];
    
            // Add the spared NPC to the defeated list to make them disappear.
            newPlayerState.defeatedNpcIds = [...new Set([...p.defeatedNpcIds, npc.id])];
    
            return newPlayerState;
        });
    
        setCombatState(null);
    }, [combatState, setGameMessage, setPlayerState]);

    const processCombatEnd = useCallback((winner: 'player' | 'npc') => {
        setCombatState(cs => {
            if (!cs || cs.combatEnded) return cs;
            
            addCombatLog(winner === 'player' ? `Bạn đã chiến thắng!` : `Bạn đã bị đánh bại!`, 'info');

            const newState: CombatState = { ...cs, winner, combatEnded: true, isProcessing: true };
            
            if (winner === 'npc') {
                if (cs.npc.npcType === 'monster') {
                    const decision: NpcDecision = { decision: 'kill', dialogue: `*${cs.npc.name} gầm lên một tiếng rồi lao tới kết liễu bạn!*` };
                    newState.isProcessing = false;
                    newState.npcDecision = decision;
                } else {
                    getNpcDefeatDecision(cs.npc, cs.player).then(decision => {
                        setCombatState(s => s ? { ...s, isProcessing: false, npcDecision: decision } : null);
                    });
                }
            } else {
                 const camNgoGained = cs.npc.npcType === 'monster' 
                    ? Math.max(5, Math.round(5 + (cs.npc.level || 1) * 2 + cs.npc.stats.maxHp / 50))
                    : Math.max(5, Math.round(10 + ((cs.npc.cultivation?.realmIndex ?? 0) * 15 + (cs.npc.cultivation?.level ?? 0)) - (cs.player.cultivation.realmIndex * 15 + cs.player.cultivation.level) * 2 + cs.npc.stats.maxHp / 50));

                 newState.camNgoGained = camNgoGained;
                 newState.isProcessing = false; // Player won, no more processing needed
            }

            return newState;
        });
    }, [addCombatLog]);

    const processTurn = useCallback(<A extends PlayerState | NPC, D extends PlayerState | NPC>(attackerState: A, defenderState: D, action: PlayerAction | NpcAction): { updatedAttacker: A, updatedDefender: D, endWinner?: 'player' | 'npc'} => {
        const updatedAttacker: A = { ...attackerState };
        const updatedDefender: D = { ...defenderState };
        const attackerIsPlayer = 'camNgo' in attackerState;
        const targetSide = attackerIsPlayer ? 'npc' : 'player';
        
        if (action.type === 'ATTACK') {
            const result = combatService.calculateDamage({ stats: updatedAttacker.stats }, { stats: updatedDefender.stats });
            if (result.isEvaded) {
                addCombatLog(`${updatedAttacker.name} tấn công, nhưng ${updatedDefender.name} đã né được!`, 'evade');
                showDamage(targetSide, 'Né', 'evade');
            } else {
                updatedDefender.hp = Math.max(0, updatedDefender.hp - result.damage);
                const logType = result.isCritical ? 'critical' : 'damage';
                const damageType = result.isCritical ? 'critical' : 'damage';
                addCombatLog(`${updatedAttacker.name} gây ${result.damage} sát thương cho ${updatedDefender.name}.${result.isCritical ? ' Thật là một đòn chí mạng!' : ''}`, logType);
                showDamage(targetSide, result.damage, damageType);
            }
        } else if (action.type === 'SKILL' && action.skillId) {
            const skillDef = ALL_SKILLS.find(s => s.id === action.skillId);
            const learnedSkill = updatedAttacker.learnedSkills.find(s => s.skillId === action.skillId);
            
            if (skillDef && learnedSkill) {
                const manaCost = (skillDef.manaCost || 0) + ((skillDef.manaCostPerLevel || 0) * (learnedSkill.currentLevel -1));
                updatedAttacker.mana -= manaCost;
                addCombatLog(`${updatedAttacker.name} sử dụng [${skillDef.name}]!`, 'info');

                const result = combatService.calculateSkillDamage({state: updatedAttacker}, skillDef, learnedSkill, {state: updatedDefender});

                if (result.incompatibilityPenalty) {
                    addCombatLog(`Nhưng do vũ khí không phù hợp, uy lực của [${skillDef.name}] đã giảm đi đáng kể!`, 'info');
                }

                if (result.isEvaded) {
                     addCombatLog(`Nhưng ${updatedDefender.name} đã né được!`, 'evade');
                     showDamage(targetSide, 'Né', 'evade');
                } else {
                    updatedDefender.hp = Math.max(0, updatedDefender.hp - result.damage);
                    const logType = result.isCritical ? 'critical' : 'damage';
                    const damageType = result.isCritical ? 'critical' : 'damage';
                    addCombatLog(`Kỹ năng gây ${result.damage} sát thương cho ${updatedDefender.name}.${result.isCritical ? ' Thật là một đòn chí mạng!' : ''}`, logType);
                    showDamage(targetSide, result.damage, damageType);
                }
                 // Apply status effects
                if (skillDef.effects) {
                    skillDef.effects.forEach(effectDef => {
                        if (Math.random() < effectDef.chance) {
                            const newEffect: ActiveStatusEffect = {
                                type: effectDef.type,
                                duration: effectDef.duration || 1,
                                value: (effectDef.value || 0) + ((effectDef.valuePerLevel || 0) * (learnedSkill.currentLevel - 1)),
                                sourceSkillId: skillDef.id,
                            };
                            
                            const existingEffectIndex = updatedDefender.activeEffects.findIndex(e => e.type === newEffect.type);
                            if (existingEffectIndex > -1) {
                                updatedDefender.activeEffects[existingEffectIndex] = newEffect;
                            } else {
                                updatedDefender.activeEffects.push(newEffect);
                            }
                            addCombatLog(`${skillDef.name} đã gây hiệu ứng [${EFFECT_TYPE_NAMES[effectDef.type]}] lên ${updatedDefender.name}!`, 'info');
                        }
                    });
                }
            }
        }

        let endWinner: 'player' | 'npc' | undefined = undefined;
        if (updatedDefender.hp <= 0) {
            endWinner = attackerIsPlayer ? 'player' : 'npc';
        }
        
        return { updatedAttacker, updatedDefender, endWinner };

    }, [addCombatLog, showDamage]);

    const processAndTickEffects = useCallback(<T extends PlayerState | NPC>(combatant: T): { updatedCombatant: T, wasStunned: boolean } => {
        let wasStunned = false;
        let totalDamage = 0;
        const combatantAfterEffects: T = { ...combatant, activeEffects: [...combatant.activeEffects] };
        
        // Process turn-start effects
        for (const effect of combatantAfterEffects.activeEffects) {
            switch(effect.type) {
                case 'STUN':
                    wasStunned = true;
                    showDamage('camNgo' in combatantAfterEffects ? 'player' : 'npc', 'Choáng', 'effect');
                    addCombatLog(`${combatant.name} bị choáng và không thể hành động!`, 'info');
                    break;
                case 'BURN':
                    const burnDamage = effect.value;
                    combatantAfterEffects.hp = Math.max(0, combatantAfterEffects.hp - burnDamage);
                    totalDamage += burnDamage;
                    addCombatLog(`${combatant.name} bị thiêu đốt, mất ${burnDamage} sinh lực.`, 'damage');
                    break;
            }
        }
        
        if (totalDamage > 0) {
             showDamage('camNgo' in combatantAfterEffects ? 'player' : 'npc', totalDamage, 'damage');
        }

        // Tick down durations
        const nextEffects = combatantAfterEffects.activeEffects
            .map(effect => ({ ...effect, duration: effect.duration - 1 }))
            .filter(effect => {
                if (effect.duration > 0) {
                    return true;
                }
                addCombatLog(`Hiệu ứng [${EFFECT_TYPE_NAMES[effect.type]}] trên ${combatant.name} đã kết thúc.`, 'info');
                return false;
            });

        combatantAfterEffects.activeEffects = nextEffects;

        return { updatedCombatant: combatantAfterEffects, wasStunned };
    }, [addCombatLog, showDamage]);

    const handleCombatAction = useCallback((action: PlayerAction) => {
        setCombatState(cs => {
            if (!cs || cs.isProcessing || cs.combatEnded) return cs;

            // Player's start-of-turn processing
            const { updatedCombatant: playerAfterEffects, wasStunned } = processAndTickEffects(cs.player);

            if (playerAfterEffects.hp <= 0) {
                processCombatEnd('npc');
                return { ...cs, player: playerAfterEffects };
            }

            if (wasStunned) {
                // Player is stunned, their turn is skipped. Immediately set to NPC's turn.
                return { ...cs, player: playerAfterEffects, isPlayerTurn: false, isProcessing: false };
            }
            
            // --- Process player action ---
            let updatedNpcState = cs.npc;
            let finalPlayerState = playerAfterEffects;

            if (action.type === 'FLEE') {
                addCombatLog('Bạn đang cố gắng bỏ chạy...', 'info');
                const fleeChance = Math.max(0.1, Math.min(0.9, 0.5 + (finalPlayerState.stats.speed - cs.npc.stats.speed) * 0.02));
                if (Math.random() < fleeChance) {
                    addCombatLog('Bỏ chạy thành công!', 'info');
                    setGameMessage('Bạn đã trốn thoát khỏi trận chiến.');
                    setTimeout(() => closeCombatScreen(), 500);
                    return { ...cs, combatEnded: true, isProcessing: true };
                } else {
                    addCombatLog('Bỏ chạy thất bại! Bạn mất lượt.', 'info');
                }
            } else if (action.type === 'SKIP') {
                addCombatLog('Bạn đã chọn bỏ qua lượt này.', 'info');
            } else { // ATTACK or SKILL
                const { updatedAttacker, updatedDefender, endWinner } = processTurn(finalPlayerState, updatedNpcState, action);
                
                finalPlayerState = updatedAttacker;
                updatedNpcState = updatedDefender;

                if (endWinner) {
                    processCombatEnd(endWinner);
                    return { ...cs, player: finalPlayerState, npc: updatedNpcState };
                }
            }

            // --- Set state to trigger NPC turn via useEffect ---
            return { ...cs, player: finalPlayerState, npc: updatedNpcState, isPlayerTurn: false, isProcessing: false };
        });
    }, [processTurn, processCombatEnd, addCombatLog, processAndTickEffects, setGameMessage, closeCombatScreen]);

    useEffect(() => {
        if (combatState && !combatState.isPlayerTurn && !combatState.isProcessing && !combatState.combatEnded) {
            setCombatState(cs => cs ? { ...cs, isProcessing: true } : null);
            
            setTimeout(() => {
                setCombatState(currentState => {
                    if (!currentState || currentState.combatEnded) return currentState;
                    
                    const { updatedCombatant: npcAfterEffects, wasStunned } = processAndTickEffects(currentState.npc);

                    if (npcAfterEffects.hp <= 0) {
                        processCombatEnd('player');
                        return { ...currentState, npc: npcAfterEffects };
                    }

                    if (wasStunned) {
                         return { ...currentState, npc: npcAfterEffects, isPlayerTurn: true, isProcessing: false, turn: currentState.turn + 1 };
                    }

                    const npcAction = combatService.getNpcDeterministicAction({...currentState, npc: npcAfterEffects}, ALL_SKILLS);
                    addCombatLog(`${npcAfterEffects.name} đang suy tính. ${npcAction.reasoning}`, 'info');

                    setTimeout(() => {
                        setCombatState(s => {
                            if (!s || s.combatEnded) return s;
                            const { updatedAttacker: finalNpc, updatedDefender: finalPlayer, endWinner } = processTurn(npcAfterEffects, s.player, npcAction);
                             if (endWinner) processCombatEnd(endWinner);
                             return { ...s, player: finalPlayer, npc: finalNpc, isPlayerTurn: true, isProcessing: false, turn: s.turn + 1 };
                        });
                    }, 1500);

                     return {...currentState, npc: npcAfterEffects, isProcessing: true };
                });
            }, 1000);
        }
    }, [combatState?.isPlayerTurn, combatState?.isProcessing, combatState?.combatEnded, processAndTickEffects, processCombatEnd, processTurn, addCombatLog]);


    return {
        combatState,
        handleChallenge,
        handleCombatAction,
        closeCombatScreen,
        handleKillNpc,
        handleSpareNpc,
        handlePlayerDeathAndRespawn,
        stopAllActions,
    };
};