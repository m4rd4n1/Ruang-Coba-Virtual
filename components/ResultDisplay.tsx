import React, { useState, useEffect } from 'react';
import { Spinner } from './Spinner';
import { MagicWandIcon } from './icons';

interface ResultDisplayProps {
    resultImage: string | null;
    isLoading: boolean;
    error: string | null;
}

const loadingMessages = [
    "Memanaskan penata gaya AI...",
    "Menjahit piksel menjadi satu...",
    "Menyempurnakan ukuran dan lipatan...",
    "Merender tekstur yang realistis...",
    "Menyelesaikan tampilan virtual..."
];

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ resultImage, isLoading, error }) => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (isLoading) {
            const intervalId = setInterval(() => {
                setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
            }, 2500);
            return () => clearInterval(intervalId);
        }
    }, [isLoading]);
    
    const handleDownload = () => {
        if(!resultImage) return;
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = 'hasil-coba-virtual.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Spinner />
                    <p className="mt-4 text-lg font-semibold text-indigo-400">{loadingMessages[messageIndex]}</p>
                    <p className="mt-2 text-sm text-gray-400">Ini mungkin memakan waktu sejenak. Mohon bersabar.</p>
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                     <div className="w-16 h-16 text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                     </div>
                    <h3 className="text-lg font-semibold text-red-400">Terjadi Kesalahan</h3>
                    <p className="text-sm text-gray-400 mt-2 bg-gray-900/50 p-3 rounded-md">{error}</p>
                </div>
            );
        }
        if (resultImage) {
            return (
                <>
                    <img src={resultImage} alt="Hasil coba-coba virtual" className="w-full h-auto object-contain rounded-lg" />
                    <button 
                        onClick={handleDownload}
                        className="absolute bottom-4 right-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-all duration-300 flex items-center gap-2 shadow-lg"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Unduh
                    </button>
                </>
            );
        }
        return (
            <div className="flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 text-gray-600 mb-4">
                    <MagicWandIcon />
                </div>
                <h3 className="text-xl font-semibold text-gray-400">Hasil Anda Menanti</h3>
                <p className="text-gray-500 mt-2">Gambar yang dihasilkan akan muncul di sini.</p>
            </div>
        );
    };

    return (
        <div className="relative w-full aspect-[2/3] bg-gray-800/50 rounded-2xl p-4 border border-gray-700 flex items-center justify-center">
            {renderContent()}
        </div>
    );
};