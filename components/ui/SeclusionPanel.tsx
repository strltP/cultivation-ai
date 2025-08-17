import React, { useState, useMemo } from 'react';
import type { PlayerState } from '../../types/character';
import { FaTimes } from 'react-icons/fa';
import { GiCaveEntrance, GiSandsOfTime, GiGalaxy, GiBrain } from 'react-icons/gi';
import { DAYS_PER_MONTH } from '../../hooks/usePlayerPersistence';


interface SeclusionPanelProps {
    playerState: PlayerState;
    onClose: () => void;
    onStart: (months: number) => void;
}

const MAX_SECLUSION_MONTHS = 120; // 10 years

const SeclusionPanel: React.FC<SeclusionPanelProps> = ({ playerState, onClose, onStart }) => {
    const [months, setMonths] = useState(1);

    const handleStartSeclusion = () => {
        onStart(months);
        onClose();
    };

    const estimatedQiGain = useMemo(() => {
        // This calculation MUST match handleStartSeclusion in usePlayerActions.ts
        const totalHoursToAdvance = months * DAYS_PER_MONTH * 24;
        
        const SECLUSION_QI_PER_HOUR_BASE = 1.5;
        const NGO_TINH_FACTOR_QI = 0.05;
        const realmMultiplier = 1 + (playerState.cultivation.realmIndex * 0.15);
        
        const qiPerHour = (SECLUSION_QI_PER_HOUR_BASE + (playerState.attributes.ngoTinh * NGO_TINH_FACTOR_QI)) * realmMultiplier;
        
        return Math.floor(qiPerHour * totalHoursToAdvance);
    }, [months, playerState.attributes.ngoTinh, playerState.cultivation.realmIndex]);
    
    const estimatedCamNgoGain = useMemo(() => {
        // This calculation MUST match handleStartSeclusion in usePlayerActions.ts
        const CAM_NGO_PER_MONTH_BASE = 50;
        return Math.round((CAM_NGO_PER_MONTH_BASE + playerState.attributes.ngoTinh * 2 + playerState.attributes.tamCanh * 2) * months);
    }, [months, playerState.attributes.ngoTinh, playerState.attributes.tamCanh]);

    const yearsPassed = Math.floor(months / 12);
    const monthsPassed = months % 12;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 animate-fade-in" onClick={onClose}>
            <div
                className="bg-gray-900/80 border-2 border-cyan-400/50 rounded-lg shadow-2xl shadow-cyan-500/20 w-full max-w-lg flex flex-col backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center border-b-2 border-cyan-400/30 p-4 flex-shrink-0">
                    <h2 className="text-3xl font-bold text-cyan-300 flex items-center gap-3"><GiCaveEntrance /> Bế Quan Tu Luyện</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Đóng"><FaTimes className="h-7 w-7" /></button>
                </header>

                <main className="p-6 space-y-6">
                    <p className="text-gray-300 text-center">Chọn thời gian bế quan. Thời gian trôi đi, vạn vật biến đổi, tu vi của bạn cũng sẽ tăng tiến. Sinh lực và linh lực sẽ được hồi phục hoàn toàn.</p>

                    <div>
                        <label htmlFor="seclusion-months" className="block text-xl font-semibold text-center text-white mb-2">{months} Tháng</label>
                        <input
                            id="seclusion-months"
                            type="range"
                            min="1"
                            max={MAX_SECLUSION_MONTHS}
                            value={months}
                            onChange={(e) => setMonths(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                         <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>1 Tháng</span>
                            <span>{MAX_SECLUSION_MONTHS / 12} Năm</span>
                        </div>
                    </div>

                    <div className="bg-black/20 p-4 rounded-lg border border-gray-700 space-y-3">
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-semibold text-gray-300 flex items-center gap-2"><GiSandsOfTime /> Thời gian trôi qua:</span>
                            <span className="font-bold text-white">
                                {yearsPassed > 0 && `${yearsPassed} năm `}
                                {monthsPassed > 0 && `${monthsPassed} tháng`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-semibold text-gray-300 flex items-center gap-2"><GiGalaxy /> Chân khí ước tính:</span>
                            <span className="font-bold text-cyan-300">~{estimatedQiGain.toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between items-center text-lg">
                            <span className="font-semibold text-gray-300 flex items-center gap-2"><GiBrain /> Cảm ngộ ước tính:</span>
                            <span className="font-bold text-purple-300">~{estimatedCamNgoGain.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleStartSeclusion}
                        className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg text-xl hover:scale-105 transition-transform"
                    >
                        Bắt Đầu Bế Quan
                    </button>
                </main>
            </div>
        </div>
    );
};

export default SeclusionPanel;
