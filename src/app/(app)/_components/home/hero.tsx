"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/useUser";
import Link from "next/link";
import React from "react";

export default function Hero() {
  const { user } = useUser();

  return (
    <section className="relative flex flex-col items-center justify-center bg-gradient-hero min-h-screen overflow-hidden">
      <div className="absolute inset-0 opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center ">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Find Your Perfect Job Match
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            Let our system match your skills with thousands of
            opportunities available in Nepal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            {!user && (
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/login">Get Started</Link>
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-transparent text-primary hover:text-white hover:bg-primary text-lg px-8"
            >
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
