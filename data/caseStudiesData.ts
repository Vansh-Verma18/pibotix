export interface Metric {
  label: string;
  value: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  clientIndustry: string;
  category: string;
  problemStatement: string;
  existingProcess: string;
  challenges: string[];
  proposedSolution: string;
  technologiesUsed: string[];
  implementationTimeline: string;
  costReduction: string;
  productivityIncrease: string;
  roiCalculation: string;
  beforeMetrics: Metric[];
  afterMetrics: Metric[];
  image: string;
  processFlow: { step: string; description: string }[];
}

export const caseStudiesData: CaseStudy[] = [
  {
    id: "cs-1",
    slug: "robotic-welding-automotive-chassis",
    title: "Robotic Welding Optimization for Automotive Chassis",
    clientIndustry: "Automotive Manufacturing",
    category: "Robotic Welding",
    problemStatement: "A Tier 1 automotive supplier faced critical bottlenecks and inconsistent weld quality on heavy-duty truck chassis assemblies, leading to high scrap rates and delayed shipments.",
    existingProcess: "Manual MIG welding performed by 24 skilled welders across 3 shifts. The process involved heavy manual lifting and positioning using basic jigs.",
    challenges: [
      "Severe shortage of skilled manual welders",
      "High defect rate (6.5%) requiring extensive rework",
      "Inconsistent penetration on thick-plate joints",
      "Ergonomic hazards leading to high worker turnover"
    ],
    proposedSolution: "Implemented a twin-robot welding cell on a 15-meter linear track with coordinated multi-axis positioners. The system utilized advanced seam tracking and touch-sensing to automatically adjust to part variations.",
    technologiesUsed: ["FANUC ARC Mate 120iC", "Fronius CMT Welding", "Rockwell CompactLogix", "RoboDK Offline Programming"],
    implementationTimeline: "16 Weeks",
    costReduction: "$850,000 annually",
    productivityIncrease: "140%",
    roiCalculation: "System Cost: $1.2M. Annual Savings: $850k + $200k in scrap reduction. ROI achieved in 13.5 months.",
    beforeMetrics: [
      { label: "Cycle Time", value: "45 mins/chassis" },
      { label: "Defect Rate", value: "6.5%" },
      { label: "Output/Day", value: "32 units" }
    ],
    afterMetrics: [
      { label: "Cycle Time", value: "18 mins/chassis" },
      { label: "Defect Rate", value: "0.2%" },
      { label: "Output/Day", value: "80 units" }
    ],
    image: "/Service3.webp",
    processFlow: [
      { step: "Automated Loading", description: "AGV delivers raw chassis frame to the welding cell." },
      { step: "Jig Clamping", description: "Pneumatic clamps secure the frame on a dual-axis positioner." },
      { step: "Seam Tracking", description: "Robots use laser vision to find exact joint locations." },
      { step: "Coordinated Welding", description: "Two robots weld simultaneously to prevent thermal distortion." },
      { step: "Automated Unloading", description: "Finished frame is moved to the cooling station." }
    ]
  },
  {
    id: "cs-2",
    slug: "ai-vision-inspection-electronics",
    title: "Deep Learning Vision Inspection for PCB Manufacturing",
    clientIndustry: "Electronics Manufacturing",
    category: "AI Quality Inspection",
    problemStatement: "A high-volume consumer electronics manufacturer struggled with false-rejects in their Automated Optical Inspection (AOI) of densely packed Printed Circuit Boards (PCBs).",
    existingProcess: "Legacy rules-based AOI systems flagged components based on simple contrast and edge detection, requiring manual secondary review for 15% of all boards.",
    challenges: [
      "High false-positive rate (12%) slowing down production",
      "Inability to adapt to slight lighting or batch variations",
      "Micro-components (0201 size) frequently misidentified",
      "Manual secondary inspection was labor-intensive and prone to human error"
    ],
    proposedSolution: "Deployed a custom AI-driven vision system utilizing Convolutional Neural Networks (CNNs) trained on thousands of known good and defective boards. Integrated with the existing transport conveyor.",
    technologiesUsed: ["Cognex ViDi", "NVIDIA TensorRT", "Basler Line Scan Cameras", "Omron NX Series PLC"],
    implementationTimeline: "10 Weeks",
    costReduction: "$420,000 annually",
    productivityIncrease: "35%",
    roiCalculation: "System Cost: $350k. Labor savings and recovered yield: $420k/year. ROI achieved in 10 months.",
    beforeMetrics: [
      { label: "False Reject Rate", value: "12.0%" },
      { label: "Missed Defects", value: "0.8%" },
      { label: "Inspection Speed", value: "4 boards/min" }
    ],
    afterMetrics: [
      { label: "False Reject Rate", value: "0.5%" },
      { label: "Missed Defects", value: "0.01%" },
      { label: "Inspection Speed", value: "10 boards/min" }
    ],
    image: "/Service6.webp",
    processFlow: [
      { step: "Board Entry", description: "PCB enters the dark-field lighting tunnel." },
      { step: "Line Scan", description: "High-speed camera captures 16K resolution image." },
      { step: "AI Inference", description: "Edge-computing GPU processes the image through the CNN." },
      { step: "Classification", description: "System instantly classifies anomalies as true defects or acceptable variations." },
      { step: "Routing", description: "Defective boards are routed to a rework spur; good boards proceed to packaging." }
    ]
  },
  {
    id: "cs-3",
    slug: "autonomous-warehouse-robotics",
    title: "End-to-End Warehouse Automation with AMRs",
    clientIndustry: "Logistics & E-Commerce",
    category: "Warehouse Automation",
    problemStatement: "A major e-commerce fulfillment center was overwhelmed during peak seasons, leading to missed delivery windows and high temporary labor costs.",
    existingProcess: "Manual 'picker-to-goods' method using carts and barcode scanners. Employees walked an average of 8 miles per shift.",
    challenges: [
      "Extremely long pick paths resulting in worker fatigue",
      "Inability to scale operations rapidly during Black Friday/Cyber Monday",
      "High order picking error rate (2.5%)",
      "Inefficient use of vertical warehouse space"
    ],
    proposedSolution: "Transformed the facility to a 'goods-to-person' model using a fleet of 80 Autonomous Mobile Robots (AMRs) integrated directly into their Warehouse Management System (WMS).",
    technologiesUsed: ["Mobile Industrial Robots (MiR)", "Custom Fleet Management Software", "Ignition SCADA", "REST API Integration"],
    implementationTimeline: "24 Weeks",
    costReduction: "$2.1M annually",
    productivityIncrease: "300%",
    roiCalculation: "System Cost: $3.5M. Labor and accuracy savings: $2.1M/year. ROI achieved in 20 months.",
    beforeMetrics: [
      { label: "Pick Rate", value: "60 items/hr" },
      { label: "Order Accuracy", value: "97.5%" },
      { label: "Labor Cost/Order", value: "$4.50" }
    ],
    afterMetrics: [
      { label: "Pick Rate", value: "240 items/hr" },
      { label: "Order Accuracy", value: "99.9%" },
      { label: "Labor Cost/Order", value: "$1.10" }
    ],
    image: "/Service4.webp",
    processFlow: [
      { step: "Order Received", description: "WMS sends order data to the Fleet Manager." },
      { step: "AMR Dispatch", description: "Robot navigates to the specific inventory pod." },
      { step: "Pod Retrieval", description: "AMR lifts the pod and transports it to the picking station." },
      { step: "Pick-to-Light", description: "Operator is guided by lights to pick the correct item." },
      { step: "Pod Return", description: "AMR returns the pod to an optimized storage location based on demand." }
    ]
  },
  {
    id: "cs-4",
    slug: "smart-factory-digital-twin",
    title: "Smart Factory Transformation via Digital Twin",
    clientIndustry: "Aerospace Manufacturing",
    category: "Smart Factory",
    problemStatement: "An aerospace manufacturer suffered from unexpected machine downtime and lacked real-time visibility into their multi-stage turbine blade production.",
    existingProcess: "Siloed CNC machines and autoclaves. Maintenance was reactive, and production scheduling relied on daily spreadsheet updates.",
    challenges: [
      "Zero visibility into machine health until failure occurred",
      "Production bottlenecks caused by unsynchronized processes",
      "High cost of scrapped materials due to autoclave temperature drifts",
      "Inability to simulate production changes without risking actual downtime"
    ],
    proposedSolution: "Developed a comprehensive Digital Twin of the entire facility. Connected 45 legacy machines using IoT gateways and visualized real-time 3D telemetry and OEE metrics.",
    technologiesUsed: ["Siemens MindSphere", "PTC Node-RED", "MQTT", "Three.js / WebGL", "OPC-UA"],
    implementationTimeline: "32 Weeks",
    costReduction: "$1.4M annually",
    productivityIncrease: "28%",
    roiCalculation: "System Cost: $800k. Saved downtime and scrap: $1.4M/year. ROI achieved in 7 months.",
    beforeMetrics: [
      { label: "Overall Equipment Effectiveness (OEE)", value: "54%" },
      { label: "Unplanned Downtime", value: "18 hrs/week" },
      { label: "Scrap Rate", value: "4.2%" }
    ],
    afterMetrics: [
      { label: "Overall Equipment Effectiveness (OEE)", value: "82%" },
      { label: "Unplanned Downtime", value: "2 hrs/week" },
      { label: "Scrap Rate", value: "0.8%" }
    ],
    image: "/Service7.webp",
    processFlow: [
      { step: "Data Acquisition", description: "IoT edge devices collect spindle speed, vibration, and temperature." },
      { step: "Cloud Ingestion", description: "Data is streamed securely via MQTT to the industrial cloud." },
      { step: "Digital Twin Mapping", description: "Telemetry is mapped onto exact 3D models of the factory floor." },
      { step: "Predictive Analytics", description: "Algorithms flag anomalous vibrations before a tool breaks." },
      { step: "Dynamic Scheduling", description: "Production manager reroutes jobs in the simulation before applying to the floor." }
    ]
  },
  {
    id: "cs-5",
    slug: "predictive-maintenance-chemical",
    title: "IoT Predictive Maintenance for Chemical Pumps",
    clientIndustry: "Chemical Processing",
    category: "Predictive Maintenance",
    problemStatement: "A petrochemical plant experienced catastrophic failures of critical transfer pumps, causing hazardous spills and complete plant shutdowns.",
    existingProcess: "Preventative maintenance based strictly on calendar days (e.g., replace seals every 6 months), regardless of actual usage or condition.",
    challenges: [
      "Replacing perfectly good parts prematurely (high maintenance costs)",
      "Still experiencing unpredictable failures between maintenance cycles",
      "Harsh, explosive environment (ATEX Zone 1) restricted manual inspections"
    ],
    proposedSolution: "Installed intrinsically safe wireless vibration and acoustic sensors on 120 critical pumps. Deployed machine learning models to detect cavitation and bearing wear weeks before failure.",
    technologiesUsed: ["Emerson AMS Wireless", "Azure IoT Hub", "Python (Scikit-Learn)", "PowerBI"],
    implementationTimeline: "12 Weeks",
    costReduction: "$950,000 annually",
    productivityIncrease: "15%",
    roiCalculation: "System Cost: $250k. Averted shutdowns: $950k/year. ROI achieved in 3.5 months.",
    beforeMetrics: [
      { label: "Pump Failures/Year", value: "14" },
      { label: "Maintenance Spend", value: "$1.2M" },
      { label: "Plant Uptime", value: "92%" }
    ],
    afterMetrics: [
      { label: "Pump Failures/Year", value: "0" },
      { label: "Maintenance Spend", value: "$450k" },
      { label: "Plant Uptime", value: "99.8%" }
    ],
    image: "/Service5.webp",
    processFlow: [
      { step: "Sensor Installation", description: "Intrinsically safe sensors mounted directly to pump casings." },
      { step: "Baseline Profiling", description: "AI monitors the pump for 2 weeks to learn its 'healthy' vibration signature." },
      { step: "Continuous Monitoring", description: "Sensors transmit triaxial vibration data every 5 minutes." },
      { step: "Anomaly Detection", description: "System detects a high-frequency spike indicating early bearing wear." },
      { step: "Alert & Action", description: "Maintenance team is notified 3 weeks in advance to schedule a repair during planned downtime." }
    ]
  },
  {
    id: "cs-6",
    slug: "plc-migration-food-beverage",
    title: "Zero-Downtime Legacy PLC Migration",
    clientIndustry: "Food & Beverage",
    category: "PLC Migration",
    problemStatement: "A massive bottling facility was running on obsolete PLC-5 controllers. Replacement parts were unavailable, and a controller failure would halt the entire factory.",
    existingProcess: "20-year-old control architecture with no ethernet capability, making data extraction impossible and exposing the plant to extreme risk.",
    challenges: [
      "Cannot afford a plant shutdown lasting more than 24 hours",
      "No existing digital documentation or updated electrical schematics",
      "Need to interface modern HMIs with older analog VFDs"
    ],
    proposedSolution: "Executed a phased 'shadow' migration. Installed modern ControlLogix PACs in parallel with the old system, verifying IO logic over weeks before switching control during a 12-hour weekend window.",
    technologiesUsed: ["Allen-Bradley ControlLogix", "FactoryTalk View SE", "ProSoft Migration Modules", "AutoCAD Electrical"],
    implementationTimeline: "20 Weeks (Preparation) + 1 Weekend (Cutover)",
    costReduction: "Averted $5M/day risk",
    productivityIncrease: "12%",
    roiCalculation: "System Cost: $650k. ROI calculated based on risk mitigation of a catastrophic failure.",
    beforeMetrics: [
      { label: "Network Capability", value: "None (DH+)" },
      { label: "Code Backup", value: "Manual/Floppy" },
      { label: "Scan Time", value: "45ms" }
    ],
    afterMetrics: [
      { label: "Network Capability", value: "EtherNet/IP" },
      { label: "Code Backup", value: "Automated/Cloud" },
      { label: "Scan Time", value: "3ms" }
    ],
    image: "/Service2.webp",
    processFlow: [
      { step: "Code Conversion", description: "Translated legacy logic to modern structured text and ladder." },
      { step: "Shadow IO Wiring", description: "Wired new PLC inputs in parallel with existing system." },
      { step: "Logic Verification", description: "Ran both PLCs simultaneously, comparing output states programmatically." },
      { step: "Hot Cutover", description: "Switched output control to the new PLC during a 12-hour shift." },
      { step: "SCADA Integration", description: "Connected the new network to the enterprise MES for real-time reporting." }
    ]
  },
  {
    id: "cs-7",
    slug: "high-speed-robotic-palletizing",
    title: "High-Speed Robotic Palletizing for CPG",
    clientIndustry: "Consumer Packaged Goods (CPG)",
    category: "Material Handling",
    problemStatement: "A paper goods manufacturer had a severe bottleneck at the end of their production line, with manual workers unable to stack cases fast enough to keep up with new packaging machines.",
    existingProcess: "Manual palletizing using vacuum lift assists. Highly physically demanding, leading to repetitive strain injuries and high turnover.",
    challenges: [
      "Mixed-SKU pallets required complex stacking patterns",
      "Extremely fast line speeds (80 cases per minute)",
      "Strict safety requirements for collaborative human-robot zones"
    ],
    proposedSolution: "Designed a dual-infeed, high-payload robotic palletizing cell. Used dynamic pattern-generating software to handle any carton size without reprogramming.",
    technologiesUsed: ["Yaskawa Motoman PL Series", "Schmalz Custom Vacuum Gripper", "Sick Safety Scanners", "PalletSolver Software"],
    implementationTimeline: "14 Weeks",
    costReduction: "$550,000 annually",
    productivityIncrease: "65%",
    roiCalculation: "System Cost: $480k. Labor savings and injury claims reduction: $550k/year. ROI achieved in 10.5 months.",
    beforeMetrics: [
      { label: "Cases/Minute", value: "45" },
      { label: "Pallet Stability", value: "Inconsistent" },
      { label: "Injury Rate", value: "5/year" }
    ],
    afterMetrics: [
      { label: "Cases/Minute", value: "85" },
      { label: "Pallet Stability", value: "100% Interlocked" },
      { label: "Injury Rate", value: "0/year" }
    ],
    image: "/Service4.webp",
    processFlow: [
      { step: "Case Arrival", description: "Cases arrive on dual accumulation conveyors." },
      { step: "Orientation", description: "Barcode scanner identifies SKU and diverts to correct lane." },
      { step: "Multi-Pick", description: "Robot end-effector picks an entire row (4 cases) simultaneously." },
      { step: "Interlock Stacking", description: "Robot places layers in interlocking patterns for stability." },
      { step: "Stretch Wrap", description: "Full pallet is conveyed directly into an automated stretch wrapper." }
    ]
  },
  {
    id: "cs-8",
    slug: "iiot-energy-monitoring",
    title: "Enterprise IIoT Energy Monitoring",
    clientIndustry: "Textile Manufacturing",
    category: "Industrial IoT Monitoring",
    problemStatement: "A multi-facility textile company faced skyrocketing energy bills but had no visibility into which machines or processes were consuming the most power.",
    existingProcess: "One main utility meter per factory. Energy costs were treated as fixed overhead with no allocation to specific product lines.",
    challenges: [
      "Inability to correlate energy spikes with specific shifts or machines",
      "High idle power consumption during non-production hours",
      "Difficulty justifying investments in energy-efficient equipment without baseline data"
    ],
    proposedSolution: "Deployed a distributed Industrial IoT network of smart power meters on 200 high-draw machines. Data was aggregated into a central cloud dashboard providing real-time cost-per-unit metrics.",
    technologiesUsed: ["Schneider Electric PowerLogic", "AWS IoT Central", "Grafana", "LoRaWAN"],
    implementationTimeline: "8 Weeks",
    costReduction: "$320,000 annually",
    productivityIncrease: "N/A (Energy focus)",
    roiCalculation: "System Cost: $120k. Energy savings through identified waste: $320k/year. ROI achieved in 4.5 months.",
    beforeMetrics: [
      { label: "Energy Visibility", value: "Factory Level" },
      { label: "Idle Power Waste", value: "18%" },
      { label: "Peak Demand Penalties", value: "Frequent" }
    ],
    afterMetrics: [
      { label: "Energy Visibility", value: "Machine Level" },
      { label: "Idle Power Waste", value: "2%" },
      { label: "Peak Demand Penalties", value: "Eliminated" }
    ],
    image: "/Service7.webp",
    processFlow: [
      { step: "Meter Installation", description: "Smart CT clamps installed on machine power feeds without cutting wires." },
      { step: "Wireless Transmission", description: "Data sent via LoRaWAN to a local factory gateway." },
      { step: "Cloud Aggregation", description: "Data synced to AWS and correlated with production shift schedules." },
      { step: "Analytics", description: "Dashboard highlights 'vampire draw' machines left on overnight." },
      { step: "Optimization", description: "Automated routines shut down non-essential equipment during idle periods." }
    ]
  },
  {
    id: "cs-9",
    slug: "automated-pharmaceutical-packaging",
    title: "Sterile Robotic Packaging Line (21 CFR Part 11)",
    clientIndustry: "Pharmaceuticals",
    category: "Production Line Optimization",
    problemStatement: "A pharmaceutical lab needed to scale up vial packaging for a new drug while maintaining strict sterile conditions and full traceability.",
    existingProcess: "Semi-automated filling with manual secondary packaging in a cleanroom. High risk of contamination and slow serialization scanning.",
    challenges: [
      "Strict compliance with FDA 21 CFR Part 11 (electronic records)",
      "Zero tolerance for contamination (ISO Class 5 cleanroom)",
      "Need to serialize and verify every single vial and carton"
    ],
    proposedSolution: "Built a fully enclosed, sterile robotic workcell featuring Stericlean Delta robots. Integrated full track-and-trace serialization that synced directly to the enterprise ERP.",
    technologiesUsed: ["Stäubli TP80 Fast Picker", "Optel Serialization", "Siemens S7-1500", "Wonderware"],
    implementationTimeline: "28 Weeks",
    costReduction: "$1.1M annually",
    productivityIncrease: "250%",
    roiCalculation: "System Cost: $2.2M. Labor, throughput, and compliance savings: $1.1M. ROI achieved in 24 months.",
    beforeMetrics: [
      { label: "Vials/Minute", value: "120" },
      { label: "Contamination Events", value: "2/year" },
      { label: "Serialization Speed", value: "Manual Batch" }
    ],
    afterMetrics: [
      { label: "Vials/Minute", value: "400" },
      { label: "Contamination Events", value: "0" },
      { label: "Serialization Speed", value: "Real-time individual" }
    ],
    image: "/Service2.webp",
    processFlow: [
      { step: "Vial Infeed", description: "Filled vials enter the cell under HEPA laminar flow." },
      { step: "Serialization Print", description: "Laser etches unique 2D matrix code on each vial." },
      { step: "Vision Verification", description: "Camera verifies code readability and correctness." },
      { step: "Robotic Cartoning", description: "Delta robot picks 10 vials simultaneously and places them in cartons." },
      { step: "Aggregation", description: "Cartons are aggregated to cases, and cases to pallets in the ERP database." }
    ]
  },
  {
    id: "cs-10",
    slug: "vision-guided-cnc-tending",
    title: "Vision-Guided Robotic Machine Tending",
    clientIndustry: "Heavy Engineering",
    category: "Vision Inspection",
    problemStatement: "A machine shop struggled to keep CNC milling centers running unattended overnight because the raw castings varied slightly in size, causing robot crashes.",
    existingProcess: "Operators manually loaded heavy castings into CNC chucks, aligning them perfectly. Machines sat idle for 12 hours overnight.",
    challenges: [
      "Raw castings had +/- 5mm variations in shape",
      "Traditional 'blind' robotics would crash or load parts crooked",
      "Heavy payloads (40kg) posed safety risks for manual loading"
    ],
    proposedSolution: "Integrated a high-payload 6-axis robot equipped with a 3D structural light camera. The robot 'looks' at the bin, identifies the part orientation, and calculates a dynamic pick path.",
    technologiesUsed: ["ABB IRB 6700", "Photoneo 3D Vision", "Schunk Grippers", "RobotStudio"],
    implementationTimeline: "12 Weeks",
    costReduction: "$380,000 annually",
    productivityIncrease: "100% (Enabled Lights-Out)",
    roiCalculation: "System Cost: $280k. Gained 12 hours of unmanned production per day: $380k/year. ROI achieved in 9 months.",
    beforeMetrics: [
      { label: "Machine Utilization", value: "40%" },
      { label: "Lights-Out Prod.", value: "0 Hours" },
      { label: "Loading Time", value: "3 mins" }
    ],
    afterMetrics: [
      { label: "Machine Utilization", value: "88%" },
      { label: "Lights-Out Prod.", value: "12 Hours" },
      { label: "Loading Time", value: "45 secs" }
    ],
    image: "/Service6.webp",
    processFlow: [
      { step: "3D Scan", description: "Camera scans the deep bin of randomly oriented castings." },
      { step: "Path Planning", description: "AI calculates the best grasp point avoiding bin collisions." },
      { step: "Dynamic Pick", description: "Robot adjusts its wrist orientation on-the-fly and extracts the part." },
      { step: "Precision Load", description: "Robot communicates with CNC door, enters, and seats part firmly in chuck." },
      { step: "Cycle Start", description: "Robot exits, signals CNC to start, and prepares next part." }
    ]
  }
];
