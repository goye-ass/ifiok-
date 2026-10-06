import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dbService, INITIAL_ENTERPRISE_SERVICES } from '../services/db';
import { fetchLiveForexRates, SUPPORTED_CURRENCIES, FALLBACK_RATES } from '../services/forex';
import {
  BlockchainNetwork,
  CurrencyCode,
  EscrowOrder,
  Milestone,
  ServiceItem,
  Transaction,
  UserRole,
  WalletState,
} from '../types';

interface ToastInfo {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // User & Wallet
  user: WalletState;
  setUser: React.Dispatch<React.SetStateAction<WalletState>>;
  connectWallet: (provider?: WalletState['authProvider']) => void;
  disconnectWallet: () => void;
  claimFaucetOusd: (amount?: number) => void;
  switchRole: (role: UserRole) => void;
  network: BlockchainNetwork;
  setNetwork: (network: BlockchainNetwork) => void;

  // Currency & Forex Engine
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  liveRates: Record<string, number>;
  lastRateUpdate: string;
  isForexLoading: boolean;
  refreshLiveRates: () => Promise<void>;
  formatOusd: (amountOusd: number) => string;
  formatDualPrice: (amountOusd: number) => {
    ousd: string;
    fiat: string;
    fiatSymbol: string;
    fiatAmount: string;
    liveRate: number;
  };
  convertOusdToFiat: (amountOusd: number) => number;

  // Marketplace & Database
  services: ServiceItem[];
  publishService: (service: Omit<ServiceItem, 'id'> | ServiceItem) => void;
  clearAllServices: () => void;
  seedBenchmarkServices: () => void;
  selectedService: ServiceItem | null;
  setSelectedService: (service: ServiceItem | null) => void;

  // Escrow Orders
  orders: EscrowOrder[];
  createEscrowOrder: (orderData: Partial<EscrowOrder>) => void;
  approveMilestone: (orderId: string, milestoneId: string) => void;
  submitDeliverable: (orderId: string, milestoneId: string, url: string, notes: string) => void;
  raiseDispute: (orderId: string, milestoneId: string, reason: string) => void;
  resolveDispute: (orderId: string, action: 'refund' | 'release') => void;

  // Transactions Ledger
  transactions: Transaction[];

  // Navigation
  activeTab: 'landing' | 'marketplace' | 'escrow' | 'financial' | 'service-detail';
  setActiveTab: (tab: 'landing' | 'marketplace' | 'escrow' | 'financial' | 'service-detail') => void;

  // Modals
  isPayoutModalOpen: boolean;
  setIsPayoutModalOpen: (open: boolean) => void;
  isOnRampModalOpen: boolean;
  setIsOnRampModalOpen: (open: boolean) => void;
  isTransferModalOpen: boolean;
  setIsTransferModalOpen: (open: boolean) => void;
  isPrivyModalOpen: boolean;
  setIsPrivyModalOpen: (open: boolean) => void;
  isCreateEscrowModalOpen: boolean;
  setIsCreateEscrowModalOpen: (open: boolean) => void;
  isCreateServiceModalOpen: boolean;
  setIsCreateServiceModalOpen: (open: boolean) => void;

  // Financial Actions
  executeBankPayout: (
    amountOusd: number,
    fiatCurrency: CurrencyCode,
    bankDetails: { bankName: string; ibanOrAccount: string; routingOrBic: string; recipientName: string }
  ) => boolean;
  executeOnRamp: (
    amountFiat: number,
    fiatCurrency: CurrencyCode,
    gateway: 'Transak' | 'MoonPay' | 'Stripe'
  ) => void;
  executeTransfer: (toAddress: string, amountOusd: number, targetNetwork: BlockchainNetwork) => boolean;

