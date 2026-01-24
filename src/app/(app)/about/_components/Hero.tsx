"use client";

import React from "react";
import Image from "next/image";
import heroImage from "../../../../../public/home_hero.jpg";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center bg-gradient-hero min-h-screen overflow-hidden">
      <div className="absolute inset-0 opacity-80">
        <Image
          src={heroImage}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black/50 z-[1]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center ">
          <h1 className="text-4xl text-white md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            About Skill Match Nepal
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 opacity-90 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            Revolutionizing job search in Nepal by connecting talent with
            opportunity through intelligent skill-based matching
          </p>
        </div>
      </div>
    </section>
  );
}
