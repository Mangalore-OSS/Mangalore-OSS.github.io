# Mangalore Smart City Tender And Project Records

This folder contains a public-safe extract of Mangaluru Smart City tender, project, document, work-order, BOQ, and source-reference records.

The data is meant for browsing and analysis. It does not prove tender winners unless a table explicitly says that field is verified. In this release, public party leads are included as leads only; they are not verified successful-bidder names.

## Files

- `project_index.csv` - one row per project or opportunity, joined with work-order, document, event, party-lead, and completion indicators.
- `opportunities.csv` - project and opportunity facts from the processed tender release.
- `work_orders.csv` - work-order amounts, dates, completion dates, and status text where available.
- `boq_totals.csv` - best available BOQ total per project.
- `timeline_events.csv` - tender and project lifecycle events extracted from the source records.
- `public_party_leads.csv` - public party or agency names found in sources; not verified tender winners.
- `award_closure_dossiers.csv` - field-level checks for what can and cannot be claimed from the current release.
- `documents.csv` - public document URLs and parse counts; local filesystem paths are removed.
- `source_records.csv` - source record inventory with public URLs and source notes; raw payloads and private trace hashes are removed.
- `dashboard_projects.json` - compact JSON used by the dashboard.
- `manifest.json` - release summary and caveats.

## Current Scope

- 34 project or opportunity rows
- 1,109 source records
- 529 document records
- 22 projects with work-order amounts
- 6 projects with actual completion dates in the joined work-order data
- 0 projects with verified successful-bidder names in the official award join

## Caveats

- This is a selected public-record corpus around Mangaluru Smart City and related public works. It is not a complete list of every tender in Mangaluru.
- Public party names are retained when they appear in source material, but they should not be treated as tender winners unless a verified award source says so.
- Source URLs and document URLs are kept where available. Raw downloaded PDFs and local extraction files are not included here.
