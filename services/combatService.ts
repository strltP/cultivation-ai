import type { CombatStats } from '../types/stats';
import type { Skill, LearnedSkill } from '../types/skill';
import type { PlayerState, NPC } from '../types/character';
import type { NpcAction, CombatState } from '../types/combat';
import { ALL_SKILLS } from '../data/skills/skills';
import { ALL_ITEMS } from '../data/items/index';

export interface DamageResult {
    damage: number;
    isCritical: boolean;
    isEvaded: boolean;
    incompatibilityPenalty?: boolean;
}

export const calculateDamage = (attacker: { stats: CombatStats }, defender: { stats: CombatStats }): DamageResult => {
    // 1. Check for evasion
    if (Math.random() < defender.stats.evasionRate) {
        return { damage: 0, isCritical: false, isEvaded: true };
    }

    // 2. Check for critical hit
    const isCritical = Math.random() < attacker.stats.critRate;
    
    // 3. Calculate base damage with some randomness (+/- 10%)
    const baseDamage = attacker.stats.attackPower * (1 + (Math.random() * 0.2 - 0.1));

    // 4. Apply critical multiplier if it's a critical hit
    const criticalDamage = isCritical ? baseDamage * attacker.stats.critDamage : baseDamage;

    // 5. Apply defense mitigation using a damage reduction formula
    // Damage Reduction = Defense / (Defense + K), where K is a balancing constant.
    // K = 100 means 100 defense = 50% damage reduction.
    const damageReduction = defender.stats.defensePower / (defender.stats.defensePower + 100);
    const finalDamage = Math.max(1, Math.round(criticalDamage * (1 - damageReduction)));
    
    return { damage: finalDamage, isCritical, isEvaded: false };
};


export const calculateSkillDamage = (
    caster: { state: PlayerState | NPC },
    skill: Skill,
    learnedSkill: LearnedSkill,
    defender: { state: PlayerState | NPC }
): DamageResult => {
    const { damage: damageDef } = skill;
    if (!damageDef) return { damage: 0, isCritical: false, isEvaded: false };

    // 1. Check for evasion
    if (Math.random() < defender.state.stats.evasionRate) {
        return { damage: 0, isCritical: false, isEvaded: true };
    }

    // New logic: Check for weapon incompatibility
    let damageMultiplier = 1.0;
    let incompatibilityPenalty = false;
    if (skill.weaponType) {
        const equippedWeaponSlot = caster.state.equipment?.WEAPON;
        const equippedWeaponDef = equippedWeaponSlot ? ALL_ITEMS.find(i => i.id === equippedWeaponSlot.itemId) : null;

        if (!equippedWeaponDef || equippedWeaponDef.weaponType !== skill.weaponType) {
            damageMultiplier = 0.5;
            incompatibilityPenalty = true;
        }
    }

    // 2. Check for critical hit (skills can also crit)
    const isCritical = Math.random() < caster.state.stats.critRate;

    // 3. Calculate base damage from skill definition and level
    let baseDamage = damageDef.baseValue + (damageDef.valuePerLevel * (learnedSkill.currentLevel - 1));

    // 4. Add scaling from Attack Power
    if (damageDef.attackPowerFactor) {
        baseDamage += caster.state.stats.attackPower * damageDef.attackPowerFactor;
    }

    // 5. Add scaling from other attributes
    if (damageDef.scalingAttribute && damageDef.scalingFactor) {
        baseDamage += caster.state.attributes[damageDef.scalingAttribute] * damageDef.scalingFactor;
    }
    
    // Add some randomness
    baseDamage *= (1 + (Math.random() * 0.2 - 0.1));

    // 6. Apply critical multiplier
    const criticalDamage = isCritical ? baseDamage * caster.state.stats.critDamage : baseDamage;
    
    // 7. Apply defense mitigation using a damage reduction formula
    const damageReduction = defender.state.stats.defensePower / (defender.state.stats.defensePower + 100);
    const finalDamage = Math.max(1, Math.round(criticalDamage * (1 - damageReduction)));

    // 8. Apply weapon incompatibility penalty
    const finalDamageWithPenalty = Math.round(finalDamage * damageMultiplier);

    return { damage: finalDamageWithPenalty, isCritical, isEvaded: false, incompatibilityPenalty };
};

export const getNpcDeterministicAction = (combatState: CombatState, allSkills: Skill[]): NpcAction => {
    const { npc, player } = combatState;

    const usableSkills = npc.learnedSkills.map(ls => {
        const skillDef = allSkills.find(s => s.id === ls.skillId);
        return (skillDef && skillDef.type === 'CONG_PHAP' && (skillDef.manaCost ?? 0) <= npc.mana) ? skillDef : null;
    }).filter((s): s is Skill => s !== null);

    const healingSkill = usableSkills.find(s => s.effects?.some(e => e.type === 'HEAL'));
    if (healingSkill && npc.hp < npc.stats.maxHp * 0.4) {
        return {
            type: 'SKILL',
            skillId: healingSkill.id,
            reasoning: 'Sinh lực thấp, cần hồi phục ngay lập tức.'
        };
    }
    
    const offensiveSkills = usableSkills.filter(s => !s.effects?.some(e => e.type === 'HEAL'));

    if (offensiveSkills.length === 0) {
        return { type: 'ATTACK', reasoning: 'Bảo tồn linh lực, sử dụng đòn tấn công cơ bản.' };
    }

    offensiveSkills.sort((a, b) => (b.damage?.baseValue ?? 0) - (a.damage?.baseValue ?? 0));
    const bestSkill = offensiveSkills[0];

    if (player.hp < (bestSkill?.damage?.baseValue || 20) && bestSkill) {
        return { type: 'SKILL', skillId: bestSkill.id, reasoning: 'Đối phương sắp bại, tung ra đòn kết liễu!' };
    }

    if (npc.mana > npc.stats.maxMana * 0.7 && bestSkill) {
        return { type: 'SKILL', skillId: bestSkill.id, reasoning: 'Linh lực dồi dào, thi triển thần thông!' };
    }
    
    if (npc.mana > npc.stats.maxMana * 0.3) {
         if (Math.random() > 0.5 && bestSkill) {
            return { type: 'SKILL', skillId: bestSkill.id, reasoning: 'Thử một chiêu xem sao.' };
         }
    }

    return { type: 'ATTACK', reasoning: 'Linh lực không nhiều, tấn công thường để thăm dò.' };
};