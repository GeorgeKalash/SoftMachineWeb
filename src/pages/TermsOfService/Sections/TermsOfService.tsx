// src/pages/TermsOfServicePage.tsx
"use client";

import { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { GoBackButton } from "@/sharedComponent/GoBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Shield,
  RefreshCw,
  Mail,
  Info,
} from "lucide-react";
import siteData from "@/data.json";

/* FX */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const fadeUp: Variants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } } };

/* Icon map from JSON keys */
const ICONS = {
  fileText: FileText,
  shield: Shield,
  refreshCw: RefreshCw,
  mail: Mail,
  info: Info,
} as const;
type IconKey = keyof typeof ICONS;

type TocItem = { id: string; title: string; iconKey: IconKey };
type Section = { id: string; title: string; iconKey: IconKey; body: string[] };

export default function TermsOfServicePage() {
  const terms = siteData.terms;

  const lastUpdated = useMemo(() => terms?.lastUpdated ?? "Nov 14, 2024", [terms?.lastUpdated]);
  const introHeading = terms?.intro?.heading ?? "Terms of Service";
  const introSummary =
    terms?.intro?.summary ??
    "Welcome to Argus, provided by SoftMachine. By using the Argus mobile app and website, you agree to these Terms of Service.";
  const introBadges: string[] = Array.isArray(terms?.intro?.badges) ? terms!.intro!.badges : [];
  const contactUrl = terms?.contactUrl ?? "https://SoftMachine.co/contact";

  const toc: TocItem[] = Array.isArray(terms?.toc)
    ? (terms!.toc as TocItem[]).filter((t) => t.id && t.title)
    : [
        { id: "acceptance", title: "1. Acceptance of Terms", iconKey: "fileText" },
        { id: "accounts", title: "2. User Accounts", iconKey: "shield" },
        { id: "restrictions", title: "3. Restrictions on Use", iconKey: "info" },
        { id: "liability", title: "4. Liability & Disclaimer", iconKey: "shield" },
        { id: "updates", title: "5. Updates to Terms", iconKey: "refreshCw" },
        { id: "contact", title: "6. Contact Information", iconKey: "mail" },
      ];

  const sections: Section[] = Array.isArray(terms?.sections)
    ? (terms!.sections as Section[])
    : [];

  const stickyAsideNote =
    terms?.stickyAsideNote ?? "Welcome to Argus by SoftMachine.";

  return (
    <section className="relative overflow-hidden z-0">
      {/* BACKGROUND ACCENTS */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-1/4 h-72 w-72 md:h-96 md:w-96 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
        <div className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_20%,black,transparent)]">
          <div className="h-full w-full bg-[linear-gradient(to_right,theme(colors.muted/10)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.muted/10)_1px,transparent_1px)] bg-[size:28px_28px]" />
        </div>
      </div>

      {/* TOP BAR */}
      <div className="container mx-auto px-4 pt-8 md:pt-12">
        <div className="flex items-center justify-between gap-3">
          <GoBackButton />
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">Legal</Badge>
            <span className="text-sm text-muted-foreground">{introHeading}</span>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <motion.div variants={container} initial="hidden" animate="visible" className="container mx-auto px-4 pb-16 pt-6 md:pt-10">
        {/* HEADER */}
        <motion.header variants={fadeUp} className="mb-6 md:mb-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{introHeading}</h1>
              <p className="text-sm text-muted-foreground mt-2">Last Updated: {lastUpdated}</p>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* STICKY TOC */}
          <motion.aside variants={fadeUp} className="lg:col-span-4 xl:col-span-3">
            <Card className="border-muted/40 backdrop-blur supports-[backdrop-filter]:bg-background/70 sticky top-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">On this page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {toc.map(({ id, title, iconKey }) => {
                  const Icon = ICONS[iconKey] ?? Info;
                  return (
                    <a
                      key={id}
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="group flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
                    >
                      <Icon className="h-4 w-4 opacity-70 group-hover:opacity-100 transition" />
                      <span>{title}</span>
                    </a>
                  );
                })}
                <Separator className="my-3" />
                <div className="text-xs text-muted-foreground">{stickyAsideNote}</div>
              </CardContent>
            </Card>
          </motion.aside>

          {/* MAIN CONTENT */}
          <motion.div variants={fadeUp} className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Intro / Glass summary */}
            <Card className="border-muted/40 backdrop-blur supports-[backdrop-filter]:bg-background/70">
              <CardContent className="py-5">
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">{introSummary}</p>
                  {introBadges.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {introBadges.map((b) => (
                        <Badge key={b} variant="outline" className="rounded-full">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sections from JSON */}
            <Card className="border-muted/40">
              <CardContent className="py-6">
                <article className="space-y-8 leading-relaxed">
                  {sections.map((sec, i) => {
                    const Icon = ICONS[sec.iconKey] ?? Info;
                    return (
                      <div key={sec.id}>
                        <section id={sec.id} className="scroll-mt-24">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">{sec.title}</h2>
                          </div>
                          {sec.body?.map((p, idx) => (
                            <p key={idx} className="text-muted-foreground">{p}</p>
                          ))}
                          {/* Special handling for contact link if section is contact */}
                          {sec.id === "contact" && (
                            <p className="text-muted-foreground mt-2">
                              For questions, visit{" "}
                              <a
                                href={contactUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline underline-offset-4 hover:text-foreground"
                              >
                                {new URL(contactUrl).host + "/contact"}
                              </a>.
                            </p>
                          )}
                        </section>
                        {i < sections.length - 1 && <Separator className="my-6" />}
                      </div>
                    );
                  })}
                </article>
              </CardContent>
            </Card>

            {/* Helpful note (static fallback; can move to JSON later if needed) */}
            <motion.div variants={fadeUp}>
              <Card className="border-primary/30">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 mt-0.5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      These Terms provide a high-level overview. Additional policies (e.g., Privacy Policy)
                      may apply depending on the feature set you use in Argus.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
