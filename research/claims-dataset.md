# ProofLine Research Dossier: Verified Claims Dataset

**Source of Truth:** [`src/data/claims.ts`](../src/data/claims.ts)  
**Statistical Engine:** [`research/METHODOLOGY.md`](./METHODOLOGY.md) (`src/utils/stats.ts`)  
**Media & Font Attribution:** [`research/ASSET_CREDITS.md`](./ASSET_CREDITS.md)  
**Live App:** <https://proofline-lake.vercel.app> · **Repository:** <https://github.com/Duckafaligy/ProofLine>

This dossier documents all **6 peer-reviewed STEM case studies** and **23 historical timeline milestones** embedded in ProofLine, including verified Digital Object Identifiers (DOIs) and canonical archival links.

---

## Note on Native Metrics vs. Standardized Chart Trajectory (`effectSize`)

Scientific fields report outcomes in incompatible units—Pearson's $r$, Cohen's $d$, Hedges' $g$, IQ points, risk ratios ($\text{RR}$), mortality ratios, life-expectancy deltas, and physical milliliters of cooling water per prompt.

In `src/data/claims.ts`, every milestone preserves two distinct fields:
1. **`effectDisplay` (Native Study Metric):** The authentic value and unit reported by the cited publication (e.g., `r = 0.34 (+20% raw)`, `0.26 mL / median prompt`, `RR = 0.97 [0.94, 1.00]`, `-10.0 yrs lifespan`).
2. **`effectSize` (Standardized Display Trajectory):** A non-negative Cohen's $d$-equivalent magnitude plotted on the interactive scrubber chart (`ScrubberChart.tsx`) against the dashed `Null Threshold (d = 0.00)`.
   - Where studies natively report standardized mean differences or direct conversions (`power-posing`, `mozart-effect`, `growth-mindset`), `effectSize` directly reflects $d$, $g$, or standard $r$-to-$d$ / IQ-to-$d$ scaling.
   - Where studies report physical resource volumes, relative incidence shifts, or epidemiological ratios (`ai-water-footprint`, `vitamin-c-common-cold`, `smoking-lung-cancer`), **`effectSize` is a normalized display trajectory** mapping cross-study convergence or divergence onto the shared chart axis alongside the paper's native `effectDisplay`.

---

## Portfolio Summary (6 Claims · 23 Milestones · 18 Audit Questions)

| ID | Ticker | Claim | Field | Status | Milestones | Stress-Test Defaults (`d₀`, `N`, `Trim`) |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `power-posing` | `PWR-POSE` | Power Posing & Testosterone | Psychology | **Failed Replication** | 4 (2010–2022) | `d₀ = 0.35`, `N = 42`, `15%` |
| `ai-water-footprint` | `AI-H2O` | AI Prompt Water Footprint | AI & Compute | **Sources Differ** | 4 (2023–2025) | `d₀ = 0.28`, `N = 240`, `10%` |
| `mozart-effect` | `MOZART-IQ` | The Mozart Effect & IQ | Neuroscience | **Failed Replication** | 3 (1993–2010) | `d₀ = 0.15`, `N = 36`, `20%` |
| `vitamin-c-common-cold` | `VIT-C-RX` | Vitamin C & the Common Cold | Medicine | **Sources Differ** | 4 (1961–2013) | `d₀ = 0.06`, `N = 1,200`, `5%` |
| `growth-mindset` | `GRW-MIND` | Growth Mindset Interventions & Grades | Education | **Sources Differ** | 4 (2007–2023) | `d₀ = 0.08`, `N = 1,200`, `10%` |
| `smoking-lung-cancer` | `SMK-ONC` | Cigarette Smoking & Lung Cancer | Medicine | **Verified** | 4 (1950–2008) | `d₀ = 1.25`, `N = 2,500`, `0%` |

---

## 1. Power Posing & Testosterone (`power-posing` · `PWR-POSE`)

