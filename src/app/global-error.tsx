"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#0A0A0A] text-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-accent text-black rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