  // Toast Notifications
  toasts: ToastInfo[];
  showToast: (title: string, message: string, type?: ToastInfo['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Live State loaded dynamically from dbService
  const [user, setUser] = useState<WalletState>(() => dbService.getUserState());
  const [network, setNetwork] = useState<BlockchainNetwork>(user.network || 'Base');
  const [services, setServices] = useState<ServiceItem[]>(() => dbService.getServices());
  const [orders, setOrders] = useState<EscrowOrder[]>(() => dbService.getOrders());
  const [transactions, setTransactions] = useState<Transaction[]>(() => dbService.getTransactions());
  const [activeTab, setActiveTab] = useState<'landing' | 'marketplace' | 'escrow' | 'financial' | 'service-detail'>('landing');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Live Currency & Forex State
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('ifiok_active_currency');
      if (saved && SUPPORTED_CURRENCIES[saved as CurrencyCode]) {
        return saved as CurrencyCode;
      }
    } catch {}
    return 'USD';
  });
  const [liveRates, setLiveRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [lastRateUpdate, setLastRateUpdate] = useState<string>('Connecting to Forex API...');
  const [isForexLoading, setIsForexLoading] = useState<boolean>(false);

  // Modal Dialogs
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isOnRampModalOpen, setIsOnRampModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isPrivyModalOpen, setIsPrivyModalOpen] = useState(false);
  const [isCreateEscrowModalOpen, setIsCreateEscrowModalOpen] = useState(false);
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (title: string, message: string, type: ToastInfo['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setCurrency = (newCode: CurrencyCode) => {
    setCurrencyState(newCode);
    try {
      localStorage.setItem('ifiok_active_currency', newCode);
    } catch {}
    const meta = SUPPORTED_CURRENCIES[newCode];
    showToast(
      'Global Settlement Currency Updated',
      `Switched display to ${meta.flag} ${meta.code} (${meta.name}). All prices re-converted using live interbank rates.`,
      'info'
    );
  };

  // Sync Live Forex Rates on Mount and interval
  const refreshLiveRates = useCallback(async () => {
    setIsForexLoading(true);
    try {
      const data = await fetchLiveForexRates();
      if (data && data.rates) {
        setLiveRates((prev) => ({ ...prev, ...data.rates }));
        setLastRateUpdate(data.lastUpdated);
      }
    } catch (e) {
      console.warn('Failed to refresh forex rates:', e);
    } finally {
      setIsForexLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLiveRates();
    // Refresh every 5 minutes in background
    const interval = setInterval(refreshLiveRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshLiveRates]);

  // Sync user state changes to DB
  useEffect(() => {
    dbService.saveUserState(user);
  }, [user]);

  // Connect / Disconnect Wallet
  const connectWallet = (provider: WalletState['authProvider'] = 'privy') => {
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const updatedUser: WalletState = {
      ...user,
      isConnected: true,
      address: `0x${randomHex}`,
      authProvider: provider,
      isVerified: true,
    };
    setUser(updatedUser);
    dbService.saveUserState(updatedUser);
    showToast(
      'Wallet Connected via Privy SDK',
      `Authenticated on ${network} network with non-custodial address ${updatedUser.address.slice(0, 6)}...${updatedUser.address.slice(-4)}`
    );
  };

  const disconnectWallet = () => {
    const updatedUser: WalletState = {
      ...user,
      isConnected: false,
    };
    setUser(updatedUser);
    dbService.saveUserState(updatedUser);
    showToast('Wallet Disconnected', 'Session closed. Reconnect anytime via Privy or Web3.', 'info');
  };

  const claimFaucetOusd = (amount = 2500) => {
    setUser((prev) => {
      const updated = {
        ...prev,
        liquidOusd: prev.liquidOusd + amount,
      };
      dbService.saveUserState(updated);
      return updated;
    });

    const txHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const faucetTx: Transaction = {
      id: `tx-faucet-${Date.now()}`,
      type: 'fiat_onramp',
      title: 'IFIOK Testnet OUSD Faucet Credit',
      amountOusd: amount,
      timestamp: new Date().toISOString(),
      txHash,
      network: network,
      status: 'confirmed',
      counterparty: 'IFIOK Protocol Treasury Faucet',
      feeOusd: 0,
    };

    setTransactions((prev) => {
      const next = [faucetTx, ...prev];
      dbService.saveTransactions(next);
      return next;
    });

    showToast('Testnet OUSD Credited', `+${amount.toLocaleString()} OUSD added to your embedded wallet.`);
  };

  const switchRole = (newRole: UserRole) => {
    setUser((prev) => {
      const updated = {
        ...prev,
        role: newRole,
      };
      dbService.saveUserState(updated);
      return updated;
    });
    showToast(
      'Persona Mode Switched',
      newRole === 'client' ? 'Active view: Hirer (Deploy & Fund Escrows)' : 'Active view: Specialist (Provide Services & Settle OUSD)'
    );
  };

  // Dual Currency calculations using live forex
  const convertOusdToFiat = (amountOusd: number): number => {
    const rate = liveRates[currency] || 1.0;
    return amountOusd * rate;
  };

  const formatOusd = (amountOusd: number): string => {
    return `${amountOusd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} OUSD`;
  };

  const formatDualPrice = (amountOusd: number) => {
    const meta = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
    const rate = liveRates[currency] || 1.0;
    const fiatVal = amountOusd * rate;

    const formattedFiat = fiatVal.toLocaleString('en-US', {
      minimumFractionDigits: meta.decimals,
      maximumFractionDigits: meta.decimals,
    });

    return {
      ousd: `${amountOusd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} OUSD`,
      fiat: `${meta.symbol}${formattedFiat} ${currency}`,
      fiatSymbol: meta.symbol,
      fiatAmount: formattedFiat,
      liveRate: rate,
    };
  };

  // Publish dynamic service
  const publishService = (service: Omit<ServiceItem, 'id'> | ServiceItem) => {
    const newService: ServiceItem = {
      ...service,
      id: 'id' in service && service.id ? service.id : `srv-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = dbService.addService(newService);
    setServices(updated);
    showToast('Service Published', `"${service.title}" is now live in the global marketplace.`);
  };

  const clearAllServices = () => {
    setServices([]);
    dbService.saveServices([]);
    showToast('Marketplace Reset', 'All service listings cleared to empty state.', 'info');
  };

  const seedBenchmarkServices = () => {
    setServices(INITIAL_ENTERPRISE_SERVICES);
    dbService.saveServices(INITIAL_ENTERPRISE_SERVICES);
    showToast('Benchmark Services Restored', 'Seeded enterprise Web3, AI, and Design listings.');
  };

  // Escrow Actions
  const approveMilestone = (orderId: string, milestoneId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;
    const targetMilestone = targetOrder.milestones.find((m) => m.id === milestoneId);
    if (!targetMilestone) return;

    const txHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const nowIso = new Date().toISOString();

    const updatedOrders = orders.map((order) => {
      if (order.id !== orderId) return order;
      const updatedMilestones = order.milestones.map((m) =>
        m.id === milestoneId
          ? ({
              ...m,
              status: 'approved_released' as const,
              releasedAt: nowIso,
              txHash,
            } as Milestone)
          : m
      );

      const allDone = updatedMilestones.every((m) => m.status === 'approved_released');

      return {
        ...order,
        status: allDone ? ('completed' as const) : order.status,
        milestones: updatedMilestones,
      };
    });

    setOrders(updatedOrders);
    dbService.saveOrders(updatedOrders);

    // Update balances
    setUser((prev) => {
      const newEscrow = Math.max(0, prev.inEscrowOusd - targetMilestone.amountOusd);
      const updated = {
        ...prev,
        inEscrowOusd: newEscrow,
      };
      dbService.saveUserState(updated);
      return updated;
    });

    // Record settlement transaction
    const newTx: Transaction = {
      id: `tx-${Date.now().toString(36)}`,
      type: 'milestone_payout',
      title: `Milestone Released: ${targetMilestone.title}`,
      amountOusd: targetMilestone.amountOusd,
      timestamp: nowIso,
      txHash,
      network: targetOrder.network,
      status: 'confirmed',
      counterparty: `${targetOrder.freelancerName} (${targetOrder.freelancerAddress.slice(0, 6)}...${targetOrder.freelancerAddress.slice(-4)})`,
      feeOusd: 0,
    };
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    dbService.saveTransactions(updatedTxs);

    showToast(
      'Milestone Approved & Settled',
      `${formatOusd(targetMilestone.amountOusd)} instantly released to ${targetOrder.freelancerName}'s embedded wallet.`
    );
  };

  const submitDeliverable = (orderId: string, milestoneId: string, url: string, notes: string) => {
    const nowIso = new Date().toISOString();
    const updatedOrders = orders.map((order) => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        milestones: order.milestones.map((m) =>
          m.id === milestoneId
            ? ({
                ...m,
                status: 'submitted_review' as const,
                deliverableUrl: url,
                deliverableNotes: notes,
                submittedAt: nowIso,
              } as Milestone)
            : m
        ),
      };
    });
    setOrders(updatedOrders);
    dbService.saveOrders(updatedOrders);
    showToast('Deliverable Submitted', 'The hirer has been notified to review artifacts and sign off.');
  };

  const raiseDispute = (orderId: string, milestoneId: string, reason: string) => {
    const updatedOrders = orders.map((order) => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        status: 'in_dispute' as const,
        disputeReason: reason,
        milestones: order.milestones.map((m) =>
          m.id === milestoneId
            ? ({
                ...m,
                status: 'disputed' as const,
                deliverableNotes: `Dispute flagged: ${reason}`,
              } as Milestone)
            : m
        ),
      };
    });
    setOrders(updatedOrders);
    dbService.saveOrders(updatedOrders);
    showToast('Dispute Protocol Initiated', 'Assigned neutral technical arbiters under Smart Invariant #24.', 'warning');
  };

  const resolveDispute = (orderId: string, action: 'refund' | 'release') => {
    const updatedOrders = orders.map((order) => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        status: 'completed' as const,
        disputeReason: `Resolved via Arbitrator Ruling: ${action === 'refund' ? 'Refunded to Hirer' : 'Released to Specialist'}`,
        milestones: order.milestones.map((m) => ({
          ...m,
          status: 'approved_released' as const,
        })),
      };
    });
    setOrders(updatedOrders);
    dbService.saveOrders(updatedOrders);
    showToast('Dispute Resolved', `Arbitrator ruling finalized: funds ${action === 'refund' ? 'refunded' : 'released'}.`);
  };

  const createEscrowOrder = (orderData: Partial<EscrowOrder>) => {
    const total = orderData.totalOusd || 5000;
    if (user.liquidOusd < total) {
      showToast('Insufficient Liquid OUSD', 'Please on-ramp funds or use the faucet before locking escrow.', 'error');
      return;
    }

    const newContractAddress = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newOrderId = `ESCROW-${Math.floor(1000 + Math.random() * 9000)}`;
    const platformFee = total * 0.025;

    const fullOrder: EscrowOrder = {
      id: newOrderId,
      contractAddress: newContractAddress,
      serviceId: orderData.serviceId,
      serviceTitle: orderData.serviceTitle || 'Custom Milestone Escrow Agreement',
      clientName: user.name,
      clientAddress: user.address,
      clientAvatar: user.avatar,
      freelancerName: orderData.freelancerName || 'Elite Specialist Partner',
      freelancerAddress: orderData.freelancerAddress || '0x38F87C9aA045B8dFe9C369B75E54D264f331F45A',
      freelancerAvatar: orderData.freelancerAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      network: network,
      totalOusd: total,
      platformFeeOusd: platformFee,
      createdAt: new Date().toISOString(),
      status: 'active',
      milestones:
        orderData.milestones && orderData.milestones.length > 0
          ? orderData.milestones
          : [
              {
                id: `ms-${newOrderId}-1`,
                title: 'Milestone 1: Architectural Blueprint & Scope',
                description: 'Technical specification, database schema, and interface contracts.',
                amountOusd: Math.round(total * 0.4),
                dueDate: '2026-04-14',
                status: 'in_progress',
              },
              {
                id: `ms-${newOrderId}-2`,
                title: 'Milestone 2: Implementation & Production Handover',
                description: 'Full code delivery, automated tests, and deployment verification.',
                amountOusd: Math.round(total * 0.6),
                dueDate: '2026-04-28',
                status: 'pending_deposit',
              },
            ],
    };

    const nextOrders = [fullOrder, ...orders];
    setOrders(nextOrders);
    dbService.saveOrders(nextOrders);

    // Update balances
    setUser((prev) => {
      const updated = {
        ...prev,
        liquidOusd: prev.liquidOusd - total,
        inEscrowOusd: prev.inEscrowOusd + total,
      };
      dbService.saveUserState(updated);
      return updated;
    });

    // Record transaction
    const newTx: Transaction = {
      id: `tx-${Date.now().toString(36)}`,
      type: 'deposit_escrow',
      title: `Smart Escrow Lock: ${fullOrder.serviceTitle}`,
      amountOusd: total,
      timestamp: new Date().toISOString(),
      txHash: newContractAddress,
      network: network,
      status: 'confirmed',
      counterparty: `Escrow Engine #${newOrderId}`,
      feeOusd: platformFee,
    };
    const nextTxs = [newTx, ...transactions];
    setTransactions(nextTxs);
    dbService.saveTransactions(nextTxs);

    showToast('Escrow Contract Initialized', `${formatOusd(total)} locked into smart contract on ${network}.`);
  };

  const executeBankPayout = (
    amountOusd: number,
    fiatCurrency: CurrencyCode,
    bankDetails: { bankName: string; ibanOrAccount: string; routingOrBic: string; recipientName: string }
  ): boolean => {
    if (amountOusd <= 0 || amountOusd > user.liquidOusd) {
      showToast('Liquidation Failed', 'Withdrawal amount exceeds available liquid OUSD balance.', 'error');
      return false;
    }

    const fee = Math.max(5, amountOusd * 0.0025);
    const netOusd = amountOusd - fee;
    const rate = liveRates[fiatCurrency] || 1.0;
    const meta = SUPPORTED_CURRENCIES[fiatCurrency] || SUPPORTED_CURRENCIES.USD;
    const netFiat = (netOusd * rate).toLocaleString('en-US', {
      minimumFractionDigits: meta.decimals,
      maximumFractionDigits: meta.decimals,
    });

    setUser((prev) => {
      const updated = {
        ...prev,
        liquidOusd: prev.liquidOusd - amountOusd,
      };
      dbService.saveUserState(updated);
      return updated;
    });

    const txHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newTx: Transaction = {
      id: `tx-${Date.now().toString(36)}`,
      type: 'fiat_offramp',
      title: `Global Bank Payout (${fiatCurrency} Direct)`,
      amountOusd: amountOusd,
      timestamp: new Date().toISOString(),
      txHash,
      network: fiatCurrency === 'EUR' ? 'SEPA_INSTANT' : 'FIAT_WIRE',
      status: 'confirmed',
      counterparty: `${bankDetails.bankName} (${bankDetails.ibanOrAccount.slice(-4) ? '•••' + bankDetails.ibanOrAccount.slice(-4) : 'Direct Account'})`,
      feeOusd: fee,
    };
    const nextTxs = [newTx, ...transactions];
    setTransactions(nextTxs);
    dbService.saveTransactions(nextTxs);

    showToast(
      'Bank Payout Dispatched',
      `${meta.symbol}${netFiat} ${fiatCurrency} dispatched to ${bankDetails.bankName} via instant clearing rails.`
    );
    return true;
  };

  const executeOnRamp = (
    amountFiat: number,
    fiatCurrency: CurrencyCode,
    gateway: 'Transak' | 'MoonPay' | 'Stripe'
  ) => {
    const rate = liveRates[fiatCurrency] || 1.0;
    const creditedOusd = Math.round((amountFiat / rate) * 100) / 100;

    setUser((prev) => {
      const updated = {
        ...prev,
        liquidOusd: prev.liquidOusd + creditedOusd,
      };
      dbService.saveUserState(updated);
      return updated;
    });

    const txHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newTx: Transaction = {
      id: `tx-${Date.now().toString(36)}`,
      type: 'fiat_onramp',
      title: `${gateway} Instant Fiat On-Ramp`,
      amountOusd: creditedOusd,
      timestamp: new Date().toISOString(),
      txHash,
      network: network,
      status: 'confirmed',
      counterparty: `${gateway} Gateway (${fiatCurrency} Payment)`,
      feeOusd: creditedOusd * 0.005,
    };
    const nextTxs = [newTx, ...transactions];
    setTransactions(nextTxs);
    dbService.saveTransactions(nextTxs);

    showToast('Wallet Funded', `${formatOusd(creditedOusd)} credited to your embedded Privy wallet on ${network}.`);
  };

  const executeTransfer = (toAddress: string, amountOusd: number, targetNetwork: BlockchainNetwork): boolean => {
    if (amountOusd <= 0 || amountOusd > user.liquidOusd) {
      showToast('Transfer Failed', 'Amount exceeds available liquid balance.', 'error');
      return false;
    }

    setUser((prev) => {
      const updated = {
        ...prev,
        liquidOusd: prev.liquidOusd - amountOusd,
      };
      dbService.saveUserState(updated);
      return updated;
    });

    const txHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newTx: Transaction = {
      id: `tx-${Date.now().toString(36)}`,
      type: 'transfer_out',
      title: `External Web3 Transfer (${targetNetwork})`,
      amountOusd,
      timestamp: new Date().toISOString(),
      txHash,
      network: targetNetwork,
      status: 'confirmed',
      counterparty: `${toAddress.slice(0, 6)}...${toAddress.slice(-4)}`,
      feeOusd: 0,
    };
    const nextTxs = [newTx, ...transactions];
    setTransactions(nextTxs);
    dbService.saveTransactions(nextTxs);

    showToast(
      'Transfer Confirmed',
      `${formatOusd(amountOusd)} sent to ${toAddress.slice(0, 6)}...${toAddress.slice(-4)} on ${targetNetwork}.`
    );
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        connectWallet,
        disconnectWallet,
        claimFaucetOusd,
        switchRole,
        network,
        setNetwork,
        currency,
        setCurrency,
        liveRates,
        lastRateUpdate,
        isForexLoading,
        refreshLiveRates,
        formatOusd,
        formatDualPrice,
        convertOusdToFiat,
        services,
        publishService,
        clearAllServices,
        seedBenchmarkServices,
        selectedService,
        setSelectedService,
        orders,
        createEscrowOrder,
        approveMilestone,
        submitDeliverable,
        raiseDispute,
        resolveDispute,
        transactions,
        activeTab,
        setActiveTab,
        isPayoutModalOpen,
        setIsPayoutModalOpen,
        isOnRampModalOpen,
        setIsOnRampModalOpen,
        isTransferModalOpen,
        setIsTransferModalOpen,
        isPrivyModalOpen,
        setIsPrivyModalOpen,
        isCreateEscrowModalOpen,
        setIsCreateEscrowModalOpen,
        isCreateServiceModalOpen,
        setIsCreateServiceModalOpen,
        executeBankPayout,
        executeOnRamp,
        executeTransfer,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
