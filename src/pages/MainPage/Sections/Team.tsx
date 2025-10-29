import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

/** Collect any images from /assets (jpg/png/jpeg/webp). We’ll just pick 3. */
const allImages = Object.values(
  import.meta.glob("@/assets/*.{jpg,png,jpeg,webp}", { eager: true, as: "url" })
) as string[];

const pick = (i: number) => allImages[i % Math.max(allImages.length, 1)] ?? "";

/** tiny deterministic PRNG so shapes don’t jump around between renders */
const prand = (seed: number) => {
  let t = seed + 1;
  return () => {
    t ^= t << 13;
    t ^= t >> 17;
    t ^= t << 5;
    return ((t >>> 0) % 1000) / 1000;
  };
};

type Shape = {
  id: string;
  topPct: number;
  leftPct: number;
  size: number;
  kind: "ring" | "triangle" | "pill";
  rotate?: number;
  opacity: number;
  duration: number;
  delay: number;
};

const buildShapes = (): Shape[] => {
  const r = prand(131);
  const items: Shape[] = [];
  const COUNT = 7;
  for (let i = 0; i < COUNT; i++) {
    const kind = (["ring", "triangle", "pill"] as const)[i % 3];
    items.push({
      id: `tshape-${i}`,
      kind,
      topPct: 8 + r() * 84,
      leftPct: 6 + r() * 88,
      size: 28 + Math.floor(r() * 54),
      rotate: Math.floor(r() * 360),
      opacity: 0.12 + r() * 0.2,
      duration: 6 + r() * 6,
      delay: r() * 2.5,
    });
  }
  return items;
};

const Team: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const shapes = useMemo(buildShapes, []);

  const profiles = [
    { name: "Matheus Ferrero", role: "Product Manager", img: pick(0) },
    { name: "Eva Hudson", role: "Product Designer", img: pick(1) },
    { name: "Jackie Sanders", role: "Web Designer", img: pick(2) },
  ];

  const renderShape = (s: Shape) => {
    const animate = prefersReducedMotion
      ? {}
      : {
          x: [0, 12, -8, 0],
          y: [0, -12, 6, 0],
          rotate: [s.rotate ?? 0, (s.rotate ?? 0) + 8, (s.rotate ?? 0) - 6, s.rotate ?? 0],
          transition: { duration: s.duration, repeat: Infinity, ease: "easeInOut", delay: s.delay },
        };

    if (s.kind === "ring") {
      return (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            top: `${s.topPct}%`,
            left: `${s.leftPct}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            border: `${Math.max(2, Math.floor(s.size / 12))}px solid hsl(var(--primary)/0.35)`,
            boxShadow: "0 0 0 1px hsl(var(--background)/0.6) inset",
          }}
        />
      );
    }

    if (s.kind === "pill") {
      return (
        <motion.div
          key={s.id}
          className="absolute"
          style={{
            top: `${s.topPct}%`,
            left: `${s.leftPct}%`,
            width: s.size * 1.6,
            height: s.size * 0.5,
            opacity: s.opacity,
            background: "hsl(var(--accent))",
            borderRadius: 999,
            rotate: s.rotate,
          }}
        />
      );
    }

    // triangle
    return (
      <motion.div
        key={s.id}
        className="absolute"
        style={{
          top: `${s.topPct}%`,
          left: `${s.leftPct}%`,
          opacity: s.opacity,
          borderLeft: `${s.size * 0.45}px solid transparent`,
          borderRight: `${s.size * 0.45}px solid transparent`,
          borderBottom: `${s.size * 0.8}px solid hsl(var(--primary))`,
          rotate: s.rotate,
          filter: "blur(0.2px)",
        }}
      />
    );
  };

  return (
    <section className="relative isolate overflow-hidden py-20 bg-gradient-to-b from-background to-primary/5">
      {/* floating shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          maskImage: "radial-gradient(120% 120% at 50% 20%, black 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(120% 120% at 50% 20%, black 60%, transparent 100%)",
        }}
      >
        {shapes.map(renderShape)}
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Meet With Our Creative<br className="hidden sm:block" /> Dedicated Team
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor eros.
          </p>
        </div>

        {/* Profiles */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p, i) => (
            <div
              key={i}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border bg-card",
                "shadow-sm ring-1 ring-black/5 transition"
              )}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />

                {/* social overlay: two-color gradient + curved top edge */}
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-[-92px] flex items-center justify-center",
                    "transition-all duration-500 group-hover:bottom-0"
                  )}
                  style={{ height: 92 }}
                >
                  {/* SVG background so curve renders crisply */}
                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 1000 200"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <defs>
                      {/* gradient: primary → violet/pink */}
                      <linearGradient id="teamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="#6d28d9" />
                      </linearGradient>
                    </defs>
                    {/* Curved top: higher on left (~10), lower on right (~5) */}
                    <path
                      d="M0,40 C160,10 340,10 500,28 C660,46 840,28 1000,20 L1000,200 L0,200 Z"
                      fill="url(#teamGrad)"
                    />
                  </svg>

                  {/* Social icons layer */}
                  <div className="relative z-10 flex items-center gap-6 text-primary-foreground">
                    <a
                      className="transition-transform hover:scale-110"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      className="transition-transform hover:scale-110"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                    <a
                      className="transition-transform hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-5 text-center">
                <h3 className="text-base font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
