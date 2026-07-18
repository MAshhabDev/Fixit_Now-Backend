# Fixit-Now Backend (Home Service Booking Platform)

Fixit-Now is a robust, production-ready RESTful API backend for a home service marketplace (e.g., plumbing, electrical works, appliance repairs). It allows customers to book services from verified technicians, processes secure payments using **Stripe**, and offers administrative controls to manage users and verify profiles.

🔗 **Live API URL:** [https://YOUR-APP-NAME.onrender.com](https://YOUR-APP-NAME.onrender.com) *(আপনার রেন্ডার থেকে পাওয়া লাইভ লিঙ্কটি এখানে বসিয়ে দিন)*

🗄️ **Database:** Serverless Neon PostgreSQL (Cloud)

---

## 🛠️ Tech Stack & Libraries

*   **Runtime:** Node.js (v18+)
*   **Framework:** Express.js (TypeScript)
*   **Database ORM:** Prisma ORM (PostgreSQL)
*   **Payment Gateway:** Stripe API (Checkout Sessions & Webhooks)
*   **Security:** Bcrypt (Password Hashing) & JWT (Authentication & Authorization)
*   **Compiler/Bundler:** TypeScript (`tsc`) & Esbuild

---

## 🚀 Key Features

1.  **Role-Based Access Control (RBAC):** Customized access gates for `CUSTOMER`, `TECHNICIAN`, and `ADMIN`.
2.  **Stripe Payment Integration:** Secure one-time payment sessions using Stripe Checkout with automatic status updates (`PAID`/`FAILED`) triggered by Stripe Webhooks.
3.  **Booking Workflow Management:** Tracking the full lifecycle of a service request (`REQUESTED` -> `ACCEPTED` -> `PAID` -> `IN_PROGRESS` -> `COMPLETED`).
4.  **Review & Rating System:** Validated system allowing reviews only for completed bookings.
5.  **Centralized Error Handling:** Dynamic global error handling catching Prisma client and runtime errors without crashing the Express server.
6.  **TypeScript Type Safety:** Highly typed payloads using custom interface contracts (no generic `any` values).

---

## 📂 Folder Structure

The project follows a **Module-based Architecture** for maximum modularity and clean separation of concerns:

```text
src/
├── config/             # Config manager & Env variables load
├── lib/                # Database and Stripe client initializations
├── middlewares/        # Authentication, route validation, and error catchers
├── module/             # Core business modules
│   ├── auth/           # Login, registration, and JWT token refresh
│   ├── booking/        # Customer bookings and workflow management
│   ├── category/       # Administrative and public service categories
│   ├── payment/        # Stripe sessions, history, and webhook handlers
│   ├── review/         # Ratings and user review submissions
│   ├── service/        # Technician services listing and CRUD
│   └── technician/     # Technician profile updates & availability tracking
├── utils/              # Common helper utilities (sendResponse, catchAsync)
├── app.ts              # Express application configuration
└── server.ts           # Server start & DB connection wrapper
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
DATABASE_URL="postgresql://username:password@ep-host-name.us-east-1.aws.neon.tech/neondb?sslmode=require"

JWT_ACCESS_SECRET="your_jwt_access_secret_key"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_key"
JWT_ACCESS_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="30d"

BCRYPT_SALT_ROUNDS=12

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
APP_URL="http://localhost:5000"
```

---

## 🏁 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Sync Database
```bash
npx prisma generate
npx prisma db push
```

### 3. Run Database Seed (To generate initial Admin & Categories)
```bash
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Forward Stripe Webhooks Locally
```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```

---

## 📡 Core API Reference

### 🔐 Auth Module
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/logIn` | Login and get JWT access token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user's profile | Authenticated |

### 🛠️ Services & Bookings Module
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/services` | Retrieve list of all services | Public |
| `POST` | `/api/bookings` | Create a new booking request | `CUSTOMER` |
| `GET` | `/api/bookings` | View list of bookings | `CUSTOMER` |
| `PATCH` | `/api/technician/bookings/:id` | Accept/Update booking status | `TECHNICIAN` |

### 💳 Payments Module
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payment/create` | Create Stripe session for accepted booking | `CUSTOMER` |
| `POST` | `/api/payment/webhook` | Stripe payment confirmation webhook | Public (Stripe) |
| `GET` | `/api/payment` | Get payment history | `CUSTOMER` / `TECHNICIAN` |
| `GET` | `/api/payment/:id` | Fetch specific transaction receipt | `CUSTOMER` / `TECHNICIAN` |

### 👑 Admin Module
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | List all users and profiles | `ADMIN` |
| `PATCH` | `/api/admin/users/:id` | Change status (Block / Unblock) | `ADMIN` |
| `PATCH` | `/api/admin/technician/:id/verify` | Verify technician profile | `ADMIN` |
| `GET` | `/api/admin/bookings` | Monitor platform booking list | `ADMIN` |

---

## 🛡️ License

This project is licensed under the MIT License.
