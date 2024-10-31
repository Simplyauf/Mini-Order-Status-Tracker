import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderLineItem.deleteMany();
  await prisma.order.deleteMany();

  // Create some sample orders
  const order1 = await prisma.order.create({
    data: {
      customerName: "John Doe",
      address: "123 Main St, City, Country",
      status: "PENDING",
      orderLineItems: {
        create: [
          {
            productName: "Widget A",
            quantity: 2,
            price: 29.99,
          },
          {
            productName: "Widget B",
            quantity: 1,
            price: 49.99,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerName: "Jane Smith",
      address: "456 Oak Ave, Town, Country",
      status: "PROCESSING",
      orderLineItems: {
        create: [
          {
            productName: "Widget C",
            quantity: 3,
            price: 19.99,
          },
        ],
      },
    },
  });

  // Add more sample orders
  const order3 = await prisma.order.create({
    data: {
      customerName: "Bob Johnson",
      address: "789 Pine Rd, Village, Country",
      status: "COMPLETED",
      orderLineItems: {
        create: [
          {
            productName: "Widget D",
            quantity: 1,
            price: 39.99,
          },
          {
            productName: "Widget E",
            quantity: 4,
            price: 15.99,
          },
        ],
      },
    },
  });

  const order4 = await prisma.order.create({
    data: {
      customerName: "Alice Brown",
      address: "321 Elm St, City, Country",
      status: "COMPLETED",
      orderLineItems: {
        create: [
          {
            productName: "Widget F",
            quantity: 2,
            price: 25.99,
          },
        ],
      },
    },
  });

  console.log("Database has been seeded with:", {
    order1,
    order2,
    order3,
    order4,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
