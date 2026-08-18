import React, { useState } from 'react';
import {
  BatteryCharging,
  CheckCircle2,
  Clock,
  Key,
  Lock,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  Unlock,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentGatewayModal } from './PaymentGatewayModal';

export const ActiveSessionCard: React.FC = () => {
  const { userActiveSession, endChargingSession, extendChargingSession } = useApp();
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendMinutes, setExtendMinutes] = useState(30);
  const [extendCost, setExtendCost] = useState(15);
  const [pinCopied, setPinCopied] = useState(false);
  const [showConfirmCollect, setShowConfirmCollect] = useState(false);

  if (!userActiveSession) return null;

  const isCompleted = userActiveSession.status === 'completed';
  const isOverdue = userActiveSession.status === 'overdue';

  const copyPin = () => {
    navigator.clipboard.writeText(userActiveSession.lockerPin);
    setPinCopied(true);
    setTimeout(() => setPinCopied(false), 2000);
  };

  const handleOpenExtend = (minutes: number, cost: number) => {
    setExtendMinutes(minutes);
    setExtendCost(cost);
    setShowExtendModal(true);
  };

  const batteryColor =
    userActiveSession.currentBattery >= 80
      ? 'bg-emerald-500'
      : userActiveSession.currentBattery >= 40
      ? 'bg-[#FBBD23]'
      : 'bg-amber-500';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#FBBD23] text-slate-900 flex items-center justify-center font-bold text-xl shadow-sm">
            #{userActiveSession.slotNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isCompleted ? 'Completed' : isOverdue ? 'Overdue - Ready for Pickup' : 'Live Charging Active'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {userActiveSession.id}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              {userActiveSession.stationName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {userActiveSession.eventName} • Slot #{userActiveSession.slotNumber} ({userActiveSession.cableType})
            </p>
          </div>
        </div>

        {/* Locker PIN Display Box */}
        <div className="flex items-center gap-3 bg-[#0F172A] px-4 py-2.5 rounded-xl border border-slate-800 shadow-sm">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Locker PIN Code
            </span>
            <div className="text-2xl font-bold font-mono tracking-widest text-[#FBBD23]">
              {userActiveSession.lockerPin}
            </div>
          </div>
          <button
            onClick={copyPin}
            title="Copy PIN Code"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
          >
            {pinCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Key className="w-4 h-4 text-[#FBBD23]" />}
          </button>
        </div>
      </div>

      {/* Main Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        {/* Battery Telemetry Card */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Battery Level
            </span>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
              <Zap className="w-3.5 h-3.5 fill-emerald-500" />
              <span>65W Fast Charge</span>
            </div>
          </div>

          <div className="my-4">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-bold text-slate-900">
                {Math.round(userActiveSession.currentBattery)}%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Started {userActiveSession.initialBattery}% (+
                {Math.max(0, Math.round(userActiveSession.currentBattery - userActiveSession.initialBattery))}
                %)
              </span>
            </div>

            {/* Battery visual bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full ${batteryColor} transition-all duration-700`}
                style={{ width: `${Math.min(100, userActiveSession.currentBattery)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Device: <strong className="text-slate-800">{userActiveSession.deviceModel}</strong></span>
            <span>Target: ~{userActiveSession.targetBattery}%</span>
          </div>
        </div>

        {/* Time Remaining Card */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Time Remaining
            </span>
            <Clock className="w-4 h-4 text-[#FBBD23]" />
          </div>

          <div className="my-4">
            <div className="text-3xl font-bold font-mono text-slate-900">
              {Math.floor(userActiveSession.remainingMinutes)}m {Math.round((userActiveSession.remainingMinutes % 1) * 60)}s
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Total Duration: {userActiveSession.durationMinutes} Minutes (Paid R{userActiveSession.costZAR})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenExtend(30, 15)}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-1 transition-all shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#FBBD23]" />
              <span>+30m (R15)</span>
            </button>
            <button
              onClick={() => handleOpenExtend(60, 25)}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-1 transition-all shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#FBBD23]" />
              <span>+60m (R25)</span>
            </button>
          </div>
        </div>

        {/* Attendee & Receipt Info */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Rental Token
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-1.5 my-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Name:</span>
              <span className="text-slate-900 font-bold">{userActiveSession.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phone:</span>
              <span className="text-slate-900 font-mono">{userActiveSession.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment:</span>
              <span className="text-emerald-700 font-bold">{userActiveSession.paymentMethod} (R{userActiveSession.costZAR})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Type:</span>
              <span className="text-slate-800 font-semibold capitalize">{userActiveSession.sessionType} Station</span>
            </div>
          </div>

          <a
            href={`https://wa.me/27730925711?text=Hi%20B-in%20Charge%20Support%2C%20I%20have%20an%20active%20rental%20at%20${encodeURIComponent(
              userActiveSession.stationName
            )}%20Slot%20%23${userActiveSession.slotNumber}%20(PIN%20${userActiveSession.lockerPin})`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Support (073 092 5711)</span>
          </a>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Lock className="w-4 h-4 text-[#FBBD23]" />
          <span>Keep your 4-digit PIN safe. Enter it on the station keypad to open locker #{userActiveSession.slotNumber}.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfirmCollect(true)}
            className="py-2.5 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
          >
            <Unlock className="w-4 h-4" />
            <span>Retrieve Device &amp; End Session</span>
          </button>
        </div>
      </div>

      {/* Confirmation Collect Modal */}
      {showConfirmCollect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="max-w-md w-full rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#FBBD23] flex items-center justify-center mx-auto border border-amber-100">
              <Unlock className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-xl font-bold text-slate-900">
                Retrieve Device from Slot #{userActiveSession.slotNumber}?
              </h4>
              <p className="text-xs text-slate-500 mt-2">
                Make sure you are standing in front of <strong>{userActiveSession.stationName}</strong>.
                Enter your PIN <strong className="text-slate-900 font-mono text-sm">{userActiveSession.lockerPin}</strong> on the locker touch keypad to unlock.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmCollect(false)}
                className="flex-1 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  endChargingSession(userActiveSession.id);
                  setShowConfirmCollect(false);
                }}
                className="flex-1 py-2.5 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 text-xs font-bold uppercase shadow-sm"
              >
                Confirm Retrieved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extension Payment Modal */}
      {showExtendModal && (
        <PaymentGatewayModal
          isOpen={showExtendModal}
          onClose={() => setShowExtendModal(false)}
          onSuccess={(method) => {
            extendChargingSession(userActiveSession.id, extendMinutes, extendCost, method);
            setShowExtendModal(false);
          }}
          amountZAR={extendCost}
          customerName={userActiveSession.customerName}
          phone={userActiveSession.phone}
          stationName={userActiveSession.stationName}
          durationLabel={`+${extendMinutes} Minutes Extension`}
          slotNumber={userActiveSession.slotNumber}
        />
      )}
    </div>
  );
};
