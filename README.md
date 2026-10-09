# LiftDesk — Gym Membership Management SaaS Prototype

LiftDesk is a client-ready, responsive, and deployment-ready frontend prototype for a modern Gym Membership Management Software-as-a-Service (SaaS) platform tailored for small and medium-sized fitness centres.

Designed to replace chaotic manual notebooks, spreadsheets, and WhatsApp chat tracking, LiftDesk equips gym owners with a single operational dashboard to register members, track real-time membership expiries, issue transaction receipts in Ghanaian Cedis (GH₵), manage subscription packages, and publish a branded public landing page.

---

## 🚀 Key Features

### 1. Unified Dashboard Overview
- **Live Summary Metrics:** Total enrolled members, active memberships, memberships expiring within 7 days, and current calendar month revenue in GH₵.
- **Attention-Needed Center:** Instant visibility into expiring or overdue memberships with a single-click renewal trigger.
- **Revenue Distribution Chart:** Real-time visual breakdown of revenue generated per membership tier powered by Recharts.
- **Recent Transaction Feed:** Live stream of latest member dues collections with instant receipt view.
- **Fast Actions Bar:** Quick shortcuts to enroll members, record payments, and launch membership tiers.

### 2. Comprehensive Member Management
- **Searchable & Filterable Directory:** Instant client search by name, phone, or email, with filter tabs (*All*, *Active*, *Expiring Soon*, *Expired*) and plan filters.
- **Smart Date Calculation:** Automated expiry date estimation derived from selected plan duration, with manual override capability.
- **Integrated Initial Payment:** Optional one-step payment recording upon member enrollment.
- **Detailed Member Profiles:** Individual client ledgers, contact cards, emergency contacts, notes, and direct actions to renew, edit, or delete records.

### 3. Dynamic Expiry Tracking & Renewals
- **Single-Source Date Engine:** Strict status calculation using calendar day difference:
  - **Active:** Valid access with `> 7 days` remaining.
  - **Expiring Soon:** Valid access with `0 to 7 days` remaining.
  - **Expired:** Expiry date in the past (`< 0 days`).
- **Seamless 1-Step Renewal Modal:** Computes suggested renewal start and expiry dates from the previous term and allows optional receipt recording without duplicate entry.

### 4. Membership Plans & Tier Configuration
- **Pre-seeded Demonstration Plans:**
  - **Monthly Flex Plan:** GH₵180 / 1 Month
  - **Quarterly Performance:** GH₵450 / 3 Months
  - **Annual Champion Pass:** GH₵1,600 / 12 Months
- **Flexible Package Builder:** Custom pricing in GH₵, month durations, custom feature bullets, and active/inactive status toggles.
- **Safety Lock:** Prevents accidental deletion of plans with active subscribers, offering safe deactivation instead.

### 5. Payments & Financial Ledger
- **Multi-Method Support:** Cash (Front Desk), Mobile Money (MTN MoMo, Telecel Cash), and Bank Transfer.
- **Ghanaian Cedi Formatting:** Consistent `GH₵ X,XXX.XX` formatting throughout the app.
- **Official Transaction Receipts:** Printable, branded digital receipts with unique references (`REC-YYYY-XXXX`).
- **Financial Breakdown:** Aggregated cash, MoMo, and bank collection totals.

### 6. Public Gym Website & Branding
- **Branded Landing Page (`/gym-preview`):** Standalone, client-facing public landing page showcasing facility highlights, pricing tiers, location, operating hours, and an interactive member trial inquiry form.
- **In-App Website Editor (`/website`):** Real-time customization of gym brand name, hero tag, headlines, about bio, facility highlights, and contact information.

### 7. Settings, Backup & Local Persistence
- **Zero-Backend Persistence:** Automatically persists state into browser `localStorage`.
- **JSON Export & Backup:** 1-click snapshot download of all members, plans, and payments.
- **Safe Reset Demo Data:** Restores default sample dataset (12 members, 3 plans, 12 transactions) with confirmation safeguard.

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
4. If your repository root contains `project/`, set the **Root Directory** to `project` (or leave as root if configuring project-level build).
5. Build settings will be automatically detected:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Click **Deploy**.

> **Note:** The included `vercel.json` contains single-page application rewrite rules (`/(.*) -> /index.html`) to ensure deep-linked routes like `/members/mem_001` and `/gym-preview` survive direct page refreshes without 404 errors.

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
│   │   └── seed.ts             # Dynamically anchored demo dataset (12 members, 3 plans, 12 payments)
│   ├── features/
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx     # Metrics, attention table & revenue chart
│   │   ├── members/
│   │   │   ├── AddMemberPage.tsx     # Member registration form
│   │   │   ├── MemberDetailPage.tsx  # Member profile & payment ledger
│   │   │   ├── MemberEditModal.tsx   # Quick edit contact/plan modal
│   │   │   ├── MemberRenewModal.tsx  # 1-step renewal & payment modal
│   │   │   └── MembersListPage.tsx   # Searchable & sortable directory
│   │   ├── payments/
│   │   │   ├── PaymentReceiptModal.tsx # Printable transaction receipt
│   │   │   ├── PaymentsPage.tsx      # Financial ledger & method filters
│   │   │   └── RecordPaymentModal.tsx # Manual receipt recording modal
│   │   ├── plans/
│   │   │   ├── PlanFormModal.tsx     # Plan creation/edit modal
│   │   │   └── PlansPage.tsx         # Plan grid & active member tracker
│   │   ├── public-website/
│   │   │   └── GymPublicPage.tsx     # Clean public visitor landing page
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx      # Profile settings, JSON export, reset
│   │   └── website/
│   │       └── WebsiteEditorPage.tsx # Public website customizer
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

---

## 🔒 Limitations of Prototype & Production Roadmap

This prototype is engineered as a zero-dependency frontend application for in-person prospective client demonstrations:

1. **Storage Scope:** Data is persisted in the local browser's `localStorage`. Data does not synchronize across separate physical devices.
2. **Payment Processing:** Payment entries are manual administrative records (Cash, MoMo, Bank Transfer). Live payment gateway webhooks (e.g. Paystack / Hubtel / MTN MoMo API) will be integrated in Phase 2.
3. **Authentication:** Uses a demo workspace mode without password authentication. Phase 2 will introduce multi-tenant isolation, role-based access control (Owner, Receptionist, Trainer), and secure PostgreSQL database persistence.
4. **Notifications:** Automated SMS/WhatsApp expiry reminders are simulated in-app and will be connected to SMS gateways (e.g. Arkesel / Twilio) in Phase 2.
