import React, { useMemo } from 'react';
import type { JournalEntry } from '../../types/character';
import { FaTimes, FaBookOpen } from 'react-icons/fa';

interface SeclusionReportModalProps {
  report: JournalEntry[];
  onClose: () => void;
}

const SeclusionReportModal: React.FC<SeclusionReportModalProps> = ({ report, onClose }) => {
    const groupedJournal = useMemo(() => {
        return report.reduce((acc, entry) => {
            const key = `Tháng ${entry.time.month}, Năm ${entry.time.year}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(entry);
            return acc;
        }, {} as Record<string, JournalEntry[]>);
    }, [report]);

    const sortedGroupKeys = useMemo(() => {
        return Object.keys(groupedJournal).sort((a, b) => {
            const [, monthA, , yearA] = a.split(' ');
            const [, monthB, , yearB] = b.split(' ');
            if (parseInt(yearA) !== parseInt(yearB)) {
                return parseInt(yearA) - parseInt(yearB); // Sort years ascending
            }
            return parseInt(monthA) - parseInt(monthB); // Sort months ascending
        });
    }, [groupedJournal]);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div
                className="bg-gray-900/80 border-2 border-yellow-400/50 rounded-lg shadow-2xl shadow-yellow-500/20 w-full max-w-4xl h-[80vh] flex flex-col backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center border-b-2 border-yellow-400/30 p-4 flex-shrink-0">
                    <h2 className="text-3xl font-bold text-yellow-300 flex items-center gap-3"><FaBookOpen/> Bế Quan Tường Trình</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Đóng">
                        <FaTimes className="h-8 w-8" />
                    </button>
                </header>

                <main className="flex-grow p-4 overflow-y-auto scrollbar-thin chat-history">
                    {sortedGroupKeys.length > 0 ? (
                        <div className="space-y-6">
                            {sortedGroupKeys.map(groupKey => (
                                <div key={groupKey}>
                                    <h3 className="text-2xl font-semibold text-amber-300 border-b border-amber-500/50 pb-2 mb-3 sticky top-0 bg-gray-900/80 py-2 -mt-2">{groupKey}</h3>
                                    <ul className="space-y-2">
                                        {groupedJournal[groupKey]
                                            .map((entry, index) => (
                                            <li key={index} className="text-gray-300 text-sm pl-4 border-l-2 border-gray-700">
                                                {entry.message}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>Thế giới vẫn yên tĩnh trong suốt thời gian bạn bế quan.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SeclusionReportModal;