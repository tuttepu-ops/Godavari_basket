"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";

import {
  getProducts,
  type Product,
} from "../lib/products";

import {
  MAIN_CATEGORIES,
} from "./CategorySection";

import ProductCard from "./ProductCard";

import RecentlyViewed from "./RecentlyViewed";

const ITEMS_PER_PAGE = 6;

const WISHLIST_KEY =
  "godavari-basket-wishlist";

function getWishlistIds(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored =
      localStorage.getItem(
        WISHLIST_KEY
      );

    if (!stored) {
      return [];
    }

    const parsed =
      JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(Number)
      .filter((id) =>
        Number.isFinite(id)
      );
  } catch {
    return [];
  }
}

export default function ProductGrid({
  onAdd,
}: {
  onAdd: (p: Product) => void;
}) {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [filter, setFilter] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [wishlistOnly, setWishlistOnly] =
    useState(false);

  const [wishlistIds, setWishlistIds] =
    useState<number[]>([]);

  /*
   * =========================================
   * LOAD PRODUCTS
   * =========================================
   */

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() =>
        setProducts([])
      );
  }, []);

  /*
   * =========================================
   * WISHLIST STATE
   * =========================================
   */

  useEffect(() => {
    const updateWishlist = () => {
      setWishlistIds(
        getWishlistIds()
      );
    };

    // Initial load
    updateWishlist();

    /*
     * ProductCard dispatches this event
     * whenever a heart is clicked.
     */
    window.addEventListener(
      "wishlist-updated",
      updateWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlist-updated",
        updateWishlist
      );
    };
  }, []);

  /*
   * =========================================
   * SEARCH / CATEGORY / WISHLIST EVENTS
   * =========================================
   */

  useEffect(() => {

    const onSearch = (
      e: Event
    ) => {
      const value =
        (
          e as CustomEvent<string>
        ).detail || "";

      setSearch(value);

      /*
       * When the user searches,
       * leave Wishlist mode.
       */
      setWishlistOnly(false);
    };

    const onCategory = (
      e: Event
    ) => {
      const value =
        (
          e as CustomEvent<string>
        ).detail || "All";

      setFilter(value);

      /*
       * Category selection leaves
       * Wishlist-only mode.
       */
      setWishlistOnly(false);
    };

    const onWishlistFilter = (
      e: Event
    ) => {
      const value =
        (
          e as CustomEvent<boolean>
        ).detail;

      setWishlistOnly(
        Boolean(value)
      );

      /*
       * When Wishlist is opened,
       * reset category/search so the
       * user sees their complete wishlist.
       */
      if (value) {
        setFilter("All");
        setSearch("");
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
      "wishlist-filter",
      onWishlistFilter
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
        "wishlist-filter",
        onWishlistFilter
      );
    };
  }, []);

  /*
   * =========================================
   * RESET PAGINATION
   * =========================================
   */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filter,
    search,
    wishlistOnly,
    wishlistIds,
  ]);

  /*
   * =========================================
   * CATEGORY MATCHING
   * =========================================
   */

  const productMatchesCategory = (
    p: Product,
    category: string
  ) => {
    if (category === "All") {
      return true;
    }

    const value = `
      ${p.parent_category || ""}
      ${p.category || ""}
      ${p.subcategory || ""}
      ${p.name || ""}
      ${p.description || ""}
    `.toLowerCase();

    /*
     * Direct category match.
     */

    if (
      (
        p.parent_category ||
        p.category ||
        ""
      ).toLowerCase() ===
        category.toLowerCase() ||
      (
        p.category || ""
      ).toLowerCase() ===
        category.toLowerCase()
    ) {
      return true;
    }

    /*
     * Category aliases.
     */

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

    return (
      aliases[category] || []
    ).some((term) =>
      value.includes(term)
    );
  };

  /*
   * =========================================
   * VISIBLE PRODUCTS
   * =========================================
   */

  const visible = useMemo(() => {

    const normalizedSearch =
      search
        .trim()
        .toLowerCase();

    return products.filter(
      (p) => {

        /*
         * WISHLIST FILTER
         */

        const matchesWishlist =
          !wishlistOnly ||
          wishlistIds.includes(
            Number(p.id)
          );

        if (!matchesWishlist) {
          return false;
        }

        /*
         * CATEGORY FILTER
         */

        const matchesCategory =
          productMatchesCategory(
            p,
            filter
          );

        if (!matchesCategory) {
          return false;
        }

        /*
         * SEARCH FILTER
         */

        if (!normalizedSearch) {
          return true;
        }

        const searchableText = `
          ${p.name || ""}
          ${p.category || ""}
          ${p.subcategory || ""}
          ${p.parent_category || ""}
          ${p.seller_name || ""}
          ${p.description || ""}
          ${p.ingredients || ""}
          ${p.benefits || ""}
        `.toLowerCase();

        return searchableText.includes(
          normalizedSearch
        );
      }
    );
  }, [
    products,
    filter,
    search,
    wishlistOnly,
    wishlistIds,
  ]);

  /*
   * =========================================
   * SUBCATEGORIES
   * =========================================
   */

  const subcategories =
    useMemo(
      () =>
        Array.from(
          new Set(
            products
              .map(
                (p) =>
                  p.category
              )
              .filter(Boolean)
          )
        ),
      [products]
    );

  /*
   * =========================================
   * PAGINATION
   * =========================================
   */

  const totalPages =
    Math.ceil(
      visible.length /
        ITEMS_PER_PAGE
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
    }, [
      visible,
      currentPage,
    ]);

  /*
   * =========================================
   * CLEAR ALL FILTERS
   * =========================================
   */

  function showAllProducts() {
    setFilter("All");
    setSearch("");
    setWishlistOnly(false);

    window.dispatchEvent(
      new CustomEvent(
        "product-search",
        {
          detail: "",
        }
      )
    );

    window.dispatchEvent(
      new CustomEvent(
        "category-filter",
        {
          detail: "All",
        }
      )
    );

    window.dispatchEvent(
      new CustomEvent(
        "wishlist-filter",
        {
          detail: false,
        }
      )
    );
  }

  /*
   * =========================================
   * RENDER
   * =========================================
   */

  return (
    <section
      id="shop"
      className="collection-section"
    >
      <div className="container-wide">

        {/* =================================
            COLLECTION HEADER
        ================================== */}

        <div className="collection-head">

          <div>

            <p className="eyebrow">
              {wishlistOnly
                ? "Saved for you"
                : "Curated with intention"}
            </p>

            <h2>
              {wishlistOnly
                ? "YOUR WISHLIST"
                : "CURATED PICKS FROM GODAVARI"}
            </h2>

          </div>

          <button
            type="button"
            className="view-all"
            onClick={
              showAllProducts
            }
          >
            View All Products

            <ArrowRight
              size={14}
            />
          </button>

        </div>

        {/* =================================
            SEARCH STATUS
        ================================== */}

        {search && (
          <div className="active-filter-message">
            Searching for:{" "}
            <strong>
              {search}
            </strong>

            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              aria-label="Clear search"
            >
              <span>×</span>
            </button>
          </div>
        )}

        {/* =================================
            WISHLIST STATUS
        ================================== */}

        {wishlistOnly && (
          <div className="active-filter-message wishlist-filter-message">

            <Heart
              size={15}
              fill="currentColor"
            />

            <span>
              Showing your saved products
            </span>

            <button
              type="button"
              onClick={
                showAllProducts
              }
            >
              Show All
            </button>

          </div>
        )}

        {/* =================================
            CATEGORY CONTROLS
        ================================== */}

        {!wishlistOnly && (
          <div className="collection-controls">

            <button
              type="button"
              className={`filter-pill ${
                filter === "All"
                  ? "selected"
                  : ""
              }`}
              onClick={() => {
                setFilter("All");
                setCurrentPage(1);
              }}
            >
              All
            </button>

            {MAIN_CATEGORIES.map(
              (c) => (
                <button
                  type="button"
                  key={c.key}
                  className={`filter-pill ${
                    filter ===
                    c.key
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    setFilter(
                      c.key
                    );
                    setWishlistOnly(
                      false
                    );
                    setCurrentPage(
                      1
                    );

                    window.dispatchEvent(
                      new CustomEvent(
                        "category-filter",
                        {
                          detail:
                            c.key,
                        }
                      )
                    );
                  }}
                >
                  {c.name}
                </button>
              )
            )}

            {subcategories
              .filter(
                (x) =>
                  !MAIN_CATEGORIES.some(
                    (c) =>
                      c.key === x
                  )
              )
              .slice(0, 8)
              .map((x) => (
                <button
                  type="button"
                  key={x}
                  className={`filter-pill ${
                    filter === x
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    setFilter(x);
                    setWishlistOnly(
                      false
                    );
                    setCurrentPage(
                      1
                    );

                    window.dispatchEvent(
                      new CustomEvent(
                        "category-filter",
                        {
                          detail: x,
                        }
                      )
                    );
                  }}
                >
                  {x}
                </button>
              ))}
          </div>
        )}

        {/* =================================
            PRODUCT GRID
        ================================== */}

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

              {wishlistOnly
                ? "Your wishlist is empty."
                : products.length ===
                  0
                ? "Your Godavari collection is ready."
                : "No products found."}

            </h3>

            <p>

              {wishlistOnly
                ? "Tap the heart on any product to save it here."
                : products.length ===
                  0
                ? "Connect your real product source to populate this section. No sample products are included."
                : "Try another category or search term."}

            </p>

            {wishlistOnly && (
              <button
                type="button"
                className="gold-button"
                onClick={
                  showAllProducts
                }
              >
                EXPLORE PRODUCTS
              </button>
            )}

          </div>
        )}

        {/* =================================
            PAGINATION
        ================================== */}

        {visible.length >
          ITEMS_PER_PAGE && (
          <div className="collection-pager">

            <button
              type="button"
              aria-label="Previous"
              disabled={
                currentPage ===
                1
              }
              onClick={() =>
                setCurrentPage(
                  (p) =>
                    Math.max(
                      1,
                      p - 1
                    )
                )
              }
            >
              <ChevronLeft
                size={17}
              />
            </button>

            <span>
              {currentPage
                .toString()
                .padStart(
                  2,
                  "0"
                )}

              {" / "}

              {totalPages
                .toString()
                .padStart(
                  2,
                  "0"
                )}
            </span>

            <button
              type="button"
              aria-label="Next"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (p) =>
                    Math.min(
                      totalPages,
                      p + 1
                    )
                )
              }
            >
              <ChevronRight
                size={17}
              />
            </button>

          </div>
        )}

        {/* =================================
            RECENTLY VIEWED
        ================================== */}

        <RecentlyViewed
          onAdd={onAdd}
        />

      </div>
    </section>
  );
}
