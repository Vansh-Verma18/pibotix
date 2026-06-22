"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Lock, Mail, Loader2, ArrowRight, Eye, EyeOff, 
  ShieldCheck, Server, Cpu, Clock, Activity, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1000);
      } else {
        const data = await res.json();
        setError(data.error || "Authentication failed. Please verify credentials.");
        setLoading(false);
      }
    } catch (err) {
      setError("Secure connection failed. Please try again.");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050816] flex flex-col lg:flex-row font-sans selection:bg-[#FF3B30]/30">
      
      {/* LEFT PANEL - 60% (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden flex-col justify-between p-12">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#FF3B30]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Abstract Robotics/Automation Visual */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
             <circle cx="50" cy="50" r="30" fill="none" stroke="#FF3B30" strokeWidth="0.2" className="animate-[spin_20s_linear_infinite]" />
             <circle cx="50" cy="50" r="40" fill="none" stroke="#FF6B5E" strokeWidth="0.1" strokeDasharray="2 4" className="animate-[spin_30s_linear_infinite_reverse]" />
             <path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="#ffffff" strokeWidth="0.1" opacity="0.5" />
          </svg>
        </div>

        {/* Top Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <img src="/logo.png" alt="PiBotix Logo" className="h-14 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,59,48,0.3)]" />
          </Link>
        </div>

        {/* Center Value Prop */}
        <div className="relative z-10 max-w-2xl mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#FF6B5E] text-xs font-bold tracking-wider uppercase mb-6">
              <Activity className="w-3.5 h-3.5" /> System Status: Operational
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-[#F8FAFC] leading-[1.1] tracking-tight mb-6">
              Industrial <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B30] to-[#FF6B5E]">Automation</span> Control
            </h1>
            <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-xl">
              Enterprise-grade operations platform for robotics, automated assembly lines, and smart manufacturing facilities.
            </p>
          </motion.div>
        </div>

        {/* Bottom Statistics & Trust Badges */}
        <div className="relative z-10 mt-auto pt-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="grid grid-cols-2 gap-4 max-w-2xl"
          >
            <div className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-5 flex items-start gap-4">
              <div className="p-2.5 bg-[#FF3B30]/10 rounded-lg text-[#FF3B30]">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">150+</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">Robots Deployed</div>
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-5 flex items-start gap-4">
              <div className="p-2.5 bg-[#FF3B30]/10 rounded-lg text-[#FF3B30]">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">99.9%</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">System Uptime</div>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-6 mt-8 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-500" /> ISO 27001 Certified</div>
            <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-green-500" /> 256-bit AES Encryption</div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - 40% (100% on mobile) */}
      <div className="w-full lg:w-[40%] bg-[#0B1220] flex flex-col justify-center px-6 py-12 lg:px-16 border-l border-white/5 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-20 relative">
        
        {/* Mobile Logo */}
        <div className="lg:hidden flex justify-center mb-12">
          <img src="/logo.png" alt="PiBotix Logo" className="h-12 w-auto" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-2 tracking-tight">Secure Gateway</h2>
            <p className="text-sm text-gray-400">Authenticate to access the PiBotix industrial network.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-start gap-3"
              >
                <div className="mt-0.5"><Lock className="w-4 h-4" /></div>
                <div>{error}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Corporate Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#050816] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-[#F8FAFC] focus:outline-none focus:border-[#FF3B30] focus:ring-1 focus:ring-[#FF3B30]/50 transition-all placeholder:text-gray-600 font-medium"
                  placeholder="engineer@pibotix.com"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Authentication Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#050816] border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-[#F8FAFC] focus:outline-none focus:border-[#FF3B30] focus:ring-1 focus:ring-[#FF3B30]/50 transition-all placeholder:text-gray-600 font-medium tracking-wide"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-4 h-4 rounded border border-white/20 bg-[#050816] peer-checked:bg-[#FF3B30] peer-checked:border-[#FF3B30] transition-all"></div>
                  <CheckCircle2 className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">Remember session</span>
              </label>
              
              <button type="button" className="text-sm font-medium text-[#FF6B5E] hover:text-[#FF3B30] transition-colors">
                Forgot key?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 mt-6 shadow-[0_0_20px_rgba(255,59,48,0.2)] hover:shadow-[0_0_30px_rgba(255,59,48,0.4)] ${
                success 
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]" 
                  : "bg-gradient-to-r from-[#FF3B30] to-[#FF6B5E] hover:from-[#e6352b] hover:to-[#e66054] text-white"
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : success ? (
                <><CheckCircle2 className="w-5 h-5" /> Authentication Verified</>
              ) : (
                <>Establish Secure Connection <ArrowRight className="w-5 h-5 ml-1" /></>
              )}
            </button>
          </form>
          
          <div className="mt-12 pt-8 border-t border-white/5">
            <div className="flex flex-col gap-3 text-xs text-gray-500 font-medium">
              <div className="flex justify-between">
                <span>Session Protection:</span>
                <span className="text-gray-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Last Node Update:</span>
                <span className="text-gray-400">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
        </motion.div>
      </div>

    </div>
  );
}
