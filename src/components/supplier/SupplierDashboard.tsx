import React, { useState } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import {
  Boxes,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Building2,
  TrendingUp,
  RefreshCw,
  Plus,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

export const SupplierDashboard: React.FC = () => {
  const {
    nodes,
    shipments,
    updateSupplierInventory,
    reportSupplierShortage,
    disruption,
    addToast,
  } = useSupplyChain();

  // Find our supplier node: sup-01 Apex Metals
  const myNode = nodes.find((n) => n.id === 'sup-01') || nodes[0];
  const [stockLevel, setStockLevel] = useState<number>(myNode.inventoryPercent || 82);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [showShortageModal, setShowShortageModal] = useState(false);
  const [materialName, setMaterialName] = useState('Titanium Alloy Rods');
  const [shortageReason, setShortageReason] = useState('Smelter furnace refractory maintenance delay');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Active supplier orders
  const supplierShipments = shipments.filter(
    (s) => s.supplierId === myNode.id || s.id === 'SS1024' || s.id === 'SS1030'
  );

  const connectedFactories = nodes.filter((n) =>
    myNode.connectedNodeIds.includes(n.id) || ['fac-01', 'fac-02'].includes(n.id)
  );

  const handleStockSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupplierInventory(myNode.id, stockLevel);
    setIsUpdatingStock(false);
  };

  const handleShortageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportSupplierShortage(myNode.id, materialName, shortageReason);
    setShowShortageModal(false);
  };

  const hasSupplyIssue = disruption?.isActive || (myNode.inventoryPercent || 82) < 40;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Inbound Material Partner
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {myNode.name} Portal
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Location: {myNode.location} · Connected to {connectedFactories.length} Manufacturing Plants
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUpdatingStock(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Boxes className="w-4 h-4" />
            <span>Update Inventory</span>
          </button>
          <button
            onClick={() => setShowShortageModal(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Shortage</span>
          </button>
        </div>
      </div>

      {/* Disruption Warning Banner required by spec */}
      {hasSupplyIssue && (
        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  SUPPLY ISSUE DETECTED
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 font-semibold">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Your supply may affect the production schedule of connected factories (Central Precision Works & Highland Automotive).
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDetailsModal(true)}
            className="px-4 py-2 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-lg transition-colors shrink-0"
          >
            View Details
          </button>
        </div>
      )}

      {/* Key Metric Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Supply Status</span>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-xl font-bold tracking-tight ${
                hasSupplyIssue ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {hasSupplyIssue ? 'ATTENTION' : 'NORMAL'}
            </span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">Output within buffer targets</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Available Inventory</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {myNode.inventoryPercent || stockLevel}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">+4% this week</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${
                (myNode.inventoryPercent || stockLevel) < 30 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${myNode.inventoryPercent || stockLevel}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Active Orders</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {supplierShipments.length + 9}
            </span>
            <span className="text-xs text-slate-600">3 dispatching today</span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">Includes Hero Batch #SS1024</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Next Scheduled Delivery</span>
          <div className="flex items-center gap-1.5 mt-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xl font-bold text-slate-900 tabular-nums">4:30 PM</span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">Truck MH-04-TRK-401 to Bhiwandi</span>
        </div>
      </div>

      {/* Main Content Grid: Active Orders & Connected Factories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Active Orders List (2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Supply Orders & Dispatches</h3>
              <p className="text-xs text-slate-600">Real-time status of outgoing production shipments</p>
            </div>
            <span className="text-xs text-slate-600 tabular-nums">{supplierShipments.length} Orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-600 font-medium">
                  <th className="pb-2.5">Order ID</th>
                  <th className="pb-2.5">Material Description</th>
                  <th className="pb-2.5 text-right">Quantity</th>
                  <th className="pb-2.5">Destination</th>
                  <th className="pb-2.5 text-center">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplierShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">{s.id}</td>
                    <td className="py-3">
                      <span className="font-medium text-slate-800 block truncate max-w-[200px]">
                        {s.itemDescription}
                      </span>
                      <span className="text-[10px] text-slate-600">{s.trackingNumber}</span>
                    </td>
                    <td className="py-3 text-right tabular-nums font-medium text-slate-700">
                      {s.quantityUnits} units
                    </td>
                    <td className="py-3 text-slate-600 truncate max-w-[150px]">{s.destinationName}</td>
                    <td className="py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          s.status === 'delayed'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : s.status === 'rerouted'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {s.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => addToast('Order Confirmed', `Manifest for ${s.id} updated with carrier`, 'info')}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                      >
                        Confirm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Connected Factories & Material Delivery Schedules (1 column) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Connected Manufacturing Facilities</h3>
            <p className="text-xs text-slate-600 mb-4">Contractual demand lines and replenishment status</p>

            <div className="space-y-3">
              {connectedFactories.map((fac) => (
                <div key={fac.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">{fac.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                      Operational
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{fac.location}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                    <span>Buffer Stock:</span>
                    <span className="font-semibold text-slate-800 tabular-nums">{fac.inventoryPercent || 82}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-2">
              Upcoming Scheduled Intakes
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span>Batch A-4 (Chakan Auto)</span>
                <span className="font-mono text-slate-500">Today, 4:30 PM</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Batch B-1 (Chennai Tech)</span>
                <span className="font-mono text-slate-500">Tomorrow, 10:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Inventory Modal */}
      {isUpdatingStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold mb-2">Update Available Stock</h3>
            <p className="text-xs text-slate-600 mb-4">
              Enter current warehouse stockpile percentage for {myNode.name}.
            </p>

            <form onSubmit={handleStockSave} className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Available Inventory Level:</span>
                  <span className="text-emerald-600 font-bold tabular-nums">{stockLevel}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={stockLevel}
                  onChange={(e) => setStockLevel(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUpdatingStock(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                >
                  Save Stock Level
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Problem / Shortage Modal */}
      {showShortageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold text-rose-700 mb-1">Report Supply Shortage</h3>
            <p className="text-xs text-slate-600 mb-4">
              This will notify connected factories and logistics dispatchers so buffer schedules can be recalibrated.
            </p>

            <form onSubmit={handleShortageSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Affected Material</label>
                <input
                  type="text"
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cause / Details</label>
                <textarea
                  rows={3}
                  value={shortageReason}
                  onChange={(e) => setShortageReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowShortageModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                >
                  Dispatch Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disruption Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold mb-2">Supply Disruption Details</h3>
            <p className="text-xs text-slate-600 mb-4">
              Current network state indicates an interruption along the corridor between Northern Warehouse and Hub Delta.
            </p>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Affected Destination:</span>
                <span className="font-semibold text-slate-900">Hub Delta Freight Junction</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Connected Factor:</span>
                <span className="font-semibold text-slate-900">Central Precision Works</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Estimated Delay:</span>
                <span className="font-semibold text-amber-700">+2.4 hours</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
