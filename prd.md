# Build Prompt: EduSoft Healthcare Corporate Website

## Project Brief

Design and build a premium, production-ready corporate website for **EduSoft Healthcare**, a global healthcare technology company specializing in medical imaging hardware, dental imaging, printing solutions, and diagnostic AI software.

The site must feel like it belongs to a serious, established international healthcare technology company — think Siemens Healthineers, GE Healthcare, or Fujifilm Healthcare — not a startup landing page or an animation showcase.

**Priority order (in case of any tradeoff):**
UX → Clarity → Trust → Performance → Visual Quality → Animation

---

## Design Direction

- Clean healthcare-tech aesthetic: premium typography, generous whitespace, strong visual hierarchy
- Subtle gradients, refined card components, precise spacing/grid system
- Real healthcare/product imagery (or clearly labeled high-quality placeholders) — no generic stock-photo feel
- Purposeful micro-interactions and smooth transitions; motion should support usability, never distract from it
- Explicitly avoid: excessive 3D, particle effects, neon/glow effects, cinematic scroll-jacking, or anything that feels like a design portfolio piece rather than an enterprise product
- Fully responsive across mobile, tablet, and desktop
- WCAG 2.1 AA accessibility: semantic HTML, proper contrast ratios, keyboard navigation, ARIA labels, focus states, alt text
- SEO-friendly structure: proper heading hierarchy, meta tags, structured data (Organization/Product schema), clean URLs

---

## Global Navigation

Persistent navbar with:
- Home
- About Us
- Portfolio
- Support
- News
- Careers
- Contact
- Language switcher: **English (default)**, 日本語 (Japanese), Français (French), 中文 (Chinese), 한국어 (Korean)

Requirements:
- Sticky/smart-hide on scroll (subtle, not jarring)
- Mobile: clean hamburger menu with smooth slide/fade transition
- Language switcher should be architected for real i18n (not just UI dressing) — structure content so translated strings can be swapped via a locale file/i18n framework

---

## Homepage Structure

Build the homepage as a sequence of purposeful sections, each earning its place:

1. **Hero**
   - Exceptionally strong first impression: bold typography, real product/healthcare imagery, refined composition, subtle depth (parallax or layered scroll at most — nothing heavier)
   - Clear value proposition + primary CTA (e.g., "Explore Our Solutions") + secondary CTA (e.g., "Contact Sales")
   - Should communicate credibility and scale within 3 seconds of viewing

2. **About EduSoft** — concise company overview, global presence, mission/credibility signals (certifications, years in business, markets served)

3. **Portfolio Preview** — curated highlight of product categories, linking to full Portfolio page

4. **Healthcare Solutions** — how EduSoft's products solve real clinical/operational problems, organized by use case or care setting

5. **Why EduSoft** — differentiators (quality, compliance/regulatory certifications, global support, innovation, AI capabilities)

6. **Impact** — metrics/stats (countries served, installations, clinics supported, awards) presented cleanly, not gimmicky

7. **Latest News** — 3–4 featured articles/press releases with dates, linking to full News page

8. **Careers Teaser** — brief culture/mission hook, link to full Careers page

9. **Contact CTA** — closing section driving toward Contact page or inquiry form

---

## Portfolio / Product Discovery

Build a dedicated **Portfolio** page with strong product-discovery UX:

**Categories & Products:**
- **Surgical Imaging** — FPD C-Arm
- **Dental Imaging** — RVG Sensor
- **Printers & Media** — X-Ray Printer, X-Ray Film
- **Software & AI** — PACS/RIS, Image Acquisition Software, TB Screening AI
- **Accessories** — Radiation Protection, X-Ray Accessories

Requirements:
- Filterable/browsable category navigation (sidebar, tabs, or filter chips)
- Product cards with image, name, short description, category tag
- Each product links to a **dedicated Product Detail page** with: hero image/gallery, specifications, key features, clinical use cases, downloadable resources (brochure/spec sheet placeholder), and a "Request a Quote / Contact Sales" CTA
- Search functionality across the product catalog
- Structure the data model so products/categories can scale without redesigning the page (i.e., driven by a JSON/CMS-like data source, not hardcoded markup)

---

## Additional Pages

- **About Us** — full company story, leadership, global offices, certifications/compliance, mission & values
- **Support** — product support resources, documentation/downloads, FAQ, contact-support form, service request flow
- **News** — full press release/news archive with filtering by date/category, individual article pages
- **Careers** — open positions (list/filter by department & location), company culture content, application CTA
- **Contact** — global contact form, regional office listings/map, department-specific contact routing (Sales, Support, Media)

