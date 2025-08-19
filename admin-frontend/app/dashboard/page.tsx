"use client";

import React from "react";
import Link from "next/link";
import { FiBook, FiUsers, FiTag, FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// export default function AdminDashboard() {
//   // Fake logout function
//   const handleLogout = () => {
//     console.log("Admin logged out");
//   };
export default function Dashboard() {
  const router = useRouter();
  const [adminName, setAdminName] = useState<string>("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin");
      if (!raw) {
        router.replace("/");
        return;
      }
      const admin = JSON.parse(raw) as { name?: string };
      setAdminName(admin?.name || "Admin");
    } catch {
      router.replace("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-600 text-white p-6 flex justify-between items-center">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
        >
          <FiLogOut /> Logout
        </button>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {/* Books Management */}
        <Link
          href="/books" // This will automatically render ManageBooksPage
          className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transition"
        >
          <FiBook className="text-gray-600 text-4xl mb-4" />
          <h2 className="text-lg font-semibold text-gray-800">Manage Books</h2>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Add, edit, or remove books from the library collection.
          </p>
        </Link>

        {/* Users Management */}
        <Link
          href="/users"
          className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transition"
        >
          <FiUsers className="text-gray-600 text-4xl mb-4" />
          <h2 className="text-lg font-semibold text-gray-800">Manage Users</h2>
          <p className="text-gray-500 text-sm mt-2 text-center">
            View, block, or modify user accounts and roles.
          </p>
        </Link>

        {/* Categories Management */}
        <Link
          href="/categories"
          className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transition"
        >
          <FiTag className="text-gray-600 text-4xl mb-4" />
          <h2 className="text-lg font-semibold text-gray-800">Manage Categories</h2>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Add or edit book categories and organize library content.
          </p>
        </Link>
      </main>
    </div>
  );
}
