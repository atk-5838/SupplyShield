import React, { useState } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import { AlertItem, AlertSeverity, Role } from '../../types';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  Layers,
  CheckCircle2,
  Filter,
  ShieldAlert,
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { prioritizedAlerts } = useSupplyChain();
  const [selectedSeverity, setSelectedSeverity] = useState<'ALL' | AlertSeverity>('ALL');
  const [selectedRole, setSelectedRole] = useState<'ALL' | Role>('ALL');

  const filteredAlerts = prioritizedAlerts.filter((a) => {
    const matchesSeverity = selectedSeverity === 'ALL' || a.severity === selectedSeverity;
    const matchesRole = selectedRole === 'ALL' || a.targetRoles.includes(selectedRole);
    return matchesSeverity && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header and DSA Priority Queue Explanation */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Priority Queue Engine (Max-Heap)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold font-mono">
              O(log N) Bubble Scheduling
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Network Operations & Incident Alert Stream
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Incidents sorted dynamically by operational impact, downstream customer severity, and route criticality.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as any)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low / Routine</option>
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800"
          >
            <option value="ALL">All Roles</option>
            <option value="driver">Driver Alerts</option>
            <option value="hub">Hub Dispatch Alerts</option>
            <option value="warehouse">Warehouse Alerts</option>
            <option value="factory">Factory Supply Alerts</option>
            <option value="supplier">Supplier Alerts</option>
            <option value="customer">Customer Alerts</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
            No active alerts matching the selected filters.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            let badgeBg = 'bg-slate-100 text-slate-700 border-slate-200';
            let icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;

            if (alert.severity === 'CRITICAL') {
              badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
              icon = <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />;
            } else if (alert.severity === 'HIGH') {
              badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
              icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
            } else if (alert.severity === 'MEDIUM') {
              badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
              icon = <Clock className="w-5 h-5 text-blue-600 shrink-0" />;
            }

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border bg-white shadow-xs flex items-start justify-between gap-4 transition-all hover:border-slate-300 ${
                  alert.severity === 'CRITICAL' ? 'border-rose-300 ring-1 ring-rose-100' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {icon}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badgeBg}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-slate-400 font-mono tabular-nums">
                        Priority Score: {alert.priorityScore}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">{alert.timestamp}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed max-w-3xl">
                      {alert.description}
                    </p>

                    {/* Target Roles Tags */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] text-slate-400">Target Audiences:</span>
                      {alert.targetRoles.map((r) => (
                        <span
                          key={r}
                          className="text-[10px] font-semibold text-slate-600 uppercase bg-slate-100 px-1.5 py-0.5 rounded"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`text-[11px] font-semibold ${
                      alert.resolved ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {alert.resolved ? 'RESOLVED' : 'ACTIVE QUEUE'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