---

## Technical Requirements

- Component-based architecture (React or similar) with reusable UI primitives (buttons, cards, section wrappers, nav)
- i18n-ready content structure (all copy externalized from components)
- Performance budget: fast initial load, lazy-loaded images, optimized asset delivery, minimal layout shift
- Scalable folder/data architecture so new products, news items, and job listings can be added without code changes to layout components
- Clean, documented code suitable for handoff to a production engineering team

---

## Tone of Voice

Professional, precise, confident — the language of a company that manufactures and supports medical-grade equipment used by clinicians. Avoid hype language ("revolutionary," "game-changing") in favor of clarity, evidence, and trust-building specificity.


# Product Requirements Document (PRD)
## EduSoft Healthcare — Corporate Website

**Version:** 1.0
**Status:** Draft for Review
**Document Owner:** Product/Marketing
**Last Updated:** [Insert Date]

---

## 1. Overview

### 1.1 Purpose
EduSoft Healthcare requires a new corporate website to serve as the primary digital touchpoint for clinicians, hospital procurement teams, distributors, job candidates, press, and investors globally. The current/proposed site must establish EduSoft as a credible, world-class healthcare technology company and drive measurable business outcomes: product inquiries, quote requests, support resolution, and qualified job applications.

### 1.2 Background
EduSoft Healthcare manufactures medical imaging hardware (surgical and dental), printing/media solutions, diagnostic and workflow software (including AI), and imaging accessories. The company operates internationally and requires multilingual support (English, Japanese, French, Chinese, Korean) to serve its existing and target markets.

### 1.3 Goals
- Establish trust and credibility befitting an international medical device company
- Provide an intuitive, discoverable product catalog across 5 major categories
- Generate qualified leads (quote requests, distributor inquiries, support tickets)
- Support global hiring through a clear Careers experience
- Be fast, accessible, and SEO-performant across all supported locales
- Create a scalable content architecture that marketing/ops can maintain without engineering involvement for routine updates (news, jobs, products)

### 1.4 Non-Goals
- This is not an e-commerce platform — no direct online purchasing/checkout
- Not a patient-facing consumer product (audience is clinical, procurement, and B2B)
- Not a design showcase — cinematic/heavy 3D animation is explicitly out of scope

---

## 2. Target Audience & Personas

| Persona | Description | Primary Needs |
|---|---|---|
| **Hospital Procurement Lead** | Evaluates imaging equipment vendors for purchase | Product specs, certifications, compare options, request a quote |
| **Clinician / Radiologist** | Researches product capabilities and clinical fit | Clinical use cases, image quality/spec detail, software workflow |
| **Distributor / Regional Partner** | Seeks partnership or product sourcing info | Company credibility, regional contact, partnership inquiry path |
| **Existing Customer (Support)** | Needs documentation, troubleshooting, or service | Fast access to manuals, FAQs, support ticket submission |
| **Journalist / Press** | Researches company news and announcements | Press releases, company facts, media contact |
| **Job Candidate** | Evaluates EduSoft as an employer | Open roles, culture, application process |
| **Investor / Partner (secondary)** | Assesses company scale and credibility | Impact metrics, global presence, leadership |

---

## 3. Success Metrics (KPIs)

| Metric | Target / Notes |
|---|---|
| Quote/Inquiry form completions | Track by product category and region |
| Support ticket submissions via site | Reduce email/phone-only support volume |
| Job application starts via Careers page | Track by department/region |
| Organic search traffic (per locale) | Baseline + growth target post-launch |
| Core Web Vitals (LCP, CLS, INP) | LCP < 2.5s, CLS < 0.1, INP < 200ms on 4G |
| Accessibility conformance | WCAG 2.1 AA — zero critical violations (axe/Lighthouse) |
| Bounce rate on Hero/Homepage | Benchmark against industry (healthcare B2B avg) |
| Language-switch usage | Signal for locale prioritization |

---

## 4. Information Architecture

