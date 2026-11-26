# ProofLine Open-Source Assets & Attribution Credits

All media, neural audio briefings, typography, and UI iconography bundled or loaded by ProofLine are sourced from open-licensed projects or Creative Commons repositories.

---

## 1. Photography (`public/images/*.jpg`)

| Local Asset Path | File Size | Wikimedia Commons Source | Author | Verified License | Where Used |
| :--- | :---: | :--- | :--- | :--- | :--- |
| [`public/images/microscope-audit.jpg`](../public/images/microscope-audit.jpg) | 136,685 bytes | [`File:Doctor looking in the microscope.jpg`](https://commons.wikimedia.org/wiki/File:Doctor_looking_in_the_microscope.jpg) (originally via Flickr) | **Nenad Stojkovic** | **CC BY 2.0** (Creative Commons Attribution 2.0 Generic) | `src/components/OverviewPage.tsx` ("Replication Audit Protocol" figure) |
| [`public/images/lab-research.jpg`](../public/images/lab-research.jpg) | 155,987 bytes | [`File:Scientists are working in the lab.9.jpg`](https://commons.wikimedia.org/wiki/File:Scientists_are_working_in_the_lab.9.jpg) (Wiki Science Competition 2017) | **Yakuzakorat** | **CC BY 4.0** (Creative Commons Attribution 4.0 International) | `src/components/OverviewPage.tsx` ("Built for Open STEM Education" figure) |

**Attribution Note:** Both photographs are redistributed under permissive Creative Commons Attribution licenses (**CC BY 2.0** and **CC BY 4.0**). Note that inline caption summaries in `src/components/OverviewPage.tsx` and the footer of `src/App.tsx` briefly refer to Wikimedia photography as `CC BY-SA` / `CC BY-SA 4.0`; the exact verified Wikimedia Commons file licenses are **CC BY 2.0** and **CC BY 4.0** as listed above.

---

## 2. Neural Audio Summaries (`public/audio/*.mp3`)

Pre-rendered neural speech summaries are served statically from `public/audio/` with automatic fallback to the browser's built-in **Web Speech API** (`window.speechSynthesis` in `src/App.tsx`):

| Audio File | File Size | Trigger Context in `src/App.tsx` | Spoken Content |
| :--- | :---: | :--- | :--- |
| [`public/audio/overview.mp3`](../public/audio/overview.mp3) | 109,584 bytes | Overview landing view (`TopNav` audio button) | Overview introduction to ProofLine |
| [`public/audio/power-posing.mp3`](../public/audio/power-posing.mp3) | 205,344 bytes | Dashboard (`claim === 'power-posing'`) | `CLAIMS_DATA[0].audioSummary` |
| [`public/audio/ai-water-footprint.mp3`](../public/audio/ai-water-footprint.mp3) | 79,200 bytes | Dashboard (`claim === 'ai-water-footprint'`) | `CLAIMS_DATA[1].audioSummary` |
| [`public/audio/mozart-effect.mp3`](../public/audio/mozart-effect.mp3) | 148,320 bytes | Dashboard (`claim === 'mozart-effect'`) | `CLAIMS_DATA[2].audioSummary` |
| [`public/audio/vitamin-c-common-cold.mp3`](../public/audio/vitamin-c-common-cold.mp3) | 112,320 bytes | Dashboard (`claim === 'vitamin-c-common-cold'`) | `CLAIMS_DATA[3].audioSummary` |
| [`public/audio/growth-mindset.mp3`](../public/audio/growth-mindset.mp3) | 64,080 bytes | Dashboard (`claim === 'growth-mindset'`) | `CLAIMS_DATA[4].audioSummary` |
| [`public/audio/smoking-lung-cancer.mp3`](../public/audio/smoking-lung-cancer.mp3) | 90,000 bytes | Dashboard (`claim === 'smoking-lung-cancer'`) | `CLAIMS_DATA[5].audioSummary` |

- **Generation Tooling:** Synthesized offline via **`edge-tts`** (<https://github.com/rany2/edge-tts>, **GNU GPLv3**) using Microsoft Edge neural text-to-speech voices. No `edge-tts` code or runtime dependency is bundled into the client application; ProofLine plays standard static `.mp3` assets via HTML5 `Audio` and falls back to `window.speechSynthesis` if playback fails.

---

## 3. Typography (Google Fonts — SIL OFL 1.1)

Loaded via `<link>` in [`index.html`](../index.html) and styled in [`src/index.css`](../src/index.css):

| Font Family | Weights Loaded | License | Role in ProofLine |
| :--- | :--- | :--- | :--- |
| **Inter** | `400`, `500`, `600`, `700`, `800` | **SIL Open Font License (OFL) v1.1** | Primary editorial UI typeface |
| **JetBrains Mono** | `400`, `500`, `600` | **SIL Open Font License (OFL) v1.1** | Tabular monospace numerals (`.font-mono-tabular` with `tabular-nums`) for jitter-free scrubbing |
| **Atkinson Hyperlegible** | `400`, `400 italic`, `700` | **SIL Open Font License (OFL) v1.1** (Braille Institute) | Global high-legibility accessibility mode (`.a11y-hyperlegible`) |

---

## 4. Iconography & Frontend Libraries

| Package | Version (`package.json`) | License | Usage |
| :--- | :--- | :--- | :--- |
| **`lucide-react`** | `^1.80.0` | **ISC License** (Feather-derived icons under **MIT License**, per `node_modules/lucide-react/LICENSE`) | UI navigation, sliders, checklist, audio, and Hyperlegible controls |
| **React / React DOM** | `^19.3.1` | **MIT License** | Client-side UI state and rendering |
| **Tailwind CSS / `@tailwindcss/vite`** | `^4.3.5` | **MIT License** | Pure White Swiss-editorial design system and utility styling |
| **Vite / `@vitejs/plugin-react`** | `^8.3.6` / `^6.1.2` | **MIT License** | Build tooling and dev server |
| **TypeScript** | `~7.0.2` | **Apache-2.0 License** | Strict static typing (`tsc -b`) |
| **Oxlint** | `^1.90.0` | **MIT License** | Static linting across React and TypeScript |
