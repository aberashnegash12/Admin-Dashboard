import { Suspense } from "react";
import { InventoryTable } from "@/components/inventory-table";
import { getInventory } from "@/lib/queries";

async function InventoryData() {
  const inventory = await getInventory();
  return <InventoryTable items={inventory} />;
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading inventory…</p>}>
      <InventoryData />
    </Suspense>
  );
}