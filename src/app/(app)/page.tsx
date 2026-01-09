import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Footer } from "@/components/Footer";
import {
  Briefcase,
  TrendingUp,
  Users,
  Zap,
  CheckCircle2,
  Target,
} from "lucide-react";
import Link from "next/link";

export default function Page(){
  const features = [
    {
      icon: Target,
      title: "Smart Matching",
      description:
        "Our AI-powered algorithm matches your skills with the perfect job opportunities.",
    },
    {
      icon: TrendingUp,
      title: "Match Percentage",
      description:
        "See how well you match each job with our detailed compatibility scores.",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get personalized job recommendations in seconds, not days.",
    },
    {
      icon: Users,
      title: "Trusted Companies",
      description: "Access opportunities from thousands of verified employers.",
    },
  ];

  const benefits = [
    "AI-powered job recommendations tailored to your skills",
    "Real-time matching with thousands of opportunities",
    "Detailed compatibility analysis for each position",
    "Easy application process with one-click apply",
    "Track your applications and matches in one place",
    "Get notified of new matches instantly",
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center bg-gradient-hero min-h-screen overflow-hidden">
        <div className="absolute inset-0 opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center ">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Find Your Perfect Job Match
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
              Let our AI-powered system match your skills with thousands of
              opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/auth">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-transparent text-primary hover:text-primary text-lg px-8"
              >
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose JobMatch?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced technology meets simplicity to help you find your dream
              job
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Everything You Need to Land Your Dream Job
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform combines cutting-edge AI with user-friendly design
                to make job hunting effortless.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <Card className="p-8 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                  {[95, 87, 82].map((percent, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="h-3 bg-muted rounded w-2/3 mb-2"></div>
                        <div className="h-2 bg-muted rounded w-1/3"></div>
                      </div>
                      <div className="ml-4 px-3 py-1 bg-success/10 text-success rounded-full text-sm font-semibold">
                        {percent}%
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who found their dream jobs through
            JobMatch
          </p>
          <Button size="lg" asChild className="text-white text-lg px-8">
            <Link href="/auth">Start Matching Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

