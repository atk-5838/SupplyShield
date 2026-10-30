import { SupplyChainNode, SupplyChainEdge, Shipment, DriverInfo, AlertItem, Role } from '../types';

export interface RoleCredential {
  role: Role;
  name: string;
  email: string;
  password: string;
  title: string;
  assignedEntityName: string;
  description: string;
}

export const DEMO_CREDENTIALS: Record<Role, RoleCredential> = {
  supplier: {
    role: 'supplier',
    name: 'Apex Semiconductor & Metals',
    email: 'supplier@supplyshield.net',
    password: 'SupplyDemo2026!',
    title: 'Supply Operations Lead',
    assignedEntityName: 'Apex Metals (Node SUP-01)',
    description: 'Manage material inventory, order fulfillment, and production line deliveries.',
  },
  factory: {
    role: 'factory',
    name: 'Central Precision Works',
    email: 'factory@supplyshield.net',
    password: 'FactoryDemo2026!',
    title: 'Plant Operations Manager',
    assignedEntityName: 'Central Precision Works (FAC-01)',
    description: 'Monitor live production lines, raw material buffer stocks, and intake schedules.',
  },
  warehouse: {
    role: 'warehouse',
    name: 'North Warehouse Depot',
    email: 'warehouse@supplyshield.net',
    password: 'WarehouseDemo2026!',
    title: 'Warehouse Floor Supervisor',
    assignedEntityName: 'North Warehouse (WAR-01)',
    description: 'Control barcode scanning, goods intake receipts, bay storage, and driver dispatch.',
  },
  hub: {
    role: 'hub',
    name: 'Hub Delta Logistics',
    email: 'hub@supplyshield.net',
    password: 'HubDeltaDemo2026!',
    title: 'Regional Logistics Dispatcher',
    assignedEntityName: 'Hub Delta Northern (HUB-04)',
    description: 'Coordinate dispatch manifests, assign registered drivers, and verify recovery routes.',
  },
  driver: {
    role: 'driver',
    name: 'Rajesh Kumar (TRK-401)',
    email: 'driver@supplyshield.net',
    password: 'DriverDemo2026!',
    title: 'Commercial Fleet Carrier',
    assignedEntityName: 'Truck TRK-401 · Order #SS1024',
    description: 'Mobile field portal to confirm pickups, navigate assignments, and report disruptions.',
  },
  customer: {
    role: 'customer',
    name: 'Priya Sharma (Zenith Electronics)',
    email: 'customer@supplyshield.net',
    password: 'CustomerDemo2026!',
    title: 'Procurement Recipient',
    assignedEntityName: 'Order #SS1024 · Active Transit',
    description: 'Customer order tracker with live milestone progress and transparent delay updates.',
  },
  admin: {
    role: 'admin',
    name: 'Chief Supply Chain Officer',
    email: 'admin@supplyshield.net',
    password: 'AdminShield2026!',
    title: 'Network Resilience Director',
    assignedEntityName: 'Global Command Center',
    description: 'Monitor network health, simulate disruptions, and execute Dijkstra recovery engine.',
  },
};

