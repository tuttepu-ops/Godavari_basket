"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Box, CheckCircle2, Globe2, HeartHandshake } from "lucide-react";
import IntroAnimation from "../components/IntroAnimation";
import Header from "../components/Header";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductGrid from "../components/ProductGrid";
import RegionalMapSection from "../components/RegionalMapSection";
import CartDrawer, { type CartItem } from "../components/CartDrawer";
import Footer from "../components/Footer";
import type { Product } from "../lib/products";

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("godavari-basket-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("godavari-basket-cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  function addToCart(product: Product) {
    setCart((c) => {
      const found = c.find((i) => i.id === product.id);
      return found
        ? c.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...c, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeQuantity(id: number, delta: number) {
    setCart((c) =>
      c
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  const count = cart.reduce((n, i) => n + i.quantity, 0);

  const trustItems = [
    {
      title: "AUTHENTIC GODAVARI",
      desc: "Sourced directly from farmers & artisans",
      Icon: HeartHandshake,
    },
    {
      title: "QUALITY YOU TRUST",
      desc: "Lab tested. Hygienically packed.",
      Icon: CheckCircle2,
    },
    {
      title: "PAN INDIA & USA",
      desc: "Delivering happiness across borders",
      Icon: Globe2,
    },
    {
      title: "SECURE PAYMENTS",
      desc: "100% safe & secured checkout",
      Icon: Box,
    },
  ];

  return (
    <>
      <IntroAnimation />
      <Header cartCount={count} onCart={() => setCartOpen(true)} />

      <main>
        <Hero />

        {/* Trust Indicators Strip */}
        <section className="trust-strip">
          <div className="container-wide trust-grid">
            {trustItems.map(({ title, desc, Icon }) => (
              <div className="trust-item" key={title}>
                <Icon size={28} strokeWidth={1.25} />
                <div>
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Carousel / Grid */}
        <CategorySection />

        {/* Main Product Showcase Grid */}
        <ProductGrid onAdd={addToCart} />

        {/* Interactive Godavari Regional Delta Map */}
        <RegionalMapSection />

        {/* Story Section */}
        <section id="about" className="story-section">
          <div className="container-wide story-grid">
            <div className="story-copy">
              <p className="eyebrow light">Our origin</p>
              <h2>THE GODAVARI STORY</h2>
              <p className="story-tagline">From our roots to your home</p>
              <div className="gold-divider left">
                <span>✦</span>
              </div>
              <p>
                Every product has a story. From fertile farms and patient artisans to the
                hands that pack each order, we preserve the character of the region while
                making discovery feel effortless.
              </p>
              <a href="#contact" className="outline-gold-button">
                KNOW OUR STORY <ArrowRight size={14} />
              </a>
            </div>

            <div className="story-process">
              {[
                ["01", "SOURCED", "Directly from farmers & artisans"],
                ["02", "QUALITY CHECKED", "Multiple quality checks"],
                ["03", "PACKED WITH CARE", "Hygienically packed to retain freshness"],
                ["04", "DELIVERED TO YOU", "Fast, safe & reliable delivery"],
              ].map(([n, t, d]) => (
                <div className="process-step" key={n}>
                  <span className="process-icon">{n}</span>
                  <strong>{t}</strong>
                  <p>{d}</p>
                </div>
              ))}
            </div>

            <div className="origin-map">
              <div className="map-placeholder">
                <span>OUR ORIGIN</span>
                <strong>Godavari Region, AP</strong>
                <i>GODAVARI</i>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Services Links */}
        <section id="gifting" className="quick-links">
          <div className="container-wide quick-grid">
            {[
              ["BUILD YOUR OWN BASKET", "Create a personalized gift for your loved ones.", "BUILD NOW"],
              ["SUBSCRIPTION BASKETS", "Monthly delivery of your favourites.", "SUBSCRIBE"],
              ["EASY REORDER", "Buy your past favourites in one click.", "REORDER NOW"],
              ["WHATSAPP SUPPORT", "We're here to help you, always.", "CHAT NOW"],
            ].map(([title, desc, cta]) => (
              <a href="#contact" className="quick-card" key={title}>
                <span>{title}</span>
                <p>{desc}</p>
                <b>{cta} →</b>
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onChange={changeQuantity}
      />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <a href="#">
          <span>⌂</span>Home
        </a>
        <a href="#collections">
          <span>◉</span>Shop
        </a>
        <button
  onClick={() => {
    window.dispatchEvent(
      new CustomEvent("wishlist-filter", {
        detail: true,
      })
    );

    document
      .getElementById("shop")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }}
>
  <span>♡</span>
  Wishlist
</button>
        <button onClick={() => setCartOpen(true)}>
          <span>🛍</span>Cart{count > 0 && <b>{count}</b>}
        </button>
        <a href="#contact">
          <span>○</span>Account
        </a>
      </nav>
    </>
  );
}
