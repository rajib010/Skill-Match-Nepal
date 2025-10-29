import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface AuthSidePanelProps {
  type: "login" | "signup";
  features?: Feature[];
}

export function AuthSidePanel({ type, features }: AuthSidePanelProps) {
  const content = {
    login: {
      title: "Welcome Back!",
      subtitle: "Sign in to continue your journey",
      message: "Access your account and pick up right where you left off.",
    },
    signup: {
      title: "Start Your Journey",
      subtitle: "Create an account to get started",
      message: "Join thousands of users already enjoying our platform.",
    },
  };

  const currentContent = content[type];

  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background relative hidden md:flex flex-col justify-center p-8 lg:p-12">
      <div className="relative z-10 space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {currentContent.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {currentContent.subtitle}
          </p>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {currentContent.message}
        </p>

        {features && features.length > 0 && (
          <div className="space-y-4 pt-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex gap-3 items-start">
                  <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
