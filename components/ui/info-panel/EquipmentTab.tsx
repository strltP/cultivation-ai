

import React, { useState, useMemo } from 'react';
import type { PlayerState } from '../../../types/character';
import type { Item, InventorySlot } from '../../../types/item';
import type { EquipmentSlot } from '../../../types/equipment';
import { ALL_ITEMS } from '../../../data/items/index';
import { INVENTORY_SIZE } from '../../../constants';
import { EQUIPMENT_SLOT_NAMES } from '../../../types/equipment';
import { calculateCombatStats } from '../../../services/cultivationService';
import { ALL_SKILLS } from '../../../data/skills/skills';
import { FaPlus } from 'react-icons/fa';
import { GiBroadsword, GiLeatherArmor, GiLegArmor, GiCrystalEarrings } from 'react-icons/gi';
import { BsHeadset } from 'react-icons/bs';

interface EquipmentTabProps {
    playerState: PlayerState;
    setPlayerState: React.Dispatch<React.SetStateAction<PlayerState | null>>;
}

const SLOT_ICONS: Record<EquipmentSlot, React.ReactNode> = {
    WEAPON: <GiBroadsword />,
    HEAD: <BsHeadset />,
    ARMOR: <GiLeatherArmor />,
    LEGS: <GiLegArmor />,
    ACCESSORY: <GiCrystalEarrings />,
};

const ATTRIBUTE_NAMES: Record<string, string> = {
    canCot: 'Căn Cốt',
    thanPhap: 'Thân Pháp',
    thanThuc: 'Thần Thức',
    ngoTinh: 'Ngộ Tính',
    maxHp: 'Sinh Lực Tối đa',
    maxQi: 'Chân Khí Tối đa',
    maxMana: 'Linh Lực Tối đa',
    attackPower: 'Lực Công',
    defensePower: 'Lực Thủ',
    speed: 'Tốc Độ',
    critRate: 'Tỉ lệ Bạo kích',
    critDamage: 'ST Bạo kích',
    evasionRate: 'Tỉ lệ Né tránh',
};

