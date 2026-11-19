"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { InventoryItem, StockStatus } from "@/lib/data";

type SortKey = "name" | "category" | "stock" | "expiry";

const statusStyles: Record<StockStatus, string> = {
  "In stock": "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  "Low stock": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  "Expiring soon": "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export function InventoryTable({ items }: { items: InventoryItem[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | StockStatus>("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return items
      .filter((i) => filter === "All" || i.status === filter)
      .filter((i) => (i.name + i.id + i.category).toLowerCase().includes(q))
      .sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1) * sortDir);
  }, [items, query, filter, sortKey, sortDir]);

  function sortBy(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  const head = (key: SortKey, label: string) => (
    <TableHead className="cursor-pointer select-none" onClick={() => sortBy(key)}>
      {label}
      {sortKey === key ? (sortDir === 1 ? " ↑" : " ↓") : ""}
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            className="min-w-48 flex-1"
            placeholder="Search medicine, ID or category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            aria-label="Filter by status"
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "All" | StockStatus)}
          >
            <option>All</option>
            <option>In stock</option>
            <option>Low stock</option>
            <option>Expiring soon</option>
          </select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              {head("name", "Medicine")}
              {head("category", "Category")}
              {head("stock", "Stock")}
              {head("expiry", "Expiry")}
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="text-muted-foreground">{i.id}</TableCell>
                <TableCell className="font-medium">{i.name}</TableCell>
                <TableCell>{i.category}</TableCell>
                <TableCell>
                  {i.stock}
                  <span className="text-xs text-muted-foreground"> / min {i.reorderLevel}</span>
                </TableCell>
                <TableCell>{i.expiry}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("border-0", statusStyles[i.status])}>
                    {i.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No medicines match.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}