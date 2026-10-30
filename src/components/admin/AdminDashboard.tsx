import React, { useState } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import { NetworkGraphView } from './NetworkGraphView';
import { AlertsView } from './AlertsView';
import { RecoveryView } from './RecoveryView';
import { ReportsView } from './ReportsView';
import { DsaTechnicalModal } from './DsaTechnicalModal';
import {
  ShieldAlert,
  Activity,
  AlertTriangle,
  Truck,
  Route,
  FileText,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    networkHealthPercent,
    disruption,
    recoveryPlan,
    shipments,
    calculateDijkstraRecovery,
    clearDisruptionAndReset,
    addToast,
  } = useSupplyChain();

  const [activeAdminTab, setActiveAdminTab] = useState<'home' | 'network' | 'alerts' | 'recovery' | 'reports'>('home');
  const [isDsaModalOpen, setIsDsaModalOpen] = useState(false);

  const activeDisruptionsCount = disruption?.isActive ? 2 : 0;
  const affectedShipmentsCount = disruption?.isActive ? 47 : 0;
  const recoveryOptionsCount = disruption?.isActive ? 5 : 0;

  const handleFindRecoveryClick = () => {
    calculateDijkstraRecovery('time');
    setActiveAdminTab('recovery');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Title & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 uppercase tracking-widest">
              AUTONOMOUS SURVEILLANCE & RECOVERY
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans mt-1">
            SUPPLYSHIELD COMMAND CENTER
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">
            Deterministic Graph Topology Engine · Real-Time Resilience Monitoring
          </p>
        </div>

        {/* 5 Primary Navigation Sections + Technical Details Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl shadow-inner">
            <button
              onClick={() => setActiveAdminTab('home')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeAdminTab === 'home'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              1. Home
            </button>
            <button
              onClick={() => setActiveAdminTab('network')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeAdminTab === 'network'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              2. Network
            </button>
            <button
              onClick={() => setActiveAdminTab('alerts')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeAdminTab === 'alerts'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              3. Alerts
            </button>
            <button
              onClick={() => setActiveAdminTab('recovery')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeAdminTab === 'recovery'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              4. Recovery
            </button>
            <button
              onClick={() => setActiveAdminTab('reports')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeAdminTab === 'reports'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              5. Reports
            </button>
          </div>

          <button
            onClick={() => setIsDsaModalOpen(true)}
            className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-blue-400 border border-indigo-500/30 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-indigo-950/20 cursor-pointer"
            title="Open Data Structures & Algorithms Explanation for PBL Defense"
          >
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline font-mono">Technical Details / DSA</span>
          </button>
        </div>
      </div>

      {/* Disruption Detection Banner */}
      {disruption?.isActive && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-950 to-slate-950 border-2 border-rose-500/60 shadow-xl shadow-rose-950/30 text-white animate-in fade-in duration-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-600/40 shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-rose-400 uppercase tracking-widest">
                    CRITICAL DISRUPTION DETECTED
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 uppercase">
                    Risk Level: CRITICAL
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">
                  {disruption.targetNodeName} Unavailable ({disruption.reason})
                </h3>

                {/* 4 Quantitative Impact Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 pt-3 border-t border-rose-900/60 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Affected Locations:</span>
                    <strong className="text-white font-bold tabular-nums text-sm">
                      {disruption.affectedNodeIds.length || 8} nodes
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Affected Shipments:</span>
                    <strong className="text-white font-bold tabular-nums text-sm">
                      {affectedShipmentsCount} shipments
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Capacity at Risk:</span>
                    <strong className="text-amber-400 font-bold tabular-nums text-sm">
                      {disruption.capacityAtRiskPercent}%
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Severity Engine:</span>
                    <strong className="text-rose-400 font-bold text-sm">
                      BFS Traversed
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Find Recovery CTA button */}
            <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
              <button
                onClick={handleFindRecoveryClick}
                className="px-6 py-3.5 text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Find Recovery (Dijkstra)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Main Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>NETWORK HEALTH</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-3xl font-black tabular-nums tracking-tight font-sans ${
                networkHealthPercent < 80 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {networkHealthPercent}%
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {networkHealthPercent >= 90 ? 'All nodes synced' : 'Impact contained'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                networkHealthPercent < 80 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${networkHealthPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>ACTIVE DISRUPTIONS</span>
            <AlertTriangle className={`w-4 h-4 ${activeDisruptionsCount > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-3xl font-black tabular-nums tracking-tight font-sans ${
                activeDisruptionsCount > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {activeDisruptionsCount}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {activeDisruptionsCount > 0 ? 'Northern Highway' : 'Zero incidents'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block font-mono">
            Incident Prober: <strong>Active</strong>
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>AFFECTED SHIPMENTS</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-3xl font-black tabular-nums tracking-tight font-sans ${
                affectedShipmentsCount > 0 ? 'text-amber-600' : 'text-slate-900'
              }`}
            >
              {affectedShipmentsCount}
            </span>
            <span className="text-[11px] font-mono text-slate-400">Includes #SS1024</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block font-mono">
            Volume at risk: <strong>24%</strong>
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>RECOVERY OPTIONS</span>
            <Route className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-black text-blue-600 tabular-nums tracking-tight font-sans">
              {recoveryOptionsCount || 5}
            </span>
            <button
              onClick={() => setActiveAdminTab('recovery')}
              className="text-xs font-mono font-bold text-blue-600 hover:text-blue-700 underline"
            >
              View Route →
            </button>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block font-mono">
            Engine: <strong>Dijkstra Algorithm</strong>
          </span>
        </div>
      </div>

      {/* Render Subview based on active section */}
      {activeAdminTab === 'home' && (
        <div className="space-y-6">
          {/* Main interactive supply-chain network below indicators */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Live Multi-Tier Supply Chain Topology Graph
              </h2>
              <span className="text-xs text-slate-600">
                Click any node to inspect criticality or simulate failure
              </span>
            </div>
            <NetworkGraphView onFindRecovery={handleFindRecoveryClick} />
          </div>
        </div>
      )}

      {activeAdminTab === 'network' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Supply Chain Network Graph Architecture
          </h2>
          <NetworkGraphView onFindRecovery={handleFindRecoveryClick} />
        </div>
      )}

      {activeAdminTab === 'alerts' && <AlertsView />}

      {activeAdminTab === 'recovery' && <RecoveryView />}

      {activeAdminTab === 'reports' && <ReportsView />}

      {/* Technical Details DSA Modal */}
      <DsaTechnicalModal isOpen={isDsaModalOpen} onClose={() => setIsDsaModalOpen(false)} />
    </div>
  );
};
