"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/data-table/columns";
import { trpc } from "@/utils/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddOrderDialog } from "@/components/data-table/add-order-dialog";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { PaginationState } from "@tanstack/react-table";

interface OrderFormData {
  customerName: string;
  address: string;
  orderLineItems: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrdersPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, refetch } = trpc.order.getOrders.useQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const createOrder = trpc.order.createOrder.useMutation({
    onSuccess: () => refetch(),
  });

  const handleAddOrder = async (data: OrderFormData) => {
    await createOrder.mutateAsync(data);
    setAddDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data?.orders ?? []}
            onAdd={() => setAddDialogOpen(true)}
            pageCount={data?.pages ?? 0}
            pagination={pagination}
            setPagination={setPagination}
          />
        </CardContent>
      </Card>
      <AddOrderDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddOrder}
      />
      <Toaster />
    </div>
  );
}
