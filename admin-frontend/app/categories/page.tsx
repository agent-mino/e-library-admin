"use client";

import { useEffect, useState } from "react";

interface Categories {
  name: string;
}

const API_BASE = "http://127.0.0.1:8000"; // change if backend is hosted elsewhere

export default function CategoriesPage() {
  const [Categories, setCategories] = useState<Categories[]>([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchResult, setSearchResult] = useState<Categories | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all users on load
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/categories/`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch {
        setError("Error loading categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Search by ID
  const handleSearch = async () => {
    if (!searchCategory) return;
    setLoading(true);
    try {
      setError("");
      const res = await fetch(`${API_BASE}/categories/${searchCategory}`);
      if (res.status === 404) {
        setSearchResult(null);
        setError("Category not found");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch category");
      const data = await res.json();
      setSearchResult(data);
    } catch {
      setError("Error searching category");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (category: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`${API_BASE}/category/${category}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');
      setCategories(Categories.filter((categories) => categories.name !== category)); // update UI
    }
    catch (err) {
      console.error("Failed to delete book:", err);
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navigation */}
      <nav className="bg-black text-white p-4 flex justify-between">
        <h1 className="font-bold">Admin Dashboard</h1>
        <ul className="flex gap-4">
          <li><a href="/home" className="hover:underline">Home</a></li>
          <li><a href="/users" className="hover:underline">Users</a></li>
          <li><a href="/books" className="hover:underline">Books</a></li>
        </ul>
      </nav>

      {/* Content */}
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

        {/* Search bar */}
        <div className="flex mb-6 gap-2">
          <input
            type="text"
            placeholder="Enter Category..."
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Search
          </button>
        </div>

        {/* Loading + Error */}
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Search Result */}
        {searchResult && (
          <div className="bg-white shadow-md p-4 rounded mb-6 border">
            <p>{searchResult.name}</p>
          </div>
        )}

        {/* All Users */}
        <h3 className="text-xl font-semibold mb-4">All Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Categories.map((categories) => (
            <div
              key={categories.name}
              className="bg-white shadow-md p-4 rounded border hover:shadow-lg transition"
            >           
              <h4 className="font-bold">{categories.name}</h4>
              <button
                    onClick={() => handleDelete(categories.name)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
