"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/api";

interface Book {
  id: number;
  title: string;
  author: string;
  img: string;
}

export default function ManageBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
                 const res = await fetch(`${API_BASE}/books/`);
         if (!res.ok) throw new Error('Failed to fetch books');
         const data = await res.json();
         setBooks(data);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    };

    fetchBooks();
  }, []);

  // Delete handler
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
             const res = await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' });
       if (!res.ok) throw new Error('Failed to delete book');
      setBooks(books.filter((book) => book.id !== id)); // update UI
    } catch (err) {
      console.error("Failed to delete book:", err);
    }
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-10 text-center">
          Manage Books
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <img
                src={book.img}
                alt={book.title}
                className="w-full h-72 sm:h-60 xs:h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>

                <div className="flex items-center gap-3 mt-4">
                  <Link
                    href={`/admin/books/${book.id}/edit`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(book.id)}
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
