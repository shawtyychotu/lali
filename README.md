# Arcane Live Wallpaper & Split-Reveal Loader 🍭✨

> A web experience featuring a **Split-Reveal Lollipop Loading Screen** that transitions into an **Ekko & Jinx (Arcane Season 2) Live Web Wallpaper** with Sofia Carson's *"Come Back Home"*, a 60fps HTML5 Canvas particle engine, smooth mouse parallax, and an interactive apology/reconciliation dialog.

---

## ✨ Features

- 🍭 **Split-Reveal Lollipop Loader**:
  - Center spinning colorful lollipop with click-boost acceleration.
  - 3-square progressive loading indicator.
  - Smooth vertical shutter split animation revealing the live wallpaper.
- 🌌 **Arcane Live Wallpaper**:
  - High-resolution Ekko & Jinx wallpaper with subtle, responsive mouse parallax depth.
  - 60fps Canvas particle engine rendering twinkling night sky stars and rising glowing Zaun amber embers.
  - Atmospheric vignette and ambient neon bloom overlays.
- 🎵 **Integrated Glassmorphic Music Player**:
  - Sofia Carson - *"Come Back Home"* audio track with instant auto-play on reveal.
  - Play/Pause toggle, mute button, and dynamic 4-bar equalizer waveform visualizer.
- 💌 **Unobstructed Message Card & Interactive Reconciliation Flow**:
  - Frosted glass apology card with glowing cyan-to-amber top accent line.
  - Floating centered **`Next →`** button allowing uninterrupted reading time before prompting.
  - **`Friends???`** modal with **Yes / No** options.
  - **`na pavom la😭`** rejection pop-up with a **`Rethink`** button.
  - **Dynamic "Yes" Button Scaling**: The **Yes** button grows larger and more prominent for every rejected attempt!
  - Heartfelt celebration screen upon acceptance.
- ⌨️ **Keyboard Shortcuts & Immersive Controls**:
  - <kbd>Space</kbd>: Play / Pause background audio.
  - <kbd>F</kbd> or Double-Click: Toggle Fullscreen.
  - Auto-hiding cursor and controls after 3.5s of mouse inactivity for full cinematic immersion.
  - **Replay Loader**: Top-right button to replay the split-reveal sequence at any time.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) / [yarn](https://yarnpkg.com/)

### Installation & Local Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/arcane-split-reveal-wallpaper.git
   cd arcane-split-reveal-wallpaper
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` (or the port shown in terminal) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The compiled static files will be ready in the `dist/` directory.

---

## 🌐 One-Click Deployment

### Deploy to Vercel
1. Import the Git repository in [Vercel](https://vercel.com/).
2. Framework Preset: **Vite**.
3. Click **Deploy**.

### Deploy to Netlify
1. Connect your repository on [Netlify](https://www.netlify.com/).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Click **Deploy Site**.

### Deploy to GitHub Pages (Automated via GitHub Actions)
1. Push this repository to GitHub.
2. In your GitHub repository, navigate to **Settings** > **Pages** (under the "Code and automation" section).
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically trigger on push to `main` (or `master`), build the site, and publish it to `https://<username>.github.io/<repo-name>/`.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4 + Vanilla Glassmorphism CSS
- **Animations**: Motion (Framer Motion) + HTML5 Canvas API
- **Icons**: Lucide React
- **Audio**: HTML5 Audio + Web Audio API Synthesizer

---

## 📜 License

MIT License — Feel free to use, customize, and share!
