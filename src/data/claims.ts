export type ClaimStatus = 'verified' | 'failed-replication' | 'sources-differ';

export interface ClaimMilestone {
  year: number;
  label: string;
  study: string;
  sampleSize: number;
  /** Standardized effect size (Cohen's d equivalent) for timeline & stress test */
  effectSize: number;
  effectDisplay: string;
  pValueLabel: string;
  whyMoved: string;
}

export interface CitationChecklistItem {
  id: string;
  question: string;
  hint: string;
  evidenceAnswer: string;
}

export interface ClaimCaseStudy {
  id: string;
  ticker: string;
  shortTitle: string;
  headline: string;
  field: string;
  status: ClaimStatus;
  statusLabel: string;
  summary: string;
  audioSummary: string;
  originalCitation: string;
  latestCitation: string;
  /** Default values for the Statistical Stress-Test Engine */
  stressDefaults: {
    baselineEffect: number;
    sampleSize: number;
    biasTrimPercent: number;
  };
  milestones: ClaimMilestone[];
  checklist: CitationChecklistItem[];
}

export const CLAIMS_DATA: ClaimCaseStudy[] = [
  {
    id: 'power-posing',
    ticker: 'PWR-POSE',
    shortTitle: 'Power Posing & Testosterone',
    headline:
      'Holding expansive “power poses” for 2 minutes boosts testosterone, lowers cortisol, and increases risk tolerance.',
    field: 'Psychology',
    status: 'failed-replication',
    statusLabel: 'Failed Replication',
    summary:
      'Carney et al. (2010, N = 42, r = 0.34, +20% raw testosterone, p < 0.05) sparked a viral trend. Pre-registered replications (Ranehill et al. 2015, N = 200, p = 0.162) and a 2022 meta-analysis (Körner et al., N = 9,779, g = 0.0 hormonal) confirmed zero hormonal effect.',
    audioSummary:
      'Power Posing and Testosterone. Field: Psychology. Status: Failed Replication. The 2010 study by Carney and colleagues with 42 participants reported r equals 0.34 and plus 20 percent raw testosterone. However, Ranehill 2015 with 200 participants found no significant effect, p equals 0.162, and a 2022 meta-analysis by Körner covering 9,779 participants found g equals 0.0 for hormonal shifts.',
    originalCitation: 'Carney, Cuddy & Yap (2010), Psychological Science (N=42)',
    latestCitation: 'Körner et al. (2022) Meta-Analysis (N=9,779, g=0.0 hormonal)',
    stressDefaults: {
      baselineEffect: 0.35,
      sampleSize: 42,
      biasTrimPercent: 15,
    },
    milestones: [
      {
        year: 2010,
        label: 'Original Lab Study',
        study: 'Carney, Cuddy & Yap',
        sampleSize: 42,
        effectSize: 0.72,
        effectDisplay: 'r = 0.34 (+20% raw)',
        pValueLabel: 'p < 0.05',
        whyMoved:
          'Small lab study (N = 42) reported r = 0.34 and +20% raw testosterone shift after 2-minute expansive poses.',
      },
      {
        year: 2015,
        label: 'Direct Replication',
        study: 'Ranehill et al. (Psych. Science)',
        sampleSize: 200,
        effectSize: 0.08,
        effectDisplay: 'diff = -4.077 [-9.80, 1.65]',
        pValueLabel: 'p = 0.162',
        whyMoved:
          'Larger replication (N = 200) found testosterone difference = -4.077, 95% CI [-9.801, 1.647], p = 0.162 (non-significant).',
      },
      {
        year: 2017,
        label: 'P-Curve Audit',
        study: 'Simmons & Simonsohn (33 Studies)',
        sampleSize: 1180,
        effectSize: 0.03,
        effectDisplay: '33-study p-curve: NS',
        pValueLabel: 'NS',
        whyMoved:
          'P-curve audit of 33 studies showed evidential value indistinguishable from selective reporting and p-hacking.',
      },
      {
        year: 2022,
        label: 'Large Meta-Analysis',
        study: 'Körner et al.',
        sampleSize: 9779,
        effectSize: 0.0,
        effectDisplay: 'g = 0.0 (hormonal)',
        pValueLabel: 'NS',
        whyMoved:
          'Comprehensive synthesis across N = 9,779 confirmed g = 0.00 for hormonal changes (testosterone/cortisol).',
      },
    ],
    checklist: [
      {
        id: 'pp-1',
        question: 'Did the original study have sufficient statistical power (N ≥ 100 per group)?',
        hint: 'Check Carney et al. (2010) N = 42 against Ranehill et al. (2015) N = 200.',
        evidenceAnswer:
          'No. N = 42 total (21 per cell) was severely underpowered, inflating false-positive risk.',
      },
      {
        id: 'pp-2',
        question: 'Were the primary physiological outcomes pre-registered before data collection?',
        hint: 'Look at whether analytical choices and exclusions were locked in advance.',
        evidenceAnswer:
          'No. Lead author Dana Carney publicly stated in 2016 that data exclusions and analytical flexibility made the 2010 result unreplicable.',
      },
      {
        id: 'pp-3',
        question: 'Do large meta-analyses confirm the hormonal shift?',
        hint: 'Compare Körner et al. (2022, N = 9,779) against the 2010 finding.',
        evidenceAnswer:
          'No. Körner et al. (2022) across 9,779 participants found g = 0.0 for hormonal outcomes.',
      },
    ],
  },
  {
    id: 'ai-water-footprint',
    ticker: 'AI-H2O',
    shortTitle: 'AI Prompt Water Footprint',
    headline:
      'A short conversation of 10–50 generative AI prompts consumes roughly 500 mL of fresh water.',
    field: 'AI & Compute',
    status: 'sources-differ',
    statusLabel: 'Sources Differ',
    summary:
      'Li et al. (2023) estimated 10–50 mL per prompt including Scope 1+2 water. In 2025, OpenAI (0.32 mL/query) and Google Elsworth et al. (0.26 mL/median prompt, Scope 1 only) reported far lower direct figures, while Jegham et al. / IEA benchmarked 30 LLMs projecting 560B to 1,200B L/yr by 2030.',
    audioSummary:
      'AI Prompt Water Footprint. Field: AI and Compute. Status: Sources Differ. Li et al. in 2023 estimated 10 to 50 milliliters per prompt including Scope 1 and Scope 2 water. In 2025, OpenAI reported 0.32 milliliters per query and Google Elsworth et al. reported 0.26 milliliters per median prompt for Scope 1 only, while Jegham and the IEA project global AI water demand rising from 560 billion to 1,200 billion liters per year by 2030.',
    originalCitation: 'Li et al. (2023), UC Riverside (10–50 mL/prompt, Scope 1+2)',
    latestCitation: 'Elsworth et al. / Google (2025); Jegham et al. / IEA (2025)',
    stressDefaults: {
      baselineEffect: 0.28,
      sampleSize: 240,
      biasTrimPercent: 10,
    },
    milestones: [
      {
        year: 2023,
        label: 'Scope 1+2 Model',
        study: 'Li et al. (UC Riverside)',
        sampleSize: 50,
        effectSize: 0.65,
        effectDisplay: '10–50 mL / prompt',
        pValueLabel: 'Scope 1+2',
        whyMoved:
          'Modeled both direct evaporative cooling (Scope 1) and off-site power-plant cooling (Scope 2) on GPT-3 era hardware.',
      },
      {
        year: 2025,
        label: 'OpenAI Telemetry',
        study: 'OpenAI / Altman (June 2025)',
        sampleSize: 500,
        effectSize: 0.22,
        effectDisplay: '0.32 mL / query',
        pValueLabel: 'Direct Est.',
        whyMoved:
          'Disclosed ~0.32 mL per average ChatGPT query, reflecting newer GPU inference efficiency and direct cooling.',
      },
      {
        year: 2025,
        label: 'Google Median Audit',
        study: 'Elsworth et al. / Google (Aug 2025)',
        sampleSize: 1000,
        effectSize: 0.18,
        effectDisplay: '0.26 mL / median prompt',
        pValueLabel: 'Scope 1 Only',
        whyMoved:
          'Measured 0.26 mL per median Gemini text prompt for Scope 1 on-site cooling only, excluding upstream grid water.',
      },
      {
        year: 2025,
        label: '30-LLM Global Benchmark',
        study: 'Jegham et al. / IEA (2025)',
        sampleSize: 1500,
        effectSize: 0.34,
        effectDisplay: '560B → 1,200B L/yr (2030)',
        pValueLabel: '30 LLMs',
        whyMoved:
          'Benchmarked 30 LLMs across grid mixes, projecting global AI data center water rising from 560B to 1,200B L/yr by 2030.',
      },
    ],
    checklist: [
      {
        id: 'ai-1',
        question: 'Does the cited number include Scope 2 electricity water or only Scope 1 cooling?',
        hint: 'Compare Li et al. (Scope 1+2) vs. Google Elsworth et al. (Scope 1 only).',
        evidenceAnswer:
          'Boundary definitions drive the gap: 0.26–0.32 mL measures direct Scope 1 cooling, whereas 10–50 mL includes Scope 2 thermoelectric grid water.',
      },
      {
        id: 'ai-2',
        question: 'Which model generation and prompt length are being benchmarked?',
        hint: '2023 GPT-3 estimates differ sharply from 2025 quantized inference models.',
        evidenceAnswer:
          'Always specify the model family and prompt type; reasoning and video models consume orders of magnitude more energy and water than median text prompts.',
      },
      {
        id: 'ai-3',
        question: 'Are you separating per-prompt efficiency from aggregate 2030 global demand?',
        hint: 'Per-query water fell even as total volume (560B → 1,200B L/yr) scales up.',
        evidenceAnswer:
          'Yes—Jegham et al. / IEA show per-query efficiency gains are offset by massive global query growth.',
      },
    ],
  },
  {
    id: 'mozart-effect',
    ticker: 'MOZART-IQ',
    shortTitle: 'The Mozart Effect & IQ',
    headline:
      'Listening to Mozart sonatas for 10 minutes produces a temporary 8–9 point boost in spatial IQ.',
    field: 'Neuroscience',
    status: 'failed-replication',
    statusLabel: 'Failed Replication',
    summary:
      'Rauscher et al. (1993, N = 36) reported +8.5 spatial IQ points (p = 0.002). Chabris (1999, N = 714) found +1.4 IQ pts (p = 0.26), and Pietschnig et al. (2010, N = 3,016) found d = 0.15 vs. other music (95% CI [0.02, 0.28]) with no Mozart-specific IQ effect.',
    audioSummary:
      'The Mozart Effect and IQ. Field: Neuroscience. Status: Failed Replication. Rauscher 1993 with 36 students claimed plus 8.5 spatial IQ points, p equals 0.002. Chabris 1999 across 714 participants found only plus 1.4 points, p equals 0.26. Pietschnig 2010 across 3,016 participants found d equals 0.15 versus other music, attributable to general arousal rather than Mozart.',
    originalCitation: 'Rauscher, Shaw & Ky (1993), Nature (N=36, p=0.002)',
    latestCitation: 'Pietschnig et al. (2010), Intelligence (N=3,016, d=0.15)',
    stressDefaults: {
      baselineEffect: 0.15,
      sampleSize: 36,
      biasTrimPercent: 20,
    },
    milestones: [
      {
        year: 1993,
        label: 'Original Nature Letter',
        study: 'Rauscher, Shaw & Ky',
        sampleSize: 36,
        effectSize: 0.78,
        effectDisplay: '+8.5 spatial IQ pts',
        pValueLabel: 'p = 0.002',
        whyMoved:
          '36 undergraduates scored +8.5 spatial IQ points higher on paper-folding tasks immediately after Mozart vs. silence.',
      },
      {
        year: 1999,
        label: 'Early Meta-Analysis',
        study: 'Chabris (Nature)',
        sampleSize: 714,
        effectSize: 0.09,
        effectDisplay: '+1.4 IQ pts (d = 0.09)',
        pValueLabel: 'p = 0.26',
        whyMoved:
          'Across 714 participants, spatial gain shrank to +1.4 IQ points (p = 0.26), statistically indistinguishable from noise.',
      },
      {
        year: 2010,
        label: '39-Study Meta-Analysis',
        study: 'Pietschnig, Voracek & Formann',
        sampleSize: 3016,
        effectSize: 0.15,
        effectDisplay: 'd = 0.15 [0.02, 0.28]',
        pValueLabel: 'Arousal Only',
        whyMoved:
          'Across N = 3,016, d = 0.15 vs. silence disappeared when compared against other enjoyable music or stories (arousal-mood artifact).',
      },
    ],
    checklist: [
      {
        id: 'mz-1',
        question: 'Was the control condition matched for enjoyment and physiological arousal?',
        hint: 'Silence can bore participants compared to upbeat music.',
        evidenceAnswer:
          'No. Later trials showed enjoyable stories or Schubert produced identical scores via general mood arousal.',
      },
      {
        id: 'mz-2',
        question: 'Did the original study measure general IQ or a single short-term spatial task?',
        hint: 'Check if full-scale intelligence was tested or only 10-minute paper folding.',
        evidenceAnswer:
          'Only a 10-minute spatial-temporal subtest was used—never general intelligence or infant development.',
      },
      {
        id: 'mz-3',
        question: 'Does the Mozart-specific effect hold when compared to other music?',
        hint: 'Review Pietschnig et al. (2010, N = 3,016).',
        evidenceAnswer:
          'No. Mozart showed no advantage over other stimulating music, and affiliated labs drove the largest outliers.',
      },
    ],
  },
  {
    id: 'vitamin-c-common-cold',
    ticker: 'VIT-C-RX',
    shortTitle: 'Vitamin C & the Common Cold',
    headline:
      'Daily high-dose Vitamin C supplementation prevents the common cold and reduces symptom severity.',
    field: 'Medicine',
    status: 'sources-differ',
    statusLabel: 'Sources Differ',
    summary:
      'Ritzel (1961, N = 279 ski camp) reported -45% incidence. Later trials (Anderson 1972, N = 818; Karlowski 1975, N = 311 unblinding artifact) and Cochrane (Hemilä & Chalker 2013, N = 11,306, RR = 0.97, 95% CI [0.94, 1.00]) found null prevention in general adults, with -8% duration.',
    audioSummary:
      'Vitamin C and the Common Cold. Field: Medicine. Status: Sources Differ. Ritzel 1961 in a 279-person ski camp reported minus 45 percent cold incidence. Anderson 1972 with 818 participants found incidence non-significant, and Karlowski 1975 exposed an unblinding artifact. The 2013 Cochrane review of 11,306 participants found relative risk 0.97 for prevention, but an 8 percent reduction in adult cold duration.',
    originalCitation: 'Ritzel (1961), Helvetica Medica Acta (N=279 ski camp)',
    latestCitation: 'Hemilä & Chalker (2013), Cochrane Review (N=11,306, RR=0.97)',
    stressDefaults: {
      baselineEffect: 0.06,
      sampleSize: 1200,
      biasTrimPercent: 5,
    },
    milestones: [
      {
        year: 1961,
        label: 'Ski Camp Trial',
        study: 'Ritzel (Swiss Alps)',
        sampleSize: 279,
        effectSize: 0.55,
        effectDisplay: '-45% cold incidence',
        pValueLabel: 'Extreme Stress',
        whyMoved:
          '279 schoolchildren in an alpine ski camp showed -45% cold incidence—later recognized as specific to extreme cold/physical stress.',
      },
      {
        year: 1972,
        label: 'Large Community RCT',
        study: 'Anderson et al. (Toronto)',
        sampleSize: 818,
        effectSize: 0.14,
        effectDisplay: 'Incidence NS (-30% disability)',
        pValueLabel: 'Incidence NS',
        whyMoved:
          '818 adults showed no significant reduction in catching colds, though disability days dropped by ~30%.',
      },
      {
        year: 1975,
        label: 'Blinding Audit',
        study: 'Karlowski et al. (NIH)',
        sampleSize: 311,
        effectSize: 0.08,
        effectDisplay: 'Unblinding Artifact',
        pValueLabel: 'Placebo Bias',
        whyMoved:
          'Demonstrated that participants who guessed their pill by taste drove the apparent benefit; blinded subgroups showed no effect.',
      },
      {
        year: 2013,
        label: 'Cochrane Systematic Review',
        study: 'Hemilä & Chalker (29 Trials)',
        sampleSize: 11306,
        effectSize: 0.04,
        effectDisplay: 'RR = 0.97 [0.94, 1.00]',
        pValueLabel: '-8% duration',
        whyMoved:
          'Across 11,306 participants, routine prophylaxis failed (RR = 0.97, 95% CI [0.94, 1.00]), while daily use modestly cut adult duration by 8%.',
      },
    ],
    checklist: [
      {
        id: 'vc-1',
        question: 'Are you distinguishing cold prevention (incidence) from symptom duration?',
        hint: 'Cochrane 2013 separates RR = 0.97 (incidence) from -8% (duration).',
        evidenceAnswer:
          'Critical distinction: Vitamin C does NOT prevent colds in general adults (RR = 0.97), though daily supplementation trims duration by ~8%.',
      },
      {
        id: 'vc-2',
        question: 'Was the subgroup (e.g., Ritzel 1961 ski camp) overgeneralized?',
        hint: 'Check physical stress vs. everyday populations.',
        evidenceAnswer:
          'Yes—large incidence drops occurred only under intense physical/cold stress (skiers, marathoners), not general office or school populations.',
      },
      {
        id: 'vc-3',
        question: 'Were participants properly blinded to ascorbic acid taste?',
        hint: 'Review Karlowski et al. (1975, N = 311).',
        evidenceAnswer:
          'Unblinded guessing inflated early results; taste-matched placebos eliminated the incidence effect.',
      },
    ],
  },
  {
    id: 'growth-mindset',
    ticker: 'GRW-MIND',
    shortTitle: 'Growth Mindset Interventions & Grades',
    headline:
      'Brief growth mindset interventions meaningfully raise academic GPA across K–12 and college students.',
    field: 'Education',
    status: 'sources-differ',
    statusLabel: 'Sources Differ',
    summary:
      'Blackwell et al. (2007, N = 91) launched school-wide adoption. Sisk et al. (2018, N = 57,155) found d = 0.08 (95% CI [0.02, 0.14]), Yeager et al. (2019, N = 12,490) found d = 0.11 (p = 0.001) in lower-achieving students, and Macnamara & Burgoyne (2023, N = 97,672) found d = 0.05 overall (NS bias-corrected).',
    audioSummary:
      'Growth Mindset Interventions and Grades. Field: Education. Status: Sources Differ. Blackwell 2007 studied 91 students. Sisk 2018 across 57,155 students found d equals 0.08. Yeager 2019 in Nature with 12,490 students found plus 0.10 GPA in lower-achieving students, d equals 0.11, p equals 0.001. Macnamara and Burgoyne 2023 across 97,672 students found d equals 0.05 overall, non-significant after bias correction.',
    originalCitation: 'Blackwell, Trzesniewski & Dweck (2007), Child Dev. (N=91)',
    latestCitation: 'Yeager et al. (2019, Nature); Macnamara & Burgoyne (2023, N=97,672)',
    stressDefaults: {
      baselineEffect: 0.08,
      sampleSize: 1200,
      biasTrimPercent: 10,
    },
    milestones: [
      {
        year: 2007,
        label: 'Seminal NYC Study',
        study: 'Blackwell, Trzesniewski & Dweck',
        sampleSize: 91,
        effectSize: 0.52,
        effectDisplay: 'd = 0.52 (N = 91)',
        pValueLabel: 'p = 0.008',
        whyMoved:
          '7th graders (N = 91 in intervention RCT) taught neuroplasticity outperformed controls in math trajectory.',
      },
      {
        year: 2018,
        label: 'Large Meta-Analysis',
        study: 'Sisk et al. (Psych. Science)',
        sampleSize: 57155,
        effectSize: 0.08,
        effectDisplay: 'd = 0.08 [0.02, 0.14]',
        pValueLabel: '95% CI [0.02, 0.14]',
        whyMoved:
          'Across N = 57,155, average intervention effect dropped to d = 0.08 (95% CI [0.02, 0.14]).',
      },
      {
        year: 2019,
        label: 'National Preregistered RCT',
        study: 'Yeager et al. (Nature)',
        sampleSize: 12490,
        effectSize: 0.11,
        effectDisplay: 'd = 0.11 (+0.10 GPA)',
        pValueLabel: 'p = 0.001',
        whyMoved:
          'National trial (N = 12,490) found +0.10 GPA gain specifically in lower-achieving students (n = 6,320, d = 0.11, p = 0.001).',
      },
      {
        year: 2023,
        label: 'Bias-Corrected Meta-Analysis',
        study: 'Macnamara & Burgoyne',
        sampleSize: 97672,
        effectSize: 0.05,
        effectDisplay: 'd = 0.05 (NS bias-corr.)',
        pValueLabel: 'NS (Bias-Corr.)',
        whyMoved:
          'Across N = 97,672, overall d = 0.05 became non-significant after publication-bias and researcher-fidelity corrections.',
      },
    ],
    checklist: [
      {
        id: 'gm-1',
        question: 'Does the claim distinguish average population effect from subgroup effects?',
        hint: 'Compare Macnamara (d = 0.05 overall) vs. Yeager lower-achieving (n = 6,320, d = 0.11).',
        evidenceAnswer:
          'Overall average effect is tiny (d = 0.05–0.08); meaningful gains appear mainly in lower-achieving students in supportive school climates.',
      },
      {
        id: 'gm-2',
        question: 'Does statistical significance at N = 12,490 imply a large practical effect?',
        hint: 'Check p = 0.001 vs. +0.10 GPA magnitude.',
        evidenceAnswer:
          'At massive N, tiny effects hit p = 0.001; evaluate cost-effectiveness (+0.10 GPA for a 1-hour online module) rather than assuming large gains.',
      },
      {
        id: 'gm-3',
        question: 'Does the effect survive publication-bias correction?',
        hint: 'Check Macnamara & Burgoyne (2023, N = 97,672).',
        evidenceAnswer:
          'Overall effect becomes non-significant after bias correction, making context and fidelity critical.',
      },
    ],
  },
  {
    id: 'smoking-lung-cancer',
    ticker: 'SMK-ONC',
    shortTitle: 'Cigarette Smoking & Lung Cancer',
    headline:
      'Long-term cigarette smoking dramatically increases the risk of lung cancer mortality.',
    field: 'Medicine',
    status: 'verified',
    statusLabel: 'Verified',
    summary:
      'A textbook causal benchmark: Doll & Hill (1950, N = 1,465, p < 0.001), British Doctors Study (1964, N = 34,439, 32.4x mortality ratio, p < 0.0001), 50-year follow-up (2004, -10.0 yrs lifespan), and Gandini et al. (2008, 216 studies, RR = 8.96, 95% CI [6.73, 12.11]).',
    audioSummary:
      'Cigarette Smoking and Lung Cancer. Field: Medicine. Status: Verified. Doll and Hill 1950 with 1,465 participants found p less than 0.001. The 1964 British Doctors Study of 34,439 physicians found a 32.4 times mortality ratio, p less than 0.0001. The 50-year follow-up in 2004 showed a 10-year lifespan loss, and Gandini 2008 across 216 studies confirmed relative risk 8.96.',
    originalCitation: 'Doll & Hill (1950), BMJ (N=1,465, p<0.001)',
    latestCitation: 'Doll et al. (2004) 50-Yr; Gandini et al. (2008, 216 studies, RR=8.96)',
    stressDefaults: {
      baselineEffect: 1.25,
      sampleSize: 2500,
      biasTrimPercent: 0,
    },
    milestones: [
      {
        year: 1950,
        label: 'Case-Control Breakthrough',
        study: 'Doll & Hill (BMJ)',
        sampleSize: 1465,
        effectSize: 1.18,
        effectDisplay: 'Strong Dose-Response',
        pValueLabel: 'p < 0.001',
        whyMoved:
          'Hospital case-control study (N = 1,465) established a stark dose-response link between daily cigarettes and lung carcinoma.',
      },
      {
        year: 1964,
        label: 'British Doctors Cohort',
        study: 'Doll & Hill (Prospective)',
        sampleSize: 34439,
        effectSize: 1.38,
        effectDisplay: '32.4x mortality ratio',
        pValueLabel: 'p < 0.0001',
        whyMoved:
          'Prospective cohort of 34,439 British physicians showed heavy smokers faced a 32.4x lung cancer mortality ratio.',
      },
      {
        year: 2004,
        label: '50-Year Follow-Up',
        study: 'Doll, Peto et al. (BMJ)',
        sampleSize: 34439,
        effectSize: 1.42,
        effectDisplay: '-10.0 yrs lifespan',
        pValueLabel: 'p < 0.0001',
        whyMoved:
          'Half-century follow-up confirmed lifelong smokers lose ~10.0 years of life expectancy; quitting before 30 avoids >90% of excess risk.',
      },
      {
        year: 2008,
        label: '216-Study Meta-Analysis',
        study: 'Gandini et al. (Int. J. Cancer)',
        sampleSize: 250000,
        effectSize: 1.25,
        effectDisplay: 'RR = 8.96 [6.73, 12.11]',
        pValueLabel: 'p < 0.0001',
        whyMoved:
          'Synthesis of 216 studies confirmed RR = 8.96 (95% CI [6.73, 12.11]) globally—ProofLine’s Verified positive control.',
      },
    ],
    checklist: [
      {
        id: 'smk-1',
        question: 'Is there a clear biological dose-response gradient?',
        hint: 'Compare light, moderate, and heavy pack-year exposure.',
        evidenceAnswer:
          'Yes. Mortality scales monotonically with cigarettes/day and duration, and drops sharply upon cessation.',
      },
      {
        id: 'smk-2',
        question: 'Does the effect hold across prospective cohorts and global meta-analyses?',
        hint: 'Check British Doctors (N = 34,439) and Gandini et al. (216 studies).',
        evidenceAnswer:
          'Yes. Independent prospective cohorts worldwide reproduce RR ≈ 9–32x with p < 0.0001.',
      },
      {
        id: 'smk-3',
        question: 'Could unmeasured confounding realistically explain RR = 8.96 [6.73, 12.11]?',
        hint: 'Consider Cornfield’s inequality for sensitivity to confounding.',
        evidenceAnswer:
          'No. An unmeasured confounder would need a >9x association with both smoking and lung cancer, which is biologically implausible.',
      },
    ],
  },
];
