import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  })
    .format(amount)
    .replace("NGN", "₦");
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("234")) {
    const local = cleaned.slice(3);
    return `0${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 10)}`.trim();
  }
  if (cleaned.startsWith("0") && cleaned.length <= 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 11)}`.trim();
  }
  return phone;
}

export function detectNetwork(phone: string): string | null {
  const cleaned = phone.replace(/\D/g, "");
  const prefix = cleaned.startsWith("234")
    ? cleaned.slice(3, 7)
    : cleaned.startsWith("0")
      ? cleaned.slice(1, 5)
      : null;
  if (!prefix) return null;
  const p3 = prefix.slice(0, 3);
  const mtnPrefixes = [
    "803",
    "806",
    "703",
    "706",
    "813",
    "816",
    "810",
    "814",
    "903",
    "906",
    "913",
    "916",
  ];
  const airtelPrefixes = [
    "802",
    "808",
    "708",
    "701",
    "812",
    "901",
    "902",
    "904",
    "907",
    "912",
  ];
  const gloPrefixes = ["805", "807", "705", "815", "811", "905", "915"];
  const nineMobilePrefixes = ["809", "817", "818", "909", "908"];

  if (mtnPrefixes.includes(p3)) return "mtn";
  if (airtelPrefixes.includes(p3)) return "airtel";
  if (gloPrefixes.includes(p3)) return "glo";
  if (nineMobilePrefixes.includes(p3)) return "9mobile";
  return null;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
