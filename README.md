# SmartPOS Enterprise

A production-ready Point of Sale (POS) and Business Management System built with React, Node.js, PostgreSQL, and Prisma.

## Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, Shadcn UI, Zustand, React Query, Recharts
- **Backend:** Node.js, Express.js, TypeScript, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** JWT with Refresh Tokens
- **Deployment:** Docker

## Features

- Role-based authentication (Admin, Manager, Cashier, Stock Controller)
- Real-time dashboard with charts and analytics
- Touch-friendly POS screen
- Product management with categories, brands, suppliers
- Inventory tracking with stock movements and transfers
- Customer management with loyalty points
- Purchase orders and supplier management
- Employee management with attendance
- Expense tracking and financial reports
- Multi-branch support
- Light/Dark theme
- Receipt preview and printing

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Development

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Set up database
cp .env.example .env  # Configure your database URL
npx prisma db push
npm run db:seed

# 3. Start backend
npm run dev

# 4. In new terminal, install frontend
cd frontend
npm install

# 5. Start frontend
npm run dev
```

### Docker

```bash
docker-compose up -d
```

The app will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:5000

### Demo Credentials

- **Email:** admin@smartpos.com
- **Password:** password

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| GET | /api/products | List products |
| POST | /api/products | Create product |
| GET | /api/customers | List customers |
| GET | /api/sales | List sales |
| POST | /api/sales | Create sale |
| GET | /api/dashboard | Dashboard stats |

## Project Structure

```
smartpos/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── backend/           # Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
└── docker-compose.yml
```

## License

MIT
