import { Prisma } from "@prisma/client";

// Define the OrderStatus type
export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

// Define the base Order type
export interface Order {
  id: string;
  customerName: string;
  address: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Define the OrderLineItem type
export interface OrderLineItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  orderId: string;
}

// Define the Order with line items type
export type OrderWithItems = Order & {
  orderLineItems: OrderLineItem[];
};
