import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  MapPin,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Province } from '../../types';

export const EventDeploymentView: React.FC = () => {
  const { events, stations, addEventDeployment } = useApp();

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventName, setEventName] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('Johannesburg');
  const [province, setProvince] = useState<Province>('Gauteng');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedAttendees, setExpectedAttendees] = useState(5000);
  const [organizerContact, setOrganizerContact] = useState('');
  const [revenueTargetZAR, setRevenueTargetZAR] = useState(25000);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !venue.trim()) return;

    addEventDeployment({
      eventName,
      venue,
      city,
      province,
      startDate,
      endDate,
      assignedStations: [stations[0]?.id || 'STN-JHB-01'],
      expectedAttendees: Number(expectedAttendees),
      status: 'upcoming',
      organizerContact: organizerContact || 'organizer@event.co.za',
      revenueTargetZAR: Number(revenueTargetZAR),
    });

    setShowAddEventModal(false);
    setEventName('');
    setVenue('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[#FBBD23] text-slate-900">
              Field Operations
            </span>
            <span className="text-xs text-slate-500 font-medium">Station Deployments Across SA</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            Event &amp; Festival Deployments
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Coordinate mobile station logistics, battery charging trailers, and kiosk placements.
          </p>
        </div>

        <button
          onClick={() => setShowAddEventModal(true)}
          className="px-4 py-2.5 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy to New Event</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => {
          const isActive = evt.status === 'active';

          return (
            <div
              key={evt.id}
              className="rounded-xl bg-white border border-slate-200 p-6 space-y-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {evt.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mt-3 tracking-tight">
                  {evt.eventName}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#FBBD23] flex-shrink-0" />
                  <span>
                    {evt.venue}, {evt.city} ({evt.province})
                  </span>
                </p>

                <div className="grid grid-cols-2 gap-2 text-center p-3 rounded-xl bg-slate-50 border border-slate-200 my-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Attendees</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">
                      {evt.expectedAttendees.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Revenue Target</span>
                    <span className="font-bold text-slate-900 text-sm">
                      R{evt.revenueTargetZAR.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Dates:</span>
                    </span>
                    <span className="font-semibold text-slate-900">
                      {evt.startDate} to {evt.endDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>Stations Assigned:</span>
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {evt.assignedStations.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="truncate">Contact: {evt.organizerContact}</span>
                <span className="text-emerald-700 font-semibold">Confirmed</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="max-w-md w-full rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Deploy Mobile Stations to New Event
              </h3>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Event / Festival Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cape Town International Jazz Festival"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Venue / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CTICC, Cape Town"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value as Province)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  >
                    <option value="Gauteng">Gauteng</option>
                    <option value="Western Cape">Western Cape</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="Free State">Free State</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Expected Attendees
                  </label>
                  <input
                    type="number"
                    value={expectedAttendees}
                    onChange={(e) => setExpectedAttendees(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Target Revenue (ZAR)
                  </label>
                  <input
                    type="number"
                    value={revenueTargetZAR}
                    onChange={(e) => setRevenueTargetZAR(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="flex-1 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Deploy Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
