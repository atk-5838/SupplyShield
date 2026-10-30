import React from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import { Play, ChevronRight, ChevronLeft, X, RefreshCw, Zap } from 'lucide-react';

export const LiveDemoBar: React.FC = () => {
  const {
    isGuidedDemoActive,
    guidedDemoStep,
    nextGuidedDemoStep,
    previousGuidedDemoStep,
    exitGuidedDemo,
    startGuidedDemo,
    clearDisruptionAndReset,
  } = useSupplyChain();

  const stepDescriptions: Record<number, { title: string; dsaNote: string }> = {
    1: {
      title: 'Step 1/12: Administrator Logs In',
      dsaNote: 'Initializes unified graph state with 11 suppliers, 4 factories, 8 warehouses, 5 hubs, and customer endpoints.',
    },
    2: {
      title: 'Step 2/12: Healthy Network Baseline',
      dsaNote: 'Network health: 98%. Union-Find reports 1 single connected component. All edges operating within nominal weights.',
    },
    3: {
      title: 'Step 3/12: Driver Reports Breakdown',
      dsaNote: 'Driver Rajesh Kumar on MH-04-TRK-401 reports breakdown on Northern Highway Bay 4 (Shipment #SS1024 stalled).',
    },
    4: {
      title: 'Step 4/12: Hub Manager Receives Alert',
      dsaNote: 'Max-Heap Priority Queue elevates breakdown alert to score 98. Hub Delta notified of delayed manifest.',
    },
    5: {
      title: 'Step 5/12: Admin Command Center Highlights Disruption',
      dsaNote: 'Disrupted corridor flagged red in interactive graph. Immediate failure containment initiated.',
    },
    6: {
      title: 'Step 6/12: BFS Downstream Impact Traversal',
      dsaNote: 'Breadth-First Search traverses downstream from disrupted node, isolating all dependent edges and receiving nodes.',
    },
    7: {
      title: 'Step 7/12: Affected Shipments & Customers Isolated',
      dsaNote: 'BFS computes 8 downstream nodes, 47 affected customer shipments, and 24% capacity at risk.',
    },
    8: {
      title: 'Step 8/12: Admin Requests Dijkstra Recovery',
      dsaNote: 'Recovery engine initializes Dijkstra shortest/cheapest path algorithm excluding failed Northern Warehouse.',
    },
    9: {
      title: 'Step 9/12: Dijkstra Computes Optimal Bypass Corridor',
      dsaNote: 'Optimal bypass found: Factory Alpha → Horizon Depot (WAR-06) → Hub Delta (HUB-04) (+2.4 hrs, ₹8,500 cost).',
    },
    10: {
      title: 'Step 10/12: Administrator Approves Recovery',
      dsaNote: 'Alternative route activated in blue. 42 customer shipments restored to active routing.',
    },
    11: {
      title: 'Step 11/12: Hub & Driver Receive Updated Instructions',
      dsaNote: 'Driver Rajesh Kumar mobile portal updates with new navigation waypoint. Status transitions to in-transit.',
    },
    12: {
      title: 'Step 12/12: Customer Receives Transparent Updated ETA',
      dsaNote: 'Customer Priya Sharma tracking portal updates with clear delay explanation and verified new ETA of 8:45 PM.',
    },
  };

  if (!isGuidedDemoActive) {
    return (
      <div className="bg-slate-950 text-white text-xs py-2 px-4 border-b border-slate-800/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>PBL DEFENSE MODE</span>
          </div>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300 font-medium hidden sm:inline">
            Execute the complete 12-step cross-role disruption & algorithmic recovery cycle
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={startGuidedDemo}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] text-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current text-white" />
            <span>Run 12-Step Demonstration</span>
          </button>
          <button
            onClick={clearDisruptionAndReset}
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors border border-slate-800"
            title="Reset supply chain to nominal healthy state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    );
  }

  const currentStepInfo = stepDescriptions[guidedDemoStep] || {
    title: `Step ${guidedDemoStep} of 12`,
    dsaNote: 'Executing multi-role supply chain resilience algorithm.',
  };

  return (
    <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white border-b border-indigo-500/30 py-3 px-4 sticky top-0 z-40 shadow-xl shadow-black/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start md:items-center gap-3">
          <div className="relative p-2 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-300 shrink-0 mt-0.5 md:mt-0 shadow-sm shadow-indigo-500/20">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-white font-mono tracking-wider">
                {currentStepInfo.title}
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-mono text-[10px]">
                <span>Phase {guidedDemoStep} of 12</span>
              </div>
            </div>
            <p className="text-xs text-indigo-200/90 mt-0.5 max-w-3xl leading-relaxed font-sans">
              {currentStepInfo.dsaNote}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {guidedDemoStep > 1 && (
            <button
              onClick={previousGuidedDemoStep}
              className="px-3 py-1.5 text-xs text-indigo-200 hover:text-white hover:bg-indigo-900/60 rounded-lg border border-indigo-700/60 transition-colors flex items-center gap-1 font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            onClick={nextGuidedDemoStep}
            className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-md shadow-amber-400/20 transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{guidedDemoStep === 12 ? 'Finish Walkthrough' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={exitGuidedDemo}
            className="p-1.5 text-indigo-300 hover:text-white rounded-lg hover:bg-indigo-900/40 ml-1 transition-colors"
            title="Exit guided demonstration"
            aria-label="Exit guided demonstration"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