```
Home
├── About Us
│   ├── Company Overview
│   ├── Leadership
│   ├── Global Offices
│   └── Certifications & Compliance
├── Portfolio
│   ├── Surgical Imaging → FPD C-Arm [Product Detail]
│   ├── Dental Imaging → RVG Sensor [Product Detail]
│   ├── Printers & Media → X-Ray Printer [Product Detail], X-Ray Film [Product Detail]
│   ├── Software & AI → PACS/RIS [Product Detail], Image Acquisition Software [Product Detail], TB Screening AI [Product Detail]
│   └── Accessories → Radiation Protection [Product Detail], X-Ray Accessories [Product Detail]
├── Support
│   ├── Documentation / Downloads
│   ├── FAQ
│   └── Contact Support (form)
├── News
│   └── [Article Detail Pages]
├── Careers
│   ├── Open Positions (filterable)
│   └── [Job Detail / Application]
└── Contact
    ├── General Inquiry Form
    ├── Regional Offices
    └── Department Routing (Sales / Support / Media)
```

Global elements: Navbar (persistent), Language Switcher (5 locales), Footer (sitemap, legal, social, regional selector), Cookie/Privacy Consent (region-aware).

---

## 5. Functional Requirements

### 5.1 Navigation & Global Shell
- **FR-1:** Sticky navbar with smart-hide-on-scroll-down / reveal-on-scroll-up behavior
- **FR-2:** Mobile navigation via accessible hamburger menu (keyboard + screen-reader operable)
- **FR-3:** Language switcher supporting English (default), Japanese, French, Chinese, Korean; persists selection via URL locale path (e.g., `/ja/portfolio`) and/or cookie
- **FR-4:** Footer includes full sitemap, legal links (Privacy Policy, Terms, Cookie Policy), social links, regional contact shortcut

### 5.2 Homepage
- **FR-5:** Hero section with headline, subheadline, primary CTA, secondary CTA, and real product/healthcare imagery
- **FR-6:** Sequential sections: About EduSoft → Portfolio Preview → Healthcare Solutions → Why EduSoft → Impact (stats) → Latest News (3–4 cards) → Careers teaser → Contact CTA
- **FR-7:** All homepage CTAs route to correct destination pages/anchors
- **FR-8:** Impact/stats section pulls from a maintainable data source (not hardcoded numbers requiring redeploys for updates, ideally)

### 5.3 Portfolio & Product Detail
- **FR-9:** Category-based browsing (5 categories as defined) via filter chips, tabs, or sidebar
- **FR-10:** Product search across catalog (name, category, keyword)
- **FR-11:** Product card shows: image, name, category tag, short description, "View Details" link
- **FR-12:** Product Detail page includes: image/gallery, overview, key features, specifications table, clinical use case description, downloadable resources (brochure/spec sheet), "Request a Quote" CTA
- **FR-13:** Product/category data driven by structured data source (JSON/CMS) to support scaling without layout rework
- **FR-14:** Related products shown on each Product Detail page (same category)

### 5.4 About Us
- **FR-15:** Company overview, mission/values, leadership bios, global office listing (map or list), certifications/compliance badges (e.g., ISO, CE, FDA — placeholder until confirmed by legal/regulatory)

### 5.5 Support
- **FR-16:** Searchable FAQ
- **FR-17:** Documentation/downloads library (filterable by product)
- **FR-18:** Support contact form with product/category selection and file attachment capability
- **FR-19:** Confirmation state/email on ticket submission

### 5.6 News
- **FR-20:** News/press release archive with date and category filtering
- **FR-21:** Individual article detail pages with share links and related articles
- **FR-22:** RSS or sitemap feed for news content (SEO)

### 5.7 Careers
- **FR-23:** Job listing page filterable by department and location
- **FR-24:** Job detail page with description, requirements, and application CTA (external ATS link or embedded form — to be confirmed)
- **FR-25:** Culture/values content module

### 5.8 Contact
- **FR-26:** General inquiry form with department routing (Sales / Support / Media / Partnerships)
- **FR-27:** Regional office listing with address, phone, and (optional) embedded map
- **FR-28:** Form validation, spam protection (e.g., reCAPTCHA), and success/error states

### 5.9 Internationalization
- **FR-29:** All UI strings and content externalized into locale files (no hardcoded copy in components)
- **FR-30:** Locale-aware routing, date/number formatting, and right-to-left readiness assessment (not required for listed languages, but architecture should not block future RTL locales)
- **FR-31:** Fallback to English for any untranslated content, with clear content-ops workflow for translation updates

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **NFR-1:** Lighthouse Performance score ≥ 90 on key pages (Home, Portfolio, Product Detail)
- **NFR-2:** Images lazy-loaded and served in modern formats (WebP/AVIF) with responsive srcset
- **NFR-3:** No render-blocking animation or asset that delays Largest Contentful Paint

