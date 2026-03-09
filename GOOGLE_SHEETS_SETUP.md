# Google Sheets Integration Setup Guide

This guide explains how to connect the Event Registration form to your Google Sheet using the Google Sheets API (service account), matching the approach used in the ai-counsellor project.

## Overview

The form submits to `/api/submit-to-sheets`, a Vercel serverless function that uses `googleapis` to append rows to your sheet. You need:

- A Google Cloud service account
- Your sheet shared with the service account
- Environment variables set in Vercel

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)

## Step 2: Enable Google Sheets API

1. **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click **Enable**

## Step 3: Create a Service Account

1. **APIs & Services** → **Credentials**
2. **Create Credentials** → **Service Account**
3. Name: e.g. `portfolio-sheets`
4. Click **Create and Continue** → **Done**

## Step 4: Generate Service Account Key

1. Open your service account
2. **Keys** tab → **Add Key** → **Create new key**
3. Choose **JSON** and download (keep it safe)

## Step 5: Prepare Your Google Sheet

1. Open your sheet: https://docs.google.com/spreadsheets/d/1Pm3bl_hzPGmiorvdY603vy1ngyeJm5r0mufRq242DM0/edit
2. Add headers in Row 1: **Timestamp | Name | Email | Phone | Interest | Message**

| A        | B    | C     | D    | E        | F       |
|----------|------|-------|------|----------|---------|
| Timestamp| Name | Email | Phone| Interest | Message |

3. Copy the **Spreadsheet ID** from the URL:
   - `https://docs.google.com/spreadsheets/d/1Pm3bl_hzPGmiorvdY603vy1ngyeJm5r0mufRq242DM0/edit`
   - ID: `1Pm3bl_hzPGmiorvdY603vy1ngyeJm5r0mufRq242DM0`

## Step 6: Share Sheet with Service Account

1. Open the downloaded JSON and find `client_email`
2. In your Google Sheet, click **Share**
3. Add the service account email as **Editor**
4. Click **Send**

## Step 7: Set Environment Variables

From the JSON file:

- `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_PRIVATE_KEY` (whole key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

**.env (local, for `vercel dev`):**
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=1Pm3bl_hzPGmiorvdY603vy1ngyeJm5r0mufRq242DM0
```

**Vercel** (Project Settings → Environment Variables):

| Name | Value |
|------|-------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `...@....iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Full key; paste as-is, Vercel handles formatting |
| `GOOGLE_SPREADSHEET_ID` | `1Pm3bl_hzPGmiorvdY603vy1ngyeJm5r0mufRq242DM0` |

## Step 8: Test Locally

```bash
vercel dev
```

Then submit the form at `/event-registration` and check your sheet.

## Troubleshooting

- **404 on /api/submit-to-sheets** – Use `vercel dev` instead of `npm run dev`; plain Vite does not run API routes.
- **"Server configuration error"** – Ensure all three env vars are set.
- **"Spreadsheet not found"** – Share the sheet with the service account and confirm the ID.
- **Permission denied** – Give the service account **Editor** access on the sheet.
