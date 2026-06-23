"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock, Mail, Loader2, ArrowRight, Eye, EyeOff,
  ShieldCheck, Server, Cpu, Activity, CheckCircle2, Fingerprint, Wifi
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

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

/* ───── Floating Particles (GPU-accelerated via CSS) ───── */
function ParticleField() {
  const particles = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 12,
      delay: Math.random() * 5,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#FF3B30]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, willChange: "transform, opacity" }}
          animate={{ y: [0, -60, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ───── Industrial Network Visualization (SVG) ───── */
function NetworkVisualization() {
  const nodes = useMemo(() => [
    { cx: 50, cy: 50, r: 4, label: "PLC" },
    { cx: 20, cy: 25, r: 2.5, label: "ARM-1" },
    { cx: 80, cy: 20, r: 2.5, label: "ARM-2" },
    { cx: 15, cy: 75, r: 2.5, label: "CONV" },
    { cx: 85, cy: 70, r: 2.5, label: "QC" },
    { cx: 50, cy: 15, r: 2, label: "HMI" },
    { cx: 50, cy: 85, r: 2, label: "SCADA" },
    { cx: 30, cy: 50, r: 2, label: "IO" },
    { cx: 70, cy: 50, r: 2, label: "VFD" },
  ], []);

  const edges = useMemo(() => [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
    [1, 5], [2, 5], [3, 6], [4, 6], [7, 1], [7, 3], [8, 2], [8, 4],
  ], []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
      <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] opacity-30">
        {/* Edges with data-packet animation */}
        {edges.map(([a, b], i) => (
          <g key={`edge-${i}`}>
            <line
              x1={nodes[a].cx} y1={nodes[a].cy}
              x2={nodes[b].cx} y2={nodes[b].cy}
              stroke="#FF3B30" strokeWidth="0.15" opacity="0.4"
            />
            {/* Data packet flowing along edge */}
            <circle r="0.6" fill="#FF6B5E">
              <animateMotion
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
                path={`M${nodes[a].cx},${nodes[a].cy} L${nodes[b].cx},${nodes[b].cy}`}
              />
              <animate attributeName="opacity" values="0;1;1;0" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={`node-${i}`}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill="#050816" stroke="#FF3B30" strokeWidth="0.3">
              <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={n.cx} cy={n.cy} r={n.r * 0.4} fill="#FF3B30" opacity="0.8">
              <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
            <text x={n.cx} y={n.cy + n.r + 3} textAnchor="middle" fill="#FF6B5E" fontSize="2" fontWeight="bold" opacity="0.6">
              {n.label}
            </text>
          </g>
        ))}

        {/* Radar scanning ring */}
        <circle cx="50" cy="50" r="20" fill="none" stroke="#FF3B30" strokeWidth="0.2" opacity="0.3">
          <animate attributeName="r" values="5;45" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" r="20" fill="none" stroke="#FF6B5E" strokeWidth="0.15" opacity="0.2">
          <animate attributeName="r" values="5;45" dur="4s" repeatCount="indefinite" begin="2s" />
          <animate attributeName="opacity" values="0.4;0" dur="4s" repeatCount="indefinite" begin="2s" />
        </circle>
      </svg>
    </div>
  );
}

/* ───── Telemetry Bar ───── */
function TelemetryBar() {
  const items = useMemo(() => [
    { label: "PLC", status: "ACTIVE" },
    { label: "ARM-01", status: "RUNNING" },
    { label: "CONV-03", status: "IDLE" },
    { label: "QC-AI", status: "SCANNING" },
  ], []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider text-gray-500 mt-6"
    >
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
          </span>
          <span>{item.label}:</span>
          <span className="text-green-400">{item.status}</span>
        </div>
      ))}
    </motion.div>
  );
}

