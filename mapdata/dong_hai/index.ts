import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../types/map';

export const mapDefinition: GameMap = {
    id: 'DONG_HAI',
    name: 'Đông Hải Vô Tận',
    type: 'continent',
    size: { width: 800, height: 800 },
    backgroundStyle: { background: 'radial-gradient(ellipse at center, rgba(118, 255, 239, 0.1) 0%, rgba(118, 255, 239, 0) 70%), linear-gradient(to bottom, #1a3a3a, #0a2a2a)' }
};

export const mapAreas: MapArea[] = [];
export const pois: PointOfInterest[] = [];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-dhg-tn', name: 'Trận Pháp về Thiên Nam', position: { x: 100, y: 400 }, targetMap: 'THIEN_NAM', targetPosition: { x: 9880, y: 4000 } },
];
