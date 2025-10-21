import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";
import logo from "../../../src/assets/logo.png";

const footerLinks = {
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Security", href: "/security" },
    { name: "GDPR", href: "/gdpr" },
  ],
};

const socialLinks = [
  // If you have the exact LinkedIn URL, replace the href below.
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/_softmachine_/", label: "Instagram" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-secondary rounded-lg p-1">
                <img
                  src={logo}
                  alt="SoftMachine logo"
                  className="h-10 w-auto"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <span className="text-2xl font-bold">SoftMachine</span>
            </div>

            <p className="text-muted-foreground mb-6 max-w-sm">
              We design and build custom software that solves real business problems.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@softmachine.co" className="hover:text-primary transition-colors">
                  info@softmachine.co
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:+96176888468" className="hover:text-primary transition-colors">
                  +961 76 888 468
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Bitar Bldg, 4th Floor, Sahel Alma, 1658 Jounieh, Lebanon</span>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {currentYear} SoftMachine. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
