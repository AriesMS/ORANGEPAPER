# CODEX PROMPT SEQUENCE

Use these prompts in sequence. The step names are only stages of the exercise - there is nothing to activate in Codex. Copy/paste the prompt under the current step into Codex. Do not begin with one giant "build me a website" prompt.

---

## CODEX STEP 1 - PLAN

Read:
- `DESIGN.md`
- my selected skeleton's `DESIGN_LANGUAGE.md`
- any reference screenshots/images/files I provide
- my attached CV

Inspect the websites or visual references I list where possible.

**Do not write code yet.**

First give me a concise design plan containing:

1. What content from my CV should appear on the site.
2. What CV content you recommend leaving out.
3. The visual language you infer.
4. The information hierarchy.
5. The proposed page structure.
6. The grid / composition strategy.
7. The typography strategy.
8. The role of imagery.
9. What you intend to borrow from each reference.
10. What you will deliberately NOT copy.
11. One distinctive design move that will make the result specific to me.
12. Any conflicts you notice between my references or constraints.

Do not invent facts that are not present in my CV or materials.

Avoid generic portfolio conventions unless they are supported by my brief.

Wait for my approval before implementation.

---

## CODEX STEP 2 - BUILD

Proceed with the approved design plan.

Build a responsive one-page website from scratch using:
- plain HTML;
- CSS;
- minimal vanilla JavaScript only where useful.

Create:
- `index.html`
- `style.css`
- `script.js` only if necessary
- use `assets/` for images

Requirements:
1. Follow `DESIGN.md` closely.
2. Follow my selected `DESIGN_LANGUAGE.md`.
3. Keep the code simple enough for me to understand and modify.
4. Use semantic HTML.
5. Add concise comments around major layout/design systems.
6. Do not introduce frameworks or build tools unless absolutely necessary.
7. Do not invent achievements, clients, projects, testimonials, or personal facts.
8. If content is missing, use clearly labelled placeholders instead of fabricating information.
9. Ensure the result works as a static GitHub Pages site.
10. Check the mobile layout.

After implementation, briefly explain:
- which file controls the page structure;
- which CSS controls layout;
- which CSS controls typography;
- which CSS controls spacing and colour;
- where I should edit project content.

---

## CODEX STEP 3 - CRITIQUE & REVISE

Review the current website against:
- `DESIGN.md`
- my selected skeleton
- my references

Do **not** rebuild from scratch.

First identify:
1. Three things that still look generic, templated, or AI-generated.
2. Three things that successfully translate my references.
3. Three places where hierarchy, spacing, typography, or composition could improve.
4. Any violations of my stated constraints.
5. One opportunity to make the site more distinctive without adding clutter.

Then revise the existing files.

Preserve the successful design decisions.

---

## CODEX STEP 4 - UNDERSTAND & EDIT

Explain the current site to me as a beginner.

Show me:
1. the main HTML sections;
2. the CSS responsible for the overall grid/layout;
3. the CSS responsible for typography;
4. the CSS responsible for spacing;
5. the easiest place to change the accent colour;
6. one safe visible modification I can make myself.

Do not change the files yet.

---

## OPTIONAL STEP - MOBILE QA

Review the site specifically for mobile widths.

Check:
- typography scaling;
- image overflow;
- navigation;
- spacing;
- horizontal scrolling;
- tap targets;
- reading order.

Fix only genuine mobile problems while preserving the design language.
