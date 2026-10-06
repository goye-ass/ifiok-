export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CAD'
  | 'AUD'
  | 'JPY'
  | 'NGN'
  | 'INR'
  | 'BRL'
  | 'AED'
  | 'CHF'
  | 'SGD'
  | 'ZAR'
  | 'MXN'
  | 'SAR'
  | 'KRW'
  | 'CNY'
  | 'KES'
  | 'GHS';

export interface CurrencyMetadata {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  country: string;
  decimals: number;
}

export interface LiveRatesResponse {
  result: string;
  provider: string;
  time_last_update_utc: string;
  time_last_update_unix: number;
  rates: Record<string, number>;
}

export type BlockchainNetwork = 'Base' | 'Solana' | 'Polygon';

export type UserRole = 'client' | 'freelancer';

export interface WalletState {
  isConnected: boolean;
  address: string;
  solanaAddress: string;
  network: BlockchainNetwork;
  liquidOusd: number;
  inEscrowOusd: number;
  earnedYieldOusd: number;
  privyUserId: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  isVerified: boolean;
  company?: string;
  authProvider?: 'google' | 'apple' | 'linkedin' | 'email' | 'web3' | 'privy';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amountOusd: number;
  dueDate: string;
  status: 'pending_deposit' | 'in_progress' | 'submitted_review' | 'approved_released' | 'disputed';
  deliverableUrl?: string;
  deliverableNotes?: string;
  submittedAt?: string;
  releasedAt?: string;
  txHash?: string;
}

export interface EscrowOrder {
  id: string;
  contractAddress: string;
  serviceId?: string;
  serviceTitle: string;
  clientName: string;
  clientAddress: string;
  clientAvatar: string;
  freelancerName: string;
  freelancerAddress: string;
  freelancerAvatar: string;
  network: BlockchainNetwork;
  totalOusd: number;
  platformFeeOusd: number;
  createdAt: string;
  status: 'active' | 'completed' | 'in_dispute';
  milestones: Milestone[];
  disputeReason?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category:
    | 'Web3 & Smart Contracts'
    | 'AI & ML Systems'
    | 'UI/UX & Design Systems'
    | 'Cloud & DevOps'
    | 'Security & Audits'
    | 'Quant & Algorithmic';
  freelancer: {
    name: string;
    handle: string;
    title: string;
    rating: number;
    reviewCount: number;
    completedOrders: number;
    earnedOusd: number;
    avatar: string;
    address: string;
    isVerified: boolean;
    location: string;
  };
  description: string;
  startingPriceOusd: number;
  deliveryDays: number;
  skills: string[];
  image: string;
  defaultMilestones: {
    title: string;
    description: string;
    percentage: number;
  }[];
  portfolioHighlights: string[];
  createdAt?: string;
}

export interface Transaction {
  id: string;
  type: 'deposit_escrow' | 'milestone_payout' | 'fiat_offramp' | 'fiat_onramp' | 'transfer_out' | 'yield_earned';
  title: string;
  amountOusd: number;
  timestamp: string;
  txHash: string;
  network: BlockchainNetwork | 'FIAT_WIRE' | 'SEPA_INSTANT' | 'LOCAL_RAILS';
  status: 'confirmed' | 'pending' | 'processing';
  counterparty?: string;
  feeOusd?: number;
}
