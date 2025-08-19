import type { CharacterAttributes, CombatStats } from './stats';
import type { SkillTier } from './skill';

export type EquipmentSlot = 'WEAPON' | 'HEAD' | 'ARMOR' | 'LEGS' | 'ACCESSORY';

export const EQUIPMENT_SLOT_NAMES: Record<EquipmentSlot, string> = {
    WEAPON: 'Vũ Khí',
    HEAD: 'Nón/Mũ',
    ARMOR: 'Giáp',
    LEGS: 'Quần',
    ACCESSORY: 'Trang Sức'
};

export const ITEM_TIER_NAMES: Record<SkillTier, string> = {
    HOANG: 'Hoàng Giai',
    HUYEN: 'Huyền Giai',
    DIA: 'Địa Giai',
    THIEN: 'Thiên Giai'
};

export type WeaponType = 'SWORD' | 'BLADE' | 'SPEAR' | 'FAN' | 'BOW' | 'STAFF';

export const WEAPON_TYPE_NAMES: Record<WeaponType, string> = {
    SWORD: 'Kiếm',
    BLADE: 'Đao',
    SPEAR: 'Thương',
    FAN: 'Quạt',
    BOW: 'Cung',
    STAFF: 'Trượng'
};

export interface EquipmentBonus {
    targetStat?: keyof CombatStats;
    targetAttribute?: keyof CharacterAttributes;
    modifier: 'ADDITIVE' | 'MULTIPLIER';
    value: number;
}