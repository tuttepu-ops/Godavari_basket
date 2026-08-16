"use client";

import { Heart, Minus, Plus, ShoppingBag, Star, X } from "lucide-react";
import { useState } from "react";
import type { Product } from "../lib/products";

export default function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  const [details, setDetails] = useState(false);
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  function handleOpenDetails() {
    setDetails(true);
    try {
      const stored = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
      const filtered = stored.filter((item: Product) => item.id !== product.id);
      const updated = [product, ...filtered].slice(0, 8);
      localStorage.setItem("recently_viewed", JSON.stringify(updated));
      window.dispatchEvent(new Event("recently-viewed-updated"));
    } catch (e) {
      console.error(e);
    }
  }

  function add() {
    for (let i = 0; i < quantity; i++) onAdd(product);
    setQuantity(1);
    setDetails(false);
  }

  return (
    <>
      <article className="product-card-v2" onClick={handleOpenDetails}>
        <div className="product-image-v2">
          {product.badge && <span className="product-badge-v2">{product.badge}</span>}
          <button
            className={`product-heart ${liked ? "liked" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setLiked((v) => !v);
            }}
            aria-label="Wishlist"
          >
            <Heart size={17} fill={liked ? "currentColor" : "none"} />
          </button>
          <img src={product.image} alt={product.name} loading="lazy" />
          <div className="product-touch-label">Tap to explore</div>
        </div>

        <div className="product-body-v2">
          <span className="product-category-v2">{product.category}</span>
          <h3>{product.name}</h3>
          <div className="rating-row">
            {product.rating > 0 && (
              <>
                <Star size={12} fill="currentColor" /> {product.rating.toFixed(1)}{" "}
                <span>({product.reviews})</span>
              </>
            )}
          </div>
          <div className="product-price-row">
            <strong>₹{product.price.toLocaleString("en-IN")}</strong>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(product);
              }}
            >
              <ShoppingBag size={14} /> ADD TO BASKET
            </button>
          </div>
        </div>
      </article>

      {details && (
        <div className="product-modal-backdrop" onClick={() => setDetails(false)}>
          <div className="product-modal-v2" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-v2" onClick={() => setDetails(false)}>
              <X size={20} />
            </button>
            <div className="modal-image-v2">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="modal-copy-v2">
              <span className="product-category-v2">{product.category}</span>
              <h2>{product.name}</h2>
              <strong className="modal-price-v2">
                ₹{product.price.toLocaleString("en-IN")}
              </strong>
              <p>{product.description}</p>
              {product.ingredients && (
                <p>
                  <b>Ingredients</b>
                  <br />
                  {product.ingredients}
                </p>
              )}
              {product.benefits && (
                <p>
                  <b>Why you'll love it</b>
                  <br />
                  {product.benefits}
                </p>
              )}
              <div className="quantity-v2">
                <span>Quantity</span>
                <div>
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    <Minus size={15} />
                  </button>
                  <b>{quantity}</b>
                  <button onClick={() => setQuantity((q) => q + 1)}>
                    <Plus size={15} />
                  </button>
                </div>
              </div>
              <button className="gold-button modal-add-v2" onClick={add}>
                <ShoppingBag size={16} /> ADD {quantity} TO BASKET
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}