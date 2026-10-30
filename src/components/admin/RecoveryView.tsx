import React, { useState } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import {
  Route,
  CheckCircle2,
  Clock,
  Coins,
  MapPin,
  TrendingUp,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2,
  Truck,
  Users,
} from 'lucide-react';

export const RecoveryView: React.FC = () => {
  const {
    recoveryPlan,
    calculateDijkstraRecovery,
    approveAlternativeRoute,
    disruption,
    nodes,
    addToast,
  } = useSupplyChain();

  const [weightMetric, setWeightMetric] = useState<'time' | 'distance' | 'cost'>('time');

  const handleComputeClick = () => {
    calculateDijkstraRecovery(weightMetric);
  };

  const isApproved = recoveryPlan?.approved;

  return (
    <div className="space-y-6">
      {/* Recovery Engine Configuration Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Algorithmic Recovery Engine (Dijkstra)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold font-mono">
              O((E + V) log V)
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Alternative Route & Corridor Optimization
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Excludes failed facilities and blocked transport legs. Computes minimum-weight bypass across the supply graph.
          </p>
        </div>

        {/* Weight Metric Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => {
                setWeightMetric('time');
                if (recoveryPlan) calculateDijkstraRecovery('time');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                weightMetric === 'time'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Minimize Time
            </button>
            <button
              onClick={() => {
                setWeightMetric('cost');
                if (recoveryPlan) calculateDijkstraRecovery('cost');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                weightMetric === 'cost'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Minimize Cost
            </button>
            <button
              onClick={() => {
                setWeightMetric('distance');
                if (recoveryPlan) calculateDijkstraRecovery('distance');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                weightMetric === 'distance'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Minimize Distance
            </button>
          </div>

          <button
            onClick={handleComputeClick}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Recalculate Dijkstra</span>
          </button>
        </div>
      </div>

      {/* Recommended Recovery Card (Exact specifications from user prompt) */}
      {recoveryPlan ? (
        <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                RECOMMENDED RECOVERY ROUTE
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                Optimal Bypass Corridor via Northern Express
              </h3>
              <p className="text-xs text-slate-600">
                Calculated using Dijkstra's algorithm (Evaluated {recoveryPlan.dsaTrace.nodesEvaluated} nodes in {recoveryPlan.dsaTrace.executionTimeMs}ms)
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isApproved ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Alternative Route Approved & Dispatched</span>
                </div>
              ) : (
                <button
                  onClick={approveAlternativeRoute}
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Recovery</span>
                </button>
              )}
            </div>
          </div>

          {/* Pathway Sequence Display */}
          <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block mb-3 uppercase tracking-wider">
              Transit Sequence (Highlighted in Blue on Network Graph):
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {recoveryPlan.alternativePathNames.map((nodeName, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-2xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{nodeName}</span>
                  </div>
                  {idx < recoveryPlan.alternativePathNames.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 3 Key Impact Recovery Stats (from prompt specs) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-xs font-semibold text-emerald-800 block">
                Customers / Shipments Recovered
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Users className="w-5 h-5 text-emerald-700" />
                <span className="text-2xl font-extrabold text-emerald-900 tabular-nums">
                  {recoveryPlan.recoveredShipmentsCount} Shipments
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 mt-1 block">
                89% of affected volume restored
              </span>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <span className="text-xs font-semibold text-blue-800 block">
                Additional Travel Time
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-5 h-5 text-blue-700" />
                <span className="text-2xl font-extrabold text-blue-900 tabular-nums">
                  +{recoveryPlan.additionalHours} hours
                </span>
              </div>
              <span className="text-[11px] text-blue-700 mt-1 block">
                Within guaranteed service buffer
              </span>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
              <span className="text-xs font-semibold text-purple-800 block">
                Additional Transportation Cost
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="w-5 h-5 text-purple-700" />
                <span className="text-2xl font-extrabold text-purple-900 tabular-nums">
                  ₹{recoveryPlan.additionalCostInr.toLocaleString()}
                </span>
              </div>
              <span className="text-[11px] text-purple-700 mt-1 block">
                Bypass toll & detour surcharge
              </span>
            </div>
          </div>

          {/* Multi-Role Notification Dispatch Summary */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 block mb-2">
              Cross-Role System Notifications on Approval:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
                <Building2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Hub Dispatch:</strong> Manifests updated at Hub Delta with new arrival bay.
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
                <Truck className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Driver Carrier:</strong> In-app navigation updated for Rajesh Kumar (TRK-401).
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
                <Users className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Customer Notice:</strong> Order #SS1024 ETA updated transparently to 8:45 PM.
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Route className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Recovery Plan Active</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Simulate a disruption on the network or click the button below to initialize Dijkstra's recovery routing on the current supply graph.
          </p>
          <button
            onClick={handleComputeClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            Compute Dijkstra Recovery Path
          </button>
        </div>
      )}
    </div>
  );
};
