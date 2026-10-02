"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorNotice } from "@/components/Notice";
import { api } from "@/lib/api";
import { getToken, saveSession } from "@/lib/auth";

type LoginResponse = { access_token: string; id: string; name: string; email: string };

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/dashboard");
    else if (new URLSearchParams(window.location.search).has("expired")) {
      setError("Your session expired. Please log in again.");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api<LoginResponse>("/admin/login", { method: "POST", body: { email, password } });
      saveSession(data.access_token, { id: data.id, name: data.name, email: data.email });
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">E-Library Admin</h1>
        <p className="mb-6 mt-1 text-sm text-gray-500">Sign in to manage books, categories and users.</p>

        {error && <ErrorNotice message={error} />}

        <form className="space-y-4" onSubmit={handleLogin}>
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gray-900 py-2 font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
