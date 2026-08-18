import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Eye,
  FileSpreadsheet,
  MessageSquare,
  Phone,
  Search,
  UserPlus,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CableType, CustomerRecord, PaymentMethod } from '../../types';

export const CustomerRecordsView: React.FC = () => {
  const { customers, stations, addNewCustomerRecord, endChargingSession } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stationFilter, setStationFilter] = useState<string>('all');
  const [selectedCustomerModal, setSelectedCustomerModal] = useState<CustomerRecord | null>(null);
  const [showAddWalkinModal, setShowAddWalkinModal] = useState(false);

  // Walk-in form state
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinEmail, setWalkinEmail] = useState('');
  const [walkinStationId, setWalkinStationId] = useState(stations[0]?.id || 'STN-JHB-01');
  const [walkinSlotNum, setWalkinSlotNum] = useState(1);
  const [walkinDevice, setWalkinDevice] = useState('Samsung Galaxy A54');
  const [walkinCable, setWalkinCable] = useState<CableType>('USB-C');
  const [walkinBattery, setWalkinBattery] = useState(15);
  const [walkinDuration, setWalkinDuration] = useState(60);
  const [walkinCost, setWalkinCost] = useState(25);
  const [walkinPayment, setWalkinPayment] = useState<PaymentMethod>('Cash');
  const [walkinPin, setWalkinPin] = useState('5521');

  // Summary counts
  const totalCustomers = customers.length;
  const activeCount = customers.filter((c) => c.status === 'active').length;
  const completedCount = customers.filter((c) => c.status === 'completed').length;
  const overdueCount = customers.filter((c) => c.status === 'overdue').length;
  const totalRevenueZAR = customers.reduce((acc, c) => acc + c.costZAR, 0);

  // Filtered list
  const filteredCustomers = customers.filter((cust) => {
    const matchSearch =
      cust.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.stationName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'all' || cust.status === statusFilter;
    const matchStation = stationFilter === 'all' || cust.stationId === stationFilter;

    return matchSearch && matchStatus && matchStation;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Record ID',
      'Customer Name',
      'Phone',
      'Email',
      'Station ID',
      'Station Name',
      'Event Name',
      'Slot #',
      'Session Type',
      'Device Model',
      'Cable Type',
      'Initial Battery %',
      'Current/Final Battery %',
      'Start Time',
      'Duration (Mins)',
      'Cost (ZAR)',
      'Payment Method',
      'Payment Status',
      'Locker PIN',
      'Status',
    ];

    const rows = filteredCustomers.map((c) => [
      c.id,
      `"${c.customerName}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      c.stationId,
      `"${c.stationName}"`,
      `"${c.eventName}"`,
      c.slotNumber,
      c.sessionType,
      `"${c.deviceModel}"`,
      `"${c.cableType}"`,
      c.initialBattery,
      c.currentBattery,
      `"${new Date(c.startTime).toLocaleString('en-ZA')}"`,
      c.durationMinutes,
      c.costZAR,
      c.paymentMethod,
      c.paymentStatus,
      c.lockerPin,
      c.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `B-in-Charge-Usage-Records-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim() || !walkinPhone.trim()) return;

    const targetStation = stations.find((s) => s.id === walkinStationId) || stations[0];

    addNewCustomerRecord({
      customerName: walkinName,
      phone: walkinPhone,
      email: walkinEmail || `${walkinPhone.replace(/\s+/g, '')}@walkin.bincharge.co.za`,
      stationId: targetStation.id,
      stationName: targetStation.name,
      eventName: targetStation.eventName,
      slotNumber: walkinSlotNum,
      sessionType: 'locker',
      deviceModel: walkinDevice,
      cableType: walkinCable,
      initialBattery: walkinBattery,
      currentBattery: walkinBattery,
      targetBattery: Math.min(100, walkinBattery + 60),
      startTime: new Date().toISOString(),
      durationMinutes: walkinDuration,
      remainingMinutes: walkinDuration,
      costZAR: walkinCost,
      paymentMethod: walkinPayment,
      paymentStatus: 'paid',
      lockerPin: walkinPin,
      status: 'active',
      notes: `Walk-in on-site registration. Paid R${walkinCost} via ${walkinPayment}.`,
    });

    setShowAddWalkinModal(false);
    setWalkinName('');
    setWalkinPhone('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Metrics Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total People Recorded
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{totalCustomers}</span>
            <Users className="w-4 h-4 text-[#FBBD23]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Active Chargers Now
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{activeCount}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Live
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Completed Rentals
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-emerald-600">{completedCount}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Pending Pickup
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-orange-600">{overdueCount}</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Gross Revenue (ZAR)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">
              R{totalRevenueZAR.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">ZAR</span>
          </div>
        </div>
      </section>

      {/* Filter & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Bar */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search attendee name, phone, device, station ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FBBD23] focus:bg-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#FBBD23] focus:bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Charging</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue / Ready for Pickup</option>
          </select>

          {/* Station Filter */}
          <select
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#FBBD23] focus:bg-white"
          >
            <option value="all">All Event Stations</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id})
              </option>
            ))}
          </select>
        </div>

        {/* Buttons: Export & Add Walk-in */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddWalkinModal(true)}
            className="px-3.5 py-2 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Log Walk-in User</span>
          </button>
        </div>
      </div>

      {/* Main Records: Mobile Card View for Apple/Android + Desktop Table */}
      
      {/* Mobile Card List (sm & md screens) */}
      <div className="lg:hidden space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 font-medium text-xs">
            No station usage records found matching your filters.
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const isActive = cust.status === 'active';
            const isCompleted = cust.status === 'completed';

            return (
              <div
                key={cust.id}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-sm active:border-slate-300 transition-all"
              >
                {/* Card Top: Customer, Station & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base truncate">
                        {cust.customerName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 shrink-0 ${
                          isActive
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : isCompleted
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-orange-50 text-orange-800 border border-orange-200'
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                        {cust.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-1 font-medium">
                      <Phone className="w-3.5 h-3.5 text-[#FBBD23] shrink-0" />
                      <a href={`tel:${cust.phone}`} className="hover:underline text-slate-700 font-bold">
                        {cust.phone}
                      </a>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-slate-900 block">
                      R{cust.costZAR}.00
                    </span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-semibold inline-block mt-0.5">
                      {cust.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Station & Locker Info */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Station Location</span>
                    <span className="font-bold text-slate-800 truncate block mt-0.5">
                      {cust.stationName}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {cust.eventName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Locker Bay &amp; PIN</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="w-5 h-5 rounded bg-amber-100 text-slate-900 font-bold text-xs font-mono flex items-center justify-center">
                        #{cust.slotNumber}
                      </span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                        PIN: {cust.lockerPin}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Device & Battery Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700">
                      {cust.deviceModel} ({cust.cableType})
                    </span>
                    <span className="font-mono text-slate-900 font-bold">
                      <span className="text-slate-400">{cust.initialBattery}%</span> →{' '}
                      <span className="text-emerald-600">{Math.round(cust.currentBattery)}%</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, cust.currentBattery)}%` }}
                    />
                  </div>
                </div>

                {/* Mobile Action Buttons (44px min touch target) */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => setSelectedCustomerModal(cust)}
                    className="min-h-[44px] py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-transform"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                    <span>Details</span>
                  </button>

                  <a
                    href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                      cust.customerName
                    )}%2C%20your%20charging%20session%20at%20B-in%20Charge%20(${cust.stationName}%20Slot%20%23${
                      cust.slotNumber
                    })%20is%20ready.%20Your%20PIN%20is%20${cust.lockerPin}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] py-2.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 active:scale-[0.98] text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-transform"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  {isActive ? (
                    <button
                      onClick={() => {
                        if (confirm(`Mark session for ${cust.customerName} as retrieved & completed?`)) {
                          endChargingSession(cust.id);
                        }
                      }}
                      className="min-h-[44px] py-2.5 px-3 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] active:scale-[0.98] text-slate-900 text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-transform"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Finish</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="min-h-[44px] py-2.5 px-3 rounded-lg bg-slate-100 text-slate-400 text-xs font-medium flex items-center justify-center"
                    >
                      <span>Done</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View (lg+ screens) */}
      <div className="hidden lg:block rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Attendee / Contact</th>
                <th className="py-3.5 px-4">Station &amp; Slot</th>
                <th className="py-3.5 px-4">Device &amp; Cable</th>
                <th className="py-3.5 px-4">Battery Trajectory</th>
                <th className="py-3.5 px-4">Time &amp; Duration</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">PIN</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                    No station usage records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isActive = cust.status === 'active';
                  const isCompleted = cust.status === 'completed';

                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {cust.customerName}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-0.5 font-medium">
                          <Phone className="w-3 h-3 text-[#FBBD23]" />
                          <span>{cust.phone}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                          ID: {cust.id}
                        </div>
                      </td>

                      {/* Station & Slot */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-6 h-6 rounded-md bg-amber-100 text-slate-900 font-bold text-xs font-mono flex items-center justify-center">
                            #{cust.slotNumber}
                          </span>
                          <span className="font-bold text-slate-800 truncate max-w-[130px]" title={cust.stationName}>
                            {cust.stationName}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[150px] font-medium">
                          {cust.eventName}
                        </div>
                      </td>

                      {/* Device & Cable */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {cust.deviceModel}
                        </div>
                        <div className="text-[10px] text-amber-700 font-bold mt-0.5">
                          {cust.cableType}
                        </div>
                      </td>

                      {/* Battery Trajectory */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="font-mono text-xs">
                            <span className="text-slate-400">{cust.initialBattery}%</span>
                            <span className="text-[#FBBD23] mx-1">→</span>
                            <span className="font-bold text-emerald-700">
                              {Math.round(cust.currentBattery)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-24 h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min(100, cust.currentBattery)}%` }}
                          />
                        </div>
                      </td>

                      {/* Time & Duration */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700 font-semibold">
                          {cust.durationMinutes} Minutes
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(cust.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {isActive && (
                          <div className="text-[10px] text-amber-700 font-bold font-mono">
                            {Math.floor(cust.remainingMinutes)}m left
                          </div>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          R{cust.costZAR}.00
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 font-semibold text-slate-700">
                            {cust.paymentMethod}
                          </span>
                        </div>
                      </td>

                      {/* Locker PIN */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 font-mono font-bold text-slate-900 text-xs tracking-wider">
                          {cust.lockerPin}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            isActive
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : isCompleted
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-orange-50 text-orange-800 border border-orange-200'
                          }`}
                        >
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                          {cust.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCustomerModal(cust)}
                            title="View Full Receipt & Audit Trail"
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                              cust.customerName
                            )}%2C%20your%20charging%20session%20at%20B-in%20Charge%20(${cust.stationName}%20Slot%20%23${
                              cust.slotNumber
                            })%20is%20ready.%20Your%20PIN%20is%20${cust.lockerPin}.`}
                            target="_blank"
                            rel="noreferrer"
                            title="Send WhatsApp PIN reminder"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          {isActive && (
                            <button
                              onClick={() => {
                                if (confirm(`Mark session for ${cust.customerName} as retrieved & completed?`)) {
                                  endChargingSession(cust.id);
                                }
                              }}
                              title="Mark Collected & End Session"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Record Detail Modal */}
      {selectedCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="max-w-lg w-full max-h-[92vh] overflow-y-auto rounded-xl bg-white border border-slate-200 p-5 sm:p-8 space-y-5 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-amber-100 text-slate-900">
                    {selectedCustomerModal.id}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">B-in Charge Official Usage Record</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedCustomerModal.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCustomerModal(null)}
                className="w-10 h-10 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-lg active:scale-95"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Station &amp; Event</span>
                <span className="font-bold text-slate-900 block mt-0.5">{selectedCustomerModal.stationName}</span>
                <span className="text-[11px] text-amber-700 font-medium">{selectedCustomerModal.eventName}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Locker Slot &amp; PIN</span>
                <span className="font-bold text-slate-900 font-mono text-sm block mt-0.5">
                  Slot #{selectedCustomerModal.slotNumber} (PIN: {selectedCustomerModal.lockerPin})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Cellphone Number</span>
                <span className="font-mono text-slate-700 block mt-0.5 font-medium">{selectedCustomerModal.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Email Address</span>
                <span className="font-mono text-slate-700 block mt-0.5 truncate font-medium">{selectedCustomerModal.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Phone Device Model</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{selectedCustomerModal.deviceModel}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Cable Connector</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{selectedCustomerModal.cableType}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Battery Gain</span>
                <span className="font-bold text-emerald-700 block mt-0.5">
                  {selectedCustomerModal.initialBattery}% → {Math.round(selectedCustomerModal.currentBattery)}% (+
                  {Math.max(0, Math.round(selectedCustomerModal.currentBattery - selectedCustomerModal.initialBattery))}
                  %)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Payment Amount</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  R{selectedCustomerModal.costZAR}.00 ({selectedCustomerModal.paymentMethod})
                </span>
              </div>
            </div>

            {selectedCustomerModal.notes && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 font-bold block mb-1">Operator Notes:</span>
                <p className="text-slate-700 text-[11px] font-medium">{selectedCustomerModal.notes}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${selectedCustomerModal.phone.replace(/[^0-9]/g, '')}?text=B-in%20Charge%20Official%20Receipt%20for%20${encodeURIComponent(
                  selectedCustomerModal.customerName
                )}%3A%20Slot%20%23${selectedCustomerModal.slotNumber}%2C%20PIN%20${selectedCustomerModal.lockerPin}%2C%20Amount%20Paid%20R${
                  selectedCustomerModal.costZAR
                }.00%20via%20${selectedCustomerModal.paymentMethod}.`}
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold uppercase flex items-center justify-center gap-1.5 shadow-sm transition-transform"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send WhatsApp Receipt</span>
              </a>

              <button
                onClick={() => setSelectedCustomerModal(null)}
                className="min-h-[44px] py-2.5 px-5 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-xs font-bold text-slate-700 transition-transform"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Walk-in Customer Modal */}
      {showAddWalkinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="max-w-md w-full max-h-[92vh] overflow-y-auto rounded-xl bg-white border border-slate-200 p-5 sm:p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Log Walk-In Attendee Record
              </h3>
              <button
                onClick={() => setShowAddWalkinModal(false)}
                className="w-10 h-10 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-lg active:scale-95"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWalkin} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kagiso Motsepe"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Cellphone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 083 456 7890"
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Station
                  </label>
                  <select
                    value={walkinStationId}
                    onChange={(e) => setWalkinStationId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  >
                    {stations.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Locker Slot #
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={walkinSlotNum}
                    onChange={(e) => setWalkinSlotNum(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Phone Model
                  </label>
                  <input
                    type="text"
                    value={walkinDevice}
                    onChange={(e) => setWalkinDevice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Cable Connector
                  </label>
                  <select
                    value={walkinCable}
                    onChange={(e) => setWalkinCable(e.target.value as CableType)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  >
                    <option value="USB-C">USB-C</option>
                    <option value="Lightning">Lightning</option>
                    <option value="Dual (Type-C + Lightning)">Dual Combo</option>
                    <option value="Micro-USB">Micro-USB</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Payment
                  </label>
                  <select
                    value={walkinPayment}
                    onChange={(e) => setWalkinPayment(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  >
                    <option value="Cash">Cash</option>
                    <option value="SnapScan">SnapScan</option>
                    <option value="Card">Card</option>
                    <option value="Ozow">Ozow</option>
                    <option value="CapitecPay">Capitec</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Price (ZAR)
                  </label>
                  <input
                    type="number"
                    value={walkinCost}
                    onChange={(e) => setWalkinCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={walkinPin}
                    onChange={(e) => setWalkinPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono font-bold text-xs focus:border-[#FBBD23] text-center"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddWalkinModal(false)}
                  className="flex-1 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
