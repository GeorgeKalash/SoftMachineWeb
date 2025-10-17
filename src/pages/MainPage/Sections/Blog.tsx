import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { motion, Variants, useReducedMotion } from "framer-motion";

// —— transitions (matching your Hero) ——
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: EASE } },
};

// —— tiny deterministic PRNG so shapes don’t jump between renders ——
const prand = (seed: number) => {
  let t = seed + 1;
  return () => {
    t ^= t << 13;
    t ^= t >> 17;
    t ^= t << 5;
    return ((t >>> 0) % 1000) / 1000; // [0,1)
  };
};

type ShapeKind = "circle" | "square" | "triangle" | "ring" | "diamond";
type ShapeConfig = {
  id: string;
  kind: ShapeKind;
  size: number;
  opacity: number;
  hueVar: string;
  topPct: number;
  leftPct: number;
  driftX: number;
  driftY: number;
  rotate: number;
  duration: number;
  delay: number;
  z?: number;
};

// Eagerly collect any images in /assets (jpg/png/jpeg/webp). We’ll take the first 3.
const allImages = Object.values(
  import.meta.glob("@/assets/*.{jpg,png,jpeg,webp}", {
    eager: true,
    as: "url",
  })
) as string[];

const pick = (i: number) => allImages[i % Math.max(allImages.length, 1)] ?? "";

