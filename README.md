# LiftDesk — Gym Membership Management SaaS Prototype

LiftDesk is a client-ready, responsive, and deployment-ready frontend prototype for a modern Gym Membership Management Software-as-a-Service (SaaS) platform tailored for small and medium-sized fitness centres.

Designed to replace chaotic manual notebooks, spreadsheets, and WhatsApp chat tracking, LiftDesk equips gym owners with a single operational dashboard to register members, track real-time membership expiries, issue transaction receipts in Ghanaian Cedis (GH₵), and manage subscription packages.

> **Note on Public Gym Websites:** Public-facing gym websites are decoupled from this management platform and will be built, hosted, and Google-indexed as an independent service for premium subscribers.

---

## 🚀 Key Features

### 1. Unified Dashboard Overview
- **Live Summary Metrics:** Total enrolled members, active memberships, memberships expiring within 7 days, and current calendar month revenue in GH₵.
- **Attention-Needed Center:** Instant visibility into expiring or overdue memberships with a single-click renewal trigger.
- **Revenue Distribution Chart:** Real-time visual breakdown of revenue generated per membership tier powered by Recharts.
- **Recent Transaction Feed:** Live stream of latest member dues collections with instant receipt view.
- **Fast Actions Bar:** Quick shortcuts to enroll members, inspect payments & receipts, and manage SaaS subscription plans.

### 2. Comprehensive Member Management (Flexible & Manual Plans)
- **Flexible Gym Plans:** Gym facilities can create any custom arrangement (e.g. 1-week pass, 1 month, 6 months subscription, annual VIP, daily sessions).
- **Manual Expiry Dates:** Staff can select when each membership expires manually or jump via quick presets (`+1 Week`, `+1 Month`, `+3 Months`, `+6 Months`, `+1 Year`).
- **Non-Fixed Pricing:** Members can pay any custom amount; payments are not locked to rigid prices.
- **Automatic Payment Reflection:** Every new registration automatically records the initial payment into the Payments ledger so receipts can be printed straight away.
- **Searchable & Filterable Directory:** Instant client search by name, phone, or email, with filter tabs (*All*, *Active*, *Expiring Soon*, *Expired*).

### 3. Dynamic Expiry Tracking & Renewals
- **Single-Source Date Engine:** Strict status calculation using calendar day difference:
  - **Active:** Valid access with `> 7 days` remaining.
  - **Expiring Soon:** Valid access with `0 to 7 days` remaining.
  - **Expired:** Expiry date in the past (`< 0 days`).
- **Seamless Automatic Renewal:** Staff can manually choose the renewed term and expiry date, and the renewal payment is **automatically recorded into the financial ledger**.

### 4. LiftDesk SaaS Subscription Plans
- **3 Facility Software Tiers:**
  - **Standard (GH₵ 100 / month):** Core gym management, member tracking, manual expiry controls, payments ledger, and official 1-copy receipt printing.
  - **Pro (GH₵ 150 / month):** Everything in Standard + Free branding gym website deployed online & indexed on Google + Automated SMS/Email notifications to members on expiry dates (no member online registration).
  - **Premium (GH₵ 200 / month):** Everything in Pro & Standard + Automatic online renewals by members directly + Online member self-registration via web portal + Instant SMS/Email confirmation on successful subscription & renewal + Online receipt viewing and printing by members + Custom domain & Google SEO indexing.
- **Interactive Plan Switching:** Gym owners can inspect their active plan and switch or upgrade tiers directly from the workspace.

### 5. Payments & Financial Ledger
- **Multi-Method Support:** Cash (Front Desk), Mobile Money (MTN MoMo, Telecel Cash), and Bank Transfer.
- **Ghanaian Cedi Formatting:** Consistent `GH₵ X,XXX.XX` formatting throughout the app.
- **Official Transaction Receipts with Expiry Evidence:** Printable, branded digital receipts with unique references (`REC-YYYY-XXXX`). Receipts clearly show **Access Valid Until (Expiry Date)**, amount paid, payment method, and issue date. Printed receipts are strictly isolated to **1 single copy** on a clean page.
- **Instant Receipt Printing:** Every newly registered member and renewal payment reflects immediately in the Payments ledger for 1-click receipt inspection and printing.

### 6. Settings, Backup & Local Persistence
- **Zero-Backend Persistence:** Automatically persists state into browser `localStorage`.
- **JSON Export & Backup:** 1-click snapshot download of all members, subscription status, and payments.
- **Safe Reset Demo Data:** Restores default sample dataset (12 members, subscription tier, 12 transactions) with confirmation safeguard.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript (Strict Mode)
- **Bundler & Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4 with custom color tokens
- **Routing:** React Router v7 with SPA rewrites
- **Icons:** Lucide React
- **Data Visualization:** Recharts
- **Date Manipulation:** date-fns

---

