"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import heroImage from "@/assets/hero.png";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Decoration from "@/sharedComponent/Decoration";

/* -------------------------------- types -------------------------------- */
type HeroProps = {
  title?: string;
  description?: string;
  primaryCtaText?: string;
  onPrimaryCta?: () => void;
  secondaryCtaText?: string;
  onSecondaryCta?: () => void;
  phoneLabel?: string;
  phoneHref?: string;
  locationBadge?: string;
};

/* ------------------------------- animation ------------------------------ */
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

/* --------------------------------- cmp ---------------------------------- */
export default function Hero({
  title = "Software Smart by Design",
  description = "We design and build custom software—web, mobile, and business systems—that solve real problems and scale with your growth.",
  primaryCtaText = "Talk to Us",
  onPrimaryCta,
  secondaryCtaText = "See Work",
  onSecondaryCta,
  phoneLabel = "+961 76 888 468",
  phoneHref = "tel:+96176888468",
  locationBadge = "Sahel Alma, Jounieh — Lebanon",
}: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [imgLoaded, setImgLoaded] = useState(false);

  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation();


  // Safe fallbacks for CTAs
  const handlePrimary = () => {
    if (onPrimaryCta) return onPrimaryCta();
    // default: scroll to contact section if exists
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleSecondary = () => {
    if (onSecondaryCta) return onSecondaryCta();
    // default: scroll to work/portfolio if exists
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.section
      aria-label="SoftMachine hero"
      role="region"
      className="relative isolate pt-28 sm:pt-32 pb-16 sm:pb-24 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {/* Decorative shapes (random per mount) */}
      <Decoration
        minCount={6}
        maxCount={14}
        masked
        zIndex={0}
        className="z-10"
        avoidCenter={{ xPct: 50, yPct: 42, radiusPct: 22 }}
      />

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
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 85%, transparent 86%)",
          maskImage: "radial-gradient(circle at 50% 50%, #000 85%, transparent 86%)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        }}
        initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
        animate={
          prefersReducedMotion
            ? { opacity: 1, scale: 1, filter: "blur(0px)" }
            : imageVisible && imgLoaded
              ? { opacity: 1, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, scale: 0.985, filter: "blur(6px)" }
        }
        transition={{ duration: 0.7, ease: EASE }}
      >
        <img
          src={heroImage}
          alt="" // decorative
          className="w-full h-full object-cover"
          onLoad={() => setImgLoaded(true)}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <motion.div
            ref={contentRef}
            variants={container}
            initial="hidden"
            animate={contentVisible ? "visible" : "hidden"}
            className="space-y-6 sm:space-y-8"
          >
        {/* Location / trust badge with Google Maps link */}
            <motion.a
              variants={fadeUp}
              href="https://www.google.com/maps?q=SoftMachine,+Sahel+Alma,+Jounieh,+Lebanon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              aria-label="Open location on Google Maps"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              {locationBadge}
            </motion.a>


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
              className="flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Primary CTA */}
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
              >
                <Button
                  size="lg"
                  className="text-base"
                  onClick={handlePrimary}
                  aria-label={primaryCtaText}
                >
                  {primaryCtaText}
                </Button>
              </motion.div>

              {/* Secondary CTA */}
              <Button
                size="lg"
                variant="outline"
                className="text-base"
                onClick={handleSecondary}
                aria-label={secondaryCtaText}
              >
                {secondaryCtaText}
              </Button>

              {/* Phone */}
              <div className="flex items-start sm:items-center gap-3">
                <Phone aria-hidden className="mt-0.5 h-5 w-5 text-primary" />
                <div className="leading-tight">
                  <p className="font-semibold">
                    <a
                      href={phoneHref}
                      className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                      aria-label={`Call us at ${phoneLabel}`}
                    >
                      Call us {phoneLabel}
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground">We’ll reply within one business day</p>
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
              alt="SoftMachine — custom software development"
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

