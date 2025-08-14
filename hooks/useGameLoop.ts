import { useEffect, useRef } from 'react';
import type { PlayerState } from '../types/character';
import { PLAYER_SPEED, MOVEMENT_PIXELS_PER_MINUTE } from '../constants';
import { advanceTime } from '../services/timeService';

export const useGameLoop = (
    playerState: PlayerState,
    setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>,
    isPaused: boolean, // Combines isMapOpen, isLoading, isFighting, isChatting etc.
    isMeditating: boolean,
    pendingInteraction: React.MutableRefObject<(() => void) | null>
) => {
    const animationFrameId = useRef<number | null>(null);
    const distanceAccumulator = useRef(0);
    
    useEffect(() => {
        const gameTick = () => {
            // --- Player Movement & Time Progression ---
            setPlayerState(prev => {
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
                
                return { ...prev, position: { x: newX, y: newY }, time: newTime };
            });

            animationFrameId.current = requestAnimationFrame(gameTick);
        };

        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = requestAnimationFrame(gameTick);

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [isPaused, isMeditating, setPlayerState, pendingInteraction]);
};