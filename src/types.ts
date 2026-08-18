export type Province = 'Gauteng' | 'Western Cape' | 'KwaZulu-Natal' | 'Free State' | 'Eastern Cape' | 'Mpumalanga';

export type SlotStatus = 'available' | 'charging' | 'reserved' | 'maintenance' | 'offline';
export type StationStatus = 'online' | 'busy' | 'offline' | 'maintenance';
export type StationType = '8-Locker Tower' | '16-Locker Kiosk' | '24-Bay Power Bank Hub' | 'Tabletop Bar Pod' | 'Solar Mobile Kiosk';

export type CableType = 'Lightning' | 'USB-C' | 'Micro-USB' | 'Qi Wireless' | 'Dual (Type-C + Lightning)';

export interface StationSlot {
  id: string;
  slotNumber: number;
  status: SlotStatus;
  cableType: CableType;
  powerOutput: string;
  currentSessionId?: string;
  deviceModel?: string;
  batteryPercent?: number;
  customerName?: string;
  customerPhone?: string;
  timeRemainingMinutes?: number;
  lockerPinCode?: string;
  slotTemp?: number;
}

export interface ChargingStation {
  id: string;
  name: string;
  eventName: string;
  location: string;
  venueArea: string;
  province: Province;
  type: StationType;
  totalSlots: number;
  availableSlots: number;
  activeSessions: number;
  status: StationStatus;
  slots: StationSlot[];
  powerDrawWatts: number;
  temperature: number;
  voltage: number;
  lastPing: string;
  hourlyRateZAR: number;
  powerBankDepositZAR?: number;
  supportsPowerBankRental: boolean;
  qrCodeData: string;
  operatorNotes?: string;
}

export type SessionType = 'locker' | 'powerbank';
export type SessionStatus = 'active' | 'completed' | 'overdue' | 'cancelled';
export type PaymentMethod = 'Ozow' | 'PayFast' | 'SnapScan' | 'Zapper' | 'CapitecPay' | 'Card' | 'Cash';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';

export interface CustomerRecord {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  stationId: string;
  stationName: string;
  eventName: string;
  slotNumber: number;
  sessionType: SessionType;
  deviceModel: string;
  cableType: CableType;
  initialBattery: number;
  currentBattery: number;
  targetBattery: number;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  remainingMinutes: number;
  costZAR: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  lockerPin: string;
  status: SessionStatus;
  notes?: string;
}

export type InventoryCategory = 'cables' | 'powerbanks' | 'hardware' | 'chargers' | 'safety';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  totalStock: number;
  inStation: number;
  inStorage: number;
  damagedOrNeedsRepair: number;
  minimumThreshold: number;
  costPerUnitZAR: number;
  healthGrade: 'A (95%+)' | 'B (80-94%)' | 'C (Needs Service)';
  sku: string;
  lastAudited: string;
}

export interface EventDeployment {
  id: string;
  eventName: string;
  venue: string;
  city: string;
  province: Province;
  startDate: string;
  endDate: string;
  assignedStations: string[];
  expectedAttendees: number;
  status: 'active' | 'upcoming' | 'completed';
  organizerContact: string;
  revenueTargetZAR: number;
}

export interface QuoteRequest {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  eventType: string;
  stationCount: number;
  expectedDate: string;
  location: string;
  brandingRequested: boolean;
  notes?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'quoted';
}
