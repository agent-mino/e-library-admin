"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/api";

type Book = {
  _id: string;
  title: string;
  author: string;
  cover_image: string;
};

export default function ManageBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/books/");
        if (!res.ok) throw new Error("Failed to fetch books");
        const data: Book[] = await res.json();
        setBooks(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete book');
      setBooks(books.filter((book) => book._id !== id)); // update UI
    }
    catch (err) {
      console.error("Failed to delete book:", err);
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;


  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-10 text-center">
          Manage Books
        </h2>
      
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              // key={book.id}
              // className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <img
                src={book.cover_image}
                alt={book.title}
                className="w-full h-72 sm:h-60 xs:h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author} aiiii</p>

                <div className="flex items-center gap-3 mt-4">
                  <Link
                    href={`/books/${book._id}/edit`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(book.title)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className=" items-center">
          <Link
          href="/books/add"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow text-sm"
        >
          + Add Book
        </Link>
        </div>
        </div>

        
      </div>
    </section>
  );
}
