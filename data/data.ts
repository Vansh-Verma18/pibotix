export interface Service {
  title: string;
  slug: string;
  description: string;
}

const servicesData: Service[] = [
  {
    title: "Web Development",
    slug: "web-development",
    description: "We build fast, scalable and SEO friendly websites.",
  },

  {
    title: "UI UX Design",
    slug: "ui-ux",
    description: "User-focused UI/UX design for better conversions.",
  },

  {
    title: "Cloud Services",
    slug: "cloud",
    description: "Secure and scalable cloud infrastructure solutions.",
  },

  {
    title: "App Development",
    slug: "app-development",
    description: "Android and iOS mobile application development.",
  },

];

export default servicesData;


export const FilpsImagesUrls = [
  { url: "/FlipImg1.png", title: "Vortexio Solutions - Websites Development" },
  { url: "/FlipImg2.png", title: "Vortexio Solutions - Apps Development" },
  { url: "/FlipImg3.png", title: "Vortexio Solutions - Blockchain Solutions" },
  { url: "/FlipImg4.png", title: "Vortexio Solutions - Digital Innovation" },
]

export const appPlans = [
  { name: "🚀 Launch Plan", level: "starter", price: 40000, popular: false },
  { name: "📈 Grow Plan", level: "pro", price: 90000, popular: true },
  { name: "👑 Dominate Plan", level: "all", price: 150000, popular: false },
];

export const websitePlans = [
  { name: "🚀 Launch Plan", level: "starter", price: 15000, popular: false },
  { name: "📈 Grow Plan", level: "pro", price: 35000, popular: true },
  { name: "👑 Dominate Plan", level: "all", price: 80000, popular: false },
];

export const appPricingFeatures = [
  { name: "Up to 6 Screens", included: "starter" },
  { name: "Basic UI Components", included: "starter" },
  { name: "Splash Screen + App Icon", included: "starter" },
  { name: "Firebase or Basic Backend (Auth + DB)", included: "starter" },
  { name: "Push Notifications (Basic)", included: "starter" },
  { name: "Play Store Release", included: "starter" },
  { name: "Minor Bug Fix Support – 15 days", included: "starter" },
  { name: "Delivery: 20–25 days", included: "starter" },
  { name: "iOS App Release", included: "pro" },
  { name: "Premium UI Animations", included: "pro" },
  { name: "Payment Gateway", included: "pro" },
  { name: "Admin Panel", included: "pro" },
  { name: "10–15 Screens", included: "pro" },
  { name: "Custom UI Branding (better feel)", included: "pro" },
  { name: "Push Notifications + Deep Links", included: "pro" },
  { name: "Full Admin Panel (Web Dashboard)", included: "pro" },
  { name: "Authentication + Real-time DB", included: "pro" },
  { name: "Payment Gateway Integration", included: "pro" },
  { name: "Analytics Integration", included: "pro" },
  { name: "Play Store + App Store Release", included: "pro" },
  { name: "Support – 30 days", included: "pro" },
  { name: "Delivery: 35–45 days", included: "pro" },
  { name: "20+ Screens", included: "all" },
  { name: "Stunning Premium UI + Micro Animations", included: "all" },
  { name: "Real-Time Features (Live Location / Chat / Tracking)", included: "all" },
  { name: "Advanced Security + Optimization", included: "all" },
  { name: "Multi-language + Multi-currency", included: "all" },
  { name: "Custom API Integrations", included: "all" },
  { name: "Admin Panel Pro + Roles", included: "all" },
  { name: "Full Performance Monitoring", included: "all" },
  { name: "Priority Support + SLA", included: "all" },
  { name: "Delivery: 60–90 days", included: "all" },
];