- **Field:** Psychology
- **Status:** **Failed Replication** (`failed-replication`)
- **Headline Claim:** *"Holding expansive “power poses” for 2 minutes boosts testosterone, lowers cortisol, and increases risk tolerance."*
- **Original Citation:** Carney, Cuddy & Yap (2010), *Psychological Science* (`N = 42`)
- **Latest Consensus:** Körner et al. (2022) Meta-Analysis (`N = 9,779`, `g = 0.0` hormonal)
- **Stress-Test Defaults:** `baselineEffect = 0.35`, `sampleSize = 42`, `biasTrimPercent = 15`
- **Metric Trajectory Note:** In `claims.ts`, `effectSize` (`0.72 → 0.08 → 0.03 → 0.00`) maps the hormonal shift onto a Cohen's $d$-equivalent axis (converting the 2010 correlation $r = 0.34$ via $d \approx 2r/\sqrt{1-r^2} = 0.72$) while preserving each paper's native `effectDisplay` statistic.

### Timeline Milestones

| Year | Authors | Journal / Source | N | Native Effect (`effectDisplay`) | Chart `effectSize` | p / CI (`pValueLabel`) | What Changed (`whyMoved`) | Verified DOI / URL |
| :---: | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| **2010** | Dana R. Carney, Amy J. C. Cuddy, & Andy J. Yap | *Psychological Science*, 21(10), 1363–1368 | 42 | `r = 0.34 (+20% raw)` | `0.72` | `p < 0.05` | Small lab study (`N = 42`) reported `r = 0.34` and `+20%` raw testosterone shift after 2-minute expansive poses. | <https://doi.org/10.1177/0956797610383437> |
| **2015** | Eva Ranehill, Anna Dreber, Magnus Johannesson, Susanne Leiberg, Sunhae Sul, & Roberto A. Weber | *Psychological Science*, 26(5), 653–656 | 200 | `diff = -4.077 [-9.80, 1.65]` | `0.08` | `p = 0.162` (95% CI `[-9.801, 1.647]`) | Larger replication (`N = 200`) found testosterone difference `= -4.077`, 95% CI `[-9.801, 1.647]`, `p = 0.162` (non-significant). | <https://doi.org/10.1177/0956797614553946> |
| **2017** | Joseph P. Simmons & Uri Simonsohn (33 Studies) | *Psychological Science*, 28(5), 687–693 | 1,180 | `33-study p-curve: NS` | `0.03` | `NS` | P-curve audit of 33 studies showed evidential value indistinguishable from selective reporting and *p*-hacking. | <https://doi.org/10.1177/0956797616658563> |
| **2022** | Robert Körner, Lena Röseler, Astrid Schütz, & Brad J. Bushman | *Psychological Bulletin*, 148(1–2), 67–85 | 9,779 | `g = 0.0 (hormonal)` | `0.00` | `NS` | Comprehensive synthesis across `N = 9,779` confirmed `g = 0.00` for hormonal changes (testosterone/cortisol). | <https://doi.org/10.1037/bul0000356> |

### Pre-Citation Audit Checklist
1. **Statistical power (`N ≥ 100` per group)?** No. `N = 42` total (21 per cell) was severely underpowered, inflating false-positive risk.
2. **Pre-registered physiological outcomes?** No. Lead author Dana Carney publicly stated in 2016 that data exclusions and analytical flexibility made the 2010 result unreplicable.
3. **Meta-analytic confirmation of hormonal shift?** No. Körner et al. (2022) across `9,779` participants found `g = 0.0` for hormonal outcomes.

---

## 2. AI Prompt Water Footprint (`ai-water-footprint` · `AI-H2O`)

- **Field:** AI & Compute
- **Status:** **Sources Differ** (`sources-differ`)
- **Headline Claim:** *"A short conversation of 10–50 generative AI prompts consumes roughly 500 mL of fresh water."*
- **Original Citation:** Li et al. (2023), UC Riverside (`10–50 mL/prompt`, Scope 1+2)
- **Latest Consensus:** Elsworth et al. / Google (2025); Jegham et al. / IEA (2025)
- **Stress-Test Defaults:** `baselineEffect = 0.28`, `sampleSize = 240`, `biasTrimPercent = 10`
- **Metric Trajectory Note:** Because environmental AI studies measure physical water volumes (`mL / prompt` and global `L / yr`) rather than standardized group-mean differences, `effectSize` (`0.65 → 0.22 → 0.18 → 0.34`) is strictly a **normalized display trajectory** illustrating why per-prompt telemetry diverged from Scope 1+2 models while aggregate 2030 demand climbed. Likewise, `sampleSize` (`50`, `500`, `1,000`, `1,500`) serves as a relative benchmark-scope indicator rather than human sample size.

### Timeline Milestones

