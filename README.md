# Godavari Basket — V2 Premium UI Build

This build keeps the existing Next.js + Python/FastAPI architecture and updates the storefront UI to match the approved Godavari Basket visual direction.

## Brand direction
Godavari Basket is **not only a food store**. The storefront is designed around seven top-level collections:

1. Godavari Foods
2. Farm & Natural
3. Handicrafts
4. Traditional & Cultural
5. Pooja & Spiritual
6. Gifts
7. Special Collections

Food can have subcategories such as sweets, snacks, pickles, podis, oils & ghee, spices, rice/grains and dry fruits. Non-food products are first-class catalogue items.

## What changed
- Premium dark Godavari green + ivory + muted gold visual system.
- Cinematic hero area with a dedicated image slot.
- Round category navigation matching the approved reference.
- Desktop six-column curated product grid.
- Mobile three-column circular category grid and two-column product grid.
- Mobile fixed navigation and touch-friendly controls.
- Product quick view, wishlist state and cart interactions retained.
- Existing Python backend and Supabase order flow retained.
- No demo product catalogue is inserted.
- Added optional `parent_category` and `subcategory` fields to make the seven top-level collections work cleanly with a real catalogue.
- Added `frontend/public/images/` with the required real-image slots.

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

## Run backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend: http://localhost:3000
Backend: http://localhost:8000

## Real images

Place the final approved photography in `frontend/public/images/`. See `frontend/public/images/README.md` for the exact names.

The code deliberately does not manufacture product records. Product cards appear when the configured product API returns your real catalogue.

## Product data columns

The product source can now provide:
- `category` — product-level category/subcategory
- `parent_category` — one of the seven top-level Godavari Basket collections
- `subcategory` — optional more specific category

Example concept:

`parent_category = Godavari Foods`
`category = Sweets`

or

`parent_category = Handicrafts`
`category = Bamboo Baskets`
