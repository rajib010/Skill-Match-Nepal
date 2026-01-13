import { Card } from "@/components/ui/card";
import { Briefcase, CheckCircle2 } from "lucide-react";
import React from "react";

export default function Benefits({ benefits }: { benefits: string[] }) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our platform combines cutting-edge AI with user-friendly design to
              make job hunting effortless.
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
  );
}
