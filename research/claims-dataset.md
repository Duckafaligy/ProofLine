# ProofLine Research Dataset & Statistical Methodology

This document records the 6 web-verified STEM case studies embedded in `src/data/claims.ts` and the statistical stress-test equations implemented in `src/utils/stats.ts`.

---

## 1. Web-Verified Case Studies Overview

| ID | Claim | Field | Status | Timeline Milestones |
| :--- | :--- | :--- | :--- | :--- |
| `power-posing` | Power Posing & Testosterone | Psychology | **Failed Replication** | **2010** Carney et al. (`N=42`, `r=0.34`, `+20% raw`, `p<0.05`) → **2015** Ranehill et al. (`N=200`, `diff=-4.077`, `95% CI [-9.801, 1.647]`, `p=0.162`) → **2017** Simmons & Simonsohn (`33 studies p-curve`, `NS`) → **2022** Körner et al. (`N=9,779`, `g=0.0 hormonal`) |
| `ai-water-footprint` | AI Prompt Water Footprint | AI & Compute | **Sources Differ** | **2023** Li et al. (`10–50 mL/prompt`, `Scope 1+2`) → **June 2025** OpenAI Altman (`0.32 mL/query`) → **Aug 2025** Google Elsworth et al. (`0.26 mL/median prompt`, `Scope 1 only`) → **2025** Jegham et al. / IEA (`30 LLMs benchmarked`, `560B → 1,200B L/yr by 2030`) |
| `mozart-effect` | The Mozart Effect & IQ | Neuroscience | **Failed Replication** | **1993** Rauscher et al. (`N=36`, `+8.5 spatial IQ pts`, `p=0.002`) → **1999** Chabris (`N=714`, `+1.4 IQ pts`, `p=0.26`) → **2010** Pietschnig et al. (`N=3,016`, `d=0.15` vs other music, `95% CI [0.02, 0.28]`) |
| `vitamin-c-common-cold` | Vitamin C & the Common Cold | Medicine | **Sources Differ** | **1961** Ritzel (`N=279` ski camp, `-45% incidence`) → **1972** Anderson et al. (`N=818`, incidence `NS`, `-30% disability days`) → **1975** Karlowski et al. (`N=311`, unblinding artifact) → **2013** Hemilä & Chalker Cochrane (`N=11,306`, `RR=0.97`, `95% CI [0.94, 1.00]`; `-8% adult duration`) |
| `growth-mindset` | Growth Mindset Interventions & Grades | Education | **Sources Differ** | **2007** Blackwell et al. (`N=91`) → **2018** Sisk et al. (`N=57,155`, `d=0.08`, `95% CI [0.02, 0.14]`) → **2019** Yeager et al. Nature (`N=12,490`, `+0.10 GPA` in low-achieving `n=6,320`, `d=0.11`, `p=0.001`) → **2023** Macnamara & Burgoyne (`N=97,672`, `d=0.05` overall, `NS` bias-corrected) |
| `smoking-lung-cancer` | Cigarette Smoking & Lung Cancer | Medicine | **Verified** | **1950** Doll & Hill (`N=1,465`, `p<0.001`) → **1964** Doll & Hill British Doctors (`N=34,439`, `32.4x mortality ratio`, `p<0.0001`) → **2004** Doll et al. 50-yr (`N=34,439`, `-10.0 yrs lifespan`) → **2008** Gandini et al. (`216 studies`, `RR=8.96`, `95% CI [6.73, 12.11]`) |

---

## 2. Live Statistical Stress-Test Engine (`src/utils/stats.ts`)

### Inputs
- **Baseline Effect ($d_0$)**: Standardized effect size for the selected claim.
- **Sample Size ($N \in [20, 5000]$)**: Total simulated participants.
- **Publication Bias / Outlier Trim ($t \in [0\%, 30\%]$)**: Fraction by which optimistic effect-size inflation is attenuated and effective sample size is reduced.
- **Confidence Level ($C \in \{90\%, 95\%, 99\%\}$)**: Determines two-tailed critical $z^*$ (`1.6449`, `1.9600`, `2.5758`) and $\alpha = 1 - C/100$.

### Equations
1. **Bias-Adjusted Effect Size**:
   $$d_{\text{adj}} = d_0 \cdot \left(1 - \frac{t}{100}\right)$$
2. **Effective Sample Size & Standard Error (Hedges/Cohen two-group approximation)**:
   $$N_{\text{eff}} = \max\left(10,\; N \cdot \left(1 - 0.5 \cdot \frac{t}{100}\right)\right)$$
   $$SE(d_{\text{adj}}) = \sqrt{\frac{4}{N_{\text{eff}}} + \frac{d_{\text{adj}}^2}{2 N_{\text{eff}}}}$$
3. **Z-Score & Two-Tailed P-Value**:
   $$Z = \frac{d_{\text{adj}}}{SE}, \qquad p = 2 \cdot \left(1 - \Phi(|Z|)\right)$$
   where $\Phi(z) = \frac{1}{2}\left(1 + \operatorname{erf}\left(\frac{z}{\sqrt{2}}\right)\right)$ is computed via the Abramowitz & Stegun (1964) 7.1.26 rational approximation ($\max |\epsilon| < 1.5 \times 10^{-7}$).
4. **Confidence Interval & Verdict**:
   $$CI = \left[d_{\text{adj}} - z^* \cdot SE,\;\; d_{\text{adj}} + z^* \cdot SE\right]$$
   - **Statistically Significant**: $p < \alpha$ and $CI_{\text{lower}} > 0$
   - **Borderline / Fragile**: $\alpha \le p < 0.10$
   - **Null / Non-Significant**: $p \ge 0.10$ or $CI$ spans zero without significance
