"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ErrorNotice } from "@/components/Notice";
import { api } from "@/lib/api";
import type { BookInput, Category } from "@/lib/types";

const EMPTY: BookInput = {
  title: "",
  author: "",
  publisher: "",
  category_id: "",
  cover_image: "",
  file: "",
  downloadable: false,
};

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900";

/** Shared add/edit form. Empty optional fields are sent as null. */
export default function BookForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: BookInput;
  submitLabel: string;
  onSubmit: (book: BookInput) => Promise<void>;
}) {
  const [book, setBook] = useState<BookInput>(initial ?? EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<Category[]>("/categories/")
      .then(setCategories)
      .catch((err: Error) => setError(err.message));
  }, []);

  const set = <K extends keyof BookInput>(key: K, value: BookInput[K]) => setBook((b) => ({ ...b, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({ ...book, cover_image: book.cover_image || null, file: book.file || null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the book");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      {error && <ErrorNotice message={error} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
          Title
          <input required value={book.title} onChange={(e) => set("title", e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Author
          <input required value={book.author} onChange={(e) => set("author", e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Publisher
          <input
            required
            value={book.publisher}
            onChange={(e) => set("publisher", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Category
          <select
            required
            value={book.category_id}
            onChange={(e) => set("category_id", e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              {categories.length ? "Choose a category" : "Create a category first"}
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Cover image URL <span className="font-normal text-gray-400">(optional)</span>
          <input
            type="url"
            value={book.cover_image ?? ""}
            onChange={(e) => set("cover_image", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
          File URL <span className="font-normal text-gray-400">(optional)</span>
          <input type="url" value={book.file ?? ""} onChange={(e) => set("file", e.target.value)} className={inputClass} />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={book.downloadable}
            onChange={(e) => set("downloadable", e.target.checked)}
            className="h-4 w-4"
          />
          Readers can download this book
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
        <Link href="/books" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100">
          Cancel
        </Link>
      </div>
    </form>
  );
}
