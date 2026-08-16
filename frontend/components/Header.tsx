"use client";

import { Heart, Menu, Search, ShoppingBag, UserRound, X, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Header({ cartCount, onCart }: { cartCount: number; onCart: () => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  function go() {
    const q = search.trim().toLowerCase();
    window.dispatchEvent(new CustomEvent("product-search", { detail: q }));
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  }

  return (
    <>
      <header className="site-header">
        <div className="container-wide header-inner">
          <button className="mobile-menu-trigger" onClick={() => setOpen(v => !v)} aria-label="Open menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <a href="#" className="brand-mark" aria-label="Godavari Basket home">
            <span className="brand-emblem">GB</span>
            <span className="brand-copy"><strong>GODAVARI</strong><small>BASKET</small></span>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a className="active" href="#">HOME</a>
            <a href="#collections">SHOP <ChevronDown size={12} /></a>
            <a href="#about">OUR STORY</a>
            <a href="#gifting">GIFTING</a>
            <a href="#blog">BLOG</a>
            <a href="#contact">CONTACT</a>
          </nav>

          <div className="header-actions">
            <div className="currency-select"><span>🇮🇳</span> India (INR) <ChevronDown size={12} /></div>
            <div className="header-search">
              <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} aria-label="Search products" />
              <button onClick={go} aria-label="Search"><Search size={20} /></button>
            </div>
            <button className="header-icon" aria-label="Account"><UserRound size={20} /></button>
            <button className="header-icon desktop-heart" aria-label="Wishlist"><Heart size={19} /></button>
            <button className="header-icon cart-icon" onClick={onCart} aria-label="Basket">
              <ShoppingBag size={21} />{cartCount > 0 && <span>{cartCount}</span>}
            </button>
          </div>
        </div>

        {open && (
          <div className="mobile-panel">
            <div className="mobile-search">
              <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} placeholder="Search Godavari Basket" />
              <button onClick={go}><Search size={18} /></button>
            </div>
            <a href="#" onClick={() => setOpen(false)}>HOME</a>
            <a href="#collections" onClick={() => setOpen(false)}>SHOP</a>
            <a href="#about" onClick={() => setOpen(false)}>OUR STORY</a>
            <a href="#gifting" onClick={() => setOpen(false)}>GIFTING</a>
            <a href="#blog" onClick={() => setOpen(false)}>BLOG</a>
            <a href="#contact" onClick={() => setOpen(false)}>CONTACT</a>
          </div>
        )}
      </header>
    </>
  );
}
