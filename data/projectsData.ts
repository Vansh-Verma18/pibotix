export type ProjectCategory = "Completed" | "Ongoing" | "Prototype" | "Research";

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  industry: string;
  clientSize: string;
  techStack: string[];
  duration: string;
  status: string; // e.g., "100% Completed", "Phase 2 (60%)"
  roi: string;
  images: string[];
  overview: string;
  timeline: TimelineEvent[];
  documentationUrl: string;
}

export const projectsData: Project[] = [
  {
    id: "p-1",
    slug: "ai-robotic-sorter-logistics",
    title: "AI-Driven High-Speed Robotic Sorter",
    category: "Completed",
    industry: "Warehousing & Logistics",
    clientSize: "Enterprise (10,000+ Employees)",
    techStack: ["Computer Vision", "ABB Robotics", "TensorFlow", "Ignition SCADA"],
    duration: "8 Months",
    status: "100% Completed",
    roi: "210% within 14 months",
    images: ["/Service4.webp", "/Service5.webp", "/Service6.webp"],
    overview: "We designed and implemented a fully automated sortation facility using AI-driven computer vision to handle irregular, non-standard packages that previously required manual handling. This system integrates seamlessly with the client's existing WMS.",
    timeline: [
      { date: "Month 1-2", title: "Site Analysis & Digital Twin Simulation", description: "Created a 3D simulation to identify bottlenecks in the proposed design." },
      { date: "Month 3-4", title: "Vision Model Training", description: "Trained the CNN model on over 500,000 package variations." },
      { date: "Month 5-6", title: "Hardware Installation", description: "Installed ABB Delta robots and high-speed conveyors." },
      { date: "Month 7-8", title: "Integration & Commissioning", description: "Final WMS API integration and live site testing." }
    ],
    documentationUrl: "#"
  },
  {
    id: "p-2",
    slug: "gigafactory-digital-twin",
    title: "Gigafactory Digital Twin Integration",
    category: "Ongoing",
    industry: "Automotive (EV)",
    clientSize: "Enterprise (25,000+ Employees)",
    techStack: ["Siemens MindSphere", "OPC-UA", "React 3D", "Edge Computing"],
    duration: "18 Months",
    status: "Phase 3 (75% Completed)",
    roi: "Projected $4.5M Annual Savings",
    images: ["/Service7.webp", "/Service2.webp"],
    overview: "Currently mapping a 5-million square foot EV battery manufacturing facility into a real-time Digital Twin. The system aggregates telemetry from over 12,000 PLCs to provide predictive maintenance alerts and dynamic production scheduling.",
    timeline: [
      { date: "Phase 1", title: "Infrastructure Audit", description: "Mapped all legacy and modern PLCs to standard OPC-UA architecture." },
      { date: "Phase 2", title: "Edge Gateway Deployment", description: "Installed 400 edge computing nodes for local data preprocessing." },
      { date: "Phase 3 (Current)", title: "3D Visualization", description: "Building the WebGL interactive dashboard for plant managers." },
      { date: "Phase 4", title: "Predictive AI Go-Live", description: "Turning on machine-learning alerts for preventative maintenance." }
    ],
    documentationUrl: "#"
  },
  {
    id: "p-3",
    slug: "cobot-welding-prototype",
    title: "Next-Gen Cobot Welding Cell",
    category: "Prototype",
    industry: "Heavy Engineering",
    clientSize: "Mid-Market (500-1000 Employees)",
    techStack: ["Universal Robots", "Fronius", "Safety Scanners", "ROS 2"],
    duration: "4 Months",
    status: "Testing (90%)",
    roi: "TBD (Testing Phase)",
    images: ["/Service3.webp"],
    overview: "Developing a highly flexible, fenceless collaborative robot (Cobot) welding cell designed for high-mix, low-volume job shops. Features intuitive hand-guiding programming so operators can teach weld paths in minutes.",
    timeline: [
      { date: "Week 1-4", title: "Conceptual Design", description: "Risk assessment for fenceless operation." },
      { date: "Week 5-8", title: "Hardware Assembly", description: "Mounting the UR10e and Fronius welding torch." },
      { date: "Week 9-12", title: "Software Integration", description: "Writing ROS 2 nodes for custom path teaching." },
      { date: "Week 13-16", title: "Safety Validation", description: "Rigorous testing of speed-and-separation monitoring." }
    ],
    documentationUrl: "#"
  },
  {
    id: "p-4",
    slug: "quantum-pathfinding-amr",
    title: "Quantum-Assisted AMR Pathfinding",
    category: "Research",
    industry: "R&D / Advanced Logistics",
    clientSize: "Academic / Enterprise Partnership",
    techStack: ["Quantum Computing API", "Python", "MiR Fleet", "Optimization Algos"],
    duration: "12 Months",
    status: "Research Phase",
    roi: "N/A",
    images: ["/Service6.webp", "/Service4.webp"],
    overview: "A pure R&D project exploring the use of quantum annealing algorithms to solve real-time fleet optimization for 500+ Autonomous Mobile Robots in dynamically changing warehouse environments.",
    timeline: [
      { date: "Q1", title: "Algorithm Formulation", description: "Translating the Traveling Salesperson Problem to a quantum model." },
      { date: "Q2", title: "Simulation Benchmarking", description: "Comparing classical vs. quantum heuristic solvers in simulation." },
      { date: "Q3", title: "Cloud Integration", description: "Hooking the fleet manager to a quantum cloud API." },
      { date: "Q4", title: "Small-Scale Physical Test", description: "Deploying the algorithm to a 10-robot test fleet." }
    ],
    documentationUrl: "#"
  },
  {
    id: "p-5",
    slug: "washdown-palletizer",
    title: "Sanitary Washdown Robotic Palletizer",
    category: "Completed",
    industry: "Food & Beverage",
    clientSize: "Enterprise (5,000+ Employees)",
    techStack: ["FANUC M-410iC", "Rockwell Automation", "Vision Inspection"],
    duration: "6 Months",
    status: "100% Completed",
    roi: "145% within 18 months",
    images: ["/Service5.webp", "/Service2.webp"],
    overview: "Designed a fully stainless-steel, IP69K-rated robotic palletizing cell for a meat processing plant. The robot can withstand high-pressure, high-temperature chemical washdowns daily without degrading.",
    timeline: [
      { date: "Month 1", title: "Hygienic Design", description: "Designing custom end-of-arm tooling with no water-catchment areas." },
      { date: "Month 2-3", title: "Build & FAT", description: "Cell built at our facility for Factory Acceptance Testing." },
      { date: "Month 4-5", title: "Installation", description: "Installed during a planned 2-week plant shutdown." },
      { date: "Month 6", title: "Operator Training", description: "Trained 3 shifts of operators on the new HMI." }
    ],
    documentationUrl: "#"
  },
  {
    id: "p-6",
    slug: "pharma-serialization-line",
    title: "High-Speed Pharma Serialization",
    category: "Ongoing",
    industry: "Pharmaceuticals",
    clientSize: "Enterprise (12,000+ Employees)",
    techStack: ["Cognex Deep Learning", "Siemens S7-1500", "SQL Server", "Optel"],
    duration: "10 Months",
    status: "Phase 2 (50% Completed)",
    roi: "Compliance Requirement",
    images: ["/Service2.webp"],
    overview: "Upgrading 4 high-speed bottling lines to meet 21 CFR Part 11 requirements. The system reads and aggregates individual 2D matrix codes at 400 bottles per minute into cases and pallets.",
    timeline: [
      { date: "Phase 1", title: "Vision Feasibility", description: "Proved camera readability on curved, reflective bottles at high speeds." },
      { date: "Phase 2 (Current)", title: "Line 1 & 2 Upgrade", description: "Installing hardware and integrating with the site SQL server." },
      { date: "Phase 3", title: "Line 3 & 4 Upgrade", description: "Rolling out the validated system to remaining lines." },
      { date: "Phase 4", title: "Validation (IQ/OQ/PQ)", description: "Executing comprehensive FDA validation protocols." }
    ],
    documentationUrl: "#"
  },
  {
    id: "p-7",
    slug: "autonomous-drone-inspection",
    title: "Autonomous Drone Pipeline Inspection",
    category: "Prototype",
    industry: "Oil & Gas / Energy",
    clientSize: "Enterprise (8,000+ Employees)",
    techStack: ["UAV Robotics", "LiDAR", "Edge AI", "ROS"],
    duration: "5 Months",
    status: "Field Testing (85%)",
    roi: "TBD",
    images: ["/Service7.webp"],
    overview: "Prototyping an autonomous drone system that uses LiDAR and computer vision to fly along miles of remote pipeline, automatically identifying micro-fractures, rust, or leaks without human pilots.",
    timeline: [
      { date: "Month 1", title: "Sensor Payload Integration", description: "Combining LiDAR and high-res RGB cameras on a heavy-lift drone." },
      { date: "Month 2", title: "AI Model Development", description: "Training the rust/fracture detection model." },
      { date: "Month 3-4", title: "Flight Programming", description: "Developing autonomous, GPS-denied navigation using SLAM." },
      { date: "Month 5", title: "Field Trials", description: "Testing in a controlled desert environment." }
    ],
    documentationUrl: "#"
  },
  {
    id: "p-8",
    slug: "smart-loom-retrofit",
    title: "Smart Loom Retrofit & IoT Dashboards",
    category: "Completed",
    industry: "Textile Manufacturing",
    clientSize: "Mid-Market (1,500 Employees)",
    techStack: ["Industrial IoT", "MQTT", "React.js", "Node.js"],
    duration: "4 Months",
    status: "100% Completed",
    roi: "300% within 8 months",
    images: ["/Service4.webp"],
    overview: "Retrofitted 150 mechanical weaving looms with non-invasive IoT sensors to monitor thread breaks, speed, and motor temperature. The data feeds into a central dashboard to track Overall Equipment Effectiveness (OEE).",
    timeline: [
      { date: "Week 1-2", title: "Sensor Selection", description: "Selected magnetic RPM and optical thread-break sensors." },
      { date: "Week 3-6", title: "Wireless Network Setup", description: "Deployed a secure, factory-wide LoRaWAN network." },
      { date: "Week 7-10", title: "Dashboard Development", description: "Built the custom React/Node web application." },
      { date: "Week 11-16", title: "Rollout & Optimization", description: "Installed on all 150 looms and identified an immediate 15% efficiency gain." }
    ],
    documentationUrl: "#"
  }
];
