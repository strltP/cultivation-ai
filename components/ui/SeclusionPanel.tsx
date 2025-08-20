import React, { useState, useMemo, useEffect } from 'react';
import type { PlayerState } from '../../types/character';
import { FaTimes } from 'react-icons/fa';
import { GiCaveEntrance, GiSandsOfTime, GiGalaxy, GiBrain } from 'react-icons/gi';
import { DAYS_PER_MONTH } from '../../hooks/usePlayerPersistence';


interface SeclusionPanelProps {
    playerState: PlayerState;
    onClose: () => void;
    onStart: (days: number) => void;
}

const MAX_SECLUSION_DAYS = 3600; // 10 years * 12 months * 30 days

const TimeInput: React.FC<{ label: string; value: number; onIncrement: () => void; onDecrement: () => void; onChange: (value: number) => void; }> = ({ label, value, onIncrement, onDecrement, onChange }) => (
    <div className="flex flex-col items-center gap-2">
        <label className="text-gray-400 text-sm">{label}</label>
        <div className="flex items-center gap-2">
            <button onClick={onDecrement} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">-</button>
            <input 
                type="number" 
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
                className="w-20 text-center bg-gray-800 border border-gray-600 rounded p-1 text-xl font-bold" 
            />
            <button onClick={onIncrement} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">+</button>
        </div>
    </div>
);


