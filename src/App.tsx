import React from 'react';
import { SupplyChainProvider, useSupplyChain } from './context/SupplyChainContext';
import { Header } from './components/common/Header';
import { LiveDemoBar } from './components/common/LiveDemoBar';
import { NotificationToast } from './components/common/NotificationToast';
import { WelcomePage } from './components/login/WelcomePage';
import { RoleLoginPage } from './components/login/RoleLoginPage';
import { SupplierDashboard } from './components/supplier/SupplierDashboard';
import { FactoryDashboard } from './components/factory/FactoryDashboard';
import { WarehouseDashboard } from './components/warehouse/WarehouseDashboard';
import { HubDashboard } from './components/hub/HubDashboard';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentView, currentRole, loginTargetRole } = useSupplyChain();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* 12-Step Live Demonstration Bar */}
      <LiveDemoBar />

      {/* Top Bar Navigation */}
      <Header />

      {/* Main Content Area based on View & Role */}
      <main className="flex-1">
        {currentView === 'welcome' && <WelcomePage />}

        {currentView === 'login' && loginTargetRole && (
          <RoleLoginPage role={loginTargetRole} />
        )}

        {currentView === 'dashboard' && currentRole && (
          <>
            {currentRole === 'supplier' && <SupplierDashboard />}
            {currentRole === 'factory' && <FactoryDashboard />}
            {currentRole === 'warehouse' && <WarehouseDashboard />}
            {currentRole === 'hub' && <HubDashboard />}
            {currentRole === 'driver' && <DriverDashboard />}
            {currentRole === 'customer' && <CustomerDashboard />}
            {currentRole === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Real-time Toast Notifications */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <SupplyChainProvider>
      <AppContent />
    </SupplyChainProvider>
  );
}
