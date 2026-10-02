import { clearSession, getToken } from "./auth";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/** Fetch wrapper: JSON in/out, sends the admin token, and turns API errors into readable messages. */
export async function api<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: options.method ?? "GET",
      headers: {
        ...(options.body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(`Can't reach the API at ${API_BASE}. Is the server running?`, 0);
  }

  if (res.status === 401 && token) {
    // Expired or invalid session: sign out and send the admin back to the login page.
    clearSession();
    window.location.href = "/?expired=1";
  }
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(errorMessage(data) ?? `Request failed (${res.status})`, res.status);
  return data as T;
}

// FastAPI returns `detail` as a string, or as a list of validation errors.
function errorMessage(data: unknown): string | null {
  const detail = (data as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length) {
    const first = detail[0] as { loc?: unknown[]; msg?: string };
    const field = first.loc?.at(-1);
    return field ? `${String(field)}: ${first.msg}` : (first.msg ?? null);
  }
  return null;
}
