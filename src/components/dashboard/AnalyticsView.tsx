import React from 'react';
import {
  Activity,
  BatteryCharging,
  CreditCard,
  Flame,
  Smartphone,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { customers, stations } = useApp();

  const totalRevenue = customers.reduce((acc, c) => acc + c.costZAR, 0);
  const totalSessions = customers.length;
  const avgDuration = Math.round(
    customers.reduce((acc, c) => acc + c.durationMinutes, 0) / (totalSessions || 1)
  );
  const avgBatteryGain = Math.round(
    customers.reduce((acc, c) => acc + Math.max(0, c.currentBattery - c.initialBattery), 0) / (totalSessions || 1)
  );

  // Payment Breakdown
  const paymentCounts: Record<string, number> = {};
  customers.forEach((c) => {
    paymentCounts[c.paymentMethod] = (paymentCounts[c.paymentMethod] || 0) + 1;
  });

  // Station Revenue Breakdown
  const stationRevenue: Record<string, { name: string; revenue: number; count: number }> = {};
  stations.forEach((s) => {
    stationRevenue[s.id] = { name: s.name, revenue: 0, count: 0 };
  });
  customers.forEach((c) => {
    if (stationRevenue[c.stationId]) {
      stationRevenue[c.stationId].revenue += c.costZAR;
      stationRevenue[c.stationId].count += 1;
    }
  });

  // Device Brands
  const deviceBrands: Record<string, number> = {
    'Apple iPhone': 0,
    'Samsung Galaxy': 0,
    'Huawei / Honor': 0,
    'Xiaomi / Redmi': 0,
    'Other Android': 0,
  };

  customers.forEach((c) => {
    const dev = c.deviceModel.toLowerCase();
    if (dev.includes('iphone') || dev.includes('apple')) deviceBrands['Apple iPhone'] += 1;
    else if (dev.includes('samsung') || dev.includes('galaxy')) deviceBrands['Samsung Galaxy'] += 1;
    else if (dev.includes('huawei') || dev.includes('honor')) deviceBrands['Huawei / Honor'] += 1;
    else if (dev.includes('xiaomi') || dev.includes('redmi')) deviceBrands['Xiaomi / Redmi'] += 1;
    else deviceBrands['Other Android'] += 1;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Hero KPI Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-slate-900 flex items-center justify-center font-bold text-sm">
              R
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            R{totalRevenue.toLocaleString()}.00
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+38.4% from last event</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Sessions Logged
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {totalSessions} Logs
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Average Session: <strong className="text-slate-900">{avgDuration} Mins</strong>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Avg Battery Charged
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-slate-900 flex items-center justify-center">
              <BatteryCharging className="w-4 h-4 text-[#FBBD23]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-600">
            +{avgBatteryGain}% Gain
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Estimated ~1.4% per min on 65W PD
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Network Health
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            99.8% Uptime
          </div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>5 Active Event Stations in SA</span>
          </div>
        </div>
      </section>

      {/* Main Charts & Analytics Visuals */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Station Performance Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Revenue by Mobile Station Location
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Performance across South African venues &amp; festivals
              </p>
            </div>
            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">ZAR (R)</span>
          </div>

          <div className="space-y-4">
            {Object.entries(stationRevenue).map(([id, data]) => {
              const maxRev = Math.max(...Object.values(stationRevenue).map((v) => v.revenue), 100);
              const percentage = Math.round((data.revenue / maxRev) * 100);

              return (
                <div key={id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 truncate max-w-[280px]">
                      {data.name} <span className="text-slate-400 font-mono font-normal">({id})</span>
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        R{data.revenue}.00
                      </span>
                      <span className="text-[10px] text-slate-500 ml-2 font-mono">
                        ({data.count} users)
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-100 p-0.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#FBBD23] transition-all duration-700"
                      style={{ width: `${Math.max(5, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Payment Channels (SA)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Transactions split by gateway method
                </p>
              </div>
              <CreditCard className="w-5 h-5 text-[#FBBD23]" />
            </div>

            <div className="space-y-3 mt-4">
              {Object.entries(paymentCounts).map(([method, count]) => {
                const pct = Math.round((count / (totalSessions || 1)) * 100);
                const badgeColor =
                  method === 'Ozow'
                    ? 'bg-pink-50 text-pink-700 border-pink-200'
                    : method === 'SnapScan'
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : method === 'CapitecPay'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : method === 'PayFast'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                return (
                  <div
                    key={method}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${badgeColor}`}>
                        {method}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        {count} Payments
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 font-medium">
            <Zap className="w-4 h-4 text-[#FBBD23] flex-shrink-0" />
            <span>Instant EFT (Ozow/Capitec) &amp; SnapScan QR make up over 70% of event conversions.</span>
          </div>
        </div>
      </section>

      {/* Secondary Row: Phone Models & Peak Hours */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Device Brand Share */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Phone Ecosystem Breakdown
            </h3>
            <Smartphone className="w-4 h-4 text-[#FBBD23]" />
          </div>

          <div className="space-y-3">
            {Object.entries(deviceBrands).map(([brand, count]) => {
              const pct = Math.round((count / (totalSessions || 1)) * 100);

              return (
                <div key={brand} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800">{brand}</span>
                    <span className="font-mono text-slate-500">{count} devices ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-[#FBBD23] rounded-full"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peak Hours & Energy Efficiency */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Peak Demand Analysis
              </h3>
              <Flame className="w-4 h-4 text-[#FBBD23]" />
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
              At live festivals and expos, battery drain accelerates heavily after <strong>16:00 to 22:00</strong> as attendees record videos and share social media content.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Peak Occupancy Hour</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">
                  18:30 - 21:00
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">96% Station Fill Rate</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Load-Shedding Resilience</span>
                <span className="text-xl font-bold text-emerald-700 mt-1 block">
                  4.2 Hours
                </span>
                <span className="text-[10px] text-slate-500 font-medium">UPS Standby Power</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between font-medium">
            <span>Operations Base: Vanderbijlpark, Gauteng</span>
            <span className="text-slate-900 font-bold">Maduba T Holdings</span>
          </div>
        </div>
      </section>
    </div>
  );
};
