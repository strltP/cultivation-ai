

export interface CultivationState {
  realmIndex: number;
  level: number;
}

export interface CharacterAttributes {
  canCot: number;     // Căn Cốt (Constitution)
  thanPhap: number;   // Thân Pháp (Agility)
  thanThuc: number;   // Thần Thức (Spiritual Sense)
  ngoTinh: number;     // Ngộ Tính (Comprehension)
  coDuyen: number;     // Cơ Duyên (Fortune)
  tamCanh: number;     // Tâm Cảnh (Willpower)
}

export interface CombatStats {
  maxHp: number;
  maxQi: number;
  maxMana: number;
  maxThoNguyen: number;
  attackPower: number;
  defensePower: number;
  speed: number;
  critRate: number;
  critDamage: number; // as a multiplier, e.g., 1.5
  armorPenetration: number; // Tỉ lệ xuyên giáp, e.g., 0.1 for 10%
}
