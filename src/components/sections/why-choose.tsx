"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { features } from "@/lib/data";

export function WhyChoose() {
  return (
    <section
      id="why-us"
      aria-labelledby="why-heading"
      className="py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2
            id="why-heading"
            className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl"
          >
            Why choose Shromobazar
          </h2>
          <p className="mt-4 text-lg text-navy/60">
            Everything you need to hire globally or launch a borderless career —
            in one platform.
          </p>
        </FadeIn>

        <StaggerContainer className="mt-16 grid gap-10 sm:grid-cols-2 lg:gap-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.id}>
                <article className="flex gap-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-white"
                    aria-hidden="true"
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-orange">
                      0{index + 1}
                    </span>
                    <h3 className="mt-1 font-display text-xl font-bold text-navy">
                      {feature.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-navy/60">
                      {feature.description}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
