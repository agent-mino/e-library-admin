"use client";

import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import BookForm from "@/components/BookForm";
import { api } from "@/lib/api";

export default function NewBookPage() {
  const router = useRouter();
  return (
    <AdminShell title="Add book">
      <BookForm
        submitLabel="Add book"
        onSubmit={async (book) => {
          await api("/books/", { method: "POST", body: book });
          router.push("/books");
        }}
      />
    </AdminShell>
  );
}
