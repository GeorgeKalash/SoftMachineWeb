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
  { id: "collection", title: "1. Information Collection", icon: FileText },
  { id: "use", title: "2. Use of Information", icon: Info },
  { id: "sharing", title: "3. Data Sharing", icon: FileText },
  { id: "security", title: "4. Data Security", icon: Shield },
  { id: "rights", title: "5. User Rights", icon: Info },
  { id: "cookies", title: "6. Cookies and Tracking", icon: Info },
  { id: "age", title: "7. Age Restrictions", icon: Info },
  { id: "updates", title: "8. Policy Updates", icon: RefreshCw },
  { id: "contact", title: "9. Contact Information", icon: Mail },
];

export default function PrivacyPolicyPage() {
  const lastUpdated = useMemo(() => "Nov 14, 2024", []);

  return (
    <section className="relative">
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
            <span className="text-sm text-muted-foreground">Privacy Policy</span>
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
                Privacy Policy
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
                  Argus by <span className="font-medium">SoftMachine</span>.
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
                    <strong>Argus</strong> (“App”), developed by{" "}
                    <strong>SoftMachine</strong>, values your privacy. This Privacy Policy
                    outlines our data collection, use, and security practices for both the
                    Argus app and website.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-full">Privacy</Badge>
                    <Badge variant="outline" className="rounded-full">Security</Badge>
                    <Badge variant="secondary" className="rounded-full">Compliance</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sections */}
            <Card className="border-muted/40">
              <CardContent className="py-6">
                <article className="space-y-8 leading-relaxed">
                  {/* 1 */}
                  <section id="collection" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">1. Information Collection</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Argus does not collect personal data. The app requests access to your
                      device&apos;s camera solely for in-app functionality, such as scanning
                      barcodes for job orders. This access is limited to on-device use and is
                      neither stored nor shared by Argus.
                    </p>
                  </section>

                  <Separator />

                  {/* 2 */}
                  <section id="use" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">2. Use of Information</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Argus does not use any data for personalization, marketing, analytics,
                      or third-party sharing. There are no analytics tools or third-party
                      services involved in the Argus app or website.
                    </p>
                  </section>

                  <Separator />

                  {/* 3 */}
                  <section id="sharing" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">3. Data Sharing</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Argus does not share user data with any third parties. The app connects
                      solely to the Argus website without integrating any third-party services.
                    </p>
                  </section>

                  <Separator />

                  {/* 4 */}
                  <section id="security" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">4. Data Security</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Although Argus does not collect personal data, we use JWT tokens and
                      secure protocols to protect account integrity for users accessing the
                      app and website.
                    </p>
                  </section>

                  <Separator />

                  {/* 5 */}
                  <section id="rights" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">5. User Rights</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Users manage account data through their Argus website accounts.
                      SoftMachine imposes no restrictions on data retrieval, but data
                      management is available solely through the website, not the mobile app.
                    </p>
                  </section>

                  <Separator />

                  {/* 6 */}
                  <section id="cookies" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">6. Cookies and Tracking</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Argus does not use cookies or other tracking technologies on the
                      website or app.
                    </p>
                  </section>

                  <Separator />

                  {/* 7 */}
                  <section id="age" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">7. Age Restrictions</h2>
                    </div>
                    <p className="text-muted-foreground">
                      No age restrictions are imposed, though users must comply with local
                      age requirements when creating an account on the Argus website.
                    </p>
                  </section>

                  <Separator />

                  {/* 8 */}
                  <section id="updates" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">8. Policy Updates</h2>
                    </div>
                    <p className="text-muted-foreground">
                      We may update this Privacy Policy periodically. Users will be notified
                      of updates via email linked to their Argus account.
                    </p>
                  </section>

                  <Separator />

                  {/* 9 */}
                  <section id="contact" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">9. Contact Information</h2>
                    </div>
                    <p className="text-muted-foreground">
                      For privacy inquiries, please visit{" "}
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
                      Argus is designed with privacy-by-default. If you introduce
                      new features that alter data flows (e.g., analytics or cloud
                      storage), remember to revise this policy accordingly.
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