| Year | Authors | Journal / Source | Benchmark Scale (`sampleSize`) | Native Effect (`effectDisplay`) | Normalized `effectSize` | Scope / Basis (`pValueLabel`) | What Changed (`whyMoved`) | Verified DOI / URL |
| :---: | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| **2023** | Pengfei Li, Jianyi Yang, Mohammad A. Islam, & Shaolei Ren (UC Riverside) | *arXiv* preprint (`arXiv:2304.03271`) | 50 | `10–50 mL / prompt` | `0.65` | `Scope 1+2` | Modeled both direct evaporative cooling (Scope 1) and off-site power-plant cooling (Scope 2) on GPT-3 era hardware. | <https://doi.org/10.48550/arXiv.2304.03271> |
| **2025** | OpenAI / Sam Altman (June 2025) | *blog.samaltman.com* (*"The Gentle Singularity"*, June 10, 2025) | 500 | `0.32 mL / query` | `0.22` | `Direct Est.` | Disclosed `~0.32 mL` (`~0.000085 gal`) per average ChatGPT query, reflecting newer GPU inference efficiency and direct cooling. | <https://blog.samaltman.com/the-gentle-singularity> |
| **2025** | Cooper Elsworth, Keguo Huang, David Patterson, Ian Schneider, et al. (Google, Aug 2025) | *arXiv* preprint (`arXiv:2508.15734`) | 1,000 | `0.26 mL / median prompt` | `0.18` | `Scope 1 Only` | Measured `0.26 mL` per median Gemini text prompt for Scope 1 on-site cooling only, excluding upstream grid water. | <https://doi.org/10.48550/arXiv.2508.15734> |
| **2025** | Nidhal Jegham, Marwan F. Abdelatti, Lassad Elmoubarki, & Abdeltawab M. Hendawi; International Energy Agency (IEA, April 2025) | *arXiv* (`arXiv:2505.09598`) & IEA *Energy and AI* Report (Ch. 5) | 1,500 | `560B → 1,200B L/yr (2030)` | `0.34` | `30 LLMs` | Benchmarked 30 LLMs across grid mixes, projecting global AI data center water rising from `560B` to `1,200B L/yr` by 2030. | <https://arxiv.org/abs/2505.09598> · <https://www.iea.org/reports/energy-and-ai> |

### Pre-Citation Audit Checklist
1. **Scope 1 vs. Scope 2 boundary?** Boundary definitions drive the gap: `0.26–0.32 mL` measures direct Scope 1 cooling, whereas `10–50 mL` includes Scope 2 thermoelectric grid water.
2. **Model generation & prompt length specified?** Always specify the model family and prompt type; reasoning and video models consume orders of magnitude more energy and water than median text prompts.
3. **Per-prompt efficiency vs. 2030 global demand?** Jegham et al. / IEA show per-query efficiency gains are offset by massive global query growth (`560B → 1,200B L/yr`).

---

## 3. The Mozart Effect & IQ (`mozart-effect` · `MOZART-IQ`)

- **Field:** Neuroscience
- **Status:** **Failed Replication** (`failed-replication`)
- **Headline Claim:** *"Listening to Mozart sonatas for 10 minutes produces a temporary 8–9 point boost in spatial IQ."*
- **Original Citation:** Rauscher, Shaw & Ky (1993), *Nature* (`N = 36`, `p = 0.002`)
- **Latest Consensus:** Pietschnig et al. (2010), *Intelligence* (`N = 3,016`, `d = 0.15`)
- **Stress-Test Defaults:** `baselineEffect = 0.15`, `sampleSize = 36`, `biasTrimPercent = 20`
- **Metric Trajectory Note:** The 1993 milestone converts the reported `+8.5 spatial IQ pts` contrast against silence into a normalized standardized display magnitude (`effectSize = 0.78`), while 1999 (`d = 0.09`) and 2010 (`d = 0.15`) directly plot the meta-analytic Cohen's $d$ estimates (`effectDisplay`).

### Timeline Milestones

