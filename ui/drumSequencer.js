export function renderDrumSequencer({ store, onToggleStep, onToggleMute, onDeleteTrack, onDebug }){
  const namesEl = document.getElementById('trackNames');
  const gridEl  = document.getElementById('drumGrid');
  const playheadEl = document.getElementById('playhead');

  const render = (state) => {
    const steps = state.steps;

    // Labels column (THIS is where .trackLabel must exist)
    namesEl.innerHTML = '';
    state.tracks.forEach(t => {
      const row = document.createElement('div');
      row.className = 'trackName';

      const del = document.createElement('button');
      del.className = 'rowDel';
      del.title = 'Delete track';
      del.textContent = '×';
      del.addEventListener('click', () => onDeleteTrack(t.id));

      const label = document.createElement('div');
      label.className = 'trackLabel'; // key class
      label.textContent = t.name || t.id; // key content

      const mute = document.createElement('button');
      mute.className = 'msBtn' + (t.muted ? ' active' : '');
      mute.title = 'Mute';
      mute.textContent = 'M';
      mute.addEventListener('click', () => onToggleMute(t.id));

      row.append(del, label, mute);
      namesEl.appendChild(row);
    });

    // Grid
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateRows = `repeat(${state.tracks.length}, auto)`;
    gridEl.style.gridTemplateColumns = `repeat(${steps}, 28px)`;

    state.tracks.forEach((t, rIdx) => {
      for (let i=0;i<steps;i++){
        const cell = document.createElement('button');
        cell.className = 'step' + (t.pattern[i] ? ' on' : '');
        cell.setAttribute('aria-label', `${t.name} step ${i+1}`);
        cell.addEventListener('click', () => onToggleStep(t.id, i));
        gridEl.appendChild(cell);
      }
    });

    onDebug?.({ tracks: state.tracks.length, steps });
  };

  store.subscribe(render);

  // Playhead highlight
  const clearPlaying = () => {
    gridEl.querySelectorAll('.step.playing').forEach(el => el.classList.remove('playing'));
    playheadEl.style.transform = 'translateX(-9999px)';
  };

  document.addEventListener('playhead:stop', clearPlaying);
  document.addEventListener('playhead:tick', (e) => {
    const { stepIndex } = e.detail;
    const steps = store.get().steps;

    // Visual playhead line position (approx)
    const cellSize = 28;
    const gap = 8;
    const x = 10 + stepIndex * (cellSize + gap) + cellSize/2;
    playheadEl.style.transform = `translateX(${x}px)`;

    // Highlight playing column
    gridEl.querySelectorAll('.step.playing').forEach(el => el.classList.remove('playing'));
    const tracks = store.get().tracks.length;
    for (let r=0;r<tracks;r++){
      const idx = r * steps + stepIndex;
      const el = gridEl.children[idx];
      if (el) el.classList.add('playing');
    }
  });
}
