import { useEffect, useRef, useState } from "react";
import { Progress } from "./progress";

interface ProgressiveLoaderProps {
  active: boolean;
  label?: string;
}

export const ProgressiveLoader = ({ active, label = "Working…" }: ProgressiveLoaderProps) => {
  const [value, setValue] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setValue(0);
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    // Smoothly progress towards 90% while active
    timerRef.current = window.setInterval(() => {
      setValue((v) => {
        const next = v < 70 ? v + 3 : v < 90 ? v + 1 : 90;
        return Math.min(next, 90);
      });
    }, 200);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [active]);

  // Snap to 100% briefly when becoming inactive
  useEffect(() => {
    if (!active && value > 0) {
      const id = window.setTimeout(() => setValue(100), 50);
      const id2 = window.setTimeout(() => setValue(0), 350);
      return () => {
        window.clearTimeout(id);
        window.clearTimeout(id2);
      };
    }
  }, [active]);

  if (!active && value === 0) return null;

  return (
    <div className="w-full rounded-md border bg-card p-3 shadow-soft">
      <div className="mb-2 text-xs font-medium text-muted-foreground">{label}</div>
      <Progress value={value} />
    </div>
  );
};



