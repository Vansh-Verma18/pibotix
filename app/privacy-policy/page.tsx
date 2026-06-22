export const metadata = {
  title: 'Privacy Policy | Pibotix',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl prose prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-gray-400">Last Updated: June 2026</p>
        
        <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Information We Collect</h2>
        <p className="text-gray-400">
          We collect information that you provide directly to us when you fill out contact forms, request a quote, or subscribe to our newsletter. This may include your name, email address, phone number, and company details.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Information</h2>
        <p className="text-gray-400">
          We use the information we collect to provide, maintain, and improve our services, to process your requests, and to communicate with you regarding your projects and our offerings.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Data Security</h2>
        <p className="text-gray-400">
          We implement appropriate technical and organizational measures to protect the security of your personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>
      </div>
    </div>
  );
}
