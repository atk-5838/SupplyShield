import { SupplyChainNode, SupplyChainEdge } from '../types';

export interface RouteStep {
  nodeId: string;
  edgeId?: string;
  accumulatedCost: number;
  accumulatedTime: number;
  accumulatedDistance: number;
}

export interface DijkstraResult {
  path: string[];
  totalDistance: number;
  totalTime: number;
  totalCost: number;
  visitedNodesCount: number;
  executionTimeMs: number;
  steps: string[];
}

export class SupplyChainGraph {
  nodes: Map<string, SupplyChainNode> = new Map();
  adjacencyList: Map<string, SupplyChainEdge[]> = new Map();
  reverseAdjacencyList: Map<string, SupplyChainEdge[]> = new Map();

  constructor(nodes: SupplyChainNode[] = [], edges: SupplyChainEdge[] = []) {
    nodes.forEach((n) => this.addNode(n));
    edges.forEach((e) => this.addEdge(e));
  }

  addNode(node: SupplyChainNode): void {
    this.nodes.set(node.id, { ...node });
    if (!this.adjacencyList.has(node.id)) {
      this.adjacencyList.set(node.id, []);
    }
    if (!this.reverseAdjacencyList.has(node.id)) {
      this.reverseAdjacencyList.set(node.id, []);
    }
  }

  addEdge(edge: SupplyChainEdge): void {
    if (!this.adjacencyList.has(edge.from)) {
      this.adjacencyList.set(edge.from, []);
    }
    this.adjacencyList.get(edge.from)!.push(edge);

    if (!this.reverseAdjacencyList.has(edge.to)) {
      this.reverseAdjacencyList.set(edge.to, []);
    }
    this.reverseAdjacencyList.get(edge.to)!.push(edge);
  }

  /**
   * Breadth-First Search (BFS) to identify all downstream nodes reachable from a disrupted node.
   * Also captures traversal trace for the DSA presentation.
   */
  bfsDownstreamImpact(
    disruptedNodeId: string,
    blockedNodeIds: Set<string> = new Set()
  ): {
    affectedNodeIds: string[];
    traversalOrder: string[];
    depthLevels: Map<string, number>;
    executionTimeMs: number;
  } {
    const startTime = performance.now();
    const visited = new Set<string>();
    const queue: { id: string; depth: number }[] = [];
    const traversalOrder: string[] = [];
    const depthLevels = new Map<string, number>();

    // Start from the disrupted node
    queue.push({ id: disruptedNodeId, depth: 0 });
    visited.add(disruptedNodeId);

    while (queue.length > 0) {
      const current = queue.shift()!;
      traversalOrder.push(current.id);
      depthLevels.set(current.id, current.depth);

      const outgoing = this.adjacencyList.get(current.id) || [];
      for (const edge of outgoing) {
        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          queue.push({ id: edge.to, depth: current.depth + 1 });
        }
      }
    }

    const executionTimeMs = Number((performance.now() - startTime).toFixed(3));

    // Exclude the starting disrupted node itself from downstream affected list
    const affectedNodeIds = traversalOrder.filter((id) => id !== disruptedNodeId);

