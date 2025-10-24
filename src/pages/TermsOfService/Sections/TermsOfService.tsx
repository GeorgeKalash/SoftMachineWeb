"use client";

import { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { GoBackButton } from "@/sharedComponent/GoBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Shield,
  RefreshCw,
  Mail,
  Info,
  ArrowRight,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
};

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms", icon: FileText },
  { id: "accounts", title: "2. User Accounts", icon: Shield },
  { id: "restrictions", title: "3. Restrictions on Use", icon: Info },
  { id: "liability", title: "4. Liability & Disclaimer", icon: Shield },
  { id: "updates", title: "5. Updates to Terms", icon: RefreshCw },
  { id: "contact", title: "6. Contact Information", icon: Mail },
];

export default function ReferencesPage() {
  const lastUpdated = useMemo(() => "Nov 14, 2024", []);

  return (
      <section className="relative overflow-hidden z-0">

      {/* BACKGROUND ACCENTS */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* soft radial glow */}
        <div className="absolute -top-24 right-1/4 h-72 w-72 md:h-96 md:w-96 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
        {/* subtle grid overlay */}
        <div className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_20%,black,transparent)]">
          <div className="h-full w-full bg-[linear-gradient(to_right,theme(colors.muted/10)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.muted/10)_1px,transparent_1px)] bg-[size:28px_28px]" />
        </div>
      </div>

      {/* TOP BAR */}
      <div className="container mx-auto px-4 pt-8 md:pt-12">
        <div className="flex items-center justify-between gap-3">
          <GoBackButton />
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              Legal
            </Badge>
            <span className="text-sm text-muted-foreground">Terms of Service</span>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 pb-16 pt-6 md:pt-10"
      >
        {/* HEADER */}
        <motion.header variants={fadeUp} className="mb-6 md:mb-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Terms of Service
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Last Updated: {lastUpdated}
              </p>
            </div>
            
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* STICKY TOC */}
          <motion.aside
            variants={fadeUp}
            className="lg:col-span-4 xl:col-span-3"
          >
            <Card className="border-muted/40 backdrop-blur supports-[backdrop-filter]:bg-background/70 sticky top-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">On this page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map(({ id, title, icon: Icon }) => (
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
                ))}
                <Separator className="my-3" />
                <div className="text-xs text-muted-foreground">
                  Welcome to <span className="font-medium">Argus</span> by{" "}
                  <span className="font-medium">SoftMachine</span>.
                </div>
              </CardContent>
            </Card>
          </motion.aside>

          {/* MAIN CONTENT */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-8 xl:col-span-9 space-y-6"
          >
            {/* Intro / Glass summary */}
            <Card className="border-muted/40 backdrop-blur supports-[backdrop-filter]:bg-background/70">
              <CardContent className="py-5">
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    Welcome to <strong>Argus</strong>, provided by{" "}
                    <strong>SoftMachine</strong> (“Company,” “we,” “our,” or “us”).
                    By using the Argus mobile app and website, you agree to these Terms
                    of Service. Please read them carefully.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-full">Argus</Badge>
                    <Badge variant="outline" className="rounded-full">SoftMachine</Badge>
                    <Badge variant="secondary" className="rounded-full">Legal</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sections */}
            <Card className="border-muted/40">
              <CardContent className="py-6">
                <article className="space-y-8 leading-relaxed">
                  {/* 1 */}
                  <section id="acceptance" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
                    </div>
                    <p className="text-muted-foreground">
                      By using the Argus app or website, you agree to abide by these Terms.
                      If you do not agree, please refrain from using our services.
                    </p>
                  </section>

                  <Separator />

                  {/* 2 */}
                  <section id="accounts" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">2. User Accounts</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Users must create an account on the Argus website to access the app.
                      Account security is managed through secure credentials and JWT tokens
                      to protect user data.
                    </p>
                  </section>

                  <Separator />

                  {/* 3 */}
                  <section id="restrictions" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">3. Restrictions on Use</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Use the app only for lawful purposes and within its intended functionality.
                      Unauthorized interference or modification is prohibited.
                    </p>
                  </section>

                  <Separator />

                  {/* 4 */}
                  <section id="liability" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">4. Liability and Disclaimer</h2>
                    </div>
                    <p className="text-muted-foreground">
                      The Argus app and website are provided “as is” without warranties.
                      SoftMachine disclaims liability for damages arising from app usage,
                      to the extent permitted by law.
                    </p>
                  </section>

                  <Separator />

                  {/* 5 */}
                  <section id="updates" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">5. Updates to Terms</h2>
                    </div>
                    <p className="text-muted-foreground">
                      We may periodically update these Terms. Changes will be notified to users
                      via email.
                    </p>
                  </section>

                  <Separator />

                  {/* 6 */}
                  <section id="contact" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">6. Contact Information</h2>
                    </div>
                    <p className="text-muted-foreground">
                      For questions, refer to our contact page at{" "}
                      <a
                        href="https://SoftMachine.co/contact"
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-4 hover:text-foreground"
                      >
                        SoftMachine.co/contact
                      </a>.
                    </p>
                  </section>
                </article>
              </CardContent>
            </Card>

            {/* Helpful note */}
            <motion.div variants={fadeUp}>
              <Card className="border-primary/30">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 mt-0.5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      These Terms provide a high-level overview. Additional policies (e.g.,
                      Privacy Policy) may apply depending on the feature set you use in Argus.
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
