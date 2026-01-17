import React from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function Features({ features }: { features: Feature[] }) {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center my-7 max-w-2xl mx-auto">
          <h1 className="section-heading">
            Why choose <span className="italic-heading">Skill Match?</span>
          </h1>{" "}
          <p className="text-header my-2 font-poppins">
            Skill Match recommends jobs based on the skills added in your
            profile, helping you find the right opportunities easily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-none hover:border-primary transition-all hover:-translate-y-2 duration-75 hover:shadow-md"
            >
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
