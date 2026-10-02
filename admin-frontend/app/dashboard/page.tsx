"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiBook, FiTag, FiUsers } from "react-icons/fi";
import AdminShell from "@/components/AdminShell";
import { ErrorNotice } from "@/components/Notice";
import { api } from "@/lib/api";
import type { Book, Category, User } from "@/lib/types";

type Counts = { books: number; categories: number; users: number };

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recent, setRecent] = useState<Book[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api<Book[]>("/books/"), api<Category[]>("/categories/"), api<User[]>("/user/")])
      .then(([books, categories, users]) => {
        setCounts({ books: books.length, categories: categories.length, users: users.length });
        setRecent(books.slice(0, 5));
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const cards = [
    { label: "Books", value: counts?.books, href: "/books", icon: FiBook },
    { label: "Categories", value: counts?.categories, href: "/categories", icon: FiTag },
    { label: "Registered users", value: counts?.users, href: "/users", icon: FiUsers },
  ];

  return (
    <AdminShell title="Dashboard">
      {error && <ErrorNotice message={error} />}

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md"
          >
            <span className="rounded-md bg-gray-100 p-3 text-xl text-gray-700">
              <Icon aria-hidden />
            </span>
            <span>
              <span className="block text-2xl font-bold">{value ?? "—"}</span>
              <span className="text-sm text-gray-500">{label}</span>
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h2 className="font-semibold">Recently added books</h2>
          <Link href="/books/new" className="text-sm font-medium text-gray-700 underline-offset-4 hover:underline">
            + Add book
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-6 text-sm text-gray-500">{counts ? "No books yet." : "Loading…"}</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recent.map((book) => (
              <li key={book.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span>
                  <span className="font-medium">{book.title}</span>
                  <span className="text-gray-500"> · {book.author}</span>
                </span>
                <span className="text-gray-500">{book.category_name ?? "Uncategorised"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  );
}
