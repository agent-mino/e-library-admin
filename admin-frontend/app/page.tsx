"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postJSON } from "@/lib/api";
import type { AdminLoginResponse } from "./types/admin";
import { redirect } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    setLoading(true);
    try {
      // Backend path
      const admin = await postJSON<{ email: string; password: string }, AdminLoginResponse>(
        "/login",
        { email, password }
      );

      localStorage.setItem("el_admin", JSON.stringify(admin));

      // Go to dashboard
      router.push("/dashboard");

    } catch (err: any) {
      setErrMsg(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Admin Login</h1>
        <p className="text-center text-gray-600">
          Enter your credentials to access the admin dashboard.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {errMsg && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-2 rounded">
              {errMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-600 text-white font-semibold py-2 rounded-md hover:bg-gray-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Not an admin?{" "}
          <Link href="/" className="text-gray-600 hover:underline">
            Return Home
          </Link>
        </p>
      </div>
    </div>
  );
}