| Year | Authors | Journal | N | Native Effect (`effectDisplay`) | Chart `effectSize` | p / CI (`pValueLabel`) | What Changed (`whyMoved`) | Verified DOI |
| :---: | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| **1993** | Frances H. Rauscher, Gordon L. Shaw, & Katherine N. Ky | *Nature*, 365, 611 | 36 | `+8.5 spatial IQ pts` | `0.78` | `p = 0.002` | 36 undergraduates scored `+8.5` spatial IQ points higher on paper-folding tasks immediately after Mozart vs. silence. | <https://doi.org/10.1038/365611a0> |
| **1999** | Christopher F. Chabris | *Nature*, 400, 826–827 | 714 | `+1.4 IQ pts (d = 0.09)` | `0.09` | `p = 0.26` | Across 714 participants, spatial gain shrank to `+1.4` IQ points (`p = 0.26`), statistically indistinguishable from noise. | <https://doi.org/10.1038/23608> |
| **2010** | Jakob Pietschnig, Martin Voracek, & Anton K. Formann (39 Studies) | *Intelligence*, 38(3), 314–323 | 3,016 | `d = 0.15 [0.02, 0.28]` | `0.15` | `Arousal Only` (`95% CI [0.02, 0.28]`) | Across `N = 3,016`, `d = 0.15` vs. silence disappeared when compared against other enjoyable music or stories (arousal-mood artifact). | <https://doi.org/10.1016/j.intell.2010.03.001> |

### Pre-Citation Audit Checklist
1. **Arousal-matched control condition?** No. Later trials showed enjoyable stories or Schubert produced identical scores via general mood arousal.
2. **General IQ vs. short-term spatial task?** Only a 10-minute spatial-temporal subtest was used—never general intelligence or infant development.
3. **Mozart-specific effect vs. other music?** No. Mozart showed no advantage over other stimulating music, and affiliated labs drove the largest outliers.

---

## 4. Vitamin C & the Common Cold (`vitamin-c-common-cold` · `VIT-C-RX`)

- **Field:** Medicine
- **Status:** **Sources Differ** (`sources-differ`)
- **Headline Claim:** *"Daily high-dose Vitamin C supplementation prevents the common cold and reduces symptom severity."*
- **Original Citation:** Ritzel (1961), *Helvetica Medica Acta* (`N = 279` ski camp)
- **Latest Consensus:** Hemilä & Chalker (2013), *Cochrane Review* (`N = 11,306`, `RR = 0.97`)
- **Stress-Test Defaults:** `baselineEffect = 0.06`, `sampleSize = 1200`, `biasTrimPercent = 5`
- **Metric Trajectory Note:** Because clinical cold trials report incidence percentage drops (`-45%`), disability-day reductions (`-30%`), and Cochrane risk ratios (`RR = 0.97`), **`effectSize` (`0.55 → 0.14 → 0.08 → 0.04`) is a normalized display trajectory** mapping general-population prophylactic efficacy toward zero alongside each trial's native `effectDisplay` metric.

### Timeline Milestones

| Year | Authors | Journal | N | Native Effect (`effectDisplay`) | Normalized `effectSize` | p / CI / Context (`pValueLabel`) | What Changed (`whyMoved`) | Verified DOI / Archival Link |
| :---: | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| **1961** | G. Ritzel (Swiss Alps) | *Helvetica Medica Acta*, 28, 63–68 | 279 | `-45% cold incidence` | `0.55` | `Extreme Stress` | 279 schoolchildren in an alpine ski camp showed `-45%` cold incidence—later recognized as specific to extreme cold/physical stress. | <https://pubmed.ncbi.nlm.nih.gov/13741912/> (PMID `13741912`) |
| **1972** | T. W. Anderson, D. B. Reid, & G. H. Beaton (Toronto) | *Canadian Medical Association Journal* (*CMAJ*), 107(6), 503–508 | 818 | `Incidence NS (-30% disability)` | `0.14` | `Incidence NS` | 818 adults showed no significant reduction in catching colds, though disability days dropped by `~30%`. | <https://pubmed.ncbi.nlm.nih.gov/5057006/> (`PMC1940935`) |
| **1975** | T. R. Karlowski, T. C. Chalmers, L. D. Frenkel, A. Z. Kapikian, T. L. Lewis, & J. M. Lynch (NIH) | *JAMA*, 231(10), 1038–1042 | 311 | `Unblinding Artifact` | `0.08` | `Placebo Bias` | Demonstrated that participants who guessed their pill by taste drove the apparent benefit; blinded subgroups showed no effect. | <https://doi.org/10.1001/jama.1975.03240220018013> |
| **2013** | Harri Hemilä & Elizabeth Chalker (29 Trials) | *Cochrane Database of Systematic Reviews*, 2013(1), CD000980 | 11,306 | `RR = 0.97 [0.94, 1.00]` | `0.04` | `-8% duration` (95% CI `[0.94, 1.00]`) | Across `11,306` participants, routine prophylaxis failed (`RR = 0.97`, 95% CI `[0.94, 1.00]`), while daily use modestly cut adult duration by `8%`. | <https://doi.org/10.1002/14651858.CD000980.pub4> |

