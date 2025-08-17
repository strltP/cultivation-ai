
import React, { useMemo, useState, useLayoutEffect } from 'react';
import type { PlayerState, NPC } from '../../types/character';
import type { Interactable } from '../../types/interaction';
import type { TeleportLocation, PointOfInterest, GameMap } from '../../types/map';
import type { Position } from '../../types/common';
import Player from '../Player';
import GameEntity from '../GameEntity';
import TeleportGate from '../TeleportGate';
import PointOfInterestComponent from '../PointOfInterest';
import TimeOfDayOverlay from '../TimeOfDayOverlay';

interface WorldRendererProps {
    playerRef: React.RefObject<HTMLDivElement>;
    currentMapData: GameMap;
    cameraPosition: Position;
    playerState: PlayerState;
    isMeditating: boolean;
    currentPois: PointOfInterest[];
    currentNpcs: NPC[];
    currentInteractables: Interactable[];
    currentTeleportGates: TeleportLocation[];
    allMaps: Record<string, GameMap>;
    onWorldClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    onGenericInteraction: (target: NPC | Interactable | TeleportLocation | PointOfInterest, interactionFn: () => void) => void;
    onProcessInteraction: (target: Interactable) => void;
    setActiveInteractionNpc: (npc: NPC | null) => void;
    setActiveInteractionInteractable: (item: Interactable | null) => void;
    onGatherInteractable: (item: Interactable) => void;
    onTeleport: (gate: TeleportLocation) => void;
    onEnterPoi: (poi: PointOfInterest) => void;
}

const RENDER_BUFFER = 300; // Render objects 300px outside the viewport

const WorldRenderer: React.FC<WorldRendererProps> = (props) => {
    const {
        playerRef,
        currentMapData,
        cameraPosition,
        playerState,
        isMeditating,
        currentPois,
        currentNpcs,
        currentInteractables,
        currentTeleportGates,
        allMaps,
        onWorldClick,
        onGenericInteraction,
        onProcessInteraction,
        setActiveInteractionNpc,
        setActiveInteractionInteractable,
        onGatherInteractable,
        onTeleport,
        onEnterPoi,
    } = props;
    
    const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Assuming the game container takes up the full screen, adjust if not
    useLayoutEffect(() => {
        const updateSize = () => {
            setViewportSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);


    const visibleEntities = useMemo(() => {
        const viewLeft = -cameraPosition.x;
        const viewTop = -cameraPosition.y;
        const viewRight = viewLeft + viewportSize.width;
        const viewBottom = viewTop + viewportSize.height;

        const isVisible = (pos: Position) => 
            pos.x > viewLeft - RENDER_BUFFER &&
            pos.x < viewRight + RENDER_BUFFER &&
            pos.y > viewTop - RENDER_BUFFER &&
            pos.y < viewBottom + RENDER_BUFFER;

        return {
            pois: currentPois.filter(e => isVisible(e.position)),
            npcs: currentNpcs.filter(e => isVisible(e.position)),
            interactables: currentInteractables.filter(e => isVisible(e.position)),
            teleportGates: currentTeleportGates.filter(e => isVisible(e.position)),
        };

    }, [cameraPosition, viewportSize, currentPois, currentNpcs, currentInteractables, currentTeleportGates]);


    const onNpcInteraction = (npc: NPC) => onGenericInteraction(npc, () => setActiveInteractionNpc(npc));
    
    const onInteractableInteraction = (item: Interactable) => {
        if (item.type === 'spirit_field' || item.type === 'alchemy_furnace') {
             onGenericInteraction(item, () => onGatherInteractable(item));
        } 
        else if (item.type === 'chest') {
            onGenericInteraction(item, () => onProcessInteraction(item));
        }
        else {
            onGenericInteraction(item, () => setActiveInteractionInteractable(item));
        }
    };

    const onTeleportInteraction = (gate: TeleportLocation) => onGenericInteraction(gate, () => onTeleport(gate));
    const onPoiInteraction = (poi: PointOfInterest) => {
        if (poi.targetMap && poi.targetPosition) {
            onGenericInteraction(poi, () => onEnterPoi(poi));
        }
    };

    return (
        <div
            style={{
                width: currentMapData.size.width,
                height: currentMapData.size.height,
                transform: `translate(${cameraPosition.x}px, ${cameraPosition.y}px)`,
                position: 'relative',
            }}
            onClick={onWorldClick}
        >
            <div className="absolute inset-0" style={currentMapData.backgroundStyle}></div>
            <TimeOfDayOverlay gameHour={playerState.time.hour} />
            {visibleEntities.pois.map(poi => <PointOfInterestComponent key={poi.id} poi={poi} onClick={() => onPoiInteraction(poi)} />)}
            <Player ref={playerRef} position={playerState.position} isMeditating={isMeditating} />
            {visibleEntities.npcs.map(npc => <GameEntity key={npc.id} entity={npc} onClick={() => onNpcInteraction(npc)} playerState={playerState} />)}
            {visibleEntities.interactables.map(item => <GameEntity key={item.id} entity={item} onClick={() => onInteractableInteraction(item)} playerState={playerState} />)}
            {visibleEntities.teleportGates.map(gate => <TeleportGate key={gate.id} gate={gate} allMaps={allMaps} onClick={() => onTeleportInteraction(gate)} />)}
        </div>
    );
};

export default WorldRenderer;
