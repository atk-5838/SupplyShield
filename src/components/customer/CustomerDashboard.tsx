import React, { useState } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import {
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Building,
  Factory,
  Warehouse,
  Truck,
  UserCheck,
  Phone,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { shipments, disruption, recoveryPlan } = useSupplyChain();

  // Hero order #SS1024
  const myOrder = shipments.find((s) => s.id === 'SS1024') || shipments[0];

  const [showSupportModal, setShowSupportModal] = useState(false);

  const isDelayed = myOrder.status === 'delayed' || disruption?.isActive;
  const isDelivered = myOrder.status === 'delivered';
  const isRerouted = myOrder.status === 'rerouted';

  // Milestone chain: Factory -> Warehouse -> Hub -> Customer
  const milestoneNodes = [
    {
      id: 'factory',
      label: 'Factory Assembly',
      location: 'Central Precision Works',
      completed: myOrder.milestones.factory,
      current: false,
    },
    {
      id: 'warehouse',
      label: 'Regional Warehouse',
      location: 'North Warehouse Bhiwandi',
      completed: myOrder.milestones.warehouse,
      current: !myOrder.milestones.hub && !isDelivered,
    },
    {
      id: 'hub',
      label: 'Distribution Hub',
      location: 'Hub Delta Freight Junction',
      completed: myOrder.milestones.hub,
      current: myOrder.milestones.warehouse && !myOrder.milestones.customer && !isDelivered,
    },
    {
      id: 'customer',
      label: 'Recipient Delivery',
      location: 'New Delhi Ring Road (Priya Sharma)',
      completed: myOrder.milestones.customer,
      current: isDelivered,
    },
  ];

  return (
    <div className="py-6 px-4 flex flex-col justify-center items-center">
      {/* Sleek Mobile Tracking Shell Container */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 flex flex-col justify-between min-h-[640px]">
        <div>
          {/* Customer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono font-bold text-purple-600 uppercase tracking-widest block">
                RECIPIENT TRACKING PORTAL
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight font-sans">
                MY ORDERS
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Welcome, Priya Sharma</p>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-purple-600/20 font-mono">
              PS
            </div>
          </div>

          {/* Delivery Delay Notification Banner */}
          {isDelayed && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-xs animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-900 uppercase tracking-wider block">
                    DELIVERY UPDATE
                  </span>
                  <p className="text-xs text-amber-900 mt-0.5 font-medium leading-relaxed font-sans">
                    "Your order is affected by a temporary transportation disruption."
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs pt-2 border-t border-amber-200/70 text-amber-950 font-sans">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reason:</span>
                      <span className="font-semibold text-right text-slate-800">
                        {myOrder.delayReason || 'Roadway equipment delay on connecting transit corridor.'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Updated Arrival:</span>
                      <span className="font-mono font-bold text-amber-800 tabular-nums">
                        {myOrder.updatedEta || 'Today, 8:45 PM'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Status:</span>
                      <span className="font-semibold text-blue-700">
                        Alternative route activated · Moving safely
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Order Card */}
          <div className="mt-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                  Waybill Manifest
                </span>
                <h2 className="text-sm font-black text-slate-900 font-mono">
                  Order #{myOrder.id}
                </h2>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${
                  isDelivered
                    ? 'bg-emerald-100 text-emerald-800'
                    : isDelayed
                    ? 'bg-amber-100 text-amber-800'
                    : isRerouted
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {myOrder.status.replace('_', ' ')}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-slate-500">Item:</span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[210px]">
                  {myOrder.itemDescription}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Estimated Arrival:</span>
                <span className="font-mono font-extrabold text-blue-600 tabular-nums text-sm">
                  {myOrder.updatedEta || myOrder.originalEta || 'Today, 6:30 PM'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-slate-500">Current Location:</span>
                <span className="font-medium text-slate-700 text-right">
                  {myOrder.currentLocationName}
                </span>
              </div>
            </div>
          </div>

          {/* Shipment Tracking Stepper: Factory -> Warehouse -> Hub -> Customer */}
          <div className="mt-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 shadow-xs">
            <h3 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">
              Shipment Journey Milestones
            </h3>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200">
              {milestoneNodes.map((m) => {
                let circleClass = 'bg-slate-200 border-2 border-slate-300 text-slate-400';
                if (m.completed) {
                  circleClass = 'bg-emerald-500 border-2 border-emerald-500 text-white shadow-sm shadow-emerald-500/20';
                } else if (m.current) {
                  circleClass = 'bg-blue-600 border-2 border-blue-600 text-white ring-4 ring-blue-100 shadow-md shadow-blue-500/30';
                }

                return (
                  <div key={m.id} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${circleClass}`}
                    >
                      {m.completed ? '✓' : m.current ? '●' : '○'}
                    </div>
                    <div>
                      <span
                        className={`text-xs block ${
                          m.current
                            ? 'font-black text-blue-700'
                            : m.completed
                            ? 'font-bold text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {m.label}
                      </span>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5 font-sans">
                        {m.location}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Support Action */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setShowSupportModal(true)}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer font-mono"
          >
            <Phone className="w-4 h-4" />
            <span>Contact Delivery Support</span>
          </button>
          <p className="text-center text-[10px] font-mono text-slate-400 mt-2">
            SupplyShield Verified ID: SS1024-DEL-IND
          </p>
        </div>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold mb-2">Customer Care Support</h3>
            <p className="text-xs text-slate-600 mb-4">
              Our automated logistics dispatch team is monitoring Order #{myOrder.id}.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Dedicated Courier:</span>
                <span className="font-semibold text-slate-800">Commercial Carrier Fleet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Toll-Free Support:</span>
                <span className="font-semibold text-slate-800">1800-SUPPLY (Toll-Free)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-800">support@supplyshield.net</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl"
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
