"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

interface DataTableToolbarProps {
  onAdd?: () => void;
}

export function DataTableToolbar({ onAdd }: DataTableToolbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex items-center justify-between pb-4">
      <Input
        placeholder="Search orders..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="max-w-sm"
      />
      <Button onClick={onAdd}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Order
      </Button>
    </div>
  );
}
