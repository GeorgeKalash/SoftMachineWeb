"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import heroImage from "@/assets/hero.png";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Decoration from "@/sharedComponent/Decoration";

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

  return (
    <motion.section
      aria-label="Hero"
      role="region"
      className="relative isolate pt-28 sm:pt-32 pb-16 sm:pb-24 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {/* Reusable decorative shapes */}
      <Decoration
        minCount={5}
        maxCount={15}
        masked
        zIndex={0}

        className="z-10"
        avoidCenter={{ xPct: 50, yPct: 40, radiusPct: 22 }}
        // palette overrides are optional; using your original mapping by default
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
                <Button
                  size="lg"
                  className="text-base"
                  onClick={onPrimaryCta}
                  aria-label={primaryCtaText}
                >
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