const SeclusionPanel: React.FC<SeclusionPanelProps> = ({ playerState, onClose, onStart }) => {
    const [days, setDays] = useState(0);
    const [months, setMonths] = useState(1);
    const [years, setYears] = useState(0);

    const totalDays = useMemo(() => years * 12 * DAYS_PER_MONTH + months * DAYS_PER_MONTH + days, [years, months, days]);
    
    useEffect(() => {
        if (totalDays > MAX_SECLUSION_DAYS) {
            setYears(10);
            setMonths(0);
            setDays(0);
        }
    }, [totalDays]);

    const handleSetDuration = (d: number, m: number, y: number) => {
        setDays(d);
        setMonths(m);
        setYears(y);
    };
    
    const handleDayChange = (op: 1 | -1 | 'input', value?: number) => {
        let currentDays = days;
        if (op === 'input') currentDays = value || 0;
        else currentDays += op;

        if (currentDays >= DAYS_PER_MONTH) {
            setMonths(months + Math.floor(currentDays / DAYS_PER_MONTH));
            setDays(currentDays % DAYS_PER_MONTH);
        } else if (currentDays < 0) {
            setMonths(months - 1);
            setDays(DAYS_PER_MONTH - 1);
        } else {
            setDays(currentDays);
        }
    };
     const handleMonthChange = (op: 1 | -1 | 'input', value?: number) => {
        let currentMonths = months;
        if (op === 'input') currentMonths = value || 0;
        else currentMonths += op;
        
        if (currentMonths >= 12) {
            setYears(years + Math.floor(currentMonths / 12));
            setMonths(currentMonths % 12);
        } else if (currentMonths < 0) {
            setYears(years - 1);
            setMonths(11);
        } else {
            setMonths(currentMonths);
        }
    };
     const handleYearChange = (op: 1 | -1 | 'input', value?: number) => {
        let currentYears = years;
        if (op === 'input') currentYears = value || 0;
        else currentYears += op;
        
        setYears(Math.max(0, currentYears));
    };

    const handleStartSeclusion = () => {
        if (totalDays <= 0) return;
        onStart(totalDays);
        onClose();
    };

    const estimatedQiGain = useMemo(() => {
        const totalHoursToAdvance = totalDays * 24;
        const SECLUSION_QI_PER_HOUR_BASE = 0.15;
        const NGO_TINH_FACTOR_QI = 0.005;
        const realmMultiplier = 1 + (playerState.cultivation.realmIndex * 0.15);
        const qiPerHour = (SECLUSION_QI_PER_HOUR_BASE + (playerState.attributes.ngoTinh * NGO_TINH_FACTOR_QI)) * realmMultiplier;
        return Math.floor(qiPerHour * totalHoursToAdvance);
    }, [totalDays, playerState.attributes.ngoTinh, playerState.cultivation.realmIndex]);
    
    const estimatedCamNgoGain = useMemo(() => {
        const CAM_NGO_PER_DAY_BASE = 10 / DAYS_PER_MONTH;
        const ngoTinhFactor = 0.5 / DAYS_PER_MONTH;
        const tamCanhFactor = 0.5 / DAYS_PER_MONTH;
        return Math.round((CAM_NGO_PER_DAY_BASE + playerState.attributes.ngoTinh * ngoTinhFactor + playerState.attributes.tamCanh * tamCanhFactor) * totalDays);
    }, [totalDays, playerState.attributes.ngoTinh, playerState.attributes.tamCanh]);

    const yearsPassed = Math.floor(totalDays / (12 * DAYS_PER_MONTH));
    const monthsPassed = Math.floor((totalDays % (12 * DAYS_PER_MONTH)) / DAYS_PER_MONTH);
    const daysPassed = totalDays % DAYS_PER_MONTH;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 animate-fade-in" onClick={onClose}>
            <div
                className="bg-gray-900/80 border-2 border-cyan-400/50 rounded-lg shadow-2xl shadow-cyan-500/20 w-full max-w-2xl flex flex-col backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center border-b-2 border-cyan-400/30 p-4 flex-shrink-0">
                    <h2 className="text-3xl font-bold text-cyan-300 flex items-center gap-3"><GiCaveEntrance /> Bế Quan Tu Luyện</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Đóng"><FaTimes className="h-7 w-7" /></button>
                </header>

                <main className="p-6 space-y-6">
                    <p className="text-gray-300 text-center">Chọn thời gian bế quan. Thời gian trôi đi, vạn vật biến đổi, tu vi của bạn cũng sẽ tăng tiến. Sinh lực và linh lực sẽ được hồi phục hoàn toàn.</p>
                    
                    <div className="flex justify-center items-end gap-4 bg-black/20 p-4 rounded-lg">
                        <TimeInput label="Ngày" value={days} onIncrement={() => handleDayChange(1)} onDecrement={() => handleDayChange(-1)} onChange={(v) => setDays(v)} />
                        <TimeInput label="Tháng" value={months} onIncrement={() => handleMonthChange(1)} onDecrement={() => handleMonthChange(-1)} onChange={(v) => setMonths(v)} />
                        <TimeInput label="Năm" value={years} onIncrement={() => handleYearChange(1)} onDecrement={() => handleYearChange(-1)} onChange={(v) => setYears(v)} />
                    </div>

                    <div className="flex justify-center gap-2 flex-wrap">
                        <button onClick={() => handleSetDuration(10, 0, 0)} className="text-sm py-1 px-3 bg-gray-700 rounded-full hover:bg-gray-600">10 Ngày</button>
                        <button onClick={() => handleSetDuration(0, 1, 0)} className="text-sm py-1 px-3 bg-gray-700 rounded-full hover:bg-gray-600">1 Tháng</button>
                        <button onClick={() => handleSetDuration(0, 6, 0)} className="text-sm py-1 px-3 bg-gray-700 rounded-full hover:bg-gray-600">6 Tháng</button>
                        <button onClick={() => handleSetDuration(0, 0, 1)} className="text-sm py-1 px-3 bg-gray-700 rounded-full hover:bg-gray-600">1 Năm</button>
                        <button onClick={() => handleSetDuration(0, 0, 10)} className="text-sm py-1 px-3 bg-gray-700 rounded-full hover:bg-gray-600">10 Năm</button>
                    </div>

                    <div className="bg-black/20 p-4 rounded-lg border border-gray-700 space-y-3">
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-semibold text-gray-300 flex items-center gap-2"><GiSandsOfTime /> Thời gian trôi qua:</span>
                            <span className="font-bold text-white">
                                {yearsPassed > 0 && `${yearsPassed} năm `}
                                {monthsPassed > 0 && `${monthsPassed} tháng `}
                                {daysPassed > 0 && `${daysPassed} ngày`}
                                {totalDays === 0 && 'Không có'}
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
                        disabled={totalDays <= 0}
                        className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg text-xl hover:scale-105 transition-transform disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        Bắt Đầu Bế Quan
                    </button>
                </main>
            </div>
        </div>
    );
};

export default SeclusionPanel;
