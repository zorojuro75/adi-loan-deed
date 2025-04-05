/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Calendar from "date-bengali-revised";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
function splitDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return { year, month, day };
}
export function toBanglaDate(dateString: string) {
  const { year, month, day } = splitDate(dateString);
  const cal = new Calendar();
  cal.fromGregorian(year, month, day);
  return cal.format("dddd D MMMM, Y");
}

export const convertToBengaliNumber = (input: any) => {
  if (typeof input !== "string") {
    input = String(input); // Convert non-string values to string
  }
  
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  
  return input.replace(/\d/g, (digit: string) => bengaliDigits[parseInt(digit, 10)]);
};
