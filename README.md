# Mangalore datasets

Public civic-data views for Mangaluru, Dakshina Kannada, and nearby Karnataka areas.

This repository is a community effort to collect public records, clean them into reusable files, and publish simple charts or record explorers that are easier to read than scattered PDFs, tables, and source pages. The site is intentionally plain: the goal is to help people inspect local data, check sources, and understand caveats.

Open the site: [mangalore-oss.github.io](https://mangalore-oss.github.io/)

## What we are building

- Public-facing visualizations for local datasets.
- Clean CSV and JSON files that can be inspected without special tools.
- Source manifests and quality notes so claims can be checked.
- Lightweight static pages that can run on GitHub Pages.

This is not an official government release. It is a public-interest data project built from public sources, with limitations documented alongside the data.

## Current views

### Birth and death rates

Interactive chart for birth rates, death rates, and the gap between them for Mangaluru, Dakshina Kannada, and nearby comparator areas.

- View: [`visualization/birth-death-mangalore/`](visualization/birth-death-mangalore/)
- Data: [`data/birth-death-statistics/`](data/birth-death-statistics/)
- Scope: 2001 to 2024 Karnataka Civil Registration System annual reports.

### Mangaluru in the news

Story-style explorer for public news records about Mangaluru, Dakshina Kannada, and nearby coastal Karnataka.

- View: [`visualization/mangalore-in-the-news/`](visualization/mangalore-in-the-news/)
- Scope: 21,615 deduplicated public news records, with charts by time, topic, source, and checked map points.
- Note: These are news records, not police, hospital, traffic, or rainfall records.

### Smart City tenders

Searchable public-safe extract of Mangaluru Smart City tender, project, work-order, document, and source-reference records.

- View: [`visualization/smart-city-tenders/`](visualization/smart-city-tenders/)
- Data: [`data/smart-city-tenders/`](data/smart-city-tenders/)
- Scope: selected public-record corpus around Mangaluru Smart City and related public works.

## Repository layout

```text
index.html                         Main landing page
visualization/                     Published chart and explorer pages
data/                              Public CSV, JSON, manifests, and notes
assets/                            Shared CSS and UI state helpers
scripts/dev-server.mjs             Small local static server
```

## Run locally

No build step is required.

```bash
node scripts/dev-server.mjs
```

The server prints a local URL, usually `http://127.0.0.1:4173/`.

## Data principles

- Keep source links near the data.
- Mark extraction problems instead of hiding them.
- Avoid claims the source files do not support.
- Prefer public-safe, portable files over private local traces.
- Make charts readable first, then keep raw files available for audit and reuse.

## Contributing

Useful contributions include source checks, corrections, better documentation, additional public datasets, accessibility fixes, and clearer visual explanations. When adding data, include the source, access date, known caveats, and any transformation steps needed to reproduce the public file.
