# ProofLine — 2:30 Judge Presentation & Demo Script

**Total Runtime:** `2:30` (150 seconds) · **Target Pace:** ~150 WPM (~375 spoken words)  
**Pre-Recording Checklist:**
1. Run `npm run dev` in `C:\Promo Business\ProofLine` and open at `1920×1080` (100% zoom) on the **Overview** page (`Hyperlegible` OFF initially, Audio Summary stopped).
2. Ensure system audio is captured if triggering the **Audio Summary** button at `1:55` (test browser TTS voice volume beforehand).
3. Cursor highlight enabled for crisp screen recording.

---

## `0:00` — Hook (`0:00–0:25`, ~62 words)

### Screen-Recording Cues
- **0:00:** Start on ProofLine **Overview** page showing the hero headline (*"Track the Half-Life of Scientific Claims in Real Time."*) and the **6 Tracked STEM Case Studies** grid (`6 CLAIMS · 23 MILESTONES`).
- **0:08:** Slow hover sweep across the 6 cards so judges spot `PWR-POSE` (Rose), `AI-H2O` (Amber), `MOZART-IQ` (Rose), `VIT-C-RX` (Rose), `GRW-MIND` (Amber), and `SMK-ONC` (Emerald).
- **0:18:** Hover cursor over the blue **Open Statistical Lab** CTA button.

### Spoken Script
> "Viral science headlines look permanent—but scientific truth moves like a market chart. A 42-person study sparks a global TED talk, a textbook cites a 1993 effect, and ten years later, pre-registered replications quietly revise the verdict to zero.  
>  
> Meet **ProofLine**: an interactive scientific claim tracker and statistical stress-test lab that lets students and researchers watch how evidence actually evolves over time."

---

## `0:25` — Problem (`0:25–0:45`, ~52 words)

### Screen-Recording Cues
- **0:25:** Click **Open Statistical Lab** to transition smoothly into **Lab** view (opens on `PWR-POSE · Power Posing & Hormones`, milestone `2010` selected by default).
- **0:34:** Highlight the Claim Header Card showing `Original Claim: Carney, Cuddy & Yap (2010)` vs. `Latest Consensus: Ranehill et al. (2015); Simmons & Simonsohn (2017)`.

### Spoken Script
> "Static PDFs hide the replication crisis. When a student or journalist searches a famous finding, they usually grab the splashy original paper—never seeing the five-times-larger replication that failed, or why `p = 0.045` at `N = 42` is statistically fragile. Abstract math formulas don't stick—but watching the evidence line collapse does."

---

## `0:45` — Live Demo: Scrubbing a Failed Replication (`0:45–1:25`, ~98 words)

### Screen-Recording Cues
- **0:45:** Move cursor onto the **Effect Size Trajectory** SVG (`ScrubberChart`). Point to `2010 · Original Lab Study` (`d = 0.72`, `Sample (N): 42`, `Significance: p = 0.045`).
- **0:55:** Click and drag slowly rightward across the chart crosshair:
  - Pause briefly on **2015 (`Direct Replication`)**: `d = 0.06`, `N = 200`, `p = 0.68` — let the *"Why the line moved"* card flash into view.
  - Pause on **2017 (`P-Curve Audit`)**: `d = 0.03`, `N = 1,180`, `p = 0.78`.
  - Settle on **2018 (`Bayesian Meta-Analysis`)**: `d = 0.04`, `N = 1,204`, `p = 0.71` right above the dashed `Null Threshold (d = 0.00)` line.
- **1:15:** Briefly click the **Sources Differ** filter or `AI-H2O` (`AI Prompt Water Footprint`) or stay on `PWR-POSE` and scroll slightly down to show **3 Questions Before You Cite This** (`CitationChecklist`), toggling `01` checked and expanding **Evidence** to show the source-backed **Audit Finding**.

### Spoken Script
> "Here is **Power Posing & Hormones** inside ProofLine. Right now we're sitting at 2010: `d = 0.72`, `N = 42`, `p = 0.045`—classic textbook hype.  
>  
> Watch what happens as I scrub forward through time like a stock ticker. By **2015**, a five-times-larger direct replication drops the effect to `0.06` (`p = 0.68`). By **2017**, Simmons and Simonsohn's p-curve audit across 1,180 subjects hits `0.03`. And by **2018**, the consensus flatlines right against the dashed `0.00` null threshold. Each stop tells students *why* the line moved—and our **3 Questions Before You Cite This** audit catches underpowered or un-preregistered claims before they ever enter a bibliography."

