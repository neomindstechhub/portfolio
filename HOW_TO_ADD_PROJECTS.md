# How to Add Projects to the Portfolio

## 1. Where to place images

Put your project images here:

```
portfolio/
  public/
    images/
      portfolio/     <-- Put your images here
```

**Examples:**
- `public/images/portfolio/my-project-hero.jpg`
- `public/images/portfolio/healthcare-ai.png`

**In the code**, reference them with a path starting with `/images/portfolio/`:

- `/images/portfolio/my-project-hero.jpg`
- `/images/portfolio/healthcare-ai.png`

You can also use **external URLs** (e.g. Unsplash, your CDN) — put the full URL in `imageUrl`.

---

## 2. Where to add the content

Edit this file:

**`src/data/projects.ts`**

Add a new object to the `projects` array. Copy an existing project and change the fields.

### Field guide

| Field | Where it appears | Example |
|-------|------------------|--------|
| **id** | Unique number (1, 2, 3…) | `6` |
| **slug** | URL path (no spaces, use hyphens) | `"my-new-project"` → page at `/my-new-project` |
| **title** | Card title + detail page heading | `"My New Project"` |
| **brand** | Subtitle / category (e.g. industry) | `"Healthcare"` or `"FinTech"` |
| **shortDescription** | Text on the **carousel card** (keep it short) | 1–2 sentences |
| **imageUrl** | Card and detail page hero image | `/images/portfolio/my-project.jpg` or full URL |
| **tags** | Shown on card and detail page | `["AI", "Python", "Healthcare"]` |
| **videoUrl** | (Optional) Shown on **detail page** only | `"https://www.youtube.com/embed/VIDEO_ID"` |
| **longDescription** | (Optional) Full text on **detail page** | Multiple sentences or paragraphs |
| **technologies** | (Optional) List on detail page | `["Python", "TensorFlow", "AWS"]` |
| **outcomes** | (Optional) Bullet list on detail page | `["40% faster", "99% accuracy"]` |

---

## 3. Example: adding a new project

**Step 1:** Add image (optional if you use an external URL)

- Save image as `public/images/portfolio/retail-ai.jpg`

**Step 2:** In `src/data/projects.ts`, add:

```ts
{
  id: 6,
  slug: "retail-demand-forecasting",
  title: "Retail Demand Forecasting",
  brand: "Retail",
  shortDescription:
    "AI demand forecasting for a retail chain. Reduced stockouts by 25% and cut excess inventory by 30%.",
  imageUrl: "/images/portfolio/retail-ai.jpg",
  tags: ["Retail", "Forecasting", "Time Series", "Python"],
  videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID",
  longDescription:
    "Full description of the project for the detail page. How you built it, what the client needed, and the impact.",
  technologies: ["Python", "Prophet", "Scikit-learn", "AWS"],
  outcomes: [
    "25% reduction in stockouts",
    "30% cut in excess inventory",
    "Rolled out to 200+ stores",
  ],
},
```

**Step 3:** Save the file. The new project will:

- Appear in the **carousel** on the home page
- Have its own **detail page** at `yoursite.com/retail-demand-forecasting`

---

## 4. Checklist

- [ ] Image in `public/images/portfolio/` (or use external URL)
- [ ] New entry in `src/data/projects.ts` with unique `id` and `slug`
- [ ] `slug` is URL-friendly (lowercase, hyphens, no spaces)
- [ ] `shortDescription` is short (for the card)
- [ ] Optional: `videoUrl`, `longDescription`, `technologies`, `outcomes` for the detail page

That’s it. No other files need to be changed.
