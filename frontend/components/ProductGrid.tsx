"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";

import { getProducts, type Product, type Region } from "../lib/products";
import { MAIN_CATEGORIES } from "./CategorySection";
import ProductCard from "./ProductCard";
import RecentlyViewed from "./RecentlyViewed";

const ITEMS_PER_PAGE = 6;

export default function ProductGrid({
  onAdd,
}: {
  onAdd: (p: Product) => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region>("IN");
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]));

    try {
      const savedRegion = localStorage.getItem(
        "godavari-basket-region"
      ) as Region | null;

      if (savedRegion === "IN" || savedRegion === "US") {
        setRegion(savedRegion);
      }

      const savedWishlist = JSON.parse(
        localStorage.getItem(
          "godavari-basket-wishlist"
        ) || "[]"
      );

      if (Array.isArray(savedWishlist)) {
        setWishlistIds(
          savedWishlist
            .map((id) => Number(id))
            .filter((id) => !Number.isNaN(id))
        );
      }
    } catch {
      // Ignore invalid localStorage
    }

    const onSearch = (e: Event) => {
      const value =
        (e as CustomEvent<string>).detail || "";

      setSearch(value);
      setWishlistOnly(false);
    };

    const onCategory = (e: Event) => {
      setFilter(
        (e as CustomEvent<string>).detail || "All"
      );

      setWishlistOnly(false);
    };

    const onRegion = (e: Event) => {
      const value =
        (e as CustomEvent<Region>).detail;

      if (value === "IN" || value === "US") {
        setRegion(value);
        setWishlistOnly(false);
      }
    };

    const onWishlistFilter = (e: Event) => {
      const value =
        (e as CustomEvent<boolean>).detail;

      setWishlistOnly(Boolean(value));
    };

    const onWishlistUpdated = () => {
      try {
        const savedWishlist = JSON.parse(
          localStorage.getItem(
            "godavari-basket-wishlist"
          ) || "[]"
        );

        if (Array.isArray(savedWishlist)) {
          setWishlistIds(
            savedWishlist
              .map((id) => Number(id))
              .filter((id) => !Number.isNaN(id))
          );
        } else {
          setWishlistIds([]);
        }
      } catch {
        setWishlistIds([]);
      }
    };

    window.addEventListener(
      "product-search",
      onSearch
    );

    window.addEventListener(
      "category-filter",
      onCategory
    );

    window.addEventListener(
      "region-filter",
      onRegion
    );

    window.addEventListener(
      "wishlist-filter",
      onWishlistFilter
    );

    window.addEventListener(
      "wishlist-updated",
      onWishlistUpdated
    );

    return () => {
      window.removeEventListener(
        "product-search",
        onSearch
      );

      window.removeEventListener(
        "category-filter",
        onCategory
      );

      window.removeEventListener(
        "region-filter",
        onRegion
      );

      window.removeEventListener(
        "wishlist-filter",
        onWishlistFilter
      );

      window.removeEventListener(
        "wishlist-updated",
        onWishlistUpdated
      );
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filter,
    search,
    region,
    wishlistOnly,
  ]);

  const productMatchesCategory = (
    p: Product,
    category: string
  ) => {
    if (category === "All") return true;

    const value =
      `${p.parent_category || ""} ${
        p.category
      } ${p.subcategory || ""} ${
        p.name
      } ${p.description || ""}`.toLowerCase();

    if (
      (p.parent_category || p.category).toLowerCase() ===
        category.toLowerCase() ||
      p.category.toLowerCase() ===
        category.toLowerCase()
    ) {
      return true;
    }

    const aliases: Record<
      string,
      string[]
    > = {
      "Godavari Foods": [
        "food",
        "sweet",
        "snack",
        "pickle",
        "podi",
        "ghee",
        "oil",
        "rice",
        "spice",
        "dry fruit",
        "cashew",
      ],

      "Farm & Natural": [
        "farm",
        "natural",
        "honey",
        "coconut",
        "oil",
        "ghee",
        "grain",
        "organic",
        "handmade",
      ],

      Handicrafts: [
        "craft",
        "basket",
        "bamboo",
        "brass",
        "wood",
        "handloom",
        "artisan",
      ],

      "Traditional & Cultural": [
        "traditional",
        "cultural",
        "textile",
        "saree",
        "heritage",
        "artisan",
      ],

      "Pooja & Spiritual": [
        "pooja",
        "puja",
        "spiritual",
        "lamp",
        "brass",
        "diya",
        "incense",
      ],

      Gifts: [
        "gift",
        "hamper",
        "box",
        "basket",
      ],

      "Special Collections": [
        "collection",
        "festival",
        "wedding",
        "special",
        "combo",
        "curated",
      ],
    };

    return (aliases[category] || []).some(
      (term) => value.includes(term)
    );
  };

  const productMatchesRegion = (
    product: Product,
    selectedRegion: Region
  ) => {
    const regions =
      product.available_regions
        ?.split(",")
        .map((value) =>
          value.trim().toUpperCase()
        )
        .filter(Boolean) || ["IN"];

    return regions.includes(selectedRegion);
  };

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((p) => {
      const categoryMatch =
        productMatchesCategory(p, filter);

      const regionMatch =
        productMatchesRegion(
          p,
          region
        );

      const searchText = [
        p.name,
        p.category,
        p.parent_category,
        p.subcategory,
        p.seller_name,
        p.description,
        p.ingredients,
        p.benefits,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const searchMatch =
        !query ||
        searchText.includes(query);

      const wishlistMatch =
        !wishlistOnly ||
        wishlistIds.includes(p.id);

      return (
        categoryMatch &&
        regionMatch &&
        searchMatch &&
        wishlistMatch
      );
    });
  }, [
    products,
    filter,
    search,
    region,
    wishlistOnly,
    wishlistIds,
  ]);

  const subcategories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((p) => p.category)
            .filter(Boolean)
        )
      ),
    [products]
  );

  const totalPages =
    Math.ceil(
      visible.length / ITEMS_PER_PAGE
    ) || 1;

  const paginatedProducts =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        ITEMS_PER_PAGE;

      return visible.slice(
        start,
        start + ITEMS_PER_PAGE
      );
    }, [visible, currentPage]);

  function clearAllFilters() {
    setFilter("All");
    setSearch("");
    setWishlistOnly(false);
  }

  return (
    <section
      id="shop"
      className="collection-section"
    >
      <div className="container-wide">
        <div className="collection-head">
          <div>
            <p className="eyebrow">
              Curated with intention
            </p>

            <h2>
              {wishlistOnly
                ? "YOUR WISHLIST"
                : "CURATED PICKS FROM GODAVARI"}
            </h2>
          </div>

          <button
            className="view-all"
            onClick={clearAllFilters}
          >
            View All Products
            <ArrowRight size={14} />
          </button>
        </div>

        {/* ACTIVE FILTER STATUS */}
        <div className="active-filter-status">
          <span>
            {region === "IN"
              ? "🇮🇳 India · INR"
              : "🇺🇸 United States · USD"}
          </span>

          {search && (
            <span>
              Search: "{search}"
            </span>
          )}

          {wishlistOnly && (
            <span>
              <Heart
                size={12}
                fill="currentColor"
              />
              Wishlist
            </span>
          )}
        </div>

        <div className="collection-controls">
          <button
            className={`filter-pill ${
              filter === "All"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setFilter("All")
            }
          >
            All
          </button>

          {MAIN_CATEGORIES.map((c) => (
            <button
              key={c.key}
              className={`filter-pill ${
                filter === c.key
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setFilter(c.key)
              }
            >
              {c.name}
            </button>
          ))}

          {subcategories
            .filter(
              (x) =>
                !MAIN_CATEGORIES.some(
                  (c) => c.key === x
                )
            )
            .slice(0, 8)
            .map((x) => (
              <button
                key={x}
                className={`filter-pill ${
                  filter === x
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setFilter(x)
                }
              >
                {x}
              </button>
            ))}
        </div>

        {paginatedProducts.length ? (
          <div className="product-grid-v2">
            {paginatedProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={onAdd}
                />
              )
            )}
          </div>
        ) : (
          <div className="catalog-empty">
            <div className="empty-seal">
              GB
            </div>

            <h3>
              {products.length === 0
                ? "Your Godavari collection is ready."
                : wishlistOnly
                ? "Your wishlist is empty."
                : "No products found."}
            </h3>

            <p>
              {products.length === 0
                ? "Connect your real product source to populate this section."
                : wishlistOnly
                ? "Tap the heart on any product to save it here."
                : "Try another category, region or search term."}
            </p>

            {(search ||
              wishlistOnly ||
              filter !== "All") && (
              <button
                className="gold-button"
                onClick={clearAllFilters}
                style={{
                  marginTop: 18,
                }}
              >
                CLEAR FILTERS
              </button>
            )}
          </div>
        )}

        {visible.length >
          ITEMS_PER_PAGE && (
          <div className="collection-pager">
            <button
              aria-label="Previous"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage((p) =>
                  Math.max(1, p - 1)
                )
              }
            >
              <ChevronLeft size={17} />
            </button>

            <span>
              {currentPage
                .toString()
                .padStart(2, "0")}{" "}
              /{" "}
              {totalPages
                .toString()
                .padStart(2, "0")}
            </span>

            <button
              aria-label="Next"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(
                    totalPages,
                    p + 1
                  )
                )
              }
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
