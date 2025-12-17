import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";
import logo from "../../../src/assets/logo.png";

const footerLinks = {
  legal: [
    { name: "Privacy Policy", href: "/PrivacyPolicyPage" },
    { name: "Terms of Service", href: "/termsofservice" },
    { name: "Security", href: "/security" },
    { name: "GDPR", href: "/gdpr" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/soft-machine/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/_softmachine_/", label: "Instagram" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
        relative overflow-hidden
        bg-gradient-to-b from-[#0a0a0a] via-[#0e0e0e] to-[#0a0a0a]
        text-neutral-200
        border-t border-white/5
      "
    >
      {/* subtle top glow line */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* vignette edges */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_500px_at_50%_-200px,rgba(255,255,255,0.06),transparent_60%)]" />

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        {/* Main: 3 equal columns at md+ */}
        <div
          className="
            grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12 mb-10 md:mb-12
          "
        >
          {/* Left: Brand + description */}
          <section className="order-1 md:order-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="
                  rounded-xl border border-white/10
                  bg-white/5 backdrop-blur-sm p-1.5 shadow-sm
                "
              >
                <img
                  src={logo}
                  alt="SoftMachine logo"
                  className="h-10 w-auto"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <span className="text-2xl font-semibold tracking-tight text-white">
                SoftMachine
              </span>
            </div>

            <p className="text-sm md:text-base text-neutral-400 mb-0 md:mb-2 max-w-prose leading-relaxed">
              We design and build custom software that solves real business problems.
            </p>
          </section>

          {/* Middle: Contact block (center column) */}
          <section className="order-3 md:order-2 md:flex md:justify-center">
            <div className="space-y-3 text-sm">
              <a
                href="mailto:info@softmachine.co"
                className="
                  group flex items-center gap-3
                  text-neutral-400 hover:text-white transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-lg
                "
              >
                <Mail className="h-4 w-4 opacity-90 transition group-hover:opacity-100" />
                <span className="underline decoration-transparent underline-offset-4 group-hover:decoration-white/60">
                  info@softmachine.co
                </span>
              </a>

              <a
                href="tel:+96176888468"
                className="
                  group flex items-center gap-3
                  text-neutral-400 hover:text-white transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-lg
                "
              >
                <Phone className="h-4 w-4 opacity-90 transition group-hover:opacity-100" />
                <span className="underline decoration-transparent underline-offset-4 group-hover:decoration-white/60">
                  +961 76 888 468
                </span>
              </a>

              <div className="flex items-start gap-3 text-neutral-400">
                <MapPin className="mt-0.5 h-4 w-4 opacity-90" />
                <span className="leading-relaxed">
                  Bitar Bldg, 4th Floor, Sahel Alma, 1658 Jounieh, Lebanon
                </span>
              </div>
            </div>
          </section>

          {/* Right: Legal */}
          <section className="order-2 md:order-3 md:justify-self-end">
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-neutral-200">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="
                      text-sm text-neutral-400 hover:text-white transition-colors
                      underline decoration-transparent underline-offset-4 hover:decoration-white/60
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20
                      rounded-md px-1 py-0.5
                    "
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-neutral-400">
              © {currentYear} SoftMachine. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group inline-flex h-10 w-10 items-center justify-center
                    rounded-full border border-white/10
                    bg-white/5 hover:bg-white/10
                    backdrop-blur-sm transition-all hover:-translate-y-0.5
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20
                  "
                >
                  <Icon className="h-5 w-5 text-neutral-200 opacity-90 transition group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
