import React, { useState } from 'react';
import {
  AlertTriangle,
  Box,
  Minus,
  Package,
  Plus,
  Search,
  Wrench,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InventoryCategory } from '../../types';

export const InventoryView: React.FC = () => {
  const { inventory, updateInventoryStock, addInventoryItem } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // New Item State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<InventoryCategory>('cables');
  const [newInStation, setNewInStation] = useState(20);
  const [newInStorage, setNewInStorage] = useState(30);
  const [newMinThreshold, setNewMinThreshold] = useState(15);
  const [newCostPerUnit, setNewCostPerUnit] = useState(120);
  const [newSku, setNewSku] = useState('BIC-');

  // Summary Metrics
  const totalHardwareItems = inventory.reduce((acc, i) => acc + i.totalStock, 0);
  const deployedInStations = inventory.reduce((acc, i) => acc + i.inStation, 0);
  const reserveInStorage = inventory.reduce((acc, i) => acc + i.inStorage, 0);
  const damagedCount = inventory.reduce((acc, i) => acc + i.damagedOrNeedsRepair, 0);
  const lowStockCount = inventory.filter((i) => i.inStorage <= i.minimumThreshold).length;

  const filteredInventory = inventory.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;

    return matchSearch && matchCat;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addInventoryItem({
      name: newName,
      category: newCategory,
      totalStock: Number(newInStation) + Number(newInStorage),
      inStation: Number(newInStation),
      inStorage: Number(newInStorage),
      damagedOrNeedsRepair: 0,
      minimumThreshold: Number(newMinThreshold),
      costPerUnitZAR: Number(newCostPerUnit),
      healthGrade: 'A (95%+)',
      sku: newSku || `BIC-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    setShowAddItemModal(false);
    setNewName('');
    setNewSku('BIC-');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Overview Top Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Hardware Units
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{totalHardwareItems}</span>
            <Package className="w-4 h-4 text-[#FBBD23]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Active in Stations
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-emerald-600">{deployedInStations}</span>
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Reserve Storage
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{reserveInStorage}</span>
            <Box className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Under Repair
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-rose-600">{damagedCount}</span>
            <Wrench className="w-4 h-4 text-rose-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Restock Alerts
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-bold ${lowStockCount > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
              {lowStockCount} Items
            </span>
            <AlertTriangle className={`w-4 h-4 ${lowStockCount > 0 ? 'text-orange-500' : 'text-slate-400'}`} />
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SKU, cable type, power bank, hardware..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FBBD23] focus:bg-white"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#FBBD23] focus:bg-white"
          >
            <option value="all">All Categories</option>
            <option value="cables">Cables (Type-C, Lightning, Micro)</option>
            <option value="powerbanks">Power Banks (10k mAh)</option>
            <option value="chargers">65W GaN Fast Charger Boards</option>
            <option value="hardware">Smart Lockers &amp; Keypads</option>
            <option value="safety">Surge &amp; Load-Shedding Backup</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddItemModal(true)}
          className="px-4 py-2 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hardware Item</span>
        </button>
      </div>

      {/* Inventory Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => {
          const isLowStock = item.inStorage <= item.minimumThreshold;
          const deployedPercent = Math.round((item.inStation / (item.totalStock || 1)) * 100);

          return (
            <div
              key={item.id}
              className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* SKU and Category Badges */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {item.sku}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.healthGrade.startsWith('A')
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    Grade {item.healthGrade}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Est. Value: R{item.costPerUnitZAR} per unit • Total Asset: R{(item.costPerUnitZAR * item.totalStock).toLocaleString()}
                </p>

                {/* Stock Breakdown Card */}
                <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-50 border border-slate-200 my-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">In Station</span>
                    <span className="font-bold text-emerald-700 font-mono text-base">
                      {item.inStation}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">In Storage</span>
                    <span className={`font-bold font-mono text-base ${isLowStock ? 'text-orange-600' : 'text-slate-900'}`}>
                      {item.inStorage}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Damaged</span>
                    <span className="font-bold text-rose-600 font-mono text-base">
                      {item.damagedOrNeedsRepair}
                    </span>
                  </div>
                </div>

                {/* Visual Ratio Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-slate-500">Station Deployment Ratio</span>
                    <span className="font-mono text-slate-800 font-bold">{deployedPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${deployedPercent}%` }}
                      title={`In Station: ${item.inStation}`}
                    />
                    <div
                      className="h-full bg-[#FBBD23]"
                      style={{ width: `${Math.round((item.inStorage / (item.totalStock || 1)) * 100)}%` }}
                      title={`In Storage: ${item.inStorage}`}
                    />
                    <div
                      className="h-full bg-rose-500"
                      style={{ width: `${Math.round((item.damagedOrNeedsRepair / (item.totalStock || 1)) * 100)}%` }}
                      title={`Damaged: ${item.damagedOrNeedsRepair}`}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions (Adjust Stock) */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Adjust Storage:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateInventoryStock(item.id, 'inStorage', -1)}
                      className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs transition-colors"
                      title="Decrease storage stock"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-slate-900 w-6 text-center text-xs">
                      {item.inStorage}
                    </span>
                    <button
                      onClick={() => updateInventoryStock(item.id, 'inStorage', 1)}
                      className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs transition-colors"
                      title="Increase storage stock"
                    >
                      <Plus className="w-3 h-3 text-[#FBBD23]" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>Min Threshold: {item.minimumThreshold}</span>
                  <span>Audited: {item.lastAudited}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Hardware Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="max-w-md w-full rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Add Inventory Hardware Item
              </h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Item Name / Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 65W GaN Power Module Dual USB-C"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as InventoryCategory)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  >
                    <option value="cables">Cables</option>
                    <option value="powerbanks">Power Banks</option>
                    <option value="chargers">Chargers</option>
                    <option value="hardware">Hardware / Lockers</option>
                    <option value="safety">Safety / Surge</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-xs font-bold focus:border-[#FBBD23]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    In Station Stock
                  </label>
                  <input
                    type="number"
                    value={newInStation}
                    onChange={(e) => setNewInStation(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Storage Stock
                  </label>
                  <input
                    type="number"
                    value={newInStorage}
                    onChange={(e) => setNewInStorage(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Min Alert Threshold
                  </label>
                  <input
                    type="number"
                    value={newMinThreshold}
                    onChange={(e) => setNewMinThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Cost per Unit (ZAR)
                  </label>
                  <input
                    type="number"
                    value={newCostPerUnit}
                    onChange={(e) => setNewCostPerUnit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="flex-1 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
