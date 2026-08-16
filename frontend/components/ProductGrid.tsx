"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, type Product } from "../lib/products";
import { MAIN_CATEGORIES } from "./CategorySection";
import ProductCard from "./ProductCard";
import RecentlyViewed from "./RecentlyViewed";

const ITEMS_PER_PAGE = 6;

export default function ProductGrid({ onAdd }: { onAdd: (p: Product) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => setProducts([]));
    const onSearch = (e: Event) => setSearch((e as CustomEvent<string>).detail || "");
    const onCategory = (e: Event) => setFilter((e as CustomEvent<string>).detail || "All");
    window.addEventListener("product-search", onSearch);
    window.addEventListener("category-filter", onCategory);
    return () => {
      window.removeEventListener("product-search", onSearch);
      window.removeEventListener("category-filter", onCategory);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  const productMatchesCategory = (p: Product, category: string) => {
    if (category === "All") return true;
    const value = `${p.parent_category || ""} ${p.category} ${p.subcategory || ""} ${p.name} ${p.description || ""}`.toLowerCase();
    if (
      (p.parent_category || p.category).toLowerCase() === category.toLowerCase() ||
      p.category.toLowerCase() === category.toLowerCase()
    ) {
      return true;
    }
    const aliases: Record<string, string[]> = {
      "Godavari Foods": ["food", "sweet", "snack", "pickle", "podi", "ghee", "oil", "rice", "spice", "dry fruit", "cashew"],
      "Farm & Natural": ["farm", "natural", "honey", "coconut", "oil", "ghee", "grain", "organic", "handmade"],
      "Handicrafts": ["craft", "basket", "bamboo", "brass", "wood", "handloom", "artisan"],
      "Traditional & Cultural": ["traditional", "cultural", "textile", "saree", "heritage", "artisan"],
      "Pooja & Spiritual": ["pooja", "puja", "spiritual", "lamp", "brass", "diya", "incense"],
      "Gifts": ["gift", "hamper", "box", "basket"],
      "Special Collections": ["collection", "festival", "wedding", "special", "combo", "curated"],
    };
    return (aliases[category] || []).some((term) => value.includes(term));
  };

  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          productMatchesCategory(p, filter) &&
          (!search || `${p.name} ${p.category} ${p.seller_name}`.toLowerCase().includes(search.toLowerCase()))
      ),
    [products, filter, search]
  );

  const subcategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  const totalPages = Math.ceil(visible.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return visible.slice(start, start + ITEMS_PER_PAGE);
  }, [visible, currentPage]);

  return (
    <section id="shop" className="collection-section">
      <div className="container-wide">
        <div className="collection-head">
          <div>
            <p className="eyebrow">Curated with intention</p>
            <h2>CURATED PICKS FROM GODAVARI</h2>
          </div>
          <button className="view-all" onClick={() => setFilter("All")}>
            View All Products <ArrowRight size={14} />
          </button>
        </div>

        <div className="collection-controls">
          <button
            className={`filter-pill ${filter === "All" ? "selected" : ""}`}
            onClick={() => setFilter("All")}
          >
            All
          </button>
          {MAIN_CATEGORIES.map((c) => (
            <button
              key={c.key}
              className={`filter-pill ${filter === c.key ? "selected" : ""}`}
              onClick={() => setFilter(c.key)}
            >
              {c.name}
            </button>
          ))}
          {subcategories
            .filter((x) => !MAIN_CATEGORIES.some((c) => c.key === x))
            .slice(0, 8)
            .map((x) => (
              <button
                key={x}
                className={`filter-pill ${filter === x ? "selected" : ""}`}
                onClick={() => setFilter(x)}
              >
                {x}
              </button>
            ))}
        </div>

        {paginatedProducts.length ? (
          <div className="product-grid-v2">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAdd} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <div className="empty-seal">GB</div>
            <h3>
              {products.length === 0
                ? "Your Godavari collection is ready."
                : "No products found."}
            </h3>
            <p>
              {products.length === 0
                ? "Connect your real product source to populate this section. No sample products are included."
                : "Try another category or search term."}
            </p>
          </div>
        )}

        {visible.length > ITEMS_PER_PAGE && (
          <div className="collection-pager">
            <button
              aria-label="Previous"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={17} />
            </button>
            <span>
              {currentPage.toString().padStart(2, "0")} /{" "}
              {totalPages.toString().padStart(2, "0")}
            </span>
            <button
              aria-label="Next"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        )}

        <RecentlyViewed onAdd={onAdd} />
      </div>
    </section>
  );
}