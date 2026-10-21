# Phase 1 - Web-to-Print Demo (localhost)

Goal: a demo application on Medusa (backend) + Next.js (storefront) populated with dummy print products
(business cards, flyers, brochures) that we can present to a client on localhost.

Out of scope for Phase 1: PDF generation, deployment/on-prem packaging, editor (Fabric.js), approvals, SSO, VDP.

Each task below is written so it can be copied into a GitHub issue (title, labels, description, acceptance criteria).

---

## 1. Local environment setup

**Labels:** `setup`, `phase-1`

**Description**
- Start PostgreSQL and Redis via `docker compose up -d db redis`.
- Confirm `apps/backend/.env` and `apps/storefront/.env.local` values (DB URL, Redis URL, CORS, publishable key).
- Install dependencies with npm (repo uses `package-lock.json`; do not create another lockfile).
- Run `medusa db:migrate`.

**Acceptance criteria**
- Postgres (5432) and Redis (6379) containers are healthy.
- `medusa db:migrate` completes without errors.
- Setup steps are documented in the README.

---

## 2. Run initial store seed and create admin user

**Labels:** `backend`, `phase-1`

**Description**
- Run `npm run backend:seed` to create region, sales channel, shipping profile, stock location and publishable API key.
- Create an admin user with `medusa user -e <email> -p <password>`.
- Verify the admin dashboard at `http://localhost:9000/app`.

**Acceptance criteria**
- Admin can log in.
- A sales channel, region, shipping profile and publishable key exist.

---

## 3. Define demo print catalogue

**Labels:** `data`, `phase-1`

**Description**
Agree the dummy catalogue before seeding:
- Categories: Business Cards, Flyers, Brochures.
- Products per category (3 each, 9 total) with print specs in the subtitle/description (size, stock, sides, folds).
- Options per product: Quantity, Paper, Finish / Sides / Fold / Pages (as relevant).
- Price tiers by quantity (variant price = unit price x quantity factor x option multipliers).

**Acceptance criteria**
- Catalogue list is reviewed and approved by the project owner.

---

## 4. Replace apparel demo seed with print demo seed script

**Labels:** `backend`, `data`, `phase-1`

**Description**
- Remove the apparel-based `apps/backend/src/scripts/seed-demo-products.ts`.
- Add `apps/backend/src/scripts/seed-print-demo.ts` that creates categories, products, options and variants (all option combinations) with prices for every supported currency.
- Script must be idempotent (deterministic handles, skip existing).
- Run with `npx medusa exec ./src/scripts/seed-print-demo.ts`.

**Acceptance criteria**
- Script runs twice without creating duplicates.
- 9 published products exist in the default sales channel with variants and prices.
- Typecheck and `npm run lint` in `apps/backend` pass.

---

## 5. Product imagery for demo

**Labels:** `data`, `design`, `phase-1`

**Description**
- Replace placeholder images with realistic mockups of cards, flyers and brochures (local files under the storefront `public/` folder or hosted URLs).
- Add 2-3 images per product for the gallery.

**Acceptance criteria**
- Every product shows a relevant thumbnail and gallery on the store page.

---

## 6. Storefront: connect to backend and verify catalogue

**Labels:** `storefront`, `phase-1`

**Description**
- Set `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` and backend URL in the storefront env.
- Start the storefront (`npm run storefront:dev`, http://localhost:8000).
- Confirm categories, product list, product detail and option selection work with the seeded data.

**Acceptance criteria**
- Products and categories render with correct prices.
- Selecting options updates the variant and price.
- No publishable-key or CORS errors in console/network.

---

## 7. Storefront: print-store branding and copy

**Labels:** `storefront`, `design`, `phase-1`

**Description**
- Replace default Medusa/apparel text, hero, nav and footer with web-to-print branding (name, tagline, category links).
- Remove or hide pages not relevant to the demo.

**Acceptance criteria**
- Home page and navigation clearly present Business Cards, Flyers and Brochures.
- No leftover apparel/Medusa starter copy in the demo flow.

---

## 8. Storefront: product page presentation of print specs

**Labels:** `storefront`, `phase-1`

**Description**
- Show print specs (size, paper, finish, quantity) clearly on the product page.
- Present Quantity as the primary option with visible price per tier.
- Optional: a static "Customize / Upload design" button that shows a "coming in Phase 2" message.

**Acceptance criteria**
- A client can understand the print options and price from the product page alone.

---

## 9. End-to-end checkout flow on localhost

**Labels:** `storefront`, `backend`, `phase-1`

**Description**
- Verify add to cart -> cart -> checkout -> shipping -> payment (manual/test provider) -> order confirmation.
- Fix any broken steps caused by the new catalogue (e.g. inventory, shipping options, region/currency).
- Confirm the order appears in the admin dashboard.

**Acceptance criteria**
- A test order can be placed end to end and is visible in admin.

---

## 10. Admin dashboard walkthrough readiness

**Labels:** `backend`, `phase-1`

**Description**
- Verify products, categories, prices and orders are clean and well named in the admin.
- Prepare a short list of admin actions to demo (edit price, add product, view order).

**Acceptance criteria**
- Admin shows only the demo catalogue with consistent naming.

---

## 11. Demo reset script and runbook

**Labels:** `docs`, `phase-1`

**Description**
- Document a one-page demo runbook: start services, seed, credentials, URLs, demo script/talking points.
- Document how to reset the DB to a clean demo state (drop/recreate DB, migrate, seed, create admin) - clearly marked as destructive.

**Acceptance criteria**
- A new team member can bring the demo up from scratch in under 15 minutes using the README.

---

## 12. Demo rehearsal and client feedback capture

**Labels:** `qa`, `phase-1`

**Description**
- Internal dry run of the full demo flow on a clean machine/DB.
- Collect a list of client questions and feedback during the presentation as input for Phase 2 (editor, PDF output, approvals, on-prem packaging).

**Acceptance criteria**
- Dry run completes with no blocking issues.
- Feedback is recorded as Phase 2 backlog items.
