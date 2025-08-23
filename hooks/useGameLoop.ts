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
    const lastTickTime = useRef(performance.now());
    const stillTimeAccumulator = useRef(0);
    
    useEffect(() => {
        const gameTick = () => {
            // Calculate deltaTime since last tick
            const now = performance.now();
            const deltaTime = now - lastTickTime.current;
            lastTickTime.current = now;

            updatePlayerState(prev => {
                if (!prev || isPaused || isMeditating) {
                    // When paused, reset the accumulator to prevent a large time jump upon unpausing.
                    stillTimeAccumulator.current = 0;
                    return prev;
                }
                
                let newTime = prev.time;
                const { position, targetPosition } = prev;
                const isMoving = position.x !== targetPosition.x || position.y !== targetPosition.y;

                if (!isMoving) {
                    // Player is standing still
                    if (pendingInteraction.current) {
                        pendingInteraction.current();
                        pendingInteraction.current = null;
                    }

                    stillTimeAccumulator.current += deltaTime;
                    const minutesPassed = Math.floor(stillTimeAccumulator.current / 1000);

                    if (minutesPassed > 0) {
                        stillTimeAccumulator.current -= minutesPassed * 1000; // More precise than modulo
                        newTime = advanceTime(prev.time, minutesPassed);
                        return { ...prev, time: newTime };
                    }
                    
                    return prev; // No state change if not enough time passed.
                }

                // Player is moving, reset still time accumulator
                stillTimeAccumulator.current = 0;

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
                
                const minutesPassedFromMovement = Math.floor(distanceAccumulator.current / MOVEMENT_PIXELS_PER_MINUTE);

                if (minutesPassedFromMovement > 0) {
                    distanceAccumulator.current %= MOVEMENT_PIXELS_PER_MINUTE;
                    newTime = advanceTime(prev.time, minutesPassedFromMovement);
                }

                // --- Mana Depletion Logic ---
                let newMana = prev.mana;
                let finalTargetPosition = prev.targetPosition;

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

        // Reset time reference when effect re-runs (e.g., on unpause)
        lastTickTime.current = performance.now();
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = requestAnimationFrame(gameTick);

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [isPaused, isMeditating, updatePlayerState, pendingInteraction, currentMapArea]);
};