export type Admin = { id: string; name: string; email: string };

export type Book = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category_id: string;
  category_name: string | null;
  cover_image: string | null;
  file: string | null;
  downloadable: boolean;
  created_at: string;
};

export type BookInput = Omit<Book, "id" | "category_name" | "created_at">;

export type Category = { id: string; name: string; created_at: string; book_count: number };

export type User = { id: string; name: string; email: string; created_at: string };
