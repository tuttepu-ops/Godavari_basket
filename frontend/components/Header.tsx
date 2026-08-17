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
import type { Region } from "../lib/products";

type HeaderProps = {
  cartCount: number;
  onCart: () => void;
};

const REGIONS: {
  code: Region;
  flag: string;
  label: string;
  currency: string;
}[] = [
  {
    code: "IN",
    flag: "🇮🇳",
    label: "India",
    currency: "INR",
  },
  {
    code: "US",
    flag: "🇺🇸",
    label: "United States",
    currency: "USD",
  },
];

export default function Header({ cartCount, onCart }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region>("IN");
  const [regionOpen, setRegionOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    try {
      const savedRegion = localStorage.getItem(
        "godavari-basket-region"
      ) as Region | null;

      if (savedRegion === "IN" || savedRegion === "US") {
        setRegion(savedRegion);
      }

      const wishlist = JSON.parse(
        localStorage.getItem("godavari-basket-wishlist") || "[]"
      );

      setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
    } catch {
      // Ignore invalid localStorage
    }

    const handleWishlistChange = () => {
      try {
        const wishlist = JSON.parse(
          localStorage.getItem("godavari-basket-wishlist") || "[]"
        );

        setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
      } catch {
        setWishlistCount(0);
      }
    };

    window.addEventListener(
      "wishlist-updated",
      handleWishlistChange
    );

    return () => {
      window.removeEventListener(
        "wishlist-updated",
        handleWishlistChange
      );
    };
  }, []);

  const selectedRegion =
    REGIONS.find((item) => item.code === region) || REGIONS[0];

  function go() {
    const q = search.trim().toLowerCase();

    window.dispatchEvent(
      new CustomEvent("product-search", {
        detail: q,
      })
    );

    document
      .getElementById("shop")
      ?.scrollIntoView({ behavior: "smooth" });

    setOpen(false);
  }

  function changeRegion(nextRegion: Region) {
    setRegion(nextRegion);

    localStorage.setItem(
      "godavari-basket-region",
      nextRegion
    );

    window.dispatchEvent(
      new CustomEvent("region-filter", {
        detail: nextRegion,
      })
    );

    setRegionOpen(false);
  }

  function showWishlist() {
    window.dispatchEvent(
      new CustomEvent("wishlist-filter", {
        detail: true,
      })
    );

    document
      .getElementById("shop")
      ?.scrollIntoView({ behavior: "smooth" });

    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container-wide header-inner">
        <button
          className="mobile-menu-trigger"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <a
          href="#"
          className="brand-mark"
          aria-label="Godavari Basket home"
        >
          <span className="brand-emblem">GB</span>

          <span className="brand-copy">
            <strong>GODAVARI</strong>
            <small>BASKET</small>
          </span>
        </a>

        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
        >
          <a className="active" href="#">
            HOME
          </a>

          <a href="#collections">
            SHOP <ChevronDown size={12} />
          </a>

          <a href="#about">OUR STORY</a>
          <a href="#gifting">GIFTING</a>
          <a href="#blog">BLOG</a>
          <a href="#contact">CONTACT</a>
        </nav>

        <div className="header-actions">
          {/* REGION / CURRENCY */}
          <div className="region-wrapper">
            <button
              className="currency-select"
              onClick={() =>
                setRegionOpen((value) => !value)
              }
              aria-label="Select region and currency"
              aria-expanded={regionOpen}
            >
              <span>{selectedRegion.flag}</span>

              <span>
                {selectedRegion.label} (
                {selectedRegion.currency})
              </span>

              <ChevronDown size={12} />
            </button>

            {regionOpen && (
              <div className="region-dropdown">
                {REGIONS.map((item) => (
                  <button
                    key={item.code}
                    className={
                      item.code === region
                        ? "region-option selected"
                        : "region-option"
                    }
                    onClick={() =>
                      changeRegion(item.code)
                    }
                  >
                    <span>{item.flag}</span>

                    <span>
                      {item.label} ({item.currency})
                    </span>

                    {item.code === region && (
                      <span className="region-check">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DESKTOP SEARCH */}
          <div className="header-search">
            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  go();
                }
              }}
              placeholder="Search"
              aria-label="Search products"
            />

            <button
              onClick={go}
              aria-label="Search products"
            >
              <Search size={20} />
            </button>
          </div>

          <button
            className="header-icon"
            aria-label="Account"
          >
            <UserRound size={20} />
          </button>

          {/* WISHLIST */}
          <button
            className="header-icon desktop-heart"
            onClick={showWishlist}
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
              <span>{wishlistCount}</span>
            )}
          </button>

          {/* CART */}
          <button
            className="header-icon cart-icon"
            onClick={onCart}
            aria-label="Basket"
          >
            <ShoppingBag size={21} />

            {cartCount > 0 && (
              <span>{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-panel">
          {/* MOBILE SEARCH */}
          <div className="mobile-search">
            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  go();
                }
              }}
              placeholder="Search Godavari Basket"
              aria-label="Search products"
            />

            <button
              onClick={go}
              aria-label="Search products"
            >
              <Search size={18} />
            </button>
          </div>

          {/* MOBILE REGION */}
          <div className="mobile-region-selector">
            <span>Region & Currency</span>

            <div>
              {REGIONS.map((item) => (
                <button
                  key={item.code}
                  className={
                    item.code === region
                      ? "mobile-region-option selected"
                      : "mobile-region-option"
                  }
                  onClick={() =>
                    changeRegion(item.code)
                  }
                >
                  {item.flag} {item.label} (
                  {item.currency})
                </button>
              ))}
            </div>
          </div>

          <button
            className="mobile-wishlist-link"
            onClick={showWishlist}
          >
            <Heart
              size={16}
              fill={
                wishlistCount > 0
                  ? "currentColor"
                  : "none"
              }
            />

            Wishlist

            {wishlistCount > 0 && (
              <span>({wishlistCount})</span>
            )}
          </button>

          <a
            href="#"
            onClick={() => setOpen(false)}
          >
            HOME
          </a>

          <a
            href="#collections"
            onClick={() => setOpen(false)}
          >
            SHOP
          </a>

          <a
            href="#about"
            onClick={() => setOpen(false)}
          >
            OUR STORY
          </a>

          <a
            href="#gifting"
            onClick={() => setOpen(false)}
          >
            GIFTING
          </a>

          <a
            href="#blog"
            onClick={() => setOpen(false)}
          >
            BLOG
          </a>

          <a
            href="#contact"
            onClick={() => setOpen(false)}
          >
            CONTACT
          </a>
        </div>
      )}
    </header>
  );
}
