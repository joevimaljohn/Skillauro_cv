# Skillauro Certificate Generator

A production-ready SaaS web application to generate, manage, and send internship certificates for Skillauro Technologies.

---

## Features

- 🔐 Secure admin login (JWT, HTTP-only cookies)
- 📊 Dashboard with live stats from Google Sheets
- 📄 PDF certificate generation (with QR code)
- 📧 Automated email delivery via Resend
- 🔍 Certificate verification at `/verify?cid=...`
- 📦 Bulk ZIP export
- 🌙 Dark mode
- 📱 Responsive sidebar layout
- 📋 Audit logs

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd skillauro-cert-gen
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable **Google Sheets API**
4. Go to **IAM & Admin → Service Accounts**
5. Create a Service Account
6. Generate a JSON key → download it
7. Copy `client_email` → `GOOGLE_CLIENT_EMAIL`
8. Copy `private_key` → `GOOGLE_PRIVATE_KEY` (keep `\n` as `\n` in .env)
9. **Share your Google Sheet** with the service account email (Editor access)
10. Copy the Sheet ID from the URL → `GOOGLE_SHEET_ID`

**Sheet URL format:**
`https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

### 4. Google Sheet Structure

Create a sheet named `Sheet1` with these columns in Row 1:

| A    | B     | C      | D              | E          | F      | G         |
|------|-------|--------|----------------|------------|--------|-----------|
| Name | Email | Domain | Certificate ID | Issue Date | Status | Sent Date |

Example data row:
```
Thirukarthika V | student@gmail.com | Cyber Security | SKL-INT-CS011 | 09-06-2026 | Pending |
```

### 5. Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your sending domain (e.g. `skillauro.in`)
3. Create an API key → `RESEND_API_KEY`
4. Update the `from` address in `lib/email.ts` to match your verified domain

### 6. Certificate Template (Optional)

Place your certificate template image at:
```
public/certificate-template.png
```

**Recommended specs:**
- Size: 2480×1754px (A4 landscape @ 300 DPI) or 841×595px at 72 DPI
- Format: PNG with transparent or white background
- Leave blank areas where name, domain, ID, and date will be printed

If no template is provided, a professional fallback design is generated automatically.

### 7. Run Locally

```bash
npm run dev
# Open http://localhost:3000
# Login at http://localhost:3000/login
```

---

## Deployment on Vercel

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option B: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select your repository
4. Add all environment variables from `.env.example`
5. Deploy

### Environment Variables on Vercel

Add these in **Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `GOOGLE_SHEET_ID` | Your Google Sheet ID |
| `GOOGLE_CLIENT_EMAIL` | Service account email |
| `GOOGLE_PRIVATE_KEY` | Private key (with `\n` characters) |
| `RESEND_API_KEY` | Your Resend API key |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `NEXT_PUBLIC_APP_URL` | Your deployed URL (no trailing slash) |
| `AUTH_SECRET` | Random 64-char string for JWT |

> **Important:** For `GOOGLE_PRIVATE_KEY` on Vercel, paste the full key including `-----BEGIN...-----END-----` with actual newlines (Vercel handles this automatically).

---

## Usage Guide

### Dashboard

- **Sync Sheet** — Pull latest data from Google Sheets
- **Generate Pending** — Generate PDFs for all Pending certificates (marks as Generated)
- **Send Pending** — Generate + send emails for all Pending records (marks as Sent)
- **Generate & Send All** — Process all non-Sent certificates

### Certificates Page

- Search by name, email, certificate ID, or domain
- Filter by status and domain
- Per-row: Preview, Download PDF, Send email
- **Export ZIP** — Download all visible certificates as a ZIP

### Preview Page

- Enter a Certificate ID to generate a live PDF preview
- Send directly from the preview page

### Verify Page (Public)

Visit `/verify?cid=SKL-INT-CS011` or share the QR code on the certificate. No login required.

### Audit Logs

All sync, generate, and send operations are logged with timestamps and success/failure status.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | JWT via Jose + HTTP-only cookies |
| Data | Google Sheets API v4 |
| PDF | pdf-lib |
| QR Code | qrcode |
| Email | Resend |
| ZIP | JSZip |
| Deployment | Vercel |

---

## Project Structure

```
skillauro-cert-gen/
├── app/
│   ├── login/              # Admin login page
│   ├── dashboard/          # Protected dashboard
│   │   ├── page.tsx        # Main dashboard
│   │   ├── certificates/   # Certificate list & management
│   │   ├── preview/        # Certificate preview
│   │   └── audit/          # Audit logs
│   ├── verify/             # Public verification page
│   └── api/
│       ├── auth/           # Login/logout
│       ├── sheets/         # Google Sheets sync
│       ├── certificates/   # PDF generation
│       ├── send/           # Email dispatch
│       ├── verify/         # Public verify endpoint
│       └── audit/          # Audit log endpoint
├── components/
│   ├── dashboard/          # Sidebar, StatCard
│   └── ui/                 # StatusBadge, ProgressBar
├── lib/
│   ├── auth.ts             # JWT utilities
│   ├── sheets.ts           # Google Sheets client
│   ├── certificate.ts      # PDF generation
│   ├── email.ts            # Resend email
│   ├── audit.ts            # Audit logging
│   └── utils.ts            # Helpers
├── types/
│   └── index.ts            # TypeScript types
├── middleware.ts            # Auth middleware
├── .env.example
└── vercel.json
```

---

## License

© Skillauro Technologies. All rights reserved.
