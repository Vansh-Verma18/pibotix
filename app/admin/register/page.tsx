"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Lock, Mail, Loader2, ArrowRight, Eye, EyeOff,
  ShieldCheck, Server, Cpu, CheckCircle2, User, Building, Phone, Briefcase,
  Activity, Wifi, Fingerprint, Zap, BarChart3
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

/* Dynamic import for Three.js scene — no SSR */
const RoboticArmScene = dynamic(() => import("@/components/auth/RoboticArmScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050816] flex items-center justify-center">
      <div className="text-gray-600 text-xs font-mono animate-pulse">INITIALIZING AUTOMATION CELL...</div>
    </div>
  ),
});

/* ───── Animated Counter ───── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(id); }
      else setCount(start);
    }, 16);
    return () => clearInterval(id);
  }, [target]);
  return <>{count}{suffix}</>;
}

/* ───── Live Industrial Data HUD Panel ───── */
function HUDPanel({ label, value, unit, icon: Icon, delay = 0 }: {
  label: string; value: string; unit?: string;
  icon: typeof Cpu; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-[#0B1220]/60 border border-white/5 backdrop-blur-xl rounded-lg px-3 py-2 min-w-[120px]"
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-[#FF3B30]" />
        <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-sm font-bold text-white font-mono">
        {value}
        {unit && <span className="text-[10px] text-gray-500 ml-0.5">{unit}</span>}
      </div>
    </motion.div>
  );
}

/* ───── Pulsing Status Light ───── */
function StatusDot({ color = "green", label }: { color?: string; label: string }) {
  const colorMap: Record<string, string> = {
    green: "bg-green-500 shadow-green-500/50",
    red: "bg-[#FF3B30] shadow-[#FF3B30]/50",
    amber: "bg-amber-500 shadow-amber-500/50",
  };
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorMap[color]} opacity-75`} />
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${colorMap[color]}`} />
      </span>
      <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}

