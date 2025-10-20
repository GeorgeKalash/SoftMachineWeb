"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { motion, Variants, useReducedMotion } from "framer-motion";
import Decoration from "@/sharedComponent/Decoration";

/* ---------------------------- animation tokens --------------------------- */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: EASE } },
};

/* ------------------------------- img utils ------------------------------- */
// Eagerly collect any images in /assets (jpg/png/jpeg/webp). Fallback to 3 picks.
const allImages = Object.values(
  import.meta.glob("@/assets/*.{jpg,png,jpeg,webp}", {
    eager: true,
    as: "url",
  })
) as string[];

const pick = (i: number) => allImages[i % Math.max(allImages.length, 1)] ?? "";

/* ---------------------------------- types -------------------------------- */
type Story = {
  title: string;
  date?: string;
  href?: string;
  // optional: small descriptor or tag later
};

type StoriesProps = {
  id?: string;
  mode?: "blog" | "work"; // purely for copy defaults
  title?: string;
  subtitle?: string;
  posts?: Story[];
  images?: [string?, string?, string?]; // override collage images
  primaryCtaText?: string;
  onPrimaryCta?: () => void;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  onSecondaryCta?: () => void;
  secondaryCtaHref?: string;
};

/* -------------------------------- defaults ------------------------------- */
const DEFAULT_POSTS: Story[] = [
  { title: "Design tokens that scale your UI", date: "Oct 10, 2025", href: "/blog/design-tokens" },
  { title: "Animating on scroll with zero jank", date: "Oct 03, 2025", href: "/blog/scroll-animations" },
  { title: "Shipping faster with shadcn primitives", date: "Sep 25, 2025", href: "/blog/shadcn-speed" },
];

const MODE_COPY = {
  blog: {
    title: "Insights, tutorials, and updates",
    subtitle:
      "Short reads, actionable code, and behind-the-scenes notes from our team.",
    primary: "Read the blog",
    secondary: "See how we work",
  },
  work: {
    title: "Recent work & case studies",
    subtitle:
      "Selected engagements—problems solved, architecture choices, and measurable outcomes.",
    primary: "Explore our work",
    secondary: "Our delivery process",
  },
} as const;

/* -------------------------------- component ------------------------------ */
const Stories: React.FC<StoriesProps> = ({
  id = "stories",
  mode = "blog",
  title,
  subtitle,
  posts = DEFAULT_POSTS,
  images,
  primaryCtaText,
  onPrimaryCta,
  primaryCtaHref = mode === "blog" ? "/blog" : "/work",
  secondaryCtaText,
  onSecondaryCta,
  secondaryCtaHref = mode === "blog" ? "/process" : "/process",
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation();
  const [imgReady, setImgReady] = useState(false);

  const img1 = images?.[0] ?? pick(0);
  const img2 = images?.[1] ?? pick(1);
  const img3 = images?.[2] ?? pick(2);

  const copy = MODE_COPY[mode];
  const headerTitle = title ?? copy.title;
  const headerSubtitle = subtitle ?? copy.subtitle;
  const primaryText = primaryCtaText ?? copy.primary;
  const secondaryText = secondaryCtaText ?? copy.secondary;

  const handlePrimary = () => {
    if (onPrimaryCta) return onPrimaryCta();
    if (primaryCtaHref) window.location.assign(primaryCtaHref);
  };
  const handleSecondary = () => {
    if (onSecondaryCta) return onSecondaryCta();
    if (secondaryCtaHref) window.location.assign(secondaryCtaHref);
  };

  return (
    <motion.section
      id={id}
      role="region"
      aria-label={mode === "blog" ? "Blog" : "Case studies"}
      className="relative isolate overflow-hidden py-20 bg-gradient-to-br from-background via-background to-primary/5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
    >
      <Decoration
        minCount={5}
        maxCount={15}
        masked
        zIndex={0}
        className="z-10"
        avoidCenter={{ xPct: 50, yPct: 40, radiusPct: 22 }}
      />

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
              <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/5">
                <img
                  src={img1}
                  alt="Collage image 1"
                  className="h-56 w-full object-cover"
                  onLoad={() => setImgReady(true)}
                  loading="lazy"
                  decoding="async"
                />
              </figure>

              <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/5">
                <img
                  src={img2}
                  alt="Collage image 2"
                  className="h-64 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>

            <div className="relative -mt-10 lg:-mt-16">
              <span className="absolute -left-6 top-16 hidden h-16 w-8 rounded-r-full bg-primary/20 lg:block" />
              <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/5">
                <img
                  src={img3}
                  alt="Collage image 3"
                  className="h-[420px] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
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
            <p className="text-sm font-semibold text-primary">
              {mode === "blog" ? "From the Blog" : "From our Clients"}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {headerTitle}
            </h2>
            <p className="mt-4 text-muted-foreground">{headerSubtitle}</p>

            <div className="mt-8 space-y-6">
              {posts.map((post, i) => (
                <a
                  key={`${post.title}-${i}`}
                  className="group flex items-start gap-4 rounded-xl border border-border p-4 transition hover:bg-muted/40"
                  href={post.href ?? "#"}
                  aria-label={post.title}
                >
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/70" />
                  <div>
                    <h3 className="font-medium leading-snug group-hover:underline">
                      {post.title}
                    </h3>
                    {post.date && (
                      <p className="text-sm text-muted-foreground">{post.date}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={handlePrimary} aria-label={primaryText}>
                {primaryText}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleSecondary}
                aria-label={secondaryText}
              >
                <Play className="mr-2 h-4 w-4" aria-hidden />
                {secondaryText}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Stories;
