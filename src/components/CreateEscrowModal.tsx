import React, { useState } from 'react';
import { Lock, X, Plus, Trash2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Milestone } from '../types';

export const CreateEscrowModal: React.FC = () => {
  const {
    isCreateEscrowModalOpen,
    setIsCreateEscrowModalOpen,
    createEscrowOrder,
    network,
    user,
    formatDualPrice,
    setActiveTab,
  } = useApp();

  const [serviceTitle, setServiceTitle] = useState('Enterprise Microservices Architecture & Audit');
  const [freelancerName, setFreelancerName] = useState('Elena Rostova');
  const [freelancerAddress, setFreelancerAddress] = useState('0x38F87C9aA045B8dFe9C369B75E54D264f331F45A');
  const [totalAmount, setTotalAmount] = useState('6000');

  const [milestones, setMilestones] = useState<{ title: string; amountOusd: number; dueDate: string }[]>([
    {
      title: 'Milestone 1: Architectural Specification & Threat Model',
      amountOusd: 2400,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    },
    {
      title: 'Milestone 2: Production Codebase Delivery & Test Harness',
      amountOusd: 3600,
      dueDate: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
    },
  ]);

  if (!isCreateEscrowModalOpen) return null;

  const totalNumber = parseFloat(totalAmount) || 0;
  const platformFee = totalNumber * 0.025;

  const handleAddMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      {
        title: `Milestone ${prev.length + 1}: Final Review & Handoff`,
        amountOusd: 1000,
        dueDate: new Date(Date.now() + (prev.length + 1) * 7 * 86400000).toISOString().split('T')[0],
      },
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    setMilestones((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateMilestone = (
    index: number,
    field: 'title' | 'amountOusd' | 'dueDate',
    value: any
  ) => {
    setMilestones((prev) =>
      prev.map((m, idx) => (idx === index ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalNumber <= 0) return;

    const formattedMilestones: Milestone[] = milestones.map((m, idx) => ({
      id: `ms-custom-${Date.now()}-${idx + 1}`,
      title: m.title,
      description: 'Standard institutional milestone delivery criteria.',
      amountOusd: Number(m.amountOusd) || Math.round(totalNumber / milestones.length),
      dueDate: m.dueDate,
      status: idx === 0 ? 'in_progress' : 'pending_deposit',
    }));

    createEscrowOrder({
      serviceTitle,
      freelancerName,
      freelancerAddress,
      totalOusd: totalNumber,
      milestones: formattedMilestones,
    });

    setIsCreateEscrowModalOpen(false);
    setActiveTab('escrow');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#131E3A] p-6 shadow-2xl shadow-black/90 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Deploy Smart Escrow Contract</h2>
              <p className="text-xs text-slate-400">
                Non-custodial milestone-locked agreement on {network}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateEscrowModalOpen(false)}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-mono mb-1">Contract / Project Title</label>
            <input
              type="text"
              required
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-mono mb-1">Beneficiary Specialist</label>
              <input
                type="text"
                required
                value={freelancerName}
                onChange={(e) => setFreelancerName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-mono mb-1">Wallet Address (0x...)</label>
              <input
                type="text"
                required
                value={freelancerAddress}
                onChange={(e) => setFreelancerAddress(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Total Contract Amount */}
          <div className="rounded-xl bg-black/35 p-4 border border-white/10">
            <div className="flex justify-between items-center text-slate-400 mb-1">
              <span className="font-mono">Total Escrow Value</span>
              <span className="font-mono text-[11px] text-emerald-400">
                Liquid Balance: ${user.liquidOusd.toLocaleString()} OUSD
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="100"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full bg-transparent text-xl sm:text-2xl font-mono font-bold text-white focus:outline-none"
              />
              <span className="font-mono font-bold text-slate-300">OUSD</span>
            </div>

            <div className="mt-2 text-[11px] text-slate-400 font-mono">
              Fiat Conversion: ≈ {formatDualPrice(totalNumber).fiat} · Platform Fee: 2.5% ({platformFee} OUSD)
            </div>
          </div>

          {/* Milestones list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-mono text-slate-300">Milestone Tranches ({milestones.length})</label>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
              >
                <Plus className="h-3 w-3" />
                <span>Add Tranche</span>
              </button>
            </div>

            <div className="space-y-2">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-black/25 p-3 flex flex-col sm:flex-row items-start sm:items-center gap-2"
                >
                  <span className="font-mono font-bold text-slate-500">0{idx + 1}</span>
                  <input
                    type="text"
                    required
                    value={m.title}
                    onChange={(e) => handleUpdateMilestone(idx, 'title', e.target.value)}
                    placeholder="Milestone Deliverable description"
                    className="flex-1 w-full bg-transparent border-b border-white/10 sm:border-none p-1 text-white focus:outline-none"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="number"
                      required
                      value={m.amountOusd}
                      onChange={(e) => handleUpdateMilestone(idx, 'amountOusd', Number(e.target.value))}
                      className="w-24 rounded bg-black/40 p-1.5 font-mono text-emerald-400 text-right focus:outline-none"
                    />
                    <span className="text-[10px] font-mono text-slate-400">OUSD</span>
                    <input
                      type="date"
                      required
                      value={m.dueDate}
                      onChange={(e) => handleUpdateMilestone(idx, 'dueDate', e.target.value)}
                      className="rounded bg-black/40 p-1.5 text-[11px] text-slate-300 focus:outline-none"
                    />
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(idx)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsCreateEscrowModalOpen(false)}
              className="w-1/3 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={totalNumber <= 0 || totalNumber > user.liquidOusd}
              className="w-2/3 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              Lock {totalNumber.toLocaleString()} OUSD in Smart Escrow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
