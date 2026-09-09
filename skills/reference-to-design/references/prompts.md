# Copy-and-paste prompts

These are reusable prompts written for this workflow, not verbatim transcripts of the Vantage experiment. Replace bracketed fields. Use only the stages you need. The prompts also work without installing the skill; omit its invocation in tools that do not support skills.

## 1. Set the brief and inspect the references

```text
Use $reference-to-design.

We are building [page type] for [product], which helps [audience] do
[job or outcome]. The primary action is [CTA]. Required content is
[sections and facts]. Build with [stack or use the existing project].
This is [frontend prototype / production scope].

My reference collections are [paths, attachments or URLs for each direction].
Open multiple actual images from each collection. You can choose a
representative set; I do not need to pick an exact screenshot for you.

First give me three compact direction cards. For each, identify the
references inspected, recurring visual principles, what you will carry
over, and what subject and composition you will invent for our product.
Point out any reference access limitations. Do not build yet.
```

The first prompt deliberately stops at direction cards for a short planning or video segment. If you want a single uninterrupted build, replace the final sentence with: "Then build the three directions using the scope below" and append prompt 2.

## 2. Build three different directions

```text
Build the three directions from those cards. Use [the model's own design
judgment / my chosen design skill: NAME] consistently for all three.

Keep the same product, core copy, claims, primary action and functional
scope. Build [hero plus one product-proof section / complete landing page].
The product UI is supporting evidence; this assignment is the marketing
landing page, not the dashboard itself.

Use the screenshots for design principles. Invent the imagery and page
composition for our company. Check that you have neither copied a source's
signature subject-and-layout combination nor lost the collection's character.
Choose code-first or original image assets according to what each direction
needs. Keep text, controls and data live in the final frontend.

Show the three in one comparison with links to full-size previews. Inspect
desktop and mobile renders and check the included interactions. Record the
references, translation decisions and exact image prompts. Then let me choose.
```

## 3. Refine the winner within the same aesthetic

```text
I choose direction [NAME]. Keep its aesthetic, product story, palette family
and core asset concept. Preserve this version, then make three variations
within that direction.

Give each a clear compositional idea: for example, a different headline
hierarchy, a different image/text balance, or a different placement of
product proof. Choose changes that suit this direction rather than applying
those examples mechanically. Keep the content and scope comparable.

Explain the main difference in each variation and show them together.
Check desktop and mobile. Do not introduce three new aesthetics.
```

## 4. Finish the selected variation

```text
Use variation [NAME]. Preserve its defining composition and refine it into
[final page scope]. My feedback is [specific changes].

Tighten typography, spacing, image crops and responsive behavior. Complete
the included navigation, calls to action and product interactions. Use
motion only where it helps, respecting reduced-motion preferences.
If useful, add a temporary tweak panel for [specific properties] so I can
compare values; keep it out of the final visitor experience.

Inspect the final renders and verify the working flow. Summarize the material
changes and any remaining limitations. Save the chosen design decisions.
```

## Optional: a finishing studio with presets

Use this after choosing a composition. Replace `[VERSION]` with its name or URL. The control groups below are a starting menu; the agent should adapt them to your design.

