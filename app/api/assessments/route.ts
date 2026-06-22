import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Assessment } from '@/lib/models/Assessment';
import nodemailer from 'nodemailer';

function calculateResults(data: any) {
  let automationScore = 0;
  let digitalTransformationScore = 0;
  const suggestedTechnologies: string[] = [];
  const recommendedServices: string[] = [];
  let expectedROI = 'Unknown';
  let estimatedCostSavings = 'Unknown';

  // Basic scoring logic
  if (data.companySize === '100-500' || data.companySize === '500+') {
    automationScore += 20;
    digitalTransformationScore += 15;
  } else {
    automationScore += 10;
    digitalTransformationScore += 10;
  }

  if (data.manualWorkPercentage > 70) {
    automationScore += 30; // High need
    estimatedCostSavings = '35-50%';
    expectedROI = '8-12 Months';
    suggestedTechnologies.push('Robotic Process Automation (RPA)', 'Automated Material Handling');
    recommendedServices.push('Automation Audit & Consulting', 'RPA Implementation');
  } else if (data.manualWorkPercentage > 30) {
    automationScore += 15;
    estimatedCostSavings = '20-35%';
    expectedROI = '12-18 Months';
    suggestedTechnologies.push('Collaborative Robots (Cobots)', 'IoT Sensors');
    recommendedServices.push('Process Optimization', 'IoT Integration');
  } else {
    automationScore += 5;
    estimatedCostSavings = '10-20%';
    expectedROI = '18-24 Months';
    suggestedTechnologies.push('AI Analytics', 'Advanced SCADA');
    recommendedServices.push('Data Analytics Services', 'SCADA Upgrades');
  }

  if (data.existingSoftware.includes('ERP')) {
    digitalTransformationScore += 20;
    suggestedTechnologies.push('ERP-to-Floor Integration');
  } else {
    digitalTransformationScore += 10;
    suggestedTechnologies.push('Cloud ERP Systems');
    recommendedServices.push('Digital Transformation Strategy');
  }

  if (data.automationBudget === '$100k - $500k' || data.automationBudget === '$500k+') {
    automationScore += 25;
    suggestedTechnologies.push('Fully Autonomous Production Lines', 'Machine Vision Inspection');
    recommendedServices.push('Turnkey Automation Solutions');
  } else {
    automationScore += 10;
    suggestedTechnologies.push('Pilot Automation Projects');
    recommendedServices.push('Feasibility Studies');
  }

  // Normalize scores to max 100
  automationScore = Math.min(automationScore * 1.5, 100);
  digitalTransformationScore = Math.min(digitalTransformationScore * 2, 100);

  // Deduplicate arrays
  const uniqueTech = Array.from(new Set(suggestedTechnologies));
  const uniqueServices = Array.from(new Set(recommendedServices));

  return {
    automationScore: Math.round(automationScore),
    digitalTransformationScore: Math.round(digitalTransformationScore),
    suggestedTechnologies: uniqueTech,
    expectedROI,
    estimatedCostSavings,
    recommendedServices: uniqueServices
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const results = calculateResults(body);
    
    const assessmentData = {
      ...body,
      ...results
    };

    const newAssessment = await Assessment.create(assessmentData);

    // Notify Admin via Email (if SMTP configured)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"AutoForge System" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: `New Automation Assessment: ${body.companyName}`,
        html: `
          <h2>New Automation Readiness Assessment Submitted</h2>
          <p><strong>Company:</strong> ${body.companyName}</p>
          <p><strong>Contact:</strong> ${body.name} (${body.email})</p>
          <p><strong>Automation Score:</strong> ${results.automationScore}</p>
          <p><strong>Estimated Budget:</strong> ${body.automationBudget}</p>
          <br/>
          <p>Log in to the <a href="http://localhost:3000/admin/assessments">Admin Dashboard</a> to view the full report.</p>
        `,
      });
      console.log('Admin notification email sent.');
    } else {
      console.log('Admin notification skipped (SMTP credentials not configured in .env.local).');
    }

    return NextResponse.json({ success: true, assessment: newAssessment }, { status: 201 });
  } catch (error) {
    console.error('Error processing assessment:', error);
    return NextResponse.json({ error: 'Failed to process assessment' }, { status: 500 });
  }
}
