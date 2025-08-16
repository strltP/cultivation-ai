import React, { useState, useMemo, useEffect } from 'react';
import type { PlayerState } from '../../../types/character';
import { exportPlayerState, importPlayerState, INITIAL_PLAYER_STATE } from '../../../hooks/usePlayerPersistence';
import { FaDownload, FaUpload, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import { GiScrollQuill, GiBrain, GiHeartPlus, GiGalaxy } from 'react-icons/gi';
import { getNextCultivationLevel, getRealmLevelInfo, calculateAllStats } from '../../../services/cultivationService';
import { ALL_SKILLS } from '../../../data/skills/skills';
import { ALL_ITEMS } from '../../../data/items';
import type { CharacterAttributes, CombatStats } from '../../../types/stats';
import { INVENTORY_SIZE } from '../../../constants';

interface SystemTabProps {
  playerState: PlayerState;
  setPlayerState: (updater: (prevState: PlayerState) => PlayerState) => void;
}

const ConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void; }> = ({ onConfirm, onCancel }) => (
    <div className="confirmation-modal-backdrop" onClick={onCancel}>
        <div className="confirmation-modal-content" onClick={e => e.stopPropagation()}>
            <FaExclamationTriangle className="text-5xl text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Cảnh Báo</h3>
            <p className="text-gray-300 mb-6">
                Hành động này sẽ ghi đè hoàn toàn tiến trình tu luyện hiện tại của bạn. Dữ liệu không thể phục hồi.
                <br />
                Bạn có chắc chắn muốn tiếp tục không?
            </p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={onCancel}
                    className="py-2 px-6 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
                >
                    Hủy Bỏ
                </button>
                <button
                    onClick={onConfirm}
                    className="py-2 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors"
                >
                    Xác Nhận
                </button>
            </div>
        </div>
    </div>
);

