import { TrendingUp, Users, Zap, Target } from "lucide-react";
import Hero from "./_components/home/hero";
import Features from "./_components/home/features";
import CTASection from "./_components/home/cta";
import TopJobs from "./_components/home/top-jobs";
import { getAllTestimonials } from "../(authenticated)/dashboard/testimonials/action";
import TestimonialWrapper from "./_components/home/testimonials";
import FAQ from "./_components/home/faq";

const features = [
  {
    icon: Target,
    title: "Smart Matching",
    description:
      "Our algorithm matches your skills with the perfect job opportunities.",
  },
  {
    icon: TrendingUp,
    title: "Top Searches",
    description: "See the most searched jobs by other candidates.",
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

export default async function Page() {
  const testimonialResponse = await getAllTestimonials();
  const testimonials = testimonialResponse.success
    ? testimonialResponse.data.testimonials
    : [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Hero />

      <TopJobs />

      {/* Features Section */}
      <Features features={features} />

      <TestimonialWrapper testimonials={testimonials} />

      <FAQ />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
