# Reference to Design

A small skill and a practical prompt sequence for turning visual references into original frontend designs.

**Three directions → choose one → three variations → refine.**

After choosing a composition, the optional [finishing studio](../skills/reference-to-design/references/polish.md) adds Original, Restrained and Expressive presets, individual tweak controls, replay, compare, saved settings and a clean preview. Preserve earlier stages so the process stays reviewable.

Use one direction when you already know what you want. The workflow is independent of any particular visual style, reference library, frontend stack or image provider. It can accompany a design skill you choose, or the model's own design judgment.

## Start here

1. Define what you are building, who it serves and the main action.
2. Supply multiple screenshots or accessible reference collections.
3. Have the agent inspect the images and explain what it will carry over and invent.
4. Build three comparable directions, then select one.
5. Explore three variations within that aesthetic and finish the winner.

Use the [copy-and-paste prompts](../skills/reference-to-design/references/prompts.md) with or without installing the skill. Start with the [Vantage example brief](../examples/vantage.md) for the video exercise, or substitute your own product.

The central judgment is the balance between family resemblance and independent design. References should supply visible principles such as type scale, whitespace, material and image hierarchy. The product should supply the subject, message and composition. Merely changing the color of the reference's signature picture is rarely enough.

## Install the skill

Copy the entire `skills/reference-to-design` folder into your agent's skills directory. For a standard local Codex setup, that is `~/.codex/skills/reference-to-design` (`%USERPROFILE%\.codex\skills\reference-to-design` on Windows). Use your configured skills directory if it differs. Start a new task if the current task has not discovered the newly added skill.

Then ask:

```text
Use $reference-to-design to build three landing-page directions for my
product using these screenshot collections. Inspect the actual images,
carry over their design principles, and invent our own imagery and composition.
```

The skill uses whatever image viewing, browser, coding and optional image-generation tools are available. It does not install other skills or require access to Taste Vault. If references are inaccessible, it should tell you rather than pretend it inspected them.

## Skill or prompts?

The skill keeps the method available across tasks. The prompts make each stage explicit for viewers and give you direct control over where to stop. Both encode the same process; neither guarantees identical generated output.

Image mockups are optional. Start in code when real typography, layout and product proof are the main decisions. Generate art or mockups when they resolve an actual visual question. Final website controls and content should be live UI.

## Comparing design skills

The twenty-option Vantage study is an exploratory example, not the recommended default or evidence of a universally best skill. See [comparison guidance](../skills/reference-to-design/references/comparison.md) for matched inputs, isolated contexts and honest limits.

This repository includes the Taste Vault gallery and its reference screenshots alongside the reusable workflow and fictional brief. Screenshot rights remain with their creators, as noted in the root README. Third-party design skills and the twenty-page local development study are not bundled.

## Improve it through use

When a result misses, save the brief, references inspected, actual render and specific failure. Adjust the narrow instruction that would have changed the decision. Useful failures include a dashboard built instead of a landing page, a generic result from unread references, an overly literal subject/layout combination, and refinements that drift into unrelated aesthetics. Do not grow the skill into a list of universal bans based on one design.

Current version: 0.2.0. Adds the optional finishing studio and its copy-and-paste prompt. The method grew from an iterative Vantage design study. The packaged skill has structural validation; it has not yet been evaluated across a broad set of independent projects.
