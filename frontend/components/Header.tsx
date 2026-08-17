"use client";

import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";

const WISHLIST_KEY = "godavari-basket-wishlist";

function getWishlistCount(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const stored = localStorage.getItem(
      WISHLIST_KEY
    );

    if (!stored) {
      return 0;
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return 0;
    }

    return parsed.length;
  } catch {
    return 0;
  }
}

export default function Header({
  cartCount,
  onCart,
}: {
  cartCount: number;
  onCart: () => void;
}) {
  const [open, setOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [wishlistCount, setWishlistCount] =
    useState(0);

  /*
   * Load wishlist count when Header mounts.
   */
  useEffect(() => {
    const updateWishlistCount = () => {
      setWishlistCount(
        getWishlistCount()
      );
    };

    updateWishlistCount();

    /*
     * ProductCard dispatches this event
     * whenever a heart is clicked.
     */
    window.addEventListener(
      "wishlist-updated",
      updateWishlistCount
    );

    return () => {
      window.removeEventListener(
        "wishlist-updated",
        updateWishlistCount
      );
    };
  }, []);

  /*
   * Search
   */
  function go() {
    const q = search
      .trim()
      .toLowerCase();

    window.dispatchEvent(
      new CustomEvent(
        "product-search",
        {
          detail: q,
        }
      )
    );

    document
      .getElementById("shop")
      ?.scrollIntoView({
        behavior: "smooth",
      });

    setOpen(false);
  }

  /*
   * Clear search and show all products.
   */
  function clearSearch() {
    setSearch("");

    window.dispatchEvent(
      new CustomEvent(
        "product-search",
        {
          detail: "",
        }
      )
    );
  }

  /*
   * Open Wishlist.
   */
  function openWishlist() {
    /*
     * Tell ProductGrid to show only
     * wishlisted products.
     */
    window.dispatchEvent(
      new CustomEvent(
        "wishlist-filter",
        {
          detail: true,
        }
      )
    );

    /*
     * Close mobile menu if open.
     */
    setOpen(false);

    /*
     * Scroll to product section.
     */
    document
      .getElementById("shop")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }

  /*
   * Home / All Products
   */
  function showAllProducts() {
    window.dispatchEvent(
      new CustomEvent(
        "wishlist-filter",
        {
          detail: false,
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
        "product-search",
        {
          detail: "",
        }
      )
    );
  }

  return (
    <>
      <header className="site-header">
        <div className="container-wide header-inner">

          {/* =========================
              MOBILE MENU
          ========================== */}

          <button
            type="button"
            className="mobile-menu-trigger"
            onClick={() =>
              setOpen((v) => !v)
            }
            aria-label={
              open
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={open}
          >
            {open ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

          {/* =========================
              BRAND
          ========================== */}

          <a
            href="#"
            className="brand-mark"
            aria-label="Godavari Basket home"
            onClick={() => {
              showAllProducts();
              setOpen(false);
            }}
          >
            <span className="brand-emblem">
              GB
            </span>

            <span className="brand-copy">
              <strong>
                GODAVARI
              </strong>

              <small>
                BASKET
              </small>
            </span>
          </a>

          {/* =========================
              DESKTOP NAVIGATION
          ========================== */}

          <nav
            className="desktop-nav"
            aria-label="Primary navigation"
          >
            <a
              className="active"
              href="#"
              onClick={() => {
                showAllProducts();
              }}
            >
              HOME
            </a>

            <a href="#collections">
              SHOP{" "}
              <ChevronDown
                size={12}
              />
            </a>

            <a href="#about">
              OUR STORY
            </a>

            <a href="#gifting">
              GIFTING
            </a>

            <a href="#blog">
              BLOG
            </a>

            <a href="#contact">
              CONTACT
            </a>
          </nav>

          {/* =========================
              HEADER ACTIONS
          ========================== */}

          <div className="header-actions">

            {/* REGION / CURRENCY */}

            <button
              type="button"
              className="currency-select"
              aria-label="Select region and currency"
            >
              <span>🇮🇳</span>

              <span>
                India (INR)
              </span>

              <ChevronDown
                size={12}
              />
            </button>

            {/* DESKTOP SEARCH */}

            <div className="header-search">

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    go();
                  }
                }}
                placeholder="Search"
                aria-label="Search products"
              />

              {search && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={
                    clearSearch
                  }
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}

              <button
                type="button"
                onClick={go}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>

            {/* ACCOUNT */}

            <button
              type="button"
              className="header-icon"
              aria-label="Account"
            >
              <UserRound
                size={20}
              />
            </button>

            {/* =========================
                WISHLIST
            ========================== */}

            <button
              type="button"
              className={`header-icon desktop-heart ${
                wishlistCount > 0
                  ? "has-wishlist"
                  : ""
              }`}
              onClick={
                openWishlist
              }
              aria-label={`Wishlist${
                wishlistCount > 0
                  ? `, ${wishlistCount} items`
                  : ""
              }`}
            >
              <Heart
                size={19}
                fill={
                  wishlistCount > 0
                    ? "currentColor"
                    : "none"
                }
              />

              {wishlistCount >
                0 && (
                <span>
                  {wishlistCount >
                  99
                    ? "99+"
                    : wishlistCount}
                </span>
              )}
            </button>

            {/* =========================
                CART
            ========================== */}

            <button
              type="button"
              className="header-icon cart-icon"
              onClick={onCart}
              aria-label="Basket"
            >
              <ShoppingBag
                size={21}
              />

              {cartCount > 0 && (
                <span>
                  {cartCount >
                  99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =========================
            MOBILE PANEL
        ========================== */}

        {open && (
          <div className="mobile-panel">

            {/* MOBILE SEARCH */}

            <div className="mobile-search">

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    go();
                  }
                }}
                placeholder="Search Godavari Basket"
                aria-label="Search products"
              />

              {search && (
                <button
                  type="button"
                  onClick={
                    clearSearch
                  }
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}

              <button
                type="button"
                onClick={go}
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>

            {/* MOBILE HOME */}

            <a
              href="#"
              onClick={() => {
                showAllProducts();
                setOpen(false);
              }}
            >
              HOME
            </a>

            {/* MOBILE SHOP */}

            <a
              href="#collections"
              onClick={() =>
                setOpen(false)
              }
            >
              SHOP
            </a>

            {/* MOBILE WISHLIST */}

            <button
              type="button"
              className="mobile-menu-wishlist"
              onClick={
                openWishlist
              }
            >
              <Heart
                size={17}
                fill={
                  wishlistCount > 0
                    ? "currentColor"
                    : "none"
                }
              />

              <span>
                WISHLIST
              </span>

              {wishlistCount >
                0 && (
                <b>
                  {wishlistCount}
                </b>
              )}
            </button>

            {/* OTHER LINKS */}

            <a
              href="#about"
              onClick={() =>
                setOpen(false)
              }
            >
              OUR STORY
            </a>

            <a
              href="#gifting"
              onClick={() =>
                setOpen(false)
              }
            >
              GIFTING
            </a>

            <a
              href="#blog"
              onClick={() =>
                setOpen(false)
              }
            >
              BLOG
            </a>

            <a
              href="#contact"
              onClick={() =>
                setOpen(false)
              }
            >
              CONTACT
            </a>
          </div>
        )}
      </header>
    </>
  );
}