export const INITIAL_NODES: SupplyChainNode[] = [
  // 11 Suppliers
  { id: 'sup-01', name: 'Apex Metals & Alloys', role: 'supplier', location: 'Pune Sector 4', status: 'healthy', capacityPercent: 92, inventoryPercent: 82, criticalityScore: 84, connectedNodeIds: ['fac-01', 'fac-02'], coords: { x: 50, y: 70 } },
  { id: 'sup-02', name: 'Global Microchips Corp', role: 'supplier', location: 'Bengaluru Tech Corridor', status: 'healthy', capacityPercent: 95, inventoryPercent: 88, criticalityScore: 92, connectedNodeIds: ['fac-01', 'fac-03'], coords: { x: 50, y: 150 } },
  { id: 'sup-03', name: 'PolyChem Polymers', role: 'supplier', location: 'Vadodara Chemical Zone', status: 'healthy', capacityPercent: 78, inventoryPercent: 74, criticalityScore: 68, connectedNodeIds: ['fac-02', 'fac-04'], coords: { x: 50, y: 230 } },
  { id: 'sup-04', name: 'Nordic Precision Lumber', role: 'supplier', location: 'Mangaluru Port', status: 'healthy', capacityPercent: 88, inventoryPercent: 85, criticalityScore: 54, connectedNodeIds: ['fac-02'], coords: { x: 50, y: 310 } },
  { id: 'sup-05', name: 'Apex Industrial Glass', role: 'supplier', location: 'Faridabad Industrial Area', status: 'healthy', capacityPercent: 81, inventoryPercent: 79, criticalityScore: 62, connectedNodeIds: ['fac-03', 'fac-04'], coords: { x: 50, y: 390 } },
  { id: 'sup-06', name: 'Vertex Sensors Ltd', role: 'supplier', location: 'Hyderabad Hardware Park', status: 'healthy', capacityPercent: 90, inventoryPercent: 91, criticalityScore: 78, connectedNodeIds: ['fac-01', 'fac-04'], coords: { x: 50, y: 470 } },
  { id: 'sup-07', name: 'SynthRubber Co.', role: 'supplier', location: 'Kochi Rubber Complex', status: 'healthy', capacityPercent: 84, inventoryPercent: 80, criticalityScore: 58, connectedNodeIds: ['fac-02', 'fac-03'], coords: { x: 50, y: 550 } },
  { id: 'sup-08', name: 'FerroAlloy Foundry', role: 'supplier', location: 'Jamshedpur Steel Hub', status: 'healthy', capacityPercent: 89, inventoryPercent: 83, criticalityScore: 75, connectedNodeIds: ['fac-01'], coords: { x: 50, y: 630 } },
  { id: 'sup-09', name: 'Precision Quartz Labs', role: 'supplier', location: 'Jaipur Mineral Belt', status: 'healthy', capacityPercent: 86, inventoryPercent: 89, criticalityScore: 64, connectedNodeIds: ['fac-03'], coords: { x: 50, y: 710 } },
  { id: 'sup-10', name: 'BioPharm Reagents', role: 'supplier', location: 'Ahmedabad Pharma Cluster', status: 'healthy', capacityPercent: 93, inventoryPercent: 94, criticalityScore: 70, connectedNodeIds: ['fac-04'], coords: { x: 50, y: 790 } },
  { id: 'sup-11', name: 'ElectroWire Cables', role: 'supplier', location: 'Coimbatore Foundry Estate', status: 'healthy', capacityPercent: 79, inventoryPercent: 75, criticalityScore: 60, connectedNodeIds: ['fac-02', 'fac-04'], coords: { x: 50, y: 870 } },

  // 4 Factories
  { id: 'fac-01', name: 'Central Precision Works', role: 'factory', location: 'Chakan Auto Corridor', status: 'healthy', capacityPercent: 88, inventoryPercent: 82, criticalityScore: 94, connectedNodeIds: ['war-01', 'war-02', 'war-03'], coords: { x: 260, y: 150 } },
  { id: 'fac-02', name: 'Coastal Tech Plant', role: 'factory', location: 'Chennai Industrial Belt', status: 'healthy', capacityPercent: 91, inventoryPercent: 86, criticalityScore: 89, connectedNodeIds: ['war-02', 'war-04', 'war-05'], coords: { x: 260, y: 360 } },
  { id: 'fac-03', name: 'Metro Assembly Alpha', role: 'factory', location: 'Noida Phase II', status: 'healthy', capacityPercent: 84, inventoryPercent: 78, criticalityScore: 88, connectedNodeIds: ['war-01', 'war-06', 'war-07'], coords: { x: 260, y: 570 } },
  { id: 'fac-04', name: 'Highland Automotive', role: 'factory', location: 'Baddi Industrial Park', status: 'healthy', capacityPercent: 87, inventoryPercent: 80, criticalityScore: 82, connectedNodeIds: ['war-03', 'war-07', 'war-08'], coords: { x: 260, y: 780 } },

  // 8 Warehouses
  { id: 'war-01', name: 'North Warehouse', role: 'warehouse', location: 'Bhiwandi Logistics Hub', status: 'healthy', capacityPercent: 78, inventoryPercent: 64, criticalityScore: 96, connectedNodeIds: ['hub-01', 'hub-03', 'hub-04'], notes: 'Critical single point of failure for northern regional distribution', coords: { x: 470, y: 120 } },
  { id: 'war-02', name: 'East Logistics Vault', role: 'warehouse', location: 'Kolkata Docks Complex', status: 'healthy', capacityPercent: 82, inventoryPercent: 71, criticalityScore: 78, connectedNodeIds: ['hub-02', 'hub-03'], coords: { x: 470, y: 240 } },
  { id: 'war-03', name: 'South Depot 4', role: 'warehouse', location: 'Hosur Logistics Park', status: 'healthy', capacityPercent: 85, inventoryPercent: 76, criticalityScore: 80, connectedNodeIds: ['hub-01', 'hub-02'], coords: { x: 470, y: 360 } },
  { id: 'war-04', name: 'West Central Warehouse', role: 'warehouse', location: 'Sanand Industrial Node', status: 'healthy', capacityPercent: 79, inventoryPercent: 68, criticalityScore: 76, connectedNodeIds: ['hub-01', 'hub-05'], coords: { x: 470, y: 480 } },
  { id: 'war-05', name: 'Gateway Central', role: 'warehouse', location: 'Nagpur Multi-Modal Hub', status: 'healthy', capacityPercent: 88, inventoryPercent: 82, criticalityScore: 86, connectedNodeIds: ['hub-02', 'hub-04', 'hub-05'], coords: { x: 470, y: 600 } },
  { id: 'war-06', name: 'Horizon Depot', role: 'warehouse', location: 'Gurugram Warehousing Strip', status: 'healthy', capacityPercent: 80, inventoryPercent: 73, criticalityScore: 79, connectedNodeIds: ['hub-03', 'hub-04'], coords: { x: 470, y: 720 } },
  { id: 'war-07', name: 'Pacific Storage Complex', role: 'warehouse', location: 'Navi Mumbai JNPT Zone', status: 'healthy', capacityPercent: 84, inventoryPercent: 77, criticalityScore: 81, connectedNodeIds: ['hub-01', 'hub-04'], coords: { x: 470, y: 840 } },
  { id: 'war-08', name: 'Valley Hub Depot', role: 'warehouse', location: 'Dehradun Valley Terminal', status: 'healthy', capacityPercent: 73, inventoryPercent: 62, criticalityScore: 65, connectedNodeIds: ['hub-04', 'hub-05'], coords: { x: 470, y: 940 } },

  // 5 Distribution Hubs
  { id: 'hub-01', name: 'Hub Alpha Metro', role: 'hub', location: 'Mumbai Central Gateway', status: 'healthy', capacityPercent: 88, inventoryPercent: 80, criticalityScore: 92, connectedNodeIds: ['cust-01', 'cust-02', 'cust-03', 'cust-04', 'cust-05'], coords: { x: 690, y: 160 } },
  { id: 'hub-02', name: 'Hub Beta Coastal', role: 'hub', location: 'Visakhapatnam Port Terminal', status: 'healthy', capacityPercent: 84, inventoryPercent: 79, criticalityScore: 86, connectedNodeIds: ['cust-06', 'cust-07', 'cust-08', 'cust-09'], coords: { x: 690, y: 350 } },
  { id: 'hub-03', name: 'Hub Gamma Inland', role: 'hub', location: 'Indore Transshipment Center', status: 'healthy', capacityPercent: 81, inventoryPercent: 75, criticalityScore: 84, connectedNodeIds: ['cust-10', 'cust-11', 'cust-12', 'cust-13', 'cust-14'], coords: { x: 690, y: 530 } },
  { id: 'hub-04', name: 'Hub Delta Northern', role: 'hub', location: 'Delhi NCR Freight Junction', status: 'healthy', capacityPercent: 86, inventoryPercent: 81, criticalityScore: 94, connectedNodeIds: ['cust-15', 'cust-16', 'cust-17', 'cust-18', 'cust-19', 'cust-20'], notes: 'Direct link for Order #SS1024 to Customer Priya Sharma', coords: { x: 690, y: 720 } },
  { id: 'hub-05', name: 'Hub Epsilon Express', role: 'hub', location: 'Jaipur Express Bypass', status: 'healthy', capacityPercent: 89, inventoryPercent: 83, criticalityScore: 83, connectedNodeIds: ['cust-21', 'cust-22', 'cust-23', 'cust-24'], coords: { x: 690, y: 900 } },

  // Representative Customers
  { id: 'cust-01', name: 'Priya Sharma (Zenith Electronics)', role: 'customer', location: 'New Delhi Ring Road', status: 'healthy', capacityPercent: 100, criticalityScore: 20, connectedNodeIds: [], notes: 'Recipient of Hero Shipment #SS1024', coords: { x: 910, y: 100 } },
  { id: 'cust-02', name: 'Apex Medical Systems', role: 'customer', location: 'Gurgaon Cyber City', status: 'healthy', capacityPercent: 100, criticalityScore: 20, connectedNodeIds: [], coords: { x: 910, y: 170 } },
  { id: 'cust-03', name: 'Metro Retail Mart', role: 'customer', location: 'Mumbai Andheri West', status: 'healthy', capacityPercent: 100, criticalityScore: 20, connectedNodeIds: [], coords: { x: 910, y: 240 } },
  { id: 'cust-04', name: 'Horizon Telecom Labs', role: 'customer', location: 'Navi Mumbai Vashi', status: 'healthy', capacityPercent: 100, criticalityScore: 20, connectedNodeIds: [], coords: { x: 910, y: 310 } },
  { id: 'cust-05', name: 'Quantum Energy Corp', role: 'customer', location: 'Pune Hinjewadi IT Park', status: 'healthy', capacityPercent: 100, criticalityScore: 20, connectedNodeIds: [], coords: { x: 910, y: 380 } },
  { id: 'cust-06', name: 'Coastal Defense Gear', role: 'customer', location: 'Chennai OMR Corridor', status: 'healthy', capacityPercent: 100, criticalityScore: 20, connectedNodeIds: [], coords: { x: 910, y: 450 } },
  { id: 'cust-07', name: 'Southern Agro Tech', role: 'customer', location: 'Coimbatore Peelamedu', status: 'healthy', capacityPercent: 100, criticalityScore: 20, connectedNodeIds: [], coords: { x: 910, y: 520 } },
  { id: 'cust-08', name: 'Bengaluru Silicon Labs', role: 'customer', location: 'Whitefield Bengaluru', status: 'healthy', capacityPercent: 100, criticalityScore: 20, connectedNodeIds: [], coords: { x: 910, y: 590 } },
  { id: 'cust-09', name: 'Central Power Grid Ops', role: 'customer', location: 'Bhopal Industrial Hub', status: 'healthy', capacityPercent: 100, criticalityScore: 20, connectedNodeIds: [], coords: { x: 910, y: 660 } },
  { id: 'cust-10', name: 'Vance Automotive Dealership', role: 'customer', location: 'Indore Bypass Depot', status: 'healthy', capacityPercent: 100, criticalityScore: 20, connectedNodeIds: [], coords: { x: 910, y: 730 } },
  { id: 'cust-15', name: 'Northern Solar Plants', role: 'customer', location: 'Noida Sector 62', status: 'healthy', capacityPercent: 100, criticalityScore: 20, connectedNodeIds: [], coords: { x: 910, y: 800 } },
  { id: 'cust-20', name: 'Himalayan Pharma Logistics', role: 'customer', location: 'Chandigarh Tech Park', status: 'healthy', capacityPercent: 100, criticalityScore: 20, connectedNodeIds: [], coords: { x: 910, y: 870 } },
];

