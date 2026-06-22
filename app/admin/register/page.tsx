"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Lock, Mail, Loader2, ArrowRight, Eye, EyeOff, 
  ShieldCheck, Server, Cpu, CheckCircle2, User, Building, Phone, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    phoneNumber: "",
    industry: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

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

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Secure connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050816] flex flex-col lg:flex-row font-sans selection:bg-[#FF3B30]/30">
      
      {/* LEFT PANEL - 60% */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden flex-col justify-between p-12 lg:p-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#FF3B30]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
             <circle cx="50" cy="50" r="30" fill="none" stroke="#FF3B30" strokeWidth="0.2" className="animate-[spin_20s_linear_infinite]" />
             <circle cx="50" cy="50" r="40" fill="none" stroke="#FF6B5E" strokeWidth="0.1" strokeDasharray="2 4" className="animate-[spin_30s_linear_infinite_reverse]" />
          </svg>
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <img src="/logo.png" alt="PiBotix Logo" className="h-14 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,59,48,0.3)]" />
          </Link>
        </div>

        <div className="relative z-10 max-w-2xl mt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-5xl lg:text-6xl font-black text-[#F8FAFC] leading-[1.1] tracking-tight mb-6">
              Partner with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B30] to-[#FF6B5E]">Automation Experts</span>
            </h1>
            <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-xl">
              Register for enterprise access to architect custom robotic workflows, monitor deployment analytics, and scale your manufacturing operations.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 mt-auto pt-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.7 }} className="grid grid-cols-2 gap-4 max-w-2xl">
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
                <div className="text-2xl font-black text-white">50+</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">Enterprise Clients</div>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-6 mt-8 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#FF6B5E]" /> Role-Based Access</div>
            <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-green-500" /> 256-bit Encryption</div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - 40% */}
      <div className="w-full lg:w-[40%] bg-[#0B1220] flex flex-col justify-center px-6 py-12 lg:px-16 border-l border-white/5 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-20 relative min-h-screen overflow-y-auto">
        <div className="lg:hidden flex justify-center mb-8">
          <img src="/logo.png" alt="PiBotix Logo" className="h-10 w-auto" />
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md mx-auto my-auto">
          
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Registration Received</h2>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                  Your enterprise account request is currently <span className="text-amber-400 font-semibold">pending review</span>. An administrator will verify your credentials and approve your access shortly.
                </p>
                <Link href="/admin/login" className="inline-flex items-center gap-2 text-[#FF3B30] font-semibold hover:text-[#FF6B5E] transition-colors">
                  Return to Login <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-[#F8FAFC] mb-2 tracking-tight">Create Account</h2>
                  <p className="text-sm text-gray-400">Request access to the enterprise portal.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-start gap-3">
                    <div className="mt-0.5"><Lock className="w-4 h-4" /></div>
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#050816] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#F8FAFC] focus:border-[#FF3B30] outline-none transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Company</label>
                      <div className="relative group">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" />
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#050816] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#F8FAFC] focus:border-[#FF3B30] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Work Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#050816] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#F8FAFC] focus:border-[#FF3B30] outline-none transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                      <div className="relative group">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#050816] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#F8FAFC] focus:border-[#FF3B30] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Industry</label>
                    <div className="relative group">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" />
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#050816] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#F8FAFC] focus:border-[#FF3B30] outline-none transition-all appearance-none"
                      >
                        <option value="" disabled>Select your industry</option>
                        <option value="Automotive">Automotive</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Pharmaceuticals">Pharmaceuticals</option>
                        <option value="Food & Beverage">Food & Beverage</option>
                        <option value="Logistics">Logistics & Warehousing</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Secure Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength={8}
                          className="w-full bg-[#050816] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-[#F8FAFC] focus:border-[#FF3B30] outline-none transition-all tracking-wide"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="flex gap-1 h-1 mt-2 px-1">
                          {[25, 50, 75, 100].map((step) => (
                            <div 
                              key={step} 
                              className={`flex-1 rounded-full transition-all duration-300 ${passwordStrength >= step ? (passwordStrength > 50 ? 'bg-green-500' : 'bg-amber-500') : 'bg-white/10'}`} 
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Confirm Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#050816] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#F8FAFC] focus:border-[#FF3B30] outline-none transition-all tracking-wide"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 pb-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input type="checkbox" required className="peer sr-only" />
                        <div className="w-4 h-4 rounded border border-white/20 bg-[#050816] peer-checked:bg-[#FF3B30] peer-checked:border-[#FF3B30] transition-all"></div>
                        <CheckCircle2 className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                        I agree to the <Link href="/terms-conditions" className="text-[#FF6B5E] hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-[#FF6B5E] hover:underline">Privacy Policy</Link>. I understand my account requires administrator approval.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 mt-2 shadow-[0_0_20px_rgba(255,59,48,0.2)] hover:shadow-[0_0_30px_rgba(255,59,48,0.4)] bg-gradient-to-r from-[#FF3B30] to-[#FF6B5E] hover:from-[#e6352b] hover:to-[#e66054] text-white"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Request Access <ArrowRight className="w-5 h-5 ml-1" /></>}
                  </button>
                </form>
                
                <div className="mt-8 text-center text-sm text-gray-500 font-medium border-t border-white/5 pt-6">
                  Already have access?{" "}
                  <Link href="/admin/login" className="text-[#FF3B30] hover:underline font-semibold hover:text-[#FF6B5E] transition-colors">
                    Login here
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
