# Website design

Current implementation, September 2026. This replaces the original pastel portfolio brief.

## Purpose and identity

Aries Yang’s research portfolio is presented as an inhabitable computational research construct. The home page connects eight research, work, teaching, and practice fragments through an interactive three-dimensional composition. The character is architectural, technical, and playful. A quiet black field and fine blue wirework give the geometry priority; a small title identifies the site at the upper left.

## Research hierarchy and geometry

01, PhD / Computational architecture, is a whimsical walking-tree carrier. A small version of the original machine assembly retains its pod, collar, antenna, and articulated appendages near the base. A crooked double spine grows upward through the composition, with seven curved, under-slung bridge branches that terminate beneath the actual lowest points of the individual constructs. Three animated splayed walking legs, two spoked wheels, and a short incomplete spiral stair give it an eccentric, inhabitable character. There is no perimeter frame, enclosing cage, broad deck, or massive trunk.

The architectural proposition is a mobile city of research ideas: the individual constructs are the inhabitants and remain the visual focus. The carrier uses yellow `#f2c928`, vermilion `#e34b32`, blue `#368cce`, and cream `#eee9da` as an Archigram-inspired graphic palette. Colour is visible at rest with 55% wire opacity and brightens to 85% on selection; selected member surfaces retain their colours at 28% opacity. Projects retain their blue wirework and opaque primary-colour patchwork on selection. Supporting arms have stronger upper members, deeper under-slung arches, cross-ties, and cream bearing forks. Three additional arms extend left, right, and upward beyond the project bounds, ending in empty docking forks for future work. These belong to 01 and do not create fictional project records. Picking follows the carrier's actual small core and members, leaving the spaces between branches open. The form is conceptual rather than an engineered structural analysis.

