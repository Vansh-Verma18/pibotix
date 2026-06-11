

import ContactSection from '@/components/home/ContactSection';
import generatePageMetadata from "@/utils/generateMetadata";

export const metadata = generatePageMetadata("contact");

export default function ContactPage() {
    return (
        <main className="w-full relative  md:container md:mx-auto ">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
            </div>
            <ContactSection isPage={true} />
        </main>
    );
}
