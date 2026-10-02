"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { Empty, ErrorNotice, Loading } from "@/components/Notice";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api<User[]>("/user/")
      .then(setUsers)
      .catch((err: Error) => setError(err.message));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!users || !q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, query]);

  const remove = async (user: User) => {
    if (!confirm(`Remove ${user.name} (${user.email})? They will no longer be able to sign in.`)) return;
    setError("");
    try {
      await api(`/user/${user.id}`, { method: "DELETE" });
      setUsers((list) => (list ?? []).filter((u) => u.id !== user.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove user");
    }
  };

  return (
    <AdminShell title="Users">
      {error && <ErrorNotice message={error} />}

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or email"
        aria-label="Search users"
        className="mb-6 w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
      />

      {visible === null ? (
        <Loading />
      ) : visible.length === 0 ? (
        <Empty>{query ? "No users match your search." : "No registered users yet."}</Empty>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-3 font-medium">{user.name}</td>
                  <td className="px-5 py-3 text-gray-600">{user.email}</td>
                  <td className="px-5 py-3 text-gray-600">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => remove(user)}
                      className="rounded-md border border-red-200 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
