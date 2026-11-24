"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { FormState, RxStatus } from "@/lib/data";

const next: Record<RxStatus, RxStatus | null> = {
  Pending: "Ready",
  Ready: "Picked up",
  "Picked up": null,
};

function refresh() {
  revalidatePath("/");
  revalidatePath("/prescriptions");
  revalidatePath("/inventory");
}

export async function advancePrescription(id: string): Promise<{ error?: string }> {
  const rx = await prisma.prescription.findUnique({ where: { id } });
  if (!rx) return { error: "Prescription not found." };

  const target = next[rx.status as RxStatus];
  if (!target) return {};

  if (target === "Picked up") {
    const ok = await prisma.$transaction(async (tx) => {
      const res = await tx.inventoryItem.updateMany({
        where: { name: rx.medicine, stock: { gte: 1 } },
        data: { stock: { decrement: 1 } },
      });
      if (res.count === 0) return false;
      await tx.prescription.update({ where: { id }, data: { status: target } });
      return true;
    });
    if (!ok) return { error: `${rx.medicine} is out of stock.` };
  } else {
    await prisma.prescription.update({ where: { id }, data: { status: target } });
  }

  refresh();
  return {};
}

export async function createPrescription(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const patient = String(formData.get("patient") ?? "").trim();
  const medicine = String(formData.get("medicine") ?? "").trim();
  const doctor = String(formData.get("doctor") ?? "").trim();

  if (!patient || !medicine || !doctor) {
    return { error: "Please fill in all fields." };
  }
  if (patient.length > 80 || doctor.length > 80) {
    return { error: "Names must be 80 characters or fewer." };
  }

  const exists = await prisma.inventoryItem.findFirst({ where: { name: medicine } });
  if (!exists) {
    return { error: "Choose a medicine from the list." };
  }

  const all = await prisma.prescription.findMany({ select: { id: true } });
  const max = all.reduce(
    (m, r) => Math.max(m, Number(r.id.replace("RX-", "")) || 0),
    8800
  );
  const id = `RX-${max + 1}`;

  await prisma.prescription.create({
    data: {
      id,
      patient,
      medicine,
      doctor,
      date: new Date().toISOString().slice(0, 10),
      status: "Pending",
    },
  });

  refresh();
  return { success: `Created ${id}.` };
}