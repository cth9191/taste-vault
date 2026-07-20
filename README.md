# Taste Vault

Personal design-taste gallery. Inspiration in, vocabulary out.

Screenshots get broken into objective design vocabulary, clustered into **collections** (distinct looks you deploy per-project) over shared **house DNA** (constants + never-list). Each collection compiles to a paste-ready brief block for Claude Code.

## Run

```
serve.bat          # http://localhost:4610
```

(or `python -m http.server 4610` / any static server — fetch() needs http, not file://)

## Ingest new inspo

```
node ingest.js "C:\Users\Chase\OneDrive\Pictures\Screenshots\Screenshot ....png"
```

Multiple paths accepted. Each image is copied to `images/`, run through `claude -p` vision extraction (title, family, 5-8 vocabulary terms, stealable-idea note), and assigned to an existing collection — or seeds a NEW collection when it fits none. Refresh the page after.

## Use in a project

1. Open the gallery, pick the collection matching the project's soul
2. **COPY BRIEF BLOCK** — assembles: collection vocabulary + reference entries + house DNA + never-list + one-risk suggestion
3. Paste at the top of your Claude Code prompt

## Structure

```
index.html          # the app (vanilla, no build)
data/gallery.json   # entries + collections + DNA — the taste database
images/             # slugged screenshot copies
ingest.js           # claude -p vision extraction pipeline
```

## Data model

- **entry**: one screenshot → id, file, title, collection, family, vocabulary[], note, added
- **collection**: a deployable look → vocabulary block, deployFor, risk suggestion, accent
- **dna**: constants[] + never[] appended to every brief

Editing `data/gallery.json` by hand is fine — it's the source of truth. Re-cluster by changing an entry's `collection`.

## Origin

Built 2026-07-20 as the Way-1 demo for the taste video. Seed data: 19 screenshots, 6 collections. See vault note `inbox/research/2026-07-20-chase-taste-profile-extraction.md`.
