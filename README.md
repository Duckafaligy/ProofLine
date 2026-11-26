# ProofLine — Live Replication & Statistical Stress-Test Lab

> **Track the half-life of scientific claims in real time.**  
> Built for the **STEM Innovation Challenge 2026** (*Education & Accessibility* + *Engineering & Scientific Computing*).

- **Live App:** <https://proofline-lake.vercel.app>
- **Repository:** <https://github.com/Duckafaligy/ProofLine>
- **Research Dossier:** [`research/claims-dataset.md`](./research/claims-dataset.md) · [`research/METHODOLOGY.md`](./research/METHODOLOGY.md) · [`research/ASSET_CREDITS.md`](./research/ASSET_CREDITS.md)

ProofLine treats landmark scientific claims like live telemetry trajectories. Instead of reading a viral headline or single abstract in isolation, students, educators, and researchers can **scrub across decades of replication milestones**, open the **Dashboard** (**"Check out Dashboard"**) to **stress-test effect sizes under sample-size and publication-bias perturbations**, and complete an interactive **3-question pre-citation audit**—all 100% client-side with built-in visual and neural audio accessibility.

---

## STEM Innovation Challenge 2026 Alignment

| Track | How ProofLine Delivers |
| :--- | :--- |
| **Education & Accessibility** | Turns abstract replication-crisis concepts (*p*-hacking, statistical power, publication bias, confidence interval width) into tactile cause-and-effect visuals; includes a **3 Questions Before You Cite This** student audit checklist, a one-click **Atkinson Hyperlegible** reading/high-contrast mode, and pre-rendered **`edge-tts` neural audio summaries** (with Web Speech API fallback). |
| **Engineering & Scientific Computing** | Implements a deterministic, zero-dependency TypeScript statistical engine (`src/utils/stats.ts`) using Abramowitz & Stegun 7.1.26 `erf(x)`, normal CDF $\Phi(z)$, two-group standardized effect standard error, and live CI boundary calculations (`90%`, `95%`, `99%`) paired with a custom pointer-capture SVG trajectory scrubber (`src/components/ScrubberChart.tsx`). |

---

## Key Features

### 1. Editorial Landing Overview & Evidence Dashboard (`OverviewPage.tsx` & `LabPage.tsx`)
- Top navigation links directly into the interactive **Evidence Dashboard** via **"Check out Dashboard"** (`?view=dashboard&claim=...`) and returns cleanly via **"Back to site"**.
- Features a live interactive **Power Posing (`PWR-POSE`)** specimen right below the hero, a provenance guide (**Verified**, **Failed Replication**, **Sources Differ**), a filterable **6-Claim Evidence Ledger**, a 3-step student citation warm-up, and Methodology FAQ.

### 2. Interactive Effect Trajectory Scrubber (`src/components/ScrubberChart.tsx`)
- Custom SVG line-and-area chart built with pointer capture (`onPointerDown` / `onPointerMove`), keyboard slider navigation (`role="slider"`), and milestone selector pills.
- Displays authentic study metrics (`effectDisplay`), **Sample (N)**, **Significance (`pValueLabel`)**, standardized chart trajectory (`Std. Effect`), the dashed **Null Threshold (`d = 0.00`)**, and a **"Why the line moved"** evidence summary.

### 3. Live Statistical Stress-Test Engine (`src/components/StressTestEngine.tsx` & `src/utils/stats.ts`)
Three real-time controls test whether a claim's baseline effect survives scrutiny:
- **Sample Size (`N`) slider (`20`–`5,000`, step `10`)** — demonstrates how small samples widen confidence intervals.
- **Bias / Outlier Trim slider (`0%`–`30%`, step `1%`)** — attenuates effect size and effective sample size to model publication bias and outlier sensitivity.
- **Confidence Level toggle (`90%` / `95%` / `99%`)** — updates critical values ($z^* = 1.64, 1.96, 2.58$) and two-tailed $\alpha$ (`0.10`, `0.05`, `0.01`).
- **Dynamic CI Bar & Verdict Pill** — renders confidence interval whiskers relative to `0.00 null` and classifies results as **Statistically Significant** (`#15803D`), **Borderline / Fragile** (`#B45309`), or **Null / Non-Significant** (`#DC2626`).

### 4. Student Pre-Citation Audit (`src/components/CitationChecklist.tsx`)
- Interactive **"3 Questions Before You Cite This"** checklist customized for every case study (`0/3` to `3/3 Audited`) with expandable **Audit Finding** drawers covering statistical power, pre-registration, Scope 1 vs. Scope 2 water boundaries, taste-blinding artifacts, and subgroup splits.