export const websitePricingFeatures = [
  { name: "4-6 Pages (Home, About, Services, Contact, etc.)", included: "starter" },
  { name: "Mobile Responsive", included: "starter" },
  { name: "WhatsApp & Call Integration", included: "starter" },
  { name: "Basic SEO setup", included: "starter" },
  { name: "1 Business Email Setup", included: "starter" },
  { name: "Standard UI Design", included: "starter" },
  { name: "1 Revision Round", included: "starter" },
  { name: "Delivery: 7 days", included: "starter" },
  { name: "Blog Module", included: "pro" },
  { name: "CMS Admin Panel – Edit Any Content", included: "pro" },
  { name: "Custom Animations", included: "pro" },
  { name: "Advanced Speed Optimization", included: "pro" },
  { name: "8-12 Pages", included: "pro" },
  { name: "On-Page SEO + Submission", included: "pro" },
  { name: "Blog/News Module", included: "pro" },
  { name: "Lead Forms + CRM email collection", included: "pro" },
  { name: "Better UI + Animations", included: "pro" },
  { name: "Stock images included", included: "pro" },
  { name: "3 Revisions", included: "pro" },
  { name: "Delivery: 14 days", included: "pro" },
  { name: "Premium UI/UX + Micro-Animations", included: "all" },
  { name: "Marketing Landing Pages", included: "all" },
  { name: "Speed & Performance Optimization", included: "all" },
  { name: "Security Hardening", included: "all" },
  { name: "Multi-language Support", included: "all" },
  { name: "Custom Features + API Integrations", included: "all" },
  { name: "Priority Support (Phone + WhatsApp)", included: "all" },
  { name: "Analytics Setup + Conversion Tracking", included: "all" },
  { name: "Delivery: 21-30 days", included: "all" },
];

