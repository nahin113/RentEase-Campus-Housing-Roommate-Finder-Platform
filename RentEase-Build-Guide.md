# RentEase — Campus Housing & Roommate Finder Platform
**Build Guide (TypeScript Edition)**

**Stack:** Next.js (React/TS) frontend · Node.js/Express (TS) backend · MongoDB (Mongoose) · JWT auth (HTTPOnly cookies) · Stripe Checkout · ImgBB image hosting · Tailwind CSS · Recharts

> Assumption: no explicit deadline was given in the brief. Given the scope (3 role-based dashboards, JWT + RBAC, Stripe, server-side pagination, 20+/12+ commit requirements), this guide assumes a **10-day build window**. Adjust the Execution Schedule proportionally if your actual deadline differs.

---

## 1. Strategy Box

This is a rubric-graded assignment where **every checklist item in Sections 02–03 of the brief is a direct point deduction if missing** — there is no partial credit implied, so treat "required" items as harder constraints than "nice" features like the newsletter block. Build MVP-first: authentication + roommate/property CRUD + Stripe deposit flow are the spine: nothing else matters if refresh-breaks-auth or CORS errors appear, since the brief explicitly zeroes the grade for deployment failures. Winning this project means: **a live, refresh-safe, error-free deployment with all three role dashboards functional and Stripe payment completing end-to-end** — polish (animations, testimonials, newsletter) only counts once that spine works. A smaller, fully-working system beats a feature-complete but broken one, per the brief's explicit 0-mark deployment warning.

---

## 2. Requirement Breakdown Table

| Requirement | Priority | Concrete Build Decision |
|---|---|---|
| Full TypeScript, no implicit `any` | Critical | `strict: true` + `noImplicitAny` in both `tsconfig.json`s from day 1; shared `types/` package |
| 20+ frontend / 12+ backend commits | Critical (auto-checked) | Commit after every working slice (see Section 12); never one giant commit |
| README (purpose, live link, features, packages) | Critical | Use template in Section 13 |
| Env vars for all secrets (client + server) | Critical | `.env.local` (Next.js) + `.env` (Express), both gitignored, `.env.example` committed |
| Fully responsive (mobile/tablet/desktop) | Critical | Tailwind breakpoints `sm/md/lg`; test every page at 375px/768px/1440px |
| Max 3 primary colors + neutrals | Critical | Define in `tailwind.config.ts` theme extend, enforce via design tokens |
| No Lorem Ipsum / placeholder content | Critical | Seed DB with realistic data before first demo (Section 11) |
| Form/endpoint/router error messages | Critical | Zod validation client-side + centralized Express error middleware |
| No reload-crash on private routes | Critical | Persist JWT in HTTPOnly cookie; hydrate auth state via `/api/auth/me` on load, never client-only state |
| No white-screen on first load / no 404s | Critical | Next.js App Router with proper `loading.tsx`/`error.tsx`/`not-found.tsx` per route |
| No CORS errors | Critical | Express `cors({ origin: process.env.CLIENT_URL, credentials: true })` |
| Stay logged in until explicit logout | Critical | Long-lived HTTPOnly cookie + refresh-on-load, not localStorage token |
| Navbar: 3+ public links, 5+ private links, sticky | High | Layout component with `useAuth()` conditional render |
| Footer: logo, contact, social (X icon), copyright | High | Static footer component, shared layout |
| All required public/private pages exist | Critical | Route map in Section 4 wireframe |
| Home page: 7+ real-data sections | High | Sections listed in Section 05 of brief, each fetched from API |
| Skeleton loaders on all async fetches | High | Shared `<Skeleton />` component, used on every card grid |
| Demo Login buttons (Admin/Landlord/Student) | Critical (recruiter-facing) | Hardcoded seeded creds, one-click POST to `/api/auth/login` |
| JWT + role middleware (`/api/admin/*`, `/api/landlord/*`) | Critical | Express middleware chain: `verifyToken` → `requireRole(role)` |
| Server-side pagination/sort/filter on Browse Properties | Critical | `req.query` → Mongoose `.skip().limit().sort()` |
| Landlord dashboard: add/manage property, applications, charts | Critical | Section 07 of brief, Recharts bar/pie |
| Student dashboard: applications, bookings, profile | Critical | Section 08 of brief |
| Admin dashboard: users, properties, transactions, charts | Critical | Section 09 of brief |
| Stripe Checkout deposit flow + success page | Critical | `/create-checkout-session` + webhook or session-verify on `/payment/success` |
| Shared strict types (Property, User, Application, Transaction) | High | `packages/shared-types` or duplicated `types/` synced manually if no monorepo tool |
| Newsletter subscription | Low (brief marks optional) | Simple input, store email in `subscribers` collection |
| Social login UI (Google/Facebook) | Low (brief marks optional) | Static buttons only, no real OAuth required |

