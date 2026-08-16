"use client";

import { CircleDot, Gift, Leaf, LampCeiling, Package, Sparkles, Wheat } from "lucide-react";

export const MAIN_CATEGORIES = [
  { name: "Godavari Foods", key: "Godavari Foods", icon: Wheat, image: "/images/category-foods.jpg" },
  { name: "Farm & Natural", key: "Farm & Natural", icon: Leaf, image: "/images/category-farm-natural.jpg" },
  { name: "Handicrafts", key: "Handicrafts", icon: Package, image: "/images/category-handicrafts.jpg" },
  { name: "Traditional & Cultural", key: "Traditional & Cultural", icon: Sparkles, image: "/images/category-traditional-cultural.jpg" },
  { name: "Pooja & Spiritual", key: "Pooja & Spiritual", icon: LampCeiling, image: "/images/category-pooja-spiritual.jpg" },
  { name: "Gifts", key: "Gifts", icon: Gift, image: "/images/category-gifts.jpg" },
  { name: "Special Collections", key: "Special Collections", icon: CircleDot, image: "/images/category-special-collections.jpg" },
];

export default function CategorySection() {
  return (
    <section id="collections" className="category-section">
      <div className="container-wide">
        <div className="section-heading centered">
          <p className="eyebrow">Discover the region</p>
          <h2>EXPLORE THE GODAVARI</h2>
          <div className="mini-divider"><span>✦</span></div>
        </div>
        <div className="category-row">
          {MAIN_CATEGORIES.map(({ name, key, icon: Icon, image }) => (
            <button key={name} className="category-item" onClick={() => { window.dispatchEvent(new CustomEvent("category-filter", { detail: key })); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>
              <span className="category-image" style={{ backgroundImage: `url(${image})` }}>
                <span className="category-image-fallback"><Icon size={30} strokeWidth={1.25} /></span>
                <span className="category-inner-ring" />
              </span>
              <strong>{name}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
