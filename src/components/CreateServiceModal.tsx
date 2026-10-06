import React, { useState } from 'react';
import { Layers, X, Plus, Trash2, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceItem } from '../types';

export const CreateServiceModal: React.FC = () => {
  const { isCreateServiceModalOpen, setIsCreateServiceModalOpen, publishService, user, formatDualPrice } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceItem['category']>('Web3 & Smart Contracts');
  const [description, setDescription] = useState('');
  const [startingPriceOusd, setStartingPriceOusd] = useState('5000');
  const [deliveryDays, setDeliveryDays] = useState('14');
  const [skillsText, setSkillsText] = useState('Solidity, Foundry, Next.js, TypeScript');
  const [highlight1, setHighlight1] = useState('Production deployment verified across testnets');
  const [highlight2, setHighlight2] = useState('100% test coverage with automated invariant suite');

  if (!isCreateServiceModalOpen) return null;

  const numPrice = parseFloat(startingPriceOusd) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || numPrice <= 0) return;

    const skills = skillsText.split(',').map((s) => s.trim()).filter(Boolean);

    publishService({
      title,
      category,
      freelancer: {
        name: user.name || 'Verified Specialist',
        handle: user.email ? user.email.split('@')[0] : 'specialist.eth',
        title: user.company || 'Senior Technical Contractor',
        rating: 5.0,
        reviewCount: 1,
        completedOrders: 1,
        earnedOusd: numPrice,
        avatar: user.avatar,
        address: user.address,
        isVerified: true,
        location: 'Global (Remote)',
      },
      description,
      startingPriceOusd: numPrice,
      deliveryDays: Number(deliveryDays) || 14,
      skills: skills.length ? skills : ['Technical Architecture', 'Production Delivery'],
      image:
        category === 'AI & ML Systems'
          ? '/src/assets/images/service_ai_preview_1791320536825.jpg'
          : category === 'UI/UX & Design Systems'
          ? '/src/assets/images/service_design_preview_1791320550009.jpg'
          : '/src/assets/images/service_web3_preview_1791320524800.jpg',
      defaultMilestones: [
        {
          title: 'Milestone 1: Architecture Specification & Core Spec',
          description: 'Blueprint delivery, environment provisioning, and validation tests.',
          percentage: 40,
        },
        {
          title: 'Milestone 2: Final Implementation & Production Handover',
          description: 'Final code delivery, documentation, and live mainnet verification.',
          percentage: 60,
        },
      ],
      portfolioHighlights: [highlight1, highlight2].filter(Boolean),
    });

    setIsCreateServiceModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-[#131E3A] p-6 shadow-2xl shadow-black/90 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">List Professional Service</h2>
              <p className="text-xs text-slate-400">
                Offer enterprise deliverables settled in Open USD (OUSD)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateServiceModalOpen(false)}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-mono mb-1">Service Offering Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sub-Second Arbitrage Execution Engine in Rust"
              className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-mono mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Web3 & Smart Contracts">Web3 & Smart Contracts</option>
                <option value="AI & ML Systems">AI & ML Systems</option>
                <option value="UI/UX & Design Systems">UI/UX & Design Systems</option>
                <option value="Security & Audits">Security & Audits</option>
                <option value="Quant & Algorithmic">Quant & Algorithmic</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-mono mb-1">Turnaround Days</label>
              <input
                type="number"
                min="1"
                required
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-xl bg-black/35 p-4 border border-white/10">
            <div className="flex justify-between items-center text-slate-400 mb-1">
              <span className="font-mono">Base Contract Price</span>
              <span className="font-mono text-xs text-emerald-400">
                ≈ {formatDualPrice(numPrice).fiat}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="100"
                required
                value={startingPriceOusd}
                onChange={(e) => setStartingPriceOusd(e.target.value)}
                className="w-full bg-transparent text-2xl font-mono font-bold text-white focus:outline-none"
                placeholder="5000"
              />
              <span className="font-mono font-bold text-slate-300">OUSD</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">Deliverable Scope & Overview</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail your engineering methodologies, deliverables, and architecture guarantees..."
              className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">
              Technical Skill Tags (comma-separated)
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="Solidity, Rust, PyTorch, Kubernetes"
              className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="mt-5 flex gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsCreateServiceModalOpen(false)}
              className="w-1/3 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Publish to Marketplace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