---

## 3. Scope Fence

**Scope you will implement**
- [ ] JWT auth (register/login/logout) with HTTPOnly cookie, 3 roles
- [ ] Demo Login buttons for all 3 roles
- [ ] Property CRUD (landlord create/read/update-status/delete)
- [ ] Roommate profile CRUD (student)
- [ ] Application flow (student applies → landlord accepts/rejects)
- [ ] Stripe Checkout deposit on application acceptance
- [ ] Admin: block users, delete properties, view transactions
- [ ] Browse Properties: search, 2+ filters, sort, server-side pagination
- [ ] Home page with 7 real-data sections
- [ ] Property Details page with gallery, related properties, application modal
- [ ] Responsive Tailwind UI, skeleton loaders, 404 page
- [ ] Recharts dashboards (landlord + admin)
- [ ] README, `.env.example`, deployment on Vercel (client) + Render/Railway (server)

**Do not implement today / out of scope**
- [ ] Real Google/Facebook OAuth — brief marks it optional, static UI button is sufficient
- [ ] Real-time chat between landlord/student — not requested anywhere in brief
- [ ] Review/rating write flow beyond schema + display — brief only requires the `reviews` collection and a display section, not a full moderation system
- [ ] Refund/payout logic for Stripe — brief only requires deposit collection, not disbursement
- [ ] Push notifications / email notifications — not mentioned in requirements
- [ ] Multi-language i18n — not mentioned in requirements

**Security/safety assumption:** This app handles auth tokens, payment sessions, and PII (student budgets, contact info). Assume all secret keys (JWT secret, Stripe secret key, MongoDB URI, ImgBB key) live only in server-side env vars; the only Stripe key exposed client-side is the **publishable** key. All role-gated API routes are verified server-side via middleware — never trust a client-sent role field.

---

## 4. Execution Schedule (10-day plan)

| Day | Time Block | Deliverable |
|---|---|---|
| 1 | AM–PM | Repos scaffolded (client + server, TS strict), shared types drafted, Mongoose schemas for all 5 collections connect to Atlas successfully |
| 2 | AM–PM | JWT auth working end-to-end: register, login, HTTPOnly cookie, `/api/auth/me`, logout, role field stored and returned |
| 3 | AM–PM | Express role middleware (`verifyToken`, `requireRole`) blocks unauthorized calls to `/api/admin/*` and `/api/landlord/*`; frontend route guards redirect to `/login` |
| 4 | AM–PM | Property CRUD complete: Add Property form (ImgBB upload), Manage Properties table (view/delete), properties persist and list correctly |
| 5 | AM–PM | Browse Properties page: search bar, 2 filters, sort dropdown, server-side pagination fully wired to `req.query` |
| 6 | AM–PM | Property Details page (gallery, sections, related properties) + Application modal + Applications list on landlord/student dashboards |
| 7 | AM–PM | Stripe Checkout: accept application → `/create-checkout-session` → `/payment/success` page shows real booking data; property status flips to "Rented" |
| 8 | AM–PM | Home page: all 7 sections wired to real data, skeleton loaders in place; Admin dashboard: manage users (block), manage properties, transactions view + Recharts |
| 9 | AM–PM | Responsive pass on every page (375/768/1440px), 404 page, error boundaries, refresh-safety test on every private route, CORS verified against deployed URLs |
| 10 | AM–PM | Deploy client (Vercel) + server (Render/Railway), seed realistic demo data, write README, final QA checklist pass, record demo video if required |

