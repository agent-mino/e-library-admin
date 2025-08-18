"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/api";

interface User {
//   id: number;
//   title: string;
//   author: string;
//   img: string;
    id: number;
    full_name: string;
    email: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch books from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
                 const res = await fetch(`${API_BASE}/users/`);
         if (!res.ok) throw new Error('Failed to fetch users');
         const data = await res.json();
         setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  // Delete handler
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
             const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
       if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter((user) => user.id !== id)); // update UI
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-10 text-center">
          Manage Users
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold">{user.full_name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>

                <div className="flex items-center gap-3 mt-4">
                  <Link
                    href={`/admin/books/${user.id}/edit`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
