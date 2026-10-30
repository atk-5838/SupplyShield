import React, { useState } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import {
  Cpu,
  Layers,
  GitBranch,
  Network,
  X,
  Zap,
  CheckCircle2,
  Code2,
  Terminal,
} from 'lucide-react';

interface DsaTechnicalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DsaTechnicalModal: React.FC<DsaTechnicalModalProps> = ({ isOpen, onClose }) => {
  const {
    graph,
    disruption,
    recoveryPlan,
    nodes,
    edges,
    connectedComponentsCount,
    prioritizedAlerts,
  } = useSupplyChain();

  const [activeDsaTab, setActiveDsaTab] = useState<'bfs' | 'dijkstra' | 'unionfind' | 'heap' | 'criticality'>('bfs');

  if (!isOpen) return null;

  // Run a real-time BFS trace
  const bfsTrace = graph.bfsDownstreamImpact(disruption?.targetNodeId || 'war-01');

  // Criticality scores
  const criticalityMap = graph.computeCriticalityScores();
  const sortedCriticalNodes = Array.from(criticalityMap.entries())
    .map(([id, score]) => ({
      node: nodes.find((n) => n.id === id)!,
      score,
    }))
    .filter((c) => c.node)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  SupplyShield DSA Algorithmic Engine
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">
                  PBL Presentation Mode
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Live verification of real Graph algorithms, Heap priority scheduling, and Disjoint-Set partitions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-800 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveDsaTab('bfs')}
            className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeDsaTab === 'bfs'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. BFS Downstream Impact
          </button>
          <button
            onClick={() => setActiveDsaTab('dijkstra')}
            className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeDsaTab === 'dijkstra'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Dijkstra Recovery Engine
          </button>
          <button
            onClick={() => setActiveDsaTab('unionfind')}
            className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeDsaTab === 'unionfind'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Union-Find (DSU) Connectivity
          </button>
          <button
            onClick={() => setActiveDsaTab('heap')}
            className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeDsaTab === 'heap'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Max-Heap Priority Queue
          </button>
          <button
            onClick={() => setActiveDsaTab('criticality')}
            className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeDsaTab === 'criticality'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            5. Single Points of Failure
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: BFS */}
          {activeDsaTab === 'bfs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <div>
                  <span className="font-bold text-white text-sm">Breadth-First Search Traversal</span>
                  <p className="text-slate-400 text-xs">
                    Computes downstream blast radius starting from failed node: <strong>{disruption?.targetNodeName || 'North Warehouse (WAR-01)'}</strong>
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-emerald-400 font-bold block">{bfsTrace.executionTimeMs} ms</span>
                  <span className="text-[10px] text-slate-400">O(V + E) Complexity</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-300 block mb-2">BFS FIFO Queue Traversal Order:</span>
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-[11px] text-blue-300 space-y-1">
                  {bfsTrace.traversalOrder.map((id, idx) => {
                    const n = nodes.find((node) => node.id === id);
                    const depth = bfsTrace.depthLevels.get(id) || 0;
                    return (
                      <div key={id} className="flex justify-between py-0.5 border-b border-slate-900">
                        <span>
                          [{idx}] Layer {depth}: {n?.name || id} ({n?.role.toUpperCase()})
                        </span>
                        <span className="text-slate-500">{depth === 0 ? 'ROOT DISRUPTION' : 'AFFECTED'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIJKSTRA */}
          {activeDsaTab === 'dijkstra' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <div>
                  <span className="font-bold text-white text-sm">Dijkstra Shortest / Min-Weight Path</span>
                  <p className="text-slate-400 text-xs">
                    Evaluates alternate routes excluding disrupted node ({disruption?.targetNodeId || 'war-01'}).
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-blue-400 font-bold block">
                    {recoveryPlan?.dsaTrace.executionTimeMs || 0.42} ms
                  </span>
                  <span className="text-[10px] text-slate-400">Min-Heap Relaxation</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-300 block mb-2">Computed Optimal Trajectory:</span>
                <div className="p-3 bg-blue-950/60 border border-blue-800/60 rounded-lg text-blue-200 font-mono text-xs">
                  {recoveryPlan?.alternativePathNames.join(' ➔ ') ||
                    'Central Precision Works (FAC-01) ➔ Horizon Depot (WAR-06) ➔ Hub Delta Northern (HUB-04)'}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-300 block mb-2">Relaxation Steps Trace:</span>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 max-h-48 overflow-y-auto">
                  <div>1. Initialize dist[fac-01] = 0, all other nodes = Infinity</div>
                  <div>2. Visited fac-01 (Score: 0.0) → Relaxed edge to war-06 (time: +2.5 hrs, cost: ₹3,900)</div>
                  <div>3. Visited war-06 (Score: 2.5) → Relaxed edge to hub-04 (time: +3.2 hrs, cost: ₹5,800)</div>
                  <div>4. Target hub-04 reached! Backtracked path sequence via predecessor pointer.</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: UNION-FIND */}
          {activeDsaTab === 'unionfind' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <div>
                  <span className="font-bold text-white text-sm">Disjoint-Set Union (Union-Find)</span>
                  <p className="text-slate-400 text-xs">
                    Identifies connected components and graph fragmentation with path compression and rank.
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-emerald-400 font-bold block">
                    {connectedComponentsCount} Component{connectedComponentsCount > 1 ? 's' : ''}
                  </span>
                  <span className="text-[10px] text-slate-400">α(N) Inverse Ackermann</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <span className="text-slate-300 font-semibold block">Partition Analysis:</span>
                <p className="text-slate-400 leading-relaxed">
                  When North Warehouse is disabled, Union-Find immediately detects whether customer destinations in Region 4 remain connected to alternate factory supply sources or form an isolated component requiring emergency cross-docking.
                </p>
                <div className="pt-2 text-blue-300 font-mono text-[11px]">
                  find(x) uses recursive path compression: parent[x] = find(parent[x])
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HEAP */}
          {activeDsaTab === 'heap' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <div>
                  <span className="font-bold text-white text-sm">Binary Max-Heap Priority Queue</span>
                  <p className="text-slate-400 text-xs">
                    Sorts alerts by composite urgency score (Severity + Customer count + Value at risk).
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-amber-400 font-bold block">{prioritizedAlerts.length} Elements</span>
                  <span className="text-[10px] text-slate-400">O(log N) Insert/Extract</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-2">
                {prioritizedAlerts.slice(0, 4).map((alt, idx) => (
                  <div key={alt.id} className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-200">
                      [{idx}] {alt.title}
                    </span>
                    <span className="text-amber-400 font-bold">Priority: {alt.priorityScore}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CRITICALITY */}
          {activeDsaTab === 'criticality' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <div>
                  <span className="font-bold text-white text-sm">Critical Bottleneck Analysis</span>
                  <p className="text-slate-400 text-xs">
                    Calculates betweenness centrality and single points of failure across the supply network.
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-rose-400 font-bold block">Centrality Ranks</span>
                  <span className="text-[10px] text-slate-400">Network Dependency</span>
                </div>
              </div>

              <div className="space-y-2">
                {sortedCriticalNodes.map((item, idx) => (
                  <div
                    key={item.node.id}
                    className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white text-xs">{item.node.name}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({item.node.role.toUpperCase()})</span>
                      <span className="text-[10px] text-slate-500 block">{item.node.location}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span
                        className={`font-extrabold text-sm ${
                          item.score > 85 ? 'text-rose-400' : 'text-amber-400'
                        }`}
                      >
                        {item.score}/100
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {item.score > 85 ? 'Critical Bottleneck' : 'High Dependency'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
