import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-white border-t border-gray-100 py-6 text-[11px] text-gray-400 mt-12">
            <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div>
                    <span className="font-bold text-nutri-primaryDark">NutriGrow</span>
                    <p className="mt-0.5">© 2026 NutriGrow. Supportive Nurturing for every child.</p>
                </div>
                <div className="flex gap-4">
                    <a href="#" className="hover:underline">Terms</a>
                    <a href="#" className="hover:underline">Privacy</a>
                    <a href="#" className="hover:underline">Support</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
