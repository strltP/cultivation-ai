import { useEffect, useRef } from 'react';
import type { PlayerState } from '../types/character';
import { PLAYER_SPEED, MOVEMENT_PIXELS_PER_MINUTE } from '../constants';
import { advanceTime } from '../services/timeService';
import type { MapArea } from '../types/map';

export const useGameLoop = (
    playerState: PlayerState,
    updatePlayerState: (updater: (p: PlayerState) => PlayerState) => void,
    isPaused: boolean, // Combines isMapOpen, isLoading, isFighting, isChatting etc.
    isMeditating: boolean,
    pendingInteraction: React.MutableRefObject<(() => void) | null>,
    currentMapArea: MapArea | null
) => {
    const animationFrameId = useRef<number | null>(null);
    const distanceAccumulator = useRef(0);
    
    useEffect(() => {
        const gameTick = () => {
            // --- Player Movement & Time Progression ---
            updatePlayerState(prev => {
                if (!prev || isPaused || isMeditating) return prev;
                
                const { position, targetPosition } = prev;
                if (position.x === targetPosition.x && position.y === targetPosition.y) {
                    if (pendingInteraction.current) {
                        pendingInteraction.current();
                        pendingInteraction.current = null;
                    }
                    return prev;
                }

                const dx = targetPosition.x - position.x;
                const dy = targetPosition.y - position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                let newX, newY;
                if (distance < PLAYER_SPEED) {
                     newX = targetPosition.x;
                     newY = targetPosition.y;
                } else {
                    newX = position.x + (dx / distance) * PLAYER_SPEED;
                    newY = position.y + (dy / distance) * PLAYER_SPEED;
                }
                
                const distanceMoved = Math.sqrt(Math.pow(newX - position.x, 2) + Math.pow(newY - position.y, 2));
                distanceAccumulator.current += distanceMoved;
                
                let newTime = prev.time;
                const minutesPassed = Math.floor(distanceAccumulator.current / MOVEMENT_PIXELS_PER_MINUTE);

                if (minutesPassed > 0) {
                    distanceAccumulator.current %= MOVEMENT_PIXELS_PER_MINUTE;
                    newTime = advanceTime(prev.time, minutesPassed);
                }

                // --- Mana Depletion Logic ---
                let newMana = prev.mana;
                let finalTargetPosition = prev.targetPosition;
                const isMoving = position.x !== targetPosition.x || position.y !== targetPosition.y;

                if (isMoving && currentMapArea?.depletesMana) {
                    const MANA_COST_PER_PIXEL = 0.2;
                    const realmMultiplier = 1 / (1 + prev.cultivation.realmIndex * 1);
                    const manaCost = Math.ceil(distanceMoved * MANA_COST_PER_PIXEL * realmMultiplier);

                    if (prev.mana >= manaCost) {
                        newMana = prev.mana - manaCost;
                    } else {
                        // Not enough mana for the full move, stop and set mana to 0
                        newMana = 0;
                        newX = prev.position.x;
                        newY = prev.position.y;
                        finalTargetPosition = { x: newX, y: newY };
                    }
                }
                
                return { ...prev, position: { x: newX, y: newY }, time: newTime, mana: newMana, targetPosition: finalTargetPosition };
            });

            animationFrameId.current = requestAnimationFrame(gameTick);
        };

        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = requestAnimationFrame(gameTick);

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [isPaused, isMeditating, updatePlayerState, pendingInteraction, currentMapArea]);
};