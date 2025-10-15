import { Check, Target, TrendingUp, Users } from "lucide-react";
import aboutTeam from "@/assets/about-team.jpg";
import aboutDashboard from "@/assets/about-dashboard.jpg";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const stats = [
  { icon: Users, value: "10K+", label: "Active Users" },
  { icon: Target, value: "99.9%", label: "Uptime" },
  { icon: TrendingUp, value: "500+", label: "Companies" },
];

const benefits = [
  "Lightning-fast performance with optimized code",
  "Enterprise-grade security and data protection",
  "24/7 customer support with dedicated team",
  "Seamless integration with your existing tools",
  "Regular updates and feature enhancements",
  "Scalable infrastructure that grows with you",
];

const About = () => {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();
  const { ref: content1Ref, isVisible: content1Visible } = useScrollAnimation();
  const { ref: image1Ref, isVisible: image1Visible } = useScrollAnimation();
  const { ref: image2Ref, isVisible: image2Visible } = useScrollAnimation();
  const { ref: content2Ref, isVisible: content2Visible } = useScrollAnimation();

  const StatCard = ({ stat, index }: { stat: typeof stats[0], index: number }) => {
    const Icon = stat.icon;
    
    return (
      <div
        className={`text-center p-8 rounded-2xl bg-background shadow-lg hover:shadow-xl transition-all duration-700 ${
          statsVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
        <div className="text-4xl font-bold mb-2">{stat.value}</div>
        <div className="text-muted-foreground">{stat.label}</div>
      </div>
    );
  };

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div ref={statsRef} className="grid md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Main About Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div 
            ref={content1Ref}
            className={`space-y-6 transition-all duration-700 ${
              content1Visible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              About Our Platform
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Built for Modern Teams and Growing Businesses
            </h2>
            <p className="text-lg text-muted-foreground">
              We've created a powerful platform that combines cutting-edge technology with
              intuitive design. Our mission is to help teams work smarter, faster, and more
              efficiently than ever before.
            </p>
            <p className="text-lg text-muted-foreground">
              Whether you're a startup finding your footing or an enterprise scaling to new
              heights, our platform adapts to your needs with flexible features and robust
              infrastructure.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 transition-all duration-700 ${
                    content1Visible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <Check className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div 
            ref={image1Ref}
            className={`relative transition-all duration-700 delay-300 ${
              image1Visible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="relative">
              <img
                src={aboutTeam}
                alt="Team collaboration"
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>

        {/* Secondary Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div 
            ref={image2Ref}
            className={`relative order-2 lg:order-1 transition-all duration-700 ${
              image2Visible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="relative">
              <img
                src={aboutDashboard}
                alt="Dashboard interface"
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-accent/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>

          <div 
            ref={content2Ref}
            className={`space-y-6 order-1 lg:order-2 transition-all duration-700 delay-300 ${
              content2Visible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="inline-block px-4 py-2 bg-accent/20 text-accent-foreground rounded-full text-sm font-semibold">
              Powerful Features
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive suite of tools gives you complete control over your workflow.
              From advanced analytics to seamless collaboration, every feature is designed
              to help you succeed.
            </p>
            <div className="space-y-4 pt-4">
              <div className="p-6 bg-background rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2">Real-time Collaboration</h3>
                <p className="text-muted-foreground">
                  Work together seamlessly with your team members in real-time, no matter
                  where they are in the world.
                </p>
              </div>
              <div className="p-6 bg-background rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Gain deep insights into your data with powerful analytics tools and
                  customizable dashboards.
                </p>
              </div>
              <div className="p-6 bg-background rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2">API Integration</h3>
                <p className="text-muted-foreground">
                  Connect with your favorite tools and services through our robust API
                  and webhooks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
