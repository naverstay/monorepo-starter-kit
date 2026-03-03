import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildQueryString(filters: Record<string, any>) {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // массив → несколько параметров
    if (Array.isArray(value)) {
      value.forEach(v => {
        const trimmed = String(v).trim();
        if (trimmed) queryParams.append(key, trimmed);
      });
      return;
    }

    // обычное значение
    const trimmed = String(value).trim();
    if (trimmed) queryParams.set(key, trimmed);
  });

  return queryParams.toString();
}
