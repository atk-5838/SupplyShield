import React, { useState, useMemo } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import { SupplyChainNode, Role } from '../../types';
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  RefreshCw,
  Zap,
  Info,
  X,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface NetworkGraphViewProps {
  onFindRecovery?: () => void;
}

export const NetworkGraphView: React.FC<NetworkGraphViewProps> = ({ onFindRecovery }) => {
  const {
    nodes,
    edges,
    simulateNodeFailure,
    clearDisruptionAndReset,
    disruption,
    recoveryPlan,
    addToast,
  } = useSupplyChain();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | Role>('all');
  const [selectedNode, setSelectedNode] = useState<SupplyChainNode | null>(null);
  const [showConfirmSimModal, setShowConfirmSimModal] = useState<SupplyChainNode | null>(null);

  // Filter nodes based on search and role
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      const matchesSearch =
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRoleFilter === 'all' || n.role === selectedRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [nodes, searchQuery, selectedRoleFilter]);

  const handleSimulateClick = (node: SupplyChainNode) => {
    setShowConfirmSimModal(node);
  };

  const executeSimulation = () => {
    if (!showConfirmSimModal) return;
    simulateNodeFailure(showConfirmSimModal.id, `Simulated critical disruption at ${showConfirmSimModal.name}`);
    setShowConfirmSimModal(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[740px]">
      {/* Network Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search location or node..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-60"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-lg">
            {(['all', 'supplier', 'factory', 'warehouse', 'hub', 'customer'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRoleFilter(r)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded capitalize transition-colors ${
                  selectedRoleFilter === r
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'all' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span className="text-slate-600 font-semibold">Failed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-slate-600 font-semibold">Recovery Route</span>
          </div>

          <button
            onClick={clearDisruptionAndReset}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
            title="Reset network to healthy state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative flex-1 bg-slate-950 overflow-auto dark-grid-bg">
        <svg
          viewBox="0 0 1020 1020"
          className="w-full h-full min-w-[900px] min-h-[900px] select-none"
        >
          {/* Subtle Grid Lines & Markers */}
          <defs>
            <pattern id="graphGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
            </pattern>
            {/* Glowing filter for nodes */}
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowRed" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowBlue" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Markers for arrows */}
            <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
            </marker>
            <marker id="arrowBlue" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
            </marker>
            <marker id="arrowRed" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
          </defs>

          <rect width="1020" height="1020" fill="url(#graphGrid)" />

          {/* Layer Headers with glowing indicators */}
          <g className="text-[11px] font-mono font-bold fill-slate-400 uppercase tracking-widest">
            <text x="50" y="35" className="fill-emerald-400">● 1. Suppliers (11)</text>
            <text x="260" y="35" className="fill-indigo-400">● 2. Factories (4)</text>
            <text x="470" y="35" className="fill-amber-400">● 3. Warehouses (8)</text>
            <text x="690" y="35" className="fill-cyan-400">● 4. Hubs (5)</text>
            <text x="910" y="35" className="fill-purple-400">● 5. Customers</text>
          </g>

          {/* Render Edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isDisrupted = edge.status === 'disrupted';
            const isAlternative = edge.status === 'alternative' || (recoveryPlan?.approved && (edge.id === 'e-war06-hub04' || edge.id === 'e-fac03-war06' || edge.id === 'e-hub03-hub04'));

            let strokeColor = '#1e293b';
            let strokeWidth = 1.5;
            let strokeDasharray = 'none';
            let className = '';

            if (isDisrupted) {
              strokeColor = '#f43f5e';
              strokeWidth = 3;
              strokeDasharray = '6,6';
              className = 'animate-flow-dash';
            } else if (isAlternative) {
              strokeColor = '#60a5fa';
              strokeWidth = 3.5;
              strokeDasharray = '8,6';
              className = 'animate-flow-dash';
            } else {
              // subtle dynamic animated route
              strokeColor = '#334155';
              strokeWidth = 1.6;
            }

            return (
              <g key={edge.id} className="transition-all duration-300">
                <line
                  x1={fromNode.coords.x + 12}
                  y1={fromNode.coords.y + 12}
                  x2={toNode.coords.x + 12}
                  y2={toNode.coords.y + 12}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  className={className}
                  markerEnd={isAlternative ? 'url(#arrowBlue)' : isDisrupted ? 'url(#arrowRed)' : 'url(#arrow)'}
                />
              </g>
            );
          })}

          {/* Render Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isFailed = node.status === 'failed';
            const isWarning = node.status === 'warning' || (disruption?.affectedNodeIds.includes(node.id) && !isFailed);
            const isRecovering = node.status === 'recovering' || (recoveryPlan?.alternativePath.includes(node.id) && recoveryPlan?.approved);

            let fillColor = '#10b981'; // Emerald
            let glowFilter = 'url(#glowGreen)';
            let ringColor = 'rgba(16, 185, 129, 0.3)';

            if (isFailed) {
              fillColor = '#f43f5e'; // Rose
              glowFilter = 'url(#glowRed)';
              ringColor = 'rgba(244, 63, 94, 0.5)';
            } else if (isRecovering) {
              fillColor = '#3b82f6'; // Blue
              glowFilter = 'url(#glowBlue)';
              ringColor = 'rgba(59, 130, 246, 0.4)';
            } else if (isWarning) {
              fillColor = '#f59e0b'; // Amber
              glowFilter = '';
              ringColor = 'rgba(245, 158, 11, 0.35)';
            }

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group"
                transform={`translate(${node.coords.x}, ${node.coords.y})`}
              >
                {/* Glow ring */}
                <circle
                  cx="12"
                  cy="12"
                  r={isFailed || isRecovering ? 20 : isSelected ? 18 : 14}
                  fill={ringColor}
                  className={isFailed ? 'animate-pulse' : 'transition-all duration-200'}
                />

                {/* Node center with filter */}
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill={fillColor}
                  stroke={isSelected ? '#ffffff' : '#0f172a'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  filter={isFailed ? glowFilter : undefined}
                />

                {/* Node Label */}
                <text
                  x="26"
                  y="16"
                  className="text-[11px] font-mono font-medium fill-slate-300 group-hover:fill-white transition-colors"
                >
                  {node.name.length > 20 ? node.name.slice(0, 19) + '…' : node.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer / High-Tech HUD */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-84 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/80 shadow-2xl p-5 text-slate-100 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
                {selectedNode.role} TELEMETRY HUD
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                aria-label="Close inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-white leading-tight font-sans">
                  {selectedNode.name}
                </h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {selectedNode.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedNode.location}</p>

              <div className="mt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Node Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                      selectedNode.status === 'failed'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : selectedNode.status === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : selectedNode.status === 'recovering'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {selectedNode.status}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Operating Capacity:</span>
                  <span className="font-bold text-white tabular-nums">{selectedNode.capacityPercent}%</span>
                </div>

                {selectedNode.inventoryPercent !== undefined && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Inventory Level:</span>
                    <span className="font-bold text-emerald-400 tabular-nums">{selectedNode.inventoryPercent}%</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Connected Arcs:</span>
                  <span className="font-bold text-white tabular-nums">
                    {selectedNode.connectedNodeIds.length} connected
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Criticality Score:</span>
                  <span
                    className={`font-bold tabular-nums ${
                      selectedNode.criticalityScore > 85 ? 'text-rose-400' : 'text-slate-200'
                    }`}
                  >
                    {selectedNode.criticalityScore}/100 {selectedNode.criticalityScore > 85 ? '(Bottleneck)' : ''}
                  </span>
                </div>
              </div>

              {selectedNode.notes && (
                <div className="mt-3 p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400 leading-relaxed font-sans">
                  {selectedNode.notes}
                </div>
              )}

              {/* Action: Simulate Failure */}
              <div className="mt-5 pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleSimulateClick(selectedNode)}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Simulate Failure at This Node</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Failure Simulation */}
      {showConfirmSimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-slate-900 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-rose-700 mb-2">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-extrabold">Simulate Failure?</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              "This will calculate which parts of the supply chain may be affected using Breadth-First Search (BFS)."
            </p>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1 mb-4">
              <div className="flex justify-between">
                <span className="text-rose-800 font-medium">Target Node:</span>
                <span className="font-bold text-rose-950">{showConfirmSimModal.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-800 font-medium">Criticality Score:</span>
                <span className="font-bold text-rose-950">{showConfirmSimModal.criticalityScore}/100</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmSimModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeSimulation}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm"
              >
                Confirm Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
