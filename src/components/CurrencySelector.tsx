import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, RefreshCw, Globe, ArrowUpDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CURRENCIES } from '../services/forex';
import { CurrencyCode } from '../types';

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency, liveRates, lastRateUpdate, isForexLoading, refreshLiveRates } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeMeta = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  const activeRate = liveRates[currency] || 1.0;

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currencyList = Object.values(SUPPORTED_CURRENCIES);

  const filteredList = currencyList.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.code.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.country.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button in Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#152243] px-2.5 py-1.5 text-xs font-mono font-medium text-slate-200 hover:border-emerald-500/40 hover:bg-[#1C2B54] transition-all shadow-sm"
        title="Live Global Currency & Forex Engine"
      >
        <span className="text-base leading-none select-none" role="img" aria-label={activeMeta.country}>
          {activeMeta.flag}
        </span>
        <span className="font-bold text-white">{activeMeta.code}</span>
        <span className="hidden xl:inline text-slate-400 font-sans text-[11px]">
          ({activeMeta.symbol})
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-400' : ''
          }`}
        />
      </button>

      {/* Global Currency Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/15 bg-[#131E3A] p-3 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header & Live Status */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                Live Interbank Forex Feed
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                refreshLiveRates();
              }}
              disabled={isForexLoading}
              className="flex items-center gap-1 rounded bg-white/5 hover:bg-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-300 transition-colors disabled:opacity-50"
              title="Fetch latest forex ticks"
            >
              <RefreshCw className={`h-3 w-3 ${isForexLoading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isForexLoading ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>

          <div className="py-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>Baseline: 1 OUSD = 1.00 USD</span>
            <span className="truncate max-w-[140px] text-right text-slate-500">{lastRateUpdate}</span>
          </div>

          {/* Search Field */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currency, flag, country..."
              className="w-full rounded-xl border border-white/10 bg-black/40 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              autoFocus
            />
          </div>

          {/* Currency List */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {filteredList.map((cur) => {
              const isSelected = currency === cur.code;
              const rate = liveRates[cur.code] || 1.0;
              const formattedRate = rate.toLocaleString('en-US', {
                minimumFractionDigits: cur.decimals === 0 ? 0 : 2,
                maximumFractionDigits: cur.decimals === 0 ? 0 : 4,
              });

              return (
                <button
                  key={cur.code}
                  type="button"
                  onClick={() => {
                    setCurrency(cur.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl select-none leading-none shrink-0" role="img" aria-label={cur.country}>
                      {cur.flag}
                    </span>
                    <div className="text-left truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white">{cur.code}</span>
                        <span className="text-[11px] text-slate-400 font-sans truncate">{cur.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {cur.symbol} · {cur.country}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <div className="font-mono text-xs font-semibold text-slate-200 tabular-nums">
                      {formattedRate}
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center justify-end gap-0.5">
                        <Check className="h-3 w-3" /> Active
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredList.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                No matching currencies found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
