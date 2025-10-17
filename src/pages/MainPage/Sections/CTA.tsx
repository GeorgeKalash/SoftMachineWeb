import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const CTA = () => {
  const [email, setEmail] = useState("");
  const { ref, isVisible } = useScrollAnimation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing! Check your email for confirmation.");
      setEmail("");
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          ref={ref}
          className={`max-w-4xl mx-auto text-center transition-all duration-700 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Main CTA */}
          <div className="mb-20">
            <h2 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using our platform to work smarter and achieve
              more. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
              >
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm text-primary-foreground/70 mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>

          {/* Newsletter */}
          <div className="pt-20 border-t border-primary-foreground/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="h-6 w-6 text-primary-foreground" />
              <h3 className="text-2xl font-bold text-primary-foreground">
                Stay in the Loop
              </h3>
            </div>
            <p className="text-primary-foreground/90 mb-6">
              Subscribe to our newsletter for the latest updates, tips, and exclusive offers.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:border-primary-foreground"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                className="whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