### 6.2 Accessibility
- **NFR-4:** WCAG 2.1 AA compliance across all pages
- **NFR-5:** Full keyboard operability, visible focus states, semantic landmarks, alt text on all meaningful imagery
- **NFR-6:** Color contrast ratios verified across all themes/locales

### 6.3 SEO
- **NFR-7:** Server-rendered or statically generated HTML (not client-only rendering) for crawlability
- **NFR-8:** Per-page meta titles/descriptions, Open Graph tags, and structured data (Organization, Product schema)
- **NFR-9:** hreflang tags across all locale variants
- **NFR-10:** XML sitemap per locale

### 6.4 Security & Compliance
- **NFR-11:** All forms protected against spam/bot submission
- **NFR-12:** GDPR-compliant cookie consent for EU visitors; regional privacy compliance as applicable (e.g., data handling disclosures)
- **NFR-13:** HTTPS enforced; no mixed content

### 6.5 Maintainability & Scalability
- **NFR-14:** Component-based, reusable UI architecture
- **NFR-15:** Content for Products, News, and Jobs managed via structured data source/CMS, editable without engineering changes to layout code
- **NFR-16:** Codebase documented sufficiently for handoff to an ongoing engineering/maintenance team

---

## 7. Design Requirements
(Summary — full detail in companion design brief)

- Clean healthcare-tech visual language: premium typography, generous whitespace, refined cards, subtle gradients
- Motion limited to purposeful micro-interactions and light depth (e.g., layered scroll); explicitly excludes heavy 3D, particles, neon/glow, or scroll-jacking
- Real product/healthcare imagery prioritized over generic stock photography
- Fully responsive: mobile, tablet, desktop breakpoints validated
- Priority order for any design/engineering tradeoff: **UX → Clarity → Trust → Performance → Visual Quality → Animation**

---

## 8. Content Requirements

| Content Type | Owner | Notes |
|---|---|---|
| Product specs, imagery, brochures | Product/Regulatory team | Must be legally reviewed before publish (medical device claims) |
| Company/leadership bios, office list | Corporate Comms | |
| Certifications & compliance copy | Regulatory/Legal | Required before launch — high sensitivity for medical device marketing |
| News/press releases | Corporate Comms | Ongoing cadence post-launch |
| Job listings | HR/Talent | Likely synced from ATS |
| Translations (5 locales) | Localization team/vendor | Full parity required for launch locales; process defined for ongoing updates |

**Note:** Any clinical or performance claims about medical devices (e.g., diagnostic accuracy of TB Screening AI) must be reviewed by Regulatory/Legal prior to publication to ensure compliance with applicable medical device advertising regulations in each target market.

---

## 9. Assumptions & Open Questions

- [ ] Confirm hosting/CMS approach: headless CMS vs. fully custom data layer for Products/News/Jobs
- [ ] Confirm ATS integration for Careers (embedded application vs. external redirect)
- [ ] Confirm which regulatory certifications/badges are approved for display, per region
- [ ] Confirm analytics stack (e.g., GA4, or privacy-focused alternative) and consent requirements per region
- [ ] Confirm translation vendor/workflow and whether all 5 locales launch simultaneously or phased
- [ ] Confirm whether Support includes a customer login/portal in scope or is fully public-facing
- [ ] Confirm quote-request form routes to CRM (e.g., Salesforce/HubSpot) vs. email-only in v1

---

## 10. Out of Scope (v1)

- E-commerce/online purchasing
- Customer/partner authenticated portal
- Live chat / chatbot support (may be a fast-follow)
- Investor relations micro-site (financial reporting, SEC filings) beyond basic company credibility content

---

## 11. Milestones (Indicative)

| Phase | Deliverable |
|---|---|
| Discovery | Finalized IA, content inventory, regulatory review kickoff |
| Design | Wireframes → high-fidelity design system → stakeholder sign-off |
| Content | Copywriting, translation, product data finalized |
| Build | Component development, CMS/data integration, i18n wiring |
| QA | Accessibility audit, performance audit, cross-browser/device testing, localization QA |
| Launch | Phased rollout (e.g., English first, additional locales following) |
| Post-Launch | Analytics review, iteration backlog, News/Careers content cadence established |

---

## 12. Appendix

- Companion document: *EduSoft Healthcare Website — Design & Build Prompt* (visual/UX direction)
- Related: Portfolio product list (Surgical Imaging, Dental Imaging, Printers & Media, Software & AI, Accessories) — see Section 4 for full breakdown