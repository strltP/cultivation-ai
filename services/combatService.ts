
import type { CombatStats } from '../types/stats';
import type { Skill, LearnedSkill } from '../types/skill';
import type { PlayerState, NPC } from '../types/character';
import type { NpcAction, CombatState } from '../types/combat';
import { ALL_SKILLS } from '../data/skills/skills';
import { ALL_ITEMS } from '../data/items/index';
import { calculateSkillAttributesForLevel, calculateSkillEffectiveness } from './cultivationService';

export interface DamageResult {
    damage: number;
    isCritical: boolean;
    isEvaded: boolean;
    weaponIncompatibilityPenalty?: boolean;
    linhCanEffectiveness?: number;
}

export const calculateDamage = (attacker: { stats: CombatStats }, defender: { stats: CombatStats }): DamageResult => {
    // 1. Calculate evasion chance based on speed
    const dodgeChance = (defender.stats.speed / (defender.stats.speed + attacker.stats.speed * 4.5));

    // 2. Check if the attack hits
    if (Math.random() < dodgeChance) {
        return { damage: 0, isCritical: false, isEvaded: true };
    }

    // 3. Check for critical hit
    const isCritical = Math.random() < attacker.stats.critRate;
    
    // 4. Calculate base damage with some randomness (+/- 10%)
    const baseDamage = attacker.stats.attackPower * (1 + (Math.random() * 0.2 - 0.1));

    // 5. Apply critical multiplier if it's a critical hit
    const criticalDamage = isCritical ? baseDamage * attacker.stats.critDamage : baseDamage;

    // 6. Apply defense mitigation using the new armor penetration formula
    const effectiveDefense = defender.stats.defensePower * (1 - attacker.stats.armorPenetration);
    const damageReduction = effectiveDefense / (effectiveDefense + attacker.stats.attackPower);
    const finalDamage = Math.max(1, Math.round(criticalDamage * (1 - damageReduction)));
    
    return { damage: finalDamage, isCritical, isEvaded: false };
};


export const calculateSkillDamage = (
    caster: { state: PlayerState | NPC },
    skill: Skill,
    learnedSkill: LearnedSkill,
    defender: { state: PlayerState | NPC }
): DamageResult => {
    if (!skill.damage) return { damage: 0, isCritical: false, isEvaded: false };

    // 1. Evasion check based on speed
    const dodgeChance = (defender.state.stats.speed / (defender.state.stats.speed + caster.state.stats.speed * 4.5));
    if (Math.random() < dodgeChance) {
        return { damage: 0, isCritical: false, isEvaded: true };
    }
    
    // NEW: Calculate Linh Can Effectiveness
    const effectiveness = calculateSkillEffectiveness(caster.state.linhCan, caster.state.attributes, skill);

    // Check for weapon incompatibility
    let weaponDamageMultiplier = 1.0;
    let weaponIncompatibilityPenalty = false;
    if (skill.weaponType) {
        const equippedWeaponSlot = caster.state.equipment?.WEAPON;
        const equippedWeaponDef = equippedWeaponSlot ? ALL_ITEMS.find(i => i.id === equippedWeaponSlot.itemId) : null;

        if (!equippedWeaponDef || equippedWeaponDef.weaponType !== skill.weaponType) {
            weaponDamageMultiplier = 0.5;
            weaponIncompatibilityPenalty = true;
        }
    }

    // 2. Check for critical hit (skills can also crit)
    const isCritical = Math.random() < caster.state.stats.critRate;

    // 3. Calculate base damage from skill definition and level using the new helper
    const calculatedAttrs = calculateSkillAttributesForLevel(skill, learnedSkill.currentLevel);
    let baseDamage = calculatedAttrs.damage;

    // 4. Add scaling from Attack Power
    if (skill.damage.attackPowerFactor) {
        baseDamage += caster.state.stats.attackPower * skill.damage.attackPowerFactor;
    }

    // 5. Add scaling from other attributes
    if (skill.damage.scalingAttribute && skill.damage.scalingFactor) {
        baseDamage += caster.state.attributes[skill.damage.scalingAttribute] * skill.damage.scalingFactor;
    }
    
    // Add some randomness
    baseDamage *= (1 + (Math.random() * 0.2 - 0.1));

    // 6. Apply critical multiplier
    const criticalDamage = isCritical ? baseDamage * caster.state.stats.critDamage : baseDamage;
    
    // 7. Apply defense mitigation with armor penetration
    const effectiveDefense = defender.state.stats.defensePower * (1 - caster.state.stats.armorPenetration);
    const damageReduction = effectiveDefense / (effectiveDefense + caster.state.stats.attackPower);
    const finalDamage = Math.max(1, Math.round(criticalDamage * (1 - damageReduction)));

    // 8. Apply elemental bonuses from Tam Phap
    let elementalBonus = 1.0;
    if (skill.requiredLinhCan) {
        for (const lcType of skill.requiredLinhCan) {
            switch (lcType) {
                case 'HOA': elementalBonus += (caster.state.stats.hoaDamageBonus || 0); break;
                case 'MOC': elementalBonus += (caster.state.stats.mocDamageBonus || 0); break;
                case 'THUY': elementalBonus += (caster.state.stats.thuyDamageBonus || 0); break;
                case 'KIM': elementalBonus += (caster.state.stats.kimDamageBonus || 0); break;
                case 'THO': elementalBonus += (caster.state.stats.thoDamageBonus || 0); break;
                case 'PHONG': elementalBonus += (caster.state.stats.phongDamageBonus || 0); break;
                case 'LOI': elementalBonus += (caster.state.stats.loiDamageBonus || 0); break;
                case 'BĂNG': elementalBonus += (caster.state.stats.bangDamageBonus || 0); break;
                case 'QUANG': elementalBonus += (caster.state.stats.quangDamageBonus || 0); break;
                case 'AM': elementalBonus += (caster.state.stats.amDamageBonus || 0); break;
            }
        }
    }

    // 9. Apply all penalties and bonuses
    const finalDamageWithPenalties = Math.round(finalDamage * elementalBonus * weaponDamageMultiplier * effectiveness);

    return { damage: finalDamageWithPenalties, isCritical, isEvaded: false, weaponIncompatibilityPenalty, linhCanEffectiveness: effectiveness < 1 ? effectiveness : undefined };
};

export const getNpcDeterministicAction = (combatState: CombatState, allSkills: Skill[]): NpcAction => {
    const { npc, player } = combatState;

    const usableSkills = npc.learnedSkills.map(ls => {
        const skillDef = allSkills.find(s => s.id === ls.skillId);
        if (!skillDef || skillDef.type !== 'CONG_PHAP') return null;
        
        const calculatedAttrs = calculateSkillAttributesForLevel(skillDef, ls.currentLevel);
        const totalManaCost = calculatedAttrs.manaCost + Math.floor(npc.stats.maxMana * calculatedAttrs.manaCostPercent);

        return (totalManaCost <= npc.mana) ? skillDef : null;
    }).filter((s): s is Skill => s !== null);

    const healingSkill = usableSkills.find(s => s.effects?.some(e => e.type === 'HEAL'));
    if (healingSkill && npc.hp < npc.stats.maxHp * 0.4) {
        return {
            type: 'SKILL',
            skillId: healingSkill.id,
            reasoning: 'Sinh lực thấp, cần hồi phục ngay lập tức.'
        };
    }
    
    const offensiveSkills = usableSkills.filter(s => s.damage && s.damage.baseValue > 0);

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
