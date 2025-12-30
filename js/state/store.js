export function createStore(initialState){
  let state = structuredClone(initialState);
  const subs = new Set();

  const get = () => state;

  const set = (next) => {
    state = next;
    subs.forEach(fn => fn(state));
  };

  const update = (mutator) => {
    const draft = structuredClone(state);
    const next = mutator(draft) || draft;
    set(next);
  };

  const subscribe = (fn) => {
    subs.add(fn);
    fn(state);
    return () => subs.delete(fn);
  };

  return { get, set, update, subscribe };
}
