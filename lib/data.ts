export type Kpi = {
  label: string;
  value: string;
  note: string;
  tone: "good" | "warn" | "bad";
};

export type DailyPoint = {
  day: string;
  prescriptions: number;
};

export const prescriptionsByDay: DailyPoint[] = [
  { day: "Nov 3", prescriptions: 96 },
  { day: "Nov 4", prescriptions: 104 },
  { day: "Nov 5", prescriptions: 99 },
  { day: "Nov 6", prescriptions: 112 },
  { day: "Nov 7", prescriptions: 108 },
  { day: "Nov 8", prescriptions: 74 },
  { day: "Nov 9", prescriptions: 61 },
  { day: "Nov 10", prescriptions: 118 },
  { day: "Nov 11", prescriptions: 124 },
  { day: "Nov 12", prescriptions: 115 },
  { day: "Nov 13", prescriptions: 131 },
  { day: "Nov 14", prescriptions: 127 },
  { day: "Nov 15", prescriptions: 82 },
  { day: "Nov 16", prescriptions: 128 },
];
export type StockStatus = "In stock" | "Low stock" | "Expiring soon";

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
  expiry: string; // YYYY-MM-DD
  status: StockStatus;
};

export const inventory: InventoryItem[] = [
  { id: "MED-1001", name: "Amoxicillin 500 mg", category: "Antibiotic", stock: 240, reorderLevel: 80, expiry: "2027-08-14", status: "In stock" },
  { id: "MED-1002", name: "Metformin 850 mg", category: "Diabetes", stock: 34, reorderLevel: 60, expiry: "2027-03-02", status: "Low stock" },
  { id: "MED-1003", name: "Ibuprofen 400 mg", category: "Pain relief", stock: 410, reorderLevel: 100, expiry: "2027-11-30", status: "In stock" },
  { id: "MED-1004", name: "Omeprazole 20 mg", category: "Gastro", stock: 120, reorderLevel: 50, expiry: "2026-12-05", status: "Expiring soon" },
  { id: "MED-1005", name: "Salbutamol inhaler", category: "Respiratory", stock: 18, reorderLevel: 25, expiry: "2027-05-21", status: "Low stock" },
  { id: "MED-1006", name: "Atorvastatin 20 mg", category: "Cardio", stock: 205, reorderLevel: 70, expiry: "2027-09-09", status: "In stock" },
  { id: "MED-1007", name: "Cetirizine 10 mg", category: "Allergy", stock: 88, reorderLevel: 40, expiry: "2026-12-12", status: "Expiring soon" },
  { id: "MED-1008", name: "Paracetamol 500 mg", category: "Pain relief", stock: 520, reorderLevel: 150, expiry: "2028-01-18", status: "In stock" },
  { id: "MED-1009", name: "Insulin glargine", category: "Diabetes", stock: 12, reorderLevel: 20, expiry: "2027-02-10", status: "Low stock" },
  { id: "MED-1010", name: "Azithromycin 250 mg", category: "Antibiotic", stock: 96, reorderLevel: 40, expiry: "2027-06-27", status: "In stock" },
];

export type RxStatus = "Pending" | "Ready" | "Picked up";

export type Prescription = {
  id: string;
  patient: string;
  medicine: string;
  doctor: string;
  date: string; // YYYY-MM-DD
  status: RxStatus;
};

export const prescriptions: Prescription[] = [
  { id: "RX-8801", patient: "Ava Chen", medicine: "Amoxicillin 500 mg", doctor: "Dr. Haile", date: "2026-11-16", status: "Pending" },
  { id: "RX-8802", patient: "Liam Ortiz", medicine: "Metformin 850 mg", doctor: "Dr. Bekele", date: "2026-11-16", status: "Ready" },
  { id: "RX-8803", patient: "Noor Haddad", medicine: "Salbutamol inhaler", doctor: "Dr. Haile", date: "2026-11-16", status: "Pending" },
  { id: "RX-8804", patient: "Mateo Silva", medicine: "Atorvastatin 20 mg", doctor: "Dr. Tadesse", date: "2026-11-15", status: "Picked up" },
  { id: "RX-8805", patient: "Sofia Rossi", medicine: "Omeprazole 20 mg", doctor: "Dr. Bekele", date: "2026-11-15", status: "Ready" },
  { id: "RX-8806", patient: "Ethan Brooks", medicine: "Insulin glargine", doctor: "Dr. Tadesse", date: "2026-11-15", status: "Pending" },
  { id: "RX-8807", patient: "Mei Tanaka", medicine: "Cetirizine 10 mg", doctor: "Dr. Haile", date: "2026-11-14", status: "Picked up" },
  { id: "RX-8808", patient: "Omar Farouk", medicine: "Azithromycin 250 mg", doctor: "Dr. Bekele", date: "2026-11-14", status: "Picked up" },
];

export type FormState = { error?: string; success?: string };