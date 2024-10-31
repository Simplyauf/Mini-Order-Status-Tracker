"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { type Order, type OrderStatus } from "@/types/prisma";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { OrderDetails } from "@/components/order-details";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/utils/trpc";

const UpdateStatusDialog = ({
  open,
  onOpenChange,
  currentStatus,
  onStatusChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            defaultValue={currentStatus}
            onValueChange={(value) => {
              onStatusChange(value as OrderStatus);
              onOpenChange(false);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "customerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus;
      return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
  },
  {
    accessorKey: "orderLineItems",
    header: "Products",
    cell: ({ row }) => {
      const lineItems = row.getValue("orderLineItems") as Array<{
        productName: string;
        quantity: number;
        price: number;
      }>;

      return (
        <div className="max-w-[500px] space-y-1">
          {lineItems?.map((item, index) => (
            <div key={index} className="text-sm">
              {item.productName} x{item.quantity} (${item.price})
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      const { toast } = useToast();
      const [showDetails, setShowDetails] = useState(false);
      const [showStatusUpdate, setShowStatusUpdate] = useState(false);

      const copyOrderId = () => {
        navigator.clipboard.writeText(order.id);
        toast({
          title: "Copied!",
          description: `Order ID ${order.id.slice(
            0,
            8
          )} has been copied to clipboard.`,
        });
      };

      const utils = trpc.useContext();

      const updateStatusMutation = trpc.order.updateStatus.useMutation({
        onSuccess: () => {
          utils.order.getOrders.invalidate();
          toast({
            title: "Status Updated",
            description: "Order status has been updated successfully",
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to update order status",
          });
        },
      });
      const handleStatusChange = async (newStatus: OrderStatus) => {
        console.log(newStatus);
        await updateStatusMutation.mutateAsync({
          id: order.id,
          status: newStatus as
            | "PENDING"
            | "PROCESSING"
            | "CANCELLED"
            | "COMPLETED",
        });
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={copyOrderId}>
                Copy order ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDetails(true)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowStatusUpdate(true)}>
                Update status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogHeader className="hidden">
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <DialogContent className="max-w-3xl ">
              <OrderDetails orderId={order.id} />
            </DialogContent>
          </Dialog>

          <UpdateStatusDialog
            open={showStatusUpdate}
            onOpenChange={setShowStatusUpdate}
            currentStatus={order.status}
            onStatusChange={handleStatusChange}
          />
        </>
      );
    },
  },
];

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
