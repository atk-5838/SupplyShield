import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  Role,
  SupplyChainNode,
  SupplyChainEdge,
  Shipment,
  DriverInfo,
  AlertItem,
  DisruptionSimulation,
  RecoveryPlan,
} from '../types';
import {
  INITIAL_NODES,
  INITIAL_EDGES,
  INITIAL_DRIVERS,
  INITIAL_SHIPMENTS,
  INITIAL_ALERTS,
  DEMO_CREDENTIALS,
  RoleCredential,
} from '../data/mockData';
import { SupplyChainGraph } from '../dsa/graph';
import { PriorityQueue } from '../dsa/priorityQueue';
import { UnionFind } from '../dsa/unionFind';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
}

interface SupplyChainContextType {
  // Navigation & Role Auth
  currentRole: Role | null;
  currentView: 'welcome' | 'login' | 'dashboard';
  loginTargetRole: Role | null;
  currentUser: RoleCredential | null;
  navigateToRoleLogin: (role: Role) => void;
  navigateToWelcome: () => void;
  loginAsRole: (role: Role) => void;
  logout: () => void;
  switchRoleQuick: (role: Role) => void;

  // Data
  nodes: SupplyChainNode[];
  edges: SupplyChainEdge[];
  shipments: Shipment[];
  drivers: DriverInfo[];
  alerts: AlertItem[];
  disruption: DisruptionSimulation | null;
  recoveryPlan: RecoveryPlan | null;

  // Graph and DSA computations
  graph: SupplyChainGraph;
  prioritizedAlerts: AlertItem[];
  networkHealthPercent: number;
  connectedComponentsCount: number;

  // Interactive Actions across Roles
  // Supplier
  updateSupplierInventory: (nodeId: string, newInventoryPercent: number) => void;
  reportSupplierShortage: (nodeId: string, materialName: string, reason: string) => void;

  // Factory
  requestMaterialsFromSupplier: (factoryId: string, supplierId: string, materialName: string, quantity: number) => void;
  updateFactoryProductionRate: (factoryId: string, newProductionRate: number) => void;

  // Warehouse
  receiveGoodsAtWarehouse: (warehouseId: string, shipmentId: string, receivedUnits: number) => void;
  dispatchGoodsFromWarehouse: (warehouseId: string, shipmentId: string, driverId?: string) => void;
  updateWarehouseInventory: (warehouseId: string, newInventoryPercent: number) => void;

  // Hub
  assignDriverToShipment: (hubId: string, shipmentId: string, driverId: string) => void;
  approveAlternativeRoute: () => void;

  // Driver
  advanceDriverStep: (driverId: string) => void;
  reportDriverProblem: (driverId: string, problemType: 'Vehicle Breakdown' | 'Road Blockage' | 'Accident' | 'Delivery Delay' | 'Other', details?: string) => void;

  // Administrator & Simulation
  simulateNodeFailure: (nodeId: string, reason?: string) => void;
  clearDisruptionAndReset: () => void;
  calculateDijkstraRecovery: (weightMetric?: 'time' | 'distance' | 'cost') => RecoveryPlan | null;

  // 12-Step Guided Live Demo
  guidedDemoStep: number;
  isGuidedDemoActive: boolean;
  startGuidedDemo: () => void;
  nextGuidedDemoStep: () => void;
  previousGuidedDemoStep: () => void;
  exitGuidedDemo: () => void;

  // Notifications
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const SupplyChainContext = createContext<SupplyChainContextType | null>(null);

export const SupplyChainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation and Auth
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [currentView, setCurrentView] = useState<'welcome' | 'login' | 'dashboard'>('welcome');
  const [loginTargetRole, setLoginTargetRole] = useState<Role | null>(null);
  const [currentUser, setCurrentUser] = useState<RoleCredential | null>(null);

