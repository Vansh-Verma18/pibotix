"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import CustomImage from "../ui/CustomImage";
import { useScreenWidth } from "@/hooks/useScreenWidth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileFoundersOpen, setMobileFoundersOpen] = useState(false);
  const [mobileWhyOpen, setMobileWhyOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const screenWidth = useScreenWidth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setMobileFoundersOpen(false);
      setMobileWhyOpen(false);
      setMobileServicesOpen(false);
    }
  };

  return (
    <>
      <header className="md:top-10 left-0 w-full md:container  z-50  mx-auto px-6 md:px-0 py-1">
        <div className="w-full relative mx-auto flex items-center justify-between ">
          <Link
            href="/"
            className="max-md:-ml-3"
            onClick={() => setIsOpen(false)}
          >
            <CustomImage
              src={"/light-full-vortexio.svg"}
              alt="Vortexio Solutions"
              title="Vortexio Solutions - Digital Innovation & Software Development"
              priority={true}
              width={screenWidth > 500 ? 250 : 150}
              height={screenWidth > 500 ? 250 : 150}
            />
          </Link>

          <nav className="hidden md:-mt-3 min-[1293px]:flex items-center text-lg gap-x-8 font-medium">
            <FlyoutLink href="#" label="Solutions for Founders">
              <div className="w-80 bg-neutral-900 p-4 shadow-2xl rounded-xl border border-neutral-800">
                <div className="flex flex-col gap-4">
                  <Link
                    href="/contact"
                    className="flex items-start gap-4 hover:bg-neutral-800 p-2 rounded-lg transition-colors"
                  >
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <Icon name="Wand2" className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-neutral-100">
                        Starting from Scratch?
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Transform your idea into a product.
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-start gap-4 hover:bg-neutral-800 p-2 rounded-lg transition-colors"
                  >
                    <div className="bg-orange-500/10 p-2 rounded-full text-orange-500">
                      <Icon name="RefreshCcw" className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-neutral-100">
                        Recovering Bad Build?
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Let us fix and optimize your code.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/contact"
                    className="flex items-start gap-4 hover:bg-neutral-800 p-2 rounded-lg transition-colors"
                  >
                    <div className="bg-green-500/10 p-2 rounded-full text-green-500">
                      <Icon name="TrendingUp" className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-neutral-100">
                        Scaling what You've Built?
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Take your product to the next level.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </FlyoutLink>

            <FlyoutLink href="#" label="Why Vortexio">
              <div className="w-48 bg-neutral-900 p-2 shadow-2xl rounded-xl border border-neutral-800 flex flex-col gap-1">
                <Link
                  href="/our-story"
                  className="block px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm text-neutral-100"
                >
                  Our Story
                </Link>
                <Link
                  href="/#whychooseus"
                  className="block px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm text-neutral-100"
                >
                  Values
                </Link>
                <Link
                  href="/our-story"
                  className="block px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm text-neutral-100"
                >
                  Team
                </Link>
              </div>

            </FlyoutLink>

            <FlyoutLink href="#services" label="Services">
              <div className="w-56 bg-neutral-900 p-2 shadow-2xl rounded-xl border border-neutral-800 flex flex-col gap-1">
                <Link
                  href="/services/web-development"
                  className="block px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm text-neutral-100"
                >
                  Web Development
                </Link>
                <Link
                  href="/services/app-development"
                  className="block px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm text-neutral-100"
                >
                  Mobile App Development
                </Link>
                <Link
                  href="/services/ui-ux"
                  className="block px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm text-neutral-100"
                >
                  UI/UX Design
                </Link>
                <Link
                  href="/services/cloud-infrastructure"
                  className="block px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm text-neutral-100"
                >
                  Cloud Solutions
                </Link>
              </div>
            </FlyoutLink>

            <Link href="/blog" className="hover:text-secondary transition">
              Blog
            </Link>
          </nav>

          <div className="hidden md:-mt-3 min-[1293px]:flex">
            <Link
              href={"/contact"}
              className="flex items-center text-lg gap-x-2 rounded-md bg-secondary transition-all duration-150 ease-linear text-primary-foreground shadow h-9 px-4 py-2 text-white"
              size="sm"
            >
              Contact Us <Icon name="ArrowUpRight" />
            </Link>
          </div>

          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            type="button"
            className={`min-[1293px]:hidden z-50 relative cursor-pointer -mt-3 h-auto text-white`}
          >
            <Icon name={isOpen ? "X" : "Menu"} className="w-7! h-7!" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-0 pt-12 z-40 bg-black/80 backdrop-blur-lg min-[1293px]:hidden overflow-y-auto"
          >
            <nav className="flex flex-col p-6 gap-2">

              <div className="border-b border-neutral-800 pb-2">
                <button
                  onClick={() => setMobileFoundersOpen(!mobileFoundersOpen)}
                  className="flex items-center justify-between w-full text-lg font-medium py-2 text-left"
                >
                  <span>Solutions for Founders</span>
                  <Icon
                    name="ChevronDown"
                    className={`w-5 h-5 transition-transform ${mobileFoundersOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileFoundersOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden  pl-4 flex flex-col gap-3 text-neutral-400"
                    >
                      <Link
                        href="/contact"
                        onClick={toggleMenu}
                        className="block py-1 hover:text-primary"
                      >
                        Starting from Scratch?
                      </Link>
                      <Link
                        href="/contact"
                        onClick={toggleMenu}
                        className="block py-1 hover:text-primary"
                      >
                        Recovering from a Bad Build?
                      </Link>
                      <Link
                        href="/contact"
                        onClick={toggleMenu}
                        className="block py-1 hover:text-primary"
                      >
                        Scaling what You've Built?
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-b border-neutral-800 pb-2">
                <button
                  onClick={() => setMobileWhyOpen(!mobileWhyOpen)}
                  className="flex items-center justify-between w-full text-lg font-medium py-2 text-left"
                >
                  <span>Why Vortexio</span>
                  <Icon
                    name="ChevronDown"
                    className={`w-5 h-5 transition-transform ${mobileWhyOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileWhyOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4 flex flex-col gap-3 text-neutral-400"
                    >
                      <Link
                        href="/our-story"
                        onClick={toggleMenu}
                        className="block py-1 hover:text-primary"
                      >
                        Our Story
                      </Link>
                      <Link
                        href="/#whychooseus"
                        onClick={toggleMenu}
                        className="block py-1 hover:text-primary"
                      >
                        Values
                      </Link>
                      <Link
                        href="/our-story"
                        onClick={toggleMenu}
                        className="block py-1 hover:text-primary"
                      >
                        Team
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-b border-neutral-800 pb-2">
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex items-center justify-between w-full text-lg font-medium py-2 text-left"
                >
                  <span>Services</span>
                  <Icon
                    name="ChevronDown"
                    className={`w-5 h-5 transition-transform ${mobileServicesOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4 flex flex-col gap-3 text-neutral-400"
                    >
                      <Link
                        href="/services/web-development"
                        onClick={toggleMenu}
                        className="block py-1 hover:text-primary"
                      >
                        Web Development
                      </Link>
                      <Link
                        href="/services/app-development"
                        onClick={toggleMenu}
                        className="block py-1 hover:text-primary"
                      >
                        Mobile App Development
                      </Link>
                      <Link
                        href="/services/ui-ux"
                        onClick={toggleMenu}
                        className="block py-1 hover:text-primary"
                      >
                        UI/UX Design
                      </Link>
                      <Link
                        href="/services/cloud-infrastructure"
                        onClick={toggleMenu}
                        className="block py-1 hover:text-primary"
                      >
                        Cloud Solutions
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/blog"
                className="text-lg font-medium py-2 border-b border-neutral-800"
                onClick={toggleMenu}
              >
                Blog
              </Link>
              <div className="mt-4">
                <Link
                  href={"/contact"}
                  onClick={toggleMenu}
                  className="flex items-center justify-center gap-x-2 rounded-full bg-primary text-white text-lg w-full py-3 hover:scale-105 transition-transform duration-300"
                >
                  Contact Us{" "}
                  <Icon name="ArrowUpRight" className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const FlyoutLink = ({ children, href, label }) => {
  const [open, setOpen] = useState(false);
  const showFlyout = open && children;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative w-fit h-fit"
    >
      <Link
        href={href}
        className="relative text-white hover:text-secondary transition-colors flex items-center gap-1 py-4"
      >
        {label}
        <span
          style={{
            transform: showFlyout ? "scaleX(1)" : "scaleX(0)",
          }}
          className="absolute bottom-2 left-0 right-0 h-0.5 origin-left scale-x-0 rounded-full bg-secondary transition-transform duration-300 ease-out"
        />
        <Icon
          name="ChevronDown"
          className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""
            }`}
        />
      </Link>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 top-full bg-transparent pt-2 z-50"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <div className="relative">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
