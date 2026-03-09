import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, interest, message } = req.body || {};

    if (!name || !email || !phone || !interest) {
      return res.status(400).json({ error: "Missing required fields: name, email, phone, interest" });
    }

    const credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    };

    let spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (spreadsheetId?.includes("/")) {
      spreadsheetId = spreadsheetId.split("/")[0].split("?")[0];
    }

    if (!credentials.client_email || !credentials.private_key || !spreadsheetId) {
      console.error("Missing Google Sheets credentials");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp,
      String(name || ""),
      String(email || ""),
      String(phone || ""),
      String(interest || ""),
      String(message || ""),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [rowData] },
    });

    return res.status(200).json({ success: true, message: "Data saved successfully" });
  } catch (error: unknown) {
    console.error("Google Sheets Error:", error);
    return res.status(500).json({
      error: "Failed to save data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
