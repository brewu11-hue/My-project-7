import React, { useState } from 'react';
import {
  BatteryCharging,
  Clock,
  HelpCircle,
  Key,
  Lock,
  MapPin,
  MessageSquare,
  Shield,
  Smartphone,
  Users,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CableType, PaymentMethod } from '../../types';
import { ActiveSessionCard } from './ActiveSessionCard';
import { PaymentGatewayModal } from './PaymentGatewayModal';

export const AttendeeView: React.FC = () => {
  const { stations, userActiveSession, startChargingSession, selectedStationId, setSelectedStationId } = useApp();

  // Booking Form State
  const [stationId, setStationId] = useState<string>(selectedStationId || stations[0]?.id || 'STN-JHB-01');
  const [sessionType, setSessionType] = useState<'locker' | 'powerbank'>('locker');
  const [cableType, setCableType] = useState<CableType>('USB-C');
  const [durationHours, setDurationHours] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [deviceModel, setDeviceModel] = useState<string>('iPhone 15 Pro');
  const [initialBattery, setInitialBattery] = useState<number>(18);
  const [lockerPin, setLockerPin] = useState<string>(
    Math.floor(1000 + Math.random() * 9000).toString()
  );
  const [selectedSlotNum, setSelectedSlotNum] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const activeStation = stations.find((s) => s.id === stationId) || stations[0];

  // Calculate pricing
  const baseRate = activeStation?.hourlyRateZAR || 25;
  const pricingOptions = [
    { hours: 1, label: '1 Hour Fast Charge', costZAR: baseRate, badge: 'Quick Juice' },
    { hours: 2, label: '2 Hours Full Charge', costZAR: Math.round(baseRate * 1.8), badge: 'Most Popular' },
    { hours: 4, label: '4 Hours Event Pass', costZAR: Math.round(baseRate * 3.2), badge: 'Festival Saver' },
    { hours: 8, label: 'Full Day VIP Pass', costZAR: Math.round(baseRate * 6), badge: 'All Day' },
  ];

  const selectedPricing = pricingOptions.find((p) => p.hours === durationHours) || pricingOptions[0];

  // Available slots for selected station
  const availableSlots = activeStation?.slots.filter((s) => s.status === 'available') || [];

  const handleStartBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setFormError('Please provide a valid South African phone number (e.g. 082 123 4567)');
      return;
    }
    if (lockerPin.length !== 4) {
      setFormError('Locker PIN must be exactly 4 digits');
      return;
    }

    if (availableSlots.length === 0) {
      setFormError('All slots at this station are currently occupied. Please choose another station nearby.');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentMethod: PaymentMethod) => {
    const slotToUse = selectedSlotNum || availableSlots[0]?.slotNumber || 1;

    startChargingSession({
      customerName,
      phone,
      email: email || `${phone.replace(/\s+/g, '')}@bincharge.co.za`,
      stationId: activeStation.id,
      slotNumber: slotToUse,
      sessionType,
      deviceModel,
      cableType,
      initialBattery,
      durationMinutes: durationHours * 60,
      costZAR: selectedPricing.costZAR,
      paymentMethod,
      lockerPin,
    });

    setShowPaymentModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Active User Charging Session Card (Top priority if active) */}
      {userActiveSession && userActiveSession.status === 'active' && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Your Active Charging Session
            </h2>
            <span className="text-xs text-slate-400">Live Telemetry &amp; Locker Keypad PIN</span>
          </div>
          <ActiveSessionCard />
        </section>
      )}

      {/* Hero Flyer Banner (Deep Navy + Golden Yellow Accent) */}
      <section className="relative overflow-hidden rounded-xl bg-[#0F172A] border border-slate-800 p-6 sm:p-10 shadow-sm text-white">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBD23]/20 border border-[#FBBD23]/40 text-[#FBBD23] text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-[#FBBD23]" />
              <span>Mobile Cell Charging Stations For You</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight">
              NEED TO JUICE UP <br className="hidden sm:block" />
              <span className="text-[#FBBD23]">YOUR CELL?</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
              Don&apos;t let a flat battery stop your vibe. <strong>B-in Charge</strong> provides high-speed,
              secure charging stations &amp; magnetic power banks at South Africa&apos;s leading events,
              festivals, shopping centres, and expos. <strong>(Look around the corner!)</strong>
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>65W GaN SuperCharge</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200">
                <Lock className="w-3.5 h-3.5 text-[#FBBD23]" />
                <span>PIN-Secured Lockers</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200">
                <Shield className="w-3.5 h-3.5 text-[#FBBD23]" />
                <span>Load-Shedding Proof Backup</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Box */}
          <div className="lg:col-span-4 bg-[#1E293B] rounded-xl border border-slate-700 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Network Status
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-2xl font-bold text-[#FBBD23] block">
                  {stations.length}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Event Hubs</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-2xl font-bold text-emerald-400 block">
                  {stations.reduce((acc, s) => acc + s.availableSlots, 0)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Free Lockers</span>
              </div>
            </div>

            <a
              href="https://wa.me/27730925711?text=Hi%20B-in%20Charge%2C%20where%20is%20the%20nearest%20charging%20station%3F"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp: 073 092 5711</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Booking / Check-in Form */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[#FBBD23] text-slate-900">
                Step by Step
              </span>
              <span className="text-xs text-slate-500 font-medium">Book a charger for an hour or more</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
              Reserve Your Charging Slot
            </h2>
            <p className="text-xs text-slate-500">
              Quick 60-second self check-in. Choose your cable, time, and unlock with your private PIN.
            </p>
          </div>

          <form onSubmit={handleStartBooking} className="space-y-6">
            {formError && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Step 1: Select Event Station */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#FBBD23]" />
                <span>1. Select Event Station Location</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stations.map((stn) => {
                  const isSelected = stn.id === stationId;
                  return (
                    <button
                      key={stn.id}
                      type="button"
                      onClick={() => {
                        setStationId(stn.id);
                        setSelectedStationId(stn.id);
                        setSelectedSlotNum(null);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-[#FBBD23] bg-amber-50/70 shadow-xs ring-1 ring-[#FBBD23]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          {stn.id}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            stn.availableSlots > 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {stn.availableSlots} Slots Free
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                        {stn.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                        {stn.location}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Service Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#FBBD23]" />
                <span>2. Select Charging Method</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSessionType('locker')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    sessionType === 'locker'
                      ? 'border-[#FBBD23] bg-amber-50/70 shadow-xs ring-1 ring-[#FBBD23]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="p-2.5 rounded-lg bg-amber-100 text-[#FBBD23]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Secure Station Locker</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Leave phone safely locked in kiosk with 65W GaN fast charge &amp; private PIN.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSessionType('powerbank')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    sessionType === 'powerbank'
                      ? 'border-[#FBBD23] bg-amber-50/70 shadow-xs ring-1 ring-[#FBBD23]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="p-2.5 rounded-lg bg-amber-100 text-[#FBBD23]">
                    <BatteryCharging className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Portable Power Bank</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Rent a 10,000mAh magnetic pack with built-in cables and roam freely.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 3: Cable Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#FBBD23]" />
                <span>3. Select Phone Cable Connector</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { type: 'USB-C' as CableType, desc: 'Samsung, Pixel, New iPhones' },
                  { type: 'Lightning' as CableType, desc: 'iPhone 14 & Earlier' },
                  { type: 'Dual (Type-C + Lightning)' as CableType, desc: 'Combo Multi-Port' },
                  { type: 'Qi Wireless' as CableType, desc: 'MagSafe / Fast Wireless' },
                ].map((c) => (
                  <button
                    key={c.type}
                    type="button"
                    onClick={() => setCableType(c.type)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      cableType === c.type
                        ? 'border-[#FBBD23] bg-amber-50/70 text-slate-900 font-bold shadow-xs ring-1 ring-[#FBBD23]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold block">{c.type}</span>
                    <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                      {c.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Duration Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#FBBD23]" />
                <span>4. Rental Duration &amp; Price (ZAR)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {pricingOptions.map((opt) => {
                  const isSelected = durationHours === opt.hours;
                  return (
                    <button
                      key={opt.hours}
                      type="button"
                      onClick={() => setDurationHours(opt.hours)}
                      className={`p-3.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-[#FBBD23] bg-amber-50/70 shadow-xs ring-1 ring-[#FBBD23]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-slate-100 text-slate-700 inline-block mb-1">
                        {opt.badge}
                      </span>
                      <span className="text-xl font-bold text-slate-900 block">
                        R{opt.costZAR}
                      </span>
                      <span className="text-xs text-slate-600 font-medium block">
                        {opt.hours} {opt.hours === 1 ? 'Hour' : 'Hours'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Attendee Details */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#FBBD23]" />
                <span>5. Your Details (For Station Usage Records &amp; Security)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sipho Ndlovu"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    South African Cellphone * (For SMS/WhatsApp receipt)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 082 123 4567 or +2773..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-mono font-medium focus:outline-none focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Phone Model / Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. iPhone 15 Pro, Samsung S24"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Current Battery Level ({initialBattery}%)
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min={1}
                      max={95}
                      value={initialBattery}
                      onChange={(e) => setInitialBattery(Number(e.target.value))}
                      className="flex-1 accent-[#FBBD23] cursor-pointer"
                    />
                    <span className="text-xs font-bold font-mono text-slate-900 w-10 text-right">
                      {initialBattery}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6: 4-Digit Security PIN */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-[#FBBD23]" />
                  <span>Choose 4-Digit Locker PIN Code</span>
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  You will enter this PIN on the station keypad to open locker and retrieve your cell.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={lockerPin}
                  onChange={(e) => setLockerPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-28 px-3 py-2 rounded-lg bg-white border-2 border-slate-300 text-center font-mono font-bold text-xl text-slate-900 tracking-widest focus:border-[#FBBD23] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setLockerPin(Math.floor(1000 + Math.random() * 9000).toString())
                  }
                  className="px-2.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-[11px] font-bold text-slate-700 border border-slate-200 shadow-2xs"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Zap className="w-5 h-5 fill-slate-900" />
              <span>Continue to Online Payment (R{selectedPricing.costZAR}.00)</span>
            </button>
          </form>
        </div>

        {/* Right Sidebar: Live Station Locker Grid & FAQ */}
        <div className="lg:col-span-4 space-y-6">
          {/* Station Live Locker Visualizer */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {activeStation.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">{activeStation.venueArea}</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {activeStation.type}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Live Locker Matrix (Click slot to select)
              </span>

              <div className="grid grid-cols-4 gap-2">
                {activeStation.slots.map((slot) => {
                  const isAvailable = slot.status === 'available';
                  const isSelected = selectedSlotNum === slot.slotNumber;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlotNum(slot.slotNumber)}
                      className={`p-2.5 rounded-lg border text-center transition-all relative ${
                        isSelected
                          ? 'border-[#FBBD23] bg-[#FBBD23] text-slate-900 font-bold shadow-xs'
                          : isAvailable
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-400'
                          : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-70'
                      }`}
                    >
                      <span className="text-xs font-bold block font-mono">
                        #{slot.slotNumber}
                      </span>
                      <span className="text-[9px] block uppercase font-bold mt-0.5">
                        {isSelected ? 'Selected' : isAvailable ? 'Free' : 'In-Use'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-1.5 text-slate-600 font-medium">
              <div className="flex justify-between">
                <span>Power Output:</span>
                <span className="text-slate-900 font-semibold">65W GaN Multi-Port PD</span>
              </div>
              <div className="flex justify-between">
                <span>Station Temp:</span>
                <span className="text-emerald-700 font-semibold">{activeStation.temperature}°C (Nominal)</span>
              </div>
              <div className="flex justify-between">
                <span>Load-Shedding Battery:</span>
                <span className="text-emerald-700 font-semibold">100% Backed Up</span>
              </div>
            </div>
          </div>

          {/* Quick FAQ Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#FBBD23]" />
              <span>How B-in Charge Works</span>
            </h4>

            <ul className="text-xs text-slate-600 space-y-2.5 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FBBD23] text-slate-900 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span>Select your cable and pay via Ozow, SnapScan, Capitec Pay, or Card.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FBBD23] text-slate-900 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <span>Plug your phone into your designated locker slot and close door.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FBBD23] text-slate-900 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <span>Enjoy the event! Return and type your 4-digit PIN to collect your phone.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <PaymentGatewayModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          amountZAR={selectedPricing.costZAR}
          customerName={customerName}
          phone={phone}
          stationName={activeStation.name}
          durationLabel={`${durationHours} Hour(s)`}
          slotNumber={selectedSlotNum || availableSlots[0]?.slotNumber || 1}
        />
      )}
    </div>
  );
};
