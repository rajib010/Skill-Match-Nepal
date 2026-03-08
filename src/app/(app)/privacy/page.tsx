import React from "react";
import { Shield, UserCircle, Database, Lock, Eye, Cookie, FileText, BellIcon, HelpCircle } from "lucide-react";

const privacySections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      {
        subtitle: "Personal Information",
        text: "When you create an account, we collect your name, email address, phone number, and location. This information is essential for creating your profile and connecting you with potential employers.",
      },
      {
        subtitle: "Profile Information",
        text: "We collect information about your skills, education, work experience, and career preferences to provide personalized job recommendations and match you with suitable opportunities.",
      },
      {
        subtitle: "Usage Data",
        text: "We automatically collect information about how you interact with our platform, including pages visited, search queries, jobs viewed, and applications submitted.",
      },
    ],
  },
  {
    icon: UserCircle,
    title: "How We Use Your Information",
    content: [
      {
        subtitle: null,
        text: "We use your information to:",
      },
      {
        subtitle: null,
        text: "• Provide personalized job recommendations based on your skills and preferences",
      },
      {
        subtitle: null,
        text: "• Process your job applications and communicate with employers",
      },
      {
        subtitle: null,
        text: "• Improve our matching algorithm and platform functionality",
      },
      {
        subtitle: null,
        text: "• Send relevant notifications about new job opportunities",
      },
      {
        subtitle: null,
        text: "• Ensure platform security and prevent fraudulent activities",
      },
    ],
  },
  {
    icon: Eye,
    title: "Information Sharing",
    content: [
      {
        subtitle: null,
        text: "We respect your privacy and do not sell your personal information. We may share your information in the following circumstances:",
      },
      {
        subtitle: "With Employers",
        text: "When you apply for a job, your profile information and match score are shared with the employer to facilitate the hiring process.",
      },
      {
        subtitle: "Service Providers",
        text: "We work with trusted third-party services for hosting, analytics, and email delivery. These providers are bound by confidentiality agreements.",
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose information when required by law or to protect our rights and the safety of our users.",
      },
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      {
        subtitle: null,
        text: "We implement industry-standard security measures to protect your data, including:",
      },
      {
        subtitle: null,
        text: "• Encryption of sensitive data in transit and at rest",
      },
      {
        subtitle: null,
        text: "• Regular security audits and vulnerability assessments",
      },
      {
        subtitle: null,
        text: "• Access controls and authentication mechanisms",
      },
      {
        subtitle: null,
        text: "• Secure data storage with regular backups",
      },
      {
        subtitle: null,
        text: "While we strive to protect your information, no method of transmission over the internet is 100% secure.",
      },
    ],
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    content: [
      {
        subtitle: null,
        text: "We use cookies and similar technologies to enhance your experience on our platform. These help us:",
      },
      {
        subtitle: null,
        text: "• Remember your preferences and login status",
      },
      {
        subtitle: null,
        text: "• Analyze platform usage and improve our services",
      },
      {
        subtitle: null,
        text: "• Provide personalized content and recommendations",
      },
      {
        subtitle: null,
        text: "You can control cookie settings through your browser preferences.",
      },
    ],
  },
  {
    icon: FileText,
    title: "Your Rights",
    content: [
      {
        subtitle: null,
        text: "You have the right to:",
      },
      {
        subtitle: null,
        text: "• Access and download your personal data",
      },
      {
        subtitle: null,
        text: "• Correct inaccurate or incomplete information",
      },
      {
        subtitle: null,
        text: "• Delete your account and associated data",
      },
      {
        subtitle: null,
        text: "• Opt-out of marketing communications",
      },
      {
        subtitle: null,
        text: "• Object to certain processing of your data",
      },
      {
        subtitle: null,
        text: "To exercise these rights, please contact us using the information provided below.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Children's Privacy",
    content: [
      {
        subtitle: null,
        text: "Our platform is not intended for users under 16 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a minor, please contact us immediately.",
      },
    ],
  },
  {
    icon: BellIcon,
    title: "Changes to This Policy",
    content: [
      {
        subtitle: null,
        text: "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the 'Last Updated' date. Continued use of our platform after changes constitutes acceptance of the updated policy.",
      },
    ],
  },
  {
    icon: HelpCircle,
    title: "Contact Us",
    content: [
      {
        subtitle: null,
        text: "If you have questions or concerns about this Privacy Policy or our data practices, please contact us:",
      },
      {
        subtitle: null,
        text: "• Email: privacy@skillmatchnepal.com",
      },
      {
        subtitle: null,
        text: "• Through our contact form at /contact",
      },
      {
        subtitle: null,
        text: "• Address: Kathmandu, Nepal",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="my-container py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="section-heading">
            Privacy <span className="italic-heading">Policy</span>
          </h1>
          <p className="text-header mt-4 font-poppins text-lg">
            Your privacy matters to us. Learn how Skill Match Nepal collects,
            uses, and protects your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last Updated: March 2025
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-gray-50 py-8">
        <div className="my-container">
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 leading-relaxed">
              Welcome to Skill Match Nepal. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our job matching platform. Please read this policy carefully.
              By using our platform, you consent to the practices described in
              this policy.
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12">
        <div className="my-container">
          <div className="max-w-3xl mx-auto space-y-10">
            {privacySections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-primary">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {section.content.map((item, idx) => (
                      <div key={idx}>
                        {item.subtitle && (
                          <h3 className="font-medium text-gray-900 mb-1">
                            {item.subtitle}
                          </h3>
                        )}
                        <p className="text-gray-600 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="bg-gray-50 py-8">
        <div className="my-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-500 text-sm">
              By using Skill Match Nepal, you acknowledge that you have read and
              understood this Privacy Policy and agree to its terms.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
