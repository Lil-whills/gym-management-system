import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../ui/Toast';
import { RecordPaymentModal } from '../../features/payments/RecordPaymentModal';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area shifted by sidebar width on desktop */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Header */}
        <Topbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenRecordPayment={() => setIsRecordPaymentOpen(true)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Toast Notifications */}
        <ToastContainer />

        {/* Global Record Payment Modal (accessible from quick action) */}
        <RecordPaymentModal
          isOpen={isRecordPaymentOpen}
          onClose={() => setIsRecordPaymentOpen(false)}
        />
      </div>
    </div>
  );
};
