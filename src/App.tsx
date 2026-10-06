/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { MarketplaceFeed } from './components/MarketplaceFeed';
import { EscrowOrdersView } from './components/EscrowOrdersView';
import { FinancialDashboard } from './components/FinancialDashboard';
import { GlobalBankPayoutModal } from './components/GlobalBankPayoutModal';
import { OnRampGatewayModal } from './components/OnRampGatewayModal';
import { TransferModal } from './components/TransferModal';
import { PrivyAuthModal } from './components/PrivyAuthModal';
import { CreateEscrowModal } from './components/CreateEscrowModal';
import { CreateServiceModal } from './components/CreateServiceModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'marketplace' && <MarketplaceFeed />}
        {activeTab === 'escrow' && <EscrowOrdersView />}
        {activeTab === 'financial' && <FinancialDashboard />}
      </main>

      {/* Global Modals & Dialogs */}
      <GlobalBankPayoutModal />
      <OnRampGatewayModal />
      <TransferModal />
      <PrivyAuthModal />
      <CreateEscrowModal />
      <CreateServiceModal />

      {/* Notifications */}
      <ToastContainer />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
