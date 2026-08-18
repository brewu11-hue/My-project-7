/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { AttendeeView } from './components/attendee/AttendeeView';
import { StationFleetView } from './components/dashboard/StationFleetView';
import { CustomerRecordsView } from './components/dashboard/CustomerRecordsView';
import { InventoryView } from './components/dashboard/InventoryView';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { EventDeploymentView } from './components/dashboard/EventDeploymentView';
import { CompanyProfileView } from './components/profile/CompanyProfileView';
import { Logo } from './components/common/Logo';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { MapPin, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, stations } = useApp();

  const activeStation = stations.find((s) => s.status === 'online' || s.status === 'busy') || stations[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-[#FBBD23] selection:text-slate-900 pb-20 lg:pb-0">
      {/* Top Main Navigation Header (Professional Polish Deep Navy) */}
      <Header />

      {/* System Overview Sub-Header (from Professional Polish design) */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'juice-up' && 'Attendee Charging Portal'}
              {activeTab === 'stations' && 'Station Fleet Management'}
              {activeTab === 'customers' && 'User & Usage Records'}
              {activeTab === 'inventory' && 'Real-Time Inventory Levels'}
              {activeTab === 'analytics' && 'System Analytics & Revenue'}
              {activeTab === 'deployments' && 'Event Deployments Across SA'}
              {activeTab === 'profile' && 'Company Profile & Enterprise Solutions'}
            </h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">
              {activeStation?.eventName || 'National Event Deployment'} • {activeStation?.name || 'Main Site'} ({activeStation?.province || 'Gauteng'})
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right">
              <span className="text-[10px] block text-slate-400 font-bold uppercase tracking-wider">
                Real-Time Status
              </span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-emerald-600 font-bold text-xs">ACTIVE FLEET</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

            <button
              onClick={() => setActiveTab(activeTab === 'juice-up' ? 'stations' : 'juice-up')}
              className="bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 px-4 py-2 rounded-lg font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-slate-900" />
              <span>{activeTab === 'juice-up' ? 'View Live Fleet' : '+ Charge Device'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'juice-up' && <AttendeeView />}
        {activeTab === 'stations' && <StationFleetView />}
        {activeTab === 'customers' && <CustomerRecordsView />}
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'deployments' && <EventDeploymentView />}
        {activeTab === 'profile' && <CompanyProfileView />}
      </main>

      {/* Footer styled with Professional Polish Light/Slate Theme */}
      <footer className="mt-16 border-t border-slate-200 bg-white text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <Logo size="md" theme="light" />
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart mobile charging stations &amp; power bank hubs for live events, corporate venues, and festivals across South Africa.
              </p>
              <div className="text-[11px] text-slate-900 font-bold bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                A Division of Maduba T Trading &amp; Investment Holdings PTY Ltd
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                Platform Navigation
              </span>
              <ul className="space-y-2 font-medium">
                <li>
                  <button
                    onClick={() => setActiveTab('juice-up')}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Event Attendee Charging Portal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('stations')}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Live Station Fleet Matrix
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('customers')}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Usage &amp; User Records Log
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Real-Time Hardware Inventory
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="hover:text-slate-900 transition-colors"
                  >
                    Revenue &amp; Demand Intelligence
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Management */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                Operations Management
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-900 font-bold">Thabiso Maduba</span>
                  <div className="text-slate-500 font-mono text-[11px]">081 205 0748 • ts.maduba.tm@gmail.com</div>
                </div>
                <div>
                  <span className="text-slate-900 font-bold">Tumelo Zakwe</span>
                  <div className="text-slate-500 font-mono text-[11px]">071 734 6401 • zakwet721@gmail.com</div>
                </div>
                <div className="pt-1">
                  <a
                    href="https://wa.me/27730925711"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-emerald-600 font-bold hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp: 073 092 5711</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 4: Physical Address & Green Power */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                Headquarters
              </span>
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-[#FBBD23] flex-shrink-0 mt-0.5" />
                <p>
                  1067 Plaatjie Street, Bophelong 1913, <br />
                  Vanderbijlpark, Gauteng, <br />
                  South Africa
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>65W GaN Fast Charging &amp; Eskom Load-Shedding UPS Standby</span>
              </div>
            </div>
          </div>

          {/* Bottom Sub-footer */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
            <p>
              &copy; {new Date().getFullYear()} B-in Charge (Maduba T Trading &amp; Investment Holdings PTY Ltd). All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('profile')}
                className="hover:text-slate-900 transition-colors"
              >
                Company Profile
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('juice-up')}
                className="hover:text-slate-900 transition-colors"
              >
                Attendee Booking
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation (iOS & Android) */}
      <MobileBottomNav />
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
