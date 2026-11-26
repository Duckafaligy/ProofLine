# Devpost Submission — ProofLine

> Ready-to-paste copy tailored for **STEM Innovation Challenge 2026** (*Education & Accessibility* + *Engineering & Scientific Computing*).

- **Live Deployment:** <https://proofline-lake.vercel.app>
- **GitHub Repository:** <https://github.com/Duckafaligy/ProofLine>

---

## Project Title

**ProofLine — Live Scientific Claim Replication & Statistical Stress-Test Lab**

**Tagline (Short Pitch):**  
*Track the half-life of scientific claims in real time—scrub decades of replications, stress-test confidence intervals against publication bias, and audit any study before you cite it.*

**Tracks / Categories:**  
- **Education & Accessibility**
- **Engineering & Scientific Computing**

---

## Problem

Over the past 15 years, large-scale replication initiatives across psychology, medicine, education, and computational benchmarks have revealed that splashy, small-sample findings frequently fail to replicate—yet students, educators, journalists, and policymakers still encounter scientific claims as static, timeless headlines.

Three concrete gaps cause real-world harm:
1. **Static literature hides evidence decay:** When a student finds a viral 2010 study (`N = 42`, `r = 0.34`, `p < 0.05`), search engines and PDF repositories rarely surface the 2015 direct replication (`N = 200`, `diff = -4.077`, `p = 0.162`), the 2017 *p*-curve audit (`33 studies`, `NS`), or the 2022 meta-analysis (`N = 9,779`, `g = 0.0` hormonal) right alongside it.
2. **Statistical intuition is locked behind dense math:** Concepts like statistical power, publication bias, and confidence interval overlap with zero are taught as static textbook equations rather than interactive systems where users can *feel* how changing sample size $N$ or trimming outliers transforms a verdict.
3. **Dense academic formats exclude diverse learners:** Low-contrast academic PDFs, non-tabular numbers, and visual-only charts create steep barriers for low-vision, dyslexic, and neurodivergent students.

---

## Solution & Intended Audience

**ProofLine** reimagines scientific consensus as a live, scrubbable telemetry instrument—combining familiar financial-chart ergonomics with real-time statistical computing and inclusive accessibility UX in a crisp Pure White editorial interface.

### How ProofLine Works
- **Scrub Evidence Through Time:** Right from the hero specimen or inside the **Dashboard** (via **"Check out Dashboard"**), users explore **6 peer-reviewed STEM case studies** spanning **23 historical milestones**—including **Failed Replications** (`Power Posing & Testosterone`, `The Mozart Effect & IQ`), nuanced boundary-dependent debates labeled **Sources Differ** (`AI Prompt Water Footprint`, `Vitamin C & the Common Cold`, `Growth Mindset Interventions & Grades`), and an epidemiological **Verified** positive control (`Cigarette Smoking & Lung Cancer`). Dragging across the interactive SVG scrubber reveals native study metrics, standardized trajectory values, sample sizes ($N$), $p$-values/CIs, and a plain-language **"Why the line moved"** card at every study milestone.
- **Stress-Test Claims in Real Time:** Users manipulate **Sample Size (`N` from `20` to `5,000`)**, **Bias / Outlier Trim (`0%` to `30%`)**, and **Confidence Level (`90%`, `95%`, `99%`)** to watch Standard Error, Z-score, two-tailed $p$-value, and the Confidence Interval bar physically morph across the dashed `0.00 null` threshold—flipping dynamically between **Statistically Significant**, **Borderline / Fragile**, and **Null / Non-Significant**.
- **Audit Before You Cite:** Each claim pairs quantitative telemetry with a **"3 Questions Before You Cite This"** interactive student checklist and expandable source-backed **Audit Findings**, plus one-click **Atkinson Hyperlegible** typography and pre-generated **`edge-tts` neural MP3 audio briefings** (with automatic browser **Web Speech API** fallback).

### Intended Audience
- **High School & Undergraduate STEM Students:** Learning experimental design, research literacy, and how to evaluate sources before citing them in lab reports or essays.
- **STEM Educators & Librarians:** Demonstrating statistical power, $p$-value fragility, and publication bias live on a classroom projector without requiring Python, R, or paid stats software.
- **Science Communicators, Journalists & Citizen Readers:** Rapidly checking whether a headline effect survived independent replication and boundary-condition audits.
- **Low-Vision, Dyslexic & Neurodivergent Learners:** Accessing quantitative scientific summaries via high-contrast **Atkinson Hyperlegible** typography and neural **MP3 / Web Speech** audio briefings.

