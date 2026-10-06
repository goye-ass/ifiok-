import React, { useState } from 'react';
import {
  CreditCard,
  X,
  Zap,
  ShieldCheck,
  Check,
  ArrowRight,
  Globe2,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CURRENCIES } from '../services/forex';
import { CurrencyCode } from '../types';

export const OnRampGatewayModal: React.FC = () => {
  const { isOnRampModalOpen, setIsOnRampModalOpen, currency, liveRates, executeOnRamp, user } = useApp();

  const [gateway, setGateway] = useState<'MoonPay' | 'Transak' | 'Stripe'>('MoonPay');
  const [fiatCurrency, setFiatCurrency] = useState<CurrencyCode>(currency);
  const [amountFiat, setAmountFiat] = useState<string>('1000');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'sepa'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOnRampModalOpen) return null;

  const numFiat = parseFloat(amountFiat) || 0;
  const rate = liveRates[fiatCurrency] || 1.0;
  const targetMeta = SUPPORTED_CURRENCIES[fiatCurrency] || SUPPORTED_CURRENCIES.USD;
  const expectedOusd = Math.round((numFiat / rate) * 100) / 100;

  const handleDeposit = () => {
    if (numFiat <= 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      executeOnRamp(numFiat, fiatCurrency, gateway);
      setIsProcessing(false);
      setIsOnRampModalOpen(false);
    }, 1200);
  };

  const quickCurrencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AED', 'INR', 'BRL'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#131E3A] p-6 shadow-2xl shadow-black/90 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Deposit & Buy OUSD</h2>
              <p className="text-xs text-slate-400">
                Institutional on-ramp straight to your embedded wallet
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOnRampModalOpen(false)}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs">
          {/* Gateway Provider Selection */}
          <div>
            <label className="block font-mono text-slate-300 mb-1.5">
              Select Liquidity Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['MoonPay', 'Transak', 'Stripe'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGateway(g)}
                  className={`rounded-xl border p-2.5 text-center font-semibold transition-all ${
                    gateway === g
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 ring-1 ring-emerald-500/30'
                      : 'border-white/10 bg-black/25 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="text-xs">{g}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {g === 'MoonPay' ? 'Instant Card' : g === 'Transak' ? 'Global Wire' : 'Fintech Direct'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount and Currency */}
          <div className="rounded-xl bg-black/35 p-4 border border-white/10">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="font-mono">Billing Currency</span>
              <div className="flex items-center gap-1 overflow-x-auto max-w-[240px] pb-1">
                {quickCurrencies.map((c) => {
                  const m = SUPPORTED_CURRENCIES[c];
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFiatCurrency(c)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap flex items-center gap-1 ${
                        fiatCurrency === c
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white bg-black/40'
                      }`}
                    >
                      <span>{m.flag}</span>
                      <span>{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl font-mono text-slate-400">{targetMeta.symbol}</span>
              <input
                type="number"
                min="20"
                value={amountFiat}
                onChange={(e) => setAmountFiat(e.target.value)}
                className="w-full bg-transparent text-xl sm:text-2xl font-mono font-bold text-white focus:outline-none"
                placeholder="1000"
              />
              <span className="font-mono text-sm text-slate-300">{fiatCurrency}</span>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Credited OUSD (Live Forex):</span>
              <span className="font-bold text-emerald-400 text-sm">
                + {expectedOusd.toLocaleString()} OUSD
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block font-mono text-slate-300 mb-1.5">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`rounded-xl border p-2 text-center ${
                  paymentMethod === 'card'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-white/10 bg-black/25 text-slate-300'
                }`}
              >
                <div>Credit / Debit</div>
                <div className="text-[10px] text-slate-400">Visa / Mastercard</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`rounded-xl border p-2 text-center ${
                  paymentMethod === 'apple_pay'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-white/10 bg-black/25 text-slate-300'
                }`}
              >
                <div>Apple / Google Pay</div>
                <div className="text-[10px] text-slate-400">1-Touch Pay</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('sepa')}
                className={`rounded-xl border p-2 text-center ${
                  paymentMethod === 'sepa'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-white/10 bg-black/25 text-slate-300'
                }`}
              >
                <div>Bank Transfer</div>
                <div className="text-[10px] text-slate-400">ACH / SEPA / Local</div>
              </button>
            </div>
          </div>

          {/* Destination Notice */}
          <div className="rounded-xl bg-black/25 p-3 border border-white/5 space-y-1">
            <div className="text-[11px] text-slate-400">Beneficiary Privy Embedded Wallet:</div>
            <div className="font-mono text-xs text-white truncate">{user.address}</div>
          </div>

          <div className="mt-5 flex gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsOnRampModalOpen(false)}
              className="w-1/3 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeposit}
              disabled={isProcessing || numFiat <= 0}
              className="w-2/3 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {isProcessing
                ? 'Processing via Provider...'
                : `Pay ${targetMeta.symbol}${numFiat} & Credit OUSD`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
