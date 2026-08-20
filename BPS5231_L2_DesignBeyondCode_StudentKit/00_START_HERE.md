# DESIGN BEYOND CODE
## Build Your Personal Site with Codex

### Challenge
Build and publish a one-page website that feels specific to you, rather than like a generic AI-generated portfolio.

You may build a personal website, design portfolio, research portfolio, professional profile, or hybrid.

### Tools
- Visual Studio Code (VS Code)
- GitHub
- Codex
- GitHub Pages
- Plain HTML + CSS + minimal JavaScript

There is deliberately **no starter website template**. Everyone starts with the same design harness, but Codex generates each website from scratch using your CV, references, content, and chosen design language.

> **Important:** "Codex Step 1", "Step 2", etc. are simply the stages of this exercise. They are not buttons or modes in Codex. Open `CODEX_PROMPTS.md` and copy/paste the prompt for the current step into Codex.

---

# In-class flow

## 1. Create your GitHub repository
Create a new **public** repository named:

`YOUR-USERNAME.github.io`

Example:

`janedoe.github.io`

## 2. Open the repository in VS Code
On GitHub:

**Code -> HTTPS -> Copy URL**

Then in VS Code:

**Clone Git Repository -> paste URL -> choose a folder -> Open**

## 3. Copy this student kit into your repository
Copy the files/folders from this kit into your cloned repository.

You should have files such as:

```text
DESIGN.md
CODEX_PROMPTS.md
AI_SLOP_CHECKLIST.md
GITHUB_PAGES_GUIDE.md
skeletons/
references/
private-inputs/
assets/
```

There should still be **no `index.html` or `style.css` yet**.

## 4. Add your CV and project material
Put your CV locally in:

```text
private-inputs/CV.pdf
```

The `private-inputs/` folder is ignored by Git so your CV is not published by accident.

When using Codex, attach your CV directly if needed so it can use it as a content source.

Put project images in:

```text
assets/
```

## 5. Choose one design language
Open `skeletons/` and choose one primary direction:

1. Editorial
2. Architecture / Minimal
3. Technical / Research
4. Experimental

Read that skeleton's `DESIGN_LANGUAGE.md` and open its `LAYOUT_SKETCH.svg`.

These are **design principles, not website templates**.

## 6. Complete `DESIGN.md`
Add:
- the purpose of your site;
- three words describing its personality;
- your chosen skeleton;
- links/screenshots of websites or designs you like;
- what specifically you want to follow from each reference;
- what you do not want copied;
- what from your CV should be emphasized;
- your preferred typography/layout;
- one distinctive design move.

Find at least one reference yourself.

Do not write only: "I like the vibe."

Instead write things such as:

> I like the oversized typography and wide margins.

> I want to follow the image-led project layout, but not the colour palette.

## 7. Codex Step 1 - Plan
Open `CODEX_PROMPTS.md` and use **Codex Step 1 - Plan**.

Codex should first interpret your:
- CV/content;
- references;
- design language;
- visual hierarchy;
- page structure;
- distinctive design move.

**Do not let it code yet.**

Read the proposed design plan and correct it until it sounds like the site you actually want.

## 8. Codex Step 2 - Build
Use **Codex Step 2 - Build**.

Codex should create the site from scratch using simple files such as:

```text
index.html
style.css
script.js   # only if useful
assets/
```

Avoid unnecessary frameworks or build systems.

## 9. Critique the first version
Look at the first result and identify:
- 3 things that look generic or AI-generated;
- 3 things that successfully reflect your references;
- 1 hierarchy, spacing, typography, or composition problem.

Then use **Codex Step 3 - Critique & Revise** so Codex improves the existing site rather than rebuilding everything.

## 10. Codex Step 4 - Understand & Edit
Open `CODEX_PROMPTS.md` and use **Codex Step 4 - Understand & Edit**. Codex will show you where the important HTML/CSS lives and suggest one safe visible change.

Then use VS Code to personally change at least one visible part of the HTML/CSS.

Examples:
- heading size;
- spacing;
- colour;
- image width;
- grid layout;
- section order;
- hover behaviour.

You do not need to write the whole website yourself, but you should know roughly where the design lives in the code.

> **Codex can write your code. You still need to own your code.**

## 11. Run the anti-slop check
Open `AI_SLOP_CHECKLIST.md`.

Most important question:

> **Could I swap your name and project images with another person's and nobody would notice?**

If yes, revise.

## 12. Publish
Commit and push your files to GitHub, then follow `GITHUB_PAGES_GUIDE.md`.

Your site should publish at:

`https://YOUR-USERNAME.github.io`

---

# Overall workflow

**CV + References + Design Language + Design Brief -> Codex -> Code -> Preview -> Critique -> Revise -> Manual Edit -> Publish**
