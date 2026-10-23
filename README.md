# SPF Watch

An interactive prototype of an Apple Watch app that tracks sun exposure and reminds you to reapply sunscreen based on the UV index. The design follows the watchOS 26 UI kit (Apple Watch Ultra, 205 × 251 pt, Liquid Glass controls). The mascot is Sunny, a sun character whose mood changes with the UV index.

Open `index.html` in a browser. There's no build step.

## What's in the prototype

| Screen | What it shows |
| --- | --- |
| **Now** | Protection ring around Sunny, time left until you need to reapply, and an "I Reapplied" button |
| **Forecast** | Current UV with its WHO category and color, a UV scale, an hourly bar chart, and when to wear SPF |
| **Today** | Sun dose as a percentage of your burn limit, time in the sun, and how many times you applied |
| **Settings** | Skin type (Fitzpatrick I–VI), SPF, water resistance, reminder toggles |
| **Watch face** | Smart Stack widget plus UV, protection and time-in-sun complications (press the Digital Crown) |
| **Notifications** | Short Look → Long Look with *I Reapplied*, *Remind in 15 min* and *Dismiss* |
| **First-run setup** | Sunny says hi, then you pick your skin type and usual SPF. Shown on first launch; replay it from the simulator |
| **Applied to** | After "I Reapplied", choose Face only, Face & arms or Full body. Reminders and sun dose take coverage into account |
| **Corners face** | Second watch face with curved corner gauges (UV, protection, sun dose, time in sun) and an inline complication under the time |

### Smart Stack relevance

The Smart Stack holds Weather, SPF Watch and Calendar widgets. SPF Watch moves to the top, with a short highlight, when you need to act: UV is 3+ and you haven't applied yet, your sunscreen has worn off, or it wears off within 15 minutes. Otherwise Weather stays on top and SPF Watch peeks out below it. Turn the crown or swipe on the face to cycle the stack.

Reminders: the first application of the day ("UV is rising"), reapplying when protection runs out, reapplying after a swim, and a "seek shade" alert at 80% of your daily safe dose.

## Reminder logic

How fast protection wears off depends on the current UV index:

| UV | Category | Reapply every |
| --- | --- | --- |
| 0–2 | Low | 2 h (no alerts by default) |
| 3–5 | Moderate | 2 h |
| 6–7 | High | 100 min |
| 8–10 | Very High | 90 min |
| 11+ | Extreme | 80 min |

If the UV changes partway through, the timer adjusts. A swim halves the remaining protection when you use water-resistant sunscreen and resets it to zero when you don't.

Sun dose is a rough estimate: UV × minutes ÷ the skin type's burn threshold. Sunscreen lowers the dose by about a third of its labelled SPF, which reflects how thinly people usually apply it, and only on the share of skin you covered (face 25%, face and arms 60%, full body 100%). These numbers are placeholders for the prototype, not medical guidance.

## Streak

The fourth page (turn the crown past Today) turns sun safety into a daily streak.

- **A day counts** once UV drops back below 3 in the evening, as long as you never stayed unprotected at UV 3+ for more than 30 minutes. Days without UV 3+ count automatically.
- **Status card** says whether you're on track, how many minutes you have left to reapply before the day is missed, or that the day was missed.
- **Week strip** shows the last six days (counted, no UV, saved with a pass, missed) and a ring that fills through today's sun hours.
- **Badges** at 7, 14, 30 and 60 days, with progress toward the next one. The sample streak starts at 13, so finishing today unlocks *Two Weeks*.
- **Sun Passes** save a missed day. You start with one and earn another every 7 days.

The simulator has **Jump to sunset** (settle today and see the celebration) and **Miss a reapply** (see the at‑risk and pass flow). **Start new day** rolls the week strip forward and keeps the streak.

## Main screen layouts

Switch the Now screen's layout from the simulator panel. All four show the same state and keep the "I Reapplied" button at the bottom.

| Layout | What comes first |
| --- | --- |
| **Ring** | The original: a protection ring around the character, countdown underneath |
| **Hero** | The countdown, top left, with a protection bar and UV pill. An oversized character bleeds off the right edge over a glow in the UV color |
| **Gauge** | The UV index: a semicircle gauge split into the five WHO categories, with the character inside and "reapply in" and "protected" side by side |
| **Cards** | Two tinted cards in the watchOS list style: a status card (green, yellow, orange or red as protection runs down) and a UV card with the day's peak |

## Characters

Pick a character above the mood row on the page. Every character supports every mood, the sunscreen bottle and the tap reactions. Your choice is remembered in this browser.

| Character | Concept |
| --- | --- |
| **Sunny** | The default: a 12-point wavy badge with a flat yellow-to-orange gradient and simple black line-art faces |
| **Mochi** | A soft, scalloped blob in peachy pastels with a pulsing halo instead of rays. It squishes gently as it breathes |
| **Tide** | A sun sitting on the sea. It sinks below the horizon at low UV and climbs higher as UV rises; the bottle floats on the waves |
| **Glyph** | A flat, SF Symbols-style sun filled with the watchOS UV category color (green, yellow, orange, red, purple), so the character is also the UV readout |

## Moods

Sunny has nine faces:

| Face | When |
| --- | --- |
| Calm (eyes closed, smile) | Night, UV 0 |
| Cloudy (peeking over clouds) | UV 1–2 |
| Happy | UV 3–5 |
| Cool (sunglasses) | UV 6–7 |
| Hot (orange, tired frown) | UV 8+ |
| Upset (red-orange, angry brows) | Sunscreen has worn off |
| Proud (big grin, cheeks, burst lines) | Just applied |
| Wink and Blush | Tap reactions |

The other characters map Calm to Sleepy and Blush to Wave.

Tap Sunny for a reaction with a speech bubble and a wrist tap: a wave at normal UV, a squint at extreme UV ("So bright!") and a plea when it's time to reapply.

## Controls

- Scroll over the watch or swipe up and down to turn the Digital Crown. Click the crown to open the watch face.
- The simulator panel lets you scrub the time of day, change the speed (1×, 60×, 300×), pick the weather, override the UV index, toggle outdoors, switch watch faces, and trigger a swim, a reminder, "due in 14 min" (to watch the Smart Stack reorder), a setup replay or a new day.
