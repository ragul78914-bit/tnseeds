# Smart Seed Availability & Stock Management System (TNSEEDS)

A production-ready, full-stack web application connecting **Farmers, Seed Sellers / Distribution Centers, and Administrators** through a centralized real-time seed availability and inventory management platform across Tamil Nadu.

---

## 🌟 Key Features

### 👨‍🌾 1. Farmer Application
- **Advanced Seed Search**: Search by seed name, crop (Paddy, Maize, Cotton, Groundnut, Tomato, Chilli, Onion), variety, hybrid name, brand, district, and price.
- **Location-Based Search (Haversine Formula)**: Calculates exact distance in kilometers between farmer search location and distribution centers.
- **Real-Time Availability Chips**: 🟢 Available ($\text{Stock} > \text{Min}$), 🟡 Low Stock ($0 < \text{Stock} \le \text{Min}$), 🔴 Out of Stock ($\text{Stock} = 0$).
- **Interactive GIS Leaflet Maps**: View nearby seed centers with distance pins and turn-by-turn Google Maps directions.
- **Bilingual Interface**: Toggle between **English** and **Tamil (தமிழ்)** across all pages.
- **Privacy & Security**: Blur seed images, price details, and seller contact info for guest/unauthenticated users; unlock clear details upon login.
- **Government Schemes**: Subsidies, eligibility criteria, required documents, and official application links.

### 🏪 2. Seller Seed Stock ERP
- **SaaS Dashboard**: KPI cards for Total Seeds, Total Stock (kg), Low Stock, Out of Stock, Today's Purchases (₹), Today's Sales (₹), and Stock Asset Valuation (₹) with Recharts charts.
- **Seed Product Manager**: Auto-generates unique product code `SEED-000001`, pack size, prices, min stock level.
- **Strict Inventory Engine**:
  $$\text{Current Stock} = \text{Opening Stock} + \text{Purchases} + \text{Adjustments In} - \text{Sales} - \text{Damaged} - \text{Shortage} - \text{Adjustments Out}$$
- **Negative Stock Validation**: Rejects sales exceeding current stock with explicit error `Insufficient stock available`.
- **Permanent Audit Trail Ledger**: Immutable stock transaction records for all inventory movements.
- **Reports & Export Engine**: Stock valuation reports, movement ledgers, and one-click **CSV report downloads**.
- **Store Location Settings**: Interactive Leaflet GPS map pin editor updating seller latitude and longitude.

### 🛡️ 3. Admin Control Portal
- **System Overview Analytics**: District-wise seller distribution, crop-wise stock volume, and activity stats.
- **Seller Management**: One-click **Activate/Deactivate** seller switch (deactivating immediately hides their stock from farmer search).
- **System Audit Logs**: Historical activity audit log table.

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Farmer** | `farmer@example.com` | `farmer123` | Search seeds, Leaflet maps, Govt schemes, Tamil/English toggle |
| **Seller** | `seller@example.com` | `seller123` | ERP Dashboard, Stock Entry ledger, Seed catalog, Reports, Suppliers |
| **Admin** | `admin@example.com` | `admin123` | Admin control panel, Seller activation toggle, System audit logs |

---

## 🚀 Quick Start Guide

### 1. Clone Repository
```bash
git clone https://github.com/ragul78914-bit/tnseeds.git
cd tnseeds
```

### 2. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm install
npm run dev
```

### 3. Access Live Application
- 🌐 **Frontend Web App**: `http://localhost:3000`
- ⚙️ **Backend REST & Socket.IO API**: `http://localhost:5000/api/health`

---

## 💻 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Leaflet Maps, Recharts, Framer Motion.
- **Backend**: Node.js, Express.js, Socket.IO, JWT, Mongoose / MongoDB (with auto-fallback embedded store).
