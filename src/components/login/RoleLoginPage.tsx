import React, { useState } from 'react';
import { useSupplyChain } from '../../context/SupplyChainContext';
import { Role } from '../../types';
import { DEMO_CREDENTIALS } from '../../data/mockData';
import {
  Boxes,
  Factory,
  Warehouse,
  Building2,
  Truck,
  Users,
  ShieldAlert,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Check,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface RoleLoginPageProps {
  role: Role;
}

export const RoleLoginPage: React.FC<RoleLoginPageProps> = ({ role }) => {
  const { loginAsRole, navigateToWelcome, addToast } = useSupplyChain();

  const cred = DEMO_CREDENTIALS[role];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);

  // Quick fill demo credentials for this specific role
  const handleFillDemo = () => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError(null);
    addToast('Demo Credentials Loaded', `Loaded credentials for ${cred.name}`, 'info');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide an email address or employee ID');
      return;
    }
    if (!password.trim()) {
      setError('Please provide your secure password');
      return;
    }

    // In demo authentication: accepts demo password or allows quick sign in
    if (password === cred.password || password.length >= 4) {
      setError(null);
      loginAsRole(role);
    } else {
      setError(`Invalid credentials for ${cred.title}. Use the "Fill Demo Credentials" helper below.`);
    }
  };

  // Role-specific config and themes
  const roleConfig: Record<
    Role,
    {
      heading: string;
      subheading: string;
      systemTag: string;
      icon: React.ReactNode;
      accentBg: string;
      accentText: string;
      btnBg: string;
      deviceContext: string;
    }
  > = {
    supplier: {
      heading: 'Supplier Portal Authentication',
      subheading: 'Access inbound material inventory, purchase orders, and factory delivery schedules.',
      systemTag: 'SUPPLIER OPERATIONAL CONSOLE',
      icon: <Boxes className="w-8 h-8" />,
      accentBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      accentText: 'text-emerald-700',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700',
      deviceContext: 'Optimized for Mobile & Desktop Operations',
    },
    factory: {
      heading: 'Factory Manager Console Sign In',
      subheading: 'Monitor assembly lines, buffer raw materials, and place automated supplier requisitions.',
      systemTag: 'PLANT EXECUTION ENVIRONMENT',
      icon: <Factory className="w-8 h-8" />,
      accentBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      accentText: 'text-indigo-700',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700',
      deviceContext: 'Optimized for Floor Tablets & Industrial Desktops',
    },
    warehouse: {
      heading: 'Warehouse Floor Terminal Login',
      subheading: 'Touch-friendly intake scanner, bay storage manager, and driver dispatch manifests.',
      systemTag: 'STORAGE & INVENTORY TERMINAL',
      icon: <Warehouse className="w-8 h-8" />,
      accentBg: 'bg-amber-50 text-amber-700 border-amber-200',
      accentText: 'text-amber-700',
      btnBg: 'bg-amber-600 hover:bg-amber-700',
      deviceContext: 'Tablet & Barcode Scanner Optimized Layout',
    },
    hub: {
      heading: 'Distribution Hub Dispatch Login',
      subheading: 'Regional logistics coordination, carrier fleet assignment, and corridor status monitoring.',
      systemTag: 'REGIONAL FREIGHT DISPATCH',
      icon: <Building2 className="w-8 h-8" />,
      accentBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      accentText: 'text-cyan-700',
      btnBg: 'bg-cyan-600 hover:bg-cyan-700',
      deviceContext: 'Tablet & Desktop Dispatch Console',
    },
    driver: {
      heading: 'Driver Mobile Field Sign In',
      subheading: 'Simple touch portal for road carriers. Accept assignments, confirm pickups, and report delays safely.',
      systemTag: 'COMMERCIAL CARRIER MOBILE PORTAL',
      icon: <Truck className="w-8 h-8" />,
      accentBg: 'bg-orange-50 text-orange-700 border-orange-200',
      accentText: 'text-orange-700',
      btnBg: 'bg-orange-600 hover:bg-orange-700',
      deviceContext: 'Mobile-First Touch Layout (Hands-Free Friendly)',
    },
    customer: {
      heading: 'Customer Shipment Tracking Login',
      subheading: 'Track live milestones for Order #SS1024 with transparent transit updates and accurate ETAs.',
      systemTag: 'RECIPIENT TRACKING PORTAL',
      icon: <Users className="w-8 h-8" />,
      accentBg: 'bg-purple-50 text-purple-700 border-purple-200',
      accentText: 'text-purple-700',
      btnBg: 'bg-purple-600 hover:bg-purple-700',
      deviceContext: 'Clean Consumer Mobile Interface',
    },
    admin: {
      heading: 'Administrator Command Center',
      subheading: 'Unified supply-chain graph monitoring, BFS disruption impact analysis, and Dijkstra recovery authorization.',
      systemTag: 'CHIEF RESILIENCE COMMAND CENTER',
      icon: <ShieldAlert className="w-8 h-8" />,
      accentBg: 'bg-slate-900 text-blue-400 border-slate-800',
      accentText: 'text-blue-400',
      btnBg: 'bg-blue-600 hover:bg-blue-500',
      deviceContext: 'Desktop Command Center & DSA Evaluation Engine',
    },
  };

  const config = roleConfig[role];
  const isAdmin = role === 'admin';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 relative overflow-hidden dark-grid-bg">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Back to Role Selection Button */}
        <button
          onClick={navigateToWelcome}
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold mb-6 text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Role Selection</span>
        </button>

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl mb-4 ${config.accentBg}`}
          >
            {config.icon}
          </div>

          <span className="text-[11px] font-mono font-bold uppercase tracking-wider mb-1 text-blue-400">
            {config.systemTag}
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white">{config.heading}</h2>
          <p className="mt-2 text-xs text-slate-400 max-w-sm">
            {config.subheading}
          </p>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="py-8 px-6 sm:px-10 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* ID / Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono font-semibold text-slate-300 mb-1.5"
              >
                {role === 'driver' ? 'Driver ID or Mobile Number' : 'Work Email / Operational ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={cred.email}
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-700/80 bg-slate-950/80 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-mono font-semibold text-slate-300"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-mono text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-700/80 bg-slate-950/80 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs text-slate-400 font-mono">
                  Remember this device
                </span>
              </label>
              <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                TLS 1.3 SECURE
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${config.btnBg}`}
            >
              Sign In to {cred.title}
            </button>
          </form>

          {/* Role-Specific Demo Credentials Box */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Demo Auth Helper
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-mono font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Auto-Fill Credentials
              </button>
            </div>

            <div className="p-3.5 rounded-xl text-xs space-y-1.5 font-mono bg-slate-950/70 border border-slate-800 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Identity:</span>
                <span className="font-semibold text-slate-200">{cred.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Password:</span>
                <span className="font-semibold text-slate-200">{cred.password}</span>
              </div>
              <div className="flex justify-between text-[11px] pt-1.5 border-t border-slate-800/60">
                <span className="text-slate-500">Entity:</span>
                <span className="text-blue-400 font-medium">{cred.assignedEntityName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security and Device Note */}
        <p className="mt-4 text-center text-[11px] font-mono text-slate-500">
          {config.deviceContext} · Role-based access control enforced
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold mb-2">Password Recovery</h3>
            <p className="text-xs text-slate-600 mb-4">
              Enter your work email address to receive password reset authorization from your fleet/hub supervisor.
            </p>

            {forgotEmailSent ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs mb-4">
                Reset instructions dispatched to <span className="font-semibold">{email || cred.email}</span>. Please verify with your logistics lead.
              </div>
            ) : (
              <input
                type="email"
                defaultValue={email || cred.email}
                placeholder="name@supplyshield.net"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 mb-4 focus:ring-2 focus:ring-blue-500"
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotEmailSent(false);
                }}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              {!forgotEmailSent && (
                <button
                  type="button"
                  onClick={() => setForgotEmailSent(true)}
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
