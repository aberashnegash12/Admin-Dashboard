"use client";

import { useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { Prescription, RxStatus } from "@/lib/data";
import { advancePrescription } from "@/app/prescriptions/actions";

const statusStyles: Record<RxStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  Ready: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  "Picked up": "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
};

const nextStatus: Record<RxStatus, RxStatus | null> = {
  Pending: "Ready",
  Ready: "Picked up",
  "Picked up": null,
};

const actionLabel: Record<RxStatus, string> = {
  Pending: "Mark ready",
  Ready: "Mark picked up",
  "Picked up": "",
};

export function PrescriptionsTable({ items }: { items: Prescription[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | RxStatus>("All");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return items
      .filter((p) => filter === "All" || p.status === filter)
      .filter((p) => (p.id + p.patient + p.medicine).toLowerCase().includes(q));
  }, [items, query, filter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescriptions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            className="min-w-48 flex-1"
            placeholder="Search patient, medicine or ID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            aria-label="Filter by status"
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "All" | RxStatus)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Ready</option>
            <option>Picked up</option>
          </select>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Medicine</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="text-muted-foreground">{p.id}</TableCell>
                <TableCell className="font-medium">{p.patient}</TableCell>
                <TableCell>{p.medicine}</TableCell>
                <TableCell>{p.doctor}</TableCell>
                <TableCell>{p.date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("border-0", statusStyles[p.status])}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {nextStatus[p.status] && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          const res = await advancePrescription(p.id);
                          setError(res?.error ?? "");
                        })
                      }
                    >
                      {actionLabel[p.status]}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No prescriptions match.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}