### Pre-Citation Audit Checklist
1. **Incidence vs. symptom duration?** Vitamin C does **not** prevent colds in general adults (`RR = 0.97`), though daily supplementation trims adult duration by `~8%`.
2. **Subgroup overgeneralization (Ritzel 1961)?** Large incidence drops occurred only under intense physical/cold stress (skiers, marathoners), not general office or school populations.
3. **Taste-matched blinding?** Unblinded guessing inflated early results (Karlowski et al. 1975); taste-matched placebos eliminated the incidence effect.

---

## 5. Growth Mindset Interventions & Grades (`growth-mindset` · `GRW-MIND`)

- **Field:** Education
- **Status:** **Sources Differ** (`sources-differ`)
- **Headline Claim:** *"Brief growth mindset interventions meaningfully raise academic GPA across K–12 and college students."*
- **Original Citation:** Blackwell, Trzesniewski & Dweck (2007), *Child Development* (`N = 91`)
- **Latest Consensus:** Yeager et al. (2019, *Nature*); Macnamara & Burgoyne (2023, `N = 97,672`)
- **Stress-Test Defaults:** `baselineEffect = 0.08`, `sampleSize = 1200`, `biasTrimPercent = 10`
- **Metric Trajectory Note:** All four milestones plot standardized mean differences ($d$) directly (`0.52 → 0.08 → 0.11 → 0.05`), matching the native reported Cohen's $d$ metrics.

### Timeline Milestones

| Year | Authors | Journal | N | Native Effect (`effectDisplay`) | Chart `effectSize` | p / CI (`pValueLabel`) | What Changed (`whyMoved`) | Verified DOI |
| :---: | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| **2007** | Lisa S. Blackwell, Kali H. Trzesniewski, & Carol S. Dweck | *Child Development*, 78(1), 246–263 | 91 | `d = 0.52 (N = 91)` | `0.52` | `p = 0.008` | 7th graders (`N = 91` in intervention RCT) taught neuroplasticity outperformed controls in math trajectory. | <https://doi.org/10.1111/j.1467-8624.2007.00995.x> |
| **2018** | Victoria F. Sisk, Alexander P. Burgoyne, Jingze Sun, Jennifer L. Butler, & Brooke N. Macnamara | *Psychological Science*, 29(4), 549–571 | 57,155 | `d = 0.08 [0.02, 0.14]` | `0.08` | `95% CI [0.02, 0.14]` | Across `N = 57,155`, average intervention effect dropped to `d = 0.08` (95% CI `[0.02, 0.14]`). | <https://doi.org/10.1177/0956797617739704> |
| **2019** | David S. Yeager, Paul Hanselman, Gregory M. Walton, et al. | *Nature*, 573(7774), 364–369 | 12,490 | `d = 0.11 (+0.10 GPA)` | `0.11` | `p = 0.001` | National trial (`N = 12,490`) found `+0.10` GPA gain specifically in lower-achieving students (`n = 6,320`, `d = 0.11`, `p = 0.001`). | <https://doi.org/10.1038/s41586-019-1466-y> |
| **2023** | Brooke N. Macnamara & Alexander P. Burgoyne | *Psychological Bulletin*, 149(3–4), 133–173 | 97,672 | `d = 0.05 (NS bias-corr.)` | `0.05` | `NS (Bias-Corr.)` | Across `N = 97,672`, overall `d = 0.05` became non-significant after publication-bias and researcher-fidelity corrections. | <https://doi.org/10.1037/bul0000352> |

### Pre-Citation Audit Checklist
1. **Average effect vs. subgroup effects?** Overall average effect is tiny (`d = 0.05–0.08`); meaningful gains appear mainly in lower-achieving students in supportive school climates (`n = 6,320`, `d = 0.11`).
2. **Statistical significance vs. practical magnitude?** At massive `N` (`12,490`), tiny effects hit `p = 0.001`; evaluate cost-effectiveness (`+0.10 GPA` for a 1-hour online module) rather than assuming large gains.
3. **Publication-bias survival?** Overall effect becomes non-significant after bias correction in Macnamara & Burgoyne (2023, `N = 97,672`), making context and fidelity critical.

