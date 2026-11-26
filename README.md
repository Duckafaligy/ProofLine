# ProofLine — Live Replication & Statistical Stress-Test Lab

> **Track the half-life of scientific claims in real time.**  
> Built for the **STEM Innovation Challenge 2026** (*Education & Accessibility* + *Engineering & Scientific Computing*).

ProofLine treats landmark scientific claims like live telemetry trajectories. Instead of reading a viral 2010 headline or a single abstract in isolation, students, educators, and researchers can **scrub across decades of replication milestones**, **stress-test standardized effect sizes under sample-size and publication-bias perturbations**, and run an interactive **3-question pre-citation audit**—all client-side with zero external dependencies and built-in visual and audio accessibility.

---

## STEM Innovation Challenge 2026 Alignment

| Track | How ProofLine Delivers |
| :--- | :--- |
| **Education & Accessibility** | Turns abstract replication-crisis concepts (*p*-hacking, statistical power, publication bias, confidence interval width) into tactile cause-and-effect visuals; includes a **3 Questions Before You Cite This** student audit checklist, a one-click **Atkinson Hyperlegible** high-legibility/high-contrast mode, and **Web Speech API** spoken claim summaries. |
| **Engineering & Scientific Computing** | Implements a deterministic, zero-dependency TypeScript statistical engine (`src/utils/stats.ts`) using Abramowitz & Stegun `erf(x)`, normal CDF $\Phi(z)$, two-group standardized effect standard error, and live CI boundary calculations (`90%`, `95%`, `99%`) paired with a custom pointer-capture SVG trajectory scrubber (`src/components/ScrubberChart.tsx`). |

---

## Key Features

### 1. Robinhood-Style Effect Trajectory Scrubber (`src/components/ScrubberChart.tsx`)
- Interactive SVG line-and-area chart built with pointer capture (`onPointerDown` / `onPointerMove`) and keyboard-accessible milestone buttons.
- Dragging or hovering across historical milestones updates the telemetry HUD (**Effect Size**, **Sample `N`**, **Significance / `p`-value**) and the **"Why the line moved"** evidence annotation card.
- Visualizes the dashed **Null Threshold (`d = 0.00`)** so users immediately see when a bold early effect collapses toward zero in larger pre-registered replications.

### 2. Live Statistical Stress-Test Engine (`src/components/StressTestEngine.tsx` & `src/utils/stats.ts`)
Three real-time controls stress-test whether a claim's baseline effect survives scrutiny:
- **Sample Size (`N`) slider (`20`–`5,000`, step `10`)** — shows how small samples inflate uncertainty and wide confidence intervals.
- **Bias / Outlier Trim slider (`0%`–`30%`, step `1%`)** — attenuates effect size and effective sample size to model publication bias and selective outlier removal.
- **Confidence Level toggle (`90%` / `95%` / `99%`)** — updates critical values ($z^* = 1.64, 1.96, 2.58$) and $\alpha$ thresholds (`0.10`, `0.05`, `0.01`) in real time.
- **Dynamic CI Bar & Verdict Pill** — renders the confidence interval whiskers relative to the `0.00` null line and classifies results as **Statistically Significant** (Emerald `#10B981`), **Borderline / Fragile** (Amber `#F59E0B`), or **Null / Non-Significant** (Rose `#F43F5E`).

### 3. Student Pre-Citation Audit (`src/components/CitationChecklist.tsx`)
- Interactive **"3 Questions Before You Cite This"** checklist customized for every case study.
- Expandable **Audit Finding** drawers provide source-backed answers (e.g., statistical power vs. variance, pre-registration status, Scope 1 vs. Scope 2 system boundaries, or subgroup overgeneralization) and track completion (`0/3` to `3/3 Audited`).

### 4. Accessibility-First Design (`src/components/TopNav.tsx` & `src/index.css`)
- **Atkinson Hyperlegible Mode** (`.a11y-hyperlegible`): switches typography to the Braille Institute's `Atkinson Hyperlegible` font, increases line height (`1.72` / `1.65`) and letter spacing (`0.018em` / `0.015em`), brightens muted text tokens (`#CBD5E1`), and strengthens card border contrast (`rgba(255, 255, 255, 0.24)`).
- **Web Speech API Audio Summaries** (`window.speechSynthesis`): one-click spoken briefings on both the **Overview** landing view and per-claim in the **Lab** view.
- **Tabular Monospace Numerals** (`.font-mono-tabular`): uses `JetBrains Mono` with `font-variant-numeric: tabular-nums` so fast slider scrubbing never causes layout jitter.

---

## Curated STEM Case Studies (6 Claims · 23 Milestones)

Defined in `src/data/claims.ts`, each case study compares an influential original claim against subsequent replications, meta-analyses, or telemetry audits:

| Ticker | Case Study | Field | Status | Trajectory (`First → Latest`) |
| :--- | :--- | :--- | :--- | :--- |
| `PWR-POSE` | **Power Posing & Hormones** | Social Psychology | Failed Replication | `2010: d = 0.72 (N=42)` → `2018: d = 0.04 (N=1,204)` |
| `AI-H2O` | **AI Prompt Water Footprint** | Environmental Computing | Sources Differ | `2023: 0.65 (N=50)` → `2026: 0.28 (N=1,500)` |
| `MOZART-IQ` | **The Mozart Effect & IQ** | Cognitive Neuroscience | Failed Replication | `1993: d = 0.78 (N=36)` → `2010: d = 0.02 (N=3,000)` |
| `VIT-C-RX` | **Vitamin C & Common Cold** | Clinical Epidemiology | Failed Replication | `1970: 0.55 (N=80)` → `2023: d = 0.04 (N=12,400)` |
| `GRW-MIND` | **Growth Mindset & Grades** | Educational Psychology | Sources Differ | `2007: d = 0.52 (N=373)` → `2023: d = 0.05 (N=400,000)` |
| `SMK-ONC` | **Smoking & Lung Cancer** | Oncology & Epidemiology | Verified Control | `1950: d ≈ 1.22 (N=1,465)` → `2020: d ≈ 1.38 (N=1,250,000)` |

---

## Statistical Methodology (`src/utils/stats.ts`)

All stress-test calculations execute deterministically in `computeStressTest(input)`:

1. **Bias / Outlier Attenuation**  
   Given baseline standardized effect $d_0$, sample size $N \in [20, 5000]$, and trim percentage $t \in [0, 0.30]$:
   $$d_{\text{adj}} = d_0 (1 - t), \qquad N_{\text{eff}} = \max\!\left(10,\; N (1 - 0.5t)\right)$$

2. **Two-Group Standardized Mean Difference Standard Error**  
   $$\text{SE} = \sqrt{\frac{4}{N_{\text{eff}}} + \frac{d_{\text{adj}}^2}{2 N_{\text{eff}}}}$$

3. **Z-Score & Two-Tailed *p*-Value**  
   $$Z = \frac{d_{\text{adj}}}{\text{SE}}, \qquad \Phi(z) = \frac{1}{2}\left[1 + \operatorname{erf}\!\left(\frac{z}{\sqrt{2}}\right)\right], \qquad p = 2\bigl(1 - \Phi(|Z|)\bigr)$$
   The error function `erf(x)` uses **Abramowitz & Stegun formula 7.1.26** (maximum approximation error $< 1.5 \times 10^{-7}$).

4. **Confidence Interval & Significance Verdict**  
   Using exact two-tailed critical Z-values (`1.6448536` for 90%, `1.959964` for 95%, `2.5758293` for 99%):
   $$\text{CI} = \bigl[d_{\text{adj}} - z^* \cdot \text{SE},\;\; d_{\text{adj}} + z^* \cdot \text{SE}\bigr]$$
   - **Statistically Significant**: $p < \alpha$ and $\text{CI}_{\text{lower}} > 0$
   - **Borderline / Fragile**: $p < 0.10$ (not meeting strict $\alpha$ / positive lower bound)
   - **Null / Non-Significant**: $p \ge 0.10$

> **Methodological Scope Note:** ProofLine is an educational sensitivity-analysis instrument rather than a full random-effects meta-analysis suite (it models single-benchmark asymptotic normal variance rather than heterogeneous between-study $\tau^2$ or raw participant-level data).

---

## Tech Stack

- **Framework:** React `^19.3.1` + TypeScript `~7.0.2`
- **Build Tool:** Vite `^8.3.6` (`@vitejs/plugin-react` `^6.1.2`)
- **Styling:** Tailwind CSS v4 (`tailwindcss` `^4.3.5`, `@tailwindcss/vite` `^4.3.5`)
- **Icons:** `lucide-react` `^1.80.0`
- **Linting:** `oxlint` `^1.90.0` (React, TypeScript, Oxc rules)
- **Typography & Accessibility:** Google Fonts (`Inter`, `JetBrains Mono`, `Atkinson Hyperlegible`) + Browser Web Speech API (`window.speechSynthesis`)

---

## Project Structure

```text
ProofLine/
├── index.html                          # Dark obsidian shell + Google Fonts (Inter, JetBrains Mono, Atkinson Hyperlegible)
├── package.json                        # Scripts & dependencies
├── vite.config.ts                      # Vite + React + Tailwind v4 plugin configuration
├── pitch/
│   ├── DEMO_SCRIPT.md                  # 2m30s judge presentation & screen-recording script
│   └── DEVPOST_SUBMISSION.md           # Ready-to-paste Devpost submission copy
└── src/
    ├── App.tsx                         # Top-level view routing, Hyperlegible state, Web Speech API controller
    ├── index.css                       # Obsidian theme tokens, .a11y-hyperlegible rules, .proof-slider styles
    ├── data/
    │   └── claims.ts                   # 6 curated STEM claims, 23 historical milestones, 18 citation checklist items
    ├── utils/
    │   └── stats.ts                    # Abramowitz & Stegun erf/Normal CDF & live stress-test engine
    └── components/
        ├── TopNav.tsx                  # Overview / Lab switcher, Hyperlegible & Audio Summary controls
        ├── OverviewPage.tsx            # Hero, 6-claim case study grid, and 3-pillar overview
        ├── LabPage.tsx                 # Filterable sidebar + claim workspace container
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

In accordance with STEM Innovation Challenge 2026 guidelines, we disclose that **AI coding assistants were used during development** to accelerate UI component scaffolding, TypeScript/Tailwind styling, mathematical helper implementation, and documentation drafting. All curated scientific claims, milestone statistics, citations, statistical formulas (`src/utils/stats.ts`), accessibility controls, and build/lint checks (`npm run lint`, `npm run build`) were reviewed and verified by the team.
