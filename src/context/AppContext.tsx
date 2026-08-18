import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_CUSTOMERS,
  INITIAL_EVENTS,
  INITIAL_INVENTORY,
  INITIAL_QUOTES,
  INITIAL_STATIONS,
} from '../data/initialData';
import {
  ChargingStation,
  CustomerRecord,
  EventDeployment,
  InventoryItem,
  PaymentMethod,
  QuoteRequest,
  SlotStatus,
} from '../types';

export type NavTab = 'juice-up' | 'stations' | 'customers' | 'inventory' | 'analytics' | 'deployments' | 'profile';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  stations: ChargingStation[];
  customers: CustomerRecord[];
  inventory: InventoryItem[];
  events: EventDeployment[];
  quotes: QuoteRequest[];
  userActiveSession: CustomerRecord | null;
  selectedStationId: string | null;
  setSelectedStationId: (id: string | null) => void;
  startChargingSession: (data: {
    customerName: string;
    phone: string;
    email: string;
    stationId: string;
    slotNumber: number;
    sessionType: 'locker' | 'powerbank';
    deviceModel: string;
    cableType: any;
    initialBattery: number;
    durationMinutes: number;
    costZAR: number;
    paymentMethod: PaymentMethod;
    lockerPin: string;
    notes?: string;
  }) => CustomerRecord;
  extendChargingSession: (sessionId: string, addMinutes: number, addCostZAR: number, paymentMethod: PaymentMethod) => void;
  endChargingSession: (sessionId: string) => void;
  forceUnlockSlot: (stationId: string, slotNumber: number) => void;
  updateSlotStatus: (stationId: string, slotNumber: number, newStatus: SlotStatus) => void;
  addNewCustomerRecord: (record: Omit<CustomerRecord, 'id'>) => void;
  updateCustomerRecord: (id: string, updates: Partial<CustomerRecord>) => void;
  deleteCustomerRecord: (id: string) => void;
  updateInventoryStock: (itemId: string, field: 'inStorage' | 'inStation' | 'damagedOrNeedsRepair', delta: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastAudited'>) => void;
  addStation: (station: ChargingStation) => void;
  addEventDeployment: (event: Omit<EventDeployment, 'id'>) => void;
  submitQuoteRequest: (quote: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => void;
  setUserActiveSession: (session: CustomerRecord | null) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STATIONS: 'bincharge_stations_v1',
  CUSTOMERS: 'bincharge_customers_v1',
  INVENTORY: 'bincharge_inventory_v1',
  EVENTS: 'bincharge_events_v1',
  QUOTES: 'bincharge_quotes_v1',
  USER_SESSION: 'bincharge_active_session_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('juice-up');
  const [selectedStationId, setSelectedStationId] = useState<string | null>('STN-JHB-01');

  const [stations, setStations] = useState<ChargingStation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATIONS);
      return saved ? JSON.parse(saved) : INITIAL_STATIONS;
    } catch {
      return INITIAL_STATIONS;
    }
  });

  const [customers, setCustomers] = useState<CustomerRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [events, setEvents] = useState<EventDeployment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUOTES);
      return saved ? JSON.parse(saved) : INITIAL_QUOTES;
    } catch {
      return INITIAL_QUOTES;
    }
  });

  const [userActiveSession, setUserActiveSession] = useState<CustomerRecord | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
      if (saved) return JSON.parse(saved);
      // default to first active session if available
      const active = INITIAL_CUSTOMERS.find((c) => c.status === 'active');
      return active || null;
    } catch {
      return null;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(stations));
    } catch (e) {
      console.error(e);
    }
  }, [stations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.error(e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    } catch (e) {
      console.error(e);
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
    } catch (e) {
      console.error(e);
    }
  }, [quotes]);

  useEffect(() => {
    try {
      if (userActiveSession) {
        localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(userActiveSession));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
      }
    } catch (e) {
      console.error(e);
    }
  }, [userActiveSession]);

  // Real-time background simulation: battery levels increase, time ticks, slight wattage fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update active customer battery % & remaining time
      setCustomers((prevCustomers) => {
        let changed = false;
        const updated = prevCustomers.map((cust) => {
          if (cust.status === 'active') {
            changed = true;
            const newBattery = Math.min(100, cust.currentBattery + (cust.currentBattery < 80 ? 1 : 0.5));
            const newRemaining = Math.max(0, cust.remainingMinutes - 0.1);
            return {
              ...cust,
              currentBattery: Number(newBattery.toFixed(1)),
              remainingMinutes: Number(newRemaining.toFixed(1)),
              status: newRemaining <= 0 ? ('overdue' as const) : cust.status,
            };
          }
          return cust;
        });

        if (changed && userActiveSession) {
          const fresh = updated.find((c) => c.id === userActiveSession.id);
          if (fresh) {
            setUserActiveSession(fresh);
          }
        }

        return changed ? updated : prevCustomers;
      });

      // 2. Telemetry fluctuations for stations
      setStations((prev) =>
        prev.map((stn) => {
          if (stn.status === 'online' || stn.status === 'busy') {
            const baseWatt = stn.activeSessions * 45 + 50;
            const jitter = Math.floor((Math.random() - 0.5) * 15);
            return {
              ...stn,
              powerDrawWatts: Math.max(20, baseWatt + jitter),
              temperature: Number((26 + (stn.activeSessions * 0.8) + (Math.random() * 0.4)).toFixed(1)),
            };
          }
          return stn;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [userActiveSession]);

  const startChargingSession = (data: {
    customerName: string;
    phone: string;
    email: string;
    stationId: string;
    slotNumber: number;
    sessionType: 'locker' | 'powerbank';
    deviceModel: string;
    cableType: any;
    initialBattery: number;
    durationMinutes: number;
    costZAR: number;
    paymentMethod: PaymentMethod;
    lockerPin: string;
    notes?: string;
  }) => {
    const station = stations.find((s) => s.id === data.stationId);
    const stationName = station ? station.name : 'B-in Charge Mobile Station';
    const eventName = station ? station.eventName : 'Live Event';
    const newId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord: CustomerRecord = {
      id: newId,
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      stationId: data.stationId,
      stationName,
      eventName,
      slotNumber: data.slotNumber,
      sessionType: data.sessionType,
      deviceModel: data.deviceModel,
      cableType: data.cableType,
      initialBattery: data.initialBattery,
      currentBattery: data.initialBattery,
      targetBattery: Math.min(100, data.initialBattery + 65),
      startTime: new Date().toISOString(),
      durationMinutes: data.durationMinutes,
      remainingMinutes: data.durationMinutes,
      costZAR: data.costZAR,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'paid',
      lockerPin: data.lockerPin,
      status: 'active',
      notes: data.notes || `Booked via B-in Charge portal. Payment confirmed via ${data.paymentMethod}.`,
    };

    // Update customer list
    setCustomers((prev) => [newRecord, ...prev]);
    setUserActiveSession(newRecord);

    // Update station slots
    setStations((prevStations) =>
      prevStations.map((stn) => {
        if (stn.id === data.stationId) {
          const updatedSlots = stn.slots.map((slot) => {
            if (slot.slotNumber === data.slotNumber) {
              return {
                ...slot,
                status: 'charging' as SlotStatus,
                currentSessionId: newId,
                deviceModel: data.deviceModel,
                batteryPercent: data.initialBattery,
                customerName: data.customerName,
                customerPhone: data.phone,
                timeRemainingMinutes: data.durationMinutes,
                lockerPinCode: data.lockerPin,
              };
            }
            return slot;
          });

          const activeCount = updatedSlots.filter((s) => s.status === 'charging' || s.status === 'reserved').length;
          const availCount = updatedSlots.filter((s) => s.status === 'available').length;

          return {
            ...stn,
            slots: updatedSlots,
            activeSessions: activeCount,
            availableSlots: availCount,
            status: availCount === 0 ? 'busy' : 'online',
          };
        }
        return stn;
      })
    );

    // Update inventory (increment inStation / in-use, decrement inStorage)
    setInventory((prevInv) =>
      prevInv.map((inv) => {
        if (data.sessionType === 'powerbank' && inv.category === 'powerbanks') {
          return {
            ...inv,
            inStation: Math.min(inv.totalStock, inv.inStation + 1),
            inStorage: Math.max(0, inv.inStorage - 1),
          };
        }
        return inv;
      })
    );

    // Trigger celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FBBF24', '#000000', '#F3F4F6'],
      });
    } catch {
      // ignore
    }

    return newRecord;
  };

  const extendChargingSession = (sessionId: string, addMinutes: number, addCostZAR: number, paymentMethod: PaymentMethod) => {
    setCustomers((prev) =>
      prev.map((cust) => {
        if (cust.id === sessionId) {
          const updated = {
            ...cust,
            durationMinutes: cust.durationMinutes + addMinutes,
            remainingMinutes: cust.remainingMinutes + addMinutes,
            costZAR: cust.costZAR + addCostZAR,
            status: 'active' as const,
            notes: `${cust.notes || ''} | Extended +${addMinutes}m (R${addCostZAR} via ${paymentMethod})`,
          };
          if (userActiveSession?.id === sessionId) {
            setUserActiveSession(updated);
          }
          return updated;
        }
        return cust;
      })
    );

    // Update station slot timer
    setStations((prev) =>
      prev.map((stn) => ({
        ...stn,
        slots: stn.slots.map((slot) => {
          if (slot.currentSessionId === sessionId) {
            return {
              ...slot,
              timeRemainingMinutes: (slot.timeRemainingMinutes || 0) + addMinutes,
            };
          }
          return slot;
        }),
      }))
    );

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        colors: ['#F59E0B', '#10B981'],
      });
    } catch {
      // ignore
    }
  };

  const endChargingSession = (sessionId: string) => {
    let sessionStationId = '';
    let sessionSlotNum = 0;

    setCustomers((prev) =>
      prev.map((cust) => {
        if (cust.id === sessionId) {
          sessionStationId = cust.stationId;
          sessionSlotNum = cust.slotNumber;
          return {
            ...cust,
            status: 'completed',
            endTime: new Date().toISOString(),
            remainingMinutes: 0,
          };
        }
        return cust;
      })
    );

    // Clear station slot
    if (sessionStationId) {
      setStations((prev) =>
        prev.map((stn) => {
          if (stn.id === sessionStationId) {
            const updatedSlots = stn.slots.map((slot) => {
              if (slot.slotNumber === sessionSlotNum || slot.currentSessionId === sessionId) {
                return {
                  ...slot,
                  status: 'available' as SlotStatus,
                  currentSessionId: undefined,
                  deviceModel: undefined,
                  batteryPercent: undefined,
                  customerName: undefined,
                  customerPhone: undefined,
                  timeRemainingMinutes: undefined,
                  lockerPinCode: undefined,
                };
              }
              return slot;
            });

            const activeCount = updatedSlots.filter((s) => s.status === 'charging' || s.status === 'reserved').length;
            const availCount = updatedSlots.filter((s) => s.status === 'available').length;

            return {
              ...stn,
              slots: updatedSlots,
              activeSessions: activeCount,
              availableSlots: availCount,
              status: 'online',
            };
          }
          return stn;
        })
      );
    }

    if (userActiveSession?.id === sessionId) {
      setUserActiveSession(null);
    }
  };

  const forceUnlockSlot = (stationId: string, slotNumber: number) => {
    setStations((prev) =>
      prev.map((stn) => {
        if (stn.id === stationId) {
          const updatedSlots = stn.slots.map((slot) => {
            if (slot.slotNumber === slotNumber) {
              return {
                ...slot,
                status: 'available' as SlotStatus,
                currentSessionId: undefined,
                deviceModel: undefined,
                batteryPercent: undefined,
                customerName: undefined,
                customerPhone: undefined,
                timeRemainingMinutes: undefined,
                lockerPinCode: undefined,
              };
            }
            return slot;
          });

          const activeCount = updatedSlots.filter((s) => s.status === 'charging' || s.status === 'reserved').length;
          const availCount = updatedSlots.filter((s) => s.status === 'available').length;

          return {
            ...stn,
            slots: updatedSlots,
            activeSessions: activeCount,
            availableSlots: availCount,
          };
        }
        return stn;
      })
    );
  };

  const updateSlotStatus = (stationId: string, slotNumber: number, newStatus: SlotStatus) => {
    setStations((prev) =>
      prev.map((stn) => {
        if (stn.id === stationId) {
          const updatedSlots = stn.slots.map((slot) => {
            if (slot.slotNumber === slotNumber) {
              return {
                ...slot,
                status: newStatus,
              };
            }
            return slot;
          });

          const activeCount = updatedSlots.filter((s) => s.status === 'charging' || s.status === 'reserved').length;
          const availCount = updatedSlots.filter((s) => s.status === 'available').length;

          return {
            ...stn,
            slots: updatedSlots,
            activeSessions: activeCount,
            availableSlots: availCount,
          };
        }
        return stn;
      })
    );
  };

  const addNewCustomerRecord = (record: Omit<CustomerRecord, 'id'>) => {
    const newId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullRecord: CustomerRecord = {
      ...record,
      id: newId,
    };
    setCustomers((prev) => [fullRecord, ...prev]);
  };

  const updateCustomerRecord = (id: string, updates: Partial<CustomerRecord>) => {
    setCustomers((prev) =>
      prev.map((cust) => (cust.id === id ? { ...cust, ...updates } : cust))
    );
    if (userActiveSession?.id === id) {
      setUserActiveSession((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteCustomerRecord = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    if (userActiveSession?.id === id) {
      setUserActiveSession(null);
    }
  };

  const updateInventoryStock = (itemId: string, field: 'inStorage' | 'inStation' | 'damagedOrNeedsRepair', delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const currentVal = item[field];
          const newVal = Math.max(0, currentVal + delta);
          const totalStock = field === 'inStorage'
            ? newVal + item.inStation + item.damagedOrNeedsRepair
            : field === 'inStation'
            ? item.inStorage + newVal + item.damagedOrNeedsRepair
            : item.inStorage + item.inStation + newVal;

          return {
            ...item,
            [field]: newVal,
            totalStock,
            lastAudited: new Date().toISOString().split('T')[0],
          };
        }
        return item;
      })
    );
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'lastAudited'>) => {
    const newId = `INV-NEW-${Date.now().toString().slice(-4)}`;
    const newItem: InventoryItem = {
      ...item,
      id: newId,
      lastAudited: new Date().toISOString().split('T')[0],
    };
    setInventory((prev) => [newItem, ...prev]);
  };

  const addStation = (station: ChargingStation) => {
    setStations((prev) => [...prev, station]);
  };

  const addEventDeployment = (event: Omit<EventDeployment, 'id'>) => {
    const newId = `EVT-00${events.length + 1}`;
    setEvents((prev) => [{ ...event, id: newId }, ...prev]);
  };

  const submitQuoteRequest = (quote: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => {
    const newId = `QT-2026-0${quotes.length + 1}`;
    const newQuote: QuoteRequest = {
      ...quote,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    setQuotes((prev) => [newQuote, ...prev]);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        colors: ['#F59E0B', '#EAB308', '#111827'],
      });
    } catch {
      // ignore
    }
  };

  const resetToDemoData = () => {
    setStations(INITIAL_STATIONS);
    setCustomers(INITIAL_CUSTOMERS);
    setInventory(INITIAL_INVENTORY);
    setEvents(INITIAL_EVENTS);
    setQuotes(INITIAL_QUOTES);
    setUserActiveSession(INITIAL_CUSTOMERS.find((c) => c.status === 'active') || null);
    localStorage.removeItem(STORAGE_KEYS.STATIONS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.QUOTES);
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        stations,
        customers,
        inventory,
        events,
        quotes,
        userActiveSession,
        selectedStationId,
        setSelectedStationId,
        startChargingSession,
        extendChargingSession,
        endChargingSession,
        forceUnlockSlot,
        updateSlotStatus,
        addNewCustomerRecord,
        updateCustomerRecord,
        deleteCustomerRecord,
        updateInventoryStock,
        addInventoryItem,
        addStation,
        addEventDeployment,
        submitQuoteRequest,
        setUserActiveSession,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