/* ═══════════════ MAIN COMPONENT ═══════════════ */
export default function AdminRegister() {
  const [formData, setFormData] = useState({
    name: "", email: "", companyName: "", phoneNumber: "",
    industry: "", password: "", confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 7) score += 25;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) score += 25;
    if (pass.match(/\d/)) score += 25;
    if (pass.match(/[^a-zA-Z\d]/)) score += 25;
    return score;
  };
  const passwordStrength = calculatePasswordStrength(formData.password);

  /* Form parallax */
  const formParallaxX = useMotionValue(0);
  const formParallaxY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 4;
    formParallaxX.set(x);
    formParallaxY.set(y);
  }, [formParallaxX, formParallaxY]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) { setSuccess(true); }
      else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Secure connection failed. Please try again.");
    } finally { setLoading(false); }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050816] flex flex-col lg:flex-row font-sans selection:bg-[#FF3B30]/30 overflow-hidden">

      {/* ═══════════════════════════════════════
           LEFT PANEL — 60% — 3D Robot Scene
         ═══════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden flex-col justify-between p-12 lg:p-16">

        {/* 3D Canvas Background */}
        <div className="absolute inset-0 z-[0]">
          <RoboticArmScene />
          {/* Gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050816]/80 via-[#050816]/40 to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-[#050816]/60 z-[1]" />
        </div>

        {/* ─── Content Overlay (z-[10]) ─── */}
        <div className="relative z-[10] h-full flex flex-col justify-between pointer-events-none">

          {/* Header */}
          <div className="flex items-center justify-between pointer-events-auto">
            <Link href="/" className="inline-block">
              <img src="/logo.png" alt="PiBotix Logo" className="h-14 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,59,48,0.3)]" />
            </Link>
            <div className="flex items-center gap-3">
              <StatusDot color="green" label="System Online" />
              <StatusDot color="green" label="Cell Active" />
            </div>
          </div>

          {/* Center Content */}
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-[#FF3B30]/20 backdrop-blur-md text-[#FF6B5E] text-[10px] font-mono tracking-widest uppercase mb-6">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3B30] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF3B30]" />
                </span>
                Live Production Cell
              </div>
              <h1 className="text-5xl lg:text-[3.5rem] font-black text-white leading-[1.1] tracking-tight mb-6 drop-shadow-xl">
                Partner with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B30] to-[#FF6B5E]">Automation Experts</span>
              </h1>
              <p className="text-base text-gray-400 font-medium leading-relaxed max-w-lg">
                Architect custom robotic workflows, deploy AI vision inspection systems, and scale your manufacturing operations.
              </p>

              {/* Process Indicator */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 flex flex-col gap-4">
                {[
                  { step: "01", label: "Submit access request", icon: Fingerprint, active: true },
                  { step: "02", label: "Admin reviews credentials", icon: ShieldCheck, active: false },
                  { step: "03", label: "Account activated", icon: CheckCircle2, active: false },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border backdrop-blur-sm ${item.active ? 'bg-[#FF3B30]/10 border-[#FF3B30]/30 shadow-[0_0_10px_rgba(255,59,48,0.15)]' : 'bg-white/5 border-white/10'}`}>
                      <item.icon className={`w-4 h-4 ${item.active ? 'text-[#FF3B30]' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Step {item.step}</div>
                      <div className={`text-sm font-semibold ${item.active ? 'text-white' : 'text-gray-500'}`}>{item.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Row: HUD Data + Statistics */}
          <div className="pt-8">
            {/* Industrial HUD Panels */}
            <div className="flex gap-2 mb-6 flex-wrap pointer-events-auto">
              <HUDPanel icon={Cpu} label="Robot Cell" value="ACTIVE" delay={0.5} />
              <HUDPanel icon={BarChart3} label="Output" value="847" unit="pcs/hr" delay={0.6} />
              <HUDPanel icon={Zap} label="Cycle Time" value="12.4" unit="sec" delay={0.7} />
              <HUDPanel icon={Activity} label="Efficiency" value="98.7" unit="%" delay={0.8} />
            </div>

            {/* Stats Grid */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-4 gap-3 max-w-2xl pointer-events-auto">
              {[
                { value: 150, suffix: "+", label: "Robots Deployed" },
                { value: 50, suffix: "+", label: "Mfg Facilities" },
                { value: 99, suffix: ".9%", label: "Reliability" },
                { value: 24, suffix: "/7", label: "Support" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + i * 0.1 }}
                  className="bg-[#0B1220]/60 border border-white/5 backdrop-blur-xl rounded-xl p-3 group hover:bg-[#FF3B30]/10 hover:border-[#FF3B30]/30 transition-all duration-500 cursor-default"
                >
                  <div className="text-xl font-black text-white group-hover:text-[#FF6B5E] transition-colors drop-shadow">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
           RIGHT PANEL — 40% — Registration Form
         ═══════════════════════════════════════ */}
      <div
        className="w-full lg:w-[40%] bg-gradient-to-br from-[#0B1220] to-[#020617] flex flex-col justify-center px-6 py-12 lg:px-14 border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-[20] relative min-h-screen overflow-y-auto"
        onMouseMove={handleMouseMove}
      >
        <div className="lg:hidden flex justify-center mb-8 relative z-10">
          <img src="/logo.png" alt="PiBotix Logo" className="h-10 w-auto" />
        </div>

        <motion.div
          style={{ x: formParallaxX, y: formParallaxY }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto my-auto relative z-10"
        >
          {/* Glassmorphic Form Card */}
          <div className="bg-[#0B1220]/80 backdrop-blur-2xl border border-white/[0.04] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF3B30]/40 to-transparent" />

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <motion.div className="absolute inset-0 rounded-full border border-green-500/20" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
                    <div className="absolute inset-0 rounded-full bg-green-500/10 flex items-center justify-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, delay: 0.2 }}>
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </motion.div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Request Submitted</h2>
                  <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm">Your enterprise account request is pending admin review.</p>
                  <Link href="/admin/login" className="inline-flex items-center gap-2 text-[#FF3B30] font-semibold hover:text-[#FF6B5E] transition-colors text-sm">
                    Return to Secure Gateway <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-7">
                    <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Request Platform Access</h2>
                    <p className="text-[11px] text-gray-500 font-mono uppercase tracking-widest">Enterprise Onboarding · Admin Approval Required</p>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-5 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-start gap-3">
                        <Lock className="w-4 h-4 mt-0.5 opacity-80" />
                        <div>{error}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1 group">
                        <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within:text-[#FF3B30] transition-colors" />
                          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-[#020617]/60 border border-white/5 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:border-[#FF3B30]/50 outline-none transition-colors" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#FF3B30]/50 to-transparent group-focus-within:w-3/4 transition-all duration-500 ease-out" />
                        </div>
                      </div>
                      <div className="space-y-1 group">
                        <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest ml-1">Company</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within:text-[#FF3B30] transition-colors" />
                          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full bg-[#020617]/60 border border-white/5 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:border-[#FF3B30]/50 outline-none transition-colors" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#FF3B30]/50 to-transparent group-focus-within:w-3/4 transition-all duration-500 ease-out" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1 group">
                        <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest ml-1">Work Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within:text-[#FF3B30] transition-colors" />
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-[#020617]/60 border border-white/5 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:border-[#FF3B30]/50 outline-none transition-colors" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#FF3B30]/50 to-transparent group-focus-within:w-3/4 transition-all duration-500 ease-out" />
                        </div>
                      </div>
                      <div className="space-y-1 group">
                        <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest ml-1">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within:text-[#FF3B30] transition-colors" />
                          <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full bg-[#020617]/60 border border-white/5 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:border-[#FF3B30]/50 outline-none transition-colors" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#FF3B30]/50 to-transparent group-focus-within:w-3/4 transition-all duration-500 ease-out" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 group">
                      <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest ml-1">Industry</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within:text-[#FF3B30] transition-colors" />
                        <select name="industry" value={formData.industry} onChange={handleChange} required className="w-full bg-[#020617]/60 border border-white/5 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:border-[#FF3B30]/50 outline-none transition-colors appearance-none cursor-pointer">
                          <option value="" disabled className="bg-[#0f172a]">Select your industry</option>
                          <option value="Automotive" className="bg-[#0f172a]">Automotive</option>
                          <option value="Electronics" className="bg-[#0f172a]">Electronics</option>
                          <option value="Pharmaceuticals" className="bg-[#0f172a]">Pharmaceuticals</option>
                          <option value="Food & Beverage" className="bg-[#0f172a]">Food & Beverage</option>
                          <option value="Logistics" className="bg-[#0f172a]">Logistics & Warehousing</option>
                          <option value="Other" className="bg-[#0f172a]">Other</option>
                        </select>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#FF3B30]/50 to-transparent group-focus-within:w-3/4 transition-all duration-500 ease-out" />
                      </div>
                    </div>

                    <div className="space-y-1 group">
                      <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest ml-1">Secure Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within:text-[#FF3B30] transition-colors z-20" />
                        <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required minLength={8} className="w-full bg-[#020617]/60 border border-white/5 rounded-lg py-2.5 pl-9 pr-9 text-sm text-white focus:border-[#FF3B30]/50 outline-none transition-colors tracking-wide relative z-10" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 z-20">
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#FF3B30]/50 to-transparent group-focus-within:w-3/4 transition-all duration-500 ease-out" />
                      </div>
                      <div className="flex gap-1 h-[2px] mt-1.5 px-1">
                        {[25, 50, 75, 100].map((step) => (
                          <motion.div key={step} initial={{ scaleX: 0 }} animate={{ scaleX: formData.password && passwordStrength >= step ? 1 : 0 }} transition={{ type: "spring", stiffness: 100 }} className={`flex-1 rounded-full origin-left ${passwordStrength > 50 ? 'bg-green-500' : 'bg-[#FF3B30]'}`} />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 group">
                      <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest ml-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within:text-[#FF3B30] transition-colors z-20" />
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full bg-[#020617]/60 border border-white/5 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:border-[#FF3B30]/50 outline-none transition-colors tracking-wide relative z-10" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#FF3B30]/50 to-transparent group-focus-within:w-3/4 transition-all duration-500 ease-out" />
                      </div>
                    </div>

                    <div className="pt-2 pb-1">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5">
                          <input type="checkbox" required className="peer sr-only" />
                          <div className="w-4 h-4 rounded border border-white/15 bg-[#020617] peer-checked:bg-[#FF3B30] peer-checked:border-[#FF3B30] transition-all" />
                          <CheckCircle2 className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[11px] text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                          I agree to the <Link href="/terms-conditions" className="text-white hover:text-[#FF3B30] transition-colors">Terms</Link> and <Link href="/privacy-policy" className="text-white hover:text-[#FF3B30] transition-colors">Privacy Policy</Link>. Admin approval is required.
                        </span>
                      </label>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 mt-2 bg-gradient-to-r from-[#FF3B30] to-[#e6352b] text-white shadow-[0_0_20px_rgba(255,59,48,0.15)] hover:shadow-[0_0_35px_rgba(255,59,48,0.35)] relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Submit Access Request <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" /></>}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!success && (
            <div className="mt-6 text-center text-xs text-gray-600 font-mono tracking-widest">
              ALREADY PROVISIONED?{" "}
              <Link href="/admin/login" className="text-white hover:text-[#FF3B30] font-bold transition-colors ml-1">
                SECURE LOGIN
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
