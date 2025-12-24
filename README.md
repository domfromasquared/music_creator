# RetroLoop Studio 🎛️🎹  
**Create 8-bit / chiptune-inspired loops in your browser — no audio files required.**

RetroLoop Studio is a lightweight, no-install music creator that combines a classic **1/16 drum step sequencer** with a **piano roll for melody + bass**. Everything is synthesized in real time using the **Web Audio API**, so your “song” is stored as note/step data rather than audio recordings.

---

## ✨ Highlights

- **1/16 Drum Sequencer** (Kick / Clap / Hat / Snare)
- **Piano Roll for Melody + Bass**
- **Custom note lengths** (click + drag to sustain across multiple steps)
- **4/4 loop playback** with **swing**
- **Spacebar Play/Pause** shortcut
- **No audio assets** — synthesized drums + synth tones via Web Audio API
- Runs as a **single HTML file** (easy to embed, deploy, or extend)

---

## 🚀 Quick Start

### Option A: Open the file directly
1. Download `retro_sequencer.html`
2. Double click it (opens in your browser)
3. Press **Play** (or hit **Space**)

> Note: Some browsers are stricter about audio until a user gesture. Clicking Play once solves that.

### Option B: Run a tiny local server (recommended)
Using Python:
```bash
python -m http.server 8080
