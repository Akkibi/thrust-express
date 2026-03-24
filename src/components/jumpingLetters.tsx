import { useEffect, useRef } from "react";

export const JumpingLetters = ({ text }: { text: string }) => {
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let animId: number;
    const amplitude = 1;
    const frequency = 1;
    const delayPerLetter = 0.1;

    const animate = (time: number) => {
      const t = time / 1000;
      spanRefs.current.forEach((span, i) => {
        if (!span) return;
        const y =
          Math.sin(
            t * frequency * Math.PI * 2 - i * delayPerLetter * Math.PI * 2,
          ) * amplitude;
        span.style.transform = `translateY(${y}px)`;
      });
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [text]);

  return (
    <span style={{ display: "inline-flex" }}>
      {text.split("").map((letter, index) => (
        <span
          key={index}
          ref={(el) => {
            spanRefs.current[index] = el;
          }}
          style={{ display: "inline-block" }}
        >
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </span>
  );
};
