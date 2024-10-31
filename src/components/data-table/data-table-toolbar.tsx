"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onAdd?: () => void;
}

export function DataTableToolbar<TData>({
  table,
  onAdd,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between py-4">
      <Input
        placeholder="Filter by customer name..."
        value={
          (table.getColumn("customerName")?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          table.getColumn("customerName")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <Button onClick={onAdd}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Order
      </Button>
    </div>
  );
}
