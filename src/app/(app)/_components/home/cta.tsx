"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/useUser";
import Link from "next/link";
import React from "react";

function CTASection() {
  const { user } = useUser();

  const userIsLoggedIn = user && user.id;
  const path = userIsLoggedIn ? "/jobs" : "/login";

  return (
    <section className="py-20 bg-gradient-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Find Your Perfect Match?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who found their dream jobs through
          Skill Match Nepal
        </p>
        <Button size="lg" asChild className="text-white text-lg px-8">
          <Link href={path}>Start Now</Link>
        </Button>
      </div>
    </section>
  );
}

export default CTASection;
