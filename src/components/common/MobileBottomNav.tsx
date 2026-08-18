import React, { useState } from 'react';
import {
  Activity,
  BatteryCharging,
  Building2,
  Calendar,
  Layers,
  MoreHorizontal,
  Package,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { NavTab, useApp } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, userActiveSession } = useApp();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'juice-up',
      label: 'Juice Up',
      icon: userActiveSession && userActiveSession.status === 'active' ? (
        <BatteryCharging className="w-5 h-5 text-emerald-400 animate-pulse" />
      ) : (
        <Zap className="w-5 h-5" />
      ),
      badge: userActiveSession && userActiveSession.status === 'active' ? `${Math.round(userActiveSession.currentBattery)}%` : undefined,
    },
    {
      id: 'stations',
      label: 'Stations',
      icon: <Layers className="w-5 h-5" />,
    },
    {
      id: 'customers',
      label: 'Records',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Package className="w-5 h-5" />,
    },
  ];

  const moreItems: { id: NavTab; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'analytics',
      label: 'Analytics & Revenue',
      icon: <Activity className="w-5 h-5 text-[#FBBD23]" />,
      desc: 'Real-time turnover, peak event hours, cable demand',
    },
    {
      id: 'deployments',
      label: 'Event Deployments',
      icon: <Calendar className="w-5 h-5 text-[#FBBD23]" />,
      desc: 'Festival logistics, venue floor plans, booking schedule',
    },
    {
      id: 'profile',
      label: 'Company Profile & B2B',
      icon: <Building2 className="w-5 h-5 text-[#FBBD23]" />,
      desc: 'B-in Charge brand overview, enterprise rentals, contact',
    },
  ];

  const isMoreActive = ['analytics', 'deployments', 'profile'].includes(activeTab);

  return (
    <>
      {/* More Modal / Bottom Sheet */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs lg:hidden">
          <div className="w-full sm:max-w-md bg-[#0F172A] border-t sm:border border-slate-800 rounded-t-2xl sm:rounded-2xl p-5 space-y-4 text-white shadow-2xl pb-safe">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBD23]" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Additional Views &amp; Tools
                </h3>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {moreItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMoreMenu(false);
                    }}
                    className={`w-full min-h-[52px] p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isActive
                        ? 'bg-[#1E293B] border-[#FBBD23] text-white shadow-xs'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-800 shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{item.label}</span>
                        {isActive && (
                          <span className="text-[10px] bg-[#FBBD23] text-slate-900 px-1.5 py-0.2 rounded font-bold uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav Bar for Mobile (iOS Safari & Android Navigation Bar Friendly) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-t border-slate-800 px-2 pt-1.5 pb-safe lg:hidden shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          {mainItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowMoreMenu(false);
                }}
                className={`min-h-[48px] py-1 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
                  isActive
                    ? 'text-[#FBBD23] font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-3 text-[9px] font-bold px-1 rounded-full bg-emerald-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight truncate max-w-[62px]">
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-[#FBBD23]" />
                )}
              </button>
            );
          })}

          {/* More Tab */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`min-h-[48px] py-1 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
              isMoreActive || showMoreMenu
                ? 'text-[#FBBD23] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">More</span>
            {(isMoreActive || showMoreMenu) && (
              <div className="w-1 h-1 rounded-full bg-[#FBBD23]" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
