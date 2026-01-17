import React from "react";
import { PersonStandingIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function TopJobs() {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center  max-w-2xl mx-auto">
          <h1 className="section-heading mt-4">
            Top <span className="italic-heading">Jobs</span>
          </h1>{" "}
          <p className="text-header mt-2 font-poppins">
            Here&apos;s are the top jobs, available now matching your profile.
            If you don&apos;t see the suitable ones, try updating your profile.
          </p>
        </div>

        <div className="w-full flex justify-end">
          <Link
            href={"/jobs"}
            className={buttonVariants({ variant: "outline" })}
          >
            View More
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <PersonStandingIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">title</h3>
              <p className="text-muted-foreground">Description</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
