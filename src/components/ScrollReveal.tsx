"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  stagger?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 40,
  once = true,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const getInitialValues = () => {
      switch (direction) {
        case "up":
          return { y: distance, opacity: 0 };
        case "down":
          return { y: -distance, opacity: 0 };
        case "left":
          return { x: distance, opacity: 0 };
        case "right":
          return { x: -distance, opacity: 0 };
        case "none":
          return { opacity: 0 };
        default:
          return { y: distance, opacity: 0 };
      }
    };

    const getFinalValues = () => {
      switch (direction) {
        case "up":
        case "down":
          return { y: 0, opacity: 1 };
        case "left":
        case "right":
          return { x: 0, opacity: 1 };
        case "none":
          return { opacity: 1 };
        default:
          return { y: 0, opacity: 1 };
      }
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elementRef.current,
        getInitialValues(),
        {
          ...getFinalValues(),
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: elementRef.current,
            start: "top 85%",
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        }
      );
    }, elementRef);

    return () => ctx.revert();
  }, [direction, delay, duration, distance, once]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

interface ScrollRevealGroupProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  stagger?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

export function ScrollRevealGroup({
  children,
  className = "",
  direction = "up",
  stagger = 0.1,
  duration = 0.6,
  distance = 30,
  once = true,
}: ScrollRevealGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const getInitialValues = () => {
      switch (direction) {
        case "up":
          return { y: distance, opacity: 0 };
        case "down":
          return { y: -distance, opacity: 0 };
        case "left":
          return { x: distance, opacity: 0 };
        case "right":
          return { x: -distance, opacity: 0 };
        default:
          return { y: distance, opacity: 0 };
      }
    };

    const getFinalValues = () => {
      switch (direction) {
        case "up":
        case "down":
          return { y: 0, opacity: 1 };
        case "left":
        case "right":
          return { x: 0, opacity: 1 };
        default:
          return { y: 0, opacity: 1 };
      }
    };

    const ctx = gsap.context(() => {
      const children = containerRef.current?.children;
      if (!children || children.length === 0) return;

      gsap.set(children, getInitialValues());
      gsap.to(children, {
        ...getFinalValues(),
        duration,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: once ? "play none none none" : "play none none reverse",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [direction, stagger, duration, distance, once]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
