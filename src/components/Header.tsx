import React, { useState } from 'react';
import {
  Activity,
  BatteryCharging,
  Building2,
  Calendar,
  Layers,
  Menu,
  MessageSquare,
  Package,
  RotateCcw,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { NavTab, useApp } from '../context/AppContext';
import { Logo } from './common/Logo';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, userActiveSession, stations, resetToDemoData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeStationsCount = stations.filter((s) => s.status === 'online' || s.status === 'busy').length;
  const totalActiveChargers = stations.reduce((acc, s) => acc + s.activeSessions, 0);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'juice-up',
      label: 'Juice Up Portal',
      icon: <Zap className="w-4 h-4 text-[#FBBD23]" />,
      badge: userActiveSession && userActiveSession.status === 'active' ? 'Active' : undefined,
    },
    {
      id: 'stations',
      label: 'Station Fleet',
      icon: <Layers className="w-4 h-4" />,
      badge: `${activeStationsCount} Live`,
    },
    {
      id: 'customers',
      label: 'User Records',
      icon: <Users className="w-4 h-4" />,
      badge: totalActiveChargers > 0 ? `${totalActiveChargers} in use` : undefined,
    },
    {
      id: 'inventory',
      label: 'Inventory Levels',
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      label: 'Usage Analytics',
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: 'deployments',
      label: 'Event Deploy',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'profile',
      label: 'Company Profile',
      icon: <Building2 className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] border-b border-slate-800 shadow-md">
      {/* Top micro announcement bar */}
      <div className="bg-[#FBBD23] text-slate-900 px-4 py-1 text-xs font-bold flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-block w-2 h-2 rounded-full bg-slate-900 animate-ping" />
          <span className="tracking-wide">B-IN CHARGE SOUTH AFRICA • SMART MOBILE CHARGING STATIONS</span>
          <span className="hidden md:inline font-normal text-slate-800">• Real-Time Station Telemetry &amp; Event Fleet</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
          <a
            href="https://wa.me/27730925711?text=Hi%20B-in%20Charge%2C%20I%20am%20at%20an%20event%20and%20need%20help%20with%20a%20charging%20station"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:underline text-slate-900"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp: 073 092 5711
          </a>
          <span>•</span>
          <span>Vanderbijlpark &amp; National Events</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            className="cursor-pointer"
            onClick={() => setActiveTab('juice-up')}
          >
            <Logo size="md" theme="dark" />
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#1E293B]/60 p-1.5 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1E293B] text-white shadow-sm ring-1 ring-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {isActive && <div className="w-2 h-2 rounded-full bg-[#FBBD23]" />}
                  <span className={isActive ? 'text-[#FBBD23]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        isActive
                          ? 'bg-[#FBBD23] text-slate-900'
                          : 'bg-[#FBBD23]/20 text-[#FBBD23]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Live user active charging indicator */}
            {userActiveSession && userActiveSession.status === 'active' && (
              <button
                onClick={() => setActiveTab('juice-up')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-bold hover:bg-emerald-900/80 transition-all shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
                <span>Slot #{userActiveSession.slotNumber} ({Math.round(userActiveSession.currentBattery)}%)</span>
              </button>
            )}

            <button
              onClick={() => {
                if (confirm('Reset stations, customers, and inventory to realistic event demo state?')) {
                  resetToDemoData();
                }
              }}
              title="Reset sample event data"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Reset Demo</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            {userActiveSession && userActiveSession.status === 'active' && (
              <button
                onClick={() => setActiveTab('juice-up')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-xs font-bold"
              >
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>{Math.round(userActiveSession.currentBattery)}%</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0F172A] px-4 pt-3 pb-6 space-y-1 shadow-2xl">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#1E293B] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isActive && <div className="w-2 h-2 rounded-full bg-[#FBBD23]" />}
                  <span className={isActive ? 'text-[#FBBD23]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-[#FBBD23] text-slate-900' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <a
              href="https://wa.me/27730925711"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#FBBD23] font-bold"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp: 073 092 5711
            </a>
            <button
              onClick={() => {
                resetToDemoData();
                setMobileMenuOpen(false);
              }}
              className="text-slate-400 hover:text-white"
            >
              Reset Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