References: [Archigram’s archive at M+](https://www.mplus.org.hk/en/collection/archives/archigram-archive-ca36/) informs the mobile, assembled city and plug-in research fragments. [Piranesi’s The Drawbridge at the Smithsonian](https://www.si.edu/object/drawbridge-plate-vii-series-carceri-dinvenzione%3Achndm_1959-182-6) informs bridges, suspended circulation, and the incomplete stair. The user's Howl’s Moving Castle reference informs the eccentric walking-machine character. These are interpreted through thin wirework and negative space rather than masonry mass or a literal castle silhouette.

02–08 retain their independently tilted, asymmetric assemblies: a primitive core, collar, satellite pods, projecting gantries, antennae, articulated supports, and feet. Boxes and pyramids carry dense wire grids; spheres and toruses carry curved lattices. The seven fragments retain their existing positions, rotations, and scales. The home camera is pulled back to frame the larger assembly. The standalone project pages retain their closer camera view.

## Colour and material

- Background: black `#000000`.
- Normal wirework: blue `#4191dc`.
- Primary text: pale blue `#c8e4ff`; secondary text uses `#91bade`, `#9eb4c8`, and `#7793ac`.
- Rules and panel edges: `#365d80` and `#203345`.
- Active surfaces: a geometric patchwork of red `#d82d24`, yellow `#f2c928`, blue `#174bb5`, cream `#eee9da`, and dark dividing lines `#101317`.
- Pointer targets and links use a yellow cursor accent.

There are no lights or photorealistic materials. Flat colour textures appear on the active construct; the rest remains wireframe. This current palette supersedes the original lavender and peach brief.

## Typography

All four pages load `typography.css` last. Heading elements, including dynamically inserted inspector titles, use **Bauhaus**. Text, metadata, navigation, and controls use **IBM Plex Mono**. The fonts are resolved from local installations; sans-serif and monospace fallbacks apply on other devices. No font files are bundled.

Metadata is small with expanded letter spacing. Titles remain restrained on the home page and become larger within project content. Original Courier New styles and rollback steps are recorded in `TYPOGRAPHY.md`.

## Pages and content

| Page | Current implementation |
| --- | --- |
| `index.html` | Full viewport research carrier with eight selectable records. The inspector shows fragment number, title, period, context, description, and project links where available. |
| `facade-to-interior.html` | Four image crops from the HDB module-to-graph illustration: building module, facade geometry, structural graph, and facade graph; followed by project notes. Native vertical scrolling drives a fixed exploded composition: each crop comes forward in turn, earlier crops shrink to the side, and the final view arranges all four above project notes. Arrow and Page keys advance the focused sequence. Images receive a blue-toned inversion treatment. |
| `internal-wall-inference.html` | Rotatable fragment 03 with a short description and an explicit project-in-preparation message. |
| `interior-segmentation.html` | Rotatable fragment 04 with a short description and an explicit project-in-preparation message. |

The home inspector opens links for fragments 02, 03, and 04. The other records currently provide contextual text, without separate pages. Every project page has a return-to-construct link.

## Interaction and responsive layout

Drag rotates the Three.js scene; scroll or pinch zooms. Hovering a geometry previews its patterned surfaces. Clicking or tapping pins its colours and inspector until another construct or empty space is clicked; Escape and the close button also clear the selection. Hovering other constructs can preview their colours while the pinned construct remains coloured and its inspector stays stable. Dragging the scene does not clear a pinned selection. Without a pinned selection, hover opens the inspector and the preview clears on pointer leave. Enter cycles records, arrow keys rotate, plus/minus zoom, and Escape closes the inspector. Canvas elements are focusable and labelled.

The home inspector sits at the right on desktop and becomes a bottom panel below 650px. Standalone project pages place text to the left of the canvas on desktop and below a 60svh canvas on mobile. Camera field of view expands for narrow screens. Fine-pointer devices use a crosshair-like cursor that changes on targets and during dragging; reduced-motion preferences disable its transitions.

## Implementation and current limits

`journey-source.js` owns records, camera, picking, surfaces, and input. `construct-geometry.js` owns fragment assemblies and the branching research carrier. `journey.css` owns the scene and page layouts; `facade-study.css` owns the image study; `typography.css` owns current fonts. `npm run build` uses esbuild to generate the two browser bundles from their source files. Edit source files, then rebuild; HTML script versions control cache refreshes.

The home carrier runs a time-based walking cycle with three phase-offset articulated legs, rotating spoked wheels, and a blue ground grid scrolling underneath at the wheel travel speed. The grid fades into black fog. The research fragments remain steady for reading and selection. A Pause motion / Resume motion button controls the animation; reduced-motion preferences start it paused, and hidden tabs suspend rendering. Standalone project pages retain rendering on input and resize. `carrier-motion.js` owns the moving rig and ground grid; geometry is reused and only transforms change each frame. Moving parts select record 01. Pixel ratio is capped at 1.75, textures are created once, and simplified project picking meshes are separate from the visible geometry. Carrier picking uses its actual member geometry.

The facade study scrolling was restored from commit `646da07` after a static grid stylesheet and incompatible 3D-stage controller had replaced its working layout and behaviour. `facade-study-source.js` now matches the actual image-sequence HTML and builds into `facade-study.js`. Hover, focus, and tap reveal the HDB facade dialogue; Escape dismisses it. The two placeholder project pages remain unfinished. Local-only fonts and the WebGL requirement are current delivery constraints.

## Design guardrails

Keep the carrier light, branching, and subordinate to the projects. Support from within and below; do not surround the composition with a frame. Preserve distinct project selection and keyboard access. Use geometry and research imagery as the main navigation and storytelling elements. Keep text concise, panels square, and rules fine. Avoid decorative particles, generic card grids, gradients, and idle animation unrelated to exploration.

## Uneven-ground motion refinement

The ground grid uses bright blue `#5cafff` flat mesh strips at 58% opacity, with thicker lines every five units. Mesh strips provide visible thickness across WebGL platforms. Wheels have unequal radii (0.39 and 0.21 units), with rotation matched to travel distance. The three articulated legs have different reaches, widths, feet, and stride heights.

A damped spring suspension responds to irregular terrain waves. The carrier heaves gently as a unit; each project has its own mass and smaller delayed bounce. This is a procedural weight simulation, not a collision solver. Visible wires, selected surfaces, and picking meshes share each displacement. Legs follow the carrier’s moving attachment point, while the wheels have a smaller terrain response. Existing pause, reduced-motion, and hidden-tab behaviour remains in effect.
