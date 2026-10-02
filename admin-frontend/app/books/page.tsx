"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FiBook } from "react-icons/fi";
import AdminShell from "@/components/AdminShell";
import { Empty, ErrorNotice, Loading } from "@/components/Notice";
import { api } from "@/lib/api";
import type { Book, Category } from "@/lib/types";

export default function ManageBooksPage() {
  const [books, setBooks] = useState<Book[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (categoryId) params.set("category_id", categoryId);
    try {
      setBooks(await api<Book[]>(`/books/?${params}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load books");
    }
  }, [query, categoryId]);

  useEffect(() => {
    api<Category[]>("/categories/")
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Debounce search typing; category changes go through the same path.
  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const handleDelete = async (book: Book) => {
    if (!confirm(`Delete “${book.title}”? This can't be undone.`)) return;
    setError("");
    try {
      await api(`/books/${book.id}`, { method: "DELETE" });
      setBooks((current) => current?.filter((b) => b.id !== book.id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book");
    }
  };

  return (
    <AdminShell
      title="Books"
      actions={
        <Link href="/books/new" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
          + Add book
        </Link>
      }
    >
      {error && <ErrorNotice message={error} />}

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or author"
          aria-label="Search books"
          className="min-w-60 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          aria-label="Filter by category"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {books === null ? (
        <Loading />
      ) : books.length === 0 ? (
        <Empty>{query || categoryId ? "No books match your filters." : "No books yet. Add the first one."}</Empty>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <article key={book.id} className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
              {book.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element -- covers are arbitrary external URLs
                <img src={book.cover_image} alt="" className="h-56 w-full object-cover" />
              ) : (
                <div className="flex h-56 items-center justify-center bg-gray-100 text-4xl text-gray-300">
                  <FiBook aria-hidden />
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <h2 className="font-semibold leading-snug">{book.title}</h2>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {book.category_name ?? "Uncategorised"}
                  {book.downloadable && " · Downloadable"}
                </p>
                <div className="mt-auto flex gap-2 pt-4">
                  <Link
                    href={`/books/${book.id}/edit`}
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium hover:bg-gray-100"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(book)}
                    className="rounded-md border border-red-200 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