const SystemTab: React.FC<SystemTabProps> = ({ playerState, setPlayerState }) => {
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isConfirmingImport, setIsConfirmingImport] = useState(false);

    // Cheat menu states
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [itemQuantity, setItemQuantity] = useState<number>(1);
    const [selectedEquipment, setSelectedEquipment] = useState<string>('');
    const [selectedCongPhap, setSelectedCongPhap] = useState<string>('');
    const [selectedTamPhap, setSelectedTamPhap] = useState<string>('');

    // Memoize lists for performance
    const generalItems = useMemo(() => ALL_ITEMS.filter(item => item.type !== 'equipment').sort((a, b) => a.name.localeCompare(b.name)), []);
    const equipmentItems = useMemo(() => ALL_ITEMS.filter(item => item.type === 'equipment').sort((a, b) => a.name.localeCompare(b.name)), []);
    const congPhapSkills = useMemo(() => ALL_SKILLS.filter(skill => skill.type === 'CONG_PHAP').sort((a, b) => a.name.localeCompare(b.name)), []);
    const tamPhapSkills = useMemo(() => ALL_SKILLS.filter(skill => skill.type === 'TAM_PHAP').sort((a, b) => a.name.localeCompare(b.name)), []);
    
    // Set initial default selection
    useEffect(() => {
        if (generalItems.length > 0 && !selectedItem) setSelectedItem(generalItems[0].id);
        if (equipmentItems.length > 0 && !selectedEquipment) setSelectedEquipment(equipmentItems[0].id);
        if (congPhapSkills.length > 0 && !selectedCongPhap) setSelectedCongPhap(congPhapSkills[0].id);
        if (tamPhapSkills.length > 0 && !selectedTamPhap) setSelectedTamPhap(tamPhapSkills[0].id);
    }, [generalItems, equipmentItems, congPhapSkills, tamPhapSkills]);

    const handleExport = () => {
        exportPlayerState(playerState);
        setMessage({ text: 'Dữ liệu đã được sao lưu vào một tệp tin!', type: 'success' });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleInitiateImport = () => {
        setIsConfirmingImport(true);
    };

    const handleConfirmImport = () => {
        setIsConfirmingImport(false);
        importPlayerState(
            (success, msg) => {
                if (success) {
                    setMessage({ text: 'Nhập dữ liệu thành công! Đang tải lại thế giới...', type: 'success' });
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    setMessage({ text: msg, type: 'error' });
                    setTimeout(() => setMessage(null), 5000);
                }
            }
        );
    };

    // --- Cheat Menu Handlers ---
    const handleAddLinhThach = () => {
        setPlayerState(p => ({ ...p, linhThach: p.linhThach + 100000 }));
    };

    const handleAddCamNgo = () => {
        setPlayerState(p => ({ ...p, camNgo: p.camNgo + 50000 }));
    };

    const handleFullHeal = () => {
        setPlayerState(p => ({ ...p, hp: p.stats.maxHp, mana: p.stats.maxMana }));
    };

    const handleFillQi = () => {
        setPlayerState(p => ({...p, qi: p.stats.maxQi}));
    }

    const handleInstantBreakthrough = () => {
        setPlayerState(prev => {
            if (!prev) return prev;
            
            const currentQiFilledState = { ...prev, qi: prev.stats.maxQi };
            const nextCultivation = getNextCultivationLevel(currentQiFilledState.cultivation);
            if (!nextCultivation) return currentQiFilledState;

            const newLevelInfo = getRealmLevelInfo(nextCultivation);
            if (!newLevelInfo) return currentQiFilledState;

            const newCultivationStats = { ...currentQiFilledState.cultivationStats };
            for (const key in newLevelInfo.bonuses) {
                const statKey = key as keyof (CombatStats & CharacterAttributes);
                const value = newLevelInfo.bonuses[statKey];
                let rolledValue = 0;
                if (typeof value === 'number') rolledValue = value;
                else if (Array.isArray(value)) rolledValue = Math.floor(Math.random() * (value[1] - value[0] + 1)) + value[0];
                
                if (rolledValue !== 0) {
                    (newCultivationStats as any)[statKey] = ((newCultivationStats as any)[statKey] || 0) + rolledValue;
                }
            }
            
            const { finalStats, finalAttributes } = calculateAllStats(
                INITIAL_PLAYER_STATE.attributes,
                nextCultivation, 
                newCultivationStats, 
                currentQiFilledState.learnedSkills, 
                ALL_SKILLS, 
                currentQiFilledState.equipment, 
                ALL_ITEMS, 
                currentQiFilledState.linhCan
            );

            return {
                ...currentQiFilledState,
                cultivation: nextCultivation,
                attributes: finalAttributes,
                stats: finalStats,
                cultivationStats: newCultivationStats,
                hp: finalStats.maxHp,
                mana: finalStats.maxMana,
                qi: 0,
            };
        });
    };
    
    const handleAddRareItems = () => {
        const rareItemIds = [
            'consumable_phuong_hoang_niet_ban_hoa', 'consumable_cuu_u_huyen_thuy_tinh',
            'consumable_bat_tu_than_moc_diep', 'consumable_thai_bach_kim_tinh_qua', 'consumable_hon_don_tuc_nhuong'
        ];
        handleAddItem(rareItemIds[Math.floor(Math.random() * rareItemIds.length)], 1);
    };

    const handleAddItem = (itemId: string, quantity: number) => {
        setPlayerState(prev => {
            if (!prev) return prev;
            const itemDef = ALL_ITEMS.find(i => i.id === itemId);
            if (!itemDef) return prev;

            const newInventory = JSON.parse(JSON.stringify(prev.inventory));
            let remainingQuantity = quantity;

            if (itemDef.stackable > 1) {
                for (const slot of newInventory) {
                    if (remainingQuantity <= 0) break;
                    if (slot.itemId === itemId && slot.quantity < itemDef.stackable) {
                        const canAdd = itemDef.stackable - slot.quantity;
                        const amountToStack = Math.min(remainingQuantity, canAdd);
                        slot.quantity += amountToStack;
                        remainingQuantity -= amountToStack;
                    }
                }
            }

            while (remainingQuantity > 0 && newInventory.length < INVENTORY_SIZE) {
                const amountForNewStack = Math.min(remainingQuantity, itemDef.stackable);
                newInventory.push({ itemId, quantity: amountForNewStack });
                remainingQuantity -= amountForNewStack;
            }

            return { ...prev, inventory: newInventory };
        });
    };

    const handleAddSkill = (skillId: string) => {
        setPlayerState(prev => {
            if (!prev) return prev;

            const isAlreadyLearned = prev.learnedSkills.some(s => s.skillId === skillId);
            if (isAlreadyLearned) return prev;

            const skillDef = ALL_SKILLS.find(s => s.id === skillId);
            if (!skillDef) return prev;

            const newLearnedSkills = [...prev.learnedSkills, { skillId, currentLevel: 1 }];

            if (skillDef.type === 'TAM_PHAP') {
                const { finalStats, finalAttributes } = calculateAllStats(prev.attributes, prev.cultivation, prev.cultivationStats, newLearnedSkills, ALL_SKILLS, prev.equipment, ALL_ITEMS, prev.linhCan);
                return {
                    ...prev,
                    learnedSkills: newLearnedSkills,
                    attributes: finalAttributes,
                    stats: finalStats,
                    hp: Math.min(prev.hp, finalStats.maxHp),
                };
            }

            return { ...prev, learnedSkills: newLearnedSkills };
        });
    };

    return (
        <>
            <div className="h-full space-y-8 overflow-y-auto pr-2 scrollbar-thin">
                {/* Save/Load Section */}
                <div className="flex flex-col items-center justify-center text-center gap-6 p-4 bg-black/20 rounded-lg">
                    <GiScrollQuill className="text-7xl text-yellow-300" />
                    <h2 className="text-3xl font-bold text-gray-200">Di Chuyển Thiên Cơ</h2>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        Lưu giữ vận mệnh của đạo hữu vào một cuộn giấy (Xuất) để bảo toàn, hoặc đọc một cuộn giấy khác (Nhập) để bắt đầu một hành trình đã được định sẵn.
                    </p>
                    <div className="flex flex-col md:flex-row gap-8 mt-6">
                        <button
                            onClick={handleExport}
                            className="flex items-center justify-center gap-4 p-6 bg-blue-800/40 border-2 border-blue-500 rounded-lg text-white hover:bg-blue-700/50 hover:border-blue-400 transition-all transform hover:scale-105 w-72 h-32"
                        >
                            <FaUpload className="text-4xl text-blue-300" />
                            <span className="text-2xl font-bold">Sao Chép Vận Mệnh</span>
                        </button>
                        <button
                            onClick={handleInitiateImport}
                            className="flex items-center justify-center gap-4 p-6 bg-green-800/40 border-2 border-green-500 rounded-lg text-white hover:bg-green-700/50 hover:border-green-400 transition-all transform hover:scale-105 w-72 h-32"
                        >
                            <FaDownload className="text-4xl text-green-300" />
                            <span className="text-2xl font-bold">Đọc Vận Mệnh</span>
                        </button>
                    </div>
                    {message && (
                        <div className={`mt-4 text-lg p-3 rounded-md animate-fade-in ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {message.text}
                        </div>
                    )}
                </div>

                {/* Cheat Menu Section */}
                <div className="flex flex-col items-center text-center gap-4 p-4 bg-black/20 rounded-lg border-2 border-red-500/50">
                    <h2 className="text-2xl font-bold text-red-400 flex items-center gap-3"><FaExclamationTriangle /> Bảng Điều Khiển Gian Lận</h2>
                    <p className="text-gray-400 max-w-xl text-sm">Chỉ dùng cho mục đích thử nghiệm. Có thể làm hỏng trải nghiệm game.</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2 w-full max-w-4xl">
                        <button onClick={handleAddLinhThach} className="p-3 bg-yellow-800/40 border border-yellow-600 rounded-lg text-yellow-200 hover:bg-yellow-700/50 transition-colors transform hover:scale-105">Thêm 100k Linh Thạch</button>
                        <button onClick={handleAddCamNgo} className="p-3 bg-cyan-800/40 border border-cyan-600 rounded-lg text-cyan-200 hover:bg-cyan-700/50 transition-colors transform hover:scale-105">Thêm 50k Cảm Ngộ</button>
                        <button onClick={handleFullHeal} className="p-3 bg-green-800/40 border border-green-600 rounded-lg text-green-200 hover:bg-green-700/50 transition-colors transform hover:scale-105 flex items-center justify-center gap-2"><GiHeartPlus/> Hồi Phục</button>
                        <button onClick={handleFillQi} className="p-3 bg-blue-800/40 border border-blue-600 rounded-lg text-blue-200 hover:bg-blue-700/50 transition-colors transform hover:scale-105 flex items-center justify-center gap-2"><GiGalaxy/> Làm Đầy Chân Khí</button>
                        <button onClick={handleInstantBreakthrough} className="p-3 bg-purple-800/40 border border-purple-600 rounded-lg text-purple-200 hover:bg-purple-700/50 transition-colors transform hover:scale-105 flex items-center justify-center gap-2"><GiGalaxy/> Đột Phá Cấp Tốc</button>
                        <button onClick={handleAddRareItems} className="p-3 bg-red-800/40 border border-red-600 rounded-lg text-red-200 hover:bg-red-700/50 transition-colors transform hover:scale-105 flex items-center justify-center gap-2"><FaPlus/> Thêm Linh Căn Quả</button>
                    </div>

                    <div className="mt-6 pt-4 border-t-2 border-red-500/30 w-full">
                        <h3 className="text-xl font-bold text-red-300 text-center mb-4">Thêm Vật Phẩm / Công Pháp</h3>
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {/* Add Item */}
                            <div className="flex items-center gap-2">
                                <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)} className="flex-grow bg-gray-800 border border-gray-600 rounded p-2 text-white">
                                    {generalItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                </select>
                                <input type="number" value={itemQuantity} onChange={e => setItemQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 bg-gray-800 border border-gray-600 rounded p-2 text-white text-center" />
                                <button onClick={() => handleAddItem(selectedItem, itemQuantity)} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-500">Thêm</button>
                            </div>
                            {/* Add Equipment */}
                            <div className="flex items-center gap-2">
                                <select value={selectedEquipment} onChange={e => setSelectedEquipment(e.target.value)} className="flex-grow bg-gray-800 border border-gray-600 rounded p-2 text-white">
                                    {equipmentItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                </select>
                                <button onClick={() => handleAddItem(selectedEquipment, 1)} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-500">Thêm Trang Bị</button>
                            </div>
                            {/* Add Cong Phap */}
                            <div className="flex items-center gap-2">
                                <select value={selectedCongPhap} onChange={e => setSelectedCongPhap(e.target.value)} className="flex-grow bg-gray-800 border border-gray-600 rounded p-2 text-white">
                                    {congPhapSkills.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
                                </select>
                                <button onClick={() => handleAddSkill(selectedCongPhap)} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-500">Học Công Pháp</button>
                            </div>
                            {/* Add Tam Phap */}
                            <div className="flex items-center gap-2">
                                <select value={selectedTamPhap} onChange={e => setSelectedTamPhap(e.target.value)} className="flex-grow bg-gray-800 border border-gray-600 rounded p-2 text-white">
                                    {tamPhapSkills.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
                                </select>
                                <button onClick={() => handleAddSkill(selectedTamPhap)} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-500">Học Tâm Pháp</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isConfirmingImport && (
                <ConfirmationModal
                    onConfirm={handleConfirmImport}
                    onCancel={() => setIsConfirmingImport(false)}
                />
            )}
        </>
    );
};

export default SystemTab;