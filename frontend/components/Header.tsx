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

import {
  useEffect,
  useState,
  type KeyboardEvent,
} from "react";

const WISHLIST_KEY = "godavari-basket-wishlist";

function getWishlistCount(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const stored = localStorage.getItem(WISHLIST_KEY);

    if (!stored) {
      return 0;
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed.length : 0;
  } catch (error) {
    console.error("Unable to read wishlist:", error);
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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);

  /* =========================================================
     WISHLIST COUNT
  ========================================================= */

  useEffect(() => {
    const updateWishlistCount = () => {
      setWishlistCount(getWishlistCount());
    };

    updateWishlistCount();

    window.addEventListener(
      "wishlist-updated",
      updateWishlistCount
    );

    window.addEventListener(
      "storage",
      updateWishlistCount
    );

    return () => {
      window.removeEventListener(
        "wishlist-updated",
        updateWishlistCount
      );

      window.removeEventListener(
        "storage",
        updateWishlistCount
      );
    };
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  function go() {
    const q = search.trim().toLowerCase();

    window.dispatchEvent(
      new CustomEvent("product-search", {
        detail: q,
      })
    );

    setOpen(false);

    setTimeout(() => {
      document
        .getElementById("shop")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  function handleSearchKeyDown(
    e: KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      go();
    }
  }

  function clearSearch() {
    setSearch("");

    window.dispatchEvent(
      new CustomEvent("product-search", {
        detail: "",
      })
    );
  }

  /* =========================================================
     WISHLIST
  ========================================================= */

  function openWishlist() {
    window.dispatchEvent(
      new CustomEvent("wishlist-filter", {
        detail: true,
      })
    );

    setOpen(false);

    setTimeout(() => {
      document
        .getElementById("shop")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  /* =========================================================
     RESET SHOP
  ========================================================= */

  function showAllProducts() {
    setSearch("");

    window.dispatchEvent(
      new CustomEvent("product-search", {
        detail: "",
      })
    );

    window.dispatchEvent(
      new CustomEvent("category-filter", {
        detail: "All",
      })
    );

    window.dispatchEvent(
      new CustomEvent("wishlist-filter", {
        detail: false,
      })
    );
  }

  /* =========================================================
     HOME
  ========================================================= */

  function goHome() {
    showAllProducts();

    setOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <>
      <header className="site-header">

        {/* ===================================================
            HEADER INNER
        =================================================== */}

        <div className="container-wide header-inner">

          {/* =================================================
              MOBILE MENU
          ================================================= */}

          <button
            type="button"
            className="mobile-menu-trigger"
            onClick={() => setOpen((value) => !value)}
            aria-label={
              open ? "Close menu" : "Open menu"
            }
            aria-expanded={open}
          >
            {open ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

          {/* =================================================
              BRAND
          ================================================= */}

          <a
            href="#"
            className="brand-mark"
            aria-label="Godavari Basket home"
            onClick={(e) => {
              e.preventDefault();
              goHome();
            }}
          >
            <span className="brand-emblem">
              GB
            </span>

            <span className="brand-copy">
              <strong>GODAVARI</strong>
              <small>BASKET</small>
            </span>
          </a>

          {/* =================================================
              DESKTOP NAV
          ================================================= */}

          <nav
            className="desktop-nav"
            aria-label="Primary navigation"
          >
            <a
              className="active"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goHome();
              }}
            >
              HOME
            </a>

            <a href="#collections">
              SHOP
              <ChevronDown size={12} />
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

          {/* =================================================
              HEADER ACTIONS
          ================================================= */}

          <div className="header-actions">

            {/* ===============================================
                REGION
            =============================================== */}

            <div className="region-wrapper">
              <button
                type="button"
                className="currency-select"
                aria-label="Select region and currency"
              >
                <span>🇮🇳</span>
                <span>India (INR)</span>
                <ChevronDown size={12} />
              </button>
            </div>

            {/* ===============================================
                DESKTOP SEARCH
            =============================================== */}

            <div className="header-search">

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onKeyDown={handleSearchKeyDown}
                placeholder="Search"
                aria-label="Search products"
                autoComplete="off"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
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

            {/* ===============================================
                MOBILE SEARCH ICON
            =============================================== */}

            <div className="mobile-header-search">

              <button
                type="button"
                onClick={go}
                aria-label="Search"
              >
                <Search size={19} />
              </button>

            </div>

            {/* ===============================================
                ACCOUNT
            =============================================== */}

            <button
              type="button"
              className="header-icon"
              aria-label="Account"
            >
              <UserRound size={20} />
            </button>

            {/* ===============================================
                WISHLIST
            =============================================== */}

            <button
              type="button"
              className="header-icon desktop-heart"
              onClick={openWishlist}
              aria-label="Wishlist"
            >
              <Heart
                size={19}
                fill={
                  wishlistCount > 0
                    ? "currentColor"
                    : "none"
                }
              />

              {wishlistCount > 0 && (
                <span>
                  {wishlistCount > 99
                    ? "99+"
                    : wishlistCount}
                </span>
              )}
            </button>

            {/* ===============================================
                CART
            =============================================== */}

            <button
              type="button"
              className="header-icon cart-icon"
              onClick={onCart}
              aria-label="Basket"
            >
              <ShoppingBag size={21} />

              {cartCount > 0 && (
                <span>
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* ===================================================
            MOBILE MENU
        =================================================== */}

        {open && (
          <div className="mobile-panel">

            {/* MOBILE SEARCH */}

            <div className="mobile-search">

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products"
                aria-label="Search products"
                autoComplete="off"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
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
                <Search size={15} />
              </button>

            </div>

            {/* HOME */}

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goHome();
              }}
            >
              HOME
            </a>

            {/* SHOP */}

            <a
              href="#collections"
              onClick={() => setOpen(false)}
            >
              SHOP
            </a>

            {/* WISHLIST */}

            <button
              type="button"
              className="mobile-wishlist-link"
              onClick={openWishlist}
            >
              <Heart
                size={17}
                fill={
                  wishlistCount > 0
                    ? "currentColor"
                    : "none"
                }
              />

              <span>WISHLIST</span>

              {wishlistCount > 0 && (
                <b>
                  {wishlistCount > 99
                    ? "99+"
                    : wishlistCount}
                </b>
              )}
            </button>

            {/* OUR STORY */}

            <a
              href="#about"
              onClick={() => setOpen(false)}
            >
              OUR STORY
            </a>

            {/* GIFTING */}

            <a
              href="#gifting"
              onClick={() => setOpen(false)}
            >
              GIFTING
            </a>

            {/* BLOG */}

            <a
              href="#blog"
              onClick={() => setOpen(false)}
            >
              BLOG
            </a>

            {/* CONTACT */}

            <a
              href="#contact"
              onClick={() => setOpen(false)}
            >
              CONTACT
            </a>

          </div>
        )}

      </header>
    </>
  );
}
