# Chefs in the Kitchen — Website

A modern, **professional dark-theme** 3-page website for **Chefs in the Kitchen** — a **private chef service in Burlington, ON**. A chef comes to your home, shops, cooks a restaurant-quality meal, and cleans up.

Self-contained static site (no build step, no framework), themed to match the brand logo (black · red · white).

---

## Pages

| Page | File | Purpose |
|------|------|---------|
| **Home** | `index.html` | How it works, experiences, about, testimonials, gallery |
| **Services** | `services.html` | Detailed packages, inclusions, process, filterable sample menu |
| **Book** | `book.html` | Multi-step booking form, FAQ, contact |

### Interactive features
- Sticky header that hides on scroll-down / reveals on scroll-up
- Scroll-reveal animations + animated stat counters
- Testimonial carousel, photo lightbox, menu category filter, FAQ accordion
- **Multi-step booking form** with a live per-guest estimate that composes a ready-to-send **email inquiry** (works with zero backend)
- Floating "Book Your Chef" button, back-to-top, toasts
- Fully responsive + `prefers-reduced-motion` support
- **No rotating "solar-system" hero** — a clean, professional framed hero instead

---

## Run locally

Plain HTML/CSS/JS — open `index.html`, or serve the folder:

```bash
python -m http.server 5180     # then visit http://localhost:5180
# or: npx serve .
```

---

## Customize

### Contact details
Business email / phone / socials live in **`js/main.js`** (`CONFIG`) and each page's
header, footer and JSON-LD. Currently uses the placeholder **hello@chefsinthekitchen.ca**
— replace with the real inbox before launch.

```js
const CONFIG = {
  email:    "hello@chefsinthekitchen.ca",  // where booking inquiries are sent
  phone:    "",                             // add a number to show phone links
  facebook: "https://www.facebook.com/chefsinthekitchen.official/",
  website:  "https://chefsinthekitchen.ca",
  endpoint: ""                              // optional POST URL (Formspree / CRM)
};
```

**Booking form:** submitting composes a pre-filled email to `CONFIG.email` — no server
needed. Set `CONFIG.endpoint` to also push leads to a CRM/inbox
(e.g. [Formspree](https://formspree.io)).

### Brand
- Logo: `assets/logo-mark.png` — the real Facebook logo with its black background keyed
  to transparent (white + red preserved), so it sits cleanly on the dark UI. The header
  pairs it with a spelled-out **name lockup**.
- Palette: red `#E23A2E`, near-black `#0F0F11`, charcoal surfaces, white/cream text.
- Type: *Playfair Display* (display) + *Inter* (UI).

### Photos & placeholders
- The site uses **real sample food photography** in `assets/photos/` (dark, on-theme).
  These are royalty-free stock placeholders — swap them for the client's own photos any
  time by replacing the files (keep the same filenames) or updating the `<img>` references.
- **Placeholder content to confirm before launch:** email, phone, menu/package prices
  (sample), testimonials (replace with real client reviews), and the sample photos.

---

## Deploy
Any static host: **Vercel**, **Netlify**, or **GitHub Pages** (Settings → Pages →
deploy from `main` / root). No environment variables required.
