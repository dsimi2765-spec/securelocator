import React from 'react';
import { LegalModalType } from '../types';

interface FooterProps {
  openModal: (type: LegalModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ openModal }) => {
  return (
    <footer className="bg-[#f2f4f6] dark:bg-[#2d3133] border-t border-[#e2e8f0] dark:border-[#434655]/40 w-full mt-auto transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-center py-6 px-5 md:px-8 w-full max-w-[1200px] mx-auto gap-4">
        <div className="text-xs font-bold text-[#1e293b] dark:text-[#eff1f3]">
          © 2024 SecureLocator Systems. All rights reserved.
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <button
            onClick={() => openModal('privacy')}
            className="text-xs text-[#38485d] dark:text-[#bec6e0] hover:text-[#004ac6] dark:hover:text-[#b4c5ff] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => openModal('terms')}
            className="text-xs text-[#38485d] dark:text-[#bec6e0] hover:text-[#004ac6] dark:hover:text-[#b4c5ff] transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={() => openModal('whitepaper')}
            className="text-xs text-[#38485d] dark:text-[#bec6e0] hover:text-[#004ac6] dark:hover:text-[#b4c5ff] transition-colors cursor-pointer"
          >
            Security Whitepaper
          </button>
          <button
            onClick={() => openModal('support')}
            className="text-xs text-[#38485d] dark:text-[#bec6e0] hover:text-[#004ac6] dark:hover:text-[#b4c5ff] transition-colors cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </div>
    </footer>
  );
};
