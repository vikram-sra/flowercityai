# Site redesign plan: "AI with a friendly face" (2026-10-29)

## Why the current site reads as AI slop
- Sage-green pastel everything, Manrope + Georgia-italic accent word in every heading ("More *breathing room.*").
- Tiny uppercase tracked eyebrows with status dots above every section.
- Decorative glyph soup: ✳ ↗ ✓ 01/02/03, line-icon "visuals" in identical cards.
- Four equal cards, three equal cards, tab pickers: template rhythm, no hierarchy.
- 10–12px grey body text; nothing has a voice, a face or a feeling.

## References and what we take from each
| Source | Take |
|---|---|
| Jungle Jungle (siteofsites, 10/2026) | Saturated flat colour blocks, a character as the brand, playful headline type that mixes sizes. |
| Child Appetite (siteofsites, 08/2026) | Flower motif as hero; stitched/dashed lines as decoration. Fits "Flower City". |
| Plnty (siteofsites, 08/2026) | Huge clear headline, two plain CTAs, running ticker strip. |
| Byotone (siteofsites, 10/2026) | Calm, soft ambient motion; gentle "enter quietly" tone. |
| Odyssée (siteofsites, 10/2026) | Human warmth first. (No real photos yet: founder photo stays a TODO.) |
| Figma 2026 trends | Bold expressive type, warm vibrant palette, soft motion, collage/hand-drawn accents, diagnostic quiz (light gamification), accessible + lean build. Skip: retrofuturism, neon, 3D, dark-first, chatbots-as-bubble. |

## Direction (v1, rejected 2026-10-30: "too pink and childish". See v2 below.)
**Meet Petal**, a small flower-shaped AI character with a face. It blinks, follows the cursor, and changes expression (nervous, curious, overwhelmed, ready, proud, waving). Petal is the "AI", and the copy is honest that a real person in Brampton checks everything.

- **Palette:** cream paper `#FFF7EC`, plum-ink `#22192E`, rose `#FF5D8F`, marigold `#FFC53D`, leaf `#2E9D5C`, sky `#5B8DEF`, blush `#FFE1EA`. Flat blocks, no gradients-on-everything.
- **Type:** Bricolage Grotesque (display, characterful), Instrument Sans (body, 17px+), Caveat (handwritten notes from Petal/founder).
- **Motion:** slow reveal on scroll, Petal idle bob + blink + eye tracking, card wiggle on hover. All off under reduced-motion.

## Page structure
1. **Hero**: "Let's make AI feel *friendly.*" Big Petal waving with speech bubble. Two CTAs. Handwritten note.
2. **Ticker**: honest list of jobs AI can help with (no fake activity).
3. **Mood check**: "How do you feel about AI right now?" Four Petal faces. Petal's face + reply + suggested first step change with the pick.
4. **Your week, lighter**: pick business type, watch a chat play out: your task → AI draft (typed) → you approve.
5. **Services**: four tall colour blocks, each with its own Petal pose. Pilot price note.
6. **How it works**: stitched path with three stops.
7. **Funding**: sticky-note cards, same careful wording ("never guaranteed").
8. **About**: "A real human, right here in Brampton" handwritten founder note.
9. **FAQ**: chat bubbles.
10. **Contact**: rose block, Petal cheering, CTA.

## Kept as is
Contact URL / booking / email config, founder-name env var, links to sample audit, funding and privacy pages, grant compliance wording, SEO meta.

## v2 direction (2026-10-30): professional and warm
Audience: suburban GTA businesses, including distribution centres and 3PLs. The user rejected v1 as too pink and childish.
- No cartoon face, handwriting, tilted stickers or offset shadows. The AI "presence" is a calm five-petal mark that breathes when idle, spins while thinking and settles when done.
- Palette: warm off-white `#F7F5F0`, slate ink `#142230`, deep teal `#1F5C52`, amber `#E39B2D`, with dark slate sections.
- Type: Geist and Geist Mono.
- Hero: "AI that works like a good colleague." with an illustrative morning-summary panel (carrier delay update, night-shift handover, invoice reminder).
- Sector strip, a "Where is your team with AI, honestly?" check, a chat demo that defaults to Distribution & 3PL, service cards with small product snippets, and dark How-it-works and contact sections.

## v3 direction (2026-10-30): Byotone style + Waveism "Sensitivity" scene
The user asked to make the site look like byotone.com/#intro and to open with the Sensitivity animation and interaction from waveism.duar.one/modules/chaos.html.
- Tokens read from byotone.com: background `#191A1E`, accent `#ACFFCE`, body font General Sans, display font Montiac Mono (a paid font, so Xanh Mono stands in), captions in Space Mono uppercase. Also copied: chapter letters A–H, corner-bracket tags, dot-cluster pill buttons, a fixed bottom status bar, blur-in text and an intro gate.
- `src/chaosField.js` is a three.js port of Waveism's Sensitivity icosahedron wireframe, with a Byotone-style dust halo. The shape opens in chaos and settles. Holding and dragging it makes the disturbance grow exponentially and turns it coral; letting go heals it. The hero tags, headline glow and the LOAD meter follow the chaos level. The scene is lazy-loaded (≈120 KB gzip), and with reduced motion it shows as a static frame.
- Copy stays professional for the GTA, distribution and 3PL audience: "Your team’s week is overloaded."

## v3.1 (2026-10-30): per-chapter Waveism models, smoother and more reactive
- The dust cloud morphs into a different Waveism model per chapter, each particle on its own delay over about 3 seconds: A and H ring + Sensitivity wireframe, B Lorenz attractor, C Chladni nodal lines, D radial ripple, E wormhole r(l)=√(l²+b₀²), F spiral galaxy, G metric well.
- Reactive: particles part around the pointer and drift back; the shapes lean toward the cursor; scrolling gives the spin a nudge; hold-and-drag still disturbs the wireframe.
- Slower and smoother: text reveals take about 1.5 s, the wireframe wobble is slower, and every motion eases in and out.
