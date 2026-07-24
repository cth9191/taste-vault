#!/usr/bin/env node
/**
 * Taste Vault ingest — screenshot in, vocabulary out.
 *
 * Usage:
 *   node ingest.js "C:\path\to\screenshot.png" [more paths...]
 *
 * For each image:
 *   1. Copies it into ./images/<slug>.png
 *   2. Spawns `claude -p` (vision) to extract title/family/vocabulary/note
 *      and assign an existing collection OR propose a new one
 *   3. Merges the result into data/gallery.json
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DATA_PATH = path.join(ROOT, "data", "gallery.json");
const IMAGES_DIR = path.join(ROOT, "images");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node ingest.js "C:\\path\\to\\screenshot.png" [more...]');
  process.exit(1);
}

const gallery = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "entry";
}

function extract(imagePath, collectionsSummary) {
  const prompt = `Read the image at this exact path: ${imagePath}

You are an expert UI designer cataloging a personal taste gallery. Analyze this website screenshot and return ONLY a JSON object (no markdown fences, no commentary) with this shape:
{
  "title": "short site/brand name visible or descriptive name",
  "family": "aesthetic family, e.g. 'warm editorial x print DNA'",
  "vocabulary": ["5-8 objective design-vocabulary terms an expert would use: texture treatments, type moves, color logic, layout devices, marginalia"],
  "note": "one sentence: the single most stealable idea in this design",
  "imageRecipe": "an image-generation prompt that would recreate this design's hero/background image STYLE with the subject swapped out: describe treatment, texture, palette, lighting, composition and negative space precisely, and write the subject as a bracketed slot like [SUBJECT: original subject here]. If the design has no meaningful hero image, use null.",
  "heroUsage": "one sentence describing exactly how the hero image sits in THIS layout - full-bleed vs isolated-on-white vs split-panel vs dimmed-behind-UI, which zones stay empty for text, where nav/CTAs overlap. Null if no hero image.",
  "collection": "<one of: ${collectionsSummary} | or 'NEW'>",
  "newCollection": { "id": "kebab-id", "name": "Name", "description": "...", "deployFor": "...", "vocabulary": ["..."], "risk": "one bold move suggestion", "accent": "#hex", "imageStyle": "generalized [SUBJECT] image-style template for this collection" }
}
Rules: vocabulary must be objective and promptable (usable in a design brief), not opinions. The imageRecipe must be usable directly in an image generator (Higgsfield gpt_image_2) - style locked, subject swappable. Write it as a full-bleed hero-background composition (camera inside the scene, edges bleeding off-frame, explicit negative space for a headline) - never an isolated 3D asset, sticker, or turntable product render. If color IS the style, use a "STRICT palette:" clause listing allowed colors and explicit exclusions. Only use "NEW" + newCollection if the screenshot genuinely fits none of the existing collections. Return raw JSON only.`;

  const out = execFileSync("claude", ["-p", prompt, "--output-format", "text"], {
    encoding: "utf8",
    timeout: 180000,
    windowsHide: true,
  });
  const jsonMatch = out.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in claude output:\n" + out.slice(0, 500));
  return JSON.parse(jsonMatch[0]);
}

const collectionsSummary = gallery.collections.map((c) => c.id).join(" | ");
const today = new Date().toISOString().slice(0, 10);

for (const src of args) {
  if (!fs.existsSync(src)) {
    console.error(`✗ Not found: ${src}`);
    continue;
  }
  console.log(`→ Extracting: ${path.basename(src)}`);
  let result;
  try {
    result = extract(src, collectionsSummary);
  } catch (err) {
    console.error(`✗ Extraction failed for ${src}: ${err.message}`);
    continue;
  }

  let id = slugify(result.title);
  let n = 2;
  while (gallery.entries.some((e) => e.id === id)) id = `${slugify(result.title)}-${n++}`;
  const file = `${id}.png`;
  fs.copyFileSync(src, path.join(IMAGES_DIR, file));

  let collectionId = result.collection;
  if (collectionId === "NEW" && result.newCollection) {
    const nc = result.newCollection;
    if (!gallery.collections.some((c) => c.id === nc.id)) {
      gallery.collections.push(nc);
      console.log(`  + New collection seeded: ${nc.name}`);
    }
    collectionId = nc.id;
  }
  if (!gallery.collections.some((c) => c.id === collectionId)) {
    if (gallery.collections.length === 0) {
      gallery.collections.push({
        id: "unsorted", name: "Unsorted",
        description: "Entries awaiting a real collection.",
        deployFor: "", vocabulary: [], risk: "", accent: "#C15F3C", imageStyle: "",
      });
      console.warn(`  ! Empty vault — seeded an "unsorted" collection`);
      collectionId = "unsorted";
    } else {
      console.warn(`  ! Unknown collection "${collectionId}" — filing under first collection`);
      collectionId = gallery.collections[0].id;
    }
  }

  gallery.entries.push({
    id,
    file,
    title: result.title,
    collection: collectionId,
    family: result.family,
    vocabulary: result.vocabulary,
    note: result.note,
    added: today,
    ...(result.imageRecipe ? { imageRecipe: result.imageRecipe } : {}),
    ...(result.heroUsage ? { heroUsage: result.heroUsage } : {}),
  });
  console.log(`  ✓ ${result.title} → ${collectionId} [${result.vocabulary.length} terms]`);
}

fs.writeFileSync(DATA_PATH, JSON.stringify(gallery, null, 2));
console.log(`\nSaved ${DATA_PATH} — ${gallery.entries.length} entries, ${gallery.collections.length} collections.`);
