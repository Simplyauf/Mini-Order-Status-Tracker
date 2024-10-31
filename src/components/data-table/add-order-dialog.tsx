"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { PlusCircle, Trash2 } from "lucide-react";
import { OrderLineItem } from "@/types/prisma";

interface AddOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    customerName: string;
    address: string;
    orderLineItems: any[];
  }) => Promise<void>;
}

const formSchema = z.object({
  customerName: z.string().min(1),
  address: z.string().min(1),
  orderLineItems: z.array(
    z.object({
      productName: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
});

export function AddOrderDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddOrderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    orderLineItems: [{ productName: "", quantity: 1, price: 0 }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setFormData({
        customerName: "",
        address: "",
        orderLineItems: [{ productName: "", quantity: 1, price: 0 }],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLineItem = () => {
    setFormData({
      ...formData,
      orderLineItems: [
        ...formData.orderLineItems,
        { productName: "", quantity: 1, price: 0 },
      ],
    });
  };

  const removeLineItem = (index: number) => {
    setFormData({
      ...formData,
      orderLineItems: formData.orderLineItems.filter((_, i) => i !== index),
    });
  };

  const updateLineItem = (
    index: number,
    field: keyof OrderLineItem,
    value: string | number
  ) => {
    const newLineItems = [...formData.orderLineItems];
    newLineItems[index] = {
      ...newLineItems[index],
      [field]: value,
    };
    setFormData({ ...formData, orderLineItems: newLineItems });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label>Customer Name</label>
            <Input
              disabled={isSubmitting}
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label>Address</label>
            <Input
              disabled={isSubmitting}
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label>Order Items</label>
              <Button
                disabled={isSubmitting}
                type="button"
                variant="outline"
                onClick={addLineItem}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            {formData.orderLineItems.map((item, index) => (
              <div key={index} className="flex gap-2 items-start">
                <Input
                  disabled={isSubmitting}
                  placeholder="Product Name"
                  value={item.productName}
                  onChange={(e) =>
                    updateLineItem(index, "productName", e.target.value)
                  }
                  required
                />
                <Input
                  disabled={isSubmitting}
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    updateLineItem(index, "quantity", parseInt(e.target.value))
                  }
                  required
                  min="1"
                  className="w-24"
                />
                <Input
                  disabled={isSubmitting}
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) =>
                    updateLineItem(index, "price", parseFloat(e.target.value))
                  }
                  required
                  min="0"
                  step="0.01"
                  className="w-24"
                />
                {formData.orderLineItems.length > 1 && (
                  <Button
                    disabled={isSubmitting}
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="min-w-7 h-7"
                    onClick={() => removeLineItem(index)}
                  >
                    <Trash2 className="min-w-4 min-h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
