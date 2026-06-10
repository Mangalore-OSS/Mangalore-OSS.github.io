# Birth and Death Statistics

Clean public-facing CSV files derived from Karnataka Civil Registration System annual birth and death reports.

This first dataset covers Mangaluru City, Dakshina Kannada, and selected comparator districts and city/town units in Karnataka. It is intended to be easy to inspect, cite, and analyze with portable source references.

## Files

The root CSV files contain the complete dataset.

| File | Purpose |
| --- | --- |
| `births.csv` | Annual birth counts and rates by geography, area type, and CRS table basis. |
| `deaths.csv` | Annual death counts and rates by geography, area type, and CRS table basis. |
| `source_manifest.csv` | Portable source references for each annual CRS PDF source. |
| `quality_flags.csv` | Known extraction issues to account for during analysis. |
| `data_dictionary.csv` | Column-level definitions for the public CSV files. |
| `summary.json` | Machine-readable dataset scope, row counts, and file map. |

## Subsets

For easier use, the same birth and death files are also split into geography-focused folders:

| Folder | Contents |
| --- | --- |
| `dakshina-kannada/` | Dakshina Kannada district and Mangaluru City rows. |
| `surrounding-districts-and-towns/` | Comparator district and town rows from surrounding/coastal Karnataka areas. |

Each subset folder contains `births.csv`, `deaths.csv`, `quality_flags.csv`, and `summary.json`. The shared source and column reference files remain at the dataset root: `source_manifest.csv` and `data_dictionary.csv`.

## Scope

- Years: 2001 to 2024.
- Primary geographies: Mangaluru City and Dakshina Kannada.
- Comparator geographies: selected surrounding districts and selected city/town units.
- CRS table bases: place of occurrence and place of residence.
- Area types: rural, urban, and total where reported by the source tables.

## Source References

Each row in `births.csv` and `deaths.csv` has a `source_id`. Join that value to `source_manifest.csv` to find the annual report title, source URL, original source URL, source PDF filename, file size, access date, and license note.

The public CSVs use portable source references so the files can be cited and reused outside this repository.

## Quality Notes

This is a PDF-derived public data extract, not an official machine-readable CRS release. Some rows have extraction issues, especially where the death-side portion of a source table was not fully extracted. Those rows are marked with `quality_flag` in the data files and described in `quality_flags.csv`.

Rates are included only when available in the source extract. Missing rates or missing exact coordinates do not necessarily make a row unusable; the geography name and level are preserved so analyses can still work at the appropriate level of precision.

## About Scripts

No rebuild script is included in this first public version because the useful public artifact is already the cleaned CSV set. A script would be useful later if we want the public repository to regenerate these files from raw extracted CRS tables, audit changes over time, or document the full transformation process in executable form.
