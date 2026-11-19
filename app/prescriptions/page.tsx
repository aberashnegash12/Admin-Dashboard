import { Suspense } from "react";
import { PrescriptionsTable } from "@/components/prescriptions-table";
import { getPrescriptions } from "@/lib/queries";

async function PrescriptionsData() {
  const prescriptions = await getPrescriptions();
  return <PrescriptionsTable items={prescriptions} />;
}

export default function PrescriptionsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading prescriptions…</p>}>
      <PrescriptionsData />
    </Suspense>
  );
}