import React, { useState } from 'react';
import { Send, X, AlertCircle, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BlockchainNetwork } from '../types';

export const TransferModal: React.FC = () => {
  const { isTransferModalOpen, setIsTransferModalOpen, user, network, executeTransfer, formatOusd } = useApp();

  const [toAddress, setToAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('500');
  const [targetNetwork, setTargetNetwork] = useState<BlockchainNetwork>(network);

  if (!isTransferModalOpen) return null;

  const numAmount = parseFloat(transferAmount) || 0;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toAddress.trim() || numAmount <= 0) return;
    const success = executeTransfer(toAddress.trim(), numAmount, targetNetwork);
    if (success) {
      setIsTransferModalOpen(false);
      setToAddress('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#131E3A] p-6 shadow-2xl shadow-black/90 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Multi-Chain Web3 Transfer</h2>
              <p className="text-xs text-slate-400">
                Direct peer-to-peer OUSD settlement to any external address
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTransferModalOpen(false)}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSend} className="mt-5 space-y-4 text-xs">
          {/* Target Network */}
          <div>
            <label className="block font-mono text-slate-300 mb-1.5">Destination Blockchain</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Base', 'Solana', 'Polygon'] as BlockchainNetwork[]).map((net) => (
                <button
                  type="button"
                  key={net}
                  onClick={() => setTargetNetwork(net)}
                  className={`rounded-xl border p-2.5 text-center font-mono font-medium transition-all ${
                    targetNetwork === net
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 ring-1 ring-emerald-500/30'
                      : 'border-white/10 bg-black/25 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold">{net}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Paymaster: 0 Gas</div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="rounded-xl bg-black/35 p-4 border border-white/10">
            <div className="flex justify-between items-center text-slate-400 mb-1">
              <span className="font-mono">Amount to Transfer</span>
              <button
                type="button"
                onClick={() => setTransferAmount(user.liquidOusd.toString())}
                className="font-mono text-[11px] text-emerald-400 hover:underline"
              >
                Max: {formatOusd(user.liquidOusd)}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                step="any"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full bg-transparent text-2xl font-mono font-bold text-white focus:outline-none"
                placeholder="100.00"
              />
              <span className="font-mono font-bold text-slate-300 text-sm">OUSD</span>
            </div>
          </div>

          {/* Recipient Address */}
          <div>
            <label className="block text-slate-300 font-mono mb-1">
              Recipient Wallet Address (
              {targetNetwork === 'Solana' ? 'Solana Public Key' : 'EVM Address 0x...'})
            </label>
            <input
              type="text"
              required
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder={
                targetNetwork === 'Solana'
                  ? '7nxW... or 9wQp4LmnA7g3Rks8...'
                  : '0x38F87C9aA045B8dFe9C369B75E54D264f331F45A'
              }
              className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Gas & Fee Notice */}
          <div className="rounded-xl bg-black/25 p-3 border border-white/5 space-y-1 text-slate-300">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Gas Surcharge (Paymaster):</span>
              <span className="font-mono text-emerald-400 font-semibold">$0.00 (Subsidized)</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Expected Block Time:</span>
              <span className="font-mono text-white">&lt; 1.8 seconds</span>
            </div>
          </div>

          <div className="mt-5 flex gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsTransferModalOpen(false)}
              className="w-1/3 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={numAmount <= 0 || numAmount > user.liquidOusd || !toAddress}
              className="w-2/3 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              Send {numAmount} OUSD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
