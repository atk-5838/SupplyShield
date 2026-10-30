import React, { useState } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingDown,
  Layers,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { disruption, recoveryPlan, networkHealthPercent, nodes, addToast } = useSupplyChain();
  const [reportDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const reportText = `SUPPLYSHIELD INCIDENT RESILIENCE REPORT
Date: ${reportDate}
Network Health: ${networkHealthPercent}%
Failed Component: ${disruption?.targetNodeName || 'North Warehouse Corridor (WAR-01)'}
Root Cause: ${disruption?.reason || 'Vehicle Breakdown on Northern Highway link'}
Affected Locations: ${disruption?.affectedNodeIds.length || 8} nodes
Affected Shipments: ${disruption?.affectedShipmentIds.length || 47} shipments
Affected Customers: ${disruption?.affectedCustomerCount || 47} accounts
Capacity at Risk: ${disruption?.capacityAtRiskPercent || 24}%
Recovery Route: ${recoveryPlan?.alternativePathNames.join(' -> ') || 'Horizon Depot bypass corridor'}
Estimated Recovery Time: +${recoveryPlan?.additionalHours || 2.4} hours
Additional Detour Cost: ₹${(recoveryPlan?.additionalCostInr || 8500).toLocaleString()}
Final Status: ${recoveryPlan?.approved ? 'Mitigated & Rerouted' : 'Under Evaluation'}
`;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SupplyShield_Resilience_Report_${Date.now()}.txt`;
    a.click();
    addToast('Report Downloaded', 'Incident summary exported to text file.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Executive Compliance
          </span>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            Disruption Analysis & Recovery Audit Report
          </h2>
          <p className="text-xs text-slate-600">
            Formal post-incident documentation for logistics stakeholders and board compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Printable Report Paper Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs max-w-4xl mx-auto print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="flex justify-between items-start pb-6 border-b border-slate-200">
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 block">
              SupplyShield
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Autonomous Supply Chain Resilience & Recovery Report
            </span>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Report ID: <span className="font-mono text-slate-800 font-semibold">SSR-2026-1030</span></div>
            <div>Generated: <span className="font-semibold text-slate-800">{reportDate}</span></div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Failed Component</span>
            <span className="text-sm font-bold text-rose-700 block mt-0.5">
              {disruption?.targetNodeName || 'North Warehouse (WAR-01)'}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Affected Locations</span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5 tabular-nums">
              {disruption?.affectedNodeIds.length || 8} Downstream Nodes
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Affected Shipments</span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5 tabular-nums">
              47 Manifest Orders
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Capacity at Risk</span>
            <span className="text-sm font-bold text-amber-700 block mt-0.5 tabular-nums">
              24% of Northern Fleet
            </span>
          </div>
        </div>

        {/* Incident Narrative */}
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
              1. Incident Context & Root Cause
            </h4>
            <p>
              On {reportDate}, an operational stoppage occurred along the northern logistics artery: {disruption?.reason || 'Commercial carrier TRK-401 experienced a mechanical engine breakdown on the Northern Highway segment linking North Warehouse (Bhiwandi) and Hub Delta (Delhi NCR)'}. BFS impact graph traversal quickly isolated downstream dependencies, preventing cascading assembly shutdowns at regional automotive plants.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
              2. Algorithmic Recovery Evaluation (Dijkstra Min-Weight Routing)
            </h4>
            <p>
              The SupplyShield algorithmic engine computed an optimal bypass corridor excluding the disrupted node. The alternative trajectory routes through:
            </p>
            <div className="my-2 p-3 bg-blue-50/70 border border-blue-200 rounded-lg font-mono text-[11px] text-blue-900 font-semibold">
              {recoveryPlan?.alternativePathNames.join(' → ') || 'Central Precision Works (FAC-01) → Horizon Depot (WAR-06) → Hub Delta (HUB-04)'}
            </div>
            <p>
              This bypass successfully recaptures <strong>42 out of 47 impacted shipments (89.3% recovery rate)</strong> with a minimal transit penalty of <strong>+{recoveryPlan?.additionalHours || 2.4} hours</strong> and an estimated logistical detour expenditure of <strong>₹{(recoveryPlan?.additionalCostInr || 8500).toLocaleString()}</strong>.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
              3. Final Network & Stakeholder Status
            </h4>
            <p>
              All seven operational stakeholder tiers (Suppliers, Factories, Warehouses, Hubs, Drivers, and Customers) were automatically updated with unified state synchronization. Driver Rajesh Kumar was assigned new waypoints; Customer Priya Sharma received revised transparent arrival expectations of 8:45 PM. Overall network resilience health stabilized at <strong>{networkHealthPercent}%</strong>.
            </p>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between text-xs text-slate-500">
          <div>
            <span className="block font-semibold text-slate-800">Verified by:</span>
            <span>Chief Supply Chain Officer</span>
          </div>
          <div className="text-right">
            <span className="block font-semibold text-slate-800">Algorithm Validation:</span>
            <span>BFS / Dijkstra Engine (v2.6)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
