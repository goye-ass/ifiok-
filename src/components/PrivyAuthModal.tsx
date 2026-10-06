import React, { useState } from 'react';
import {
  Lock,
  X,
  CheckCircle2,
  Key,
  Shield,
  Copy,
  Check,
  Mail,
  Smartphone,
  ExternalLink,
  RefreshCw,
  LogOut,
  Layers,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrivyAuthModal: React.FC = () => {
  const { isPrivyModalOpen, setIsPrivyModalOpen, user, setUser, switchRole, showToast, disconnectWallet } = useApp();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showKeyWarning, setShowKeyWarning] = useState(false);
  const [customName, setCustomName] = useState(user.name);
  const [customCompany, setCustomCompany] = useState(user.company || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  if (!isPrivyModalOpen) return null;

  const handleCopy = (val: string, keyName: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'linkedin') => {
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setUser((prev) => ({
      ...prev,
      isConnected: true,
      authProvider: provider,
      email: `${provider}.user@enterprise.io`,
      name: provider === 'google' ? 'Google Enterprise Lead' : provider === 'apple' ? 'Executive Director' : 'Technology Officer',
      address: `0x${randomHex}`,
      isVerified: true,
    }));
    showToast('Privy Social Sign-In Complete', `Authenticated via ${provider.toUpperCase()}. Embedded multi-chain wallet provisioned silently.`);
  };

  const handleConnectInjected = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          setUser((prev) => ({
            ...prev,
            isConnected: true,
            authProvider: 'web3',
            address: accounts[0],
            name: `Web3 Partner (${accounts[0].slice(0, 6)})`,
          }));
          showToast('Injected Web3 Wallet Connected', `Bound account ${accounts[0]}`);
          return;
        }
      }
    } catch (e) {
      console.warn('Injected wallet connection declined or not available:', e);
    }

    // Fallback simulated Web3 connection
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setUser((prev) => ({
      ...prev,
      isConnected: true,
      authProvider: 'web3',
      address: `0x${randomHex}`,
      name: 'Web3 Institutional Key',
    }));
    showToast('Web3 Provider Connected', 'Provisioned non-custodial signer on Base L2.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: customName,
      company: customCompany,
    }));
    setIsEditingProfile(false);
    showToast('Profile Updated', 'Saved credentials across dynamic storage.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#131E3A] p-6 shadow-2xl shadow-black/90 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Privy Embedded Wallet Engine</h2>
              <p className="text-xs text-slate-400">
                Silent MPC multi-chain keys · Zero seed phrases
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPrivyModalOpen(false)}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-xs">
          {/* Current Active Account Card */}
          <div className="rounded-xl bg-black/35 p-4 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-white text-sm">
                    <span>{user.name}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {user.email || 'No email associated'} · {user.company || 'IFIOK Member'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-[11px] text-emerald-400 hover:underline font-mono"
              >
                {isEditingProfile ? 'Cancel' : 'Edit Name'}
              </button>
            </div>

            {/* Inline Profile Edit Form */}
            {isEditingProfile && (
              <form onSubmit={handleSaveProfile} className="pt-2 border-t border-white/5 space-y-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono">Display Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/40 p-2 text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono">Company / Organization</label>
                  <input
                    type="text"
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/40 p-2 text-white text-xs focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                >
                  Save Profile
                </button>
              </form>
            )}

            {/* Generated Wallet Addresses */}
            <div className="space-y-2 pt-2 border-t border-white/5 font-mono">
              <div>
                <div className="text-[10px] text-slate-400">EVM Address (Base & Polygon):</div>
                <div className="flex items-center justify-between bg-black/40 p-2 rounded text-[11px] text-slate-200">
                  <span className="truncate mr-2">{user.address}</span>
                  <button
                    onClick={() => handleCopy(user.address, 'evm')}
                    className="text-emerald-400 hover:text-emerald-300 shrink-0"
                  >
                    {copiedKey === 'evm' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400">Solana Keypair:</div>
                <div className="flex items-center justify-between bg-black/40 p-2 rounded text-[11px] text-slate-200">
                  <span className="truncate mr-2">{user.solanaAddress}</span>
                  <button
                    onClick={() => handleCopy(user.solanaAddress, 'solana')}
                    className="text-emerald-400 hover:text-emerald-300 shrink-0"
                  >
                    {copiedKey === 'solana' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social Sign-In Switches (Privy Providers) */}
          <div>
            <label className="block font-mono text-slate-300 mb-2">
              Connect / Re-Authenticate via Social SSO or Web3
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-black/25 py-2 px-2 hover:bg-white/5 transition-colors text-white font-medium"
              >
                <span>Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin('apple')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-black/25 py-2 px-2 hover:bg-white/5 transition-colors text-white font-medium"
              >
                <span>Apple</span>
              </button>
              <button
                onClick={() => handleSocialLogin('linkedin')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-black/25 py-2 px-2 hover:bg-white/5 transition-colors text-white font-medium"
              >
                <span>LinkedIn</span>
              </button>
              <button
                onClick={handleConnectInjected}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 py-2 px-2 hover:bg-emerald-900/40 transition-colors text-emerald-300 font-medium"
              >
                <Wallet className="h-3.5 w-3.5" />
                <span>Web3 Wallet</span>
              </button>
            </div>
          </div>

          {/* Role Switching */}
          <div>
            <label className="block font-mono text-slate-300 mb-1.5">
              Marketplace Persona
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => switchRole('client')}
                className={`rounded-xl border p-2.5 text-center transition-all ${
                  user.role === 'client'
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-semibold'
                    : 'border-white/10 bg-black/20 text-slate-400'
                }`}
              >
                <div>Hire Global Talent (Hirer)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Deploy Smart Escrows</div>
              </button>

              <button
                type="button"
                onClick={() => switchRole('freelancer')}
                className={`rounded-xl border p-2.5 text-center transition-all ${
                  user.role === 'freelancer'
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-semibold'
                    : 'border-white/10 bg-black/20 text-slate-400'
                }`}
              >
                <div>Provide Services (Specialist)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Receive Instant Settlement</div>
              </button>
            </div>
          </div>

          {/* Security & Key Recovery Notice */}
          <div className="rounded-xl border border-white/10 bg-black/20 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>Multi-Party Computation (MPC) Sharding</span>
              </div>
              <button
                onClick={() => setShowKeyWarning(!showKeyWarning)}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                {showKeyWarning ? 'Hide details' : 'Export notice'}
              </button>
            </div>

            {showKeyWarning && (
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-white/5">
                Privy secures your embedded OUSD wallet across independent threshold security enclaves. Neither IFIOK nor Privy holds your full private key. You can safely off-ramp funds to your bank anytime without seed phrases.
              </p>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => {
                disconnectWallet();
                setIsPrivyModalOpen(false);
              }}
              className="w-1/3 rounded-xl border border-red-500/30 bg-red-950/20 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-950/40 transition-colors"
            >
              Disconnect
            </button>
            <button
              onClick={() => setIsPrivyModalOpen(false)}
              className="w-2/3 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              Done & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
