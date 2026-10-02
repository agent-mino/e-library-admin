export function ErrorNotice({ message }: { message: string }) {
  return (
    <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  );
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return <p className="py-8 text-center text-sm text-gray-500">{label}</p>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white py-12 text-center text-sm text-gray-500">
      {children}
    </div>
  );
}
