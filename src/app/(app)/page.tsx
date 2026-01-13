import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import Hero from "./_components/home/hero";
import Features from "./_components/home/features";
import Benefits from "./_components/home/benefits";
import CTASection from "./_components/home/cta";

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

export default function Page() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features features={features} />

      {/* Benefits Section */}
      <Benefits benefits={benefits} />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
