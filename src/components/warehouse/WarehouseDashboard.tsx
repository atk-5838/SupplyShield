import React, { useState } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import {
  Warehouse,
  QrCode,
  PackageCheck,
  Send,
  Boxes,
  AlertTriangle,
  CheckCircle,
  Truck,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

export const WarehouseDashboard: React.FC = () => {
  const {
    nodes,
    shipments,
    drivers,
    receiveGoodsAtWarehouse,
    dispatchGoodsFromWarehouse,
    updateWarehouseInventory,
    disruption,
    addToast,
  } = useSupplyChain();

  // Find our warehouse node: war-01 North Warehouse (or default)
  const myNode = nodes.find((n) => n.id === 'war-01') || nodes.find((n) => n.role === 'warehouse') || nodes[0];

  const [inventoryLevel, setInventoryLevel] = useState<number>(myNode.inventoryPercent || 78);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);

  // Active intake and dispatch selection
  const [selectedIntakeShipment, setSelectedIntakeShipment] = useState<string>('SS1024');
  const [receivedQty, setReceivedQty] = useState<number>(250);
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);

  const [selectedDispatchShipment, setSelectedDispatchShipment] = useState<string>('SS1024');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('drv-01');

  const incomingShipments = shipments.filter(
    (s) => s.warehouseId === myNode.id || s.currentNodeId === myNode.id || s.status === 'in_transit'
  );

  const outgoingShipments = shipments.filter(
    (s) => s.warehouseId === myNode.id && s.milestones.warehouse && !s.milestones.hub
  );

  const isLowStock = (myNode.inventoryPercent || inventoryLevel) < 30;
  const isFailedOrDisrupted = myNode.status === 'failed' || disruption?.targetNodeId === myNode.id;

  const handleSimulateScan = () => {
    setIsScanningBarcode(true);
    setTimeout(() => {
      setIsScanningBarcode(false);
      addToast('Barcode Scanned', 'Manifest #SS1024-DEL-IND verified with optical scanner.', 'success');
    }, 1200);
  };

  const handleConfirmReceive = () => {
    receiveGoodsAtWarehouse(myNode.id, selectedIntakeShipment, receivedQty);
    setShowReceiveModal(false);
  };

  const handleConfirmDispatch = () => {
    dispatchGoodsFromWarehouse(myNode.id, selectedDispatchShipment, selectedDriverId);
    setShowDispatchModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Tablet Floor Terminal
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {myNode.name} Supervisor Portal
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Zone: {myNode.location} · 14 Active Loading Bays
          </p>
        </div>

        {/* Action button cluster (large touch friendly controls) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowReceiveModal(true)}
            className="px-4 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Receive Goods</span>
          </button>
          <button
            onClick={() => setShowDispatchModal(true)}
            className="px-4 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Dispatch Goods</span>
          </button>
          <button
            onClick={() => setShowProblemModal(true)}
            className="px-3 py-2.5 text-xs font-semibold bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Problem</span>
          </button>
        </div>
      </div>

      {/* Disrupted Warning Banner */}
      {isFailedOrDisrupted && (
        <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
              FACILITY ALERT: NORTH WAREHOUSE CORRIDOR STALLED
            </span>
            <p className="text-xs text-rose-800 mt-1">
              Vehicle breakdown reported at Highway Bay 4. All outbound dispatches are temporarily halted pending alternative Dijkstra rerouting approval.
            </p>
          </div>
        </div>
      )}

      {/* Low Inventory Warning */}
      {isLowStock && (
        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              LOW INVENTORY WARNING
            </span>
            <p className="text-xs text-amber-800 mt-1">
              Total warehouse storage capacity has dropped below 30%. Trigger intake requisitions from connected factories.
            </p>
          </div>
        </div>
      )}

      {/* Warehouse Status Indicators (Large touch-friendly cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Warehouse Status</span>
          <div className="mt-2">
            <span
              className={`text-xl font-bold tracking-tight ${
                isFailedOrDisrupted ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {isFailedOrDisrupted ? 'DISRUPTED' : 'NORMAL'}
            </span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">Bays 1-12 Operational</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Current Inventory</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {myNode.inventoryPercent || inventoryLevel}%
            </span>
            <button
              onClick={() => setShowUpdateStockModal(true)}
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${
                (myNode.inventoryPercent || inventoryLevel) < 30 ? 'bg-rose-500' : 'bg-amber-500'
              }`}
              style={{ width: `${myNode.inventoryPercent || inventoryLevel}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Storage Capacity</span>
          <div className="mt-2">
            <span className="text-xl font-bold text-slate-900 tabular-nums">64%</span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">3,400 / 5,000 pallets</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Incoming Shipments</span>
          <div className="flex items-center gap-2 mt-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            <span className="text-xl font-bold text-slate-900 tabular-nums">12</span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">4 arriving in 1 hour</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-medium">Outgoing Shipments</span>
          <div className="flex items-center gap-2 mt-2">
            <Send className="w-5 h-5 text-blue-600" />
            <span className="text-xl font-bold text-slate-900 tabular-nums">8</span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">Dispatched to regional hubs</span>
        </div>
      </div>

      {/* Quick Action Large Barcode / Intake Tiles for Tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Receiving Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Receive & Ingest Goods</h3>
                  <p className="text-xs text-slate-600">Scan incoming factory trailers and update stock</p>
                </div>
              </div>
              <button
                onClick={handleSimulateScan}
                disabled={isScanningBarcode}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>{isScanningBarcode ? 'Scanning...' : 'Scan Barcode'}</span>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 mb-4">
              <span className="text-xs font-bold text-slate-800 block mb-2">Next Expected Delivery:</span>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-900">Shipment #SS1024</span>
                <span className="text-slate-600">250 units · Precision Actuators</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Origin: Central Precision Works (Chakan)</div>
            </div>
          </div>

          <button
            onClick={() => setShowReceiveModal(true)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Open Intake Verification Form</span>
          </button>
        </div>

        {/* Dispatch Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Dispatch to Distribution Hubs</h3>
                  <p className="text-xs text-slate-600">Handover packaged pallets to registered carriers</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700">
                8 Orders Staged
              </span>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 mb-4">
              <span className="text-xs font-bold text-slate-800 block mb-2">Carrier Awaiting Handover:</span>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-900">Rajesh Kumar (TRK-401)</span>
                <span className="text-blue-700 font-medium">Bay 4 Assigned</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Destined for Hub Delta (Delhi NCR Freight)</div>
            </div>
          </div>

          <button
            onClick={() => setShowDispatchModal(true)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Truck className="w-4 h-4" />
            <span>Confirm Driver Dispatch & Handover</span>
          </button>
        </div>
      </div>

      {/* Receive Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold mb-1">Confirm Intake Delivery</h3>
            <p className="text-xs text-slate-600 mb-4">
              Verify freight bill and log accepted quantity into North Warehouse inventory.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Arrived Shipment</label>
                <select
                  value={selectedIntakeShipment}
                  onChange={(e) => setSelectedIntakeShipment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  {incomingShipments.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.id} - {s.itemDescription} ({s.quantityUnits} units)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Counted Received Quantity</label>
                <input
                  type="number"
                  value={receivedQty}
                  onChange={(e) => setReceivedQty(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800">
                Storage Bay: <span className="font-bold">Aisle 4, Shelf C</span> · Digital receipt will update Central Factory.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReceiveModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReceive}
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                >
                  Confirm Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold mb-1">Confirm Outgoing Dispatch</h3>
            <p className="text-xs text-slate-600 mb-4">
              Authorize freight handover and release manifest to the transport driver.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Shipment Order</label>
                <select
                  value={selectedDispatchShipment}
                  onChange={(e) => setSelectedDispatchShipment(e.target.value)}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Commercial Driver</label>
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

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDispatch}
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Authorize Handover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Inventory Modal */}
      {showUpdateStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold mb-2">Adjust Warehouse Stock</h3>
            <p className="text-xs text-slate-600 mb-4">
              Enter updated inventory percentage for {myNode.name}.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Inventory Level:</span>
                  <span className="text-amber-600 font-bold tabular-nums">{inventoryLevel}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={inventoryLevel}
                  onChange={(e) => setInventoryLevel(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateStockModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateWarehouseInventory(myNode.id, inventoryLevel);
                    setShowUpdateStockModal(false);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                >
                  Save Stock Level
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Problem Modal */}
      {showProblemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold text-rose-700 mb-1">Report Warehouse Disruption</h3>
            <p className="text-xs text-slate-600 mb-4">
              Log bay equipment malfunctions, severe weather closures, or staffing shortages to regional dispatch.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  addToast('Disruption Dispatched', 'Loading Bay 4 reported blocked. Regional Hub notified.', 'warning');
                  setShowProblemModal(false);
                }}
                className="w-full p-3 rounded-lg border border-slate-200 text-left hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-800"
              >
                Loading Bay Crane Failure
              </button>
              <button
                onClick={() => {
                  addToast('Disruption Dispatched', 'High temperature sensor alert recorded. Buffer fans active.', 'warning');
                  setShowProblemModal(false);
                }}
                className="w-full p-3 rounded-lg border border-slate-200 text-left hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-800"
              >
                HVAC Temperature Storage Fault
              </button>
              <button
                onClick={() => {
                  addToast('Disruption Dispatched', 'Severe weather warning flagged to fleet carriers.', 'warning');
                  setShowProblemModal(false);
                }}
                className="w-full p-3 rounded-lg border border-slate-200 text-left hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-800"
              >
                Severe Weather Transport Slowdown
              </button>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowProblemModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
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
