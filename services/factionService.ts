import type { PlayerState, NPC, FactionAssets } from '../types/character';
import type { Item, InventorySlot } from '../types/item';
import { calculateGiftAffinityChange } from './affinityService';
import { FACTIONS } from '../data/factions';

/**
 * Initializes the starting assets for all factions in the game world.
 * This should be called once when a new game is created.
 */
export const initializeFactionAssets = (): Record<string, FactionAssets> => {
    const allFactionAssets: Record<string, FactionAssets> = {};

    for (const faction of FACTIONS) {
        if (faction.id === 'UNAFFILIATED') continue;

        const assets: FactionAssets = {
            linhThach: 0,
            inventory: [],
        };
        
        // --- 1. Linh Thach ---
        const highestPower = faction.roles.reduce((max, role) => Math.max(max, role.power), 0);
        assets.linhThach = Math.floor(
            (Math.random() * 5000 + 1000) * (1 + highestPower / 20)
        );

        // --- 2. Items ---
        const add = (itemId: string, quantity: number) => assets.inventory.push({ itemId, quantity });

        // Add items based on faction theme
        switch (faction.id) {
            case 'MOC_GIA':
                add('recipe_item_hoi_xuan_dan', 3);
                add('material_linh_thao', 100);
                add('material_bach_linh_sam', 10);
                break;
            case 'TIEU_GIA':
                add('weapon_han_phong_dao', 2);
                add('armor_huyen_thiet_giap', 2);
                add('material_huyen_thiet', 50);
                break;
            case 'THANH_VAN_MON':
                add('book_phong_nhan_kiem', 1);
                add('book_ngu_phong_quyet', 2);
                add('consumable_tu_khi_dan', 20);
                break;
            case 'LUC_YEN_THON':
                add('material_linh_thao', 50);
                add('material_huyen_thiet', 20);
                add('weapon_thiet_kiem', 5);
                break;
            case 'LUU_LY_TONG':
                 add('book_lac_anh_kiem_phap', 1);
                 add('weapon_bach_vu_phien', 3);
                 break;
        }
        
        // Add some generic valuable items
        if (highestPower > 70) {
            add('material_tinh_ngan_khoang', Math.floor(Math.random() * 5) + 1);
            add('material_han_ngoc', Math.floor(Math.random() * 3) + 1);
        }

        allFactionAssets[faction.id] = assets;
    }

    return allFactionAssets;
};


/**
 * Applies an affinity change to a target NPC and cascades a portion of that change
 * to other members of the same faction based on their hierarchical relationship.
 * @param playerState The current player state.
 * @param targetNpcId The ID of the NPC directly receiving the affinity change.
 * @param item The item being gifted (or null if gifting currency).
 * @param linhThachAmount The amount of currency being gifted.
 * @param quantity The quantity of the item being gifted.
 * @returns An object with the updated generatedNpcs and affinity records.
 */
export const applyCascadingAffinity = (
    playerState: PlayerState,
    targetNpcId: string,
    item: Item | null,
    linhThachAmount: number = 0,
    quantity: number = 1
): { updatedNpcs: Record<string, NPC[]>, updatedAffinity: Record<string, number> } => {
    
    const updatedNpcs: Record<string, NPC[]> = JSON.parse(JSON.stringify(playerState.generatedNpcs));
    const updatedAffinity = { ...(playerState.affinity || {}) };
    
    let targetNpc: NPC | null = null;
    let targetNpcMapId: string | null = null;
    
    // Find the target NPC and their map
    for (const mapId in updatedNpcs) {
        const npc = updatedNpcs[mapId].find((n: NPC) => n.id === targetNpcId);
        if (npc) {
            targetNpc = npc;
            targetNpcMapId = mapId;
            break;
        }
    }

    if (!targetNpc || !targetNpcMapId) {
        console.error("Target NPC for affinity change not found.");
        return { updatedNpcs: playerState.generatedNpcs, updatedAffinity: playerState.affinity };
    }

    // --- 1. Calculate and apply the primary affinity change ---
    const currentAffinity = updatedAffinity[targetNpc.id] || 0;
    const baseChange = calculateGiftAffinityChange(targetNpc, item, currentAffinity, linhThachAmount);
    const newAffinityScore = Math.max(-100, Math.min(100, currentAffinity + baseChange));
    updatedAffinity[targetNpc.id] = newAffinityScore;
    
    // --- 2. Update the target NPC's inventory/currency ---
    if (item) {
        if (!targetNpc.inventory) targetNpc.inventory = [];
        let remainingQuantity = quantity;
        if (item.stackable > 1) {
            for (const npcSlot of targetNpc.inventory) {
                if (remainingQuantity <= 0) break;
                if (npcSlot.itemId === item.id && npcSlot.quantity < item.stackable) {
                    const canAdd = item.stackable - npcSlot.quantity;
                    const amountToAdd = Math.min(remainingQuantity, canAdd);
                    npcSlot.quantity += amountToAdd;
                    remainingQuantity -= amountToAdd;
                }
            }
        }
        while (remainingQuantity > 0) {
            const amountForNewStack = Math.min(remainingQuantity, item.stackable);
            targetNpc.inventory.push({ itemId: item.id, quantity: amountForNewStack });
            remainingQuantity -= amountForNewStack;
        }
    } else {
        targetNpc.linhThach = (targetNpc.linhThach || 0) + linhThachAmount;
    }


    // --- 3. Handle cascading affinity ---
    if (!targetNpc.factionId) {
        return { updatedNpcs, updatedAffinity };
    }

    const faction = FACTIONS.find(f => f.id === targetNpc.factionId);
    const targetRole = faction?.roles.find(r => r.name === targetNpc!.role);

    if (!faction || !targetRole) {
        return { updatedNpcs, updatedAffinity };
    }

    const targetPower = targetRole.power;

    const allFactionMembers = Object.values(updatedNpcs).flat().filter(
        (n: NPC) => n.factionId === targetNpc!.factionId && n.id !== targetNpc!.id
    );

    for (const member of allFactionMembers) {
        const memberRole = faction.roles.find(r => r.name === member.role);
        if (!memberRole) continue;

        const memberPower = memberRole.power;
        let cascadeMultiplier = 0;

        if (baseChange > 0) { // Positive Affinity
            if (memberPower > targetPower) { // Member is a superior
                cascadeMultiplier = 0.2; // Superiors are pleased their subordinates are respected
            } else if (memberPower < targetPower) { // Member is a subordinate
                cascadeMultiplier = 0.4; // Subordinates are happy their leader is respected
            } else { // Member is a peer
                cascadeMultiplier = 0.3;
            }
        } else { // Negative Affinity
             if (memberPower > targetPower) { // Member is a superior
                cascadeMultiplier = 0.3; // Superiors are displeased their faction is disrespected
            } else if (memberPower < targetPower) { // Member is a subordinate
                cascadeMultiplier = 0.5; // Subordinates are angry their leader is disrespected
            } else { // Member is a peer
                cascadeMultiplier = 0.4;
            }
        }
        
        const cascadeChange = Math.round(baseChange * cascadeMultiplier);
        
        if (cascadeChange !== 0) {
            const memberCurrentAffinity = updatedAffinity[member.id] || 0;
            const memberNewAffinity = Math.max(-100, Math.min(100, memberCurrentAffinity + cascadeChange));
            updatedAffinity[member.id] = memberNewAffinity;
        }
    }

    return { updatedNpcs, updatedAffinity };
};