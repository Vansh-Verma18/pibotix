"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import CustomImage from "../ui/CustomImage";
import { footerLinks } from "@/data/data";
import { useScreenWidth } from "@/hooks/useScreenWidth";

const Footer = () => {
    const screenWidth = useScreenWidth();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="md:pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
                    <div className="col-span-2 md:col-span-1 lg:col-span-2">
                        <Link href="/" className="font-black text-3xl text-white mb-6 block">
                            <CustomImage
                                src={"/light-full-vortexio.svg"}
                                alt="Vortexio Solutions"
                                title="Vortexio Solutions - Digital Innovation & Software Development"
                                priority={true}
                                width={screenWidth > 500 ? 250 : 150}
                                height={screenWidth > 500 ? 250 : 150}
                            />

                        </Link>
                        <p className="text-gray-400 mb-8 max-w-sm">
                            Empowering businesses with cutting-edge digital solutions. We build the future of technology, one pixel at a time.
                        </p>
                        <div className="flex gap-4">
                            {footerLinks.social.map((social) => (
                                <Link
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300"
                                    aria-label={social.name}
                                >
                                    <Icon name={social.icon} className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white">Services</h3>
                        <ul className="space-y-4">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-400 hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white">Company</h3>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-400 hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white">Legal</h3>
                        <ul className="space-y-4">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-400 hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {currentYear} Vortexio Solutions. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms-conditions" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
