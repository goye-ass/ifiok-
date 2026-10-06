import React from 'react';
import {
  Shield,
  Zap,
  Globe2,
  Lock,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Building2,
  FileCode2,
  Scale,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setIsOnRampModalOpen, setIsPrivyModalOpen, currency, formatDualPrice } = useApp();

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-16 overflow-hidden">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="pointer-events-none absolute top-40 right-10 h-[350px] w-[450px] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-medium text-emerald-300 backdrop-blur-md mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Next-Gen Web3 Infrastructure · Open USD (OUSD)</span>
              </div>

              <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.12]">
                The Global Operating System for Freelance Services & Instant OUSD Settlement
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Empower your enterprise to hire elite technical talent and independent specialists with zero cross-border friction. Non-custodial milestone smart contracts hold OUSD until deliverable approval, accompanied by zero-fee transfers and instant multi-fiat bank liquidation.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/35 active:scale-[0.99]"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setActiveTab('escrow')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-[0.99]"
                >
                  <span>Active Smart Escrows</span>
                </button>

                <button
                  onClick={() => setIsPrivyModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#152243] px-4 py-3.5 text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-[#1C2B54] transition-colors"
                >
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Privy Auth Flow</span>
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6 w-full max-w-xl">
                <div>
                  <div className="font-mono text-2xl font-bold text-white tabular-nums">$48.6M+</div>
                  <div className="text-xs text-slate-400 mt-1">Escrow Settled in 2026</div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">&lt; 2.4s</div>
                  <div className="text-xs text-slate-400 mt-1">Milestone Sign-Off Latency</div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-white tabular-nums">0.00%</div>
                  <div className="text-xs text-slate-400 mt-1">Gas Fees (Paymaster)</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Visual Display */}
            <div className="lg:col-span-5 relative">
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#131E3A] shadow-2xl shadow-black/80">
                <img
                  src="/src/assets/images/ifiok_hero_banner_1791320511778.jpg"
                  alt="IFIOK Smart Escrow Engine"
                  className="w-full h-72 object-cover object-center filter brightness-95"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/40 to-transparent" />

                {/* Live Escrow Card Simulator inside visual */}
                <div className="p-5 relative -mt-16 bg-[#131E3A]/90 backdrop-blur-md rounded-b-2xl border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-mono text-xs font-semibold text-emerald-400">
                        LIVE SMART ESCROW · BASE L2
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">Contract #OUSD-9821</span>
                  </div>

                  <div className="mt-3 text-sm font-semibold text-white">
                    Enterprise Full-Stack Web3 DApp & L2 Architecture
                  </div>

                  <div className="mt-3 flex items-center justify-between rounded-lg bg-black/40 p-3 border border-white/5">
                    <div>
                      <div className="text-[11px] text-slate-400">Total Locked Escrow</div>
                      <div className="font-mono text-base font-bold text-white tabular-nums">
                        9,500.00 OUSD
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Selected Fiat ({currency})</div>
                      <div className="font-mono text-sm font-semibold text-emerald-300 tabular-nums">
                        {formatDualPrice(9500).fiat}
                      </div>
                    </div>
                  </div>

                  {/* Milestone visual progress indicator */}
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Milestone 2 of 3</span>
                      <span className="text-emerald-400 font-mono">Sign-Off Ready</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 w-[68%]" />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setActiveTab('escrow')}
                      className="w-full rounded-lg bg-emerald-500 py-2 text-center text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
                    >
                      View Live Milestone Contract
                    </button>
                    <button
                      onClick={() => setIsOnRampModalOpen(true)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/10"
                    >
                      On-Ramp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Architecture Pillars */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Engineered for High-Stakes Global Engagements
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Traditional freelancing portals impose 20% middlemen cuts, arbitrary chargebacks, and 5-to-10 day wire holds. IFIOK transforms project settlement into an automated cryptographic protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="rounded-xl border border-white/10 bg-[#131E3A] p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-colors group">
            <div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Non-Custodial Smart Escrow</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Funds reside in audited multi-chain contracts (Base, Solana, Polygon). Neither party can unilaterally drain capital without verifiable milestone sign-off.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-[11px] font-mono text-emerald-400">
              Verified Open USD Smart Vaults
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-xl border border-white/10 bg-[#131E3A] p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-colors group">
            <div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Instant Sub-Second Settlement</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                When the hirer signs off on a delivered milestone, OUSD arrives in the freelancer's embedded wallet immediately with zero waiting periods.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-[11px] font-mono text-emerald-400">
              Zero-Delay Finality
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-xl border border-white/10 bg-[#131E3A] p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-colors group">
            <div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Global Bank Liquidation</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Withdraw OUSD directly to commercial bank accounts in 140+ countries via SEPA Instant, Fedwire, ACH, and Faster Payments at nominal 0.25% rates.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-[11px] font-mono text-emerald-400">
              USD · EUR · GBP · CAD · AUD · JPY
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="rounded-xl border border-white/10 bg-[#131E3A] p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-colors group">
            <div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Neutral Dispute Protocol</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Objective mediation backed by cryptographic evidence logs, git commit verification, and neutral technical arbiters to ensure fair outcomes.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-[11px] font-mono text-emerald-400">
              Protocol Invariant #24
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Matrix: Legacy vs IFIOK */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-[#131E3A] p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Comparative Analysis
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Legacy Freelance Portals vs. IFIOK Protocol
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono">
                  <th className="pb-3 pr-4 font-medium">Metric / Capability</th>
                  <th className="pb-3 px-4 font-medium text-slate-400">Upwork & Legacy Platforms</th>
                  <th className="pb-3 pl-4 font-semibold text-emerald-400">IFIOK Web3 Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-4 pr-4 font-medium text-white">Platform Commission</td>
                  <td className="py-4 px-4 text-slate-400">10% – 20% fee deduction</td>
                  <td className="py-4 pl-4 font-semibold text-emerald-400">
                    2.5% protocol fee (Up to 8x lower)
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium text-white">Payout Settlement Time</td>
                  <td className="py-4 px-4 text-slate-400">5 to 14 business days hold</td>
                  <td className="py-4 pl-4 font-semibold text-emerald-400">
                    Sub-second instant smart contract release
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium text-white">Cross-Border FX Markup</td>
                  <td className="py-4 px-4 text-slate-400">3% – 5% hidden currency spread</td>
                  <td className="py-4 pl-4 font-semibold text-emerald-400">
                    Transparent 0.25% wholesale liquidation
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium text-white">Escrow Custody</td>
                  <td className="py-4 px-4 text-slate-400">Centralized database ledger</td>
                  <td className="py-4 pl-4 font-semibold text-emerald-400">
                    Non-custodial smart contracts (Base/Solana/Polygon)
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium text-white">Wallet Experience</td>
                  <td className="py-4 px-4 text-slate-400">Complex bank verification delays</td>
                  <td className="py-4 pl-4 font-semibold text-emerald-400">
                    Privy silent social login + auto-generated OUSD wallet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Featured Service Spotlight */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              High-Value Digital Services Feed
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Vetted principal engineers, AI specialists, and institutional designers ready for milestone contracts.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>View All Enterprise Services</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => setActiveTab('marketplace')}
            className="cursor-pointer rounded-xl border border-white/10 bg-[#131E3A] overflow-hidden hover:border-emerald-500/40 transition-all group"
          >
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/service_web3_preview_1791320524800.jpg"
                alt="Web3 Architecture"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#0B132B]/85 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-mono text-emerald-300 border border-white/10">
                Web3 & Smart Contracts
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                Enterprise Full-Stack Web3 DApp & L2 Architecture
              </h3>
              <p className="mt-2 text-xs text-slate-300 line-clamp-2">
                Turnkey enterprise decentralization: custom Solidity smart contracts, ERC-4337 account abstraction, and Base deployment.
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400">Contract Size</span>
                  <div className="font-mono text-sm font-bold text-white">9,500 OUSD</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400">Fiat Equivalent</span>
                  <div className="font-mono text-xs font-semibold text-emerald-400">
                    {formatDualPrice(9500).fiat}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => setActiveTab('marketplace')}
            className="cursor-pointer rounded-xl border border-white/10 bg-[#131E3A] overflow-hidden hover:border-emerald-500/40 transition-all group"
          >
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/service_ai_preview_1791320536825.jpg"
                alt="AI Model Fine Tuning"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#0B132B]/85 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-mono text-emerald-300 border border-white/10">
                AI & ML Systems
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                Custom Enterprise LLM Fine-Tuning & High-Throughput RAG
              </h3>
              <p className="mt-2 text-xs text-slate-300 line-clamp-2">
                Parameter-efficient fine-tuning (LoRA/QLoRA), hybrid vector indexing, evaluation harness, and self-hosted vLLM serving.
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400">Contract Size</span>
                  <div className="font-mono text-sm font-bold text-white">12,000 OUSD</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400">Fiat Equivalent</span>
                  <div className="font-mono text-xs font-semibold text-emerald-400">
                    {formatDualPrice(12000).fiat}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => setActiveTab('marketplace')}
            className="cursor-pointer rounded-xl border border-white/10 bg-[#131E3A] overflow-hidden hover:border-emerald-500/40 transition-all group"
          >
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/service_design_preview_1791320550009.jpg"
                alt="Design System"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#0B132B]/85 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-mono text-emerald-300 border border-white/10">
                UI/UX & Design Systems
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                Institutional Multi-Platform Design System & Figma Tokens
              </h3>
              <p className="mt-2 text-xs text-slate-300 line-clamp-2">
                Foundational semantic tokens to multi-device React/Tailwind component libraries with automated Figma-to-code syncing.
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400">Contract Size</span>
                  <div className="font-mono text-sm font-bold text-white">7,800 OUSD</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400">Fiat Equivalent</span>
                  <div className="font-mono text-xs font-semibold text-emerald-400">
                    {formatDualPrice(7800).fiat}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#131E3A] via-[#10302E] to-[#131E3A] p-8 sm:p-12">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to execute milestone agreements with zero latency?
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Create your non-custodial smart escrow in 60 seconds with social authentication and automated multi-chain wallet generation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('marketplace')}
                className="rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                Browse Marketplace Services
              </button>
              <button
                onClick={() => setActiveTab('financial')}
                className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-bold text-white hover:bg-white/10 transition-colors"
              >
                Access Financial Hub
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
