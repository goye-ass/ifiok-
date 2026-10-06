import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Star,
  Clock,
  Layers,
  ShieldCheck,
  Plus,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceItem } from '../types';

export const MarketplaceFeed: React.FC = () => {
  const {
    services,
    formatDualPrice,
    setSelectedService,
    setActiveTab,
    createEscrowOrder,
    user,
    setIsCreateEscrowModalOpen,
    setIsCreateServiceModalOpen,
    seedBenchmarkServices,
    clearAllServices,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMaxDelivery, setSelectedMaxDelivery] = useState<number>(30);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);

  const categories = [
    'All',
    'Web3 & Smart Contracts',
    'AI & ML Systems',
    'UI/UX & Design Systems',
    'Security & Audits',
    'Quant & Algorithmic',
    'Cloud & DevOps',
  ];

  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      // Category match
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Delivery days
      if (item.deliveryDays > selectedMaxDelivery) {
        return false;
      }
      // Verified only
      if (onlyVerified && !item.freelancer.isVerified) {
        return false;
      }
      // Search query (title, freelancer name, skills)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesFreelancer = item.freelancer.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesSkill = item.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesFreelancer && !matchesDesc && !matchesSkill) {
          return false;
        }
      }
      return true;
    });
  }, [services, selectedCategory, selectedMaxDelivery, onlyVerified, searchQuery]);

  const handleHireDirect = (service: ServiceItem) => {
    setActiveServiceModal(service);
  };

  const handleConfirmEscrowHire = (service: ServiceItem) => {
    createEscrowOrder({
      serviceId: service.id,
      serviceTitle: service.title,
      freelancerName: service.freelancer.name,
      freelancerAddress: service.freelancer.address,
      freelancerAvatar: service.freelancer.avatar,
      totalOusd: service.startingPriceOusd,
      milestones: service.defaultMilestones.map((dm, idx) => ({
        id: `ms-${service.id}-${idx + 1}`,
        title: dm.title,
        description: dm.description,
        amountOusd: Math.round(service.startingPriceOusd * (dm.percentage / 100)),
        dueDate: new Date(Date.now() + (idx + 1) * 7 * 86400000).toISOString().split('T')[0],
        status: idx === 0 ? 'in_progress' : 'pending_deposit',
      })),
    });
    setActiveServiceModal(null);
    setActiveTab('escrow');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            IFIOK Global Enterprise Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Vetted Technical Talent & Digital Services
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-2xl">
            Contracts settled in Open USD (OUSD) via non-custodial smart escrows with real-time multi-fiat pricing conversions.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCreateServiceModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-[#15254A] px-3.5 py-2.5 text-xs font-bold text-emerald-300 hover:bg-[#1C2F5E] transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Post Service Offering</span>
          </button>

          <button
            onClick={() => setIsCreateEscrowModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Deploy Custom Escrow</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-4">
        {/* Search input and inline toggles */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by specialty, skill (Solidity, PyTorch, Figma), or contractor..."
              className="w-full rounded-xl border border-white/10 bg-[#131E3A] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors ${
                onlyVerified
                  ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300'
                  : 'border-white/10 bg-[#131E3A] text-slate-300 hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Verified Only</span>
            </button>

            <select
              value={selectedMaxDelivery}
              onChange={(e) => setSelectedMaxDelivery(Number(e.target.value))}
              className="rounded-xl border border-white/10 bg-[#131E3A] px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value={30}>Delivery: Any time</option>
              <option value={14}>Under 14 days</option>
              <option value={10}>Under 10 days</option>
            </select>
          </div>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'bg-[#131E3A] text-slate-300 hover:bg-[#1C2B54] hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid or Empty State Pattern */}
      {filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#131E3A] p-12 text-center max-w-xl mx-auto">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/40 border border-white/10 mx-auto text-slate-400">
            <Layers className="h-7 w-7 text-emerald-400" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">No Services Found</h3>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            {services.length === 0
              ? 'The marketplace database is currently empty. You can post a new service offering or load benchmark enterprise listings.'
              : 'No services match the active filters or search keyword. Try clearing filters or refining your query.'}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {services.length === 0 ? (
              <>
                <button
                  onClick={() => setIsCreateServiceModalOpen(true)}
                  className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  Post First Service Offering
                </button>
                <button
                  onClick={seedBenchmarkServices}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
                >
                  Restore Benchmark Services
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setOnlyVerified(false);
                }}
                className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
              >
                Reset Filter Criteria
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const dualPrice = formatDualPrice(service.startingPriceOusd);

            return (
              <div
                key={service.id}
                className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#131E3A] overflow-hidden hover:border-emerald-500/40 transition-all duration-200 group"
              >
                <div>
                  {/* Service Image with fallback */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-95"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#0B132B]/85 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono text-emerald-300 border border-white/10">
                      {service.category}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#0B132B]/85 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono text-amber-300 border border-white/10">
                      <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                      <span>{service.freelancer.rating}</span>
                      <span className="text-slate-400">({service.freelancer.reviewCount})</span>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Freelancer Profile Row */}
                    <div className="flex items-center gap-3">
                      <img
                        src={service.freelancer.avatar}
                        alt={service.freelancer.name}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-emerald-500/40"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-white truncate">
                            {service.freelancer.name}
                          </span>
                          {service.freelancer.isVerified && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {service.freelancer.title}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mt-3.5 text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Zero-Pill Skill Tags: Clean typography with separators */}
                    <div className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400 font-mono">
                      {service.skills.slice(0, 4).map((skill, sIdx) => (
                        <React.Fragment key={skill}>
                          <span className="hover:text-slate-200">{skill}</span>
                          {sIdx < Math.min(service.skills.length - 1, 3) && (
                            <span className="text-slate-600">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Delivery & Milestones unboxed metadata */}
                    <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400 border-t border-white/5 pt-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span>{service.deliveryDays}d turnaround</span>
                      </span>
                      <span>·</span>
                      <span>{service.defaultMilestones.length} Smart Milestones</span>
                      <span>·</span>
                      <span className="truncate">{service.freelancer.location}</span>
                    </div>
                  </div>
                </div>

                {/* Footer with Real-Time Dual-Pricing and Action */}
                <div className="p-5 pt-0">
                  <div className="rounded-lg bg-black/30 p-3 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                        Settlement Price
                      </div>
                      <div className="font-mono text-base font-bold text-white tabular-nums">
                        {dualPrice.ousd}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                        Live Converted Fiat
                      </div>
                      <div className="font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                        {dualPrice.fiat}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleHireDirect(service)}
                      className="w-full rounded-lg bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm"
                    >
                      View Scope & Escrow
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Service Details & Escrow Initialization Modal */}
      {activeServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#131E3A] p-6 shadow-2xl shadow-black/80 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <span className="font-mono text-xs text-emerald-400">
                  {activeServiceModal.category}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {activeServiceModal.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveServiceModal(null)}
                className="text-slate-400 hover:text-white rounded-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-5">
              {/* Freelancer Header */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/5">
                <img
                  src={activeServiceModal.freelancer.avatar}
                  alt={activeServiceModal.freelancer.name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white">
                      {activeServiceModal.freelancer.name}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      ({activeServiceModal.freelancer.handle})
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-xs text-slate-300">
                    {activeServiceModal.freelancer.title} · {activeServiceModal.freelancer.location}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Contract Address: {activeServiceModal.freelancer.address}
                  </div>
                </div>
              </div>

              {/* Scope Description */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400">Scope of Work</h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {activeServiceModal.description}
                </p>
              </div>

              {/* Milestone Breakdown */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">
                  Smart Escrow Milestone Schedule
                </h4>
                <div className="space-y-2">
                  {activeServiceModal.defaultMilestones.map((m, idx) => {
                    const milestoneOusd = Math.round(
                      activeServiceModal.startingPriceOusd * (m.percentage / 100)
                    );
                    return (
                      <div
                        key={idx}
                        className="rounded-lg border border-white/5 bg-black/20 p-3 text-xs"
                      >
                        <div className="flex justify-between font-semibold text-white">
                          <span>{m.title}</span>
                          <span className="font-mono text-emerald-400">
                            {milestoneOusd.toLocaleString()} OUSD ({m.percentage}%)
                          </span>
                        </div>
                        <p className="mt-1 text-slate-300 text-[11px]">{m.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Portfolio Highlights */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Institutional Portfolio Proof
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {activeServiceModal.portfolioHighlights.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & Deposit Summary */}
              <div className="rounded-xl bg-black/40 p-4 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="text-xs text-slate-400">Total Contract Value</div>
                  <div className="font-mono text-xl font-bold text-white">
                    {formatDualPrice(activeServiceModal.startingPriceOusd).ousd}
                  </div>
                  <div className="text-xs font-mono text-emerald-400">
                    ≈ {formatDualPrice(activeServiceModal.startingPriceOusd).fiat}
                  </div>
                </div>

                <div className="text-right sm:text-right text-xs text-slate-400">
                  <div>Platform Fee: 2.5% (Non-custodial)</div>
                  <div>Network: Paymaster Sponsored (0 gas)</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setActiveServiceModal(null)}
                className="w-1/3 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmEscrowHire(activeServiceModal)}
                className="w-2/3 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Lock Escrow & Begin Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
