import React, { useState } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import {
  Truck,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowRight,
  PhoneCall,
  Check,
  Navigation,
  Info,
} from 'lucide-react';

export const DriverDashboard: React.FC = () => {
  const {
    drivers,
    shipments,
    advanceDriverStep,
    reportDriverProblem,
    recoveryPlan,
    disruption,
    addToast,
  } = useSupplyChain();

  // Active driver: Rajesh Kumar (TRK-401)
  const myDriver = drivers.find((d) => d.id === 'drv-01') || drivers[0];

  // Active shipment: SS1024
  const activeShipment =
    shipments.find((s) => s.id === (myDriver.activeShipmentId || 'SS1024')) || shipments[0];

  const [showProblemModal, setShowProblemModal] = useState(false);
  const [problemDetails, setProblemDetails] = useState('');
  const [isLocationShared, setIsLocationShared] = useState(true);

  const stepsList: {
    key: typeof myDriver.currentStep;
    label: string;
    actionLabel: string;
  }[] = [
    { key: 'assigned', label: 'Assignment Received', actionLabel: 'Accept Delivery' },
    { key: 'accepted', label: 'Delivery Accepted', actionLabel: 'Confirm Pickup' },
    { key: 'picked_up', label: 'Pickup Completed', actionLabel: 'Start Delivery (On the Way)' },
    { key: 'in_transit', label: 'On the Way', actionLabel: 'Confirm Delivery' },
    { key: 'delivered', label: 'Delivered', actionLabel: 'Delivery Completed' },
  ];

  const currentStepIndex = stepsList.findIndex((s) => s.key === myDriver.currentStep);
  const isDelivered = myDriver.currentStep === 'delivered';
  const isBreakdown = myDriver.status === 'breakdown';

  const handleReportProblem = (
    problemType: 'Vehicle Breakdown' | 'Road Blockage' | 'Accident' | 'Delivery Delay' | 'Other'
  ) => {
    reportDriverProblem(myDriver.id, problemType, problemDetails || `${problemType} reported at Northern Highway KM 48`);
    setShowProblemModal(false);
  };

  return (
    <div className="py-6 px-4 flex flex-col justify-center items-center">
      {/* Sleek Mobile App Shell Container */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 flex flex-col justify-between min-h-[640px]">
        <div>
          {/* Driver Safety Banner */}
          <div className="mb-4 p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3 text-xs text-slate-200 shadow-sm">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <span className="leading-snug text-[11px] font-sans">
              <strong>Driver Safety Protocol:</strong> Park safely before tapping delivery updates or reporting road incidents.
            </span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-orange-500/20">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  COMMERCIAL CARRIER
                </span>
                <h1 className="text-lg font-black text-slate-900 leading-tight font-sans">
                  {myDriver.name}
                </h1>
                <span className="text-xs font-mono text-slate-500 font-semibold">
                  {myDriver.vehicleNumber}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${
                  isBreakdown
                    ? 'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isBreakdown ? 'bg-rose-600' : 'bg-emerald-500'}`} />
                {isBreakdown ? 'BREAKDOWN' : 'ON ROUTE'}
              </span>
            </div>
          </div>

          {/* Updated Instructions Banner if Recovery Route Approved */}
          {recoveryPlan?.approved && activeShipment.recoveryPath && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-950 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-800">
                <Navigation className="w-4 h-4 text-blue-600 animate-bounce" />
                <span className="font-mono uppercase tracking-wider">UPDATED REROUTE APPROVED</span>
              </div>
              <p className="text-xs mt-1 text-blue-900 leading-relaxed font-sans">
                Bypass authorized: <strong>{activeShipment.recoveryPath.join(' → ')}</strong>. Verified destination ETA: 8:45 PM.
              </p>
            </div>
          )}

          {/* Breakdown Incident Status Banner */}
          {isBreakdown && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-xs text-rose-800">
                <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
                <span className="font-mono uppercase tracking-wider">TELEMETRY: INCIDENT ACTIVE</span>
              </div>
              <p className="text-xs mt-1 text-rose-900 leading-relaxed font-sans">
                Northern highway stoppage logged. Regional dispatcher at Hub Delta and Network Admin are calculating Dijkstra bypass.
              </p>
            </div>
          )}

          {/* MY DELIVERY CARD */}
          <div className="mt-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                ACTIVE ASSIGNMENT
              </span>
              <span className="text-xs font-mono font-black text-blue-600">
                Order #{activeShipment.id}
              </span>
            </div>

            <div className="space-y-2.5 mt-3">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Pickup</span>
                  <span className="text-xs font-bold text-slate-900">
                    Warehouse A (North Warehouse Bhiwandi)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-lg bg-rose-100 text-rose-700 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Destination</span>
                  <span className="text-xs font-bold text-slate-900">
                    Hub C (Hub Delta Freight Junction)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Expected Arrival</span>
                  <span className="text-xs font-extrabold text-blue-600 font-mono tabular-nums">
                    {activeShipment.updatedEta || '4:30 PM (Today)'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 font-sans">
                <span className="text-slate-400">Cargo: </span>
                <strong className="text-slate-800">{activeShipment.itemDescription}</strong>
              </div>
            </div>
          </div>

          {/* DELIVERY PROGRESS STEPPER */}
          <div className="mt-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-3">
              Delivery Progress
            </span>

            <div className="space-y-2.5">
              {stepsList.map((st, idx) => {
                const isPast = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={st.key} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-all ${
                        isPast
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md shadow-blue-500/30'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div className="flex-1">
                      <span
                        className={`text-xs block ${
                          isCurrent
                            ? 'font-black text-slate-900'
                            : isPast
                            ? 'font-semibold text-slate-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Touch Actions at Bottom */}
        <div className="mt-6 space-y-2.5 pt-4 border-t border-slate-100">
          {!isDelivered ? (
            <button
              onClick={() => advanceDriverStep(myDriver.id)}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-mono"
            >
              <span>{stepsList[currentStepIndex]?.actionLabel || 'Next Delivery Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-full py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Manifest Completed & Archived</span>
            </div>
          )}

          {/* Report a Problem Button */}
          <button
            onClick={() => setShowProblemModal(true)}
            className="w-full py-3 bg-rose-50 hover:bg-rose-100 active:scale-[0.98] text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Report Stoppage / Incident</span>
          </button>
        </div>
      </div>

      {/* Problem Reporting Modal with 4 Large Buttons + Other */}
      {showProblemModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-slate-900 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-extrabold text-sm">Report Transport Disruption</h3>
              </div>
              <button
                onClick={() => setShowProblemModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Select incident type. This will instantly calculate alternative recovery routes and notify your hub manager:
            </p>

            {/* Four Large Buttons required by user spec */}
            <div className="space-y-2.5">
              <button
                onClick={() => handleReportProblem('Vehicle Breakdown')}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-between shadow-xs transition-colors"
              >
                <span>Vehicle Breakdown (Engine / Tire)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleReportProblem('Road Blockage')}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-between shadow-xs transition-colors"
              >
                <span>Road Blockage (Landslide / Highway Construction)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleReportProblem('Accident')}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-between shadow-xs transition-colors"
              >
                <span>Accident Ahead / Severe Congestion</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleReportProblem('Delivery Delay')}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-between shadow-xs transition-colors"
              >
                <span>Weather or Toll Plaza Delay (+1.5 hrs)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleReportProblem('Other')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-between transition-colors"
              >
                <span>Other Incident Reason</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                Emergency Hotline: 1800-SUPPLY
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