const EquipmentTab: React.FC<EquipmentTabProps> = ({ playerState, setPlayerState }) => {
    const [selectedInventoryIndex, setSelectedInventoryIndex] = useState<number | null>(null);
    const [selectedEquipmentSlot, setSelectedEquipmentSlot] = useState<EquipmentSlot | null>(null);

    const handleEquip = (invIndex: number) => {
        const itemInInventory = playerState.inventory[invIndex];
        const itemDef = ALL_ITEMS.find(i => i.id === itemInInventory.itemId);
        if (!itemDef || !itemDef.slot) return;

        setPlayerState(prev => {
            if (!prev) return null;
            
            const newInventory = [...prev.inventory];
            const newEquipment = { ...prev.equipment };

            // Remove item from inventory
            newInventory.splice(invIndex, 1);
            
            // If a different item is in the slot, move it to inventory
            const currentlyEquipped = newEquipment[itemDef.slot!];
            if (currentlyEquipped) {
                newInventory.push(currentlyEquipped);
            }

            // Place new item in equipment slot
            newEquipment[itemDef.slot!] = itemInInventory;

            const newStats = calculateCombatStats(prev.attributes, prev.cultivation, prev.cultivationStats, prev.learnedSkills, ALL_SKILLS, newEquipment, ALL_ITEMS, prev.linhCan);

            return { ...prev, inventory: newInventory, equipment: newEquipment, stats: newStats, hp: Math.min(prev.hp, newStats.maxHp) };
        });
        setSelectedInventoryIndex(null);
    };

    const handleUnequip = (slot: EquipmentSlot) => {
        setPlayerState(prev => {
            if (!prev) return null;
            const itemToUnequip = prev.equipment[slot];
            if (!itemToUnequip) return prev;
            
            if (prev.inventory.length >= INVENTORY_SIZE) {
                // Ideally, show a game message here
                console.error("Inventory is full, cannot unequip.");
                return prev;
            }

            const newInventory = [...prev.inventory, itemToUnequip];
            const newEquipment = { ...prev.equipment };
            delete newEquipment[slot];

            const newStats = calculateCombatStats(prev.attributes, prev.cultivation, prev.cultivationStats, prev.learnedSkills, ALL_SKILLS, newEquipment, ALL_ITEMS, prev.linhCan);
            
            return { ...prev, inventory: newInventory, equipment: newEquipment, stats: newStats, hp: Math.min(prev.hp, newStats.maxHp) };
        });
        setSelectedEquipmentSlot(null);
    };

    const selectedItem: Item | null = useMemo(() => {
        if (selectedInventoryIndex !== null) {
            return ALL_ITEMS.find(i => i.id === playerState.inventory[selectedInventoryIndex]?.itemId) || null;
        }
        if (selectedEquipmentSlot !== null) {
            return ALL_ITEMS.find(i => i.id === playerState.equipment[selectedEquipmentSlot!]?.itemId) || null;
        }
        return null;
    }, [selectedInventoryIndex, selectedEquipmentSlot, playerState.inventory, playerState.equipment]);

    const equipmentSlots: EquipmentSlot[] = ['HEAD', 'ARMOR', 'LEGS', 'WEAPON', 'ACCESSORY'];

    return (
        <div className="flex h-full gap-4">
            {/* Left Side: Equipment Slots and Details */}
            <div className="w-2/5 flex-shrink-0 flex flex-col gap-4">
                <div className="bg-black/20 rounded-lg border border-gray-700 p-4 grid grid-cols-3 gap-4 content-center justify-items-center">
                    {equipmentSlots.map(slot => {
                        const equippedItem = playerState.equipment[slot];
                        const itemDef = equippedItem ? ALL_ITEMS.find(i => i.id === equippedItem.itemId) : null;
                        const isSelected = selectedEquipmentSlot === slot;
                        return (
                             <div key={slot} title={EQUIPMENT_SLOT_NAMES[slot]} className="col-span-1 flex items-center justify-center">
                                <button onClick={() => { setSelectedEquipmentSlot(slot); setSelectedInventoryIndex(null); }} className={`relative w-24 h-24 bg-gray-900/50 rounded-md border-2 transition-all duration-150 flex items-center justify-center text-4xl
                                    ${itemDef ? 'hover:bg-gray-700/70' : 'border-gray-800 border-dashed'}
                                    ${isSelected ? 'border-yellow-400 scale-105 shadow-lg' : 'border-gray-700'}`}>
                                    {itemDef ? itemDef.icon : <div className="text-gray-600">{SLOT_ICONS[slot]}</div>}
                                </button>
                             </div>
                        )
                    })}
                </div>
                <div className="bg-black/20 rounded-lg border border-gray-700 p-4 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-yellow-300 mb-2 border-b border-gray-600 pb-2">Thông Tin Trang Bị</h3>
                    {selectedItem ? (
                        <div className="flex flex-col h-full">
                             <div className="text-center">
                                <div className="mx-auto text-5xl w-20 h-20 flex items-center justify-center rounded-lg bg-gray-900/50 mb-2">{selectedItem.icon}</div>
                                <h4 className="text-lg font-bold text-white">{selectedItem.name}</h4>
                                <p className="text-sm text-gray-500 capitalize">{EQUIPMENT_SLOT_NAMES[selectedItem.slot!]}</p>
                            </div>
                            <div className="flex-grow mt-3 text-gray-300 text-sm italic overflow-y-auto space-y-2">
                                <p>{selectedItem.description}</p>
                                <div className="pt-2 border-t border-gray-600 not-italic">
                                    <h5 className="font-semibold text-gray-200 mb-1">Thuộc tính:</h5>
                                    <ul className="space-y-1">
                                        {selectedItem.bonuses?.map((bonus, i) => {
                                            const targetKey = bonus.targetStat || bonus.targetAttribute;
                                            if (!targetKey) return null;
                                            const name = ATTRIBUTE_NAMES[targetKey] || targetKey;
                                            const valueText = `+${bonus.value}${bonus.modifier === 'MULTIPLIER' ? '%' : ''}`;
                                            return <li key={i} className="text-green-300">Tăng {name} {valueText}</li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                             <div className="mt-auto pt-4">
                                {selectedInventoryIndex !== null && <button onClick={() => handleEquip(selectedInventoryIndex)} className="w-full bg-green-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition-colors">Trang Bị</button>}
                                {selectedEquipmentSlot !== null && <button onClick={() => handleUnequip(selectedEquipmentSlot)} className="w-full bg-red-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors">Tháo Ra</button>}
                            </div>
                        </div>
                    ) : (
                         <div className="flex items-center justify-center h-full text-center text-gray-500">
                            <p>Chọn một trang bị để xem thông tin.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Inventory */}
            <div className="flex-grow bg-black/20 rounded-lg border border-gray-700 p-4 flex flex-col">
                <h3 className="text-xl font-bold text-yellow-300 mb-2 border-b border-gray-600 pb-2 flex-shrink-0">Túi Càn Khôn</h3>
                <div className="grid grid-cols-6 gap-2 content-start overflow-y-auto flex-grow">
                    {playerState.inventory.map((slot, index) => {
                        const itemDef = slot ? ALL_ITEMS.find(i => i.id === slot.itemId) : null;
                        if (!itemDef || itemDef.type !== 'equipment') return <div key={index} className="aspect-square"></div>; // Placeholder for non-equipment items
                        const isSelected = index === selectedInventoryIndex;
                        return (
                             <button
                                key={index}
                                onClick={() => { setSelectedInventoryIndex(index); setSelectedEquipmentSlot(null); }}
                                className={`relative aspect-square bg-gray-900/50 rounded-md border-2 transition-all duration-150 ${ isSelected ? 'border-yellow-400 scale-105 shadow-lg' : 'border-gray-700' }`}
                                title={itemDef?.name}
                            >
                                {itemDef && (
                                    <div className="flex items-center justify-center h-full text-3xl">{itemDef.icon}</div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EquipmentTab;