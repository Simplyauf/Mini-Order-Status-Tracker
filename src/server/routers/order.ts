import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "../db";
import { type OrderWithItems } from "@/types/prisma";

export const orderRouter = router({
  getOrder: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const order = await prisma.order.findUnique({
        where: { id: input.id },
        include: {
          orderLineItems: true,
        },
      });
      return order as OrderWithItems;
    }),
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]),
      })
    )
    .mutation(async ({ input }) => {
      const order = await prisma.order.update({
        where: { id: input.id },
        data: { status: input.status },
      });
      return order;
    }),

  getOrders: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const { page, limit } = input;
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          skip,
          take: limit,
          include: {
            orderLineItems: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.order.count(),
      ]);

      return {
        orders: orders as OrderWithItems[],
        total,
        pages: Math.ceil(total / limit),
      };
    }),

  createOrder: publicProcedure
    .input(
      z.object({
        customerName: z.string().min(1),
        address: z.string().min(1),
        orderLineItems: z.array(
          z.object({
            productName: z.string(),
            quantity: z.number(),
            price: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const order = await prisma.order.create({
        data: {
          customerName: input.customerName,
          address: input.address,
          status: "PENDING",
          orderLineItems: {
            create: input.orderLineItems,
          },
        },
        include: {
          orderLineItems: true,
        },
      });

      return order as OrderWithItems;
    }),
});
