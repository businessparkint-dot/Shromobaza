"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { statistics } from "@/lib/data";

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const numericValue = parseFloat(value);
    const isDecimal = value.includes(".");
    const duration = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericValue * eased;

      setDisplay(
        isDecimal ? current.toFixed(1) : Math.floor(current).toString()
      );

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref} aria-live="polite">
      {display}
      {suffix}
    </span>
  );
}

export function Statistics() {
  return (
    <section aria-labelledby="stats-heading" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2
            id="stats-heading"
            className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl"
          >
            Trusted by millions worldwide
          </h2>
          <p className="mt-4 text-lg text-navy/60">
            Real numbers from a platform built for scale, trust, and global reach.
          </p>
        </FadeIn>

        <StaggerContainer className="mt-14 grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
          {statistics.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-navy sm:text-5xl">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-navy/60 sm:text-base">
                  {stat.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
