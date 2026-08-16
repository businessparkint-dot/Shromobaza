"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Apple, Play } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";

export function DownloadApp() {
  return (
    <section
      aria-labelledby="download-heading"
      className="overflow-hidden py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-navy">
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,90,31,0.2),transparent_50%)]"
              aria-hidden="true"
            />

            <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
              <div>
                <h2
                  id="download-heading"
                  className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
                >
                  Take Shromobazar everywhere
                </h2>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-white/70">
                  Search jobs, message employers, and manage contracts from your
                  phone — available on iOS and Android.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-white text-navy hover:bg-white/90"
                    asChild
                  >
                    <Link href="#app-store" aria-label="Download on the App Store">
                      <Apple className="h-5 w-5" aria-hidden="true" />
                      App Store
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-transparent text-white hover:border-white/50 hover:bg-white/10"
                    asChild
                  >
                    <Link
                      href="#google-play"
                      aria-label="Get it on Google Play"
                    >
                      <Play className="h-5 w-5" aria-hidden="true" />
                      Google Play
                    </Link>
                  </Button>
                </div>
              </div>

              <motion.div
                className="relative mx-auto aspect-[9/16] w-full max-w-[280px]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="absolute inset-0 rounded-[2.5rem] border-4 border-white/10 bg-navy/50 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=560&h=960&fit=crop&q=80"
                    alt="Shromobazar mobile app showing job listings"
                    fill
                    className="rounded-[2.2rem] object-cover"
                    sizes="280px"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
