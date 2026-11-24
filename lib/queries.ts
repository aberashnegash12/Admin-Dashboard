import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import type { InventoryItem, Kpi, Prescription, RxStatus, StockStatus } from "@/lib/data";

export async function getInventory(): Promise<InventoryItem[]> {
  await connection();
  const rows = await prisma.inventoryItem.findMany({ orderBy: { name: "asc" } });

  const limit = new Date();
  limit.setDate(limit.getDate() + 30);
  const cutoff = limit.toISOString().slice(0, 10);

  return rows.map((r) => {
    let status: StockStatus = "In stock";
    if (r.expiry <= cutoff) status = "Expiring soon";
    else if (r.stock < r.reorderLevel) status = "Low stock";
    return { ...r, status };
  });
}

export async function getPrescriptions(): Promise<Prescription[]> {
  const rows = await prisma.prescription.findMany({
    orderBy: [{ date: "desc" }, { id: "desc" }],
  });
  return rows.map((r) => ({ ...r, status: r.status as RxStatus }));
}

export async function getKpis(): Promise<Kpi[]> {
  await connection();

  const [pending, ready, items] = await Promise.all([
    prisma.prescription.count({ where: { status: "Pending" } }),
    prisma.prescription.count({ where: { status: "Ready" } }),
    prisma.inventoryItem.findMany({
      select: { stock: true, reorderLevel: true, expiry: true },
    }),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const limit = new Date();
  limit.setDate(limit.getDate() + 30);
  const cutoff = limit.toISOString().slice(0, 10);

  const lowStock = items.filter((i) => i.stock < i.reorderLevel).length;
  const expiring = items.filter((i) => i.expiry >= today && i.expiry <= cutoff).length;

  return [
    { label: "Pending prescriptions", value: String(pending), note: "waiting to be prepared", tone: pending > 0 ? "warn" : "good" },
    { label: "Ready for pickup", value: String(ready), note: "waiting for the patient", tone: "good" },
    { label: "Low stock items", value: String(lowStock), note: "below reorder level", tone: lowStock > 0 ? "bad" : "good" },
    { label: "Expiring in 30 days", value: String(expiring), note: "check before they expire", tone: expiring > 0 ? "warn" : "good" },
  ];
}