import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const faqs = [
  {
    question: "How do I get started with the platform?",
    answer:
      "Getting started is easy! Simply sign up for a free trial, and you'll have immediate access to all features. Our onboarding wizard will guide you through the setup process, and our support team is available 24/7 if you need any assistance.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "Yes, absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle, and we'll prorate any payments to ensure you only pay for what you use.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers. All payments are processed securely through our encrypted payment gateway.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Security is our top priority. We use industry-standard encryption (256-bit SSL) to protect your data both in transit and at rest. Our infrastructure is SOC 2 compliant, and we perform regular security audits to ensure your information stays safe.",
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Yes! We offer email support for all plans, with response times within 24 hours. Professional and Enterprise plans include priority support with faster response times and access to our dedicated support team via chat and phone.",
  },
  {
    question: "Can I integrate with other tools?",
    answer:
      "Absolutely! We offer integrations with over 100 popular tools and services including Slack, Google Workspace, Microsoft Teams, Salesforce, and many more. We also provide a comprehensive API for custom integrations.",
  },
  {
    question: "What happens if I cancel my subscription?",
    answer:
      "You can cancel your subscription at any time. You'll continue to have access to all features until the end of your billing period. After cancellation, your data will be stored securely for 30 days, giving you time to export it if needed.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! We offer a 14-day free trial with full access to all features. No credit card is required to start your trial, and you can upgrade to a paid plan at any time during or after the trial period.",
  },
];

const FAQ = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: accordionRef, isVisible: accordionVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div 
            ref={headerRef}
            className={`text-center mb-16 transition-all duration-700 ${
              headerVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              FAQ
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Have questions? We've got answers. If you can't find what you're looking for,
              feel free to contact our support team.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion
            ref={accordionRef}
            type="single"
            collapsible
            className={`space-y-4 transition-all duration-700 delay-300 ${
              accordionVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-muted/30 rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-lg pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div 
            ref={ctaRef}
            className={`mt-16 text-center p-8 bg-muted/30 rounded-2xl transition-all duration-700 delay-500 ${
              ctaVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center text-primary hover:underline font-semibold"
            >
              Contact Support →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
