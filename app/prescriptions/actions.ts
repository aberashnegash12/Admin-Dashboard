"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { RxStatus } from "@/lib/data";

const next: Record<RxStatus, RxStatus | null> = {
  Pending: "Ready",
  Ready: "Picked up",
  "Picked up": null,
};

export async function advancePrescription(id: string) {
  const rx = await prisma.prescription.findUnique({ where: { id } });
  if (!rx) return;
  const target = next[rx.status as RxStatus];
  if (!target) return;
  await prisma.prescription.update({ where: { id }, data: { status: target } });
  revalidatePath("/prescriptions");
}