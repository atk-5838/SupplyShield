import React, { useState } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import {
  Factory,
  Boxes,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const FactoryDashboard: React.FC = () => {
  const {
    nodes,
    shipments,
    requestMaterialsFromSupplier,
    updateFactoryProductionRate,
    disruption,
    addToast,
  } = useSupplyChain();

  // Find our factory node: fac-01 Central Precision Works
  const myNode = nodes.find((n) => n.id === 'fac-01') || nodes.find((n) => n.role === 'factory') || nodes[0];

  const [productionRate, setProductionRate] = useState<number>(myNode.capacityPercent || 88);
  const [isUpdatingProd, setIsUpdatingProd] = useState(false);
  const [showRequisitionModal, setShowRequisitionModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState('sup-02');
  const [materialQty, setMaterialQty] = useState(300);
  const [materialItem, setMaterialItem] = useState('Micro-Controller Logic Units');

  const incomingShipments = shipments.filter(
    (s) => s.factoryId === myNode.id || s.currentNodeId === myNode.id || s.id === 'SS1024' || s.id === 'SS1025'
  );

  const availableSuppliers = nodes.filter((n) => n.role === 'supplier');

  const handleProductionSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFactoryProductionRate(myNode.id, productionRate);
    setIsUpdatingProd(false);
  };

  const handleRequisitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestMaterialsFromSupplier(myNode.id, selectedSupplierId, materialItem, materialQty);
    setShowRequisitionModal(false);
  };

  const isProductionAtRisk = disruption?.isActive || disruption?.targetNodeId === 'sup-01' || disruption?.targetNodeId === 'war-01';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            Manufacturing & Assembly Plant
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {myNode.name}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Facility: {myNode.location} · 6 Active Assembly Lines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUpdatingProd(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Activity className="w-4 h-4" />
            <span>Update Production</span>
          </button>
          <button
            onClick={() => setShowRequisitionModal(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Boxes className="w-4 h-4" />
            <span>Request Materials</span>
          </button>
        </div>
      </div>

      {/* Production Risk Banner required by spec */}
      {isProductionAtRisk && (
        <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-800 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                  PRODUCTION RISK DETECTED
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-rose-200/80 text-rose-900 font-semibold">
                  Buffer Threatened
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-1 font-medium">
                "Supplier A / Outbound Highway is unavailable. Your raw material supply and outgoing orders may be affected."
              </p>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-rose-900/90 pt-2 border-t border-rose-200/60">
                <div>
                  <span className="text-[11px] text-rose-600 block">Affected Material</span>
                  <span className="font-semibold">Titanium Micro-Actuators</span>
                </div>
                <div>
                  <span className="text-[11px] text-rose-600 block">Available Stock</span>
                  <span className="font-semibold tabular-nums">48 hours buffer remaining</span>
                </div>
                <div>
                  <span className="text-[11px] text-rose-600 block">Estimated Impact</span>
                  <span className="font-semibold text-rose-700">Line 3 assembly stall</span>
                </div>
                <div>
                  <span className="text-[11px] text-rose-600 block">Expected Delay</span>
                  <span className="font-semibold tabular-nums">+2.4 hours</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowRequisitionModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shrink-0 shadow-sm"
          >
            Request Alternative Supply
          </button>
        </div>
      )}

      {/* Key Metric Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Factory Status</span>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-xl font-bold tracking-tight ${
                isProductionAtRisk ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {isProductionAtRisk ? 'PRODUCTION AT RISK' : 'RUNNING'}
            </span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">Continuous manufacturing active</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Production Output</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {myNode.capacityPercent || productionRate}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">Optimal speed</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="h-1.5 rounded-full bg-indigo-600"
              style={{ width: `${myNode.capacityPercent || productionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Raw Material Availability</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {myNode.inventoryPercent || 82}%
            </span>
            <span className="text-xs text-slate-600">6 Day Reserve</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${
                (myNode.inventoryPercent || 82) < 40 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${myNode.inventoryPercent || 82}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Incoming Shipments</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold text-slate-900 tabular-nums">7 batches</span>
            <span className="text-xs text-blue-600 font-medium">In Transit</span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">Expected by 6:00 PM today</span>
        </div>
      </div>

      {/* Raw Material Inventory & Incoming Supplies Table */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Incoming Supply Shipments</h3>
              <p className="text-xs text-slate-600">Raw parts arriving from regional suppliers</p>
            </div>
            <button
              onClick={() => setShowRequisitionModal(true)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              + Place Material Order
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-600 font-medium">
                  <th className="pb-2.5">Manifest</th>
                  <th className="pb-2.5">Material Description</th>
                  <th className="pb-2.5">Supplier Origin</th>
                  <th className="pb-2.5 text-right">Units</th>
                  <th className="pb-2.5 text-center">Arrival Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incomingShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="py-3 font-semibold text-slate-900">{s.id}</td>
                    <td className="py-3 font-medium text-slate-800">{s.itemDescription}</td>
                    <td className="py-3 text-slate-600">
                      {nodes.find((n) => n.id === s.supplierId)?.name || 'Apex Metals'}
                    </td>
                    <td className="py-3 text-right tabular-nums font-semibold text-slate-800">
                      {s.quantityUnits}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          s.status === 'delayed'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {s.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current Buffer Material Storage */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">On-Site Buffer Silos</h3>
            <p className="text-xs text-slate-600 mb-4">Stocked parts ready for assembly lines</p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>Titanium Billets (Batch A)</span>
                  <span className="text-emerald-600 tabular-nums">92%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>Microcontroller PCBs (Batch C)</span>
                  <span className="text-indigo-600 tabular-nums">85%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>Polymer O-Rings (Batch D)</span>
                  <span className="text-amber-600 tabular-nums">64%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '64%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => addToast('Safety Check Complete', 'All 6 assembly lines cleared for continuous shift.', 'info')}
              className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Run Plant Diagnostics
            </button>
          </div>
        </div>
      </div>

      {/* Production Rate Modal */}
      {isUpdatingProd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold mb-2">Adjust Production Speed</h3>
            <p className="text-xs text-slate-600 mb-4">
              Set line speed capacity for {myNode.name}.
            </p>

            <form onSubmit={handleProductionSave} className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Production Line Capacity:</span>
                  <span className="text-indigo-600 font-bold tabular-nums">{productionRate}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={productionRate}
                  onChange={(e) => setProductionRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUpdatingProd(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  Save Capacity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Materials Modal */}
      {showRequisitionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold mb-1">Request Raw Materials</h3>
            <p className="text-xs text-slate-600 mb-4">
              Submit an expedited requisition to connected or alternative suppliers.
            </p>

            <form onSubmit={handleRequisitionSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Supplier</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {availableSuppliers.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name} ({sup.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Material Name</label>
                <input
                  type="text"
                  value={materialItem}
                  onChange={(e) => setMaterialItem(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity Units</label>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  value={materialQty}
                  onChange={(e) => setMaterialQty(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequisitionModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
