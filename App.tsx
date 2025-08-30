import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { generateTryOnImage } from './services/geminiService';
import { UploadedImage } from './types';
import { PersonIcon, ShirtIcon } from './components/icons';

const App: React.FC = () => {
    const [modelImage, setModelImage] = useState<UploadedImage | null>(null);
    const [clothingImage, setClothingImage] = useState<UploadedImage | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (
        setter: React.Dispatch<React.SetStateAction<UploadedImage | null>>
    ) => (file: File) => {
        setter({
            file,
            previewUrl: URL.createObjectURL(file),
        });
        setResultImage(null);
        setError(null);
    };

    const handleClearImage = (
        setter: React.Dispatch<React.SetStateAction<UploadedImage | null>>
    ) => () => {
        setter(null);
        setResultImage(null);
    }

    const handleGenerate = useCallback(async () => {
        if (!modelImage || !clothingImage) {
            setError("Harap unggah gambar model dan gambar pakaian.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResultImage(null);

        try {
            const generatedImage = await generateTryOnImage(modelImage.file, clothingImage.file);
            setResultImage(generatedImage);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    }, [modelImage, clothingImage]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-7xl mx-auto">
                <Header />
                <main className="mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Inputs */}
                        <div className="lg:col-span-1 flex flex-col gap-8">
                            <ImageUploader
                                id="model-image"
                                title="Gambar Model"
                                onImageSelect={handleImageUpload(setModelImage)}
                                imagePreview={modelImage?.previewUrl || null}
                                onClear={handleClearImage(setModelImage)}
                                icon={<PersonIcon />}
                            />
                            <ImageUploader
                                id="clothing-image"
                                title="Item Pakaian"
                                onImageSelect={handleImageUpload(setClothingImage)}
                                imagePreview={clothingImage?.previewUrl || null}
                                onClear={handleClearImage(setClothingImage)}
                                icon={<ShirtIcon />}
                            />
                        </div>

                        {/* Action & Result */}
                        <div className="lg:col-span-2 flex flex-col gap-8">
                             <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 backdrop-blur-sm">
                                <h2 className="text-xl font-bold text-center text-indigo-400 mb-4">Hasilkan Gambar</h2>
                                <p className="text-center text-gray-400 mb-6">
                                    Setelah kedua gambar diunggah, klik tombol di bawah untuk melihat keajaibannya. AI akan memasangkan pakaian pada model secara realistis.
                                </p>
                                <button
                                    onClick={handleGenerate}
                                    disabled={!modelImage || !clothingImage || isLoading}
                                    className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 shadow-lg shadow-indigo-600/30"
                                >
                                    {isLoading ? 'Menghasilkan...' : 'Coba Virtual'}
                                </button>
                            </div>
                            <ResultDisplay
                                resultImage={resultImage}
                                isLoading={isLoading}
                                error={error}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;