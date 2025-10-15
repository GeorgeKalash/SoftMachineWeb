import { useMemo, useState } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import heroImage from "@/assets/hero.png";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

type HeroProps = {
  title?: string;
  description?: string;
  primaryCtaText?: string;
  onPrimaryCta?: () => void;
  phoneLabel?: string;
  phoneHref?: string;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: EASE } },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.58, ease: EASE } },
};

// --- tiny deterministic pseudo-random (stable across renders) ---
const prand = (seed: number) => {
  let t = seed + 1;
  return () => {
    t ^= t << 13;
    t ^= t >> 17;
    t ^= t << 5;
    // map to [0,1)
    return ((t >>> 0) % 1000) / 1000;
  };
};

type ShapeKind = "circle" | "square" | "triangle" | "ring" | "diamond";

type ShapeConfig = {
  id: string;
  kind: ShapeKind;
  size: number;          // px base size
  opacity: number;       // 0..1
  hueVar: string;        // CSS var name inside hsl(var(--...))
  // initial position in % of viewport (0..100)
  topPct: number;
  leftPct: number;
  // wandering strength (px)
  driftX: number;
  driftY: number;
  rotate: number;        // initial rotation
  duration: number;      // seconds
  delay: number;         // seconds
  z?: number;
};

export default function Hero({
  title = "React SaaS Boilerplate Template with Landing Page",
  description = "Launch faster with a modern stack, clean patterns, and a scalable UI kit. Production-ready routing, auth, testing, and CI baked in.",
  primaryCtaText = "Get Started",
  onPrimaryCta,
  phoneLabel = "(0123) 456 – 789",
  phoneHref = "tel:0123456789",
}: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [imgLoaded, setImgLoaded] = useState(false);

  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation();

  // Build a bunch of shapes in deterministic positions
  const shapes = useMemo<ShapeConfig[]>(() => {
    const seed = prand(42);
    const kinds: ShapeKind[] = ["circle", "square", "triangle", "ring", "diamond"];
    const items: ShapeConfig[] = [];
    const COUNT = 14; // tweak how many shapes you want
    for (let i = 0; i < COUNT; i++) {
      const kind = kinds[i % kinds.length];
      const size = 36 + Math.floor(seed() * 60); // 36..96
      const opacity = 0.12 + seed() * 0.18; // 0.12..0.30
      const hueVar =
        kind === "circle"
          ? "--primary"
          : kind === "triangle"
          ? "--accent"
          : kind === "ring"
          ? "--foreground"
          : "--muted-foreground";
      // keep them away from exact center a bit to not cover headline
      const topPct = 5 + seed() * 80; // 5%..85%
      const leftPct = 5 + seed() * 90; // 5%..95%
      const driftX = 12 + seed() * 36; // 12..48px
      const driftY = 12 + seed() * 36; // 12..48px
      const rotate = Math.floor(seed() * 360);
      const duration = 6 + seed() * 6; // 6..12s
      const delay = seed() * 2.5; // 0..2.5s
      items.push({
        id: `shape-${i}`,
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
        z: i % 3 === 0 ? 10 : 10, // all at z-10 to float above image
      });
    }
    return items;
  }, []);

  // Helper to render one shape
  const renderShape = (s: ShapeConfig) => {
    const baseStyle: React.CSSProperties = {
      top: `${s.topPct}%`,
      left: `${s.leftPct}%`,
      width: s.kind === "triangle" ? 0 : s.size,
      height: s.kind === "triangle" ? 0 : s.size,
      opacity: s.opacity,
      zIndex: s.z ?? 10,
    };

    // keyframes for wandering
    const animate = prefersReducedMotion
      ? {}
      : {
          x: [0, s.driftX, -s.driftX * 0.6, 0],
          y: [0, -s.driftY, s.driftY * 0.5, 0],
          rotate: [s.rotate, s.rotate + 8, s.rotate - 6, s.rotate],
          transition: {
            duration: s.duration,
            repeat: Infinity,
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
              boxShadow: "0 0 0 1px hsl(var(--background)/0.5) inset",
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
              // width/height are zero for triangles via borders
              width: 0,
              height: 0,
            }}
            animate={animate}
          />
        );
    }
  };

  return (
    <motion.section
      aria-label="Hero"
      role="region"
      className="relative isolate pt-28 sm:pt-32 pb-16 sm:pb-24 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {/* ——— Decorative wandering shapes ——— */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        // mask the extreme edges so shapes don't look cut off abruptly
        style={{
          maskImage:
            "radial-gradient(120% 120% at 50% 40%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(120% 120% at 50% 40%, black 60%, transparent 100%)",
        }}
      >
        {shapes.map(renderShape)}
      </div>

      {/* Top-right circular hero image (lg+) under shapes */}
      <motion.div
        ref={imageRef}
        aria-hidden
        className={[
          "hidden lg:block absolute -top-24 -right-24 xl:-top-28 xl:-right-28",
          "w-[34rem] h-[34rem] xl:w-[38rem] xl:h-[38rem]",
          "rounded-full overflow-hidden shadow-2xl ring-8 ring-background/60 z-0",
        ].join(" ")}
        style={{
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, #000 85%, transparent 86%)",
          maskImage:
            "radial-gradient(circle at 50% 50%, #000 85%, transparent 86%)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        }}
        initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
        animate={
          imageVisible && imgLoaded
            ? { opacity: 1, scale: 1, filter: "blur(0px)" }
            : { opacity: 0, scale: 0.985, filter: "blur(6px)" }
        }
        transition={{ duration: 0.7, ease: EASE }}
      >
        <img
          src={heroImage}
          alt=""
          className="w-full h-full object-cover"
          onLoad={() => setImgLoaded(true)}
          loading="eager"
          decoding="async"
        />
      </motion.div>

      {/* Content above shapes */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <motion.div
            ref={contentRef}
            variants={container}
            initial="hidden"
            animate={contentVisible ? "visible" : "hidden"}
            className="space-y-6 sm:space-y-8"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
            >
              {title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ delay: 0.05 }}
              className="text-base sm:text-lg text-muted-foreground max-w-xl"
            >
              {description}
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 sm:items-center"
            >
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
              >
                <Button size="lg" className="text-base" onClick={onPrimaryCta} aria-label={primaryCtaText}>
                  {primaryCtaText}
                </Button>
              </motion.div>

              <div className="flex items-start sm:items-center gap-3">
                <Phone aria-hidden className="mt-0.5 h-5 w-5 text-primary" />
                <div className="leading-tight">
                  <p className="font-semibold">
                    <a
                      href={phoneHref}
                      className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                    >
                      Call us {phoneLabel}
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground">For any question or concern</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Mobile image */}
          <motion.div
            variants={fade}
            initial="hidden"
            animate={contentVisible ? "visible" : "hidden"}
            transition={{ duration: 0.58, ease: EASE }}
            className="relative lg:hidden"
          >
            <img
              src={heroImage}
              alt="Professional workspace"
              className="rounded-3xl shadow-2xl w-full"
              onLoad={() => setImgLoaded(true)}
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
