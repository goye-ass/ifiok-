import { EscrowOrder, ServiceItem, Transaction, WalletState } from '../types';

const STORAGE_KEYS = {
  USER: 'ifiok_wallet_state_v2',
  SERVICES: 'ifiok_services_data_v2',
  ORDERS: 'ifiok_orders_data_v2',
  TRANSACTIONS: 'ifiok_transactions_data_v2',
};

// Initial benchmark services that load dynamically into the database
export const INITIAL_ENTERPRISE_SERVICES: ServiceItem[] = [
  {
    id: 'srv-web3-01',
    title: 'Enterprise Full-Stack Web3 DApp & L2 Architecture',
    category: 'Web3 & Smart Contracts',
    freelancer: {
      name: 'Amina Diallo',
      handle: 'diallo.eth',
      title: 'Principal Blockchain Architect',
      rating: 4.98,
      reviewCount: 46,
      completedOrders: 52,
      earnedOusd: 218500,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      address: '0x38F87C9aA045B8dFe9C369B75E54D264f331F45A',
      isVerified: true,
      location: 'Geneva, Switzerland',
    },
    description:
      'Turnkey enterprise decentralization: custom Solidity smart contracts, ERC-4337 account abstraction, Base/Polygon deployment pipelines, and bulletproof sub-graph indexing.',
    startingPriceOusd: 9500,
    deliveryDays: 14,
    skills: ['Solidity', 'Foundry', 'Base L2', 'Account Abstraction', 'TypeScript', 'Next.js'],
    image: '/src/assets/images/service_web3_preview_1791320524800.jpg',
    defaultMilestones: [
      {
        title: 'Milestone 1: Smart Contract Core & Formal Spec',
        description: 'Architecture blueprint, gas optimization tests, and local devnet deployment.',
        percentage: 30,
      },
      {
        title: 'Milestone 2: Subgraph & Account Abstraction Frontend',
        description: 'Integration of Privy social login, paymaster gas sponsorship, and indexing.',
        percentage: 45,
      },
      {
        title: 'Milestone 3: Security Hardening & Mainnet Launch',
        description: 'Comprehensive Slither/Echidna fuzz tests, documentation, and live rollout.',
        percentage: 25,
      },
    ],
    portfolioHighlights: [
      'Architected DEX router processing $12M daily volume on Base',
      'Implemented zero-seed embedded wallet onboarding for 180k users',
      'Zero security incidents across 14 audited production protocols',
    ],
  },
  {
    id: 'srv-ai-02',
    title: 'Custom Enterprise LLM Fine-Tuning & High-Throughput RAG',
    category: 'AI & ML Systems',
    freelancer: {
      name: 'Dr. Tariq Al-Mansoor',
      handle: 'tariqml',
      title: 'Senior AI Research Engineer (Ph.D. Cambridge)',
      rating: 4.95,
      reviewCount: 38,
      completedOrders: 41,
      earnedOusd: 194000,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      address: '0x9924ACb19D45c829E1A29D67c8051E7728c38712',
      isVerified: true,
      location: 'Dubai, UAE',
    },
    description:
      'Custom parameter-efficient fine-tuning (LoRA/QLoRA), production RAG pipeline with hybrid vector indexing, evaluation harness, and low-latency self-hosted inference.',
    startingPriceOusd: 12000,
    deliveryDays: 18,
    skills: ['PyTorch', 'vLLM', 'LangChain', 'Vector DB', 'Kubernetes', 'HuggingFace'],
    image: '/src/assets/images/service_ai_preview_1791320536825.jpg',
    defaultMilestones: [
      {
        title: 'Milestone 1: Domain Corpus Curation & Baseline Eval',
        description: 'Data cleaning, synthetic augmentation, and baseline metric benchmarks.',
        percentage: 25,
      },
      {
        title: 'Milestone 2: Quantized Fine-Tuning & Model Alignment',
        description: 'LoRA weight training, DPO alignment, and latency profiling on H100s.',
        percentage: 45,
      },
      {
        title: 'Milestone 3: Containerized Serving & Grounding Guardrails',
        description: 'vLLM deployment, hallucination detection filter, and API packaging.',
        percentage: 30,
      },
    ],
    portfolioHighlights: [
      'Built financial compliance assistant with 99.4% precision',
      'Optimized token throughput by 340% using FlashAttention-2',
      'Published author in NeurIPS 2024 on efficient attention kernels',
    ],
  },
  {
    id: 'srv-ui-03',
    title: 'Institutional Multi-Platform Design System & Figma Tokens',
    category: 'UI/UX & Design Systems',
    freelancer: {
      name: 'Kofi Mensah',
      handle: 'mensah_design',
      title: 'Design Systems Lead (Former Stripe & Linear)',
      rating: 5.0,
      reviewCount: 52,
      completedOrders: 59,
      earnedOusd: 165000,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      address: '0x156329B87FDaE4319F4b03681D0A824fC35B5749',
      isVerified: true,
      location: 'London, United Kingdom',
    },
    description:
      'Ultra-refined enterprise design system from foundational semantic tokens to multi-device React/Tailwind component libraries with automated Figma-to-code syncing.',
    startingPriceOusd: 7800,
    deliveryDays: 12,
    skills: ['Figma Tokens', 'React', 'Tailwind CSS', 'Accessibility (WCAG AA)', 'Design Tokens'],
    image: '/src/assets/images/service_design_preview_1791320550009.jpg',
    defaultMilestones: [
      {
        title: 'Milestone 1: Token Architecture & Visual Foundations',
        description: 'Semantic color grids, spacing mathematical scales, and typographic hierarchy.',
        percentage: 35,
      },
      {
        title: 'Milestone 2: Core Component Library (40+ Atoms & Molecules)',
        description: 'Data grids, modals, stateful buttons, form fields, and keyboard navigation.',
        percentage: 40,
      },
      {
        title: 'Milestone 3: Code Sync, Storybook & Handoff Package',
        description: 'TypeScript definitions, documentation site, and automated CI token pipeline.',
        percentage: 25,
      },
    ],
    portfolioHighlights: [
      'Designed fintech UI suite handling $4B in annual B2B payments',
      'Zero-accessibility violations across 65 audited complex screens',
      'Adopted by 8 VC-backed enterprise fintech teams in 2025',
    ],
  },
];

