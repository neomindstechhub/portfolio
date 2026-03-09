# Google Search Console Setup

Google Search Console helps you monitor how your portfolio appears in Google Search and improve visibility.

## What it does for you

| Feature | Benefit |
|--------|---------|
| **Performance** | See clicks, impressions, CTR, and average position for your pages |
| **Indexing** | Check which pages are indexed; fix crawl errors |
| **Sitemaps** | Submit `sitemap.xml` so Google discovers all project pages faster |
| **Keywords** | Discover which search terms drive traffic (e.g. "AI portfolio", "NeoMinds") |
| **Coverage** | Find broken or blocked pages |
| **Mobile** | Spot mobile usability issues that affect ranking |

## How to add it

### 1. Go to Search Console

- Visit [search.google.com/search-console](https://search.google.com/search-console)
- Sign in with your Google account

### 2. Add your property

- Click **Add property**
- Choose **URL prefix**
- Enter: `https://portfolio.neomindstechhub.com`
- Click **Continue**

### 3. Verify ownership

**HTML file method** (already set up): The file `public/googleb89c45a079f04390.html` is included. Deploy and click **Verify** in Search Console.

**HTML tag method** (alternative): Add `<meta name="google-site-verification" content="YOUR_CODE" />` to `index.html` `<head>`

### 4. Submit your sitemap

- After verification, go to **Sitemaps**
- Enter: `sitemap.xml`
- Click **Submit**

Your sitemap is at: `https://portfolio.neomindstechhub.com/sitemap.xml`

## Tips

- **Index coverage:** Use "URL Inspection" to request indexing for new project pages.
- **Performance:** Data usually appears within a few days.
- **Queries:** Review top queries to refine your meta descriptions and keywords.