export const footerLinks = {
  services: [
    { name: "Web Development", href: "#" },
    { name: "Mobile Apps", href: "#" },
    { name: "UI/UX Design", href: "#" },
    { name: "Cloud Solutions", href: "#" },
    { name: "DevOps", href: "#" },
    { name: "Consulting", href: "#" },
    { name: "Maintenance", href: "#" },
  ],
  company: [
    { name: 'Home', href: '/' },
    { name: "About Us", href: "/our-story" },
    { name: "Services", href: "#services" },
    { name: "Careers", href: "#careers" },
    { name: "Our Team", href: "#team" },
    { name: "Tech Stack", href: "/techstack" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-conditions" },
  ],
  social: [
    { name: "Facebook", icon: "Facebook", href: "#" },
    { name: "Instagram", icon: "Instagram", href: "https://www.instagram.com/vortexiosolutions" },
    { name: "Linkedin", icon: "Linkedin", href: "#" },
    { name: "Twitter", icon: "Twitter", href: "#" },
  ],
};

export const portfolios = [
  {
    id: "cScM8VluiGMv4S3YdCWd",
    description: "Empower educators and coaching brands to deliver personalized, scalable, and smart learning experiences. From AI-guided assessments to engagement analytics and brandable apps/websites — we enable you to build your own education empire.",
    completedAt: "2025-10-14T10:03:45.000Z",
    image: "/vortexio.png",
    imageTitle: "Vortexio Solutions - AI-Powered Admin Panel Enterprise SaaS Platform",
    title: "AI-Powered Admin Panel — Enterprise SaaS Management & Analytics Platform"
  },
  {
    id: "2xPm9WnujHNw5T4ZeCXe",
    description: "Empower educators and coaching brands to deliver personalized, scalable, and smart learning experiences. From AI-guided assessments to engagement analytics and brandable apps/websites — we enable you to build your own education empire.",
    completedAt: "2025-10-14T10:03:45.000Z",
    image: "/vortexio.png",
    imageTitle: "Vortexio Solutions - AI-Powered Admin Panel Enterprise SaaS Platform",
    title: "AI-Powered Admin Panel — Enterprise SaaS Management & Analytics Platform"
  },
  {
    id: "3yQn0XovkIOx6U5AfDYf",
    description: "Empower educators and coaching brands to deliver personalized, scalable, and smart learning experiences. From AI-guided assessments to engagement analytics and brandable apps/websites — we enable you to build your own education empire.",
    completedAt: "2025-10-14T10:03:45.000Z",
    image: "/vortexio.png",
    imageTitle: "Vortexio Solutions - AI-Powered Admin Panel Enterprise SaaS Platform",
    title: "AI-Powered Admin Panel — Enterprise SaaS Management & Analytics Platform"
  },
];

export const categories = [
  {
    title: "Frontend",
    tools: [
      {
        name: "Next.js",
        description: "React framework with server-side rendering",
        icon: "/techstack/nextjs.svg",
        iconTitle: "Vortexio Solutions - Next.js Framework",
      },
      {
        name: "Tailwind CSS",
        description: "Utility-first CSS framework",
        icon: "/techstack/tailwind.png",
        iconTitle: "Vortexio Solutions - Tailwind CSS Framework",
      },
      {
        name: "TypeScript",
        description: "Typed superset of JavaScript",
        icon: "/techstack/typescript.svg",
        iconTitle: "Vortexio Solutions - TypeScript Language",
      },

      {
        name: "SASS / SCSS",
        description: "CSS preprocessor with variables and nesting",
        icon: "/techstack/sass.svg",
        iconTitle: "Vortexio Solutions - SASS/SCSS Preprocessor",
      },
      {
        name: "Redux Toolkit",
        description: "State management for React apps",
        icon: "/techstack/redux.svg",
        iconTitle: "Vortexio Solutions - Redux Toolkit State Management",
      },
      {
        name: "Vite",
        description: "Fast frontend build tool",
        icon: "/techstack/vite.svg",
        iconTitle: "Vortexio Solutions - Vite Build Tool",
      },

    ],
  },
  {
    title: "Backend",
    tools: [
      {
        name: "Microservice Architecture",
        description: "Scalable and modular backend architecture for building scalable and maintainable applications",
        icon: "/techstack/micro_architecture.png",
        iconTitle: "Vortexio Solutions - Microservice Architecture",
      },
      {
        name: "Golang",
        description: "Fast and efficient programming language for building scalable and maintainable applications",
        icon: "/techstack/golang.png",
        iconTitle: "Vortexio Solutions - Golang Programming",

      },

      {
        name: "Express.js",
        description: "Minimal backend web framework for Node.js",
        icon: "/techstack/express.svg",
        iconTitle: "Vortexio Solutions - Express.js Framework",
      },
      {
        name: "Kafka",
        description:
          "Scalable message broker for building real-time applications",
        icon: "/techstack/kafka.png",
        iconTitle: "Vortexio Solutions - Apache Kafka Message Broker",
      },
      {
        name: "GraphQL",
        description: "Query language for APIs that allows clients to request exactly the data they need and nothing more",
        icon: "/techstack/graphql.png",
        iconTitle: "Vortexio Solutions - GraphQL API",
      },
      {
        name: "gRPC",
        description:
          "High-performance communication framework for building distributed and scalable microservices",
        icon: "/techstack/grpc.png",
        iconTitle: "Vortexio Solutions - gRPC Framework",
      },
    ],
  },
  {
    title: "Databases",
    tools: [
      {
        name: "MongoDB",
        description: "NoSQL database for flexible schemas",
        icon: "/techstack/mongodb.svg",
        iconTitle: "Vortexio Solutions - MongoDB Database",
      },
      {
        name: "PostgreSQL",
        description: "Relational open-source SQL database",
        icon: "/techstack/postgresql.svg",
        iconTitle: "Vortexio Solutions - PostgreSQL Database",
      },
      {
        name: "MySQL",
        description: "Popular open-source relational database",
        icon: "/techstack/mysql.svg",
        iconTitle: "Vortexio Solutions - MySQL Database",
      },
      {
        name: "SQLite",
        description: "Lightweight SQL database engine",
        icon: "/techstack/sqlite.svg",
        iconTitle: "Vortexio Solutions - SQLite Database",
      },
      {
        name: "Firebase",
        description: "Real-time NoSQL database and backend platform",
        icon: "/techstack/firebase.svg",
        iconTitle: "Vortexio Solutions - Firebase Platform",
      },
      {
        name: "Redis",
        description:
          "In-memory key-value store for caching and real-time analytics",
        icon: "/techstack/redis.svg",
        iconTitle: "Vortexio Solutions - Redis Cache",
      },

    ],
  },
  {
    title: "Blockchain",
    tools: [
      {
        name: "Ethereum",
        description: "Decentralized blockchain with smart contracts",
        icon: "/techstack/ethereum.svg",
        iconTitle: "Vortexio Solutions - Ethereum Blockchain",
      },
      {
        name: "Solidity",
        description: "Smart contract programming language",
        icon: "/techstack/solidity.svg",
        iconTitle: "Vortexio Solutions - Solidity Smart Contracts",
      },
      {
        name: "Foundry",
        description:
          "Blazing fast, portable, modular toolkit for Ethereum application development",
        icon: "/techstack/foundry.png",
        iconTitle: "Vortexio Solutions - Foundry Toolkit",
      },
    ],
  },
  {
    title: "Mobile",
    tools: [
      {
        name: "Flutter",
        description: "Cross-platform mobile app SDK by Google",
        icon: "/techstack/flutter.svg",
        iconTitle: "Vortexio Solutions - Flutter Mobile Development",
      },
      {
        name: "React Native",
        description: "Build native apps using React",
        icon: "/techstack/reactnative.svg",
        iconTitle: "Vortexio Solutions - React Native Apps",
      },
      {
        name: "SwiftUI",
        description: "Declarative UI framework for Apple platforms",
        icon: "/techstack/swift.png",
        iconTitle: "Vortexio Solutions - SwiftUI Development",
      },
    ],
  },
  {
    title: "UI/UX & Design",
    tools: [
      {
        name: "Figma",
        description: "Collaborative interface design tool",
        icon: "/techstack/figma.svg",
        iconTitle: "Vortexio Solutions - Figma Design Tool",
      },
      {
        name: "Framer",
        description: "Interactive prototyping & no-code development",
        icon: "/techstack/framer.png",
        iconTitle: "Vortexio Solutions - Framer Prototyping",
      },
      {
        name: "Miro",
        description: "Collaborative whiteboard platform",
        icon: "/techstack/miro.png",
        iconTitle: "Vortexio Solutions - Miro Collaboration",
      },
      {
        name: "Adobe XD",
        description: "UI/UX design and prototyping tool",
        icon: "/techstack/adobexd.svg",
        iconTitle: "Vortexio Solutions - Adobe XD Design",
      },
      {
        name: "Sketch",
        description: "Vector-based UI design tool for macOS",
        icon: "/techstack/sketch.svg",
        iconTitle: "Vortexio Solutions - Sketch Design Tool",
      },
      {
        name: "Zeplin",
        description: "Handoff tool for UI designers and developers",
        icon: "/techstack/zeplin.svg",
        iconTitle: "Vortexio Solutions - Zeplin Handoff Tool",
      },
    ],
  },
];


export const metadataMap: Record<string, any> = {
  home: {
    description: "Vortexio Solutions - Transform your ideas into powerful digital solutions with cutting-edge web development, mobile apps, blockchain, and AI/ML services. Expert team delivering innovative technology solutions.",
    keywords: "vortexio solutions, vortexio, web development, mobile app development, blockchain solutions, AI ML services, software development, digital transformation, tech solutions, custom software, app development company",
    metaTitle: "Vortexio Solutions - Innovative Digital Solutions & Software Development",
    title: "Vortexio Solutions - Innovative Digital Solutions & Software Development",
    url: "https://www.vortexiosolutions.com",
  },
  contact: {
    description: "Connect with Vortexio Solutions for expert web development, mobile apps, and digital transformation. Our team is ready to help you scale your business with custom software solutions.",
    keywords: "vortexio solutions contact, hire web developers, mobile app development company, blockchain consultation, custom software services, tech partnership, Vortexio support",
    metaTitle: "Contact Vortexio Solutions | Expert Software Development Team",
    title: "Contact Us | Vortexio Solutions",
    url: "https://www.vortexiosolutions.com/contact",
  },
  "our-story": {
    description: "Discover the journey of Vortexio Solutions. From a bold vision to a global technology studio, learn how we build high-performance digital products for founders and enterprises.",
    keywords: "Vortexio story, company mission, tech studio journey, Vortexio values, software development history, our team story, digital innovation leaders",
    metaTitle: "Our Story - Vortexio Solutions | Building the Future of Digital Products",
    title: "Our Story | Vortexio Solutions",
    url: "https://www.vortexiosolutions.com/our-story",
  },
  techstack: {
    description: "Explore Vortexio Solutions's cutting-edge technology stack. We leverage Next.js, React Native, Flutter, Golang, Microservices, PostgreSQL, MongoDB, Ethereum, Solidity, and modern design tools to build scalable, high-performance enterprise solutions.",
    keywords: "technology stack, nextjs development, react native apps, flutter development, golang microservices, postgresql database, mongodb nosql, ethereum blockchain, solidity smart contracts, graphql api, kafka message broker, redis cache, typescript development, tailwind css, figma design, enterprise tech stack, scalable architecture, modern web technologies, mobile app technologies, blockchain development tools",
    metaTitle: "Tech Stack - Vortexio Solutions | Modern Technologies for Enterprise Solutions",
    title: "Our Technology Stack - Vortexio Solutions | Cutting-Edge Development Tools",
    url: "https://www.vortexiosolutions.com/techstack",
  },
  "privacy-policy": {
    description: "Privacy Policy for Vortexio Solutions. Learn how we collect, use, and protect your personal data.",
    keywords: "privacy policy, data protection, Vortexio privacy, software agency legal",
    metaTitle: "Privacy Policy | Vortexio Solutions",
    title: "Privacy Policy | Vortexio Solutions",
    url: "https://www.vortexiosolutions.com/privacy-policy",
  },
  "terms-conditions": {
    description: "Terms and Conditions for Vortexio Solutions. Standard agreement for our software development and design services.",
    keywords: "terms and conditions, service agreement, Vortexio legal, software development terms",
    metaTitle: "Terms & Conditions | Vortexio Solutions",
    title: "Terms & Conditions | Vortexio Solutions",
    url: "https://www.vortexiosolutions.com/terms-conditions",
  },
};


export const testimonials: Record<string, any>[] = [
  {
    text: "Vortexio Solutions transformed our legacy systems into a modern, scalable architecture. Their team's expertise in cloud solutions is unmatched.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    imageTitle: "Vortexio Solutions Client - Rahul Sharma CTO TechFlow",
    name: "Rahul Sharma",
    role: "CTO at TechFlow",
  },
  {
    text: "The mobile app they built for us is flawless. User engagement has increased by 40% since launch. Highly recommended!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    imageTitle: "Vortexio Solutions Client - Sarah Jenkins Product Manager InnovateX",
    name: "Sarah Jenkins",
    role: "Product Manager at InnovateX",
  },
  {
    text: "We needed a partner who understood the startup ecosystem. Vortexio Solutions delivered an MVP in record time without compromising quality.",
    image: "https://randomuser.me/api/portraits/men/86.jpg",
    imageTitle: "Vortexio Solutions Client - Amit Patel Founder StartUp Hub",
    name: "Amit Patel",
    role: "Founder of StartUp Hub",
  },
  {
    text: "Their custom ERP solution streamlined our entire supply chain. We've seen a significant reduction in operational costs.",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    imageTitle: "Vortexio Solutions Client - Michael Chen Director GlobalLogistics",
    name: "Michael Chen",
    role: "Director of Operations at GlobalLogistics",
  },
  {
    text: "The website redesign was exactly what we needed. It's visually stunning and has improved our lead generation tremendously.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    imageTitle: "Vortexio Solutions Client - Priya Singh Marketing Head BrandBoost",
    name: "Priya Singh",
    role: "Marketing Head at BrandBoost",
  },
  {
    text: "Professional, responsive, and incredibly talented. They brought our vision to life in ways we hadn't even imagined.",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    imageTitle: "Vortexio Solutions Client - Emily Davis CEO CreativeWorks",
    name: "Emily Davis",
    role: "CEO at CreativeWorks",
  },
];