```text
I choose [VERSION]. Preserve that original and all previous comparisons.
Build a separate polish studio with a live preview and a robust, collapsible
tweak panel. Keep the chosen composition, product story and aesthetic.
Use the project's existing stack and our current design approach.

Add Original, Restrained and Expressive presets with meaningful differences.
Original must restore the unchanged chosen design. Each preset should set
real values I can then edit individually; show when I've customized a preset.

Give me a useful range of controls organized into these groups, adapting the
examples to this page:

- Typography and layout: a small selection of suitable available typefaces,
  headline weight, scale, line height and letter spacing; section spacing.
- Hero imagery: brightness, contrast, saturation, crop position, zoom and
  hero height. Keep text and controls independent of image adjustments.
- Graphic details: controls for the visual system this design actually uses.
  For a technical aesthetic, that might be grid pattern, cell size, intensity,
  annotation bracket size and accent-rule thickness. Choose equivalent
  details for other aesthetics rather than adding an unrelated grid.
- Color and buttons: accent color, button corners and relevant hover,
  focus and pressed treatments. Keep labels legible across color changes.
- Motion: off/subtle/expressive, entrance style (such as rise, fade or slide),
  travel distance, duration and stagger, plus individual switches for the
  opening sequence, section reveals and interaction feedback.
- Signature footer: original and enhanced treatments that fit this product,
  with useful graphic size, detail and animation controls. For a wireframe
  illustration, these might include line weight, glow and window details;
  do not force that graphic onto a different brand.

Every control must visibly affect its intended property. Show current values
and units. Use useful ranges, explain desktop-only controls, and disable or
hide settings that do not apply (for example, weight on a fixed-weight font).
The panel should be keyboard usable, scroll independently, and collapse on
small screens so I can inspect the page. Avoid controls added just for count.

Include compare-original/restore at the same preview width, replay entrance,
preview/jump to the signature footer, reset-to-preset, and hide/show panel.
Save custom settings and restore them on reopening. Include versioned JSON
export/import and a clean preview that retains the current custom values,
with a way back to the panel. Clearly explain where Save stores settings;
saving a browser preset does not apply a final design to source or publish it.
Keep older saved settings usable when adding controls, and reject invalid
imports without losing the current working settings.

Apply appearance changes live; use replay to review entrance timing.
Keep the page immediately usable, respect reduced motion and cancel prior
animations when replaying or changing settings. Motion Off must suppress
added movement. Keep the original page's navigation and product demo working.

Inspect desktop, intermediate and mobile renders. Verify controls against
actual rendered styles/behavior, representative range extremes and font
choices, presets, compare/restore, replay, reset, save/reload, import/export,
clean preview and reduced motion. Fix clipping, overlap or broken controls.

Open the studio and summarize what's available. Let me choose final settings
before applying them to a separate finished page without the tweak UI.
```

Read [the finishing-stage guidance](polish.md) for implementation and verification details. This is optional; a settled page may only need a small direct polish pass.

## Repair: too close to a reference

```text
This result is too close to [REFERENCE], especially [subject/composition].
Re-open the reference and our actual render. Identify the combination that
makes them feel too similar. Keep [principles we like], but propose and
implement a new product-relevant subject and composition. A similar object
in a different color is not enough. Preserve the old version for comparison.
```

## Repair: too generic or far from the collection

```text
The result lost the character of [COLLECTION]. Re-open several screenshots
and compare them with our actual render. Identify three concrete principles
we missed, such as image scale, type hierarchy, density or material.
Restore those principles while preserving our own subject and composition.
Explain the changes in terms of the visible evidence.
```

## Optional image-only art direction

```text
Create one original website artwork for [PRODUCT/PROMISE].
Use the attached [REFERENCE FILENAMES] only for these observed qualities:
[LIGHT / MATERIAL / SCALE / ATMOSPHERE].

New subject: [PRODUCT-RELEVANT CONCEPT].
Composition: [FOCAL LOCATION, CAMERA, NEGATIVE SPACE, LIGHT DIRECTION].
Palette: [COLORS]. Intended image container: [ASPECT RATIO / CROP NEEDS].
Mobile crop must retain [FOCAL ELEMENT].

Do not reproduce [SOURCE SUBJECTS] or their distinctive arrangement.
Output artwork only, with no website text, navigation, buttons, logos,
dashboard or fabricated product data. Those will be implemented in HTML.
```

## Optional static mockups before code

```text
Before coding, make three static visual proposals for [DIRECTIONS], using
the same product brief and reference-translation decisions. These are
composition proposals, not working pages. Keep essential copy consistent.
Show all three and let me choose. After selection, implement the chosen
direction with live text and controls, and verify responsive behavior.
```

Use this when composition or imagery is the unresolved question. It adds a stage; it is not a guaranteed speed improvement.

## Lightweight design record

```markdown
# Design record
## Brief
Product / audience / page type / primary action / scope / fixed claims:
## References inspected
Source or local filename / direction / observed evidence:
## Direction cards
Name / carry over / invent / avoid repeating / build scope:
## Asset decisions
Purpose / tool used / input references / exact prompt / output path:
## Selection and revision
Chosen direction / chosen variation / user feedback / changes / prior version:
## Verification
Viewport sizes / visual findings / interactions checked / remaining limitations:
```