    return {
      affectedNodeIds,
      traversalOrder,
      depthLevels,
      executionTimeMs,
    };
  }

  /**
   * Depth-First Search (DFS) to inspect complete dependency chains and alternate branch exploration.
   */
  dfsDownstreamChains(
    startNodeId: string,
    visited: Set<string> = new Set(),
    path: string[] = []
  ): string[][] {
    visited.add(startNodeId);
    path.push(startNodeId);

    const outgoing = this.adjacencyList.get(startNodeId) || [];
    let paths: string[][] = [];

    if (outgoing.length === 0) {
      paths.push([...path]);
    } else {
      for (const edge of outgoing) {
        if (!visited.has(edge.to)) {
          const subPaths = this.dfsDownstreamChains(edge.to, new Set(visited), [...path]);
          paths.push(...subPaths);
        }
      }
    }

    return paths;
  }

  /**
   * Dijkstra's Algorithm for calculating alternative recovery routes.
   * Considers distance, time, or cost, while excluding failed nodes and blocked edges.
   */
  dijkstra(
    startNodeId: string,
    targetNodeId: string,
    disruptedNodeIds: Set<string> = new Set(),
    weightMetric: 'time' | 'distance' | 'cost' = 'time'
  ): DijkstraResult | null {
    const startTime = performance.now();
    const distances = new Map<string, number>();
    const previous = new Map<string, { nodeId: string; edge: SupplyChainEdge }>();
    const unvisited = new Set<string>();
    const steps: string[] = [];

    for (const nodeId of this.nodes.keys()) {
      if (!disruptedNodeIds.has(nodeId)) {
        distances.set(nodeId, Infinity);
        unvisited.add(nodeId);
      }
    }

    if (!distances.has(startNodeId) || !distances.has(targetNodeId)) {
      return null;
    }

    distances.set(startNodeId, 0);

    let visitedCount = 0;

    while (unvisited.size > 0) {
      // Find unvisited node with lowest distance
      let current: string | null = null;
      let minDistance = Infinity;

      for (const node of unvisited) {
        const d = distances.get(node)!;
        if (d < minDistance) {
          minDistance = d;
          current = node;
        }
      }

      if (!current || minDistance === Infinity) {
        break; // Remaining nodes are unreachable
      }

      unvisited.delete(current);
      visitedCount++;

      const currentNodeName = this.nodes.get(current)?.name || current;
      steps.push(`Visited ${currentNodeName} (Score: ${minDistance.toFixed(1)})`);

      if (current === targetNodeId) {
        break; // Target reached
      }

      // Check outgoing edges
      const outgoingEdges = this.adjacencyList.get(current) || [];
      for (const edge of outgoingEdges) {
        if (!unvisited.has(edge.to) || disruptedNodeIds.has(edge.to) || edge.status === 'disrupted') {
          continue;
        }

        let weight = edge.timeHours;
        if (weightMetric === 'distance') weight = edge.distanceKm;
        if (weightMetric === 'cost') weight = edge.costInr;

        const candidateDist = distances.get(current)! + weight;
        if (candidateDist < distances.get(edge.to)!) {
          distances.set(edge.to, candidateDist);
          previous.set(edge.to, { nodeId: current, edge });
          steps.push(`Relaxed edge ${currentNodeName} -> ${this.nodes.get(edge.to)?.name || edge.to} (new score: ${candidateDist.toFixed(1)})`);
        }
      }
    }

    // Reconstruct path
    const path: string[] = [];
    let curr = targetNodeId;

    if (!previous.has(curr) && curr !== startNodeId) {
      return null; // No path found
    }

    let totalDist = 0;
    let totalTime = 0;
    let totalCost = 0;

    while (curr !== startNodeId) {
      path.unshift(curr);
      const prevData = previous.get(curr);
      if (!prevData) break;
      totalDist += prevData.edge.distanceKm;
      totalTime += prevData.edge.timeHours;
      totalCost += prevData.edge.costInr;
      curr = prevData.nodeId;
    }
    path.unshift(startNodeId);

    const executionTimeMs = Number((performance.now() - startTime).toFixed(3));

    return {
      path,
      totalDistance: totalDist,
      totalTime: totalTime,
      totalCost: totalCost,
      visitedNodesCount: visitedCount,
      executionTimeMs,
      steps,
    };
  }

  /**
   * Critical Node Analysis:
   * Computes degree centrality, downstream reachability score, and risk criticality.
   */
  computeCriticalityScores(): Map<string, number> {
    const scores = new Map<string, number>();

    for (const [nodeId, node] of this.nodes.entries()) {
      if (node.role === 'customer') {
        scores.set(nodeId, 20);
        continue;
      }

      // Degree score
      const inDegree = (this.reverseAdjacencyList.get(nodeId) || []).length;
      const outDegree = (this.adjacencyList.get(nodeId) || []).length;
      const degreeScore = (inDegree + outDegree) * 8;

      // Downstream reachability via BFS
      const bfsRes = this.bfsDownstreamImpact(nodeId);
      const downstreamImpactCount = bfsRes.affectedNodeIds.length;
      const downstreamScore = downstreamImpactCount * 12;

      // Warehouse / Hub single-point multiplier
      let roleMultiplier = 1.0;
      if (node.role === 'warehouse') roleMultiplier = 1.35;
      if (node.role === 'hub') roleMultiplier = 1.25;

      const rawScore = Math.min(99, Math.round((degreeScore + downstreamScore) * roleMultiplier));
      scores.set(nodeId, rawScore);
    }

    return scores;
  }
}