**Cut order (drop first if behind schedule):**
1. Newsletter subscription block
2. Testimonials section (replace with static seeded quotes if needed, never Lorem Ipsum)
3. Social login UI buttons
4. Popular Campus Neighborhoods clickable filter blocks (fall back to static links)
5. Platform statistics count-up animation (show static real numbers instead)

**Never allowed to be cut:** JWT auth + role middleware, Stripe deposit flow, refresh-safety on private routes, CORS correctness, TypeScript strictness, README.

**Definition of finished**
- [ ] All 3 demo logins work in one click on the live site
- [ ] A student can apply, get accepted, pay via Stripe, and see "Rented" reflected
- [ ] Refreshing any dashboard page keeps the user logged in with no crash
- [ ] Browse Properties pagination/filter/sort all hit the backend, not client-side array slicing
- [ ] No console CORS or 404 errors on the deployed site
- [ ] No `any` types remain in either codebase (`tsc --noEmit` passes clean)

---

## 5. Recommended Stack Table

| Layer | Technology | Reason |
|---|---|---|
| Frontend framework | Next.js 14 (App Router) + TypeScript | SSR/SSG solves the "no white screen on first load" and SEO requirements natively |
| Styling | Tailwind CSS | Mandated by brief; fastest path to consistent card sizing/spacing rules |
| State/data fetching | TanStack Query (React Query) | Handles skeleton-loading states, caching, and pagination cleanly against Express API |
| Forms/validation | React Hook Form + Zod | Gives the "proper error messages on all input forms" requirement almost for free |
| Charts | Recharts | Explicitly required by brief for landlord/admin dashboards |
| Auth | JWT + HTTPOnly cookies (`jsonwebtoken`, `cookie-parser`) | Meets "stay logged in on refresh" and "block unauthorized" requirements without localStorage XSS risk |
| Backend framework | Node.js + Express + TypeScript | Mandated by brief; middleware model fits role-based route protection |
| Database | MongoDB Atlas + Mongoose | Mandated by brief; schemas map directly to Section 13's field lists |
| Image hosting | ImgBB API | Mandated by brief for property/profile photos |
| Payments | Stripe Checkout (Node SDK) | Mandated by brief for booking deposits |
| Deployment (client) | Vercel | Native Next.js support, zero-config env vars |
| Deployment (server) | Render or Railway | Free-tier persistent Node server (Vercel serverless is a poor fit for long-lived Express + cookie sessions) |

**Folder tree**
```
rentease/
├── client/                      # Next.js TS app
│   ├── app/
│   │   ├── (public)/home, browse, roommates, property/[id], about, contact, login, register
│   │   ├── dashboard/
│   │   │   ├── landlord/ add-property, manage-properties, applications
│   │   │   ├── student/ applications, bookings, profile
│   │   │   └── admin/ users, properties, transactions
│   │   ├── payment/success/
│   │   └── not-found.tsx
│   ├── components/ (Navbar, Footer, Skeletons, Cards, Charts)
│   ├── lib/ (api client, auth hooks)
│   └── types/ (shared with server)
├── server/                      # Express TS app
│   ├── src/
│   │   ├── models/ (User, Property, Application, Transaction, Review)
│   │   ├── routes/ (auth, properties, applications, users, payments)
│   │   ├── middleware/ (verifyToken, requireRole, errorHandler)
│   │   ├── controllers/
│   │   └── types/ (shared with client)
│   └── server.ts
└── shared-types/                 # optional: single source of truth for both
```

