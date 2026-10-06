import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  Send,
  FileCheck2,
  Scale,
  Sparkles,
  Copy,
  Check,
  Plus,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EscrowOrder, Milestone } from '../types';

export const EscrowOrdersView: React.FC = () => {
  const {
    orders,
    approveMilestone,
    submitDeliverable,
    raiseDispute,
    resolveDispute,
    formatDualPrice,
    user,
    setIsCreateEscrowModalOpen,
    setActiveTab,
  } = useApp();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Deliverable modal state
  const [activeDeliverableModal, setActiveDeliverableModal] = useState<{
    orderId: string;
    milestoneId: string;
    milestoneTitle: string;
  } | null>(null);
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [deliverableNotes, setDeliverableNotes] = useState('');

  // Dispute modal state
  const [activeDisputeModal, setActiveDisputeModal] = useState<{
    orderId: string;
    milestoneId: string;
  } | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleConfirmDeliverable = () => {
    if (!activeDeliverableModal) return;
    submitDeliverable(
      activeDeliverableModal.orderId,
      activeDeliverableModal.milestoneId,
      deliverableUrl || 'https://github.com/ifiok-protocol/releases/tag/v1.0.0',
      deliverableNotes || 'All test suites passing with invariant verification.'
    );
    setActiveDeliverableModal(null);
    setDeliverableUrl('');
    setDeliverableNotes('');
  };

  const handleConfirmDispute = () => {
    if (!activeDisputeModal) return;
    raiseDispute(
      activeDisputeModal.orderId,
      activeDisputeModal.milestoneId,
      disputeReason || 'Specification mismatch regarding test coverage requirements.'
    );
    setActiveDisputeModal(null);
    setDisputeReason('');
  };

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border border-white/10 bg-[#131E3A] p-12 text-center max-w-lg mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black/40 border border-white/10 mx-auto text-emerald-400">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-white">No Active Smart Escrows</h2>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            There are currently no active smart escrow contracts deployed under your connected wallet. You can deploy a custom milestone agreement or hire verified talent from the marketplace.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setIsCreateEscrowModalOpen(true)}
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Deploy Custom Escrow
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
            >
              Explore Marketplace Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            Non-Custodial Milestone Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Enterprise Smart Escrows
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Open USD locked in multi-chain smart contracts. Milestone sign-offs trigger instant settlement directly to beneficiary wallets.
          </p>
        </div>

        <button
          onClick={() => setIsCreateEscrowModalOpen(true)}
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>New Escrow Contract</span>
        </button>
      </div>

      {/* Main Grid: Orders list on left, Active Escrow detail on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orders Selector Column */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
            Active Contracts ({orders.length})
          </div>

          <div className="space-y-2.5">
            {orders.map((ord) => {
              const isSelected = ord.id === (currentOrder?.id || selectedOrderId);
              const completedMilestones = ord.milestones.filter(
                (m) => m.status === 'approved_released'
              ).length;

              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 ${
                    isSelected
                      ? 'border-emerald-500/50 bg-[#15254A] shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/20'
                      : 'border-white/10 bg-[#131E3A] hover:border-white/20 hover:bg-[#152243]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-emerald-400">{ord.id}</span>
                    <span
                      className={`font-mono text-[11px] px-2 py-0.5 rounded ${
                        ord.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : ord.status === 'in_dispute'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {ord.status === 'completed'
                        ? 'Settled'
                        : ord.status === 'in_dispute'
                        ? 'Arbitration'
                        : 'In Progress'}
                    </span>
                  </div>

                  <h4 className="mt-2 text-sm font-semibold text-white line-clamp-1">
                    {ord.serviceTitle}
                  </h4>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
                    <span className="truncate">Hirer: {ord.clientName.split(' ')[0]}</span>
                    <span className="font-mono font-bold text-white tabular-nums">
                      {ord.totalOusd.toLocaleString()} OUSD
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400"
                        style={{
                          width: `${(completedMilestones / ord.milestones.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">
                      {completedMilestones}/{ord.milestones.length}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Order Detailed View */}
        {currentOrder && (
          <div className="lg:col-span-8 space-y-6">
            {/* Order Summary Header Card */}
            <div className="rounded-2xl border border-white/15 bg-[#131E3A] p-6 shadow-xl shadow-black/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>SMART CONTRACT #{currentOrder.id}</span>
                    <span>·</span>
                    <span>{currentOrder.network} Network</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {currentOrder.serviceTitle}
                  </h2>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-400">Total Locked Escrow</div>
                  <div className="font-mono text-xl sm:text-2xl font-extrabold text-white tabular-nums">
                    {currentOrder.totalOusd.toLocaleString()} OUSD
                  </div>
                  <div className="font-mono text-xs text-emerald-400">
                    ≈ {formatDualPrice(currentOrder.totalOusd).fiat}
                  </div>
                </div>
              </div>

              {/* Counterparty metadata bar */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-black/25 p-3.5 border border-white/5 flex items-center gap-3">
                  <img
                    src={currentOrder.clientAvatar}
                    alt={currentOrder.clientName}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-white/20"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-slate-400 font-mono">Hirer / Client</div>
                    <div className="text-xs font-semibold text-white truncate">
                      {currentOrder.clientName}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 truncate">
                      {currentOrder.clientAddress}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-black/25 p-3.5 border border-white/5 flex items-center gap-3">
                  <img
                    src={currentOrder.freelancerAvatar}
                    alt={currentOrder.freelancerName}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-emerald-500/40"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-slate-400 font-mono">
                      Specialist Beneficiary
                    </div>
                    <div className="text-xs font-semibold text-white truncate">
                      {currentOrder.freelancerName}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 truncate">
                      {currentOrder.freelancerAddress}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract address copyable bar */}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-black/40 px-3 py-2 text-xs text-slate-400 border border-white/5">
                <span className="font-mono text-[11px] truncate mr-2">
                  Non-Custodial Vault: {currentOrder.contractAddress}
                </span>
                <button
                  onClick={() => handleCopy(currentOrder.contractAddress)}
                  className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 hover:text-emerald-300 shrink-0"
                >
                  {copiedAddress === currentOrder.contractAddress ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dispute Alert Banner if flagged */}
              {currentOrder.status === 'in_dispute' && (
                <div className="mt-4 rounded-xl border border-amber-500/40 bg-[#2C1D0D] p-4 text-xs text-amber-200">
                  <div className="flex items-center gap-2 font-semibold text-amber-300">
                    <Scale className="h-4 w-4" />
                    <span>Dispute Protocol Active (Invariant #24)</span>
                  </div>
                  <p className="mt-1 text-slate-300 leading-relaxed">
                    {currentOrder.disputeReason}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => resolveDispute(currentOrder.id, 'refund')}
                      className="rounded bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 border border-amber-500/30"
                    >
                      Arbitrator: Issue Client Refund
                    </button>
                    <button
                      onClick={() => resolveDispute(currentOrder.id, 'release')}
                      className="rounded bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30"
                    >
                      Arbitrator: Release to Freelancer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Milestones Engine Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">
                  Milestone Sign-Off Timeline
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Platform Commission: 2.5% ({currentOrder.platformFeeOusd} OUSD)
                </span>
              </div>

              <div className="space-y-3">
                {currentOrder.milestones.map((milestone, idx) => {
                  const isApproved = milestone.status === 'approved_released';
                  const isSubmitted = milestone.status === 'submitted_review';
                  const isInProgress = milestone.status === 'in_progress';
                  const isDisputed = milestone.status === 'disputed';

                  return (
                    <div
                      key={milestone.id}
                      className={`rounded-xl border p-5 transition-all ${
                        isApproved
                          ? 'border-emerald-500/30 bg-[#0F222B]/70'
                          : isSubmitted
                          ? 'border-blue-500/40 bg-[#12213F]'
                          : isDisputed
                          ? 'border-amber-500/40 bg-[#261C12]'
                          : 'border-white/10 bg-[#131E3A]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-400">
                              0{idx + 1}.
                            </span>
                            <h4 className="text-sm font-semibold text-white">
                              {milestone.title}
                            </h4>
                          </div>
                          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>

                        <div className="text-left sm:text-right shrink-0">
                          <div className="font-mono text-base font-bold text-white tabular-nums">
                            {milestone.amountOusd.toLocaleString()} OUSD
                          </div>
                          <div className="font-mono text-xs text-emerald-400">
                            ≈ {formatDualPrice(milestone.amountOusd).fiat}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Target: {milestone.dueDate}
                          </div>
                        </div>
                      </div>

                      {/* Deliverables details if submitted or approved */}
                      {milestone.deliverableUrl && (
                        <div className="mt-4 rounded-lg bg-black/30 p-3 border border-white/5 text-xs space-y-1">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="font-mono text-[11px] text-emerald-400">
                              Artifact Link:
                            </span>
                            <a
                              href={milestone.deliverableUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-400 hover:underline"
                            >
                              <span>{milestone.deliverableUrl}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          {milestone.deliverableNotes && (
                            <div className="text-slate-300 text-[11px]">
                              <span className="text-slate-400">Notes: </span>
                              {milestone.deliverableNotes}
                            </div>
                          )}
                          {milestone.txHash && (
                            <div className="font-mono text-[10px] text-slate-400">
                              Release Tx: {milestone.txHash}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Milestone State Actions */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {isApproved && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-300">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Settled & Transferred</span>
                            </span>
                          )}
                          {isSubmitted && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-300">
                              <FileCheck2 className="h-3.5 w-3.5" />
                              <span>Awaiting Hirer Sign-Off</span>
                            </span>
                          )}
                          {isInProgress && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              <span>Active Work Phase</span>
                            </span>
                          )}
                          {isDisputed && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              <span>Under Arbitration</span>
                            </span>
                          )}
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex items-center gap-2">
                          {/* Deliverable submission button */}
                          {(isInProgress || isSubmitted) && (
                            <button
                              onClick={() =>
                                setActiveDeliverableModal({
                                  orderId: currentOrder.id,
                                  milestoneId: milestone.id,
                                  milestoneTitle: milestone.title,
                                })
                              }
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
                            >
                              {isSubmitted ? 'Update Artifact' : 'Submit Artifact'}
                            </button>
                          )}

                          {/* Instant release button for Hirer */}
                          {isSubmitted && (
                            <button
                              onClick={() => approveMilestone(currentOrder.id, milestone.id)}
                              className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Approve & Release OUSD</span>
                            </button>
                          )}

                          {/* Raise dispute trigger */}
                          {isSubmitted && (
                            <button
                              onClick={() =>
                                setActiveDisputeModal({
                                  orderId: currentOrder.id,
                                  milestoneId: milestone.id,
                                })
                              }
                              className="rounded-lg border border-amber-500/30 bg-amber-950/20 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-900/40 transition-colors"
                            >
                              Raise Dispute
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Deliverable Submission Modal */}
      {activeDeliverableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#131E3A] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              Submit Deliverable for Milestone Sign-Off
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              {activeDeliverableModal.milestoneTitle}
            </p>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Repository / Figma / Deployment URL
                </label>
                <input
                  type="text"
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
                  placeholder="https://github.com/organization/project/releases/v1"
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Deliverable Notes & Verification Instructions
                </label>
                <textarea
                  rows={3}
                  value={deliverableNotes}
                  onChange={(e) => setDeliverableNotes(e.target.value)}
                  placeholder="Provide test suite results, documentation links, or staging credentials..."
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setActiveDeliverableModal(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeliverable}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                Submit for Hirer Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Protocol Modal */}
      {activeDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-[#1A1828] p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400">
              <Scale className="h-5 w-5" />
              <h3 className="text-lg font-bold text-white">
                Initiate Neutral Dispute Protocol
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Escrow funds will remain non-custodially locked while impartial technical arbiters evaluate the agreed specifications and submitted artifacts.
            </p>

            <div className="mt-4 text-xs">
              <label className="block text-slate-400 font-mono mb-1">
                Reason for Arbitration Flag
              </label>
              <textarea
                rows={3}
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="State the unmet milestone criterion or specification conflict..."
                className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setActiveDisputeModal(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDispute}
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
              >
                Submit to Arbitrators
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
