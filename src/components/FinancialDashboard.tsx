import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Send,
  CreditCard,
  Lock,
  TrendingUp,
  Percent,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CURRENCIES } from '../services/forex';
import { Transaction } from '../types';

export const FinancialDashboard: React.FC = () => {
  const {
    user,
    currency,
    liveRates,
    lastRateUpdate,
    refreshLiveRates,
    isForexLoading,
    formatOusd,
    formatDualPrice,
    convertOusdToFiat,
    transactions,
    network,
    claimFaucetOusd,
    setIsPayoutModalOpen,
    setIsOnRampModalOpen,
    setIsTransferModalOpen,
    setIsPrivyModalOpen,
  } = useApp();

  const [txFilter, setTxFilter] = useState<'all' | 'escrow' | 'payout' | 'deposit'>('all');
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  const totalPortfolioOusd = user.liquidOusd + user.inEscrowOusd;
  const dualPortfolio = formatDualPrice(totalPortfolioOusd);
  const dualLiquid = formatDualPrice(user.liquidOusd);
  const dualEscrow = formatDualPrice(user.inEscrowOusd);
  const activeMeta = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  const currentRate = liveRates[currency] || 1.0;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (txFilter === 'escrow') {
        return tx.type === 'deposit_escrow' || tx.type === 'milestone_payout';
      }
      if (txFilter === 'payout') {
        return tx.type === 'fiat_offramp' || tx.type === 'transfer_out';
      }
      if (txFilter === 'deposit') {
        return tx.type === 'fiat_onramp' || tx.type === 'yield_earned';
      }
      return true;
    });
  }, [transactions, txFilter]);

  const handleCopyTx = (txHash: string) => {
    navigator.clipboard.writeText(txHash);
    setCopiedTx(txHash);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
            <span>Treasury & Settlement Hub</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <span role="img" aria-label={activeMeta.country}>{activeMeta.flag}</span>
              <span>1 OUSD = {currentRate.toLocaleString('en-US', { maximumFractionDigits: activeMeta.decimals || 4 })} {currency}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Financial & Yield Operations
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Manage Open USD reserves, multi-chain balances, and wholesale commercial bank off-ramps in {activeMeta.name} ({currency}).
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => claimFaucetOusd(2500)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/60 transition-colors shadow-sm"
            title="Add testnet settlement liquidity"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>+2,500 Testnet OUSD</span>
          </button>

          <button
            onClick={() => setIsOnRampModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <CreditCard className="h-4 w-4" />
            <span>Deposit / Buy OUSD</span>
          </button>

          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-[#15254A] px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-[#1C2F5E] transition-colors"
          >
            <Landmark className="h-4 w-4" />
            <span>Global Bank Payout</span>
          </button>

          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Send Web3</span>
          </button>
        </div>
      </div>

      {/* Asset Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Portfolio */}
        <div className="rounded-2xl border border-white/15 bg-[#131E3A] p-5 shadow-xl shadow-black/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">Total Capital Value</span>
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">
                OUSD + Escrow
              </span>
            </div>
            <div className="mt-3 font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              {totalPortfolioOusd.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="mt-1 font-mono text-xs text-emerald-400 font-semibold">
              ≈ {dualPortfolio.fiat}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Pegged 1:1 USD</span>
            <span className="text-emerald-400 font-mono">100% Backed</span>
          </div>
        </div>

        {/* Card 2: Liquid OUSD */}
        <div className="rounded-2xl border border-white/15 bg-[#131E3A] p-5 shadow-xl shadow-black/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">Liquid Available OUSD</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="mt-3 font-mono text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
              {user.liquidOusd.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="mt-1 font-mono text-xs text-slate-300">
              ≈ {dualLiquid.fiat}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Instant Withdrawal Ready</span>
            <button
              onClick={() => setIsPayoutModalOpen(true)}
              className="text-emerald-400 hover:underline"
            >
              Liquidate to Bank →
            </button>
          </div>
        </div>

        {/* Card 3: In Smart Escrow */}
        <div className="rounded-2xl border border-white/15 bg-[#131E3A] p-5 shadow-xl shadow-black/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">Locked in Smart Escrow</span>
              <Lock className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="mt-3 font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              {user.inEscrowOusd.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="mt-1 font-mono text-xs text-slate-300">
              ≈ {dualEscrow.fiat}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Non-Custodial Multi-Chain</span>
            <span className="font-mono text-slate-300">Audited Engine</span>
          </div>
        </div>

        {/* Card 4: Open Yield Vault */}
        <div className="rounded-2xl border border-emerald-500/30 bg-[#0E2827] p-5 shadow-xl shadow-black/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-200">
              <span className="font-mono">Treasury Yield Accrual</span>
              <span className="rounded bg-emerald-500/30 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300 font-bold">
                5.2% APY
              </span>
            </div>
            <div className="mt-3 font-mono text-2xl sm:text-3xl font-extrabold text-emerald-300 tabular-nums">
              +${user.earnedYieldOusd.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-emerald-200/80">
              Earned on idle institutional reserves
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-300 font-mono">
            <span>Automated Compounding</span>
            <span>Zero Lockup</span>
          </div>
        </div>
      </div>

      {/* Embedded Privy Wallet & Gas Sponsorship Banner */}
      <div className="rounded-2xl border border-white/10 bg-[#131E3A] p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                Privy Multi-Chain Embedded Wallet
              </h3>
              <span className="font-mono text-[10px] rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5">
                Active on {network}
              </span>
            </div>
            <div className="font-mono text-xs text-slate-400 mt-0.5 truncate max-w-md">
              Public Address: {user.address}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => handleCopyTx(user.address)}
            className="flex-1 md:flex-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {copiedTx === user.address ? 'Address Copied!' : 'Copy Address'}
          </button>
          <button
            onClick={() => setIsPrivyModalOpen(true)}
            className="flex-1 md:flex-none rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-900/50 transition-colors"
          >
            Manage MPC Keys
          </button>
        </div>
      </div>

      {/* Transactions Ledger */}
      <div className="rounded-2xl border border-white/15 bg-[#131E3A] p-6 shadow-xl shadow-black/40 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white">Settlement & Activity Ledger</h3>
            <p className="text-xs text-slate-400">
              Verifiable cryptographic settlements, smart escrow releases, and bank payouts.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-black/30 p-1 border border-white/5">
            <button
              onClick={() => setTxFilter('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                txFilter === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setTxFilter('escrow')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                txFilter === 'escrow'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Smart Escrow
            </button>
            <button
              onClick={() => setTxFilter('payout')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                txFilter === 'payout'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bank Off-Ramps
            </button>
            <button
              onClick={() => setTxFilter('deposit')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                txFilter === 'deposit'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Deposits
            </button>
          </div>
        </div>

        {/* Ledger Table or Empty State Pattern */}
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/30 border border-white/5 mx-auto mb-2 text-slate-500">
              <Wallet className="h-6 w-6" />
            </div>
            <p className="font-medium text-white">No transactions recorded under this filter</p>
            <p className="mt-1 text-slate-400">Fund your wallet or execute an escrow contract to generate ledger records.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono">
                  <th className="pb-3 pr-4 font-medium">Type & Details</th>
                  <th className="pb-3 px-4 font-medium">Settlement Rail</th>
                  <th className="pb-3 px-4 font-medium">Counterparty</th>
                  <th className="pb-3 px-4 font-medium text-right">OUSD Amount</th>
                  <th className="pb-3 px-4 font-medium text-right">Selected Fiat ({currency})</th>
                  <th className="pb-3 pl-4 font-medium text-right">Transaction Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.map((tx) => {
                  const isOutflow =
                    tx.type === 'fiat_offramp' ||
                    tx.type === 'deposit_escrow' ||
                    tx.type === 'transfer_out';
                  const dual = formatDualPrice(tx.amountOusd);

                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Column 1: Type */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${
                              tx.type === 'milestone_payout' || tx.type === 'fiat_onramp' || tx.type === 'yield_earned'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {tx.type === 'fiat_offramp' ? (
                              <Landmark className="h-3.5 w-3.5" />
                            ) : tx.type === 'milestone_payout' ? (
                              <ArrowDownLeft className="h-3.5 w-3.5" />
                            ) : tx.type === 'fiat_onramp' ? (
                              <CreditCard className="h-3.5 w-3.5" />
                            ) : tx.type === 'deposit_escrow' ? (
                              <Lock className="h-3.5 w-3.5" />
                            ) : (
                              <Send className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{tx.title}</div>
                            <div className="text-[11px] text-slate-400">
                              {new Date(tx.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Rail */}
                      <td className="py-4 px-4 font-mono text-[11px] text-slate-300">
                        <span className="rounded bg-black/40 px-2 py-0.5 border border-white/5">
                          {tx.network}
                        </span>
                      </td>

                      {/* Column 3: Counterparty */}
                      <td className="py-4 px-4 text-slate-300 truncate max-w-xs">
                        {tx.counterparty || 'Smart Protocol'}
                      </td>

                      {/* Column 4: Amount OUSD */}
                      <td className="py-4 px-4 text-right font-mono font-bold tabular-nums">
                        <span className={isOutflow ? 'text-white' : 'text-emerald-400'}>
                          {isOutflow ? '-' : '+'}
                          {tx.amountOusd.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{' '}
                          OUSD
                        </span>
                      </td>

                      {/* Column 5: Converted Fiat */}
                      <td className="py-4 px-4 text-right font-mono text-slate-400 tabular-nums">
                        {dual.fiat}
                      </td>

                      {/* Column 6: Tx Hash & Copy */}
                      <td className="py-4 pl-4 text-right">
                        <button
                          onClick={() => handleCopyTx(tx.txHash)}
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 hover:text-emerald-300"
                          title="Copy Tx Hash"
                        >
                          <span>
                            {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                          </span>
                          {copiedTx === tx.txHash ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
