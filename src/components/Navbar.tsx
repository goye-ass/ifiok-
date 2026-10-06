import React, { useState } from 'react';
import {
  Wallet,
  ChevronDown,
  ArrowRightLeft,
  ShieldCheck,
  Check,
  User,
  ExternalLink,
  Layers,
  Sparkles,
  LogOut,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CurrencySelector } from './CurrencySelector';
import { BlockchainNetwork } from '../types';

export const Navbar: React.FC = () => {
  const {
    user,
    connectWallet,
    disconnectWallet,
    claimFaucetOusd,
    switchRole,
    network,
    setNetwork,
    orders,
    activeTab,
    setActiveTab,
    setIsPrivyModalOpen,
    setIsPayoutModalOpen,
    setIsOnRampModalOpen,
  } = useApp();

  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const activeOrdersCount = orders.filter((o) => o.status === 'active').length;
  const networks: BlockchainNetwork[] = ['Base', 'Solana', 'Polygon'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B132B]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: IFIOK Brand Wordmark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 font-mono text-base font-extrabold text-slate-950 shadow-sm shadow-emerald-500/25">
              IF
            </div>
            <span className="font-sans text-xl font-extrabold tracking-tight text-white">
              IFIOK
            </span>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => setActiveTab('landing')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === 'landing'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === 'marketplace'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('escrow')}
              className={`relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === 'escrow'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Smart Escrow
              {activeOrdersCount > 0 && (
                <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 rounded">
                  {activeOrdersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === 'financial'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Financial Hub
            </button>
          </nav>
        </div>

        {/* Zone 3: Dynamic Controls & Wallet State */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Currency & Flag Selector */}
          <CurrencySelector />

          {/* Blockchain Network Switcher */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setIsNetworkDropdownOpen(!isNetworkDropdownOpen);
                setIsProfileDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#152243] px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-[#1C2B54] transition-colors"
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  network === 'Base'
                    ? 'bg-blue-400'
                    : network === 'Solana'
                    ? 'bg-purple-400'
                    : 'bg-indigo-400'
                }`}
              />
              <span className="font-mono text-xs">{network}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {isNetworkDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#131E3A] p-1.5 shadow-xl shadow-black/40 z-50">
                <div className="px-2 py-1 text-[11px] font-mono text-slate-400">
                  Settlement Network
                </div>
                {networks.map((net) => (
                  <button
                    key={net}
                    onClick={() => {
                      setNetwork(net);
                      setIsNetworkDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors ${
                      network === net
                        ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          net === 'Base'
                            ? 'bg-blue-400'
                            : net === 'Solana'
                            ? 'bg-purple-400'
                            : 'bg-indigo-400'
                        }`}
                      />
                      <span>{net} (Sub-second)</span>
                    </span>
                    {network === net && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Persona Role Switcher */}
          <button
            onClick={() => switchRole(user.role === 'client' ? 'freelancer' : 'client')}
            className="hidden lg:flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-900/50 transition-colors"
            title="Toggle Hirer vs Specialist Mode"
          >
            <ArrowRightLeft className="h-3 w-3" />
            <span>{user.role === 'client' ? 'Hirer Mode' : 'Specialist Mode'}</span>
          </button>

          {/* Dynamic Wallet State */}
          {user.isConnected ? (
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  setIsNetworkDropdownOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#152243] p-1.5 pr-2.5 text-xs text-slate-200 hover:border-emerald-500/40 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-6 w-6 rounded-full object-cover ring-1 ring-emerald-500/40"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-mono text-[11px] font-semibold text-emerald-300 leading-none tabular-nums">
                    {user.liquidOusd.toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{' '}
                    OUSD
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono leading-tight">
                    {user.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : 'Connected'}
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/15 bg-[#131E3A] p-2.5 shadow-2xl shadow-black/60 z-50">
                  <div className="p-2 border-b border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{user.name}</span>
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono font-medium text-emerald-400">
                        Privy MPC Active
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    <div className="mt-1 font-mono text-[10px] text-slate-400 break-all bg-black/40 p-1.5 rounded-lg border border-white/5">
                      {user.address}
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <div className="px-2 py-1 text-[11px] text-slate-400 flex justify-between font-mono">
                      <span>Liquid OUSD</span>
                      <span className="text-emerald-400 font-semibold tabular-nums">
                        ${user.liquidOusd.toLocaleString()}
                      </span>
                    </div>
                    <div className="px-2 py-1 text-[11px] text-slate-400 flex justify-between font-mono">
                      <span>In Smart Escrow</span>
                      <span className="text-white font-semibold tabular-nums">
                        ${user.inEscrowOusd.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-1">
                    {/* Faucet button */}
                    <button
                      onClick={() => {
                        claimFaucetOusd(2500);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/20 transition-colors font-medium"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Claim Testnet OUSD</span>
                      </span>
                      <span className="font-mono text-[10px]">+2,500 OUSD</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsOnRampModalOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors font-medium"
                    >
                      <span>Deposit / Buy OUSD</span>
                      <span className="text-[10px] opacity-80">MoonPay/Card</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsPayoutModalOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/5 transition-colors"
                    >
                      <span>Global Bank Payout</span>
                      <span className="text-[10px] text-slate-400">SWIFT/SEPA</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsPrivyModalOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/5 transition-colors"
                    >
                      <span>Privy Auth & Keys</span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        disconnectWallet();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-950/30 transition-colors"
                    >
                      <span>Disconnect Wallet</span>
                      <LogOut className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => connectWallet('privy')}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex md:hidden border-t border-white/5 bg-[#0B132B] px-3 py-2 justify-around">
        <button
          onClick={() => setActiveTab('landing')}
          className={`text-xs font-medium ${activeTab === 'landing' ? 'text-emerald-400' : 'text-slate-400'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`text-xs font-medium ${activeTab === 'marketplace' ? 'text-emerald-400' : 'text-slate-400'}`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab('escrow')}
          className={`text-xs font-medium flex items-center gap-1 ${
            activeTab === 'escrow' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          Escrow
          {activeOrdersCount > 0 && (
            <span className="rounded bg-emerald-500/20 px-1 font-mono text-[10px] text-emerald-400">
              {activeOrdersCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className={`text-xs font-medium ${activeTab === 'financial' ? 'text-emerald-400' : 'text-slate-400'}`}
        >
          Financial Hub
        </button>
      </div>
    </header>
  );
};
