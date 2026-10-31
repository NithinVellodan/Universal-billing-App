# Universal Billing & POS Mobile Application

A production-quality, commercial-grade **Universal Point of Sale (POS) and Billing Mobile Application** built with **React Native 0.88.1**, **TypeScript**, and **React Native SVG**.

Inspired by **RedFace Pay**'s dashboard UX and styled with a signature **Red Invoice Layout (`#ED172C`)**, this application dynamically adapts to multiple business models, including Supermarkets, Restaurants, Pharmacies, Fashion Boutiques, Electronics, Wholesale Distributors, and Service Salons.

---

## 🌟 Key Highlights

- **Multi-Industry Engine**: Seamlessly switch between Supermarket, Restaurant, Pharmacy, Fashion, Electronics, and Wholesale modes on the fly.
- **RedFace Pay Aesthetic**: Modern dashboard with glassmorphism, quick billing actions, interactive SVG sales trends, payment breakdown charts, and industry-specific widgets.
- **Universal POS Billing Terminal**: Category tabs, product cards, stock indicators, held-bills tray, customer selection, and live cart calculation with multi-tier GST (CGST/SGST/IGST).
- **Red Invoice Reference Template**: Branded invoice layout matching modern fiscal receipt specifications with 5 interchangeable themes (Red Modern, Classic Black, Minimal Clean, Thermal 80mm, and GST Tax Layout).
- **Direct Sharing & Printing**: One-tap receipt printing simulation, PDF export, WhatsApp sharing, and dynamic UPI QR codes.
- **Dark & Light Mode**: Complete adaptive theme engine with smooth contrast handling.

---

## 🏢 Supported Business Models

| Industry | Tailored Modules & Workflows |
|---|---|
| **Supermarkets & Groceries** | Barcode scanning, rapid SKU billing, category filtering, stock alerts, multi-item cart. |
| **Restaurants & Cafés** | Visual dining table floor plan (Vacant / Occupied / Billed), real-time Kitchen Display System (KDS). |
| **Pharmacies & Healthcare** | Batch number tracking, expiry date monitors, Schedule H prescription compliance flags. |
| **Fashion & Apparel** | Size, color, and fit variant selectors, seasonal discount rules. |
| **Electronics & Hardware** | Serial number tracking, warranty period management, high-value item verification. |
| **Wholesale & Distribution** | Tiered bulk pricing, minimum order quantities (MOQ), GST tax invoicing, credit ledger. |
| **Services & Salons** | Time-slot appointment scheduling, technician assignment, direct appointment checkout. |

---

## 📱 Navigation & App Architecture

```
src/
├── components/
│   ├── charts/              # SVG Sales overview & payment split charts
│   ├── common/              # Buttons, Cards, Inputs, Badges, Headers, SVG Icons
│   └── navigation/          # Custom bottom navigation bar, Business switcher modal
├── database/                # Mock datasets for multi-industry businesses & catalogs
├── navigation/              # Root navigator with tab and stack routing
├── screens/
│   ├── Barcode/             # Laser barcode scanner viewfinder & rapid SKU input
│   ├── Billing/             # POS catalog, cart drawer, checkout modal
│   ├── Customers/           # Customer management & CRM (Add/Edit)
│   ├── Dashboard/           # RedFace Pay metrics, quick operations, industry widgets
│   ├── Expenses/            # Expense tracking & operational cost logging
│   ├── Invoices/            # Invoice list & branded Red invoice preview
│   ├── Onboarding/          # Multi-step business setup wizard
│   ├── Pharmacy/            # Batch expiration & Schedule H tracking
│   ├── Products/            # Product catalog inventory manager (Add/Edit)
│   ├── Purchases/           # Purchase order tracker & vendor supplier records
│   ├── Reports/             # Sales summary, P&L statement, GSTR-1/3B tax reports
│   ├── Restaurant/          # Dining floor plan tables & Kitchen Display System (KDS)
│   ├── Services/            # Appointment schedule & salon POS billing
│   ├── Settings/            # App configurations, printer setup & notifications
│   └── Staff/               # Staff management & branch directory
├── store/                   # AppContext (central reactive multi-business state store)
├── theme/                   # Color tokens, typography, spacing, shadows, ThemeProvider
└── types/                   # TypeScript interfaces & domain models
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Yarn** or **npm**
- **Xcode** 15+ (for iOS build & physical device testing)
- **CocoaPods**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NithinVellodan/Universal-billing-App.git
   cd Universal-billing-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install iOS CocoaPods:
   ```bash
   cd ios && bundle exec pod install && cd ..
   ```

### Running Locally

- **Start Metro Bundler**:
  ```bash
  npm start
  ```

- **Run on iOS Simulator**:
  ```bash
  npm run ios
  ```

- **Run on Connected Physical iOS Device**:
  ```bash
  npx react-native run-ios --device "Your iPhone Name"
  ```

---

## 🎨 Design System

- **Primary Red**: `#ED172C`
- **Dark Red Accent**: `#C90019`
- **Light Cyan Tint**: `#E5F7FF`
- **Charcoal Dark**: `#25282B`
- **Orange Warning**: `#FF982E`
- **Emerald Success**: `#00BA88`
- **Soft Background**: `#F7F8FA`
- **Dark Mode Background**: `#121212`

---

## 📄 License

This project is licensed under the MIT License.
