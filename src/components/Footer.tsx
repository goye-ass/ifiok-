import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="border-t border-white/10 bg-[#070B18] text-xs text-slate-400 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500 font-mono text-xs font-bold text-slate-950">
            IF
          </div>
          <span className="font-semibold text-white tracking-tight">IFIOK Protocol</span>
          <span className="text-slate-600">·</span>
          <span>© 2026 IFIOK Global Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={() => setActiveTab('landing')}
            className="hover:text-white transition-colors"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="hover:text-white transition-colors"
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('escrow')}
            className="hover:text-white transition-colors"
          >
            Smart Escrow
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className="hover:text-white transition-colors"
          >
            Financial Hub
          </button>
        </div>
      </div>
    </footer>
  );
};
