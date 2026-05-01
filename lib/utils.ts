import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripProtocol(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "");
}

export function ensureProtocol(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}
