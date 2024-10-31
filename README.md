# Order Status Tracker

A Next.js application for tracking order status with PostgreSQL database.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Supabase account)

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/order-status-tracker.git
cd order-status-tracker
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

```bash
# Create a .env file in the root directory and add:
DATABASE_URL="your_database_connection_string"
```

4. **Set up Prisma**

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) If you want to view/edit data
npx prisma studio
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Configuration

If you need to modify the database connection:

1. Update the `DATABASE_URL` in your `.env` file
2. Regenerate Prisma client:

```bash
npx prisma generate
```

3. Push schema changes:

```bash
npx prisma db push
```

## Database Schema

The application uses the following schema:

```prisma
model Order {
  id              String         @id @default(cuid())
  customerName    String
  address         String
  status          OrderStatus    @default(PENDING)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  orderLineItems  OrderLineItem[]
}

model OrderLineItem {
  id          String    @id @default(cuid())
  productName String
  quantity    Int
  price       Float
  orderId     String
  order       Order     @relation(fields: [orderId], references: [id])
}

enum OrderStatus {
  PENDING
  PROCESSING
  COMPLETED
  CANCELLED
}
```

## Features

- Create and manage orders
- Track order status
- View order details including line items
- Pagination support
- Real-time status updates

## Built With

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [tRPC](https://trpc.io/)
- [TanStack Table](https://tanstack.com/table/v8)
- [Tailwind CSS](https://tailwindcss.com/)
