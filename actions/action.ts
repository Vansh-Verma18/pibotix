'use server';

import { google } from 'googleapis';

export type ContactState = {
    success?: boolean;
    error?: string;
    message?: string;
};

export async function submitContactForm(prevState: ContactState, formData: FormData): Promise<ContactState> {
    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phoneNumber = formData.get("phoneNumber") as string;
        const budget = formData.get("budget") as string;
        const requirement = formData.get("requirement") as string;
        const description = formData.get("description") as string;

        if (phoneNumber === "N/A") return { success: false, error: "Phone number is required." };
        const privateKey = process.env.GS_PRIVATE_KEY?.replace(/\\n/g, "\n");
        if (!privateKey || !privateKey.includes('BEGIN PRIVATE KEY')) return { success: false, error: "Invalid Google Sheets Key." };

        const createdAt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "medium" }).format(new Date());
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GS_CLIENT_EMAIL,
                private_key: privateKey,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SHEET_ID,
            range: "Sheet1!A1",
            valueInputOption: "RAW",
            requestBody: {
                values: [[
                    name,
                    email,
                    phoneNumber,
                    budget,
                    requirement,
                    description,
                    createdAt
                ]],
            },
        });

        return { success: true, message: "Thank you! We will get back to you soon." };

    } catch (err: any) {
        console.error("Sheets Error:", err);
        return { success: false, error: "Failed to submit form. Try again." };
    }
}