---

## 6. Cigarette Smoking & Lung Cancer (`smoking-lung-cancer` · `SMK-ONC`)

- **Field:** Medicine
- **Status:** **Verified** (`verified` — ProofLine's positive control)
- **Headline Claim:** *"Long-term cigarette smoking dramatically increases the risk of lung cancer mortality."*
- **Original Citation:** Doll & Hill (1950), *BMJ* (`N = 1,465`, `p < 0.001`)
- **Latest Consensus:** Doll et al. (2004) 50-Yr; Gandini et al. (2008, 216 studies, `RR = 8.96`)
- **Stress-Test Defaults:** `baselineEffect = 1.25`, `sampleSize = 2500`, `biasTrimPercent = 0`
- **Metric Trajectory Note:** Epidemiological benchmarks report dose-response trends, mortality ratios (`32.4x`), life-expectancy deltas (`-10.0 yrs`), and pooled relative risk (`RR = 8.96`). In `claims.ts`, **`effectSize` (`1.18 → 1.38 → 1.42 → 1.25`) is a normalized Cohen's $d$-equivalent display trajectory** (consistent with standard $\ln(\text{RR}) \cdot \sqrt{3}/\pi \approx 1.21$ for `RR = 8.96`) so the Verified positive control remains comparable on the shared chart axis alongside each study's native `effectDisplay`.

### Timeline Milestones

| Year | Authors | Journal | N | Native Effect (`effectDisplay`) | Normalized `effectSize` | p / CI (`pValueLabel`) | What Changed (`whyMoved`) | Verified DOI |
| :---: | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| **1950** | Richard Doll & A. Bradford Hill | *British Medical Journal (BMJ)*, 2(4682), 739–748 | 1,465 | `Strong Dose-Response` | `1.18` | `p < 0.001` | Hospital case-control study (`N = 1,465`) established a stark dose-response link between daily cigarettes and lung carcinoma. | <https://doi.org/10.1136/bmj.2.4682.739> |
| **1964** | Richard Doll & A. Bradford Hill (Prospective) | *British Medical Journal (BMJ)*, 1(5395–5396), 1399–1410 & 1460–1467 | 34,439 | `32.4x mortality ratio` | `1.38` | `p < 0.0001` | Prospective cohort of `34,439` British physicians showed heavy smokers faced a `32.4x` lung cancer mortality ratio. | <https://doi.org/10.1136/bmj.1.5395.1399> · <https://doi.org/10.1136/bmj.1.5396.1460> |
| **2004** | Richard Doll, Richard Peto, Jillian Boreham, & Isabelle Sutherland | *BMJ*, 328(7455), 1519 | 34,439 | `-10.0 yrs lifespan` | `1.42` | `p < 0.0001` | Half-century follow-up confirmed lifelong smokers lose `~10.0` years of life expectancy; quitting before 30 avoids `>90%` of excess risk. | <https://doi.org/10.1136/bmj.38142.554479.AE> |
| **2008** | Sara Gandini, Eva Botteri, Simona Iodice, Mathieu Boniol, Albert B. Lowenfels, Patrick Maisonneuve, & Peter Boyle (216 Studies) | *International Journal of Cancer*, 122(1), 155–164 | 250,000 | `RR = 8.96 [6.73, 12.11]` | `1.25` | `p < 0.0001` (95% CI `[6.73, 12.11]`) | Synthesis of 216 studies confirmed `RR = 8.96` (95% CI `[6.73, 12.11]`) globally—ProofLine's Verified positive control. | <https://doi.org/10.1002/ijc.23033> |

### Pre-Citation Audit Checklist
1. **Biological dose-response gradient?** Yes. Mortality scales monotonically with cigarettes/day and duration, and drops sharply upon cessation.
2. **Replication across prospective cohorts and global meta-analyses?** Yes. Independent prospective cohorts worldwide reproduce `RR ≈ 9–32x` with `p < 0.0001`.
3. **Sensitivity to unmeasured confounding (Cornfield's inequality)?** No unmeasured confounder could plausibly explain `RR = 8.96 [6.73, 12.11]`; it would require a `>9x` association with both smoking and lung cancer.
