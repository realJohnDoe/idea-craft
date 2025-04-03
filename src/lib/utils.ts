import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateRandomHash(len: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charLen = chars.length;
  const randomValues = new Uint32Array(len);
  crypto.getRandomValues(randomValues);
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(randomValues[i] % charLen );
  }
  return result;
}