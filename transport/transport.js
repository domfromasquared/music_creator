export function createTransport({ getBpm, getSteps, onTick }){
  let timer = null;
  let step = 0;

  const intervalMs = () => {
    // 16th notes: (60/bpm) seconds per beat, /4 for 16ths
    const bpm = Math.max(1, getBpm());
    return (60_000 / bpm) / 4;
  };

  const play = () => {
    stop();
    step = 0;
    timer = setInterval(() => {
      const steps = getSteps();
      onTick(step);
      step = (step + 1) % steps;
    }, intervalMs());
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
    step = 0;
  };

  return { play, stop };
}
