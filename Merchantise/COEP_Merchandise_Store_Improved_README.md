# COEP Merchandise Store — Build Specification

**Project:** COEP Merchandise Store (e-commerce)
**Stack:** React + Vite (frontend) · Google Apps Script (order backend) · Google Sheets (order ledger) · UPI Dynamic QR (payment)
**Audience:** Students, faculty, alumni, and visitors of the COEP community
**Status:** MVP specification — see [Build Phases](#15-build-phases) for delivery order

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Getting Started](#2-tech-stack--getting-started)
3. [Product Catalog](#3-product-catalog)
4. [Visual Design System](#4-visual-design-system)
5. [Navigation](#5-navigation)
6. [Home Page](#6-home-page)
7. [Pages & Routes](#7-pages--routes)
8. [Product Data & Product Details](#8-product-data--product-details)
9. [Cart](#9-cart)
10. [Checkout & Order Summary](#10-checkout--order-summary)
10A. [Buy Now → Dynamic Google Form Generation](#10a-buy-now--dynamic-google-form-generation)
11. [Dynamic Payment QR](#11-dynamic-payment-qr)
12. [Payment Verification & Security](#12-payment-verification--security)
13. [Google Sheets Order Backend](#13-google-sheets-order-backend)
14. [Project Folder Structure](#14-project-folder-structure)
15. [Build Phases](#15-build-phases)
16. [Non-Functional Requirements](#16-non-functional-requirements)
17. [Testing Checklist](#17-testing-checklist)
18. [System Architecture](#18-system-architecture)
19. [Future Roadmap](#19-future-roadmap)
20. [Definition of Done](#20-definition-of-done)

---

## 1. Project Overview

Build a premium, modern e-commerce website for **COEP Merchandise Store** — a store where students, faculty, alumni, and visitors can browse and buy official COEP merchandise.

**Core customer journey:**

```text
Browse products → Select product & quantity → Add to cart
    → Checkout → Enter customer details → Review order summary
    → Generate payment QR for exact total → Customer pays
    → Verify payment → Auto-record order (Google Sheet)
    → Show order confirmation
```

Build the storefront in **React + Vite**. Keep payment and Google integration in isolated service modules so either can be swapped out later without touching the storefront UI.

---

## 2. Tech Stack & Getting Started

| Layer | Choice |
|---|---|
| Frontend framework | React 18 + Vite |
| Routing | React Router |
| State management | React Context API (cart) |
| Styling | CSS Modules / Tailwind (either is fine — pick one and stay consistent) |
| QR generation | `qrcode.react` |
| Order backend | Google Apps Script Web App (`doPost`) |
| Order ledger | Google Sheets |
| Optional 3D | `three`, `@react-three/fiber`, `@react-three/drei` |

**Local setup:**

```bash
npm install
cp .env.example .env   # fill in your own values — see Section 12
npm run dev
```

---

## 3. Product Catalog

Store all product data in a single source file (`src/data/products.js`) — see [Section 8](#8-product-data--product-details). Prices below are illustrative starting points, not final pricing.

| Tier | Products | Category tag |
|---|---|---|
| **Everyday** | Pen, Keychain, Pouch, Diary, Exam Pad | `Everyday` / `Stationery` |
| **Mid-range** | Bottle, Phone Cover, Drafter, Calculator | `Accessories` |
| **Premium** | Umbrella, Premium Diary, Special-Edition Gift Sets | `Premium` |

**Explicitly excluded from the catalog:** Mug, Handbag, Premium Metal Bottle.

---

## 4. Visual Design System

**Direction:** premium, modern, academic, heritage-inspired, clean, spacious, professional. **Avoid:** green as a primary color, heavy gradients, glassmorphism, neon effects, or generic Amazon/Flipkart-style layouts. Do not use a COEP building photograph anywhere, including the hero — use product imagery or clean illustrations instead.

| Name | Hex | Use |
|---|---|---|
| Deep Navy | `#0B1F3A` | Primary dark / headers |
| Royal Blue | `#1557B0` | Primary brand |
| Bright Blue | `#2563EB` | Accents, CTAs |
| Soft Blue | `#EEF5FF` | Backgrounds, cards |
| White | `#FFFFFF` | Base background |
| Dark Text | `#111827` | Body copy |
| Heritage Gold *(optional)* | `#C8A45D` | Premium-tier accents only |

---

## 5. Navigation

Keep the navbar minimal, sticky, and spacious — no large multi-link menu.

```text
[ COEP MERCH STORE ]                 [ Search ] [ Cart ]
```

- **Left:** COEP emblem/logo placeholder, "COEP", "MERCH STORE"
- **Right:** Search, Cart (with item count badge), optional account icon

On mobile, collapse the wordmark to `[ COEP ]` and keep Search + Cart visible.

---

## 6. Home Page

### Hero
- **Headline:** "GEAR UP FOR A BIGGER TOMORROW."
- **Subtext:** "Official merchandise for the COEP community. Ideas. Innovation. You."
- **Buttons:** `SHOP NOW →` and `EXPLORE COLLECTION`
- Use a premium merchandise composition or clean illustration — no campus building photo.

### Search
Search is a primary homepage element, not an afterthought. Placeholder: `Search merchandise...`. It must filter results instantly, client-side, with no page reload (see [Section 8: Search](#search)).

### Category filters
`All · Everyday · Accessories · Stationery · Lifestyle · Premium`

### Featured product grid
Each card shows: image/illustration, name, category, price, stock status, wishlist icon, **Add to Cart** button.

### Promotional banner
> **CARRY THE LEGACY** — Not just merchandise. A piece of COEP with you.

### Service highlights
Fast & Reliable Delivery · Secure Payments · Official COEP Merchandise · Support Student Initiatives

### Footer
Store name, Quick Links, Support, Newsletter signup, social links, Terms / Privacy / Refund policy links.

---

## 7. Pages & Routes

Use React Router with these routes:

| Route | Page |
|---|---|
| `/` | Home |
| `/shop` | Shop (full catalog + filters) |
| `/product/:id` | Product Details |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/payment/:orderId` | Payment |
| `/order-success/:orderId` | Order Success |

---

## 8. Product Data & Product Details

### Product data schema

Never hardcode product info inside `ProductCard` or other components — always read from `src/data/products.js`:

```js
export const products = [
  {
    id: "keychain",
    name: "COEP Keychain",
    category: "Everyday",
    price: 199,
    image: "/products/keychain.png",
    description: "Premium COEP heritage keychain.",
    stock: 50,
    available: true,
  },
];
```

### Product Details page

Shows: image/illustration, name, category, price, description, stock status, quantity selector, variant/size (when applicable), **Add to Cart**, **Buy Now**.

```text
COEP KEYCHAIN
₹199
Premium COEP heritage keychain.

Quantity: [-] 1 [+]

[ ADD TO CART ]   [ BUY NOW ]
```

### Search

Client-side, real-time search across product **name, category, and description**. Must be case-insensitive and support partial matches (e.g. "diary" → COEP Diary, COEP Premium Diary), with no page reload.

---

## 9. Cart

```text
YOUR CART

COEP Pen        ₹50 × 2  = ₹100
COEP Keychain   ₹199 × 1 = ₹199
COEP Diary      ₹250 × 1 = ₹250
------------------------------
Subtotal                  ₹549
Delivery                    ₹0
TOTAL                     ₹549

[ CONTINUE SHOPPING ]   [ CHECKOUT ]
```

### Cart state (React Context API)

Manage cart state in `context/CartContext.jsx` and expose:

```js
cartItems
addToCart()
removeFromCart()
increaseQuantity()
decreaseQuantity()
clearCart()
getCartTotal()
getCartItemCount()
```

- Persist cart contents in `localStorage`.
- Block checkout when the cart is empty.
- Use one shared calculation function everywhere the total is needed:

```js
export function calculateCartTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
```

The total must stay consistent across cart → checkout → payment; never recompute it differently in each step.

---

## 10. Checkout & Order Summary

Route: `/checkout`

| Field | Required? |
|---|---|
| Name | Required |
| Mobile Number | Required |
| Email | Optional |
| COEP ID | Optional |
| Department | Optional |
| Pickup / Delivery | Optional (per store policy) |

The customer never manually types products, quantities, prices, or the total — React generates the order summary automatically from cart state:

```text
ORDER SUMMARY

COEP Pen             × 2     ₹100
COEP Keychain        × 1     ₹199
COEP Diary            × 1     ₹250
--------------------------------
TOTAL                          ₹549
```

Generate a unique order ID (e.g. `COEP-2026-0001`). For an MVP a client-side generator is fine; **for production, generate the authoritative order ID server-side** to avoid collisions and tampering.

---


## 10A. Buy Now → Dynamic Google Form Generation

**Core requirement:** When a customer clicks **BUY NOW** on a product, the application must generate/open a dedicated Google Form for that purchase flow.

The preferred flow is:

```text
Product Details
      ↓
Customer clicks BUY NOW
      ↓
React creates a unique Order ID
      ↓
React calculates product total
      ↓
React sends order draft to Google Apps Script
      ↓
Apps Script creates a Google Form for that order
      ↓
Apps Script returns the Google Form URL
      ↓
React opens the generated Google Form
      ↓
Customer enters required details
      ↓
Customer submits Google Form
      ↓
Apps Script records the order
      ↓
Payment step / payment verification
      ↓
Order confirmation
```

### Important architecture rule

Do **not** attempt to create a Google Form directly from browser-side React using private Google credentials.

The React application should call a **Google Apps Script Web App**, and Apps Script should use the Google Forms service to create the form.

```text
React
  │
  │ POST /createOrderForm
  ▼
Google Apps Script
  │
  ├── Generate Order ID
  ├── Store order draft
  ├── Create Google Form
  ├── Add customer fields
  ├── Add order information
  └── Return published form URL
          │
          ▼
       React
          │
          ▼
    Open Google Form
```

### 10A.1 What the generated form should contain

For a **Buy Now** purchase, create a form similar to:

```text
COEP MERCHANDISE STORE
────────────────────────────

Order ID: COEP-2026-0001

YOUR ORDER

COEP Keychain
Quantity: 2
Unit Price: ₹199
Total: ₹398

────────────────────────────

CUSTOMER DETAILS

Full Name *
Mobile Number *
Email
COEP ID
Department
Pickup / Delivery *

────────────────────────────

[ SUBMIT ORDER ]
```

The selected product, quantity, price, total, and Order ID are supplied by the application.

The customer should **not have to manually calculate or type the product price or total**.

### 10A.2 Do not trust product price from the browser

The frontend may send:

```json
{
  "productId": "keychain",
  "quantity": 2
}
```

The Apps Script/backend should look up the authoritative product price from its own trusted product configuration or database and calculate:

```text
unitPrice × quantity = total
```

Do not accept a browser-supplied `total` as the final payment amount.

### 10A.3 Recommended generated-form fields

The generated form should contain:

| Field | Type | Required |
|---|---|---|
| Order ID | Short answer / displayed reference | Yes |
| Customer Name | Short answer | Yes |
| Mobile Number | Short answer | Yes |
| Email | Email / short answer | Optional |
| COEP ID | Short answer | Optional |
| Department | Dropdown | Optional |
| Pickup / Delivery | Multiple choice | Yes |

The product information should preferably be displayed in the **form title/description** rather than relying on editable customer-entered fields.

Example:

```text
ORDER SUMMARY

Order ID: COEP-2026-0001

COEP Keychain × 2
₹199 × 2 = ₹398

TOTAL: ₹398
```

### 10A.4 Create the form with Google Apps Script

Create a Web App endpoint:

```js
function doPost(e) {
  const body = JSON.parse(e.postData.contents);

  if (body.action === "createBuyNowForm") {
    return createBuyNowForm(body);
  }

  return jsonResponse({
    success: false,
    error: "Unknown action"
  });
}
```

The form creation function should:

1. Validate the product ID.
2. Validate the quantity.
3. Look up the product price.
4. Calculate the total.
5. Generate a unique Order ID.
6. Save the order draft.
7. Create a Google Form.
8. Add the required customer questions.
9. Add the order summary to the form description.
10. Return the published form URL to React.

Conceptual implementation:

```js
function createBuyNowForm(data) {
  const product = getProductFromCatalog(data.productId);

  if (!product) {
    return jsonResponse({
      success: false,
      error: "Product not found"
    });
  }

  const quantity = Number(data.quantity);

  if (!Number.isInteger(quantity) || quantity < 1) {
    return jsonResponse({
      success: false,
      error: "Invalid quantity"
    });
  }

  const total = product.price * quantity;
  const orderId = generateOrderId();

  const form = FormApp.create(
    `COEP Merchandise Order — ${orderId}`
  );

  form.setDescription(
    `Order ID: ${orderId}\n\n` +
    `Product: ${product.name}\n` +
    `Quantity: ${quantity}\n` +
    `Unit Price: ₹${product.price}\n` +
    `Total: ₹${total}`
  );

  form.addTextItem()
      .setTitle("Customer Name")
      .setRequired(true);

  form.addTextItem()
      .setTitle("Mobile Number")
      .setRequired(true);

  form.addTextItem()
      .setTitle("Email");

  form.addTextItem()
      .setTitle("COEP ID");

  form.addTextItem()
      .setTitle("Department");

  form.addMultipleChoiceItem()
      .setTitle("Pickup / Delivery")
      .setChoiceValues([
        "Campus Pickup",
        "Delivery"
      ])
      .setRequired(true);

  saveOrderDraft({
    orderId,
    productId: product.id,
    productName: product.name,
    quantity,
    unitPrice: product.price,
    total,
    formId: form.getId(),
    status: "FORM_CREATED"
  });

  return jsonResponse({
    success: true,
    orderId,
    total,
    formUrl: form.getPublishedUrl()
  });
}
```

This is a **blueprint**. Adapt the exact Apps Script implementation to the chosen deployment and Google Forms configuration.

### 10A.5 React Buy Now button

The product page should call the Apps Script endpoint when the customer clicks **BUY NOW**.

Example:

```js
async function handleBuyNow(product, quantity) {
  setLoading(true);

  try {
    const response = await fetch(
      import.meta.env.VITE_APPS_SCRIPT_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
          action: "createBuyNowForm",
          productId: product.id,
          quantity
        })
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Unable to create order form");
    }

    window.location.href = result.formUrl;
  } catch (error) {
    console.error(error);
    setError("Unable to start the order. Please try again.");
  } finally {
    setLoading(false);
  }
}
```

### 10A.6 Buy Now loading state

When the customer clicks:

```text
[ BUY NOW ]
```

change it to:

```text
[ CREATING ORDER FORM... ]
```

Disable the button while the request is running.

If creation fails:

```text
Unable to create the order form.
[ TRY AGAIN ]
```

Do not open a blank Google Form.

### 10A.7 Buy Now vs Add to Cart

Both flows must be supported.

#### Buy Now

```text
Product
  ↓
BUY NOW
  ↓
Create one-product order
  ↓
Generate Google Form
  ↓
Open Google Form
```

#### Add to Cart

```text
Product
  ↓
ADD TO CART
  ↓
Continue shopping
  ↓
Cart
  ↓
Checkout
  ↓
Generate one Google Form for the complete cart
```

This prevents a customer buying five different products from receiving five separate forms.

### 10A.8 Google Form submission handling

The form submission should be connected to Apps Script.

Use an installable **form-submit trigger** or another controlled Apps Script workflow to process the submitted response.

The handler should:

1. Identify the Order ID.
2. Retrieve the stored order draft.
3. Retrieve customer details from the form response.
4. Combine customer details + product details.
5. Write the complete order to Google Sheets.
6. Mark the order as `FORM_SUBMITTED`.
7. Start the payment flow or direct the customer to the payment page.

Conceptual flow:

```text
Google Form submitted
        ↓
Apps Script trigger
        ↓
Read Order ID
        ↓
Load saved order draft
        ↓
Read customer answers
        ↓
Combine data
        ↓
Write Orders sheet
        ↓
Payment Pending
```

### 10A.9 Payment placement

For the cleanest e-commerce flow, use:

```text
BUY NOW
   ↓
Generated Google Form
   ↓
Customer Details
   ↓
Submit
   ↓
Payment Page
   ↓
Dynamic QR
   ↓
Payment Verification
   ↓
Order Confirmed
```

The exact payment amount must come from the trusted order record:

```text
Order ID: COEP-2026-0001
Total: ₹398
        ↓
QR amount = ₹398
```

Never calculate a different amount on the payment page.

### 10A.10 Important Google Forms limitation

Google Forms is not a full e-commerce checkout system.

A dynamically generated form can collect customer information and display order information, but it should not be treated as the trusted source of:

```text
price
stock
payment status
order status
```

Those values should come from the application/backend order record.

Also, a Google Form question generally remains editable by the respondent. Therefore, do **not** rely on an editable "Price" or "Total" question as proof of the actual amount. Keep the authoritative order data in the backend/order ledger.

### 10A.11 Form cleanup

If a new Google Form is generated for every Buy Now click, the Google Drive account can accumulate many forms.

Implement a cleanup strategy.

Store:

```text
formId
orderId
createdAt
formUrl
status
```

After the order is completed or cancelled, the form can be archived/deleted according to the store's retention policy.

For a larger production store, consider using **one reusable Google Form template + prefilled order references** instead of creating a brand-new Form for every transaction.

---

## 11. Dynamic Payment QR

**Core feature — never use one hardcoded QR for every order.** The QR must always encode the customer's exact order total.

```text
Pen × 2 = ₹100, Keychain × 1 = ₹199, Diary × 1 = ₹250  → TOTAL = ₹549 → QR amount = ₹549
Bottle × 1 = ₹499, Umbrella × 1 = ₹699                  → TOTAL = ₹1198 → QR amount = ₹1198
```

### MVP implementation

Construct a UPI payment URI from configurable merchant details and the live order total, then render it with `qrcode.react`:

```js
const upiUrl =
  `upi://pay?pa=${UPI_ID}&pn=${PAYEE_NAME}` +
  `&am=${total.toFixed(2)}&cu=INR&tr=${orderId}`;
```

```text
PAYMENT

Order ID: COEP-2026-0001
Amount Payable: ₹549

[ QR CODE ]

Scan using a supported UPI app (GPay, PhonePe, Paytm, BHIM, etc.)
UPI ID: yourmerchant@upi
Payment Status: WAITING FOR PAYMENT
```

Keep `UPI_ID` and `PAYEE_NAME` configurable via environment variables — never hardcode them.

---

## 12. Payment Verification & Security

### Critical rule

**Never mark an order as paid just because the customer clicks "I HAVE PAID."** A frontend button click is not proof of payment.

**MVP flow** (manual, acceptable for a college prototype):

```text
QR → Customer pays → Customer enters UTR / transaction reference
   → Admin verifies manually → Order marked PAID
```

**Production flow** (required for a live store):

```text
Create order → Payment gateway generates dynamic QR/UPI → Customer pays
   → Gateway sends webhook → Backend verifies Order ID + Amount + Currency + Status
   → Order marked PAID
```

Never trust the frontend alone for `price`, `total`, `stock`, `payment status`, or `order status` — always recompute and verify these server-side before marking an order PAID.

### Environment variables

Create `.env.example`:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_UPI_ID=YOUR_PUBLIC_UPI_ID
VITE_PAYEE_NAME=COEP Merchandise
```

**Never** put secret payment keys, webhook secrets, database admin credentials, or OAuth refresh tokens into `VITE_*` variables — anything prefixed `VITE_` is bundled into the public frontend.

### Duplicate submission protection

Disable submit buttons while a request is in flight, and use the order ID as an idempotency key on the backend so the same order can't be recorded twice.

```js
if (isSubmitting) return;
setIsSubmitting(true);
```

---

## 13. Google Sheets Order Backend

After trusted payment verification, the order is recorded automatically — no manual data entry, and the customer never re-enters product details React already has.

```text
Payment verified → Order sent to Apps Script → Apps Script writes row to Google Sheet
   → Order confirmation shown to customer
```

### Apps Script Web App

```text
apps-script/
└── Code.gs
```

```js
function doPost(e) {
  // 1. Receive order payload (JSON)
  // 2. Validate the request (shape, required fields, idempotency key)
  // 3. Append a row to the Orders sheet
  // 4. Return a JSON success/failure response
}
```

Do not put payment-provider secret keys inside the React app — keep all secrets in Apps Script's script properties or the backend that calls it.

### `Orders` sheet columns

`Timestamp · Order ID · Customer Name · Mobile · Email · COEP ID · Department · Products · Subtotal · Delivery Charge · Total · Payment Status · Transaction ID · Order Status · Pickup/Delivery`

### Order status values

MVP: `PENDING · PAID · PROCESSING · COMPLETED · CANCELLED`
Full set (future): add `PAYMENT_PENDING · READY_FOR_PICKUP · REFUNDED`

### Order Success page

Route: `/order-success/:orderId`

```text
✓ ORDER CONFIRMED

Thank you for shopping with COEP Merchandise Store.

Order ID: COEP-2026-0001
Payment: PAID
Total: ₹549

[ CONTINUE SHOPPING ]
```

Only show this confirmed state **after** the verification/recording step has actually completed — never optimistically.

---

## 14. Project Folder Structure

```text
src/
├── assets/
├── components/
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── CategoryFilter.jsx
│   ├── CartItem.jsx
│   ├── OrderSummary.jsx
│   ├── PaymentQR.jsx
│   ├── FeatureCard.jsx
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Payment.jsx
│   └── OrderSuccess.jsx
├── context/
│   └── CartContext.jsx
├── data/
│   └── products.js
├── services/
│   ├── paymentService.js
│   └── orderService.js
├── utils/
│   ├── cart.js
│   ├── orderId.js
│   └── formatCurrency.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 15. Build Phases

| Phase | Scope |
|---|---|
| **1 — UI** | Navbar, Hero, Search, Categories, Product Cards, Cart, Checkout, Payment UI, Success page, Footer. Use mock data. |
| **2 — Store functionality** | Filtering, live search, cart state, quantity controls, total calculation, `localStorage`, routing. |
| **3 — Order flow** | Customer details form, order summary, unique order ID, payment page. |
| **4 — Dynamic QR** | Exact-amount calculation → UPI payment URI → QR render → display amount + order ID. Start with a safe test/demo flow. |
| **5 — Google integration** | Buy Now → Apps Script creates the Google Form → customer submits details → Apps Script records the order in Google Sheets. |
| **6 — Production payment** | Only after Phases 1–5 work end-to-end: integrate a real payment gateway with server-side webhook verification. |

---

## 16. Non-Functional Requirements

### Responsive design
Support desktop, laptop, tablet, and mobile. Product grid: **4–6 cards** desktop, **2–3** tablet, **2** mobile.

### Loading & error states
Never leave the customer on a blank screen. Cover at minimum:

```text
Loading products...
Cart is empty.
Product is out of stock.
Payment is being verified...
Payment verification failed.
Order submission failed.
```

### Accessibility
Sufficient color contrast against the Soft Blue / White backgrounds, keyboard-navigable cart and checkout forms, alt text on all product images, and visible focus states on interactive elements.

### SEO & performance
Descriptive page titles and meta descriptions per route, compressed product images (WebP where possible), and lazy-loading for off-screen product images.

---

## 17. Testing Checklist

**Products:** products load · search works · category filter works · product details work · add to cart works

**Cart:** multiple products work · quantity update works · remove works · total is correct · `localStorage` persists

**Checkout:** required fields validate · order ID generated · product info populates automatically · total matches cart

**QR:** QR generates · QR amount matches total · different carts produce different amounts · order reference is correctly associated

**Payment:** pending state works · success state only shows after verification · failed payment handled · frontend cannot falsely mark payment as successful

**Google integration:** Apps Script receives the order · Sheet row is created · products, total, and payment reference are all correct

---

## 18. System Architecture

```text
                         COEP MERCH STORE
                          (React + Vite)
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                   ▼
           Search             Products              Cart
                                                       │
                                                       ▼
                                                   Checkout
                                                       │
                                                       ▼
                                              Customer Details
                                                       │
                                                       ▼
                                                   Order ID
                                                       │
                                                       ▼
                                          Dynamic Payment QR
                                                       │
                                                       ▼
                                                Customer Pays
                                                       │
                                                       ▼
                                          Payment Verification
                                                       │
                                                       ▼
                                          Google Apps Script
                                                       │
                                                       ▼
                                              Google Sheet
                                                       │
                                                       ▼
                                          Order Confirmation
```

---

## 19. Future Roadmap

**Admin dashboard** *(not required for MVP)*: Products, Inventory, Orders, Payments, Customers, Analytics — with an order table of `Order ID | Customer | Amount | Payment | Status | Date`.

**Optional 3D product viewer** for select SKUs (Keychain, Bottle, Premium gift box, Phone Cover) using `three` + `@react-three/fiber` + `@react-three/drei`. Keep this optional so it never blocks the core shopping flow.

**Other post-MVP features:** wishlist, product reviews, discount coupons, limited-edition drops, inventory alerts, order tracking, email/WhatsApp confirmations, campus pickup slots, alumni & department collections, event merchandise, automatic invoicing, refund workflow.

---

## 20. Definition of Done

The MVP is complete when a customer can:

1. Open the store and search for merchandise.
2. Browse by category and open a product.
3. Select a quantity and click **BUY NOW**.
4. The Buy Now action calls Apps Script and creates/returns an order-specific Google Form URL.
5. The generated Google Form displays the selected product/order summary and collects the customer's required details.
6. The customer submits the generated Google Form without manually re-entering product price or total.
7. The order is recorded with a unique Order ID.
8. For cart checkout, multiple products can be included in one order with the correct running total.
9. See a payment QR generated for the **exact** trusted order amount.
10. Complete payment and have it properly verified (not just self-declared).
11. Have the final order automatically recorded in the Google Sheet.
12. See an order confirmation page.

---

## Final Priorities

```text
Excellent e-commerce UX → Fast product discovery → Simple cart → Accurate total
   → Exact-amount payment QR → Trusted payment verification
   → Automatic Google order record → Clear confirmation
```

Keep the navbar minimal, keep the interface premium in blue/white, make search prominent, support multiple products per order, and keep payment and Google integrations isolated behind service modules so either can be replaced later without rewriting the storefront.
