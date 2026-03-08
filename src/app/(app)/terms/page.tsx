import React from "react";
import {
  FileText,
  UserCircle,
  CheckCircle,
  Briefcase,
  Shield,
  AlertTriangle,
  Ban,
  RefreshCw,
  HelpCircle,
} from "lucide-react";

const termsSections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content: [
      {
        subtitle: null,
        text: "By accessing and using Skill Match Nepal, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.",
      },
      {
        subtitle: null,
        text: "These terms constitute a legally binding agreement between you and Skill Match Nepal regarding your use of our job matching platform.",
      },
    ],
  },
  {
    icon: UserCircle,
    title: "User Accounts",
    content: [
      {
        subtitle: "Account Registration",
        text: "To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.",
      },
      {
        subtitle: "Account Security",
        text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized use or security breach.",
      },
      {
        subtitle: "Account Types",
        text: "We offer different account types including job seeker accounts and employer accounts. Each type has specific features and responsibilities as outlined in these terms.",
      },
    ],
  },
  {
    icon: CheckCircle,
    title: "User Responsibilities",
    content: [
      {
        subtitle: null,
        text: "As a user of Skill Match Nepal, you agree to:",
      },
      {
        subtitle: null,
        text: "• Provide truthful and accurate information in your profile and applications",
      },
      {
        subtitle: null,
        text: "• Keep your profile updated with current skills and experience",
      },
      {
        subtitle: null,
        text: "• Use the platform only for lawful purposes",
      },
      {
        subtitle: null,
        text: "• Respect intellectual property rights of others",
      },
      {
        subtitle: null,
        text: "• Not impersonate another person or entity",
      },
      {
        subtitle: null,
        text: "• Not engage in any form of harassment or discrimination",
      },
      {
        subtitle: null,
        text: "• Not attempt to circumvent platform security measures",
      },
    ],
  },
  {
    icon: Briefcase,
    title: "Job Listings & Applications",
    content: [
      {
        subtitle: "For Job Seekers",
        text: "You may browse job listings and submit applications through our platform. Our skill-matching algorithm provides recommendations based on your profile, but final hiring decisions rest solely with employers.",
      },
      {
        subtitle: "Match Scores",
        text: "Match scores are calculated based on the alignment between your skills and job requirements. These scores are estimates and do not guarantee employment.",
      },
      {
        subtitle: "Application Information",
        text: "When you apply for a job, your profile information and match score are shared with the employer. You consent to this sharing by submitting an application.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Intellectual Property",
    content: [
      {
        subtitle: "Platform Content",
        text: "The Skill Match Nepal platform, including its original content, features, and functionality, is owned by Skill Match Nepal and is protected by international copyright, trademark, and other intellectual property laws.",
      },
      {
        subtitle: "User Content",
        text: "You retain ownership of the content you submit to your profile. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute such content in connection with our platform.",
      },
      {
        subtitle: "Third-Party Content",
        text: "Job listings and other content posted by employers are the responsibility of those parties. We do not verify the accuracy of third-party content.",
      },
    ],
  },
  {
    icon: Ban,
    title: "Prohibited Activities",
    content: [
      {
        subtitle: null,
        text: "The following activities are strictly prohibited on our platform:",
      },
      {
        subtitle: null,
        text: "• Posting false, misleading, or fraudulent information",
      },
      {
        subtitle: null,
        text: "• Harassing, abusing, or harming other users",
      },
      {
        subtitle: null,
        text: "• Attempting to hack, disrupt, or damage the platform",
      },
      {
        subtitle: null,
        text: "• Using automated systems or bots to access the platform",
      },
      {
        subtitle: null,
        text: "• Engaging in discriminatory practices",
      },
      {
        subtitle: null,
        text: "• Violating any applicable laws or regulations",
      },
      {
        subtitle: null,
        text: "Violations may result in account suspension or termination without notice.",
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content: [
      {
        subtitle: "No Guarantee of Employment",
        text: "Skill Match Nepal provides a platform for connecting job seekers with employers. We do not guarantee job placements, interviews, or employment outcomes.",
      },
      {
        subtitle: "Platform Availability",
        text: "We strive to maintain platform availability but do not guarantee uninterrupted access. We may perform maintenance or experience technical issues that affect service.",
      },
      {
        subtitle: "Third-Party Actions",
        text: "We are not responsible for the actions, content, or conduct of employers or other third parties using our platform.",
      },
      {
        subtitle: "Maximum Liability",
        text: "To the maximum extent permitted by law, our total liability for any claims arising from your use of the platform shall not exceed the amount you paid to us, if any, in the past 12 months.",
      },
    ],
  },
  {
    icon: RefreshCw,
    title: "Changes to Terms",
    content: [
      {
        subtitle: null,
        text: "We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes by posting the updated terms on this page and updating the 'Last Updated' date.",
      },
      {
        subtitle: null,
        text: "Your continued use of the platform after changes are posted constitutes acceptance of the modified terms. If you do not agree to the changes, you must stop using the platform.",
      },
    ],
  },
  {
    icon: HelpCircle,
    title: "Contact Information",
    content: [
      {
        subtitle: null,
        text: "If you have questions about these Terms of Service, please contact us:",
      },
      {
        subtitle: null,
        text: "• Email: legal@skillmatchnepal.com",
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

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="my-container py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="section-heading">
            Terms of <span className="italic-heading">Service</span>
          </h1>
          <p className="text-header mt-4 font-poppins text-lg">
            Please read these terms carefully before using our platform. By
            using Skill Match Nepal, you agree to these terms.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last Updated: March 2025</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-gray-50 py-8">
        <div className="my-container">
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 leading-relaxed">
              Welcome to Skill Match Nepal. These Terms of Service govern your
              use of our job matching platform and services. By accessing or
              using our platform, you agree to be bound by these terms. Our
              platform connects talented professionals with employers based on
              skill matching, helping you find the right opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12">
        <div className="my-container">
          <div className="max-w-3xl mx-auto space-y-10">
            {termsSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100"
                >
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
              By using Skill Match Nepal, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
