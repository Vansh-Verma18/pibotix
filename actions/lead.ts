'use server';

import connectToDatabase from "@/lib/mongodb";
import { Lead } from "@/lib/models/Lead";

export async function submitLead(formData: {
  name: string;
  email: string;
  company: string;
  phone?: string;
  serviceOfInterest?: string;
  message: string;
}) {
  try {
    await connectToDatabase();
    
    const newLead = new Lead(formData);
    await newLead.save();
    
    return { success: true, message: "Your inquiry has been submitted successfully. We will contact you shortly." };
  } catch (error) {
    console.error("Lead submission error:", error);
    return { success: false, message: "An error occurred while submitting your inquiry. Please try again later." };
  }
}
