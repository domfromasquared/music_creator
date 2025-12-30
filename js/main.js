import { createStore } from './state/store.js';
import { createAudioEngine } from './sound/audioEngine.js';
import { renderDrumSequencer } from './ui/drumSequencer.js';
import { createTransport } from './transport/transport.js';

const logEl = document.getElementById('debugLog');
const log = (...args) => {
  const line = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  logEl.textContent = (line + '\n') + logEl.textContent;
};

const store = createStore({
  bpm: 120,
  steps: 16,
  tracks: [
    { id:'kick',  name:'KICK',  muted:false, pattern: Array(16).fill(false) },
    { id:'snare', name:'SNARE', muted:false, pattern: Array(16).fill(false) },
    { id:'hat',   name:'HAT',   muted:false, pattern: Array(16).fill(false) },
    { id:'clap',  name:'CLAP',  muted:false, pattern: Array(16).fill(false) },
  ],
});

const audio = createAudioEngine();
const transport = createTransport({
  getBpm: () => store.get().bpm,
  getSteps: () => store.get().steps,
  onTick: (stepIndex) => {
    const s = store.get();
    s.tracks.forEach((t, rowIdx) => {
      if (t.muted) return;
      if (t.pattern[stepIndex]) audio.trigger(t.id);
    });
    document.dispatchEvent(new CustomEvent('playhead:tick', { detail: { stepIndex } }));
  }
});

renderDrumSequencer({
  store,
  onToggleStep: (trackId, stepIdx) => {
    store.update(state => {
      const t = state.tracks.find(x => x.id === trackId);
      if (!t) return state;
      t.pattern[stepIdx] = !t.pattern[stepIdx];
      return state;
    });
  },
  onToggleMute: (trackId) => {
    store.update(state => {
      const t = state.tracks.find(x => x.id === trackId);
      if (!t) return state;
      t.muted = !t.muted;
      return state;
    });
  },
  onDeleteTrack: (trackId) => {
    store.update(state => {
      state.tracks = state.tracks.filter(t => t.id !== trackId);
      return state;
    });
  },
  onDebug: log
});

const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const bpmInput = document.getElementById('bpmInput');
const stepsSelect = document.getElementById('stepsSelect');

bpmInput.value = store.get().bpm;
stepsSelect.value = String(store.get().steps);

bpmInput.addEventListener('change', () => {
  const bpm = Math.max(40, Math.min(240, Number(bpmInput.value || 120)));
  store.update(s => (s.bpm = bpm, s));
  log('BPM ->', bpm);
});

stepsSelect.addEventListener('change', () => {
  const steps = Number(stepsSelect.value);
  store.update(s => {
    s.steps = steps;
    s.tracks.forEach(t => {
      if (t.pattern.length !== steps) {
        const next = Array(steps).fill(false);
        for (let i=0;i<Math.min(steps, t.pattern.length);i++) next[i] = t.pattern[i];
        t.pattern = next;
      }
    });
    return s;
  });
  log('Steps ->', steps);
});

playBtn.addEventListener('click', async () => {
  await audio.ensureStarted();
  transport.play();
  log('Play');
});
stopBtn.addEventListener('click', () => {
  transport.stop();
  document.dispatchEvent(new CustomEvent('playhead:stop'));
  log('Stop');
});
