"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { Empty, ErrorNotice, Loading } from "@/components/Notice";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Category[]>("/categories/")
      .then(setCategories)
      .catch((err: Error) => setError(err.message));
  }, []);

  const run = async (action: () => Promise<void>) => {
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const sortByName = (list: Category[]) => [...list].sort((a, b) => a.name.localeCompare(b.name));

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const created = await api<Category>("/categories/", { method: "POST", body: { name: newName } });
      setCategories((list) => sortByName([...(list ?? []), created]));
      setNewName("");
    });
  };

  const rename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    run(async () => {
      const updated = await api<Category>(`/categories/${editing.id}`, { method: "PUT", body: { name: editing.name } });
      setCategories((list) => sortByName((list ?? []).map((c) => (c.id === updated.id ? updated : c))));
      setEditing(null);
    });
  };

  const remove = (category: Category) => {
    if (!confirm(`Delete the “${category.name}” category?`)) return;
    run(async () => {
      await api(`/categories/${category.id}`, { method: "DELETE" });
      setCategories((list) => (list ?? []).filter((c) => c.id !== category.id));
    });
  };

  return (
    <AdminShell title="Categories">
      {error && <ErrorNotice message={error} />}

      <form onSubmit={create} className="mb-6 flex max-w-md gap-2">
        <input
          required
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          aria-label="New category name"
          className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />
        <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
          Add
        </button>
      </form>

      {categories === null ? (
        <Loading />
      ) : categories.length === 0 ? (
        <Empty>No categories yet. Books need a category, so add one first.</Empty>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
          {categories.map((category) => (
            <li key={category.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
              {editing?.id === category.id ? (
                <form onSubmit={rename} className="flex flex-1 gap-2">
                  <input
                    autoFocus
                    required
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    aria-label="Category name"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                  />
                  <button className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white">Save</button>
                  <button type="button" onClick={() => setEditing(null)} className="px-2 text-sm text-gray-500">
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span>
                    <span className="font-medium">{category.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      {category.book_count} {category.book_count === 1 ? "book" : "books"}
                    </span>
                  </span>
                  <span className="flex gap-2">
                    <button
                      onClick={() => setEditing({ id: category.id, name: category.name })}
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium hover:bg-gray-100"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => remove(category)}
                      disabled={category.book_count > 0}
                      title={category.book_count > 0 ? "Move or delete this category's books first" : undefined}
                      className="rounded-md border border-red-200 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
