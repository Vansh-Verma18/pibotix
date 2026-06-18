"use client";

import { useActionState, useEffect, useState } from "react";
import { submitContactForm } from "@/actions/action";
import { Button } from "@/components/ui/Button";
import { Loader2, Send, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const initialState = {
  success: false,
  message: "",
  error: "",
};

interface ContactSectionProps {
  className?: string;
  isPage?: boolean;
}

export default function ContactSection({
  className,
  isPage = false,
}: ContactSectionProps) {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState
  );
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.country_code === "IN") {
          setCurrency("INR");
        }
      } catch (error) {
        console.error("Failed to fetch location:", error);
      }
    };

    fetchCurrency();
  }, []);

  return (
    <section
      className={cn(
        "w-full px-4 relative h-full pb-20",
        isPage ? "min-h-screen pt-4 pb-12" : "py-10",
        className
      )}
    >
      <div className="max-w-7xl lg:py-10 rounded-4xl overflow-hidden mx-auto lg:px-8 relative z-10">
        <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent lg:rounded-4xl -z-10" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12">

          <div className="rounded-3xl p-6 md:p-8">
            <div>
              <h3 className="text-2xl text-primary mb-4 lg:text-4xl font-bold">
                Send us a message
              </h3>
              <p className="text-sm text-white mt-1 mb-6">
                Have a project or a clear idea in mind? Share your requirements
                and budget, and our team will get back to you with the next
                steps
              </p>
            </div>
            <form action={formAction} className="space-y-6 ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-300"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-300"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-gray-300"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="budget"
                    className="text-sm font-medium text-gray-300"
                  >
                    Budget ({currency})
                  </label>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    placeholder={
                      currency === "INR"
                        ? "₹50,000 - ₹1,00,000"
                        : "$1,000 - $5,000"
                    }
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="requirement"
                  className="text-sm font-medium text-gray-300"
                >
                  Requirement
                </label>
                <div className="relative">
                  <select
                    id="requirement"
                    name="requirement"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option
                      value=""
                      disabled
                      className="bg-black text-gray-500"
                    >
                      Select a service
                    </option>
                    <option value="Web Development" className="bg-black">
                      Web Development
                    </option>
                    <option value="Mobile App Development" className="bg-black">
                      Mobile App Development
                    </option>
                    <option value="UI/UX Design" className="bg-black">
                      UI/UX Design
                    </option>
                    <option value="Consulting" className="bg-black">
                      Consulting
                    </option>
                    <option value="Other" className="bg-black">
                      Other
                    </option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-300"
                >
                  Project Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Tell us about your project goals and timeline..."
                  className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 text-white resize-none"
                />
              </div>

              {state.error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {state.error}
                </div>
              )}

              {state.success && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                  {state.message}
                </div>
              )}

              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-44  sm:ml-auto h-12 text-base font-medium bg-secondary hover:bg-secondary/90 text-white rounded-xl transition-all"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="flex flex-col relative py-8 px-8 rounded-3xl overflow-hidden ">
          <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent lg:rounded-4xl -z-10" />
            <div>
              <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-6">
                Let&apos;s work <br />
                <span className="text-primary">together.</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-md">
                Have a project in mind? We&apos;d love to hear about it. Fill out the
                form and we&apos;ll get back to you as soon as possible.
              </p>
            </div>

            <div className="space-y-8 mt-12">
              <div className="flex items-center  bg-white/5 backdrop-blur-xl p-3  rounded-3xl space-x-4 text-gray-300">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email us at</p>
                  <p className="font-medium">info@vortexiosolutions.com</p>
                </div>
              </div>
              <div className="flex items-center bg-white/5 backdrop-blur-xl p-3  rounded-3xl  space-x-4 text-gray-300">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call us at</p>
                  <p className="font-medium">+91 7011636150</p>
                </div>
              </div>
              <div className="flex items-center bg-white/5 backdrop-blur-xl p-3  rounded-3xl  space-x-4 text-gray-300">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Visit us</p>
                  <p className="font-medium">Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
