import React, { useState } from 'react';
import {
  CheckCircle2,
  DoorOpen,
  Filter,
  MapPin,
  Plus,
  QrCode,
  Search,
  Thermometer,
  Wrench,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChargingStation, Province, StationSlot, StationType } from '../../types';

export const StationFleetView: React.FC = () => {
  const { stations, forceUnlockSlot, updateSlotStatus, addStation } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedSlotModal, setSelectedSlotModal] = useState<{
    station: ChargingStation;
    slot: StationSlot;
  } | null>(null);
  const [showAddStationModal, setShowAddStationModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState<ChargingStation | null>(null);

  // New Station Form State
  const [newStationName, setNewStationName] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newProvince, setNewProvince] = useState<Province>('Gauteng');
  const [newType, setNewType] = useState<StationType>('8-Locker Tower');
  const [newHourlyRate, setNewHourlyRate] = useState(25);

  // Summary Metrics
  const totalStations = stations.length;
  const totalSlots = stations.reduce((acc, s) => acc + s.totalSlots, 0);
  const activeSessions = stations.reduce((acc, s) => acc + s.activeSessions, 0);
  const availableSlots = stations.reduce((acc, s) => acc + s.availableSlots, 0);
  const totalPowerDraw = stations.reduce((acc, s) => acc + s.powerDrawWatts, 0);
  const avgTemp = (stations.reduce((acc, s) => acc + s.temperature, 0) / (totalStations || 1)).toFixed(1);

  // Filtering
  const filteredStations = stations.filter((stn) => {
    const matchSearch =
      stn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stn.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stn.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stn.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchProvince = selectedProvince === 'all' || stn.province === selectedProvince;

    return matchSearch && matchProvince;
  });

  const handleCreateStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStationName.trim()) return;

    const slotCount = newType === '16-Locker Kiosk' ? 16 : newType === '24-Bay Power Bank Hub' ? 24 : 8;
    const newId = `STN-${newProvince.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const newStation: ChargingStation = {
      id: newId,
      name: newStationName,
      eventName: newEventName || 'General Deployment',
      location: newLocation || 'South Africa Venue',
      venueArea: 'Main Event Floor',
      province: newProvince,
      type: newType,
      totalSlots: slotCount,
      availableSlots: slotCount,
      activeSessions: 0,
      status: 'online',
      powerDrawWatts: 180,
      temperature: 24.5,
      voltage: 230.0,
      lastPing: 'Just now',
      hourlyRateZAR: newHourlyRate,
      supportsPowerBankRental: newType.includes('Power Bank') || newType.includes('Tower'),
      qrCodeData: `BINCHARGE-${newId}`,
      slots: Array.from({ length: slotCount }, (_, i) => ({
        id: `slot-${i + 1}`,
        slotNumber: i + 1,
        status: 'available',
        cableType: i % 2 === 0 ? 'USB-C' : 'Lightning',
        powerOutput: '65W PD Fast Charge',
        slotTemp: 24.2,
      })),
    };

    addStation(newStation);
    setShowAddStationModal(false);
    setNewStationName('');
    setNewEventName('');
    setNewLocation('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Metrics Row */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Fleet Stations
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{totalStations}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">100% Online</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Bays
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{totalSlots}</span>
            <span className="text-xs text-slate-500 font-medium">National</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Active Charging
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">
              {activeSessions}
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {Math.round((activeSessions / (totalSlots || 1)) * 100)}% Busy
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Available Slots
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-emerald-600">
              {availableSlots}
            </span>
            <span className="text-xs text-slate-500 font-medium">Ready</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Fleet Power
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">
              {totalPowerDraw} <span className="text-sm font-normal text-slate-400">W</span>
            </span>
            <Zap className="w-4 h-4 text-[#FBBD23]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Avg Fleet Temp
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-emerald-600">
              {avgTemp}°C
            </span>
            <Thermometer className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </section>

      {/* Control Bar: Search, Filter, Add Station */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search station ID, event, location, venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FBBD23] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#FBBD23] focus:bg-white"
            >
              <option value="all">All SA Provinces</option>
              <option value="Gauteng">Gauteng (JHB &amp; VDB)</option>
              <option value="Western Cape">Western Cape (Cape Town)</option>
              <option value="KwaZulu-Natal">KwaZulu-Natal (Durban)</option>
              <option value="Free State">Free State</option>
              <option value="Eastern Cape">Eastern Cape</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowAddStationModal(true)}
          className="px-4 py-2 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy New Station</span>
        </button>
      </div>

      {/* Stations Fleet Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStations.map((station) => {
          const occupancyPercent = Math.round((station.activeSessions / station.totalSlots) * 100);

          return (
            <div
              key={station.id}
              className="rounded-xl bg-white border border-slate-200 p-6 space-y-5 shadow-sm hover:border-slate-300 transition-all"
            >
              {/* Station Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-slate-100 text-slate-900 border border-slate-200">
                      {station.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                      {station.type}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {station.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mt-1.5 tracking-tight">
                    {station.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#FBBD23] flex-shrink-0" />
                    <span>{station.location}</span>
                  </p>
                </div>

                <button
                  onClick={() => setShowQrModal(station)}
                  title="View Station QR Code for attendees"
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors flex-shrink-0"
                >
                  <QrCode className="w-4 h-4 text-slate-800" />
                </button>
              </div>

              {/* Station Real-Time Telemetry Bar */}
              <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Occupancy</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">
                    {station.activeSessions}/{station.totalSlots} ({occupancyPercent}%)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Power Draw</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">
                    {station.powerDrawWatts}W
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Internal Temp</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">
                    {station.temperature}°C
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Tariff</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">
                    R{station.hourlyRateZAR}/hr
                  </span>
                </div>
              </div>

              {/* Interactive Locker Slot Matrix */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider">
                    Locker Bays ({station.availableSlots} Free, {station.activeSessions} Busy)
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Click bay to manage</span>
                </div>

                <div
                  className={`grid gap-2 ${
                    station.totalSlots > 16
                      ? 'grid-cols-6 sm:grid-cols-8'
                      : station.totalSlots > 8
                      ? 'grid-cols-4 sm:grid-cols-8'
                      : 'grid-cols-4'
                  }`}
                >
                  {station.slots.map((slot) => {
                    const isCharging = slot.status === 'charging';
                    const isAvailable = slot.status === 'available';

                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlotModal({ station, slot })}
                        className={`p-2.5 rounded-lg border text-center transition-all relative flex flex-col items-center justify-center gap-1 ${
                          isCharging
                            ? 'border-amber-300 bg-amber-50 text-slate-900 shadow-2xs hover:border-[#FBBD23]'
                            : isAvailable
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-400'
                            : 'border-rose-200 bg-rose-50 text-rose-800'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full text-[10px] font-mono font-bold">
                          <span>#{slot.slotNumber}</span>
                          {isCharging ? (
                            <Zap className="w-3 h-3 text-[#FBBD23] fill-[#FBBD23]" />
                          ) : isAvailable ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Wrench className="w-3 h-3 text-rose-500" />
                          )}
                        </div>

                        {isCharging && slot.batteryPercent !== undefined ? (
                          <div className="w-full">
                            <span className="text-xs font-bold font-mono text-slate-900 block">
                              {Math.round(slot.batteryPercent)}%
                            </span>
                            <span className="text-[8px] text-slate-500 truncate block">
                              {slot.timeRemainingMinutes}m left
                            </span>
                          </div>
                        ) : (
                          <span className="text-[9px] uppercase font-bold text-slate-500">
                            {isAvailable ? 'Free' : 'Service'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Station Operator Note / Venue Area */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-medium">
                <span className="truncate">Area: <strong className="text-slate-800">{station.venueArea}</strong></span>
                <span className="text-slate-900 font-semibold">{station.eventName}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Slot Controller Modal (Open Locker, Force Release, Set Maintenance) */}
      {selectedSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="max-w-md w-full rounded-xl bg-white border border-slate-200 p-6 space-y-5 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#FBBD23] text-slate-900 flex items-center justify-center font-bold text-sm font-mono">
                  #{selectedSlotModal.slot.slotNumber}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Slot #{selectedSlotModal.slot.slotNumber} Controller
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {selectedSlotModal.station.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSlotModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Slot Current Status Info */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold uppercase text-slate-900">
                  {selectedSlotModal.slot.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cable Connector:</span>
                <span className="font-semibold text-slate-900">{selectedSlotModal.slot.cableType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Power Rating:</span>
                <span className="font-semibold text-emerald-700">
                  {selectedSlotModal.slot.powerOutput}
                </span>
              </div>

              {selectedSlotModal.slot.status === 'charging' && (
                <>
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span className="text-slate-500">Assigned Attendee:</span>
                    <span className="font-bold text-slate-900">
                      {selectedSlotModal.slot.customerName || 'Walk-in User'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-mono text-slate-800">
                      {selectedSlotModal.slot.customerPhone || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Device Model:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedSlotModal.slot.deviceModel || 'Smartphone'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Battery:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {selectedSlotModal.slot.batteryPercent}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Remaining Time:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {selectedSlotModal.slot.timeRemainingMinutes} Minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Locker PIN Code:</span>
                    <span className="font-bold text-slate-900 font-mono text-sm tracking-widest">
                      {selectedSlotModal.slot.lockerPinCode || '1234'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Operator Actions */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Operator Actions
              </span>

              <button
                type="button"
                onClick={() => {
                  forceUnlockSlot(selectedSlotModal.station.id, selectedSlotModal.slot.slotNumber);
                  setSelectedSlotModal(null);
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <DoorOpen className="w-4 h-4" />
                <span>Open Locker Door &amp; Reset to Free</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    updateSlotStatus(
                      selectedSlotModal.station.id,
                      selectedSlotModal.slot.slotNumber,
                      selectedSlotModal.slot.status === 'maintenance' ? 'available' : 'maintenance'
                    );
                    setSelectedSlotModal(null);
                  }}
                  className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 flex items-center justify-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5 text-rose-500" />
                  <span>
                    {selectedSlotModal.slot.status === 'maintenance' ? 'Exit Maint.' : 'Mark Maint.'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSlotModal(null)}
                  className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal for Station Kiosk */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="max-w-sm w-full rounded-xl bg-white border border-slate-200 p-6 space-y-4 text-center shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-mono font-bold text-slate-900">
                {showQrModal.id}
              </span>
              <button
                onClick={() => setShowQrModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
              <QrCode className="w-44 h-44 text-slate-900" />
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mt-2">
                SCAN TO JUICE UP
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {showQrModal.qrCodeData}
              </span>
            </div>

            <h4 className="text-lg font-bold text-slate-900">
              {showQrModal.name}
            </h4>
            <p className="text-xs text-slate-500">
              Print or display this QR code on the station signage. Attendees scan to immediately open the booking portal with this station pre-selected.
            </p>

            <button
              onClick={() => alert(`QR code configuration for ${showQrModal.name} copied to clipboard!`)}
              className="w-full py-2.5 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              Copy Station Link
            </button>
          </div>
        </div>
      )}

      {/* Add New Station Modal */}
      {showAddStationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="max-w-md w-full rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Deploy New Mobile Charging Station
              </h3>
              <button
                onClick={() => setShowAddStationModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStation} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Station Name / Identifier *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cape Town Stadium VIP Stand"
                  value={newStationName}
                  onChange={(e) => setNewStationName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Event / Festival Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rocking the Daisies 2026"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Location / Venue Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cloof Wine Estate, Darling, Western Cape"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Province
                  </label>
                  <select
                    value={newProvince}
                    onChange={(e) => setNewProvince(e.target.value as Province)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  >
                    <option value="Gauteng">Gauteng</option>
                    <option value="Western Cape">Western Cape</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="Free State">Free State</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Hardware Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as StationType)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  >
                    <option value="8-Locker Tower">8-Locker Tower</option>
                    <option value="16-Locker Kiosk">16-Locker Kiosk</option>
                    <option value="24-Bay Power Bank Hub">24-Bay Power Bank Hub</option>
                    <option value="Tabletop Bar Pod">Tabletop Bar Pod</option>
                    <option value="Solar Mobile Kiosk">Solar Mobile Kiosk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Hourly Rate (ZAR R)
                </label>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={newHourlyRate}
                  onChange={(e) => setNewHourlyRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStationModal(false)}
                  className="flex-1 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Deploy Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