---

## `1:25` — Live Demo: Stress-Test N & CI Morph (`1:25–1:55`, ~78 words)

### Screen-Recording Cues
- **1:25:** Focus tightly on **Live Statistical Stress-Test Engine** (still on `PWR-POSE`, default `N = 42`, `Bias Trim = 15%`, `Confidence Level = 95%`). Point cursor at the Rose `Null / Non-Significant` badge and the wide CI bar `[-0.277, 0.991]` crossing the dashed `0.00` vertical marker (`p = 0.270`).
- **1:33:** Drag **Sample Size (`N`)** slider smoothly from `42` up to `200` → the CI whisker shrinks visibly to `[0.067, 0.647]`, `SE` drops from `0.3234` to `0.1482`, `p = 0.016`, and the verdict flips Emerald (`Statistically Significant`).
- **1:42:** Now drag **Bias / Outlier Trim** from `15%` to `30%` and click **99%** Confidence Level (`z* = 2.58`) → the CI whisker widens right back across `0.00` (`[-0.103, 0.691]`, `p = 0.057`) and flips Amber (`Borderline / Fragile`).
- **1:50:** Click **`SMK-ONC` (`Smoking & Lung Cancer`)** in the left sidebar to contrast the **Verified Control** (`Adj. Effect = 1.350`, `Z = 30.46`, `p < 0.0001`, CI `[1.263, 1.437]` far clear of `0.00`).

### Spoken Script
> "Now let's stress-test the math live. At `N = 42` with a `15%` bias trim, the 95% confidence interval spans `[-0.277, 0.991]`—crossing zero, `p = 0.270`, null.  
>  
> Drag `Sample Size` up to `200` and watch the standard error halve and the interval snap clear of zero—Emerald significant. Now crank **Bias Trim** to `30%` and tighten to **99% confidence** (`z* = 2.58`): the interval morphs right back across zero into **Borderline / Fragile**. Compare that to our **Verified Control**, Smoking & Lung Cancer—where `Z = 30.46` and `p < 0.0001` never budges."

---

## `1:55` — Accessibility Mode & Impact (`1:55–2:15`, ~52 words)

### Screen-Recording Cues
- **1:55:** Click **Hyperlegible** in the sticky top bar (`TopNav`) so it illuminates `Hyperlegible: ON`—visibly switching typography to **Atkinson Hyperlegible**, expanding line height/tracking, brightening `#CBD5E1` text, and boosting card hairline contrast.
- **2:03:** Click **Audio Summary** (either in `TopNav` or on the Claim Header Card) for 3–4 seconds so judges hear the browser **Web Speech API** reading the claim briefing aloud, then click **Stop Audio** cleanly before resuming voiceover (or speak smoothly after a 3-second audio clip).

### Spoken Script
> "Scientific literacy shouldn't be gated by tiny journal PDFs. One click turns on **Atkinson Hyperlegible** mode—widening tracking, boosting contrast, and locking tabular monospace numerals so scrubbing never jitters. Pair that with **Web Speech API Audio Summaries**, and visually impaired or neurodivergent learners can audit every replication milestone hands-free."

---

## `2:15` — Tech Stack & Close (`2:15–2:30`, ~38 words)

### Screen-Recording Cues
- **2:15:** Click **Overview** in `TopNav` to frame the full 6-claim portfolio cleanly on screen, with cursor resting neatly near the brand mark (`ProofLine · STEM 2026`).
- **2:28:** Hold final frame cleanly for 2 seconds (`2:30` end card / fade).

### Spoken Script
> "ProofLine runs 100% client-side in **React 19, TypeScript, Vite, and Tailwind CSS v4**, backed by a zero-dependency **Abramowitz & Stegun Normal CDF** engine and custom pointer-capture SVG graphics—zero API keys, instant classroom deployment.  
>  
> **ProofLine**: don't just read the headline—stress-test the proof."