export const INITIAL_EDGES: SupplyChainEdge[] = [
  // Supplier to Factory
  { id: 'e-sup01-fac01', from: 'sup-01', to: 'fac-01', distanceKm: 120, timeHours: 3.0, costInr: 4500, status: 'active' },
  { id: 'e-sup01-fac02', from: 'sup-01', to: 'fac-02', distanceKm: 420, timeHours: 9.5, costInr: 12000, status: 'active' },
  { id: 'e-sup02-fac01', from: 'sup-02', to: 'fac-01', distanceKm: 280, timeHours: 6.0, costInr: 8200, status: 'active' },
  { id: 'e-sup02-fac03', from: 'sup-02', to: 'fac-03', distanceKm: 560, timeHours: 12.0, costInr: 16500, status: 'active' },
  { id: 'e-sup03-fac02', from: 'sup-03', to: 'fac-02', distanceKm: 340, timeHours: 7.5, costInr: 9800, status: 'active' },
  { id: 'e-sup03-fac04', from: 'sup-03', to: 'fac-04', distanceKm: 410, timeHours: 9.0, costInr: 11400, status: 'active' },
  { id: 'e-sup04-fac02', from: 'sup-04', to: 'fac-02', distanceKm: 230, timeHours: 5.5, costInr: 6800, status: 'active' },
  { id: 'e-sup05-fac03', from: 'sup-05', to: 'fac-03', distanceKm: 180, timeHours: 4.0, costInr: 5200, status: 'active' },
  { id: 'e-sup05-fac04', from: 'sup-05', to: 'fac-04', distanceKm: 290, timeHours: 6.5, costInr: 8500, status: 'active' },
  { id: 'e-sup06-fac01', from: 'sup-06', to: 'fac-01', distanceKm: 310, timeHours: 7.0, costInr: 9100, status: 'active' },
  { id: 'e-sup06-fac04', from: 'sup-06', to: 'fac-04', distanceKm: 480, timeHours: 11.0, costInr: 14200, status: 'active' },
  { id: 'e-sup07-fac02', from: 'sup-07', to: 'fac-02', distanceKm: 390, timeHours: 8.5, costInr: 11000, status: 'active' },
  { id: 'e-sup08-fac01', from: 'sup-08', to: 'fac-01', distanceKm: 260, timeHours: 5.8, costInr: 7900, status: 'active' },
  { id: 'e-sup09-fac03', from: 'sup-09', to: 'fac-03', distanceKm: 210, timeHours: 4.6, costInr: 6100, status: 'active' },
  { id: 'e-sup10-fac04', from: 'sup-10', to: 'fac-04', distanceKm: 330, timeHours: 7.2, costInr: 9500, status: 'active' },
  { id: 'e-sup11-fac02', from: 'sup-11', to: 'fac-02', distanceKm: 190, timeHours: 4.2, costInr: 5700, status: 'active' },

  // Factory to Warehouse
  { id: 'e-fac01-war01', from: 'fac-01', to: 'war-01', distanceKm: 140, timeHours: 3.2, costInr: 5400, status: 'active' }, // Primary North Route
  { id: 'e-fac01-war02', from: 'fac-01', to: 'war-02', distanceKm: 380, timeHours: 8.5, costInr: 11200, status: 'active' },
  { id: 'e-fac01-war03', from: 'fac-01', to: 'war-03', distanceKm: 210, timeHours: 4.8, costInr: 6500, status: 'active' },
  { id: 'e-fac02-war02', from: 'fac-02', to: 'war-02', distanceKm: 290, timeHours: 6.5, costInr: 8800, status: 'active' },
  { id: 'e-fac02-war04', from: 'fac-02', to: 'war-04', distanceKm: 310, timeHours: 7.0, costInr: 9200, status: 'active' },
  { id: 'e-fac02-war05', from: 'fac-02', to: 'war-05', distanceKm: 240, timeHours: 5.2, costInr: 7100, status: 'active' },
  { id: 'e-fac03-war01', from: 'fac-03', to: 'war-01', distanceKm: 160, timeHours: 3.8, costInr: 5900, status: 'active' },
  { id: 'e-fac03-war06', from: 'fac-03', to: 'war-06', distanceKm: 110, timeHours: 2.5, costInr: 3900, status: 'active' },
  { id: 'e-fac03-war07', from: 'fac-03', to: 'war-07', distanceKm: 230, timeHours: 5.0, costInr: 6800, status: 'active' },
  { id: 'e-fac04-war03', from: 'fac-04', to: 'war-03', distanceKm: 350, timeHours: 8.0, costInr: 10400, status: 'active' },
  { id: 'e-fac04-war07', from: 'fac-04', to: 'war-07', distanceKm: 280, timeHours: 6.2, costInr: 8300, status: 'active' },
  { id: 'e-fac04-war08', from: 'fac-04', to: 'war-08', distanceKm: 130, timeHours: 3.0, costInr: 4400, status: 'active' },

  // Warehouse to Hub
  { id: 'e-war01-hub04', from: 'war-01', to: 'hub-04', distanceKm: 220, timeHours: 4.5, costInr: 7500, status: 'active' }, // HERO EDGE (TRK-401 Breakdown route)
  { id: 'e-war01-hub01', from: 'war-01', to: 'hub-01', distanceKm: 110, timeHours: 2.4, costInr: 4200, status: 'active' },
  { id: 'e-war01-hub03', from: 'war-01', to: 'hub-03', distanceKm: 290, timeHours: 6.0, costInr: 8900, status: 'active' },
  
  // Backup / Alternative bypass edges between Warehouses and Hubs (used in Dijkstra Recovery)
  { id: 'e-war06-hub04', from: 'war-06', to: 'hub-04', distanceKm: 160, timeHours: 3.2, costInr: 5800, status: 'active' }, // Alternative 1
  { id: 'e-war07-hub04', from: 'war-07', to: 'hub-04', distanceKm: 240, timeHours: 5.0, costInr: 7900, status: 'active' }, // Alternative 2
  { id: 'e-war05-hub04', from: 'war-05', to: 'hub-04', distanceKm: 310, timeHours: 6.8, costInr: 9600, status: 'active' }, // Alternative 3
  { id: 'e-hub03-hub04', from: 'hub-03', to: 'hub-04', distanceKm: 180, timeHours: 3.5, costInr: 6200, status: 'active' }, // Cross-hub recovery link!
  { id: 'e-hub01-hub03', from: 'hub-01', to: 'hub-03', distanceKm: 210, timeHours: 4.2, costInr: 6800, status: 'active' },
  { id: 'e-hub05-hub04', from: 'hub-05', to: 'hub-04', distanceKm: 190, timeHours: 3.8, costInr: 6400, status: 'active' },
  
  { id: 'e-war02-hub02', from: 'war-02', to: 'hub-02', distanceKm: 180, timeHours: 4.0, costInr: 6200, status: 'active' },
  { id: 'e-war02-hub03', from: 'war-02', to: 'hub-03', distanceKm: 270, timeHours: 5.8, costInr: 8400, status: 'active' },
  { id: 'e-war03-hub01', from: 'war-03', to: 'hub-01', distanceKm: 250, timeHours: 5.2, costInr: 7800, status: 'active' },
  { id: 'e-war03-hub02', from: 'war-03', to: 'hub-02', distanceKm: 320, timeHours: 6.9, costInr: 9900, status: 'active' },
  { id: 'e-war04-hub01', from: 'war-04', to: 'hub-01', distanceKm: 230, timeHours: 4.9, costInr: 7300, status: 'active' },
  { id: 'e-war04-hub05', from: 'war-04', to: 'hub-05', distanceKm: 210, timeHours: 4.4, costInr: 6700, status: 'active' },
  { id: 'e-war05-hub02', from: 'war-05', to: 'hub-02', distanceKm: 300, timeHours: 6.4, costInr: 9400, status: 'active' },
  { id: 'e-war05-hub05', from: 'war-05', to: 'hub-05', distanceKm: 280, timeHours: 6.0, costInr: 8800, status: 'active' },
  { id: 'e-war08-hub04', from: 'war-08', to: 'hub-04', distanceKm: 260, timeHours: 5.5, costInr: 8100, status: 'active' },
  { id: 'e-war08-hub05', from: 'war-08', to: 'hub-05', distanceKm: 240, timeHours: 5.1, costInr: 7600, status: 'active' },

  // Hub to Customer
  { id: 'e-hub04-cust01', from: 'hub-04', to: 'cust-01', distanceKm: 45, timeHours: 1.2, costInr: 1800, status: 'active' }, // Final leg for SS1024
  { id: 'e-hub04-cust02', from: 'hub-04', to: 'cust-02', distanceKm: 38, timeHours: 1.0, costInr: 1500, status: 'active' },
  { id: 'e-hub01-cust03', from: 'hub-01', to: 'cust-03', distanceKm: 28, timeHours: 0.8, costInr: 1200, status: 'active' },
  { id: 'e-hub01-cust04', from: 'hub-01', to: 'cust-04', distanceKm: 32, timeHours: 0.9, costInr: 1350, status: 'active' },
  { id: 'e-hub01-cust05', from: 'hub-01', to: 'cust-05', distanceKm: 55, timeHours: 1.4, costInr: 2100, status: 'active' },
  { id: 'e-hub02-cust06', from: 'hub-02', to: 'cust-06', distanceKm: 40, timeHours: 1.1, costInr: 1600, status: 'active' },
  { id: 'e-hub02-cust07', from: 'hub-02', to: 'cust-07', distanceKm: 62, timeHours: 1.6, costInr: 2400, status: 'active' },
  { id: 'e-hub03-cust10', from: 'hub-03', to: 'cust-10', distanceKm: 35, timeHours: 0.9, costInr: 1400, status: 'active' },
  { id: 'e-hub04-cust15', from: 'hub-04', to: 'cust-15', distanceKm: 42, timeHours: 1.1, costInr: 1700, status: 'active' },
  { id: 'e-hub04-cust20', from: 'hub-04', to: 'cust-20', distanceKm: 70, timeHours: 1.8, costInr: 2800, status: 'active' },
];

