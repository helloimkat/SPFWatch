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

## Sunny's moods

Sleepy (UV 0–2) · Happy (3–5) · Cool, with sunglasses (6–7) · Hot and sweaty (8+) · Alarmed, holding a bottle (time to reapply) · Proud (just applied).

Tap Sunny for a reaction with a speech bubble and a wrist tap: a wave at normal UV, a squint at extreme UV ("So bright!") and a plea when it's time to reapply.

## Controls

- Scroll over the watch or swipe up and down to turn the Digital Crown. Click the crown to open the watch face.
- The simulator panel lets you scrub the time of day, change the speed (1×, 60×, 300×), pick the weather, override the UV index, toggle outdoors, switch watch faces, and trigger a swim, a reminder, "due in 14 min" (to watch the Smart Stack reorder), a setup replay or a new day.