**Architecture flow:** Browser → Next.js UI (React Query hooks) → Express REST API (`/api/*`, cookie-authenticated) → role middleware → Mongoose models → MongoDB Atlas, with Stripe Checkout Sessions and ImgBB uploads handled as side-effect calls from the Express layer.

---

## 6. Project Setup

```bash
# Client
npx create-next-app@latest client --typescript --tailwind --app
cd client
npm install @tanstack/react-query react-hook-form zod @hookform/resolvers axios recharts js-cookie
cd ..

# Server
mkdir server && cd server
npm init -y
npm install express mongoose jsonwebtoken bcryptjs cookie-parser cors dotenv stripe
npm install -D typescript ts-node-dev @types/express @types/node @types/jsonwebtoken @types/bcryptjs @types/cookie-parser @types/cors
npx tsc --init --strict --rootDir src --outDir dist
```

**`client/.env.local.example`**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
```

**`server/.env.example`**
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rentease
JWT_SECRET=replace_with_long_random_string
CLIENT_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
```

**Secrets rule:** Never commit `.env` or `.env.local`. Commit only `.env.example` files with placeholder values. Add both to `.gitignore` in the first commit of each repo, before any real key is ever typed.

---

## 7. Data / Domain Model

| Entity | Key Fields | Relationships |
|---|---|---|
| `users` | name, email, image, role, lifestyle_habits[], budget, bio, isBlocked, createdAt | Referenced by `properties.landlord_email`, `applications.student_email` |
| `properties` | title, short_description, full_description, location, rent_amount, images[], landlord_email, status, amenities, createdAt | Belongs to a user (landlord); has many applications |
| `applications` | property_id, student_email, move_in_date, message, status, submitted_at | Belongs to a property and a user (student) |
| `reviews` | property_id, reviewer_email, reviewee_email, rating, comment, created_at | Belongs to a property; links two users |
| `transactions` (derived from Stripe) | application_id, property_id, amount, stripe_session_id, status, createdAt | Created on successful checkout |

```typescript
// shared-types/property.ts
export interface Property {
  _id: string;
  title: string;
  short_description: string;
  full_description: string;
  location: string;
  rent_amount: number;
  images: string[];
  landlord_email: string;
  status: 'available' | 'pending' | 'rented';
  amenities: string[];
  createdAt: string;
}

// shared-types/application.ts
export interface Application {
  _id: string;
  property_id: string;
  student_email: string;
  move_in_date: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'paid';
  submitted_at: string;
}
```

