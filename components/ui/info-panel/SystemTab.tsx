import React, { useState } from 'react';
import type { PlayerState } from '../../../types/character';
import { exportPlayerState, importPlayerState } from '../../../hooks/usePlayerPersistence';
import { FaDownload, FaUpload, FaExclamationTriangle } from 'react-icons/fa';
import { GiScrollQuill } from 'react-icons/gi';

interface SystemTabProps {
  playerState: PlayerState;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState | null>>;
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

    return (
        <>
            <div className="flex flex-col items-center justify-center h-full text-center gap-6 p-4 bg-black/20 rounded-lg">
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