---

## Technologies Used

- **Frontend Framework:** React 19 (`react` `^19.3.1`, `react-dom` `^19.3.1`)
- **Language:** TypeScript (`~7.0.2`) with strict type-checking (`tsc -b`, `verbatimModuleSyntax`, `noUnusedLocals`)
- **Build & Tooling:** Vite 8 (`^8.3.6`, `@vitejs/plugin-react` `^6.1.2`), Oxlint (`^1.90.0`)
- **Styling & Design System:** Tailwind CSS v4 (`^4.3.5` via `@tailwindcss/vite`), Lucide React (`^1.80.0`, ISC license)
- **Statistical Engine:** Custom zero-dependency TypeScript implementation (`src/utils/stats.ts`) using **Abramowitz & Stegun (7.1.26)** error-function approximation, Normal CDF $\Phi(z)$, two-group standardized effect standard error, and two-tailed CI bounds
- **Data Visualization:** Custom pointer-capture SVG trajectory chart (`src/components/ScrubberChart.tsx`) with keyboard slider support and zero external charting dependencies
- **Accessibility & Media Stack:** Google Fonts (`Atkinson Hyperlegible`, `Inter`, `JetBrains Mono` with `tabular-nums` under SIL OFL 1.1), offline-generated **`edge-tts` neural MP3 summaries** (`public/audio/*.mp3`) with `window.speechSynthesis` fallback, and CC-licensed Wikimedia Commons lab photography (`public/images/*.jpg`)

---

## Key Features

1. **Editorial Landing Overview & 6-Claim Evidence Ledger (`src/components/OverviewPage.tsx`):** Pure White Swiss-editorial landing page (`#FFFFFF` / `#09090B`) featuring an interactive **Live Specimen (`PWR-POSE`)** scrubber right below the hero, provenance explanations, a filterable **6-Claim Evidence Ledger** linking directly into the **Dashboard**, an interactive 3-step student pre-citation warm-up, and Methodology FAQ.
2. **Interactive Effect Trajectory Scrubber (`src/components/ScrubberChart.tsx`):** Cross-hair SVG chart supporting smooth mouse hover, touch/pointer drag (`setPointerCapture`), keyboard arrow navigation (`role="slider"`), and milestone pills; displays live native study metrics (`effectDisplay`), `Sample (N)`, `Significance`, normalized `Std. Effect`, the dashed `Null Threshold (d = 0.00)`, and contextual **"Why the line moved"** evidence notes.
3. **Live Statistical Stress-Test Engine (`src/components/StressTestEngine.tsx` & `src/utils/stats.ts`):** Zero-latency client-side sensitivity engine calculating:
   - Bias-attenuated effect $d_{\text{adj}} = d_0(1 - t)$ and effective sample size $N_{\text{eff}} = \max(10, N(1 - 0.5t))$
   - Two-group standardized mean difference standard error $\text{SE} = \sqrt{4/N_{\text{eff}} + d_{\text{adj}}^2 / (2 N_{\text{eff}})}$
   - Normal-approximation $Z$-score, two-tailed $p$-value via Abramowitz & Stegun `erf(x)` ($< 1.5 \times 10^{-7}$ error), and animated `90%`/`95%`/`99%` Confidence Interval whiskers relative to `0.00 null`
4. **3 Questions Before You Cite This (`src/components/CitationChecklist.tsx`):** Case-specific pre-citation verification checklist (`0/3` to `3/3 Audited`) with expandable **Audit Findings** covering statistical power, pre-registration, Scope 1 vs. Scope 2 water accounting (`AI-H2O`), taste-blinding artifacts (`VIT-C-RX`), and subgroup overgeneralization (`GRW-MIND`).
5. **Atkinson Hyperlegible & Neural Audio Accessibility (`src/components/TopNav.tsx`, `src/index.css`, `src/App.tsx`):** Instant global toggle switching to the Braille Institute's `Atkinson Hyperlegible` typeface with increased line height (`1.72`), widened letter spacing (`0.018em`), high-contrast `#18181B` muted text tokens (`.text-muted-token`), and `#09090B` card borders (`.hairline-card`)—paired with one-click neural MP3 audio briefings (`public/audio/*.mp3`) that cancel cleanly on navigation or claim switching.

