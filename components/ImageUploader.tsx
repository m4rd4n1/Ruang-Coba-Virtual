import React, { useRef } from 'react';

interface ImageUploaderProps {
    id: string;
    title: string;
    onImageSelect: (file: File) => void;
    imagePreview: string | null;
    onClear: () => void;
    icon: React.ReactNode;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onImageSelect, imagePreview, onClear, icon }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
    };
    
    const handleClearClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onClear();
      if(inputRef.current) {
        inputRef.current.value = "";
      }
    }

    return (
        <div className="relative bg-gray-800/50 rounded-2xl p-6 border border-dashed border-gray-600 hover:border-indigo-500 transition-colors duration-300">
            <label htmlFor={id} className="cursor-pointer">
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    {imagePreview ? (
                        <img src={imagePreview} alt={title} className="max-h-full max-w-full object-contain rounded-lg" />
                    ) : (
                        <>
                            <div className="w-16 h-16 text-gray-500 mb-4">{icon}</div>
                            <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
                            <p className="text-sm text-gray-400 mt-1">Klik untuk mengunggah gambar</p>
                        </>
                    )}
                </div>
                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>
            {imagePreview && (
                <button 
                    onClick={handleClearClick}
                    className="absolute top-3 right-3 bg-gray-900/70 text-white rounded-full p-1.5 hover:bg-red-500/80 transition-all duration-200"
                    aria-label="Hapus gambar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};