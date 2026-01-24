import React from "react";
import { Briefcase, Target, Users, Zap, Award, TrendingUp } from "lucide-react";
import Hero from "./_components/Hero";

const MissionSection = () => (
  <div className="py-16 px-6 bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold text-primary mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            At Skill Match Nepal, we believe that finding the right job
            shouldn&apos;t be about luck—it should be about skills. Our mission
            is to empower job seekers across Nepal by matching them with
            opportunities that truly align with their capabilities and
            aspirations.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We&apos;re committed to making the job market more accessible,
            transparent, and efficient for everyone, from fresh graduates to
            experienced professionals seeking their next career move.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Precision Matching
                </h3>
                <p className="text-gray-600">
                  Connect candidates with jobs that perfectly match their skill
                  sets
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Empowering Talent
                </h3>
                <p className="text-gray-600">
                  Help job seekers showcase their true potential to employers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <TrendingUp className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Career Growth
                </h3>
                <p className="text-gray-600">
                  Support continuous professional development and advancement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HowItWorksSection = () => (
  <div className="py-16 px-6 bg-gray-50">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-primary mb-4">
        How It <span className="italic font-normal">Works</span> ?
      </h2>
      <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
        Our intelligent system makes job searching simple and effective
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-primary">1</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Create Your Profile
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Build a comprehensive profile highlighting your skills, experience,
            education, and career preferences. The more details you add, the
            better your matches.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-primary">2</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Smart Matching
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Our advanced algorithm analyzes your skills and matches them with
            job requirements from top employers across Nepal, ensuring relevant
            opportunities.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-primary">3</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Get Matched
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Receive personalized job recommendations tailored to your profile.
            Apply directly and track your applications all in one place.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const FeaturesSection = () => (
  <div className="py-16 px-6 bg-white">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-primary mb-12">
        Why Choose <span className="italic font-normal">Skill Match Nepal</span> ?
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Instant Recommendations
          </h3>
          <p className="text-gray-600">
            Get job matches immediately after creating your profile, saving you
            hours of manual searching.
          </p>
        </div>

        <div className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Quality Over Quantity
          </h3>
          <p className="text-gray-600">
            Receive curated job recommendations that truly match your skills,
            not just generic listings.
          </p>
        </div>

        <div className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Local Expertise
          </h3>
          <p className="text-gray-600">
            Built specifically for the Nepali job market with deep understanding
            of local industries and needs.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <MissionSection />
      <HowItWorksSection />
      <FeaturesSection />
    </div>
  );
}
