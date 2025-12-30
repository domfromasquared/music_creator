export function createAudioEngine(){
  let ctx = null;
  let master = null;

  const ensureStarted = async () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.65;
      master.connect(ctx.destination);
    }
    if (ctx.state !== 'running') await ctx.resume();
  };

  const beep = (freq, dur=0.06) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = freq;
    o.type = 'square';
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g); g.connect(master);
    o.start();
    o.stop(ctx.currentTime + dur + 0.01);
  };

  const trigger = (id) => {
    if (!ctx) return;
    switch(id){
      case 'kick':  beep(70, 0.08); break;
      case 'snare': beep(220, 0.05); break;
      case 'hat':   beep(520, 0.03); break;
      case 'clap':  beep(330, 0.05); break;
      default:      beep(260, 0.05);
    }
  };

  return { ensureStarted, trigger };
}
