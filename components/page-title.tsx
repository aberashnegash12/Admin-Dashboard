"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/": "Overview",
  "/inventory": "Inventory",
  "/prescriptions": "Prescriptions",
  "/customers": "Customers",
  "/settings": "Settings",
};

export function PageTitle() {
  const pathname = usePathname();
  return <h1 className="text-lg font-semibold">{titles[pathname] ?? "Dashboard"}</h1>;
}