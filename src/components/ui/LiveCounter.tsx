"use client";

import { useEffect, useState } from "react";

function formatNum(n: number) {
  return n.toLocaleString("en-US");
}

export default function LiveCounter({ start = 12847 }: { start?: number }) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 5000) + 3000; // 3–8s
      timer = setTimeout(() => {
        setCount((c) => c + (Math.random() > 0.6 ? 2 : 1));
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  return <span>{formatNum(count)}</span>;
}
