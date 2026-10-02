"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import BookForm from "@/components/BookForm";
import { ErrorNotice, Loading } from "@/components/Notice";
import { api } from "@/lib/api";
import type { Book, BookInput } from "@/lib/types";

export default function EditBookPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<BookInput | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Book>(`/books/${id}`)
      .then(({ title, author, publisher, category_id, cover_image, file, downloadable }) =>
        setBook({ title, author, publisher, category_id, cover_image, file, downloadable }),
      )
      .catch((err: Error) => setError(err.message));
  }, [id]);

  return (
    <AdminShell title="Edit book">
      {error && <ErrorNotice message={error} />}
      {!book && !error && <Loading />}
      {book && (
        <BookForm
          initial={book}
          submitLabel="Save changes"
          onSubmit={async (changes) => {
            await api(`/books/${id}`, { method: "PUT", body: changes });
            router.push("/books");
          }}
        />
      )}
    </AdminShell>
  );
}
