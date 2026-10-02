"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiBook, FiGrid, FiLogOut, FiTag, FiUsers } from "react-icons/fi";
import { api } from "@/lib/api";
import { clearSession, getAdmin, getToken } from "@/lib/auth";
import type { Admin } from "@/lib/types";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: FiGrid },
  { href: "/books", label: "Books", icon: FiBook },
  { href: "/categories", label: "Categories", icon: FiTag },
  { href: "/users", label: "Users", icon: FiUsers },
];

/** Layout for every signed-in page: redirects to login without a session, renders the top navigation. */
export default function AdminShell({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/");
      return;
    }
    setAdmin(getAdmin());
    // Confirm the session with the server; an expired token makes api() sign out and redirect.
    api<Admin>("/admin/me")
      .then(setAdmin)
      .catch(() => {});
  }, [router]);

  const logout = () => {
    clearSession();
    router.replace("/");
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            E-Library <span className="font-normal text-gray-500">Admin</span>
          </Link>
          <nav className="flex flex-wrap gap-1" aria-label="Main">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon aria-hidden /> {label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-gray-500 sm:inline">{admin.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 font-medium hover:bg-gray-100"
            >
              <FiLogOut aria-hidden /> Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
