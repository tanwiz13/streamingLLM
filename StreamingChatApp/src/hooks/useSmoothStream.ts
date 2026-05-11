import { useEffect, useRef, useState } from 'react';

const CHARS_PER_SECOND = 120;

export function useSmoothStream() {
  const [text, setText] = useState('');
  const [isRendering, setIsRendering] =
    useState(false);
  const queueRef = useRef('');
  const pausedRef = useRef(false);
  const frameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef(0);
  const remainderRef = useRef(0);

  useEffect(() => {
    const flush = (time: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = time;
      }
      const delta = time - lastFrameTimeRef.current;
      lastFrameTimeRef.current = time;
      if (!pausedRef.current && queueRef.current.length > 0) {
        setIsRendering(true);
        // chars to render this frame
        const charsToRenderFloat =
          (delta / 1000) * CHARS_PER_SECOND +
          remainderRef.current;
        const charsToRender = Math.floor(
          charsToRenderFloat
        );
        remainderRef.current =
          charsToRenderFloat - charsToRender;
        if (charsToRender > 0) {
          const chunk = queueRef.current.slice(
            0,
            charsToRender
          );
          queueRef.current = queueRef.current.slice(
            charsToRender
          );
          setText(prev => prev + chunk);
        }
      } else {
        setIsRendering(false);
      }
      frameRef.current = requestAnimationFrame(flush);
    };
    frameRef.current = requestAnimationFrame(flush);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const pushToken = (token: string) => {
    if (pausedRef.current) return;
    queueRef.current += token;
    setIsRendering(true);
  };

  const reset = () => {
    queueRef.current = '';
    pausedRef.current = false;
    remainderRef.current = 0;
    setText('');
    setIsRendering(false);
  };

  const stop = () => {
    pausedRef.current = true;
    queueRef.current = '';
    setIsRendering(false);
  };

  return {
    text,
    pushToken,
    reset,
    stop,
    isRendering
  };
}