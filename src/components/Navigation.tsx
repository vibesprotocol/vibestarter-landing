"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#the-problem", label: "Why" },
  { href: "#the-shift", label: "Thesis" },
  { href: "#funding-changed", label: "Solution" },
  { href: "#how-vibestarter-works", label: "How It Works" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Background with blur - becomes more opaque on scroll */}
      <div
        className={`absolute inset-0 nav-blur transition-all duration-300 ${
          scrolled ? 'bg-[#0A0A0A]/70' : 'bg-transparent'
        }`}
      />

      {/* Subtle shadow fade - only shows when scrolled */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-16 translate-y-full pointer-events-none transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0) 100%)'
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5 sm:gap-1">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 32 32" fill="none">
            {/* Terminal prompt ">" */}
            <path
              d="M4 8L14 16L4 24"
              stroke="#91D982"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Cursor "_" */}
            <path
              d="M16 24H28"
              stroke="#91D982"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-semibold text-base sm:text-lg tracking-tight">Vibestarter</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] text-muted hover:text-white transition-colors hover-line"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="https://app.vibestarter.xyz"
            className="btn-primary px-6 py-2.5 rounded-lg text-[15px]"
          >
            Get started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-muted hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-[#0A0A0A]/98 nav-blur">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[15px] text-muted hover:text-white transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                href="https://app.vibestarter.xyz"
                className="btn-primary block text-center px-5 py-3 rounded-lg text-[15px]"
              >
                Launch Your Raise
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
