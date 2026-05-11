import { useEffect, useState } from 'react';

export function useBlinkCursor(active: boolean) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active) return;

    const id = setInterval(() => {
      setVisible(v => !v);
    }, 500);

    return () => clearInterval(id);
  }, [active]);

  return active && visible ? '▍' : '';
}