"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderLineItem, type OrderStatus } from "@/types/prisma";
import { trpc } from "@/utils/trpc";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderDetailsProps {
  orderId: string;
}

export function OrderDetails({ orderId }: OrderDetailsProps) {
  const { data: order, isLoading } = trpc.order.getOrder.useQuery({
    id: orderId,
  });

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="flex h-[200px] items-center justify-center">
          <p className="text-muted-foreground">Order not found</p>
        </CardContent>
      </Card>
    );
  }

  const total = order.orderLineItems.reduce(
    (sum: number, item: OrderLineItem) => sum + item.price * item.quantity,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order #{order.id.slice(0, 8)}</span>
          <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <div>
            <h3 className="font-semibold">Customer Details</h3>
            <p>{order.customerName}</p>
            <p className="text-muted-foreground">{order.address}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Order Items</h3>
            <div className="grid gap-2">
              {order.orderLineItems.map((item: OrderLineItem) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 font-medium flex justify-between">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderDetailsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-5 w-[80px]" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <div>
            <Skeleton className="h-4 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[200px] mb-1" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <div>
            <Skeleton className="h-4 w-[100px] mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusVariant(
  status: OrderStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "PENDING":
      return "secondary";
    case "COMPLETED":
      return "outline";
    case "PROCESSING":
      return "default";
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
}
