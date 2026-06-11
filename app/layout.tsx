import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import generatePageMetadata from "@/utils/generateMetadata";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Kantumruy_Pro } from "next/font/google";

const poppins = Kantumruy_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = generatePageMetadata("home");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body
        className={`${poppins.className} antialiased relative overflow-x-hidden`}
      >
        <Header />
        {children}
        <SpeedInsights />
        <Footer />
        <div className="absolute w-full bottom-0 md:w-140 h-140 bg-primary/40 rounded-full blur-[140px] -z-10" />

        <svg
          className="absolute w-0 h-0 pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="inverted-left-path" clipPathUnits="objectBoundingBox">
              <path d="M 0.042 0.069 L 0.25 0.069 A 0.042 0.035 0 0 0 0.292 0.035 A 0.042 0.035 0 0 1 0.333 0 L 0.958 0 A 0.042 0.035 0 0 1 1 0.035 L 1 0.965 A 0.042 0.035 0 0 1 0.958 1 L 0.042 1 A 0.042 0.035 0 0 1 0 0.965 L 0 0.104 A 0.042 0.035 0 0 1 0.042 0.069 Z" />
            </clipPath>
            <clipPath
              id="inverted-right-path-corrected"
              clipPathUnits="objectBoundingBox"
            >
              <path d="M 0.958 0.069 L 0.75 0.069 A 0.042 0.035 0 0 1 0.708 0.035 A 0.042 0.035 0 0 0 0.667 0 L 0.042 0 A 0.042 0.035 0 0 0 0 0.035 L 0 0.965 A 0.042 0.035 0 0 0 0.042 1 L 0.958 1 A 0.042 0.035 0 0 0 1 0.965 L 1 0.104 A 0.042 0.035 0 0 0 0.958 0.069 Z" />
            </clipPath>
          </defs>
        </svg>
        <div className="absolute bottom-0 w-full opacity-30 -z-10">
          <img
            src="/bottom-bg.avif"
            alt="Hero Background"
            className="object-cover w-full h-screen"
          />
          <div className="absolute inset-x-0 top-0 h-[40vh] bg-linear-to-b from-background to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-linear-to-t from-background to-transparent" />
        </div>
      </body>
    </html>
  );
}