### 5. Accessibility-First Design (`src/components/TopNav.tsx`, `src/index.css`, `src/App.tsx`)
- **Atkinson Hyperlegible Mode** (`.a11y-hyperlegible`): switches typography to the Braille Institute's `Atkinson Hyperlegible` font, increases line height (`1.72` / `1.68`) and letter spacing (`0.018em` / `0.015em`), boosts muted text contrast (`#18181B` via `.text-muted-token`), and darkens card borders (`#09090B` via `.hairline-card`) on the Pure White (`#FFFFFF`) editorial shell.
- **Neural Audio Summaries (`public/audio/*.mp3`):** Plays pre-generated `edge-tts` MP3 briefings for the Overview and all 6 case studies, automatically falling back to browser `window.speechSynthesis` if audio playback fails.
- **Tabular Monospace Numerals (`.font-mono-tabular`):** Uses `JetBrains Mono` with `font-variant-numeric: tabular-nums` so fast scrubbing never causes layout jitter.

---

## Curated STEM Case Studies (6 Claims · 23 Milestones)

Defined in [`src/data/claims.ts`](./src/data/claims.ts) and fully documented with verified DOIs and archival links in [`research/claims-dataset.md`](./research/claims-dataset.md):

| Ticker | Case Study | Field | Status | Trajectory (`First → Latest`) |
| :--- | :--- | :--- | :--- | :--- |
| `PWR-POSE` | **Power Posing & Testosterone** | Psychology | Failed Replication | `2010: r = 0.34 (+20% raw) [d=0.72] (N=42)` → `2022: g = 0.0 hormonal [d=0.00] (N=9,779)` |
| `AI-H2O` | **AI Prompt Water Footprint** | AI & Compute | Sources Differ | `2023: 10–50 mL/prompt [0.65] (Scope 1+2)` → `2025: 0.26–0.32 mL direct; 560B → 1,200B L/yr by 2030 [0.34]` |
| `MOZART-IQ` | **The Mozart Effect & IQ** | Neuroscience | Failed Replication | `1993: +8.5 spatial IQ pts [d=0.78] (N=36, p=0.002)` → `2010: d = 0.15 [0.02, 0.28] vs. silence (N=3,016)` |
| `VIT-C-RX` | **Vitamin C & the Common Cold** | Medicine | Sources Differ | `1961: -45% cold incidence [0.55] (N=279)` → `2013: RR = 0.97 [0.94, 1.00], -8% duration [0.04] (N=11,306)` |
| `GRW-MIND` | **Growth Mindset Interventions & Grades** | Education | Sources Differ | `2007: d = 0.52 (N=91, p=0.008)` → `2023: d = 0.05 NS bias-corr. (N=97,672)` |
| `SMK-ONC` | **Cigarette Smoking & Lung Cancer** | Medicine | Verified | `1950: Strong Dose-Response [1.18] (N=1,465, p<0.001)` → `2008: RR = 8.96 [6.73, 12.11] [1.25] (216 studies)` |

---

## Statistical Methodology (`src/utils/stats.ts`)

All stress-test calculations execute deterministically in `computeStressTest(input)` (full specification in [`research/METHODOLOGY.md`](./research/METHODOLOGY.md)):

1. **Bias / Outlier Attenuation**  
   Given baseline standardized effect $d_0$, sample size $N \in [20, 5000]$, and trim fraction $t \in [0, 0.30]$:
   $$d_{\text{adj}} = d_0 (1 - t), \qquad N_{\text{eff}} = \max\!\left(10,\; N (1 - 0.5t)\right)$$

2. **Two-Group Standardized Mean Difference Standard Error**  
   $$\text{SE} = \sqrt{\frac{4}{N_{\text{eff}}} + \frac{d_{\text{adj}}^2}{2 N_{\text{eff}}}}$$

3. **Z-Score & Two-Tailed *p*-Value**  
   $$Z = \frac{d_{\text{adj}}}{\text{SE}}, \qquad \Phi(z) = \frac{1}{2}\left[1 + \operatorname{erf}\!\left(\frac{z}{\sqrt{2}}\right)\right], \qquad p = 2\bigl(1 - \Phi(|Z|)\bigr)$$
   `erf(x)` uses **Abramowitz & Stegun formula 7.1.26** (maximum approximation error $< 1.5 \times 10^{-7}$).

