"use client";

import { useEffect, useState } from "react";

interface Book {
  id: number;
  name: string;
  author: string;
  price: number;
  image: string;
}

const API_BASE_URL = "/api/books";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState({
    name: "",
    author: "",
    price: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 1. GET: ទាញយកបញ្ជីសៀវភៅ
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 2. POST: បន្ថែមសៀវភៅថ្មី
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          author: form.author,
          price: parseFloat(form.price),
          image: form.image,
        }),
      });

      if (res.ok) {
        setForm({ name: "", author: "", price: "", image: "" });
        fetchBooks();
      }
    } catch (err) {
      console.error("Error creating book:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // 3. DELETE: លុបសៀវភៅ
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBooks();
      }
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "Inter, system-ui, sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Header Bar */}
        <header style={{ marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: "#f8fafc" }}>📚 Book Management Hub</h1>
            <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: 14 }}>Fullstack Practice Lab (Next.js + Spring Boot + Docker)</p>
          </div>
          <span style={{ backgroundColor: "#1e293b", padding: "6px 14px", borderRadius: 20, fontSize: 13, color: "#38bdf8", border: "1px solid #334155" }}>
            Total Books: <strong>{books.length}</strong>
          </span>
        </header>

        {/* Main Grid: Form ខាងឆ្វេង (1 ភាគ), List ខាងស្ដាំ (2 ភាគ) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, alignItems: "start" }}>
          
          {/* Add Book Form Card */}
          <div style={{ backgroundColor: "#1e293b", padding: 24, borderRadius: 12, border: "1px solid #334155", position: "sticky", top: 20 }}>
            <h2 style={{ fontSize: 18, margin: "0 0 16px", color: "#e2e8f0" }}>Add New Book</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              
              <div>
                <label style={{ fontSize: 13, color: "#cbd5e1", display: "block", marginBottom: 6 }}>Book Title</label>
                <input
                  placeholder="e.g. Clean Code"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #475569", backgroundColor: "#0f172a", color: "#ffffff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, color: "#cbd5e1", display: "block", marginBottom: 6 }}>Author</label>
                <input
                  placeholder="e.g. Robert C. Martin"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #475569", backgroundColor: "#0f172a", color: "#ffffff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, color: "#cbd5e1", display: "block", marginBottom: 6 }}>Price ($)</label>
                <input
                  placeholder="e.g. 29.99"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #475569", backgroundColor: "#0f172a", color: "#ffffff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, color: "#cbd5e1", display: "block", marginBottom: 6 }}>Cover Image URL</label>
                <input
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #475569", backgroundColor: "#0f172a", color: "#ffffff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: 8,
                  padding: "12px",
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: submitting ? "#64748b" : "#2563eb",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {submitting ? "Adding..." : "+ Add to Catalog"}
              </button>
            </form>
          </div>

          {/* Book Catalog Grid */}
          <div style={{ flex: 2 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Loading catalog...</div>
            ) : books.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, backgroundColor: "#1e293b", borderRadius: 12, border: "1px dashed #334155" }}>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: 16 }}>No books available yet. Add your first book from the left panel!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
                {books.map((book) => (
                  <div
                    key={book.id}
                    style={{
                      backgroundColor: "#1e293b",
                      borderRadius: 10,
                      border: "1px solid #334155",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ position: "relative", width: "100%", height: 200, backgroundColor: "#0f172a" }}>
                      <img
                        src={book.image}
                        alt={book.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400";
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          bottom: 10,
                          right: 10,
                          backgroundColor: "#16a34a",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: 13,
                          padding: "4px 8px",
                          borderRadius: 6,
                        }}
                      >
                        ${book.price.toFixed(2)}
                      </span>
                    </div>

                    <div style={{ padding: 14, flexGrow: 1 }}>
                      <h3 style={{ fontSize: 16, margin: "0 0 6px", color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={book.name}>
                        {book.name}
                      </h3>
                      <p style={{ fontSize: 13, margin: 0, color: "#94a3b8" }}>By: {book.author}</p>
                    </div>

                    <div style={{ padding: "0 14px 14px" }}>
                      <button
                        onClick={() => handleDelete(book.id)}
                        style={{
                          width: "100%",
                          padding: "8px 0",
                          backgroundColor: "transparent",
                          color: "#ef4444",
                          border: "1px solid #ef4444",
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = "#ef4444";
                          (e.target as HTMLElement).style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = "transparent";
                          (e.target as HTMLElement).style.color = "#ef4444";
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}