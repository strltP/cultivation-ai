import type { PlayerState, NPC } from './character';
import type { EffectType } from './skill';

export interface CombatLogEntry {
    turn: number;
    message: string;
    type: 'damage' | 'heal' | 'info' | 'evade' | 'critical';
}

export interface NpcDecision {
    decision: 'spare' | 'kill';
    dialogue: string;
}

export interface ActiveStatusEffect {
  type: EffectType;
  duration: number; // in turns
  value: number; // damage per turn, heal per turn, slow percentage etc.
  sourceSkillId: string;
}

export interface CombatState {
    player: PlayerState;
    npc: NPC;
    isPlayerTurn: boolean;
    turn: number;
    log: CombatLogEntry[];
    combatEnded: boolean;
    winner?: 'player' | 'npc';
    isProcessing: boolean; // To show loading during NPC turn or action processing
    damageToShow?: { target: 'player' | 'npc'; amount: number | string; type: 'damage' | 'heal' | 'evade' | 'critical' | 'effect' };
    npcDecision?: NpcDecision;
    camNgoGained?: number;
}

export interface NpcAction {
    type: 'ATTACK' | 'SKILL';
    skillId?: string;
    reasoning: string;
}

export type PlayerAction = {
    type: 'ATTACK' | 'SKILL' | 'FLEE' | 'SKIP';
    skillId?: string;
};