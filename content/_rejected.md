# Rejected frames

Frames that were deliberately removed from the public `/photos` carousel. Each entry below corresponds to a `hidden: true` flag on its photos.json entry. **The Blob asset and the photos.json record both stay** — only the public surface filters them out. To bring one back, flip its `hidden` flag to `false` (or remove the key).

This file is the source of truth for "do not auto-resurrect these on the next bulk audit." If you change a hide decision, regenerate this file by running the audit script.

---

## Joshua Tree, California

_None — no Joshua Tree frames have been deliberately rejected. All 11 keepers remain visible._

---

## San Diego, California (Dec 2023)

| Slug | Caption | Why rejected |
|---|---|---|
| `2023-12-06_ucsd-maple-leaf-rim-light` | Rim light through the canopy. | First-pass cut. Pretty composition but the chapter already opens with stronger UCSD-dusk leaf frames; this one read as a quieter cousin. |
| `2023-12-06_ucsd-eucalyptus-canopy-twilight` | Twilight under the eucalyptus. | Weakest of the UCSD dusk set — generic canopy, no architectural anchor or focal subject. |
| `2023-12-06_ucsd-purple-leaf-canopy` | Color in the canopy. | Duplicate idea with the much stronger "The whole canopy on fire" (now featured full-bleed). |
| `2023-12-06_downtown-horton-fountain-b` | Horton Plaza Fountain, second take. | Redundant with the long-exposure fountain take that we kept. Same subject, weaker framing. |
| `2023-12-06_downtown-horton-fountain-detail` | The dome, up close. | Third fountain shot in a row — contact-sheet bloat rather than editorial variation. The long-exposure version carries the fountain on its own. |
| `2023-12-06_downtown-att-corner-night` | An AT&T at midnight. | Generic urban scene, the only identifiable element is a corporate logo. Did not earn its slot vs Hotel St. James / Horton Fountain / "tree on the corner". |
| `2023-12-07_liquidambar-leaves-red-fill` | Liquidambar, filling the frame. | Duplicate of the section anchor "Liquidambar." No new visual information. |
| `2023-12-07_purple-heart-groundcover` | Purple heart, ground level. | Weakest of three purple-heart shots. "Flowering shoot" and "flowers and wood" both carry more interest. |
| `2023-12-07_gingko-branch-on-pool-wide` | Gingko on water, wider. | Duplicate composition of the tighter "Gingko on water" frame. The closer crop is stronger. |
| `2023-12-07_still-life-scallop-and-orb` | Scallop and glass orb. | Second indoor still-life back-to-back with "Shells in bowls". The shells frame is stronger; this one read as a second draft from the same studio session. |

---

**Total rejected:** 10 of 41 curated keepers (24 %). Original Lightroom pool was 40 TIFs; one additional rejection (`scallop-and-orb`) reflects in-session editing after deeper review.

---

## Pre-shoot indoor + Zoom cluster (auto-hidden from archive)

The C17A0820–C17A0838 range was taken before the user left for the Dec 2023 San Diego outdoor shoot, in an indoor / personal setting. Includes 6 frames of a video call with an identifiable third party, plus lens-cap test shots and private interior scenes (bedroom, kitchen, office desk). All hidden permanently — these should never appear on the public surface.

| Slug | What it shows |
|---|---|
| C17A0820, C17A0821, C17A0822 | Lens-cap on / pure black frames |
| C17A0823, C17A0824 | Black frames (test exposures) |
| C17A0826 | Workshop / office desk with Apple display |
| C17A0828 | TV screen with a person on it (likely shared call) |
| C17A0829 | Kitchen counter detail |
| C17A0830 | Dorm-room desk (water bottle, plant, clutter) |
| C17A0831 | Dark hallway with luggage / backpack |
| C17A0832 | HomePod + drink (interior detail) |
| C17A0833 | Video call — fist visible |
| C17A0834 | Video call — person smiling |
| C17A0835 | Video call — person |
| C17A0836 | Video call — person with glasses |
| C17A0837 | Video call — person reclined |
| C17A0838 | Video call — person, different angle |

**Why hidden:** privacy (third-party faces on video calls), plus none of these are editorial photographs — they're test frames and personal-life snapshots that pre-date the actual photo trip starting at C17A0840+.

**Update 2026-05-13:** the five fully-black lens-cap test frames (C17A0820 through C17A0824) were physically deleted: moved on-drive to `_trash-test-frames_2026-05-13/`, removed from Blob, removed from photos.json. They had no content (identical EXIF: ISO 3200 / 1/30 / f/11 / 18mm five times = lens cap on). The remaining C17A0826-0838 stay hidden but are still in Blob + manifest for the rejection record.

---

## Duplicate-cluster cuts (Dec 7 2023, San Diego)

User flagged that two compositions were shot many takes deep but only one frame per subject is worth keeping. 57 frames hidden in two ranges:

- **Gingko-on-pool cluster** (C17A0985–C17A1013): 28 takes of the same yellow-gingko-branch-floating-on-pool scene. Kept C17A0990 (the existing editorial keeper, `2023-12-07_gingko-branch-on-pool-a`), hid the other 28.
- **Cracked-asphalt detail cluster** (C17A1014–C17A1043): 30 takes of the same gray-surface-with-small-mark composition. None reached editorial; the user's chosen asphalt frame is `2023-12-07_yellow-leaf-on-asphalt-crack` (C17A0958), which is a different specific shot. Hid all 30 in this range since the keeper already covers the theme.

Blob/GitHub Release assets retained for all 57 per the keep-in-blob rule. If any of these ever earn a permanent slot, the CR3 on the One Touch is the upgrade path.
