# 🏛️ Vanguard | High-End Interior Architecture

> **"Rejecting the mundane. Embracing the profound."**

Vanguard is a cinematic, mobile-first landing page designed for a premier interior design firm. The project focuses on high-end motion choreography, "Ethereal Glass" aesthetics, and a modular architectural foundation built for maximum visual impact.

---

## ✨ Project Vision

Vanguard is designed to feel like a premium editorial magazine. It utilizes **asymmetrical grid layouts**, **mechanical layering**, and **physics-based motion** to create a digital environment that feels as meticulously crafted as the physical spaces it showcases.

---

## 🛠️ Technical Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Animation:** [GSAP](https://greensock.com/gsap/) (ScrollTrigger, Context API)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Smooth Scrolling:** [Lenis](https://github.com/darkroomengineering/lenis)
- **Deployment:** Vercel (Configured for high-performance asset delivery)

---

## 🏗️ Architectural Features

### 🎞️ Cinematic Hero
A pinned scroll experience where a focal video element expands to a full-screen background, transitioning into a word-by-word highlighted philosophy statement using GSAP's precision timing.

### 🖼️ Double-Bezel Framing
All core imagery uses a custom "Double-Bezel" design system—a nested shell-and-core structure with reactive `ring-1` and `inset shadow` layers that create a machined, physical appearance.

### 🍱 Signature Services (Horizontal Triptych)
A parallax-driven services section that collapses into a vertical row layout on mobile. Implements **Touch-First Activation** (tap-to-reveal) for accessibility on tablets and mobile devices while maintaining smooth hover states for desktop.

---

## 📂 Project Structure

```text
src/
├── app/               # Next.js App Router (Layouts, Pages)
├── components/        # Shared UI components (Button, SmoothScroll, Navbar)
├── sections/          # Content sections (Hero, SignatureServices, Testimonials)
└── lib/               # Utilities and Shared Animation logic

public/
├── home/              # Hero, Philosophy, and Service assets
└── Gallary/           # Portfolio/Gallery assets
```

---

## 🚀 Roadmap

### Phase 1: Foundation (Completed)
- [x] Cinematic Hero & Philosophy Split
- [x] Signature Services Triptych (Responsive)
- [x] Performance Audit (LCP & Image Optimization)
- [x] Asset Reorganization & Path Management

### Phase 2: Content & Detail (Current)
- [/] Testimonials Section (Cinematic Entrance)
- [ ] Portfolio Gallery (Asymmetrical Bento Grid)
- [ ] About Page (Z-Axis Cascade)

### Phase 3: Engagement
- [ ] Contact Page (Double-Bezel Form)
- [ ] Project-Specific Case Study Pages
- [ ] SEO & Social Meta Tag Finalization

---

## ⌨️ Development

First, run the development server:

```bash
npm run dev
```

The site will be live at `http://localhost:3000`.

---

© 2026 Vanguard Studio. Designed with Intent.

