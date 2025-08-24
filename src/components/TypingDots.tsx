import { useEffect, useState } from "react";

export default function TypingDots({ interval = 400 }: { interval?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => (c + 1) % 4), interval);
    return () => clearInterval(id);
  }, [interval]);

  return (
    <span className="inline-flex items-center text-sm text-gray-600">
      <span className="mr-2">Thinking</span>
      <span aria-hidden>
        {Array.from({ length: count }).map((_, i) => (
          <span key={i}>.</span>
        ))}
      </span>
    </span>
  );
}