---

## Challenges Encountered

1. **Unifying Heterogeneous Metrics Across Disciplines:** Real-world studies report outcomes in incompatible units—Pearson's $r$ and Hedges' $g$ (`PWR-POSE`), IQ points (`MOZART-IQ`), percentage reductions and risk ratios (`RR = 0.97` in `VIT-C-RX`, `RR = 8.96` in `SMK-ONC`), and milliliters per prompt (`0.26–50 mL` in `AI-H2O`). We preserved authentic domain units (`effectDisplay`, `pValueLabel`) in the scrubber HUD while mapping each milestone to a standardized/normalized display trajectory (`effectSize`) and documenting every conversion and DOI in [`research/claims-dataset.md`](../research/claims-dataset.md).
2. **Preventing Layout Jitter During Rapid Scrubbing:** Dragging sliders or pointer-scrubbing across chart nodes updates 6+ numeric readouts per frame. Standard proportional fonts caused horizontal width shifts during live updates. Applying `JetBrains Mono` with `font-variant-numeric: tabular-nums` (`.font-mono-tabular`) across every badge, ticker, chart label, and metric card locked numeric alignment at 60fps.
3. **Pure Client-Side Pointer & Statistical Precision:** To keep ProofLine deployable anywhere with zero backend or heavy chart dependencies, we engineered both the Abramowitz & Stegun `erf(x)` Normal CDF solver and a responsive SVG pointer-capture coordinate mapper (`getBoundingClientRect()` normalized to `viewBox`) from scratch, verifying TypeScript strictness and Oxlint compliance across every component.
4. **Balancing Scientific Rigor with Classroom Clarity:** Full hierarchical random-effects meta-analyses involve heterogeneity parameters ($\tau^2$) that can overwhelm beginners. Designing three intuitive controls—Sample Size $N$, Bias/Outlier Trim %, and Confidence Level—kept the math mathematically grounded while making fragility immediately visible.

---

## Future Improvements

1. **Custom Study / CSV Stress-Test Import:** Allow students and educators to input their own reported effect size, sample size, or upload a CSV of replication trials to generate a live ProofLine trajectory and CI stress test.
2. **Live DOI & Open-Science API Integration:** Connect to **CrossRef**, **OpenAlex**, **Retraction Watch**, and **OSF Preprints** APIs so users can look up any paper by DOI and automatically populate replication chains, corrections, and pre-registration badges.
3. **Interactive Funnel Plot & Random-Effects Meta-Analysis Mode:** Add an optional advanced view plotting inverse standard error vs. effect size to visualize Egger's regression asymmetry and DerSimonian–Laird random-effects heterogeneity ($I^2$, $\tau^2$).
4. **Shareable Claim Audit Cards & LMS Export:** Export a verified "Citation Audit Card" (Markdown / BibTeX annotation / PDF summary) summarizing a student's completed 3-question check for classroom assignments.
5. **Multilingual Neural Audio & Sonification:** Expand `edge-tts` audio briefings to additional languages and add optional audio pitch-mapping as users scrub across rising or collapsing effect sizes.

---

## Team Information

- **Duckafaligy** (`brendanhllau@gmail.com`) — Full-Stack Engineering, Statistical Modeling, Research Curation & UI/UX · <https://github.com/Duckafaligy>

---

## AI Disclosure

In full transparency and compliance with **STEM Innovation Challenge 2026** rules:  
**AI coding and writing assistants were used during this hackathon** to accelerate React/TypeScript component scaffolding, Tailwind CSS v4 styling, Abramowitz & Stegun statistical utility drafting, and pitch/documentation editing. All scientific case study data, real-world citations and DOIs (`src/data/claims.ts`, `research/claims-dataset.md`), statistical formulas (`src/utils/stats.ts`, `research/METHODOLOGY.md`), open-source asset attributions (`research/ASSET_CREDITS.md`), accessibility controls, and verification checks (`npm run lint`, `npm run build`) were independently reviewed, tested, and verified by the author.
