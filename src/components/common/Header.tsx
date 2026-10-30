import React, { useState } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import { Role } from '../../types';
import { Shield, LogOut, ChevronDown, User, Activity, Sparkles, Radio } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRole,
    currentUser,
    logout,
    switchRoleQuick,
    navigateToWelcome,
    networkHealthPercent,
    disruption,
  } = useSupplyChain();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const rolesList: { id: Role; label: string; roleDesc: string; iconBg: string }[] = [
    { id: 'supplier', label: 'Supplier', roleDesc: 'Apex Metals (SUP-01)', iconBg: 'bg-emerald-500' },
    { id: 'factory', label: 'Factory', roleDesc: 'Precision Works (FAC-01)', iconBg: 'bg-indigo-500' },
    { id: 'warehouse', label: 'Warehouse', roleDesc: 'North Warehouse (WAR-01)', iconBg: 'bg-amber-500' },
    { id: 'hub', label: 'Hub', roleDesc: 'Hub Delta (HUB-04)', iconBg: 'bg-cyan-500' },
    { id: 'driver', label: 'Driver', roleDesc: 'Rajesh Kumar (TRK-401)', iconBg: 'bg-orange-500' },
    { id: 'customer', label: 'Customer', roleDesc: 'Priya Sharma (#SS1024)', iconBg: 'bg-purple-500' },
    { id: 'admin', label: 'Administrator', roleDesc: 'Command Center', iconBg: 'bg-blue-600' },
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark with sleek shield and glowing beacon */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={navigateToWelcome}
            className="flex items-center gap-3 text-left group transition-all"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 fill-white/20" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 ring-2 ring-emerald-400/30" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-white tracking-tight font-mono">
                  SUPPLYSHIELD
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                  v2.6
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider block">
                RESILIENCE ENGINE
              </span>
            </div>
          </button>

          {/* Network Health Indicator Pill */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  disruption?.isActive
                    ? 'bg-rose-500 shadow-sm shadow-rose-500 animate-pulse'
                    : 'bg-emerald-400 shadow-sm shadow-emerald-400'
                }`}
              />
              <span className="text-[11px] font-mono text-slate-300">
                Health:{' '}
                <strong
                  className={`tabular-nums ${
                    disruption?.isActive ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {networkHealthPercent}%
                </strong>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">
                {disruption?.isActive ? 'At Risk' : 'Nominal'}
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation & Role Switcher Pills */}
        {currentRole && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 overflow-x-auto">
            {rolesList.map((r) => {
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => switchRoleQuick(r.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Zone 3: Primary Action / User Profile & Logout */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="relative">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/80 hover:bg-slate-800 transition-all text-left group"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-xs font-bold font-mono shadow-xs">
                    {currentRole?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left pr-1">
                    <p className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[140px] group-hover:text-white">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-blue-400 font-mono leading-tight capitalize">
                      {currentUser.role} portal
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl border border-slate-800 hover:border-rose-900/50 transition-all"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Switch Dropdown */}
              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-800/80 mb-1.5">
                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Cross-Role Switcher
                    </p>
                    <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                      {currentUser.assignedEntityName}
                    </p>
                  </div>
                  <div className="space-y-0.5 px-1.5">
                    {rolesList.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          switchRoleQuick(r.id);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          currentRole === r.id
                            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full ${r.iconBg}`} />
                          <div>
                            <span className="block font-medium">{r.label}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">
                              {r.roleDesc}
                            </span>
                          </div>
                        </div>
                        {currentRole === r.id && (
                          <span className="text-[10px] font-mono text-blue-400 font-bold">
                            ONLINE
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-800 mt-2 pt-1.5 px-2">
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out to Welcome Portal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={navigateToWelcome}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/30"
            >
              Role Portals
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

