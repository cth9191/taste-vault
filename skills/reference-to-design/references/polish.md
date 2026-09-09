# Optional finishing studio

Use this stage after the user chooses a composition and asks for motion, premium details, or interactive tweaking. It is not required for every design task. Keep the chosen product story and aesthetic; do not restart exploration.

## Preserve and isolate

Keep the chosen original and earlier comparison pages addressable. Create a separate polish page with independent copies of changing assets/styles. Record the source version or hash. An Original preset must actually disable added effects and restore the baseline styling, not approximate it with quieter settings.

## Choose a small set of meaningful additions

Inspect the chosen page and suggest additions that suit its visual logic. Examples: a short entrance sequence, responsive diagram annotations, consistent button/focus/pressed states, restrained section reveals, or one distinctive closing graphic. Static hierarchy, spacing and legibility still need to carry the page when motion is off.

Tie expressive details to the brand or product narrative. In the Vantage example, a wireframe city relates to the financial-district hero. This is not a generic requirement to add a city, glowing line, large wordmark, cursor effect or 3D object to other sites.

If current inspiration is requested, inspect relevant first-party examples and separate sourced observations from your own proposed treatments. Do not turn a trend list into an implementation checklist.

## Panel and presets

Offer useful presets such as:

- **Original:** unchanged chosen design.
- **Restrained:** subtle motion and interaction refinements.
- **Expressive:** stronger choreography and a signature visual treatment.

Presets should set real editable values, not merely relabel the same output. Controls should map to actual implemented behavior. Group the parameters that materially help this design: typography/spacing, image treatment, motion/timing, interaction details, and any optional signature component. Do not add nonfunctional switches or expose implementation jargon to the user.

For an expanded studio, use collapsible groups with live value/unit readouts. A useful menu is typography and spacing; hero treatment and crop; existing graphic details; color and buttons; motion; and a signature footer. Adapt the controls to the chosen design. See the [finishing-studio prompt](prompts.md#optional-a-finishing-studio-with-presets) for concrete examples without making every example mandatory.

Offer a small set of available typefaces; only expose weights that the loaded fonts support. Label viewport-specific settings and disable or hide irrelevant controls. Appearance should update live; entrance timing needs a replay action. Show when a preset has custom changes. Keep the panel keyboard usable and independently scrollable, with a clear way to hide it on mobile.

Include compare-original/restore, replay entrance, reset-to-preset, and hide/show panel. For recording or reuse, support saving settings and a clean preview carrying the chosen values. Explain whether Save uses local browser storage, changes source files, or produces a portable artifact. Never imply localStorage publishes or permanently implements a final design.

When export/import is useful, include a versioned settings object and validate its fields and ranges. When adding controls, supply compatible defaults for older records or explicitly migrate their version. Loading malformed data should preserve the current working settings and give a clear error. A clean preview must retain custom settings, not silently revert to a preset. Keep a path back to the panel.

## Motion behavior

The page should be immediately usable. Do not add a blocking preloader merely to stage an entrance. Prefer bounded, intentional movement and meaningful feedback; continuous motion needs a reason. Keep content readable and controls operable with motion off, reduced-motion preferences, or unavailable enhancement scripts.

Use the available frontend tools. Native CSS, SVG and browser animation APIs can cover many finishing details; do not add a large dependency solely because it is associated with premium sites. Add specialized tools when the requested effect needs them.

Cancel or finish previous animations when replaying or changing settings. Repeated replay must not stack effects. Pause or avoid off-screen work where appropriate. Respect reduced-motion changes while the page is open. Ensure an off switch covers added hover and scroll movement as well as the opening animation.

## Verify and finish

Verify that controls change the intended rendered property or behavior, not just their labels or internal state. Check the preset modes, representative range extremes and typeface choices, compare/restore, replay, reset, save/reload, clean preview and any export/import round trip. Inspect desktop, an intermediate width and mobile. Verify that controls do not block the page permanently on small screens. Check reduced motion and the original page's actual product interactions.

Compare at the same viewport width; opening a side panel can itself change the responsive layout. Keep the earlier versions unchanged. Distinguish a tested design sandbox from a production build or completed browser-independent accessibility audit.

After the user chooses the final settings, apply those values to a separate finished page without the tweak UI. Preserve the studio and earlier stages for comparison. Do not choose the final preset or publish a finished site on the user's behalf when they are still experimenting.
