# Taste Vault

**Inspiration in, vocabulary out.** A local, zero-build design-taste gallery that turns screenshots of sites you love into objective design vocabulary, clustered collections, and paste-ready briefs for Codex, Claude Code and other coding assistants.

Built as the companion tool for the video **[Turn Claude Into A Design GENIUS In 3 Simple Steps](https://youtu.be/7FU98O0JLHs)**. This repo ships with my real vault — 46 entries across 12 collections plus my House DNA — so you can see the whole system working before you replace my taste with yours.

![Example hero asset generated from a vault image recipe](generated/stillness-voxel-hero-2k.png)

---

## From references to an original design

The repo now includes **Reference to Design**, a reusable skill and prompt pack developed through the Vantage landing-page study.

**Three directions → pick one → three variations → refine.**

Once you choose a composition, an optional [polish studio](skills/reference-to-design/references/polish.md) lets you compare Original, Restrained and Expressive presets, tune individual details, and save a clean preview. The [prompt pack](skills/reference-to-design/references/prompts.md) includes the exact prompt for this stage.

- [Copy-and-paste prompts](skills/reference-to-design/references/prompts.md): exact reusable wording for planning, building, refining and correcting results.
- [Install and use the skill](docs/reference-to-design.md): use it with your chosen design guidance or the model's own judgment.
- [Example brief and video sequence](examples/vantage.md): a fictional AI financial research product's marketing page.
- [Optional skill comparison](skills/reference-to-design/references/comparison.md): matched inputs and limitations when comparing treatments.

Browse several actual reference screenshots, identify recurring visual principles, and decide what to carry over and what to invent for your product. Build three comparable directions, select one, then explore variations inside that aesthetic. One direction is enough if you have already settled on it.

The aim is a recognizable design family with an independent subject and composition. Avoid transferring the source's subject, layout, palette and focal placement together. Also avoid reducing the collection to a vague style label that yields a generic page.

The gallery's vocabulary and image recipes are starting points. Open the screenshots themselves and adapt the recipes to the new product; swapping one source object for a similar object may still be too literal. Keep website text, controls and product data in live UI. Image generation and static mockups are optional, depending on the visual question you need to resolve.

The reference library, prompts and skill are included in this repo. The twenty-output development study is a separate local experiment; viewers can follow the smaller workflow above.

---

## Quick start

```bash
git clone https://github.com/cth9191/taste-vault.git
cd taste-vault
python server.py --port 4610   # or serve.bat on Windows
# open http://127.0.0.1:4610
```

No build step or third-party dependencies. The interface uses vanilla HTML, CSS and JavaScript; the server uses the Python standard library. A static server supports browsing, but **Add reference** requires `server.py` to save screenshots and update the library.

**For ingesting your own screenshots** you additionally need:

- [Node.js](https://nodejs.org) (the ingest script)
- [Claude Code](https://claude.com/claude-code) CLI on your PATH (the vision extraction runs through `claude -p`)

---

## Using the vault in a project

1. Browse **All references** or choose a collection. Search titles, notes and vocabulary; sort by newest or name.
2. Open a screenshot to inspect its composition, vocabulary and image recipe. Use **Zoom in** to view the original at full size.
3. Select up to three references and **Compare** them side by side. **Copy combined brief** includes every selected screenshot path and its design notes.
4. Paste the brief into your coding assistant, fill in your project, audience and required content, then build and iterate.

**Copy design brief** creates a single-reference brief. Expand **Image recipe** to copy an artwork prompt with composition guidance. Briefs work with Codex or other coding assistants and do not require a particular design skill or image-generation provider.

**My preferences** controls whether general House DNA is included (off by default). Project notes take priority over general preferences. These settings and your comparison selection are saved in this browser.

Use **Add reference** to save a PNG, JPEG or WebP screenshot (up to 20 MB), title and collection. Notes, vocabulary and an image recipe can be entered manually; omitted vocabulary and recipes inherit the collection defaults. This form does not run automatic vision analysis. The original image is copied into `images/` and its metadata is saved in `data/gallery.json`.

## Ingesting your own inspiration

```bash
node ingest.js "C:\path\to\screenshot.png" [more paths...]
```

Each image is copied into `images/`, run through `claude -p` vision extraction, and merged into `data/gallery.json` — assigned to an existing collection, or seeding a **new** collection when it genuinely fits none. Refresh the page after.

## Making it yours

The repo ships with my taste as a working demo. To start your own vault:

1. Open `data/gallery.json`
2. Set `meta.owner` to your name. When run with `server.py`, copied reference paths automatically use this checkout's `images/` directory. With a generic static server, paths are relative by default; set `meta.imagesPath` to your own absolute image directory if you need briefs to resolve from another project.
3. Either keep my collections as starting points, or reset: set `"entries": []` and `"collections": []`, then rewrite `dna.constants` and `dna.never` for your own eye — the never-list matters as much as the constants
4. Delete my screenshots from `images/` if you want a clean slate, then ingest your own

Editing `data/gallery.json` by hand is always fine — it's the source of truth. Re-cluster by changing an entry's `collection`.

`data/styles.json` powers the **Style guide** view: the standard aesthetic families of the modern web (editorial minimalism, warm editorial, brutalism, …), each with recognition cues, vocabulary, canonical example sites, and its own COPY BRIEF button — borrowed language for looks your own inspo doesn't cover yet.

## Structure

```
index.html          # interface markup
styles.css          # responsive gallery and dialogs
app.js              # browsing, comparison, briefs and upload form
specimens.js        # 18 visual style specimens
specimens.css       # specimen styling
server.py           # localhost static server and image-saving API
data/gallery.json   # entries + collections + House DNA — the taste database
data/styles.json    # reference aesthetic families of the modern web
images/             # slugged screenshot copies (the demo seed set)
generated/          # example hero assets produced from image recipes
ingest.js           # claude -p vision extraction pipeline
serve.bat           # Windows one-click server
skills/reference-to-design/ # installable workflow + prompt pack
examples/vantage.md # portable product brief and video sequence
docs/reference-to-design.md # skill installation and usage
```

## Data model

- **entry** — one screenshot → `id, file, title, collection, family, vocabulary[], note, imageRecipe, heroUsage, added`
- **collection** — a deployable look → `vocabulary` block, `deployFor`, `risk` suggestion, `accent`, collection-level `imageStyle` template
- **dna** — `constants[]` + `never[]`, optionally included via My preferences

## License

MIT — see [LICENSE](LICENSE). The screenshots in `images/` are of third-party websites, included as personal design references; all rights to those designs remain with their creators. Swap them for your own inspiration.