## 🎨 Color Palette

| Token | Hex | Usage |
|---|---|---|
| **Primary Navy** | `#0F172A` | Sidebar, main brand badges, strong structural elements |
| **Electric Blue** | `#3B82F6` | Primary CTAs, active navigation items, focus states |
| **Page Background** | `#F6F8FC` | Main canvas workspace background |
| **Card Surface** | `#FFFFFF` | Form cards, metric cards, tables |
| **Border Subtle** | `#E7ECF3` | Card dividers, table borders, input outlines |
| **Success Status** | `#16A34A` / `#DCFCE7` | Active memberships and completed payments |
| **Warning Status** | `#D97706` / `#FEF3C7` | Memberships expiring within 7 days |
| **Danger Status** | `#DC2626` / `#FEE2E2` | Expired memberships and destructive actions |

---

## 💻 Local Development & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup Instructions

```bash
# 1. Navigate to project directory
cd project

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Production Build & Verification

```bash
# Run TypeScript compilation and Vite production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 🌐 Deploying to Vercel

This application is ready for 1-click deployment on [Vercel](https://vercel.com).

### Deployment Steps:
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Log in to **Vercel** and click **"Add New Project"**.
3. Import the `Gym-Management-System-` repository.
4. If your repository root contains `project/`, set the **Root Directory** to `project`.
5. Build settings will be automatically detected:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Click **Deploy**.

> **Note:** The included `vercel.json` contains single-page application rewrite rules (`/(.*) -> /index.html`) to ensure deep-linked routes survive direct page refreshes without 404 errors.

---

## 📁 Project Architecture

```
project/
├── public/
│   └── favicon.svg             # Dumbbell SVG brand icon
├── src/
│   ├── app/
│   │   └── router.tsx          # React Router v7 routes & layout setup
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx   # Responsive layout with sidebar & topbar
│   │   │   ├── Sidebar.tsx     # Navy navigation rail / drawer
│   │   │   └── Topbar.tsx      # White header with context & quick action
│   │   └── ui/
│   │       ├── Badge.tsx       # Semantic status badges (Active, Expiring, Expired)
│   │       ├── Button.tsx      # Standard styled button variants
│   │       ├── Card.tsx        # Container cards with subtle borders
│   │       ├── ConfirmDialog.tsx # Destructive action confirmation modal
│   │       ├── EmptyState.tsx  # Fallback illustrations & actions
│   │       ├── Input.tsx       # Validated form input
│   │       ├── Modal.tsx       # Accessible dialog modal
│   │       ├── Select.tsx      # Styled select dropdown
│   │       ├── StatsCard.tsx   # Dashboard metric card
│   │       ├── Textarea.tsx    # Multi-line text field
│   │       └── Toast.tsx       # Toast notification alert container
│   ├── constants/
│   │   └── app.ts              # App name ("LiftDesk"), currency ("GH₵"), storage keys
│   ├── context/
│   │   ├── DataContext.tsx     # Centralized reactive state & localStorage synchronizer
│   │   └── ToastContext.tsx    # Toast notification dispatch provider
│   ├── data/
│   │   ├── seed.ts             # Dynamically anchored demo dataset (12 members, 12 payments)
│   │   └── subscriptionPlans.ts # 3 SaaS facility tiers (Standard, Pro, Premium)
│   ├── features/
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx     # Metrics, attention table & revenue chart
│   │   ├── members/
│   │   │   ├── AddMemberPage.tsx     # Member registration form (custom plans & expiry)
│   │   │   ├── MemberDetailPage.tsx  # Member profile & payment ledger
│   │   │   ├── MemberEditModal.tsx   # Quick edit contact/plan modal
│   │   │   ├── MemberRenewModal.tsx  # Manual renewal & auto-payment modal
│   │   │   └── MembersListPage.tsx   # Searchable & sortable directory
│   │   ├── payments/
│   │   │   ├── PaymentReceiptModal.tsx # Printable transaction receipt with expiry date
│   │   │   └── PaymentsPage.tsx      # Financial ledger & method filters
│   │   ├── plans/
│   │   │   └── PlansPage.tsx         # SaaS Subscription Plans tiers (Standard, Pro, Premium)
│   │   └── settings/
│   │       └── SettingsPage.tsx      # Profile settings, JSON export, reset
│   ├── lib/
│   │   ├── currency.ts         # Ghanaian Cedi formatters
│   │   ├── dates.ts            # Date-fns status & renewal calculators
│   │   ├── storage.ts          # Safe localStorage layer
│   │   └── validation.ts       # Form validation schemas
│   ├── types/
│   │   └── index.ts            # Core TypeScript interfaces
│   ├── App.tsx
│   ├── index.css               # Tailwind CSS v4 design tokens
│   └── main.tsx
├── vercel.json                 # SPA route rewrite rules
├── package.json
└── vite.config.ts
```
