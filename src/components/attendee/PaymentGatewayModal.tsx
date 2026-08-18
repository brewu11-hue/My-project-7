import React, { useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Lock,
  QrCode,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { PaymentMethod } from '../../types';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentMethod: PaymentMethod) => void;
  amountZAR: number;
  customerName: string;
  phone: string;
  stationName: string;
  durationLabel: string;
  slotNumber: number;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amountZAR,
  customerName,
  phone,
  stationName,
  durationLabel,
  slotNumber,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Ozow');
  const [selectedBank, setSelectedBank] = useState<string>('Capitec Bank');
  const [cardNumber, setCardNumber] = useState<string>('4000 1234 5678 9010');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvv, setCardCvv] = useState<string>('789');
  const [capitecIdentifier, setCapitecIdentifier] = useState<string>(phone || '082 123 4567');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'auth' | 'success'>('select');

  if (!isOpen) return null;

  const banks = [
    { name: 'Capitec Bank', icon: '🏦' },
    { name: 'FNB (First National Bank)', icon: '🟧' },
    { name: 'Standard Bank', icon: '🟦' },
    { name: 'Nedbank', icon: '🟩' },
    { name: 'Absa Bank', icon: '🔴' },
    { name: 'TymeBank', icon: '🟡' },
    { name: 'Investec', icon: '🦓' },
  ];

  const handlePay = () => {
    setIsProcessing(true);
    setPaymentStep('auth');

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('success');

      setTimeout(() => {
        onSuccess(selectedMethod);
      }, 1200);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl text-slate-800 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentStep === 'select' && (
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[#FBBD23] text-slate-900">
                  Secure Checkout
                </span>
                <span className="text-xs text-slate-500 font-medium">South African Payment Gateway</span>
              </div>
              <h3 className="text-2xl font-bold mt-1 text-slate-900 tracking-tight">
                B-in Charge Payment
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {stationName} • Locker Slot #{slotNumber}
              </p>
            </div>

            {/* Total Amount Pill */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block font-medium">Order Summary</span>
                <span className="text-sm font-bold text-slate-900">
                  {durationLabel} Charging Session
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-slate-900">
                  R{amountZAR}.00
                </span>
                <span className="text-[10px] text-slate-500 block">ZAR (Incl. VAT)</span>
              </div>
            </div>

            {/* Gateway Methods Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Choose Payment Method
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* Ozow */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('Ozow')}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    selectedMethod === 'Ozow'
                      ? 'border-[#FBBD23] bg-amber-50/70 text-slate-900 shadow-xs ring-1 ring-[#FBBD23]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs">
                    ⚡ OZ
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold block">Ozow</span>
                    <span className="text-[9px] text-slate-500">Instant EFT</span>
                  </div>
                </button>

                {/* SnapScan */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('SnapScan')}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    selectedMethod === 'SnapScan'
                      ? 'border-[#FBBD23] bg-amber-50/70 text-slate-900 shadow-xs ring-1 ring-[#FBBD23]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold block">SnapScan</span>
                    <span className="text-[9px] text-slate-500">Scan &amp; Pay</span>
                  </div>
                </button>

                {/* Capitec Pay */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('CapitecPay')}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    selectedMethod === 'CapitecPay'
                      ? 'border-[#FBBD23] bg-amber-50/70 text-slate-900 shadow-xs ring-1 ring-[#FBBD23]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold block">Capitec Pay</span>
                    <span className="text-[9px] text-slate-500">In-App Approve</span>
                  </div>
                </button>

                {/* PayFast */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('PayFast')}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    selectedMethod === 'PayFast'
                      ? 'border-[#FBBD23] bg-amber-50/70 text-slate-900 shadow-xs ring-1 ring-[#FBBD23]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                    PF
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold block">PayFast</span>
                    <span className="text-[9px] text-slate-500">All SA Cards</span>
                  </div>
                </button>

                {/* Credit/Debit Card */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('Card')}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    selectedMethod === 'Card'
                      ? 'border-[#FBBD23] bg-amber-50/70 text-slate-900 shadow-xs ring-1 ring-[#FBBD23]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold block">Bank Card</span>
                    <span className="text-[9px] text-slate-500">Visa / MC</span>
                  </div>
                </button>

                {/* Cash / Attendant */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('Cash')}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    selectedMethod === 'Cash'
                      ? 'border-[#FBBD23] bg-amber-50/70 text-slate-900 shadow-xs ring-1 ring-[#FBBD23]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold block">Cash / Token</span>
                    <span className="text-[9px] text-slate-500">On-Site Rep</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Dynamic Specific Flow Input Area */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              {selectedMethod === 'Ozow' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Select Your South African Bank:</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Zero Transaction Fees</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {banks.map((b) => (
                      <button
                        key={b.name}
                        type="button"
                        onClick={() => setSelectedBank(b.name)}
                        className={`px-3 py-2 rounded-lg border text-left text-xs font-medium flex items-center gap-2 transition-all ${
                          selectedBank === b.name
                            ? 'border-[#FBBD23] bg-amber-50/70 text-slate-900 font-bold'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{b.icon}</span>
                        <span className="truncate">{b.name}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    You will authenticate securely with {selectedBank} instant EFT token.
                  </p>
                </div>
              )}

              {selectedMethod === 'SnapScan' && (
                <div className="space-y-3 text-center">
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-center shadow-xs">
                    <div className="w-full h-full bg-slate-900 rounded flex flex-col items-center justify-center text-white p-2 relative overflow-hidden">
                      <QrCode className="w-20 h-20 text-sky-400 animate-pulse" />
                      <span className="text-[9px] font-bold text-[#FBBD23] mt-1 uppercase">
                        B-IN CHARGE R{amountZAR}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Open your <span className="text-sky-600 font-bold">SnapScan</span> app and scan
                    the QR code above, or click below to authorize.
                  </p>
                </div>
              )}

              {selectedMethod === 'CapitecPay' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">
                    Capitec Registered Cellphone Number / ID:
                  </label>
                  <input
                    type="text"
                    value={capitecIdentifier}
                    onChange={(e) => setCapitecIdentifier(e.target.value)}
                    placeholder="e.g. 082 123 4567 or SA ID"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#FBBD23]"
                  />
                  <p className="text-[11px] text-slate-500">
                    A secure push notification will pop up on your Capitec banking app for 1-tap approval.
                  </p>
                </div>
              )}

              {(selectedMethod === 'PayFast' || selectedMethod === 'Card') && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Card Number (Simulated SA Visa/Mastercard)
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:border-[#FBBD23]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:border-[#FBBD23]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        maxLength={3}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:border-[#FBBD23]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'Cash' && (
                <div className="space-y-2 text-center py-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-[#FBBD23] flex items-center justify-center mx-auto">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    Pay R{amountZAR}.00 in cash to the station attendant on duty.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    The operator will verify your physical voucher or cash note and unlock slot #{slotNumber}.
                  </p>
                </div>
              )}
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted Bank Gateway</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FBBD23]" />
                <span>PCI-DSS Level 1</span>
              </div>
            </div>

            {/* Submit Pay Button */}
            <button
              type="button"
              onClick={handlePay}
              className="w-full py-3.5 px-4 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Zap className="w-4 h-4 fill-slate-900" />
              <span>Confirm &amp; Pay R{amountZAR}.00</span>
            </button>
          </div>
        )}

        {/* Processing State */}
        {paymentStep === 'auth' && (
          <div className="py-12 px-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 border-4 border-[#FBBD23] border-t-transparent animate-spin mx-auto flex items-center justify-center" />
            <h4 className="text-xl font-bold text-slate-900">
              Authorizing via {selectedMethod}...
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Connecting securely to South African banking rail and verifying locker slot #{slotNumber}.
            </p>
          </div>
        )}

        {/* Success State */}
        {paymentStep === 'success' && (
          <div className="py-10 px-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-emerald-700">
              Payment Approved!
            </h4>
            <p className="text-xs text-slate-600">
              R{amountZAR}.00 received via {selectedMethod}. Unlocking your charging locker now...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
