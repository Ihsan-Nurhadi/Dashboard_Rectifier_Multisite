import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatJakartaTime(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    // If the input is already a formatted string but without timezone info,
    // assuming it might be UTC if from backend, or just parse it.
    // Replace space with 'T' and add 'Z' if it looks like a raw datetime string
    // e.g., "2026-02-15 14:22:19" -> "2026-02-15T14:22:19Z"
    let parseableString = dateString;
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
      parseableString = dateString.replace(' ', 'T') + 'Z';
    }

    const date = new Date(parseableString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  } catch (e) {
    return String(dateString);
  }
}