**Mermaid ERD**
```mermaid
erDiagram
  USERS ||--o{ PROPERTIES : "lists (landlord)"
  USERS ||--o{ APPLICATIONS : "submits (student)"
  PROPERTIES ||--o{ APPLICATIONS : "receives"
  PROPERTIES ||--o{ REVIEWS : "receives"
  APPLICATIONS ||--o| TRANSACTIONS : "generates on payment"
```
Export: paste into [mermaid.live](https://mermaid.live) → "Actions" → download as SVG/PNG for the README.

---

## 8. Core Implementation

**Why this pattern (auth middleware):** role checks must happen server-side on every protected request, not just hidden in the UI, or the "no unauthorized dashboard access" requirement fails a basic curl test.

```typescript
// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthPayload { email: string; role: 'admin' | 'landlord' | 'student'; }
declare module 'express-serve-static-core' {
  interface Request { user?: AuthPayload; }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireRole(...roles: AuthPayload['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}
```

**Why this pattern (server-side pagination):** the brief explicitly requires `req.query` driven pagination, not client array slicing — this also fixes performance at scale.

```typescript
// server/src/controllers/propertyController.ts
export async function getProperties(req: Request, res: Response) {
  const { page = '1', limit = '8', sort = 'newest', minPrice, maxPrice, location } = req.query;
  const filter: Record<string, unknown> = { status: 'available' };
  if (location) filter.location = { $regex: location as string, $options: 'i' };
  if (minPrice || maxPrice) {
    filter.rent_amount = {
      ...(minPrice && { $gte: Number(minPrice) }),
      ...(maxPrice && { $lte: Number(maxPrice) }),
    };
  }
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    price_asc: { rent_amount: 1 },
    price_desc: { rent_amount: -1 },
  };
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Property.find(filter).sort(sortMap[sort as string]).skip(skip).limit(Number(limit)),
    Property.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
}
```

| Method | Path | Purpose / Access |
|---|---|---|
| POST | `/api/auth/register` | Public — create user, hash password |
| POST | `/api/auth/login` | Public — issue JWT cookie |
| POST | `/api/auth/logout` | Authenticated — clear cookie |
| GET | `/api/auth/me` | Authenticated — hydrate session on refresh |
| GET | `/api/properties` | Public — paginated/filtered/sorted list |
| POST | `/api/properties` | Landlord only |
| DELETE | `/api/properties/:id` | Landlord (owner) or Admin |
| POST | `/api/applications` | Student only |
| PATCH | `/api/applications/:id` | Landlord only — accept/reject |
| POST | `/api/payments/create-checkout-session` | Student only, requires accepted application |
| GET | `/api/admin/users` | Admin only |
| PATCH | `/api/admin/users/:id/block` | Admin only |

**Do not duplicate this logic:** all role/permission checks live only inside `middleware/auth.ts`; controllers never re-implement `if (req.user.role !== ...)` checks inline — call `requireRole()` in the route definition instead.

---

## 9. Quality, Validation & Security

- [ ] Every POST/PATCH body validated with Zod schema before touching the DB
- [ ] Passwords hashed with bcrypt (never stored/returned in plaintext)
- [ ] JWT secret is a long random string, never hardcoded
- [ ] Stripe secret key only used server-side; webhook signature verified
- [ ] Mongoose schema-level required fields + Express-level 400 on missing fields
- [ ] Rate-limit `/api/auth/login` to blunt brute-force attempts
- [ ] Admin "block user" also invalidates that user's ability to auth (check `isBlocked` in `verifyToken`)
- [ ] CORS restricted to the deployed client origin only, `credentials: true`

| Failure State | User-Facing Message |
|---|---|
| 401 (no/expired token) | "Your session has expired. Please log in again." |
| 403 (wrong role) | "You don't have permission to view this page." |
| Empty properties list | "No properties match your filters yet — try widening your search." |
| Network/server error | "Something went wrong on our end. Please try again shortly." |
| Blocked user login attempt | "This account has been suspended. Contact support." |
| Stripe payment failed/cancelled | "Payment was not completed. Your application is still pending — you can retry from My Applications." |

---

## 10. Test / Seed Data

Seed at least: 3 landlords, 10 properties across 3–4 campus locations at varied rent, 6 students with distinct budgets/lifestyle tags, a mix of pending/accepted/rejected applications, and 2–3 completed transactions so the admin dashboard chart isn't empty on first load.

| Area | Happy Path | Edge Case |
|---|---|---|
| Auth | Login with seeded student creds → lands on student dashboard | Refresh dashboard mid-session → stays logged in, no crash |
| Property CRUD | Landlord adds property with 3 images → appears in Browse instantly | Submit with missing rent amount → inline validation error, no server 500 |
| Applications | Student applies → landlord sees it in Applications tab | Student applies twice to same property → backend rejects duplicate |
| Payments | Landlord accepts → Stripe Checkout completes → status becomes "Rented" | User closes Stripe tab mid-payment → application stays "accepted", not falsely marked paid |
| Admin | Block a landlord → landlord's next login attempt fails with clear message | Delete a property with active applications → applications handled gracefully (cascade or soft block) |
| Browse | Filter by location + price range → correct subset with pagination | Filter combo returns zero results → empty-state message, not a blank page |

**Testing trade-off:** given the timeline, prioritize manual end-to-end testing of the full application→payment flow over unit test coverage — a working demo path matters more for this rubric than isolated test suites.

---

## 11. Git / Version Control Plan

```
feat(server): init express + typescript strict config, connect mongodb atlas
feat(server): add user, property, application, review schemas
feat(server): implement jwt auth routes (register/login/logout/me)
feat(server): add verifyToken and requireRole middleware
feat(server): add property CRUD routes with landlord ownership checks
feat(server): add server-side pagination/filter/sort to GET /properties
feat(server): add applications routes (submit/accept/reject)
feat(server): integrate stripe create-checkout-session endpoint
feat(server): add admin routes (block user, manage properties)
fix(server): centralize error-handling middleware with typed responses
chore(server): add cors config for deployed client origin
docs(server): add README and .env.example

feat(client): scaffold next.js app router with tailwind + strict ts
feat(client): build navbar/footer shared layout with auth-aware links
feat(client): implement login/register pages with demo-login buttons
feat(client): add auth context hydrated via /api/auth/me
feat(client): build home page hero + featured properties section
feat(client): add remaining home page sections (roommates, stats, testimonials)
feat(client): build browse properties page with filters/sort/pagination
feat(client): build property details page with gallery and application modal
feat(client): build landlord dashboard (add/manage properties, applications)
feat(client): build student dashboard (applications, bookings, profile)
feat(client): build admin dashboard with recharts visualizations
feat(client): integrate stripe checkout redirect and payment success page
feat(client): add skeleton loaders across all async card grids
fix(client): resolve reload-crash on protected dashboard routes
fix(client): resolve cors/404 issues found during deployment testing
style(client): enforce 3-color design system across all components
docs(client): add README with setup, features, and env var instructions
```

---

## 12. README Template

```markdown
# RentEase — Campus Housing & Roommate Finder

Live Site: https://rentease-campus-housing.vercel.app

## Purpose
A campus housing and roommate marketplace where landlords list rentals near
universities and students browse, apply, find compatible roommates, and pay
booking deposits securely via Stripe.

## Key Features
- Role-based dashboards (Admin / Landlord / Student) with JWT auth
- Property CRUD with ImgBB image uploads
- Roommate finder with lifestyle/budget matching
- Server-side paginated, filtered, sorted property browsing
- Stripe Checkout booking deposits with live status updates
- Fully responsive, strictly typed TypeScript codebase

## Tech Stack
Next.js, React, TypeScript, Tailwind CSS, Node.js, Express, MongoDB/Mongoose,
JWT, Stripe, Recharts, ImgBB, TanStack Query, React Hook Form + Zod

## Setup
1. Clone both `rentease-client` and `rentease-server` repos
2. `npm install` in each
3. Copy `.env.example` to `.env.local` (client) / `.env` (server) and fill in values
4. `npm run dev` in both

## Environment Variables
See `.env.example` in each repo.

## Architecture
Browser → Next.js UI → Express REST API (JWT-cookie authenticated) → Mongoose → MongoDB Atlas

## Known Limitations
- No real OAuth (Google/Facebook buttons are UI-only)
- No refund/payout flow for deposits

## Future Improvements
- Real-time application status notifications
- In-app messaging between landlord and student

## Author
[Your Name]
```

---

## 13. Deployment

1. **Server (Render/Railway):** push `server/` repo → connect → set all env vars from `.env.example` → set start command `node dist/server.js` (after `tsc` build) → note deployed URL.
2. **Client (Vercel):** push `client/` repo → import project → set `NEXT_PUBLIC_API_URL` to the deployed server URL → deploy.
3. Update server's `CLIENT_URL` env var to the Vercel domain and redeploy server (fixes CORS).
4. Test every private route with a hard refresh on the **deployed** URL, not just localhost.
5. Add the deployed client domain to your Stripe dashboard's allowed redirect URLs for Checkout success/cancel.

**Deployment judgment:** a fully working local build you can screen-share beats a broken live demo — if the live deploy has an unresolved CORS/auth bug near the deadline, be ready to walk through localhost instead of submitting a broken link.

---

## 14. Presentation / Video Script

| Time | What to Show and Say |
|---|---|
| 0:00–0:20 | "This is RentEase, a campus housing and roommate marketplace built with TypeScript across the full stack." Show home page hero. |
| 0:20–0:50 | Demo Login as Student → browse properties → apply filters/sort/pagination live. |
| 0:50–1:20 | Open a property details page, submit an application via the modal. |
| 1:20–1:50 | Demo Login as Landlord → show the accepted application → walk through Stripe Checkout to completion. |
| 1:50–2:10 | Show `/payment/success` page and the property status flipping to "Rented". |
| 2:10–2:35 | Demo Login as Admin → show Recharts dashboard, block a user. |
| 2:35–2:50 | Refresh a dashboard page live to prove the no-reload-crash requirement. |
| 2:50–3:00 | Close on the GitHub repos and README. |

**Do not say:** "AI wrote everything," "it's production-ready," "there were no challenges," or overclaim security/scale that wasn't actually implemented.

---

## 15. Final Submission / QA Checklist

- [ ] Live link loads instantly, no white screen
- [ ] All 3 Demo Login buttons work
- [ ] No console CORS or 404 errors anywhere
- [ ] Every private dashboard route survives a hard refresh while logged in
- [ ] Stripe deposit flow completes and updates property status
- [ ] 20+ frontend commits / 12+ backend commits with clear messages
- [ ] README complete on both repos
- [ ] `.env` files gitignored, `.env.example` committed
- [ ] No `any` types, `tsc --noEmit` passes on both repos
- [ ] Responsive checked at mobile/tablet/desktop
- [ ] No Lorem Ipsum anywhere on the live site

**Submission note template:**
```
Project: RentEase — Campus Housing & Roommate Finder
Live Site: https://rentease-campus-housing.vercel.app
Frontend Repo: https://github.com/<username>/rentease-client
Backend Repo: https://github.com/<username>/rentease-server
Admin Demo: admin@rentease.com / admin@rentease.com
Landlord Demo: landlord1@gmail.com / landlord1@gmail.com
Student Demo: student3@gmail.com / student3@gmail.com
```

---

## 16. Reusable Build-Time AI Prompt

```
You are helping me build one feature at a time for RentEase, a TypeScript
full-stack app (Next.js App Router client + Express server + MongoDB/Mongoose,
JWT HTTPOnly-cookie auth, Stripe Checkout, Tailwind CSS, Recharts).

Architecture reference:
- Shared types live in a types folder used by both client and server.
- All role checks happen only in server middleware (verifyToken, requireRole)
  — never re-implement role checks inline in controllers.
- Server-side pagination/filter/sort via req.query, never client-side slicing.
- Tailwind only, max 3 primary colors, consistent card sizing.

Rules for this session:
1. Generate ONE feature/component at a time — do not generate unrelated files.
2. Never use `any`; if a type is genuinely unknown, ask me before proceeding.
3. Explain any non-obvious line in a one-line comment.
4. After generating a piece, stop and wait for my approval before generating
   the next file — do not chain multiple files in one response.
5. If a requirement conflicts with what's already built, flag it instead of
   silently changing prior code.

First task: [describe the specific feature, e.g. "the Express route and
controller for POST /api/applications with Zod validation"]
```

---

## 17. Final Priority Order

1. JWT auth (register/login/logout/refresh-safe session) — nothing else is reachable without it
2. Role-based route protection (frontend guards + backend middleware)
3. Property CRUD + Browse Properties with server-side pagination/filter/sort
4. Application flow (submit → accept/reject)
5. Stripe Checkout deposit + `/payment/success` + status update to "Rented"
6. Landlord/Admin dashboards with Recharts
7. Home page 7-section layout with real data
8. Roommate finder + student profile editing
9. Responsive/skeleton/404/error-page polish
10. Newsletter, testimonials, social login UI, neighborhood filter blocks (nice-to-have)