  // Core Data
  const [nodes, setNodes] = useState<SupplyChainNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<SupplyChainEdge[]>(INITIAL_EDGES);
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [drivers, setDrivers] = useState<DriverInfo[]>(INITIAL_DRIVERS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [disruption, setDisruption] = useState<DisruptionSimulation | null>(null);
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);

  // Guided 12-Step Live Demo
  const [guidedDemoStep, setGuidedDemoStep] = useState<number>(0);
  const [isGuidedDemoActive, setIsGuidedDemoActive] = useState<boolean>(false);

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newToast: ToastMessage = {
      id,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Construct active graph instance
  const graph = useMemo(() => {
    return new SupplyChainGraph(nodes, edges);
  }, [nodes, edges]);

  // Compute prioritized alerts using Heap Priority Queue
  const prioritizedAlerts = useMemo(() => {
    const pq = new PriorityQueue<AlertItem>(true); // Max-Heap
    alerts.forEach((alert) => {
      let score = alert.priorityScore;
      if (alert.severity === 'CRITICAL') score += 100;
      else if (alert.severity === 'HIGH') score += 60;
      else if (alert.severity === 'MEDIUM') score += 30;
      pq.insert(alert, score);
    });
    return pq.toArray();
  }, [alerts]);

  // Compute Union-Find connected components
  const connectedComponentsCount = useMemo(() => {
    const activeNodes = nodes.filter((n) => n.status !== 'failed');
    const uf = new UnionFind(activeNodes.map((n) => n.id));
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);
      if (fromNode && toNode && fromNode.status !== 'failed' && toNode.status !== 'failed' && edge.status !== 'disrupted') {
        uf.union(edge.from, edge.to);
      }
    });
    return uf.getComponentCount();
  }, [nodes, edges]);

  // Overall Network Health score
  const networkHealthPercent = useMemo(() => {
    if (disruption?.isActive) {
      const failedCount = nodes.filter((n) => n.status === 'failed' || n.status === 'warning').length;
      const penalty = Math.min(45, failedCount * 8 + (disruption.affectedNodeIds.length * 4));
      return Math.max(52, 98 - penalty);
    }
    return 98;
  }, [disruption, nodes]);

  // Navigation handlers
  const navigateToRoleLogin = (role: Role) => {
    setLoginTargetRole(role);
    setCurrentView('login');
  };

  const navigateToWelcome = () => {
    setCurrentView('welcome');
    setLoginTargetRole(null);
  };

  const loginAsRole = (role: Role) => {
    const cred = DEMO_CREDENTIALS[role];
    setCurrentRole(role);
    setCurrentUser(cred);
    setCurrentView('dashboard');
    addToast('Authenticated as ' + cred.name, cred.description, 'success');
  };

  const logout = () => {
    setCurrentRole(null);
    setCurrentUser(null);
    setCurrentView('welcome');
    addToast('Signed Out', 'Returned to SupplyShield role selection', 'info');
  };

  const switchRoleQuick = (role: Role) => {
    const cred = DEMO_CREDENTIALS[role];
    setCurrentRole(role);
    setCurrentUser(cred);
    setCurrentView('dashboard');
    addToast('Switched to ' + cred.name, 'Viewing ' + role.toUpperCase() + ' dashboard', 'info');
  };

  // Supplier Actions
  const updateSupplierInventory = (nodeId: string, newInventoryPercent: number) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, inventoryPercent: newInventoryPercent } : n))
    );
    addToast('Inventory Updated', `Supplier stock level adjusted to ${newInventoryPercent}%`, 'info');
  };

  const reportSupplierShortage = (nodeId: string, materialName: string, reason: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, status: 'warning', inventoryPercent: 24 } : n))
    );
    const newAlert: AlertItem = {
      id: 'alt-sup-' + Date.now(),
      title: `SUPPLY ISSUE: ${materialName} Stock Critical`,
      description: `Supplier reported shortage: "${reason}". Factory production schedules may be affected.`,
      severity: 'HIGH',
      targetRoles: ['factory', 'admin', 'warehouse'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nodeId,
      resolved: false,
      priorityScore: 78,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    addToast('Supply Shortage Dispatched', 'Connected factories and administrator notified.', 'warning');
  };

  // Factory Actions
  const requestMaterialsFromSupplier = (factoryId: string, supplierId: string, materialName: string, quantity: number) => {
    const supplierNode = nodes.find((n) => n.id === supplierId);
    const newAlert: AlertItem = {
      id: 'alt-mat-' + Date.now(),
      title: `Material Request: ${quantity} units of ${materialName}`,
      description: `Factory submitted expedited material requisition to ${supplierNode?.name || supplierId}.`,
      severity: 'MEDIUM',
      targetRoles: ['supplier', 'factory', 'admin'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resolved: false,
      priorityScore: 48,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    addToast('Material Requested', `Requisition for ${quantity} units sent to ${supplierNode?.name || 'supplier'}.`, 'success');
  };

  const updateFactoryProductionRate = (factoryId: string, newProductionRate: number) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === factoryId ? { ...n, capacityPercent: newProductionRate } : n))
    );
    addToast('Production Updated', `Factory operating at ${newProductionRate}% output`, 'info');
  };

  // Warehouse Actions
  const receiveGoodsAtWarehouse = (warehouseId: string, shipmentId: string, receivedUnits: number) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            milestones: { ...s.milestones, warehouse: true },
            currentLocationName: `${nodes.find((n) => n.id === warehouseId)?.name || 'Warehouse'} Staging Area`,
            currentNodeId: warehouseId,
          };
        }
        return s;
      })
    );
    // Increase warehouse inventory
    setNodes((prev) =>
      prev.map((n) => (n.id === warehouseId ? { ...n, inventoryPercent: Math.min(95, (n.inventoryPercent || 65) + 6) } : n))
    );
    addToast('Goods Received & Scanned', `Shipment #${shipmentId} (${receivedUnits} units) checked into bay inventory.`, 'success');
  };

  const dispatchGoodsFromWarehouse = (warehouseId: string, shipmentId: string, driverId?: string) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            status: 'in_transit',
            driverId: driverId || s.driverId,
            currentLocationName: 'Dispatched to Transport Corridor',
          };
        }
        return s;
      })
    );
    addToast('Shipment Dispatched', `Shipment #${shipmentId} released to carrier with transport manifest.`, 'info');
  };

  const updateWarehouseInventory = (warehouseId: string, newInventoryPercent: number) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === warehouseId ? { ...n, inventoryPercent: newInventoryPercent } : n))
    );
    addToast('Stock Level Saved', `Warehouse inventory set to ${newInventoryPercent}%`, 'info');
  };

  // Hub Actions
  const assignDriverToShipment = (hubId: string, shipmentId: string, driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    setShipments((prev) =>
      prev.map((s) => (s.id === shipmentId ? { ...s, driverId, status: 'in_transit' } : s))
    );
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? { ...d, status: 'on_delivery', activeShipmentId: shipmentId, currentStep: 'assigned' }
          : d
      )
    );
    const newAlert: AlertItem = {
      id: 'alt-assign-' + Date.now(),
      title: `Driver Assigned: ${driver?.name || driverId}`,
      description: `Hub dispatched order #${shipmentId} to driver ${driver?.name} (${driver?.vehicleNumber}). Notification delivered to mobile device.`,
      severity: 'LOW',
      targetRoles: ['driver', 'hub', 'admin'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      shipmentId,
      resolved: false,
      priorityScore: 22,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    addToast('Driver Assigned', `${driver?.name} received manifest for Shipment #${shipmentId}`, 'success');
  };

  // Driver Actions
  const advanceDriverStep = (driverId: string) => {
    const steps: DriverInfo['currentStep'][] = ['assigned', 'accepted', 'picked_up', 'in_transit', 'delivered'];
    let nextStep: DriverInfo['currentStep'] = 'assigned';

    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          const currentIdx = steps.indexOf(d.currentStep);
          nextStep = steps[Math.min(steps.length - 1, currentIdx + 1)];
          return {
            ...d,
            currentStep: nextStep,
            status: nextStep === 'delivered' ? 'available' : 'on_delivery',
          };
        }
        return d;
      })
    );

    // If driver is on SS1024, update shipment status
    const driver = drivers.find((d) => d.id === driverId);
    if (driver?.activeShipmentId) {
      const activeShipId = driver.activeShipmentId;
      setShipments((prev) =>
        prev.map((s) => {
          if (s.id === activeShipId) {
            const isDelivered = nextStep === 'delivered';
            return {
              ...s,
              status: isDelivered ? 'delivered' : 'in_transit',
              milestones: {
                ...s.milestones,
                hub: nextStep === 'in_transit' || isDelivered,
                customer: isDelivered,
              },
            };
          }
          return s;
        })
      );
    }

    addToast('Step Progressed', `Driver delivery status updated to "${nextStep.replace('_', ' ').toUpperCase()}"`, 'info');
  };

  // Core Hero Action: Driver reports problem (e.g. Vehicle Breakdown)
  const reportDriverProblem = (
    driverId: string,
    problemType: 'Vehicle Breakdown' | 'Road Blockage' | 'Accident' | 'Delivery Delay' | 'Other',
    details?: string
  ) => {
    const driver = drivers.find((d) => d.id === driverId);
    const affectedShipmentId = driver?.activeShipmentId || 'SS1024';

    // 1. Mark driver in breakdown state
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, status: 'breakdown' } : d))
    );

    // 2. Mark hero edge as disrupted
    setEdges((prev) =>
      prev.map((e) => (e.id === 'e-war01-hub04' ? { ...e, status: 'disrupted' } : e))
    );

    // 3. Mark shipment as delayed and attach reason
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === affectedShipmentId) {
          return {
            ...s,
            status: 'delayed',
            delayReason: `${problemType}: Carrier ${driver?.name || 'Driver'} vehicle stopped. Rerouting required.`,
            updatedEta: 'Today, 8:45 PM (+2.2 hrs delay)',
          };
        }
        return s;
      })
    );

    // 4. Run BFS downstream impact from North Warehouse / Hero Node
    const bfsRes = graph.bfsDownstreamImpact('war-01');

    // 5. Build disruption simulation object
    const newDisruption: DisruptionSimulation = {
      isActive: true,
      targetNodeId: 'war-01',
      targetNodeName: 'North Warehouse Highway Corridor',
      reason: `${problemType} reported by driver ${driver?.name} on MH-04-TRK-401`,
      affectedNodeIds: bfsRes.affectedNodeIds,
      affectedShipmentIds: ['SS1024', 'SS1025', 'SS1030'],
      affectedCustomerCount: 47,
      capacityAtRiskPercent: 24,
      severity: 'CRITICAL',
      dsaTrace: {
        bfsTraversed: bfsRes.traversalOrder,
        disconnectedComponents: 2,
        traversalTimeMs: bfsRes.executionTimeMs,
      },
    };
    setDisruption(newDisruption);

    // 6. Push Priority Queue Alert to Hub & Admin
    const priorityAlert: AlertItem = {
      id: 'alt-breakdown-' + Date.now(),
      title: `CRITICAL: ${problemType} on Northern Corridor`,
      description: `Driver ${driver?.name} (${driver?.vehicleNumber}) reported "${problemType}": ${details || 'Engine stall on NH-48'}. Shipment #${affectedShipmentId} stalled. Recovery path required.`,
      severity: 'CRITICAL',
      targetRoles: ['hub', 'admin', 'driver', 'customer'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      shipmentId: affectedShipmentId,
      nodeId: 'war-01',
      resolved: false,
      priorityScore: 98,
    };
    setAlerts((prev) => [priorityAlert, ...prev]);

    addToast(
      'ALERT DISPATCHED: ' + problemType,
      `Hub Delta & Admin Command Center alerted. Downstream BFS impact calculated.`,
      'error'
    );
  };

  // Administrator Failure Simulation (e.g. North Warehouse becomes unavailable)
  const simulateNodeFailure = (nodeId: string, reason?: string) => {
    const targetNode = nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;

    // Set node status to failed
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, status: 'failed' } : n))
    );

    // Run BFS from failed node to identify downstream affected nodes
    const bfsRes = graph.bfsDownstreamImpact(nodeId);

    // Identify affected shipments passing through this node
    const affectedShipments = shipments.filter(
      (s) => s.currentNodeId === nodeId || s.warehouseId === nodeId || s.hubId === nodeId
    );
    const affectedShipmentIds = affectedShipments.map((s) => s.id);

    // Mark affected shipments as delayed
    setShipments((prev) =>
      prev.map((s) => {
        if (affectedShipmentIds.includes(s.id)) {
          return {
            ...s,
            status: 'delayed',
            delayReason: `Facility Disruption: ${targetNode.name} offline.`,
            updatedEta: 'Recalculating alternative route...',
          };
        }
        return s;
      })
    );

    const disruptionObj: DisruptionSimulation = {
      isActive: true,
      targetNodeId: nodeId,
      targetNodeName: targetNode.name,
      reason: reason || `Simulated failure at ${targetNode.name} to stress-test resilience`,
      affectedNodeIds: bfsRes.affectedNodeIds,
      affectedShipmentIds: affectedShipmentIds.length > 0 ? affectedShipmentIds : ['SS1024', 'SS1025'],
      affectedCustomerCount: 47,
      capacityAtRiskPercent: 24,
      severity: 'CRITICAL',
      dsaTrace: {
        bfsTraversed: bfsRes.traversalOrder,
        disconnectedComponents: 2,
        traversalTimeMs: bfsRes.executionTimeMs,
      },
    };
    setDisruption(disruptionObj);

    // Push alert
    const newAlert: AlertItem = {
      id: 'alt-sim-' + Date.now(),
      title: `CRITICAL: Disruption Detected at ${targetNode.name}`,
      description: `Disruption simulated. BFS traversal computed ${bfsRes.affectedNodeIds.length} downstream nodes affected. Run recovery engine.`,
      severity: 'CRITICAL',
      targetRoles: ['admin', 'hub', 'warehouse'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nodeId,
      resolved: false,
      priorityScore: 99,
    };
    setAlerts((prev) => [newAlert, ...prev]);

    addToast('Simulation Active', `Disruption triggered at ${targetNode.name}. Impact evaluated via BFS.`, 'warning');
  };

  // Dijkstra Recovery Engine
  const calculateDijkstraRecovery = (weightMetric: 'time' | 'distance' | 'cost' = 'time'): RecoveryPlan | null => {
    const failedNodeId = disruption?.targetNodeId || 'war-01';
    const blockedNodes = new Set<string>([failedNodeId]);

    // Alternative bypass route from Central Precision Works (fac-01) or Horizon Depot (war-06) to Hub Delta (hub-04)
    // Using Dijkstra to route from fac-01 to hub-04 avoiding war-01
    const startNode = 'fac-01';
    const destinationNode = 'hub-04';

    const dijkstraRes = graph.dijkstra(startNode, destinationNode, blockedNodes, weightMetric);

    if (!dijkstraRes) {
      addToast('No Path Found', 'Graph is disconnected; no alternate path available.', 'error');
      return null;
    }

    const pathNodeNames = dijkstraRes.path.map((id) => nodes.find((n) => n.id === id)?.name || id);

    const plan: RecoveryPlan = {
      id: 'rec-' + Date.now(),
      disruptionId: disruption?.targetNodeId || 'dis-01',
      disruptedNodeId: failedNodeId,
      alternativePath: dijkstraRes.path,
      alternativePathNames: pathNodeNames,
      recoveredShipmentsCount: 42,
      additionalHours: 2.4,
      additionalCostInr: 8500,
      weightMetricUsed: weightMetric,
      approved: false,
      dsaTrace: {
        algorithm: 'Dijkstra',
        nodesEvaluated: dijkstraRes.visitedNodesCount,
        shortestPathCost: dijkstraRes.totalTime,
        executionTimeMs: dijkstraRes.executionTimeMs,
      },
    };

    setRecoveryPlan(plan);
    addToast('Alternative Route Calculated', `Dijkstra identified path via ${pathNodeNames.slice(1, -1).join(' → ')}`, 'info');
    return plan;
  };

  // Approve Alternative Route
  const approveAlternativeRoute = () => {
    if (!recoveryPlan) return;

    setRecoveryPlan((prev) => (prev ? { ...prev, approved: true } : null));

    // Highlight edges as alternative / blue
    setEdges((prev) =>
      prev.map((e) => {
        if (e.id === 'e-war06-hub04' || e.id === 'e-fac03-war06' || e.id === 'e-hub03-hub04') {
          return { ...e, status: 'alternative' };
        }
        return e;
      })
    );

    // Update nodes status to recovering
    setNodes((prev) =>
      prev.map((n) => {
        if (recoveryPlan.alternativePath.includes(n.id)) {
          return { ...n, status: 'recovering' };
        }
        return n;
      })
    );

    // Reassign driver to alternative bypass & update shipment SS1024
    setDrivers((prev) =>
      prev.map((d) => (d.id === 'drv-01' ? { ...d, status: 'on_delivery', currentStep: 'in_transit' } : d))
    );

    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === 'SS1024') {
          return {
            ...s,
            status: 'rerouted',
            currentLocationName: 'Rerouted via Gurugram Horizon Corridor',
            updatedEta: 'Today, 8:45 PM (Recovered)',
            recoveryPath: recoveryPlan.alternativePathNames,
          };
        }
        return s;
      })
    );

    // Alert notifying Hub, Driver, Customer
    const approvalAlert: AlertItem = {
      id: 'alt-rec-appr-' + Date.now(),
      title: 'RECOVERY APPROVED: Alternative Corridor Activated',
      description: `Bypass route approved: ${recoveryPlan.alternativePathNames.join(' → ')}. 42 shipments recovered. Driver Rajesh Kumar updated with fresh routing. Customer Priya Sharma ETA updated.`,
      severity: 'HIGH',
      targetRoles: ['driver', 'hub', 'customer', 'admin'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resolved: true,
      priorityScore: 70,
    };
    setAlerts((prev) => [approvalAlert, ...prev]);

    addToast('Recovery Route Approved', 'Drivers, Hubs, and Customers received updated manifests and ETAs.', 'success');
  };

  // Clear disruption and reset
  const clearDisruptionAndReset = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setShipments(INITIAL_SHIPMENTS);
    setDrivers(INITIAL_DRIVERS);
    setAlerts(INITIAL_ALERTS);
    setDisruption(null);
    setRecoveryPlan(null);
    setIsGuidedDemoActive(false);
    setGuidedDemoStep(0);
    addToast('Network Reset', 'All nodes, routes, and shipments restored to baseline healthy state.', 'info');
  };

  // 12-Step Guided Live Demonstration Controller
  const startGuidedDemo = () => {
    setIsGuidedDemoActive(true);
    setGuidedDemoStep(1);
    loginAsRole('admin');
    addToast('Step 1 of 12 Initiated', 'Administrator logged in to Command Center', 'info');
  };

  const nextGuidedDemoStep = () => {
    const next = guidedDemoStep + 1;
    if (next > 12) {
      setIsGuidedDemoActive(false);
      setGuidedDemoStep(0);
      addToast('Demo Complete', 'All 12 steps of the multi-role demonstration completed successfully.', 'success');
      return;
    }
    setGuidedDemoStep(next);

    switch (next) {
      case 2:
        switchRoleQuick('admin');
        addToast('Step 2: Healthy Baseline', 'Administrator observes 98% network health across all nodes.', 'info');
        break;
      case 3:
        switchRoleQuick('driver');
        addToast('Step 3: Driver Portal', 'Driver Rajesh Kumar encounters engine stall on MH-04-TRK-401.', 'warning');
        break;
      case 4:
        reportDriverProblem('drv-01', 'Vehicle Breakdown', 'Engine overheated on NH-48 northern bypass');
        switchRoleQuick('hub');
        addToast('Step 4: Hub Dispatcher Notified', 'Hub Manager receives incoming critical breakdown alert.', 'error');
        break;
      case 5:
        switchRoleQuick('admin');
        addToast('Step 5: Admin Command Center', 'Administrator views affected shipment SS1024 and stalled route.', 'warning');
        break;
      case 6:
        addToast('Step 6: BFS Traversal', 'BFS algorithm computed downstream impact across 8 connected nodes.', 'info');
        break;
      case 7:
        addToast('Step 7: Affected Scope', 'System isolated 47 affected shipments and 24% capacity at risk.', 'info');
        break;
      case 8:
        calculateDijkstraRecovery('time');
        addToast('Step 8: Recovery Analysis', 'Dijkstra shortest path algorithm triggered with time weights.', 'info');
        break;
      case 9:
        addToast('Step 9: Alternative Route Computed', 'Path found via Horizon Corridor (+2.4 hrs, ₹8,500 cost).', 'info');
        break;
      case 10:
        approveAlternativeRoute();
        addToast('Step 10: Recovery Approved', 'Administrator authorized bypass corridor. Blue route activated.', 'success');
        break;
      case 11:
        switchRoleQuick('driver');
        addToast('Step 11: Driver Received New Route', 'Driver Rajesh Kumar received updated bypass instructions.', 'success');
        break;
      case 12:
        switchRoleQuick('customer');
        addToast('Step 12: Customer Transparent ETA', 'Customer Priya Sharma sees updated transparent ETA: 8:45 PM.', 'success');
        break;
      default:
        break;
    }
  };

  const previousGuidedDemoStep = () => {
    if (guidedDemoStep > 1) {
      setGuidedDemoStep(guidedDemoStep - 1);
    }
  };

  const exitGuidedDemo = () => {
    setIsGuidedDemoActive(false);
    setGuidedDemoStep(0);
    addToast('Walkthrough Closed', 'Returned to manual testing mode.', 'info');
  };

  return (
    <SupplyChainContext.Provider
      value={{
        currentRole,
        currentView,
        loginTargetRole,
        currentUser,
        navigateToRoleLogin,
        navigateToWelcome,
        loginAsRole,
        logout,
        switchRoleQuick,

        nodes,
        edges,
        shipments,
        drivers,
        alerts,
        disruption,
        recoveryPlan,

        graph,
        prioritizedAlerts,
        networkHealthPercent,
        connectedComponentsCount,

        updateSupplierInventory,
        reportSupplierShortage,
        requestMaterialsFromSupplier,
        updateFactoryProductionRate,
        receiveGoodsAtWarehouse,
        dispatchGoodsFromWarehouse,
        updateWarehouseInventory,
        assignDriverToShipment,
        approveAlternativeRoute,
        advanceDriverStep,
        reportDriverProblem,

        simulateNodeFailure,
        clearDisruptionAndReset,
        calculateDijkstraRecovery,

        guidedDemoStep,
        isGuidedDemoActive,
        startGuidedDemo,
        nextGuidedDemoStep,
        previousGuidedDemoStep,
        exitGuidedDemo,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </SupplyChainContext.Provider>
  );
};

export const useSupplyChain = () => {
  const context = useContext(SupplyChainContext);
  if (!context) {
    throw new Error('useSupplyChain must be used within a SupplyChainProvider');
  }
  return context;
};
