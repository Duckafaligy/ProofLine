# ProofLine Statistical Methodology (`src/utils/stats.ts`)

**Implementation Source:** [`src/utils/stats.ts`](../src/utils/stats.ts)  
**UI Integration:** [`src/components/StressTestEngine.tsx`](../src/components/StressTestEngine.tsx)  
**Dataset Specification:** [`research/claims-dataset.md`](./claims-dataset.md)

ProofLine's **Live Statistical Stress-Test Engine** is a deterministic, zero-dependency TypeScript module that lets students, educators, and researchers perturb a claim's baseline standardized effect size ($d_0$) across simulated sample sizes, publication-bias / outlier attenuation levels, and two-tailed confidence thresholds at 60fps.

---

## 1. Inputs & Parameter Bounds

`computeStressTest(input: StressTestInput)` accepts four inputs:

| Parameter | Type | Code Clamping / Domain | Description |
| :--- | :--- | :--- | :--- |
| `baselineEffect` ($d_0$) | `number` | Unclamped (claim defaults `0.06` to `1.25`) | Baseline standardized effect size (Cohen's $d$ equivalent) from `claim.stressDefaults.baselineEffect`. |
| `sampleSize` ($N$) | `number` | `Math.max(20, Math.min(5000, input.sampleSize))` | Total simulated two-group sample size ($N \in [20, 5000]$, slider step `10`). |
| `biasTrimPercent` ($t_{\%}$) | `number` | `trimFraction = Math.max(0, Math.min(0.3, input.biasTrimPercent / 100))` | Publication-bias / outlier trim fraction ($t \in [0, 0.30]$, slider `0%`–`30%`, step `1%`). |
| `confidenceLevel` ($C$) | `90 \| 95 \| 99` | Exact discrete union `{90, 95, 99}` | Two-tailed confidence level determining $\alpha$ and $z^*$. |

---

## 2. Step-by-Step Mathematical Pipeline

### 2.1 Bias-Trim Attenuation (`adjustedEffect`)
Optimistic initial studies often overestimate true effects due to selective reporting, analytical flexibility, or extreme outliers. The engine attenuates the baseline effect linearly by the trim fraction $t$:

$$d_{\text{adj}} = d_0 \cdot (1 - t)$$

- At `0%` trim ($t = 0$), $d_{\text{adj}} = d_0$.
- At `30%` trim ($t = 0.30$), $d_{\text{adj}} = 0.70\,d_0$.

### 2.2 Effective Sample Size (`effectiveN`)
Removing extreme observations or adjusting for selective-study attrition reduces usable statistical information. ProofLine reduces effective sample size by half the trim fraction, floored at `10` participants to keep variance strictly finite:

$$N_{\text{eff}} = \max\bigl(10,\; N \cdot (1 - 0.5\,t)\bigr)$$

- Example: At $N = 42$ and `15%` trim ($t = 0.15$), $N_{\text{eff}} = 42 \times 0.925 = 38.85$.
- At $N = 20$ and `30%` trim ($t = 0.30$), $N_{\text{eff}} = 20 \times 0.85 = 17.0 > 10$.

### 2.3 Two-Group Cohen's $d$ Standard Error (`standardError`)
Assuming a balanced two-group design ($n_1 = n_2 = N_{\text{eff}} / 2$, so $\frac{n_1 + n_2}{n_1 n_2} = \frac{4}{N_{\text{eff}}}$), ProofLine computes the standard asymptotic variance of Cohen's $d$:

$$\text{SE}(d_{\text{adj}}) = \sqrt{\frac{4}{N_{\text{eff}}} + \frac{d_{\text{adj}}^2}{2\,N_{\text{eff}}}}$$

This matches the classic Hedges & Olkin (1985) large-sample variance formula for standardized mean differences under equal group sizes.

### 2.4 Z-Score (`zScore`)
The two-sided Wald test statistic against the null hypothesis $H_0: \delta = 0$ is:

$$Z = \begin{cases} \dfrac{d_{\text{adj}}}{\text{SE}}, & \text{if } \text{SE} > 0 \\ 0, & \text{otherwise} \end{cases}$$

### 2.5 Error Function `erf(x)` — Abramowitz & Stegun (1964) Formula 7.1.26
To avoid external numerical dependencies, `erf(x)` implements the classic rational approximation from **Abramowitz & Stegun, *Handbook of Mathematical Functions* (1964), Formula 7.1.26** (maximum absolute error $|\epsilon(x)| < 1.5 \times 10^{-7}$):

Let $s = \operatorname{sign}(x)$ (`-1` if $x < 0$, else `1`) and $u = |x|$. Define:

$$t = \frac{1}{1 + p\,u}, \qquad p = 0.3275911$$

$$\operatorname{erf}(x) \approx s \cdot \Bigl[1 - \bigl(a_1 t + a_2 t^2 + a_3 t^3 + a_4 t^4 + a_5 t^5\bigr)\,e^{-u^2}\Bigr]$$

Exact constants implemented in `src/utils/stats.ts` (Horner's method):
- $a_1 = 0.254829592$
- $a_2 = -0.284496736$
- $a_3 = 1.421413741$
- $a_4 = -1.453152027$
- $a_5 = 1.061405429$

### 2.6 Standard Normal CDF `normalCdf(z)` & Two-Tailed P-Value `twoTailedPValue(z)`
The standard normal cumulative distribution function $\Phi(z)$ is evaluated from `erf`:

$$\Phi(z) = \frac{1}{2}\left[1 + \operatorname{erf}\!\left(\frac{z}{\sqrt{2}}\right)\right]$$

where $\sqrt{2}$ uses `Math.SQRT2`. The two-tailed *p*-value is clamped to $[0, 1]$:

$$p = \max\Bigl(0,\; \min\Bigl(1,\; 2 \cdot \bigl(1 - \Phi(|Z|)\bigr)\Bigr)\Bigr)$$

### 2.7 Confidence Intervals (`90%`, `95%`, `99%`)
`zCriticalForConfidence(level)` returns exact two-tailed normal quantiles $z^* = \Phi^{-1}(1 - \alpha/2)$ where $\alpha = 1 - C/100$:

| Confidence Level ($C$) | Significance Level ($\alpha$) | Exact Critical $z^*$ in `stats.ts` |
| :---: | :---: | :--- |
| `90%` | `0.10` | `1.6448536` |
| `95%` | `0.05` | `1.959964` |
| `99%` | `0.01` | `2.5758293` |

Confidence interval bounds are computed symmetrically around the bias-adjusted effect:

$$\text{margin} = z^* \cdot \text{SE}, \qquad \text{CI}_{\text{lower}} = d_{\text{adj}} - \text{margin}, \qquad \text{CI}_{\text{upper}} = d_{\text{adj}} + \text{margin}$$

In `StressTestEngine.tsx`, the interactive CI whisker bar dynamically fits the domain:

$$\bigl[\min(-0.4,\; \text{CI}_{\text{lower}} - 0.15),\;\; \max(1.5,\; \text{CI}_{\text{upper}} + 0.15)\bigr]$$

so users can visually track whether the lower whisker stays clear of or crosses the `0.00 null` dashed reference line.

### 2.8 Significance Verdict Thresholds
`computeStressTest` classifies every parameter combination into one of three `SignificanceVerdict` states (`src/utils/stats.ts`, lines 109–114):

| Verdict Key | UI Badge Label (`StressTestEngine.tsx`) | Exact Decision Rule in `stats.ts` | Accent Hex |
| :--- | :--- | :--- | :--- |
| `'significant'` | **Statistically Significant** | `pValue < alpha && ciLower > 0` | `#15803D` (Emerald) |
| `'borderline'` | **Borderline / Fragile** | Else if `pValue < 0.1` | `#B45309` (Amber) |
| `'null'` | **Null / Non-Significant** | Else (`pValue >= 0.1`) | `#DC2626` (Red) |

Note on directional guard: requiring `ciLower > 0` in addition to `pValue < alpha` ensures positive directional survival above `0.00` for `'significant'` classification. Note also that at `90%` confidence ($\alpha = 0.10$), `pValue < alpha` and `ciLower > 0` are algebraically equivalent for $d_{\text{adj}} > 0$ (up to floating-point rounding in `erf`).

### 2.9 Display Formatting Helpers
- `formatPValue(p)`:
  - `p < 0.0001` $\rightarrow$ `'p < 0.0001'`
  - `p < 0.001` $\rightarrow$ `p = ${p.toFixed(4)}`
  - Otherwise $\rightarrow$ `p = ${p.toFixed(3)}`
- `formatSampleSize(n)`: rounds `n` via `Math.round(n)` and formats with `new Intl.NumberFormat('en-US')`.

---

## 3. Educational Scope & Methodological Limitations

ProofLine is designed as an **interactive statistical literacy and sensitivity-analysis simulator**, not a replacement for formal meta-analytic inference software (e.g., `metafor` in R or Stata). Users and educators should keep four limitations in mind:

1. **Single-Benchmark Model vs. Random-Effects Meta-Analysis:**  
   The engine perturbs a single representative baseline effect $d_0$ and sample size $N$. It does not pool multi-study inverse-variance weights or estimate between-study heterogeneity ($\tau^2$, $I^2$), which are central to formal meta-analyses (such as Körner et al. 2022 or Macnamara & Burgoyne 2023).
2. **Normal Approximation vs. Student's $t$ Distribution:**  
   P-values and confidence intervals use standard normal quantiles ($z^*$) rather than exact Student's $t_{N-2}$ critical values. While virtually identical for $N \ge 100$, normal intervals are slightly narrower than $t$-intervals near the lower slider floor ($N = 20$).
3. **Linear Bias-Trim Heuristic vs. Selection Models:**  
   The `0%`–`30%` Bias / Outlier Trim slider models effect shrinkage (`1 - t`) and sample attrition (`1 - 0.5t`) transparently so students can build intuition for fragility. Unlike Duval–Tweedie trim-and-fill, PET-PEESE, or Vevea–Hedges weight-function models, it does not infer asymmetry directly from a funnel plot of individual studies.
4. **Standardized Axis for Non-$d$ Disciplines:**  
   For case studies whose native publications report non-$d$ metrics (`AI-H2O` in mL/prompt, `VIT-C-RX` in risk ratios/percentage reductions, `SMK-ONC` in mortality ratios/relative risks), `stressDefaults.baselineEffect` and `milestones[].effectSize` operate on a normalized $d$-equivalent scale. Stress-test outputs for those claims illustrate how sample size and bias attenuation govern confidence interval width and statistical fragility on a standardized scale rather than computing literal mL or log-RR bounds.
