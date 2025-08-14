import React, { useState } from 'react';
import type { PlayerState } from '../../../types/character';
import { exportPlayerState, importPlayerState } from '../../../hooks/usePlayerPersistence';
import { FaDownload, FaUpload } from 'react-icons/fa';

interface SystemTabProps {
  playerState: PlayerState;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState | null>>;
}

const SystemTab: React.FC<SystemTabProps> = ({ playerState, setPlayerState }) => {
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleExport = () => {
        exportPlayerState(playerState);
        setMessage({ text: 'Dữ liệu đã được xuất thành công!', type: 'success' });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleImport = () => {
        importPlayerState(
            (newState) => {
                setPlayerState(newState);
                setMessage({ text: 'Nhập dữ liệu thành công! Thế giới sẽ được tải lại.', type: 'success' });
                // No need for timeout, the game will reload.
            },
            (success, msg) => {
                if (!success) {
                    setMessage({ text: msg, type: 'error' });
                    setTimeout(() => setMessage(null), 5000);
                }
            }
        );
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center gap-8 p-8">
            <h2 className="text-3xl font-bold text-gray-300">Quản Lý Dữ Liệu</h2>
            <p className="text-gray-400 max-w-xl">
                Bạn có thể lưu tiến trình tu luyện của mình vào một file trên máy tính (Xuất Dữ Liệu) hoặc tải lại một hành trình đã lưu trước đó (Nhập Dữ Liệu).
            </p>
            <div className="flex gap-8 mt-4">
                <button
                    onClick={handleExport}
                    className="flex flex-col items-center justify-center gap-4 p-8 bg-blue-600/30 border-2 border-blue-500 rounded-lg text-white hover:bg-blue-500/40 hover:border-blue-400 transition-all transform hover:scale-105 w-64 h-48"
                >
                    <FaUpload className="text-5xl" />
                    <span className="text-2xl font-bold">Xuất Dữ Liệu</span>
                </button>
                <button
                    onClick={handleImport}
                    className="flex flex-col items-center justify-center gap-4 p-8 bg-green-600/30 border-2 border-green-500 rounded-lg text-white hover:bg-green-500/40 hover:border-green-400 transition-all transform hover:scale-105 w-64 h-48"
                >
                    <FaDownload className="text-5xl" />
                    <span className="text-2xl font-bold">Nhập Dữ Liệu</span>
                </button>
            </div>
            {message && (
                <div className={`mt-4 text-lg p-3 rounded-md ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default SystemTab;
