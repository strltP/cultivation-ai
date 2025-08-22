import { useState, useCallback, useRef, useEffect } from 'react';
import type { PlayerState, NPC, ApiUsageStats } from '../types/character';
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
import { advanceTime, gameTimeToMinutes } from '../services/timeService';
import { calculateSkillAttributesForLevel, calculateSkillEffectiveness } from '../services/cultivationService';
import { FACTIONS } from '../data/factions';


export const useCombatManager = (
    playerState: PlayerState,
    updateAndPersistPlayerState: (updater: (prevState: PlayerState) => PlayerState) => void,
    setGameMessage: (message: string | null) => void,
    addJournalEntry: (message: string, type?: 'player' | 'world') => void,
    stopAllActions: React.MutableRefObject<() => void>,
    handleAddItemToInventory: (itemId: string, quantity: number) => void,
    handleAddLinhThach: (amount: number) => void,
    trackApiCall: (functionName: keyof ApiUsageStats['calls'], tokenCount: number) => void
) => {
    const [combatState, setCombatState] = useState<CombatState | null>(null);

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

    const handleChallenge = useCallback((npcToChallenge: NPC) => {
        // Find the most up-to-date version of the NPC from the player state to prevent using a stale object.
        const freshNpc = playerState.generatedNpcs[playerState.currentMap]?.find(n => n.id === npcToChallenge.id);

        // If the NPC can't be found (e.g., despawned), or is already defeated, do nothing.
        if (!freshNpc || playerState.defeatedNpcIds.includes(freshNpc.id)) {
            setGameMessage(`${npcToChallenge.name} đã không còn ở đây.`);
            return;
        }

        if (freshNpc.cannotChallengeUntil) {
            const now = gameTimeToMinutes(playerState.time);
            const availableAt = gameTimeToMinutes(freshNpc.cannotChallengeUntil);
            if (now < availableAt) {
                const { year, season, month, day } = freshNpc.cannotChallengeUntil;
                setGameMessage(`${freshNpc.name} đang dưỡng thương, không thể khiêu chiến cho đến ngày ${day} tháng ${month} năm ${year}.`);
                return;
            }
        }

        const npc = freshNpc; // Use the fresh data for combat initiation.

        stopAllActions.current();
        setGameMessage(null);
        addJournalEntry(`Bạn đã khiêu chiến với ${npc.name}.`);
        setCombatState({
            player: { ...playerState, activeEffects: [] },
            npc: { ...npc, activeEffects: [] }, // Create a copy for combat
            isPlayerTurn: playerState.stats.speed >= npc.stats.speed,
            turn: 1,
            log: [{ turn: 1, message: `Trận chiến với ${npc.name} đã bắt đầu!`, type: 'info' }],
            combatEnded: false,
            isProcessing: false,
        });
    }, [playerState, setGameMessage, stopAllActions, addJournalEntry]);
    
    const closeCombatScreen = useCallback(() => {
        const cs = combatState;
        if (cs && cs.winner === 'npc' && cs.npcDecision?.decision === 'spare') {
            updateAndPersistPlayerState(prev => {
                    if (!prev) return prev;
                    const finalHp = cs.player.hp <= 0 ? 1 : cs.player.hp;
                    return {...prev, hp: finalHp};
            });
        }
        setCombatState(null);
    }, [combatState, updateAndPersistPlayerState]);

    const handlePlayerDeathAndRespawn = useCallback(() => {
        const linhThachLost = playerState.linhThach - Math.floor(playerState.linhThach / 2);
        const message = `Bạn đã bị đánh bại và trọng thương! Mất ${linhThachLost.toLocaleString()} Linh Thạch và bị đưa trở về Tân Thủ Thôn.`
        setGameMessage(message);
        addJournalEntry(message);
        
        updateAndPersistPlayerState(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                hp: Math.max(1, Math.round(prev.stats.maxHp * 0.1)),
                qi: 0,
                linhThach: Math.floor(prev.linhThach / 2),
                currentMap: 'LUC_YEN_THON',
                position: { x: 1000, y: 700 },
                targetPosition: { x: 1000, y: 700 },
            };
        });
        setCombatState(null);
    }, [playerState, updateAndPersistPlayerState, setGameMessage, addJournalEntry]);

    const handleFactionSuccession = useCallback((defeatedNpc: NPC, currentState: PlayerState): PlayerState => {
        const MIN_POWER_FOR_SUCCESSION = 50;

        if (!defeatedNpc.factionId || !defeatedNpc.power || defeatedNpc.power < MIN_POWER_FOR_SUCCESSION) {
            return currentState;
        }

        const faction = FACTIONS.find(f => f.id === defeatedNpc.factionId);
        if (!faction) return currentState;

        const allNpcsInFaction = Object.values(currentState.generatedNpcs).flat().filter(
            n => n.factionId === defeatedNpc.factionId && n.id !== defeatedNpc.id && !currentState.defeatedNpcIds.includes(n.id)
        );

        if (allNpcsInFaction.length === 0) return currentState;
        
        const sortedRoles = [...faction.roles].sort((a, b) => b.power - a.power);
        const defeatedRoleIndex = sortedRoles.findIndex(r => r.name === defeatedNpc.role);
        
        if (defeatedRoleIndex === -1 || defeatedRoleIndex >= sortedRoles.length - 1) {
            // Can't be succeeded or is already lowest rank
            return currentState;
        }

        // Find the best candidate from the next rank down
        const successorRole = sortedRoles[defeatedRoleIndex + 1];
        
        const candidates = allNpcsInFaction
            .filter(n => n.role === successorRole.name)
            .sort((a, b) => {
                // Sort by realm index, then level
                if (a.cultivation!.realmIndex !== b.cultivation!.realmIndex) {
                    return b.cultivation!.realmIndex - a.cultivation!.realmIndex;
                }
                return b.cultivation!.level - a.cultivation!.level;
            });
            
        let successor = candidates[0];

        if (!successor) {
             // No one in the next rank, try one lower
            const nextSuccessorRoleIndex = defeatedRoleIndex + 2;
            if (nextSuccessorRoleIndex < sortedRoles.length) {
                const nextSuccessorRole = sortedRoles[nextSuccessorRoleIndex];
                const nextCandidates = allNpcsInFaction
                    .filter(n => n.role === nextSuccessorRole.name)
                    .sort((a, b) => (b.cultivation?.realmIndex ?? 0) - (a.cultivation?.realmIndex ?? 0));
                successor = nextCandidates[0];
            }
        }

        if (!successor) {
            return currentState;
        }

        const newGeneratedNpcs = JSON.parse(JSON.stringify(currentState.generatedNpcs));
        
        let successorFoundAndUpdated = false;
        for (const mapId in newGeneratedNpcs) {
            const npcIndex = newGeneratedNpcs[mapId].findIndex((n: NPC) => n.id === successor.id);
            if (npcIndex !== -1) {
                newGeneratedNpcs[mapId][npcIndex].role = defeatedNpc.role;
                newGeneratedNpcs[mapId][npcIndex].power = defeatedNpc.power;
                successorFoundAndUpdated = true;
                break;
            }
        }
        
        if (successorFoundAndUpdated) {
            const successionMessage = `${faction.name} chấn động! ${defeatedNpc.role} ${defeatedNpc.name} đã tử trận. ${successor.role} ${successor.name} đã được đề cử lên thay thế, trở thành tân ${defeatedNpc.role}.`;
            // These UI calls will be handled by the calling function.
            // setGameMessage(successionMessage); 
            // addJournalEntry(successionMessage, 'world');
            return { ...currentState, generatedNpcs: newGeneratedNpcs };
        }
        
        return currentState;

    }, []);

    const handleKillNpc = useCallback(() => {
        if (!combatState || !combatState.npc) return;
        const { npc, camNgoGained = 0, player: playerInCombat } = combatState;
        const isMonster = npc.npcType === 'monster';

        // --- Calculate Loot ---
        const allLootItems: InventorySlot[] = [];
        const linhThachDropped = Math.floor((npc.linhThach || 0) * (Math.random() * 0.3 + 0.7)); // 70-100%
        
        if (isMonster && npc.lootTable) {
            npc.lootTable.forEach(loot => {
                if (Math.random() < loot.chance) {
                    const quantity = Math.floor(Math.random() * (loot.quantity[1] - loot.quantity[0] + 1)) + loot.quantity[0];
                    if (quantity > 0) allLootItems.push({ itemId: loot.itemId, quantity });
                }
            });
        } else if (!isMonster) {
            const potentialLoot: { itemSlot: InventorySlot; isEquipped: boolean }[] = [];
            // Add inventory items
            npc.inventory.forEach(item => {
                potentialLoot.push({ itemSlot: item, isEquipped: false });
            });
            // Add equipped items
            Object.values(npc.equipment).forEach(equippedItem => {
                if (equippedItem) {
                     potentialLoot.push({ itemSlot: equippedItem, isEquipped: true });
                }
            });

            potentialLoot.forEach(lootItem => {
                const { itemSlot, isEquipped } = lootItem;
                const dropChance = isEquipped ? 0.7 : 0.9; // 70% for equipped, 90% for inventory

                if (Math.random() < dropChance) {
                    // Drop 50% to 100% of the quantity
                    const quantityToDrop = Math.max(1, Math.ceil(itemSlot.quantity * (Math.random() * 0.5 + 0.5)));
                    
                    const existingLoot = allLootItems.find(l => l.itemId === itemSlot.itemId);
                    if (existingLoot) {
                        existingLoot.quantity += quantityToDrop;
                    } else {
                        allLootItems.push({ itemId: itemSlot.itemId, quantity: quantityToDrop });
                    }
                }
            });
        }
        
        // --- Create Loot Message ---
        const lootMessages: string[] = [];
        if (linhThachDropped > 0) {
            lootMessages.push(`${linhThachDropped.toLocaleString()} Linh Thạch`);
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
        updateAndPersistPlayerState(p => {
            if (!p) return p;

            const ageAtDeath = p.time.year - npc.birthTime.year;
            const newDeathInfo = { ...(p.deathInfo || {}), [npc.id]: { age: ageAtDeath } };

            // Handle Loot
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
            
            let intermediateState = {
                ...p,
                hp: playerInCombat.hp,
                mana: playerInCombat.mana,
                camNgo: p.camNgo + camNgoGained,
                activeEffects: [],
                defeatedNpcIds: [...new Set([...p.defeatedNpcIds, npc.id])],
                deathInfo: newDeathInfo,
                linhThach: p.linhThach + linhThachDropped,
                inventory: newInventory,
            };

            // Call succession logic if it's not a monster
            if (npc.npcType !== 'monster') {
                 const finalState = handleFactionSuccession(npc, intermediateState);
                 const faction = FACTIONS.find(f => f.id === npc.factionId);
                 if (faction && finalState.generatedNpcs !== intermediateState.generatedNpcs) {
                    const successor = Object.values(finalState.generatedNpcs).flat().find(n => n.role === npc.role && n.power === npc.power);
                    if (successor) {
                        const successionMessage = `${faction.name} chấn động! ${npc.role} ${npc.name} đã tử trận. ${successor.role} ${successor.name} đã được đề cử lên thay thế, trở thành tân ${npc.role}.`;
                        setGameMessage(successionMessage);
                        addJournalEntry(successionMessage, 'world');
                    }
                 }
                 return finalState;
            }
           
            return intermediateState;
        });

        // --- Final UI updates ---
        // The timeout gives React a moment to process the state update before closing the combat screen, preventing a race condition.
        setTimeout(() => {
            setGameMessage(gameWinMessage);
            addJournalEntry(gameWinMessage);
            setCombatState(null);
        }, 100);
    }, [combatState, updateAndPersistPlayerState, setGameMessage, addJournalEntry, handleFactionSuccession]);
    
    const handleSpareNpc = useCallback(() => {
        if (!combatState || !combatState.npc || combatState.npc.npcType === 'monster') return;
        const { npc, player: playerInCombat } = combatState;
        const camNgoGained = Math.floor((combatState.camNgoGained || 0) / 2);
    
        const message = `Bạn đã tha mạng cho ${npc.name} và nhận được ${camNgoGained} điểm Cảm Ngộ.`;
    
        updateAndPersistPlayerState(p => {
            if (!p) return p;
            
            // Calculate the challenge cooldown time (1 month)
            const oneMonthInMinutes = 30 * 24 * 60;
            const cannotChallengeUntil = advanceTime(p.time, oneMonthInMinutes);
            
            // Find and update the NPC in the master list
            const newGeneratedNpcs = JSON.parse(JSON.stringify(p.generatedNpcs));
            const npcsOnMap = newGeneratedNpcs[p.currentMap] || [];
            const npcIndex = npcsOnMap.findIndex((n: NPC) => n.id === npc.id);
    
            if (npcIndex !== -1) {
                npcsOnMap[npcIndex].hp = 1;
                npcsOnMap[npcIndex].mana = npc.mana;
                npcsOnMap[npcIndex].cannotChallengeUntil = cannotChallengeUntil;
                npcsOnMap[npcIndex].currentIntent = undefined;
                npcsOnMap[npcIndex].intentProgress = undefined;
            } else {
                console.warn("Could not find spared NPC in master list to update.");
            }
            
            // Update player state
            const newPlayerState = { ...p };
            newPlayerState.hp = playerInCombat.hp;
            newPlayerState.mana = playerInCombat.mana;
            newPlayerState.camNgo = p.camNgo + camNgoGained;
            newPlayerState.activeEffects = [];
            newPlayerState.generatedNpcs = newGeneratedNpcs;
            
            // The spared NPC is NOT added to defeatedNpcIds so they don't disappear.
            
            return newPlayerState;
        });
    
        // The timeout gives React a moment to process the state update before closing the combat screen, preventing a race condition.
        setTimeout(() => {
            setGameMessage(message);
            addJournalEntry(message);
            setCombatState(null);
        }, 100);
    }, [combatState, setGameMessage, updateAndPersistPlayerState, addJournalEntry]);

    const handleNpcDecision = useCallback((cs: CombatState) => {
        getNpcDefeatDecision(cs.npc, cs.player).then(({ data: decision, tokenCount }) => {
            trackApiCall('getNpcDefeatDecision', tokenCount);
            setCombatState(s => s ? { ...s, isProcessing: false, npcDecision: decision } : null);
        });
    }, [trackApiCall]);

    const getCombatEndState = useCallback((currentState: CombatState, winner: 'player' | 'npc'): CombatState => {
        if (currentState.combatEnded) return currentState;

        addCombatLog(winner === 'player' ? `Bạn đã chiến thắng!` : `Bạn đã bị đánh bại!`, 'info');

        const newState: CombatState = { ...currentState, winner, combatEnded: true, isProcessing: true };

        if (winner === 'npc') {
            if (newState.npc.npcType === 'monster') {
                const decision: NpcDecision = { decision: 'kill', dialogue: `*${newState.npc.name} gầm lên một tiếng rồi lao tới kết liễu bạn!*` };
                newState.isProcessing = false;
                newState.npcDecision = decision;
            } else {
                handleNpcDecision(newState);
            }
        } else { // winner === 'player'
            const camNgoGained = newState.npc.npcType === 'monster'
                ? Math.max(5, Math.round(5 + (newState.npc.level || 1) * 2 + newState.npc.stats.maxHp / 50))
                : Math.max(5, Math.round(10 + ((newState.npc.cultivation?.realmIndex ?? 0) * 15 + (newState.npc.cultivation?.level ?? 0)) - (newState.player.cultivation.realmIndex * 15 + newState.player.cultivation.level) * 2 + newState.npc.stats.maxHp / 50));
            newState.camNgoGained = camNgoGained;
            newState.isProcessing = false;
        }
        return newState;
    }, [addCombatLog, handleNpcDecision]);

    const processTurn = useCallback(<A extends PlayerState | NPC, D extends PlayerState | NPC>(attackerState: A, defenderState: D, action: PlayerAction | NpcAction): { updatedAttacker: A, updatedDefender: D, endWinner?: 'player' | 'npc'} => {
        const updatedAttacker: A = { ...attackerState };
        const updatedDefender: D = { ...defenderState };
        const attackerIsPlayer = 'targetPosition' in attackerState;
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
                const calculatedAttrs = calculateSkillAttributesForLevel(skillDef, learnedSkill.currentLevel);
                const totalManaCost = calculatedAttrs.manaCost + Math.floor(updatedAttacker.stats.maxMana * calculatedAttrs.manaCostPercent);

                updatedAttacker.mana -= totalManaCost;
                addCombatLog(`${updatedAttacker.name} sử dụng [${skillDef.name}]!`, 'info');

                if (skillDef.damage) {
                    const result = combatService.calculateSkillDamage({state: updatedAttacker}, skillDef, learnedSkill, {state: updatedDefender});

                    if (result.weaponIncompatibilityPenalty) {
                        addCombatLog(`Nhưng do vũ khí không phù hợp, uy lực của [${skillDef.name}] đã giảm đi đáng kể!`, 'info');
                    }
                     if (result.linhCanEffectiveness) {
                        addCombatLog(`Do linh căn không phù hợp, uy lực của [${skillDef.name}] chỉ phát huy được ${(result.linhCanEffectiveness * 100).toFixed(0)}%!`, 'info');
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
                }

                 // Apply all effects from the calculated attributes
                if (calculatedAttrs.effects) {
                    calculatedAttrs.effects.forEach(effectDef => {
                        if (Math.random() < effectDef.chance) {
                            switch (effectDef.type) {
                                case 'HEAL': {
                                    const effectiveness = calculateSkillEffectiveness(updatedAttacker.linhCan, updatedAttacker.attributes, skillDef);
                                    if (effectiveness < 1.0) {
                                        addCombatLog(`Do linh căn không phù hợp, hiệu quả của [${skillDef.name}] chỉ phát huy được ${(effectiveness * 100).toFixed(0)}%!`, 'info');
                                    }

                                    let healAmount = 0;
                                    if (effectDef.valueIsPercent) {
                                        healAmount = Math.round(updatedAttacker.stats.maxHp * (effectDef.value || 0));
                                    } else {
                                        let flatHeal = effectDef.value || 0;
                                        if (effectDef.scalingAttribute && effectDef.scalingFactor) {
                                            healAmount += updatedAttacker.attributes[effectDef.scalingAttribute] * effectDef.scalingFactor;
                                        }
                                        healAmount = Math.round(flatHeal);
                                    }
                                    
                                    const finalHealAmount = Math.round(healAmount * effectiveness);
                                    const newHp = Math.min(updatedAttacker.stats.maxHp, updatedAttacker.hp + finalHealAmount);
                                    const actualHeal = newHp - updatedAttacker.hp;
                                    updatedAttacker.hp = newHp;
                                    
                                    if (actualHeal > 0) {
                                        addCombatLog(`${updatedAttacker.name} hồi phục ${actualHeal} sinh lực!`, 'heal');
                                        showDamage(attackerIsPlayer ? 'player' : 'npc', actualHeal, 'heal');
                                    }
                                    break;
                                }
                                
                                // Default case for debuffs applied to defender
                                default: {
                                    const newEffect: ActiveStatusEffect = {
                                        type: effectDef.type,
                                        duration: effectDef.duration || 1,
                                        value: effectDef.value || 0,
                                        sourceSkillId: skillDef.id,
                                    };
                                    
                                    const existingEffectIndex = updatedDefender.activeEffects.findIndex(e => e.type === newEffect.type);
                                    if (existingEffectIndex > -1) {
                                        updatedDefender.activeEffects[existingEffectIndex] = newEffect;
                                    } else {
                                        updatedDefender.activeEffects.push(newEffect);
                                    }
                                    addCombatLog(`${skillDef.name} đã gây hiệu ứng [${EFFECT_TYPE_NAMES[effectDef.type]}] lên ${updatedDefender.name}!`, 'info');
                                    break;
                                }
                            }
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
                    showDamage('targetPosition' in combatantAfterEffects ? 'player' : 'npc', 'Choáng', 'effect');
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
             showDamage('targetPosition' in combatantAfterEffects ? 'player' : 'npc', totalDamage, 'damage');
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
                return getCombatEndState({ ...cs, player: playerAfterEffects }, 'npc');
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
                    addJournalEntry(`Bạn đã trốn thoát khỏi trận chiến với ${cs.npc.name}.`);
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
                    return getCombatEndState({ ...cs, player: finalPlayerState, npc: updatedNpcState }, endWinner);
                }
            }

            // --- Set state to trigger NPC turn via useEffect ---
            return { ...cs, player: finalPlayerState, npc: updatedNpcState, isPlayerTurn: false, isProcessing: false };
        });
    }, [processTurn, getCombatEndState, addCombatLog, processAndTickEffects, setGameMessage, closeCombatScreen, addJournalEntry]);

    useEffect(() => {
        if (combatState && !combatState.isPlayerTurn && !combatState.isProcessing && !combatState.combatEnded) {
            setCombatState(cs => cs ? { ...cs, isProcessing: true } : null);
            
            setTimeout(() => {
                setCombatState(currentState => {
                    if (!currentState || currentState.combatEnded) return currentState;
                    
                    const { updatedCombatant: npcAfterEffects, wasStunned } = processAndTickEffects(currentState.npc);

                    if (npcAfterEffects.hp <= 0) {
                        return getCombatEndState({ ...currentState, npc: npcAfterEffects }, 'player');
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
                             
                            if (endWinner) {
                                return getCombatEndState({ ...s, player: finalPlayer, npc: finalNpc }, endWinner);
                            } else {
                                return { ...s, player: finalPlayer, npc: finalNpc, isPlayerTurn: true, isProcessing: false, turn: s.turn + 1 };
                            }
                        });
                    }, 1500);

                     return {...currentState, npc: npcAfterEffects, isProcessing: true };
                });
            }, 1000);
        }
    }, [combatState?.isPlayerTurn, combatState?.isProcessing, combatState?.combatEnded, processAndTickEffects, getCombatEndState, addCombatLog, processTurn]);


    return {
        combatState,
        handleChallenge,
        handleCombatAction,
        closeCombatScreen,
        handleKillNpc,
        handleSpareNpc,
        handlePlayerDeathAndRespawn,
        handleFactionSuccession,
    };
};
