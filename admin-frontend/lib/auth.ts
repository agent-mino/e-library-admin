import type { Admin } from "./types";

const TOKEN_KEY = "el_admin_token";
const ADMIN_KEY = "el_admin";

export function saveSession(token: string, admin: Admin) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function getToken(): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);
}

export function getAdmin(): Admin | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(ADMIN_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}