export const dbService = {
  // --- WALLET & USER ---
  getUserState(): WalletState {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}

    // Default unauthenticated / freshly initialized wallet state
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const defaultUser: WalletState = {
      isConnected: true,
      address: `0x${randomHex}`,
      solanaAddress: '9wQp4LmnA7g3Rks8W2uKvYhY1q1Zbx8L2A7g',
      network: 'Base',
      liquidOusd: 12500.0,
      inEscrowOusd: 4500.0,
      earnedYieldOusd: 312.4,
      privyUserId: 'did:privy:ifiok_live_auth_node',
      email: 'enterprise@ifiok.global',
      name: 'Enterprise Hirer (Live)',
      role: 'client',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      company: 'IFIOK Global Client Entity',
      authProvider: 'privy',
    };
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
    } catch {}
    return defaultUser;
  },

  saveUserState(user: WalletState) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist user state:', e);
    }
  },

  // --- SERVICES ---
  getServices(): ServiceItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}

    // Initialize with enterprise services
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_ENTERPRISE_SERVICES));
    } catch {}
    return INITIAL_ENTERPRISE_SERVICES;
  },

  saveServices(services: ServiceItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.error('Failed to persist services:', e);
    }
  },

  addService(service: ServiceItem): ServiceItem[] {
    const current = this.getServices();
    const updated = [service, ...current];
    this.saveServices(updated);
    return updated;
  },

  // --- ORDERS ---
  getOrders(): EscrowOrder[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}

    // Default sample order loaded dynamically
    const sampleOrders: EscrowOrder[] = [
      {
        id: 'ESCROW-9821',
        contractAddress: '0x8a9C7594d6935dBd4d38cAf43dC2D81977f6b98E',
        serviceId: 'srv-web3-01',
        serviceTitle: 'Enterprise Full-Stack Web3 DApp & L2 Architecture',
        clientName: 'Enterprise Hirer (Live)',
        clientAddress: '0x38F87C9aA045B8dFe9C369B75E54D264f331F45A',
        clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        freelancerName: 'Amina Diallo',
        freelancerAddress: '0x38F87C9aA045B8dFe9C369B75E54D264f331F45A',
        freelancerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        network: 'Base',
        totalOusd: 4500,
        platformFeeOusd: 112.5,
        createdAt: new Date().toISOString(),
        status: 'active',
        milestones: [
          {
            id: 'ms-9821-1',
            title: 'Milestone 1: Smart Contract Core & Formal Spec',
            description: 'Architecture blueprint, gas optimization tests, and local devnet deployment.',
            amountOusd: 2000,
            dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            status: 'submitted_review',
            deliverableUrl: 'https://github.com/ifiok-protocol/core-settlement-v1',
            deliverableNotes: 'All 24 test suites pass on Base L2 devnet with sub-second execution.',
            submittedAt: new Date().toISOString(),
          },
          {
            id: 'ms-9821-2',
            title: 'Milestone 2: Subgraph & Account Abstraction Frontend',
            description: 'Integration of Privy social login, paymaster gas sponsorship, and indexing.',
            amountOusd: 2500,
            dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
            status: 'in_progress',
          },
        ],
      },
    ];

    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sampleOrders));
    } catch {}
    return sampleOrders;
  },

  saveOrders(orders: EscrowOrder[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders:', e);
    }
  },

  // --- TRANSACTIONS ---
  getTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}

    const sampleTx: Transaction[] = [
      {
        id: 'tx-001',
        type: 'fiat_onramp',
        title: 'MoonPay Gateway Instant OUSD Purchase',
        amountOusd: 10000.0,
        timestamp: new Date().toISOString(),
        txHash: '0x18ab7210e478b839a9c849102381f9a038f820bc',
        network: 'Base',
        status: 'confirmed',
        counterparty: 'MoonPay Liquidity Rail',
        feeOusd: 25.0,
      },
      {
        id: 'tx-002',
        type: 'deposit_escrow',
        title: 'Smart Escrow Lock: Web3 Architecture',
        amountOusd: 4500.0,
        timestamp: new Date().toISOString(),
        txHash: '0x8a9C7594d6935dBd4d38cAf43dC2D81977f6b98E',
        network: 'Base',
        status: 'confirmed',
        counterparty: 'Escrow Engine #9821',
        feeOusd: 112.5,
      },
    ];

    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(sampleTx));
    } catch {}
    return sampleTx;
  },

  saveTransactions(txs: Transaction[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
    } catch (e) {
      console.error('Failed to persist transactions:', e);
    }
  },

  resetToEmpty() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SERVICES);
      localStorage.removeItem(STORAGE_KEYS.ORDERS);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {}
  },
};
