"use client";

import { useEffect, useState } from "react";
import type { Product } from "../lib/products";
import ProductCard from "./ProductCard";

export default function RecentlyViewed({
  onAdd,
}: {
  onAdd: (p: Product) => void;
}) {
  const [items, setItems] = useState<Product[]>([]);

  const loadRecent = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
      setItems(stored);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadRecent();
    window.addEventListener("recently-viewed-updated", loadRecent);
    return () => window.removeEventListener("recently-viewed-updated", loadRecent);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="recently-viewed-section" style={{ marginTop: "4rem", borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "2.5rem" }}>
      <div className="collection-head" style={{ marginBottom: "1.5rem" }}>
        <div>
          <p className="eyebrow">Your History</p>
          <h2 style={{ fontSize: "1.5rem" }}>RECENTLY VIEWED</h2>
        </div>
        <button
          className="view-all"
          onClick={() => {
            localStorage.removeItem("recently_viewed");
            setItems([]);
          }}
        >
          Clear History
        </button>
      </div>

      <div className="product-grid-v2">
        {items.map((prod) => (
          <ProductCard key={prod.id} product={prod} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
}