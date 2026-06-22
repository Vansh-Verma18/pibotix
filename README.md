# 🚀 Pibotix CMS & Automation Readiness Assessment Tool

Pibotix CMS is a full-featured Content Management System (CMS) and administration panel built for industrial automation and robotics solution providers. It features a modern, user-facing **Automation Readiness Assessment Tool** and a powerful admin portal to track client analytics, manage site content, and follow up on leads.

Created by **Vansh Verma**.

---

## ✨ Features

### 📋 Automation Readiness Assessment Tool
- **Multi-Step Wizard**: Sleek 4-step wizard page built with `framer-motion` animations:
  1. **Basic Info**: Name, Work Email, Company Name.
  2. **Company Details**: Company size selection and production capacity.
  3. **Operations & Processes**: Primary production type and manual work percentage.
  4. **Technology & Budget**: Existing software systems (like ERP) and expected budget.
- **Intelligent Backend Scoring**: Evaluates submissions via mathematical algorithms:
  - **Automation Score**: Driven by manual work % and budget availability.
  - **Digital Transformation Score**: Based on existing software stack.
  - **Projected ROI & Cost Savings**: Expected payback timeline and savings percentage.
  - **Custom Recommendations**: Dynamically lists technologies (e.g., RPA, IoT, SCADA, Cobots) and matching services.
- **PDF Report Download**: Let users save their report as a high-quality A4 document instantly using client-side `html2canvas` and `jspdf`.
- **Database Storage**: Submissions are stored in MongoDB Atlas and populated in the admin panel.

### 🛡️ Admin CMS Dashboard
- **Analytics & Dashboard Overview**: Visual representations of user activity.
- **Assessments Tracking**: Complete grid listing for submitted readiness assessments.
  - Toggle lead status between `New` and `Contacted`.
  - Remove junk leads with instant deletion.
- **Lead & Contact Management**: Review lead submissions, contact requests, and book consultations.
- **Dynamic Content Management**: Add, update, or remove:
  - Team Members
  - Services
  - Case Studies
  - Testimonials
  - Blog Posts
  - Global Website Settings

---

## 🛠️ Technology Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **UI & Logic**: React 19, JavaScript & TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS
- **Database & ODM**: MongoDB & Mongoose
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Email System**: Nodemailer (via SMTP)
- **PDF Generation**: html2canvas & jsPDF
- **Charts & Visuals**: Recharts

---

## ⚙️ Getting Started

Follow these instructions to set up the project locally:

### 1. Prerequisites
Ensure you have Node.js (version 18+ recommended) and npm installed.

### 2. Clone the Repository
```bash
git clone https://github.com/Umangsingh96/Pibotix.git
cd Pibotix
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Set Up Environment Variables
Create a `.env.local` file in the root directory based on `.env.example`:
```env
# Database Configuration
MONGO_URI="mongodb://your-username:your-password@cluster.qyvavkx.mongodb.net/dbname?ssl=true&authSource=admin&retryWrites=true&w=majority"

# Security
JWT_SECRET="your-super-secret-jwt-key"

# Email Notifications (Optional - Nodemailer SMTP config)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="notifications@example.com"
SMTP_PASS="your-smtp-password"
ADMIN_EMAIL="admin@example.com"
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the live site.
Access the Assessment Wizard at [http://localhost:3000/assessment](http://localhost:3000/assessment).
Access the Admin Dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 📄 License and Author

Created with ❤️ by **Vansh Verma**.