export const INITIAL_DRIVERS: DriverInfo[] = [
  { id: 'drv-01', name: 'Rajesh Kumar', phone: '+91 98201 44210', vehicleNumber: 'MH-04-TRK-401', status: 'on_delivery', activeShipmentId: 'SS1024', assignedHubId: 'hub-04', currentStep: 'in_transit' },
  { id: 'drv-02', name: 'David Miller', phone: '+91 98451 92831', vehicleNumber: 'KA-01-CV-882', status: 'available', assignedHubId: 'hub-04', currentStep: 'assigned' },
  { id: 'drv-03', name: 'Elena Rostova', phone: '+91 98112 55902', vehicleNumber: 'DL-01-HA-904', status: 'available', assignedHubId: 'hub-04', currentStep: 'assigned' },
  { id: 'drv-04', name: 'Marcus Vance', phone: '+91 97233 11840', vehicleNumber: 'GJ-06-BT-312', status: 'on_delivery', activeShipmentId: 'SS1025', assignedHubId: 'hub-01', currentStep: 'in_transit' },
  { id: 'drv-05', name: 'Sunita Rao', phone: '+91 94481 77319', vehicleNumber: 'TN-07-LK-720', status: 'available', assignedHubId: 'hub-02', currentStep: 'assigned' },
  { id: 'drv-06', name: 'Alex Chen', phone: '+91 98300 44912', vehicleNumber: 'WB-02-TX-501', status: 'available', assignedHubId: 'hub-03', currentStep: 'assigned' },
  { id: 'drv-07', name: 'Ahmed Malik', phone: '+91 98991 22340', vehicleNumber: 'HR-26-TR-119', status: 'available', assignedHubId: 'hub-04', currentStep: 'assigned' },
  { id: 'drv-08', name: 'Vikram Joshi', phone: '+91 98220 88314', vehicleNumber: 'MH-12-FL-633', status: 'available', assignedHubId: 'hub-01', currentStep: 'assigned' },
  { id: 'drv-09', name: 'Pooja Nair', phone: '+91 94470 33819', vehicleNumber: 'KL-07-VT-440', status: 'available', assignedHubId: 'hub-02', currentStep: 'assigned' },
  { id: 'drv-10', name: 'Gurpreet Singh', phone: '+91 98140 66201', vehicleNumber: 'PB-10-MK-808', status: 'available', assignedHubId: 'hub-04', currentStep: 'assigned' },
  { id: 'drv-11', name: 'Santosh Meena', phone: '+91 94140 12890', vehicleNumber: 'RJ-14-GX-992', status: 'available', assignedHubId: 'hub-05', currentStep: 'assigned' },
  { id: 'drv-12', name: 'Deepak Patel', phone: '+91 98250 49120', vehicleNumber: 'GJ-01-AX-701', status: 'available', assignedHubId: 'hub-05', currentStep: 'assigned' },
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  // Hero Shipment SS1024 requested in user spec
  {
    id: 'SS1024',
    trackingNumber: 'SS1024-DEL-IND',
    customerName: 'Priya Sharma (Zenith Electronics)',
    customerId: 'cust-01',
    supplierId: 'sup-01',
    factoryId: 'fac-01',
    warehouseId: 'war-01', // North Warehouse
    hubId: 'hub-04',        // Hub Delta
    driverId: 'drv-01',     // Rajesh Kumar
    itemDescription: 'High-Torque Actuators & Precision Micro-Sensors (Batch A-4)',
    quantityUnits: 250,
    valueInr: 850000,
    status: 'in_transit',
    currentLocationName: 'North Warehouse Highway Bay 4',
    currentNodeId: 'war-01',
    destinationName: 'New Delhi Distribution Center (Customer: Priya Sharma)',
    originalEta: 'Today, 6:30 PM',
    milestones: {
      factory: true,
      warehouse: true,
      hub: false,
      customer: false,
    },
  },
  {
    id: 'SS1025',
    trackingNumber: 'SS1025-MUM-BOM',
    customerName: 'Metro Retail Mart',
    customerId: 'cust-03',
    supplierId: 'sup-02',
    factoryId: 'fac-01',
    warehouseId: 'war-01',
    hubId: 'hub-01',
    driverId: 'drv-04',
    itemDescription: 'Industrial Logic Controllers & Silicon Wafers',
    quantityUnits: 120,
    valueInr: 640000,
    status: 'in_transit',
    currentLocationName: 'En route to Hub Alpha',
    currentNodeId: 'hub-01',
    destinationName: 'Mumbai Andheri West',
    originalEta: 'Today, 5:00 PM',
    milestones: {
      factory: true,
      warehouse: true,
      hub: true,
      customer: false,
    },
  },
  {
    id: 'SS1026',
    trackingNumber: 'SS1026-CHN-MAA',
    customerName: 'Coastal Defense Gear',
    customerId: 'cust-06',
    supplierId: 'sup-03',
    factoryId: 'fac-02',
    warehouseId: 'war-02',
    hubId: 'hub-02',
    itemDescription: 'Reinforced Composite Polymer Panels',
    quantityUnits: 400,
    valueInr: 920000,
    status: 'in_transit',
    currentLocationName: 'Kolkata Docks Complex',
    currentNodeId: 'war-02',
    destinationName: 'Chennai Port Facility',
    originalEta: 'Tomorrow, 11:00 AM',
    milestones: {
      factory: true,
      warehouse: true,
      hub: false,
      customer: false,
    },
  },
  {
    id: 'SS1027',
    trackingNumber: 'SS1027-BLR-SBC',
    customerName: 'Bengaluru Silicon Labs',
    customerId: 'cust-08',
    supplierId: 'sup-06',
    factoryId: 'fac-02',
    warehouseId: 'war-03',
    hubId: 'hub-02',
    itemDescription: 'Embedded Multi-Axis Accelerometers',
    quantityUnits: 300,
    valueInr: 450000,
    status: 'in_transit',
    currentLocationName: 'Hosur Logistics Park',
    currentNodeId: 'war-03',
    destinationName: 'Whitefield Bengaluru',
    originalEta: 'Today, 8:15 PM',
    milestones: {
      factory: true,
      warehouse: true,
      hub: false,
      customer: false,
    },
  },
  {
    id: 'SS1028',
    trackingNumber: 'SS1028-DEL-NOI',
    customerName: 'Northern Solar Plants',
    customerId: 'cust-15',
    supplierId: 'sup-05',
    factoryId: 'fac-03',
    warehouseId: 'war-06',
    hubId: 'hub-04',
    itemDescription: 'Tempered Anti-Reflective Solar Glass Substrates',
    quantityUnits: 550,
    valueInr: 1200000,
    status: 'in_transit',
    currentLocationName: 'Gurugram Warehousing Strip',
    currentNodeId: 'war-06',
    destinationName: 'Noida Solar Tech Facility',
    originalEta: 'Tomorrow, 9:30 AM',
    milestones: {
      factory: true,
      warehouse: true,
      hub: false,
      customer: false,
    },
  },
  {
    id: 'SS1029',
    trackingNumber: 'SS1029-PUN-PCMC',
    customerName: 'Quantum Energy Corp',
    customerId: 'cust-05',
    supplierId: 'sup-08',
    factoryId: 'fac-01',
    warehouseId: 'war-04',
    hubId: 'hub-01',
    itemDescription: 'Cast Steel Housing Brackets',
    quantityUnits: 180,
    valueInr: 390000,
    status: 'pending',
    currentLocationName: 'Sanand Industrial Node',
    currentNodeId: 'war-04',
    destinationName: 'Pune Hinjewadi IT Park',
    originalEta: 'Oct 31, 3:00 PM',
    milestones: {
      factory: true,
      warehouse: true,
      hub: false,
      customer: false,
    },
  },
  {
    id: 'SS1030',
    trackingNumber: 'SS1030-DEL-CYB',
    customerName: 'Apex Medical Systems',
    customerId: 'cust-02',
    supplierId: 'sup-01',
    factoryId: 'fac-01',
    warehouseId: 'war-01',
    hubId: 'hub-04',
    itemDescription: 'Surgical Grade Titanium Rods & Stepper Motors',
    quantityUnits: 150,
    valueInr: 780000,
    status: 'in_transit',
    currentLocationName: 'North Warehouse Depot',
    currentNodeId: 'war-01',
    destinationName: 'Gurgaon Cyber City Medical Wing',
    originalEta: 'Today, 7:00 PM',
    milestones: {
      factory: true,
      warehouse: true,
      hub: false,
      customer: false,
    },
  },
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-01',
    title: 'North Highway Fleet Routine Maintenance',
    description: 'Scheduled lane closure between Chakan and Bhiwandi between 02:00 and 04:00. Minimal impact anticipated.',
    severity: 'LOW',
    targetRoles: ['driver', 'hub', 'admin'],
    timestamp: '10:45 AM',
    resolved: false,
    priorityScore: 25,
  },
  {
    id: 'alt-02',
    title: 'Hub Beta Buffer Capacity at 84%',
    description: 'Incoming shipment surge from Coastal Tech Plant. Staging bay 3 allocated for fast-track cross-docking.',
    severity: 'MEDIUM',
    targetRoles: ['hub', 'warehouse', 'admin'],
    timestamp: '11:05 AM',
    nodeId: 'hub-02',
    resolved: false,
    priorityScore: 55,
  },
];