4. **Confidence Interval & Significance Verdict**  
   Using exact two-tailed critical Z-values (`1.6448536` for 90%, `1.959964` for 95%, `2.5758293` for 99%):
   $$\text{CI} = \bigl[d_{\text{adj}} - z^* \cdot \text{SE},\;\; d_{\text{adj}} + z^* \cdot \text{SE}\bigr]$$
   - **Statistically Significant**: $p < \alpha$ and $\text{CI}_{\text{lower}} > 0$
   - **Borderline / Fragile**: $p < 0.10$ (not meeting strict $\alpha$ and positive lower bound)
   - **Null / Non-Significant**: $p \ge 0.10$

---

## Tech Stack

- **Framework:** React `^19.3.1` + TypeScript `~7.0.2`
- **Build Tool:** Vite `^8.3.6` (`@vitejs/plugin-react` `^6.1.2`)
- **Styling:** Tailwind CSS v4 (`tailwindcss` `^4.3.5`, `@tailwindcss/vite` `^4.3.5`)
- **Icons:** `lucide-react` `^1.80.0` (ISC)
- **Linting:** `oxlint` `^1.90.0` (React, TypeScript, Oxc rules)
- **Typography, Audio & Imagery:** Google Fonts (`Inter`, `JetBrains Mono`, `Atkinson Hyperlegible` under SIL OFL 1.1), `edge-tts` neural MP3 summaries + Web Speech API fallback, Wikimedia Commons lab photography (`CC BY 2.0` / `CC BY 4.0`)

---

## Project Structure

```text
ProofLine/
├── index.html                          # Pure White editorial shell + Google Fonts
├── package.json                        # Scripts & dependencies
├── vite.config.ts                      # Vite + React + Tailwind v4 plugin configuration
├── public/
│   ├── audio/*.mp3                     # 7 neural TTS audio briefings (overview + 6 claims)
│   └── images/*.jpg                    # Wikimedia Commons lab & microscope photography
├── research/
│   ├── claims-dataset.md               # Complete 6-claim research dossier with DOIs & metric notes
│   ├── METHODOLOGY.md                  # Full mathematical spec & limitations of src/utils/stats.ts
│   └── ASSET_CREDITS.md                # Open-source image, neural audio, font, and icon credits
├── pitch/
│   ├── DEMO_SCRIPT.md                  # ~90-second judge presentation & demo script
│   └── DEVPOST_SUBMISSION.md           # Ready-to-paste Devpost submission copy
└── src/
    ├── App.tsx                         # URL-synced view routing, Hyperlegible state, Audio/Speech controller
    ├── index.css                       # Editorial palette tokens, .a11y-hyperlegible rules, .proof-slider styles
    ├── data/
    │   └── claims.ts                   # 6 curated STEM claims, 23 milestones, 18 citation checklist items
    ├── utils/
    │   ├── stats.ts                    # Abramowitz & Stegun erf/Normal CDF & live stress-test engine
    │   └── status.ts                   # Semantic status badge & hex color mappings
    └── components/
        ├── TopNav.tsx                  # Overview / Dashboard ("Check out Dashboard") switcher & a11y controls
        ├── OverviewPage.tsx            # Editorial landing page, live hero specimen, and 6-claim ledger
        ├── LabPage.tsx                 # Evidence Dashboard & horizontal 6-claim workbench switcher
        ├── ScrubberChart.tsx           # Interactive pointer-capture SVG trajectory scrubber
        ├── StressTestEngine.tsx        # N, Bias Trim, and CI selector + live CI bar & readouts
        ├── CitationChecklist.tsx       # Expandable "3 Questions Before You Cite This" student audit
        └── StatusBadge.tsx             # Semantic Verified / Failed Replication / Sources Differ badges
```

---

## Local Setup

### Prerequisites
- **Node.js** (v20+ recommended) and **npm**

### Install & Run
```bash
npm install && npm run dev
```
Open the local Vite URL printed in your terminal (typically `http://localhost:5173`). No environment variables, API keys, or backend services are required.

### Quality Checks
```bash
npm run lint    # Runs oxlint across TypeScript/React files
npm run build   # Runs TypeScript project check (tsc -b) and Vite production build
```

---

## AI-Assisted Development Disclosure

In accordance with **STEM Innovation Challenge 2026** guidelines, we disclose that **AI coding assistants were used during development** to accelerate UI component scaffolding, TypeScript/Tailwind styling, mathematical helper implementation, and documentation drafting. All curated scientific claims, milestone statistics, DOIs/citations (`src/data/claims.ts`, `research/claims-dataset.md`), statistical formulas (`src/utils/stats.ts`, `research/METHODOLOGY.md`), open-source asset credits (`research/ASSET_CREDITS.md`), accessibility controls, and build/lint checks (`npm run lint`, `npm run build`) were reviewed and verified by the author.
