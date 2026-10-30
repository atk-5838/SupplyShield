import React from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import { Role } from '../../types';
import {
  Factory,
  Warehouse,
  Truck,
  ShieldAlert,
  Boxes,
  Users,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Sparkles,
  Play,
} from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const { navigateToRoleLogin, startGuidedDemo } = useSupplyChain();

  const roleCards: {
    role: Role;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    colorClasses: { bg: string; text: string; border: string; button: string };
    deviceTarget: string;
    badge: string;
  }[] = [
    {
      role: 'supplier',
      title: 'Supplier',
      subtitle: 'Manage material inventory, order fulfillment, and production line deliveries.',
      icon: <Boxes className="w-6 h-6" />,
      colorClasses: {
        bg: 'bg-emerald-50/50',
        text: 'text-emerald-700',
        border: 'border-emerald-200/80',
        button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      },
      deviceTarget: 'Mobile & Desktop',
      badge: 'Material Inbound',
    },
    {
      role: 'factory',
      title: 'Factory',
      subtitle: 'Monitor live production lines, raw material buffer stocks, and intake schedules.',
      icon: <Factory className="w-6 h-6" />,
      colorClasses: {
        bg: 'bg-indigo-50/50',
        text: 'text-indigo-700',
        border: 'border-indigo-200/80',
        button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      },
      deviceTarget: 'Tablet & Desktop',
      badge: 'Assembly & Production',
    },
    {
      role: 'warehouse',
      title: 'Warehouse',
      subtitle: 'Control barcode scanning, goods intake receipts, bay storage, and driver dispatch.',
      icon: <Warehouse className="w-6 h-6" />,
      colorClasses: {
        bg: 'bg-amber-50/50',
        text: 'text-amber-700',
        border: 'border-amber-200/80',
        button: 'bg-amber-600 hover:bg-amber-700 text-white',
      },
      deviceTarget: 'Tablet & Mobile',
      badge: 'Storage & Fulfillment',
    },
    {
      role: 'hub',
      title: 'Distribution Hub',
      subtitle: 'Coordinate dispatch manifests, assign registered drivers, and verify recovery routes.',
      icon: <Building2 className="w-6 h-6" />,
      colorClasses: {
        bg: 'bg-cyan-50/50',
        text: 'text-cyan-700',
        border: 'border-cyan-200/80',
        button: 'bg-cyan-600 hover:bg-cyan-700 text-white',
      },
      deviceTarget: 'Tablet & Desktop',
      badge: 'Logistics Dispatch',
    },
    {
      role: 'driver',
      title: 'Driver',
      subtitle: 'Mobile field portal to confirm pickups, navigate assignments, and report disruptions.',
      icon: <Truck className="w-6 h-6" />,
      colorClasses: {
        bg: 'bg-orange-50/50',
        text: 'text-orange-700',
        border: 'border-orange-200/80',
        button: 'bg-orange-600 hover:bg-orange-700 text-white',
      },
      deviceTarget: 'Mobile-First',
      badge: 'Highway & Fleet',
    },
    {
      role: 'customer',
      title: 'Customer',
      subtitle: 'Live order tracking with transparent milestone progress and instant delay updates.',
      icon: <Users className="w-6 h-6" />,
      colorClasses: {
        bg: 'bg-purple-50/50',
        text: 'text-purple-700',
        border: 'border-purple-200/80',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
      },
      deviceTarget: 'Mobile-First',
      badge: 'Shipment Tracking',
    },
    {
      role: 'admin',
      title: 'Administrator',
      subtitle: 'Global Command Center: network health, BFS impact graph, and Dijkstra recovery.',
      icon: <ShieldAlert className="w-6 h-6" />,
      colorClasses: {
        bg: 'bg-slate-900',
        text: 'text-blue-400',
        border: 'border-slate-800',
        button: 'bg-blue-600 hover:bg-blue-500 text-white',
      },
      deviceTarget: 'Desktop & Tablet',
      badge: 'Command & DSA Engine',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden dark-grid-bg">
      {/* Ambient background light gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Welcome Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10 w-full text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-medium mb-6 backdrop-blur-md shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>AUTONOMOUS RESILIENCE PLATFORM · GRAPH & HEAP ENGINE</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-sans">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">SupplyShield</span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-slate-300 font-medium italic max-w-2xl mx-auto">
          "Your supply chain, connected and protected."
        </p>

        <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          See the problem. Understand the impact. Recover faster. Select your operational tier to launch your dedicated role environment.
        </p>

        {/* Live Demo Quick Action */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={startGuidedDemo}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Launch Complete 12-Step Demonstration</span>
          </button>
        </div>
      </div>

      {/* Seven Independent Role Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 w-full relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {roleCards.map((card) => {
            const isAdmin = card.role === 'admin';
            return (
              <div
                key={card.role}
                className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isAdmin
                    ? 'bg-gradient-to-b from-slate-900 to-indigo-950/80 border-indigo-500/40 hover:border-indigo-400 sm:col-span-2 lg:col-span-1 shadow-lg shadow-indigo-950/40'
                    : 'bg-slate-900/80 backdrop-blur-md border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                        isAdmin
                          ? 'bg-blue-600 text-white shadow-blue-500/30'
                          : `${card.colorClasses.bg} ${card.colorClasses.text}`
                      }`}
                    >
                      {card.icon}
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono text-slate-400 block">{card.deviceTarget}</span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isAdmin ? 'text-blue-400' : 'text-slate-400'
                        }`}
                      >
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  <h3
                    className={`text-lg font-bold tracking-tight mb-2 ${
                      isAdmin ? 'text-white' : 'text-slate-100'
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p className="text-xs leading-relaxed mb-6 text-slate-400">
                    {card.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => navigateToRoleLogin(card.role)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-md ${card.colorClasses.button}`}
                  >
                    <span>Login to {card.title} Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Architecture & DSA summary box */}
        <div className="mt-12 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Data Structures & Algorithmic Engine Backbone
              </h4>
              <p className="text-xs text-slate-400">Live deterministic computation across all supply chain links</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <span className="font-bold text-white block font-mono text-[11px]">Graph Network</span>
              <span className="text-slate-400 text-[11px]">Adjacency lists & weights</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <span className="font-bold text-white block font-mono text-[11px]">BFS Traversal</span>
              <span className="text-slate-400 text-[11px]">Downstream impact blast radius</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <span className="font-bold text-white block font-mono text-[11px]">Dijkstra Shortest</span>
              <span className="text-slate-400 text-[11px]">Min cost/time reroute path</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <span className="font-bold text-white block font-mono text-[11px]">Priority Queue</span>
              <span className="text-slate-400 text-[11px]">Max-Heap alert scheduling</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <span className="font-bold text-white block font-mono text-[11px]">Union-Find (DSU)</span>
              <span className="text-slate-400 text-[11px]">Connected components</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <span className="font-bold text-white block font-mono text-[11px]">Centrality Score</span>
              <span className="text-slate-400 text-[11px]">Single points of failure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        SupplyShield · Autonomous Supply Chain Resilience & Monitoring · Simulated PBL Evaluation Environment
      </footer>
    </div>
  );
};
