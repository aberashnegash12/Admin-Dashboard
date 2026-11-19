import { Suspense } from "react";
import { KpiCard } from "@/components/kpi-card";
import { PrescriptionsChart } from "@/components/prescriptions-chart";
import { InventoryTable } from "@/components/inventory-table";
import { prescriptionsByDay } from "@/lib/data";
import { getInventory, getKpis } from "@/lib/queries";

const loading = <p className="text-sm text-muted-foreground">Loading…</p>;

async function KpiSection() {
  const kpis = await getKpis();
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} {...kpi} />
      ))}
    </div>
  );
}

async function InventorySection() {
  const inventory = await getInventory();
  return <InventoryTable items={inventory} />;
}

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={loading}>
        <KpiSection />
      </Suspense>
      <PrescriptionsChart data={prescriptionsByDay} />
      <Suspense fallback={loading}>
        <InventorySection />
      </Suspense>
    </div>
  );
}