const Blog: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation();
  const [imgReady, setImgReady] = useState(false);

  // Build shapes once (positions stable)
  const shapes = useMemo<ShapeConfig[]>(() => {
    const rnd = prand(84);
    const kinds: ShapeKind[] = ["circle", "square", "triangle", "ring", "diamond"];
    const items: ShapeConfig[] = [];
    const COUNT = 14;
    for (let i = 0; i < COUNT; i++) {
      const kind = kinds[i % kinds.length];
      const size = 26 + Math.floor(rnd() * 54); // 26..80
      const opacity = 0.12 + rnd() * 0.18; // 0.12..0.30
      const hueVar =
        kind === "circle"
          ? "--primary"
          : kind === "triangle"
          ? "--accent"
          : kind === "ring"
          ? "--foreground"
          : "--muted-foreground";
      // keep shapes biased to the left side a bit to complement the collage
      const topPct = 6 + rnd() * 86; // 6..92
      const leftPct = rnd() < 0.66 ? 2 + rnd() * 46 : 50 + rnd() * 46; // more on left
      const driftX = 10 + rnd() * 30;
      const driftY = 10 + rnd() * 30;
      const rotate = Math.floor(rnd() * 360);
      const duration = 6 + rnd() * 6;
      const delay = rnd() * 2.5;
      items.push({
        id: `bshape-${i}`,
        kind,
        size,
        opacity,
        hueVar,
        topPct,
        leftPct,
        driftX,
        driftY,
        rotate,
        duration,
        delay,
        z: 10,
      });
    }
    return items;
  }, []);

  const renderShape = (s: ShapeConfig) => {
    const baseStyle: React.CSSProperties = {
      top: `${s.topPct}%`,
      left: `${s.leftPct}%`,
      width: s.kind === "triangle" ? 0 : s.size,
      height: s.kind === "triangle" ? 0 : s.size,
      opacity: s.opacity,
      zIndex: s.z ?? 10,
    };

    const animate = prefersReducedMotion
      ? {}
      : {
          x: [0, s.driftX, -s.driftX * 0.6, 0],
          y: [0, -s.driftY, s.driftY * 0.5, 0],
          rotate: [s.rotate, s.rotate + 8, s.rotate - 6, s.rotate],
          transition: {
            duration: s.duration,

            ease: "easeInOut" as const,
            delay: s.delay,
          },
        };

    switch (s.kind) {
      case "circle":
        return (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              ...baseStyle,
              background: `hsl(var(${s.hueVar}))`,
              filter: "blur(0.2px)",
            }}
            animate={animate}
          />
        );
      case "square":
        return (
          <motion.div
            key={s.id}
            className="absolute"
            style={{
              ...baseStyle,
              background: `hsl(var(${s.hueVar}))`,
              borderRadius: 10,
            }}
            animate={animate}
          />
        );
      case "diamond":
        return (
          <motion.div
            key={s.id}
            className="absolute"
            style={{
              ...baseStyle,
              width: s.size * 0.9,
              height: s.size * 0.9,
              background: `hsl(var(${s.hueVar}))`,
              transform: `rotate(45deg)`,
              borderRadius: 8,
            }}
            animate={animate}
          />
        );
      case "ring":
        return (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              ...baseStyle,
              background: "transparent",
              border: `${Math.max(2, Math.floor(s.size / 12))}px solid hsl(var(--primary)/0.25)`,
              boxShadow: "0 0 0 1px hsl(var(--background)/0.6) inset",
            }}
            animate={animate}
          />
        );
      case "triangle":
        return (
          <motion.div
            key={s.id}
            className="absolute"
            style={{
              ...baseStyle,
              borderLeft: `${s.size * 0.45}px solid transparent`,
              borderRight: `${s.size * 0.45}px solid transparent`,
              borderBottom: `${s.size * 0.75}px solid hsl(var(${s.hueVar}))`,
              filter: "blur(0.2px)",
              width: 0,
              height: 0,
            }}
            animate={animate}
          />
        );
    }
  };

  const img1 = pick(0);
  const img2 = pick(1);
  const img3 = pick(2);

  return (
    <motion.section
      role="region"
      aria-label="Blog"
      className="relative isolate overflow-hidden py-20 bg-gradient-to-br from-background via-background to-primary/5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
    >
      {/* Decorative wandering shapes (masked so edges don’t look clipped) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          maskImage:
            "radial-gradient(120% 120% at 30% 45%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(120% 120% at 30% 45%, black 60%, transparent 100%)",
        }}
      >
        {shapes.map(renderShape)}
      </div>

      {/* subtle static background blobs */}
      <div className="pointer-events-none absolute -left-10 top-24 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT — 3-image collage */}
          <motion.div
            ref={leftRef}
            className={cn(
              "relative mx-auto grid max-w-[640px] grid-cols-2 gap-6",
              "opacity-0 translate-y-8 transition-all duration-700",
              leftVisible && "opacity-100 translate-y-0"
            )}
            variants={fadeUp}
          >
            <div className="flex flex-col gap-6">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/5">
                <img
                  src={img1}
                  alt="Blog visual 1"
                  className="h-56 w-full object-cover"
                  onLoad={() => setImgReady(true)}
                />
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/5">
                <img
                  src={img2}
                  alt="Blog visual 2"
                  className="h-64 w-full object-cover"
                />
              </div>
            </div>

            <div className="relative -mt-10 lg:-mt-16">
              <span className="absolute -left-6 top-16 hidden h-16 w-8 rounded-r-full bg-primary/20 lg:block" />
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/5">
                <img
                  src={img3}
                  alt="Blog visual 3"
                  className="h-[420px] w-full object-cover"
                />
              </div>
              <div className="pointer-events-none absolute -bottom-10 left-12 h-20 w-40 rounded-t-full bg-primary/20 blur-2xl" />
            </div>
          </motion.div>

          {/* RIGHT — copy + actions */}
          <motion.div
            ref={rightRef}
            className={cn(
              "max-w-xl",
              "opacity-0 translate-y-8 transition-all duration-700 delay-150",
              rightVisible && "opacity-100 translate-y-0"
            )}
            variants={fadeUp}
          >
            <p className="text-sm font-semibold text-primary">From the Blog</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Insights, tutorials, and product updates
            </h2>
            <p className="mt-4 text-muted-foreground">
              Stay up to date with best practices, deep dives, and behind-the-scenes
              notes from our team. Short reads, actionable code, and real examples.
            </p>

            <div className="mt-8 space-y-6">
              {[
                { title: "Design tokens that scale your UI", date: "Oct 10, 2025" },
                { title: "Animating on scroll with zero jank", date: "Oct 03, 2025" },
                { title: "Shipping faster with shadcn primitives", date: "Sep 25, 2025" },
              ].map((post, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 rounded-xl border border-border p-4 transition hover:bg-muted/40"
                >
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/70" />
                  <div>
                    <h3 className="font-medium leading-snug group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{post.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Button size="lg">Read the blog</Button>
              <Button variant="outline" size="lg">
                <Play className="mr-2 h-4 w-4" />
                See how we work
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Blog;
