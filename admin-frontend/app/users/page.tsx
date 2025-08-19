"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

const API_BASE = "http://127.0.0.1:8000"; // change if backend is hosted elsewhere

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all users on load
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/user/`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch {
        setError("Error loading users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Search by ID
  const handleSearch = async () => {
    if (!searchId) return;
    setLoading(true);
    try {
      setError("");
      const res = await fetch(`${API_BASE}/user/${searchId}`);
      if (res.status === 404) {
        setSearchResult(null);
        setError("User not found");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setSearchResult(data);
    } catch {
      setError("Error searching user");
    } finally {
      setLoading(false);
    }
  };

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
            placeholder="Enter User ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
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
            <h3 className="font-bold">{searchResult.name}</h3>
            <p>Email: {searchResult.email}</p>
            <p>Created: {new Date(searchResult.created_at).toLocaleString()}</p>
          </div>
        )}

        {/* All Users */}
        <h3 className="text-xl font-semibold mb-4">All Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow-md p-4 rounded border hover:shadow-lg transition"
            >
              <h3>{user.id}</h3>
              <h4 className="font-bold">{user.name}</h4>
              <p>Email: {user.email}</p>
              <p>Created: {new Date(user.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