/* ═══════════════ MAIN COMPONENT ═══════════════ */
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [authPhase, setAuthPhase] = useState<"idle" | "connecting" | "verifying" | "granted">("idle");
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* Mouse parallax */
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useTransform(mouseX, [0, 1], [-8, 8]);
  const parallaxY = useTransform(mouseY, [0, 1], [-8, 8]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAuthPhase("connecting");

    await new Promise(r => setTimeout(r, 600));
    setAuthPhase("verifying");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setAuthPhase("granted");
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1200);
      } else {
        const data = await res.json();
        setError(data.error || "Authentication failed. Please verify credentials.");
        setLoading(false);
        setAuthPhase("idle");
      }
    } catch {
      setError("Secure connection failed. Please try again.");
      setLoading(false);
      setAuthPhase("idle");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050816] flex flex-col lg:flex-row font-sans selection:bg-[#FF3B30]/30">

      {/* ═══ LEFT PANEL - 60% ═══ */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="hidden lg:flex lg:w-[60%] relative overflow-hidden flex-col justify-between p-12"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
          <motion.div
            style={{ x: parallaxX, y: parallaxY }}
            className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#FF3B30]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"
          />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Particles */}
        <ParticleField />

        {/* Network Visualization */}
        <motion.div style={{ x: parallaxX, y: parallaxY }}>
          <NetworkVisualization />
        </motion.div>

        {/* Top Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <motion.img
              src="/logo.png"
              alt="PiBotix Logo"
              className="h-14 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,59,48,0.3)]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            />
          </Link>
        </div>

        {/* Center Value Prop */}
        <div className="relative z-10 max-w-2xl mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#FF6B5E] text-xs font-bold tracking-wider uppercase mb-6"
              animate={{ borderColor: ["rgba(255,255,255,0.1)", "rgba(255,59,48,0.3)", "rgba(255,255,255,0.1)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              System Status: All Nodes Operational
            </motion.div>
            <h1 className="text-5xl lg:text-6xl font-black text-[#F8FAFC] leading-[1.1] tracking-tight mb-6">
              Industrial <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B30] to-[#FF6B5E]">Automation</span> Control
            </h1>
            <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-xl">
              Enterprise-grade operations platform for robotics, automated assembly lines, and smart manufacturing facilities.
            </p>
            <TelemetryBar />
          </motion.div>
        </div>

        {/* Bottom Statistics & Trust Badges */}
        <div className="relative z-10 mt-auto pt-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="grid grid-cols-4 gap-3 max-w-2xl"
          >
            {[
              { icon: Cpu, value: 150, suffix: "+", label: "Robots Deployed" },
              { icon: Server, value: 50, suffix: "+", label: "Enterprise Clients" },
              { icon: Activity, value: 99, suffix: ".9%", label: "System Uptime" },
              { icon: Wifi, value: 24, suffix: "/7", label: "Live Support" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-4 group hover:border-[#FF3B30]/20 transition-colors duration-500"
              >
                <div className="p-2 bg-[#FF3B30]/10 rounded-lg text-[#FF3B30] w-fit mb-3 group-hover:bg-[#FF3B30]/20 transition-colors">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-xl font-black text-white"><AnimatedCounter target={stat.value} suffix={stat.suffix} /></div>
                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center gap-6 mt-6 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-500" /> ISO 27001 Certified</div>
            <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-green-500" /> 256-bit AES Encryption</div>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL - 40% ═══ */}
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
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#FF3B30]/10 rounded-lg">
                <Fingerprint className="w-6 h-6 text-[#FF3B30]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">Secure Gateway</h2>
                <p className="text-xs text-gray-500 font-medium">Encrypted authentication channel</p>
              </div>
            </div>
          </div>

          {/* Auth Phase Indicator */}
          {authPhase !== "idle" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-3 rounded-xl border border-white/5 bg-white/[0.02]"
            >
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider">
                {authPhase === "connecting" && (
                  <><Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" /><span className="text-amber-400">Establishing secure tunnel...</span></>
                )}
                {authPhase === "verifying" && (
                  <><Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" /><span className="text-blue-400">Verifying credentials...</span></>
                )}
                {authPhase === "granted" && (
                  <><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Access granted — redirecting...</span></>
                )}
              </div>
            </motion.div>
          )}

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
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors duration-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#050816] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-[#F8FAFC] focus:outline-none focus:border-[#FF3B30] focus:shadow-[0_0_0_3px_rgba(255,59,48,0.15)] transition-all placeholder:text-gray-600 font-medium"
                  placeholder="engineer@pibotix.com"
                />
                {/* Focus glow line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#FF3B30] to-transparent group-focus-within:w-full transition-all duration-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Authentication Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#050816] border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-[#F8FAFC] focus:outline-none focus:border-[#FF3B30] focus:shadow-[0_0_0_3px_rgba(255,59,48,0.15)] transition-all placeholder:text-gray-600 font-medium tracking-wide"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#FF3B30] to-transparent group-focus-within:w-full transition-all duration-500" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-4 h-4 rounded border border-white/20 bg-[#050816] peer-checked:bg-[#FF3B30] peer-checked:border-[#FF3B30] transition-all" />
                  <CheckCircle2 className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">Remember session</span>
              </label>

              <button type="button" className="text-sm font-medium text-[#FF6B5E] hover:text-[#FF3B30] transition-colors">
                Forgot key?
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading || success}
              whileHover={{ scale: 1.01, boxShadow: "0 0 35px rgba(255,59,48,0.4)" }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 mt-6 shadow-[0_0_20px_rgba(255,59,48,0.2)] ${
                success
                  ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  : "bg-gradient-to-r from-[#FF3B30] to-[#FF6B5E] text-white"
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : success ? (
                <><CheckCircle2 className="w-5 h-5" /> Authentication Verified</>
              ) : (
                <>Establish Secure Connection <ArrowRight className="w-5 h-5 ml-1" /></>
              )}
            </motion.button>
          </form>

          {/* Security Footer */}
          <div className="mt-10 pt-6 border-t border-white/5">
            <div className="flex flex-col gap-2.5 text-[11px] text-gray-500 font-mono uppercase tracking-wider">
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                  </span>
                  Session Protection
                </span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Encryption</span>
                <span className="text-gray-400">AES-256-GCM</span>
              </div>
              <div className="flex justify-between">
                <span>Protocol</span>
                <span className="text-gray-400">TLS 1.3</span>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500 font-medium">
              Need access?{" "}
              <Link href="/admin/register" className="text-[#FF3B30] hover:text-[#FF6B5E] font-semibold transition-colors">
                Request Platform Access
              </Link>
            </div>
          </div>

        </motion.div>
      </div>

    </div>
  );
}
