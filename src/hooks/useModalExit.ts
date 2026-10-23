import { useEffect, useRef, useState } from 'preact/hooks';

// Debe coincidir con la duración de `.modal-overlay.is-closing` en src/index.css.
export const MODAL_EXIT_MS = 180;

export function useModalExit() {
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const runExit = (after: () => void) => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    timerRef.current = window.setTimeout(() => {
      closingRef.current = false;
      setClosing(false);
      after();
    }, MODAL_EXIT_MS);
  };

  return { closing, runExit };
}
