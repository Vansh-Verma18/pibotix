import {
  Car,
  Microchip,
  Pill,
  Coffee,
  Truck,
  Package,
  Scissors,
  Wrench,
  FlaskConical,
  Sun
} from 'lucide-react';

export const industriesData = [
  {
    id: "automotive",
    name: "Automotive Manufacturing",
    icon: Car,
    overview: "The automotive industry demands high-speed, precision automation to meet ever-changing consumer demands and stringent safety regulations. From electric vehicle (EV) battery assembly to traditional powertrain manufacturing, automation is the key to scalability.",
    commonProblems: [
      "High labor costs and skilled labor shortages",
      "Inconsistent quality in manual welding and assembly",
      "Lengthy changeover times between vehicle models",
      "Traceability issues in complex supply chains"
    ],
    automationOpportunities: [
      "Robotic spot and arc welding",
      "Automated guided vehicles (AGVs) for part delivery",
      "Machine vision for defect detection and alignment",
      "Collaborative robots (Cobots) for final assembly"
    ],
    recommendedSolutions: [
      "Flexible Robotic Assembly Cells",
      "AI-Powered Quality Inspection Systems",
      "Plant-wide SCADA & MES Integration"
    ],
    estimatedImprovement: "35-50%",
    caseStudy: {
      title: "Tier 1 Supplier Output Optimization",
      metric: "40% increase in throughput",
      description: "Deployed a fully automated welding and inspection line using 12 6-axis robots and 3D vision systems, reducing cycle time by 40% and achieving zero-defect production."
    },
    technologies: ["FANUC Robotics", "Siemens TIA Portal", "Cognex Vision", "MQTT"]
  },
  {
    id: "electronics",
    name: "Electronics Manufacturing",
    icon: Microchip,
    overview: "Consumer electronics and semiconductor manufacturing require extreme precision, cleanliness, and speed. Automation ensures sub-millimeter accuracy and prevents contamination in cleanroom environments.",
    commonProblems: [
      "Miniaturization making manual assembly impossible",
      "High reject rates due to static or contamination",
      "Rapid product lifecycles requiring flexible lines",
      "Complex testing and validation requirements"
    ],
    automationOpportunities: [
      "High-speed SCARA and Delta robot deployment",
      "Automated Optical Inspection (AOI)",
      "Precision dispensing and conformal coating",
      "Wafer handling and packaging"
    ],
    recommendedSolutions: [
      "High-Precision Micro-Assembly Cells",
      "Integrated AOI and Deep Learning Defect Detection",
      "Cleanroom Compliant Transport Systems"
    ],
    estimatedImprovement: "45-60%",
    caseStudy: {
      title: "PCB Assembly Line Upgrade",
      metric: "99.9% Yield Rate",
      description: "Integrated an AI-driven vision inspection system with high-speed SCARA robots for component placement, cutting false rejects by 80%."
    },
    technologies: ["Epson SCARA", "Omron Sysmac", "Keyence Vision", "TensorFlow"]
  },
  {
    id: "pharmaceutical",
    name: "Pharmaceutical Industry",
    icon: Pill,
    overview: "Regulatory compliance, sterility, and extreme accuracy define pharmaceutical manufacturing. Automation provides the traceability and hygienic handling required by FDA and GMP standards.",
    commonProblems: [
      "Strict regulatory compliance (21 CFR Part 11)",
      "Contamination risks in manual handling",
      "Counterfeiting and serialization challenges",
      "Complex batch record management"
    ],
    automationOpportunities: [
      "Aseptic filling and sealing robots",
      "Automated track & trace (serialization) systems",
      "High-speed sorting and packaging",
      "Automated compounding and dispensing"
    ],
    recommendedSolutions: [
      "Sterile Robotic Handling Cells",
      "End-to-End Serialization Integration",
      "Automated Storage and Retrieval for Cold Chain"
    ],
    estimatedImprovement: "30-40%",
    caseStudy: {
      title: "Vaccine Packaging Line",
      metric: "Zero compliance breaches",
      description: "Implemented a fully automated secondary packaging and serialization line handling 400 vials per minute with full CFR 21 Part 11 compliance."
    },
    technologies: ["Stäubli Stericlean", "Rockwell Automation", "Cognex In-Sight", "OPC-UA"]
  },
  {
    id: "food-beverage",
    name: "Food & Beverage Processing",
    icon: Coffee,
    overview: "The food and beverage sector faces immense pressure to maintain hygiene, reduce waste, and increase throughput while managing perishable goods in harsh washdown environments.",
    commonProblems: [
      "Cross-contamination risks",
      "High turnover in repetitive, harsh working environments",
      "Inconsistent batching and recipe management",
      "Inefficient packaging and palletizing"
    ],
    automationOpportunities: [
      "Washdown-rated pick and place robots",
      "Automated batching and mixing control",
      "Vision-guided sorting of irregular organic items",
      "End-of-line robotic palletizing"
    ],
    recommendedSolutions: [
      "Sanitary Primary Packaging Robotics",
      "Automated Recipe Execution Systems",
      "High-Speed Palletizing & Stretch Wrapping"
    ],
    estimatedImprovement: "25-45%",
    caseStudy: {
      title: "Bakery Line Automation",
      metric: "300% throughput increase",
      description: "Replaced manual packaging with 3 washdown-rated Delta robots equipped with 3D vision, increasing picking speed to 120 items per minute."
    },
    technologies: ["ABB FlexPicker", "Allen-Bradley", "Sick Sensors", "Inductive Automation Ignition"]
  },
  {
    id: "warehousing",
    name: "Warehousing & Logistics",
    icon: Truck,
    overview: "E-commerce boom has pushed warehousing to its limits. Modern logistics rely heavily on automation to accelerate order fulfillment, manage inventory accuracy, and optimize space utilization.",
    commonProblems: [
      "Labor shortages during peak seasons",
      "Inefficient picking routes and high error rates",
      "Space constraints and poor inventory visibility",
      "High injury rates from manual heavy lifting"
    ],
    automationOpportunities: [
      "Autonomous Mobile Robots (AMRs) for goods-to-person",
      "Automated Storage and Retrieval Systems (AS/RS)",
      "High-speed conveyor and sortation networks",
      "Robotic piece picking using AI"
    ],
    recommendedSolutions: [
      "Fleet Management System for AMRs",
      "Intelligent AS/RS Integration",
      "AI-Powered Robotic Order Fulfillment"
    ],
    estimatedImprovement: "50-70%",
    caseStudy: {
      title: "E-Commerce Fulfillment Center",
      metric: "99.99% Order Accuracy",
      description: "Deployed a fleet of 50 AMRs integrated with a custom WCS (Warehouse Control System), reducing average order processing time from 4 hours to 45 minutes."
    },
    technologies: ["Mobile Industrial Robots (MiR)", "Python (Pathfinding)", "Siemens S7-1500", "Node-RED"]
  },
  {
    id: "packaging",
    name: "Packaging Industry",
    icon: Package,
    overview: "Packaging companies need to handle an infinite variety of shapes, sizes, and materials while maintaining high speeds and rapid changeover capabilities for short production runs.",
    commonProblems: [
      "Lengthy changeover times for different SKUs",
      "Material waste during setup and tuning",
      "Quality control in high-speed labeling and sealing",
      "Ergonomic hazards in manual case packing"
    ],
    automationOpportunities: [
      "Servo-driven flexible packaging machines",
      "Vision inspection for label alignment and seal integrity",
      "Robotic case erecting and packing",
      "Automated mixed-SKU palletizing"
    ],
    recommendedSolutions: [
      "Zero-Changeover Robotic Packing Cells",
      "High-Speed Vision Inspection Systems",
      "Integrated OEE Monitoring Dashboards"
    ],
    estimatedImprovement: "40-55%",
    caseStudy: {
      title: "Contract Packager Modernization",
      metric: "Changeover time reduced from 2 hours to 5 mins",
      description: "Implemented a fully servo-driven line with robotic case packing, allowing recipe-based automatic tool changes."
    },
    technologies: ["Yaskawa Motoman", "Beckhoff TwinCAT", "Keyence", "Ignition SCADA"]
  },
  {
    id: "textile",
    name: "Textile Manufacturing",
    icon: Scissors,
    overview: "The textile industry is transitioning from manual, labor-intensive processes to smart factories, utilizing IoT and automation to track materials, reduce waste, and improve loom efficiency.",
    commonProblems: [
      "High energy consumption and material waste",
      "Machine downtime due to thread breakage",
      "Inconsistent quality in dyeing and finishing",
      "Difficulty tracking work-in-progress (WIP)"
    ],
    automationOpportunities: [
      "Automated material handling and bobbin transport",
      "IoT sensors for predictive maintenance on looms",
      "Automated optical inspection for fabric defects",
      "Precise chemical dosing for dyeing"
    ],
    recommendedSolutions: [
      "Smart Loom Monitoring Systems",
      "Automated Fabric Inspection (AI Vision)",
      "AGV-based Material Transport"
    ],
    estimatedImprovement: "20-35%",
    caseStudy: {
      title: "Smart Weaving Mill",
      metric: "15% reduction in fabric defects",
      description: "Installed AI-based vision systems on 40 looms to detect thread anomalies in real-time, instantly stopping machines to prevent prolonged defect runs."
    },
    technologies: ["Siemens MindSphere", "Custom AI Vision", "Mitsubishi PLC", "AGVs"]
  },
  {
    id: "heavy-engineering",
    name: "Heavy Engineering",
    icon: Wrench,
    overview: "Manufacturing large-scale equipment for construction, mining, or aerospace requires massive payload capacities and extreme precision in welding and machining.",
    commonProblems: [
      "Dangerous working conditions for welders and fitters",
      "Difficulty manipulating massive components",
      "Lengthy cycle times for multi-pass welding",
      "Strict metallurgical quality requirements"
    ],
    automationOpportunities: [
      "Heavy-duty robotic welding on linear tracks",
      "Automated CNC machining centers",
      "Robotic plasma and laser cutting",
      "Automated non-destructive testing (NDT)"
    ],
    recommendedSolutions: [
      "Gantry-Mounted Robotic Welding Systems",
      "Automated Heavy Material Handling",
      "Digital Twin for Process Simulation"
    ],
    estimatedImprovement: "40-60%",
    caseStudy: {
      title: "Earthmover Chassis Welding",
      metric: "Welding time reduced by 60%",
      description: "Implemented a twin-robot welding cell on a 15-meter track with coordinated multi-axis positioners, ensuring perfect penetration on thick-plate steel."
    },
    technologies: ["KUKA Robotics", "Fronius Welding", "Siemens Sinumerik", "RoboDK"]
  },
  {
    id: "chemical",
    name: "Chemical Plants",
    icon: FlaskConical,
    overview: "Chemical processing demands highly reliable and intrinsically safe automation to handle volatile substances, maintain precise reaction conditions, and ensure environmental safety.",
    commonProblems: [
      "High risk of explosions or toxic exposure",
      "Difficulty maintaining precise temperatures and pressures",
      "Complex recipe management across continuous and batch processes",
      "Strict environmental emission regulations"
    ],
    automationOpportunities: [
      "Distributed Control Systems (DCS)",
      "Intrinsically safe IoT sensors (ATEX/IECEx)",
      "Automated valve and pump sequencing",
      "Predictive maintenance on critical assets"
    ],
    recommendedSolutions: [
      "Plant-wide DCS Migration & Upgrade",
      "Advanced Process Control (APC) Implementation",
      "Automated Safety Instrumented Systems (SIS)"
    ],
    estimatedImprovement: "15-30%",
    caseStudy: {
      title: "Specialty Chemical Batch Control",
      metric: "25% increase in batch consistency",
      description: "Upgraded legacy PLCs to a modern DCS, implementing advanced recipe management and reducing off-spec batches to near zero."
    },
    technologies: ["Emerson DeltaV", "Schneider Electric", "Yokogawa", "Industrial IoT"]
  },
  {
    id: "renewable",
    name: "Renewable Energy",
    icon: Sun,
    overview: "The manufacturing of solar panels, wind turbines, and energy storage systems requires high-volume, precision automation to drive down the levelized cost of energy (LCOE).",
    commonProblems: [
      "Fragility of silicon wafers during handling",
      "Massive scale of wind turbine components",
      "High cost of manufacturing limiting market adoption",
      "Quality control in battery cell production"
    ],
    automationOpportunities: [
      "High-speed, delicate wafer handling robots",
      "Automated layup for wind turbine composite blades",
      "End-to-end battery cell assembly lines",
      "AI inspection for micro-cracks in solar cells"
    ],
    recommendedSolutions: [
      "Gigafactory Automation Solutions",
      "High-Speed Solar Module Assembly Lines",
      "Automated Composite Manufacturing"
    ],
    estimatedImprovement: "50-80%",
    caseStudy: {
      title: "Solar Module Assembly Line",
      metric: "1.2 GW Annual Production Capacity",
      description: "Designed a fully automated 500MW module line with robotic stringers, automated bussing, and AI-driven electroluminescence (EL) testing."
    },
    technologies: ["Stäubli Robotics", "Beckhoff", "Cognex Deep Learning", "SCADA"]
  }
];
