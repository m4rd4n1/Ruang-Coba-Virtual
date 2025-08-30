import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                Ruang Coba Virtual AI
            </h1>
            <p className="mt-2 text-lg text-gray-400">
                Menyatukan gambar model dengan fesyen nya
            </p>
        </header>
    );
};