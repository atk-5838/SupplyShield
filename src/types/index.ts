export type Role = 'supplier' | 'factory' | 'warehouse' | 'hub' | 'driver' | 'customer' | 'admin';

export type NodeStatus = 'healthy' | 'warning' | 'failed' | 'recovering';
export type ShipmentStatus = 'pending' | 'in_transit' | 'delayed' | 'rerouted' | 'delivered';
export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface SupplyChainNode {
  id: string;
  name: string;
  role: 'supplier' | 'factory' | 'warehouse' | 'hub' | 'customer';
  location: string;
  status: NodeStatus;
  capacityPercent: number;
  inventoryPercent?: number;
  criticalityScore: number; // 0-100 indicating importance to network
  connectedNodeIds: string[];
  notes?: string;
  coords: { x: number; y: number }; // Relative coordinates for interactive graph
}

export interface SupplyChainEdge {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  timeHours: number;
  costInr: number;
  status: 'active' | 'disrupted' | 'alternative';
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  customerName: string;
  customerId: string;
  supplierId: string;
  factoryId: string;
  warehouseId: string;
  hubId: string;
  driverId?: string;
  itemDescription: string;
  quantityUnits: number;
  valueInr: number;
  status: ShipmentStatus;
  currentLocationName: string;
  currentNodeId: string;
  destinationName: string;
  originalEta: string;
  updatedEta?: string;
  delayReason?: string;
  milestones: {
    factory: boolean;
    warehouse: boolean;
    hub: boolean;
    customer: boolean;
  };
  recoveryPath?: string[];
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  status: 'available' | 'on_delivery' | 'breakdown' | 'off_duty';
  activeShipmentId?: string;
  assignedHubId: string;
  currentStep: 'assigned' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered';
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  targetRoles: Role[];
  timestamp: string;
  nodeId?: string;
  shipmentId?: string;
  resolved: boolean;
  priorityScore: number; // Calculated by Min/Max Heap: higher = more urgent
}

export interface DisruptionSimulation {
  isActive: boolean;
  targetNodeId: string;
  targetNodeName: string;
  reason: string;
  affectedNodeIds: string[];
  affectedShipmentIds: string[];
  affectedCustomerCount: number;
  capacityAtRiskPercent: number;
  severity: AlertSeverity;
  dsaTrace: {
    bfsTraversed: string[];
    disconnectedComponents: number;
    traversalTimeMs: number;
  };
}

export interface RecoveryPlan {
  id: string;
  disruptionId: string;
  disruptedNodeId: string;
  alternativePath: string[]; // sequence of Node IDs
  alternativePathNames: string[];
  recoveredShipmentsCount: number;
  additionalHours: number;
  additionalCostInr: number;
  weightMetricUsed: 'distance' | 'time' | 'cost';
  approved: boolean;
  dsaTrace: {
    algorithm: 'Dijkstra';
    nodesEvaluated: number;
    shortestPathCost: number;
    executionTimeMs: number;
  };
}
