import React, { useState } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import {
  Building2,
  Truck,
  Send,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Clock,
  Navigation,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  CornerDownRight,
} from 'lucide-react';

export const HubDashboard: React.FC = () => {
  const {
    nodes,
    shipments,
    drivers,
    assignDriverToShipment,
    approveAlternativeRoute,
    disruption,
    recoveryPlan,
    addToast,
  } = useSupplyChain();

  // Find our hub node: hub-04 Hub Delta (or default)
  const myNode = nodes.find((n) => n.id === 'hub-04') || nodes.find((n) => n.role === 'hub') || nodes[0];

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('SS1024');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('drv-02');
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'drivers' | 'routes'>('incoming');

  const availableDrivers = drivers.filter(
    (d) => d.status === 'available' || d.assignedHubId === myNode.id
  );

  const arrivingShipments = shipments.filter(
    (s) => s.hubId === myNode.id || s.currentNodeId === 'war-01' || s.id === 'SS1024'
  );

  const departingShipments = shipments.filter(
    (s) => s.hubId === myNode.id && s.milestones.hub
  );

  const delayedShipmentsCount = shipments.filter(
    (s) => s.status === 'delayed' && (s.hubId === myNode.id || s.currentNodeId === 'war-01')
  ).length;

  const handleAssignDriver = (e: React.FormEvent) => {
    e.preventDefault();
    assignDriverToShipment(myNode.id, selectedShipmentId, selectedDriverId);
    setShowAssignModal(false);
  };

  const isHubAlertActive = disruption?.isActive || delayedShipmentsCount > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wider">
            Regional Freight Logistics Junction
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {myNode.name} Dispatch Console
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Zone: {myNode.location} · Serving 6 Connected Metropolitan Customer Regions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAssignModal(true)}
            className="px-4 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <UserCheck className="w-4 h-4" />
            <span>Assign Driver</span>
          </button>
          <button
            onClick={() => addToast('Corridor Monitored', 'All 5 outbound freight lanes evaluated.', 'info')}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Navigation className="w-4 h-4" />
            <span>View Routes</span>
          </button>
        </div>
      </div>

      {/* Breakdown or Recovery Approval Alert Banner */}
      {disruption?.isActive && (
        <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-800 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block">
                CORRIDOR DISRUPTION REPORTED BY DRIVER
              </span>
              <p className="text-xs text-rose-800 mt-1 font-medium">
                {disruption.reason}. Shipment #SS1024 delayed on Northern Highway link to Hub Delta.
              </p>
              {recoveryPlan && !recoveryPlan.approved && (
                <div className="mt-2 text-xs text-rose-900 bg-white/70 p-2 rounded border border-rose-200">
                  <span className="font-bold">Algorithmic Recovery Calculated: </span>
                  Bypass via {recoveryPlan.alternativePathNames.join(' → ')} (+{recoveryPlan.additionalHours} hrs)
                </div>
              )}
            </div>
          </div>

          {recoveryPlan && !recoveryPlan.approved ? (
            <button
              onClick={approveAlternativeRoute}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shrink-0 shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Alternative Route</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 text-xs font-semibold rounded bg-rose-100 text-rose-800 shrink-0">
              Admin Reroute In Progress
            </span>
          )}
        </div>
      )}

      {/* Hub Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Hub Status</span>
          <div className="mt-2">
            <span
              className={`text-xl font-bold tracking-tight ${
                isHubAlertActive ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {isHubAlertActive ? 'CONGESTED' : 'NORMAL'}
            </span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">Cross-dock bay efficiency 94%</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Arriving Shipments</span>
          <div className="flex items-center gap-1.5 mt-2">
            <Truck className="w-4 h-4 text-cyan-600" />
            <span className="text-xl font-bold text-slate-900 tabular-nums">12</span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">From North & West Warehouses</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Departing Shipments</span>
          <div className="flex items-center gap-1.5 mt-2">
            <Send className="w-4 h-4 text-blue-600" />
            <span className="text-xl font-bold text-slate-900 tabular-nums">9</span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">Last-mile dispatch queues</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Active Drivers</span>
          <div className="flex items-center gap-1.5 mt-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xl font-bold text-slate-900 tabular-nums">8 registered</span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">3 available for dispatch</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Delayed Shipments</span>
          <div className="flex items-center gap-1.5 mt-2">
            <Clock className="w-4 h-4 text-rose-600" />
            <span
              className={`text-xl font-bold tabular-nums ${
                delayedShipmentsCount > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {delayedShipmentsCount || 2}
            </span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">Under rerouting recovery</span>
        </div>
      </div>

      {/* Tabs for Incoming / Outgoing / Drivers / Routes */}
      <div className="mt-8">
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg w-fit mb-4">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'incoming'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Incoming Manifests ({arrivingShipments.length})
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'drivers'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registered Drivers ({drivers.length})
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'outgoing'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer Dispatches
          </button>
        </div>

        {/* Tab 1: Incoming Shipments */}
        {activeTab === 'incoming' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Incoming Freight Corridors</h3>
                <p className="text-xs text-slate-600">Shipments currently en route to Hub Delta</p>
              </div>
              <button
                onClick={() => setShowAssignModal(true)}
                className="text-xs font-semibold text-cyan-600 hover:text-cyan-800"
              >
                + Assign Driver to Staged Freight
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-600 font-medium">
                    <th className="pb-2.5">Order ID</th>
                    <th className="pb-2.5">Cargo Manifest</th>
                    <th className="pb-2.5">Origin Warehouse</th>
                    <th className="pb-2.5">Assigned Carrier</th>
                    <th className="pb-2.5">Original / Live ETA</th>
                    <th className="pb-2.5 text-center">Disruption Status</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {arrivingShipments.map((s) => {
                    const assignedDriver = drivers.find((d) => d.id === s.driverId);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/70">
                        <td className="py-3 font-semibold text-slate-900">{s.id}</td>
                        <td className="py-3">
                          <span className="font-medium text-slate-800 block truncate max-w-[200px]">
                            {s.itemDescription}
                          </span>
                          <span className="text-[10px] text-slate-600">{s.customerName}</span>
                        </td>
                        <td className="py-3 text-slate-600">
                          {nodes.find((n) => n.id === s.warehouseId)?.name || 'North Warehouse'}
                        </td>
                        <td className="py-3">
                          {assignedDriver ? (
                            <span className="text-xs font-medium text-slate-800">
                              {assignedDriver.name} ({assignedDriver.vehicleNumber})
                            </span>
                          ) : (
                            <span className="text-[11px] text-amber-600 font-semibold">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 tabular-nums">
                          <span className="block text-slate-800 font-medium">
                            {s.updatedEta || s.originalEta}
                          </span>
                          {s.updatedEta && (
                            <span className="text-[10px] text-rose-600 font-semibold">Recalculated</span>
                          )}
                        </td>
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
                            {s.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedShipmentId(s.id);
                              setShowAssignModal(true);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-cyan-700 hover:bg-cyan-50 rounded border border-cyan-200 transition-colors"
                          >
                            {s.driverId ? 'Reassign' : 'Assign'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Registered Drivers */}
        {activeTab === 'drivers' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Registered Carrier Fleet</h3>
            <p className="text-xs text-slate-600 mb-4">Real-time driver roster and availability status</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {drivers.map((drv) => (
                <div key={drv.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-900">{drv.name}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                        drv.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : drv.status === 'breakdown'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {drv.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono">{drv.vehicleNumber}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{drv.phone}</p>

                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Current Step:</span>
                    <span className="font-semibold text-slate-700 capitalize">
                      {drv.currentStep.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Outgoing Dispatches */}
        {activeTab === 'outgoing' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Last-Mile Customer Dispatches</h3>
            <p className="text-xs text-slate-600 mb-4">Outbound delivery routes to end destinations</p>
            <div className="space-y-3">
              {shipments.slice(0, 4).map((s) => (
                <div key={s.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{s.id}</span>
                    <span className="text-slate-600 ml-2">{s.destinationName}</span>
                  </div>
                  <span className="text-slate-500 tabular-nums">{s.originalEta}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Driver Assignment Modal (Critical feature from prompt) */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-slate-900 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-5 h-5 text-cyan-600" />
              <h3 className="text-base font-bold">Assign Registered Driver</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Dispatches delivery assignment directly to the driver's mobile dashboard with an in-app notification.
            </p>

            <form onSubmit={handleAssignDriver} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Select Shipment Order
                </label>
                <select
                  value={selectedShipmentId}
                  onChange={(e) => setSelectedShipmentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  {shipments.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.id} - {s.customerName} ({s.quantityUnits} units)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Select Available Registered Driver
                </label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.vehicleNumber}) - {d.status.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200 text-xs text-cyan-900">
                <span className="font-bold">Dispatch Link:</span> Notification will be transmitted to driver's smartphone. Driver will see assignment and pickup instructions.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg shadow-sm"
                >
                  Send Assignment to Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
