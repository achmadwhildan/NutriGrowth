import React from 'react';

const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-nutri-primary/20 rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-4 border-nutri-primary border-t-transparent rounded-full animate-spin absolute inset-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-nutri-primary rounded-full animate-ping"></div>
                </div>
            </div>
            <p className="mt-4 text-nutri-primaryDark font-bold text-sm tracking-widest uppercase animate-pulse">
                Memuat...
            </p>
        </div>
    );
};

export default LoadingScreen;
