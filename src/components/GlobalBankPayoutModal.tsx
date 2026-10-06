import React, { useState } from 'react';
import {
  Building2,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Landmark,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CURRENCIES } from '../services/forex';
import { CurrencyCode } from '../types';

export const GlobalBankPayoutModal: React.FC = () => {
  const {
    isPayoutModalOpen,
    setIsPayoutModalOpen,
    user,
    currency,
    liveRates,
    formatOusd,
    executeBankPayout,
  } = useApp();

  const [payoutCurrency, setPayoutCurrency] = useState<CurrencyCode>(currency);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('2500');
  const [bankName, setBankName] = useState('Standard Chartered / JPMorgan Chase');
  const [recipientName, setRecipientName] = useState(user.name);
  const [ibanOrAccount, setIbanOrAccount] = useState('GB29NWBK60161331926819');
  const [routingOrBic, setRoutingOrBic] = useState('SCBLGB2LXXX');

  if (!isPayoutModalOpen) return null;

  const numericAmount = parseFloat(withdrawAmount) || 0;
  const currentRate = liveRates[payoutCurrency] || 1.0;
  const targetMeta = SUPPORTED_CURRENCIES[payoutCurrency] || SUPPORTED_CURRENCIES.USD;
  const offRampFeeOusd = Math.max(5, numericAmount * 0.0025); // 0.25% fee or min $5
  const netOusd = Math.max(0, numericAmount - offRampFeeOusd);
  const fiatReceivable = netOusd * currentRate;

  const isSEPA = payoutCurrency === 'EUR';
  const isFasterPayments = payoutCurrency === 'GBP';
  const isACHOrWire = payoutCurrency === 'USD';
  const isLocalNaira = payoutCurrency === 'NGN';

  const settlementSpeed = isSEPA
    ? 'SEPA Instant (Sub-30 seconds)'
    : isFasterPayments
    ? 'Faster Payments Service (Sub-60 seconds)'
    : isLocalNaira
    ? 'NIP Direct Interbank Clearing (Instant)'
    : isACHOrWire
    ? 'Fedwire / Same-Day ACH (Under 2 hours)'
    : 'Local Real-Time Clearing System (Under 4 hours)';

  const handleMaxClick = () => {
    setWithdrawAmount(user.liquidOusd.toString());
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;
    const success = executeBankPayout(numericAmount, payoutCurrency, {
      bankName,
      ibanOrAccount,
      routingOrBic,
      recipientName,
    });
    if (success) {
      setIsPayoutModalOpen(false);
    }
  };

  // Top prioritized currencies for quick buttons
  const priorityCurrencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'JPY', 'INR', 'AED'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-[#131E3A] p-6 sm:p-7 shadow-2xl shadow-black/90 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Global Bank Payout Hub</h2>
              <p className="text-xs text-slate-400">
                Direct fiat off-ramp with live interbank clearing rails
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPayoutModalOpen(false)}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="mt-5 space-y-4 text-xs">
          {/* Target Currency Selector with flags */}
          <div>
            <label className="block font-mono text-slate-300 mb-1.5 font-medium">
              Destination Settlement Currency
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {priorityCurrencies.map((cCode) => {
                const meta = SUPPORTED_CURRENCIES[cCode];
                return (
                  <button
                    type="button"
                    key={cCode}
                    onClick={() => setPayoutCurrency(cCode)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-mono transition-all ${
                      payoutCurrency === cCode
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 ring-1 ring-emerald-500/30 font-bold'
                        : 'border-white/10 bg-black/30 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <span className="text-base select-none" role="img" aria-label={meta.country}>{meta.flag}</span>
                    <span className="mt-0.5">{cCode}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div className="rounded-xl bg-black/35 p-4 border border-white/10">
            <div className="flex justify-between items-center text-slate-400 mb-1">
              <span className="font-mono">Liquid OUSD to Liquidate</span>
              <button
                type="button"
                onClick={handleMaxClick}
                className="font-mono text-[11px] text-emerald-400 hover:underline"
              >
                Available: {formatOusd(user.liquidOusd)}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="10"
                step="any"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full bg-transparent text-xl sm:text-2xl font-mono font-bold text-white focus:outline-none"
                placeholder="0.00"
              />
              <span className="font-mono font-bold text-slate-300 text-sm">OUSD</span>
            </div>

            {/* Calculations breakdown using live forex rate */}
            <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-[11px] font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Live Interbank Rate:</span>
                <span className="text-slate-200">
                  1 OUSD = {currentRate.toLocaleString('en-US', { maximumFractionDigits: targetMeta.decimals || 4 })} {payoutCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Liquidation Surcharge (0.25%):</span>
                <span className="text-slate-200">${offRampFeeOusd.toFixed(2)} OUSD</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-white/5 text-emerald-300 font-semibold">
                <span>Direct Bank Deposit Receivable:</span>
                <span>
                  {targetMeta.symbol}
                  {fiatReceivable.toLocaleString('en-US', {
                    minimumFractionDigits: targetMeta.decimals,
                    maximumFractionDigits: targetMeta.decimals,
                  })}{' '}
                  {payoutCurrency}
                </span>
              </div>
            </div>
          </div>

          {/* Bank Destination Details */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-mono mb-1">
                  Recipient Account Name
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">Bank Institution Name</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-mono mb-1">
                  IBAN / Account Number
                </label>
                <input
                  type="text"
                  required
                  value={ibanOrAccount}
                  onChange={(e) => setIbanOrAccount(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white focus:outline-none focus:border-emerald-500/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">
                  Routing / BIC / SWIFT / Sort Code
                </label>
                <input
                  type="text"
                  required
                  value={routingOrBic}
                  onChange={(e) => setRoutingOrBic(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-2.5 text-white focus:outline-none focus:border-emerald-500/50 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Settlement Speed Assurance */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-3 text-xs text-slate-300 flex items-center gap-2.5">
            <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-emerald-300">Target Clearing: </span>
              <span>{settlementSpeed}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsPayoutModalOpen(false)}
              className="w-1/3 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={numericAmount <= 0 || numericAmount > user.liquidOusd}
              className="w-2/3 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              Confirm Wire Payout ({targetMeta.symbol}
              {fiatReceivable.toLocaleString('en-US', {
                minimumFractionDigits: targetMeta.decimals,
                maximumFractionDigits: targetMeta.decimals,
              })}{' '}
              {payoutCurrency})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
