"use client";

import React, { useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { TestimonialType } from "@/app/(authenticated)/dashboard/testimonials/action";

interface TestimonialsSliderProps {
  testimonials: TestimonialType[];
}

function TestimonialsSlider({ testimonials }: TestimonialsSliderProps) {
  const topRowRef = useRef<HTMLDivElement>(null);
  const processedTestimonials = useMemo(() => {
    // Create testimonial arrays
    const createTestimonialArray = (items: TestimonialType[], copies = 8) => {
      return Array(copies).fill(items).flat();
    };

    return createTestimonialArray(testimonials);
  }, [testimonials]);

  // Memoize scroll styles
  const scrollStyles = useMemo(
    () => `
  @keyframes scroll-right {
    0% { transform: translateX(0px); }
    100% { transform: translateX(-${processedTestimonials.length * 100}px); }
  }
 
  .animate-scroll-right {
    animation: scroll-right 40s linear infinite;
  }

  .row-container {
    display: flex;
    width: fit-content;
    will-change: transform;
  }
`,
    [processedTestimonials.length]
  );

  // Handle mouse events
  const handleMouseEnter = useCallback(() => {
    requestAnimationFrame(() => {
      if (topRowRef.current) {
        topRowRef.current.style.animationPlayState = "paused";
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    requestAnimationFrame(() => {
      if (topRowRef.current) {
        topRowRef.current.style.animationPlayState = "running";
      }
    });
  }, []);

  // Initialize animations on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      if (topRowRef.current) {
        topRowRef.current.style.animationPlayState = "running";
      }
    });
  }, []);

  // Render star rating
  const renderStars = (rating: number) => {
    const count = Math.max(0, Math.floor(rating));
    const size = 20;

    return (
      <div
        className="inline-flex items-center gap-1 "
        role="img"
        aria-label={`${count} star${count === 1 ? "" : "s"}`}
      >
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="relative inline-block w-5 h-5">
            {/* blurred layer */}
            <Image
              src="/home/Star1.svg"
              alt=""
              width={size}
              height={size}
              draggable={false}
              className="pointer-events-none select-none absolute inset-0 z-10"
              style={{ filter: "blur(10px)", opacity: 0.75 }}
              aria-hidden="true"
            />
            {/* crisp layer */}
            <Image
              src="/home/Star1.svg"
              alt=""
              width={size}
              height={size}
              draggable={false}
              className="pointer-events-none select-none absolute inset-0 z-20"
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    );
  };

  // Testimonial Card Component
  const TestimonialCard = ({
    testimonial,
  }: {
    testimonial: TestimonialType;
  }) => (
    <div
      className="
      flex-shrink-0 w-[320px] md:w-[380px] lg:w-[418px]  mx-2
      rounded-[20px]
      border border-[#E3F0FB]
      bg-[linear-gradient(90deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.25)_100%)]
      backdrop-blur-2xl
      p-6
    "
    >
      <h1 className="italic-heading text-3xl text-header">
        {testimonial.name}
      </h1>

      <p className="text-sm text-[#7F8991] mt-3">{testimonial.address}</p>

      {/* Rating */}
      <div className="my-8">{renderStars(testimonial.rating)}</div>

      {/* Content */}
      <p className="text-[#565D64]">{testimonial.message}</p>
    </div>
  );

  return (
    <div className=" w-full py-8 overflow-hidden">
      <style>{scrollStyles}</style>

      {processedTestimonials && processedTestimonials.length > 0 && (
        <div className="space-y-6">
          {/* Top Row - Scroll Right */}
          <div>
            <div
              ref={topRowRef}
              className="row-container animate-scroll-right"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {processedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`top-${index}`}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TestimonialWrapper({
  testimonials,
}: TestimonialsSliderProps) {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center my-7 max-w-2xl mx-auto">
          <h1 className="section-heading">
            User&apos;s <span className="italic-heading">Testimonials</span>
          </h1>{" "}
          <p className="text-header my-2 font-poppins">
            See how Skill Match Nepal helps users find jobs that match their
            skills.
          </p>
        </div>
        <TestimonialsSlider testimonials={testimonials} />
      </div>
    </section>
  );
}
