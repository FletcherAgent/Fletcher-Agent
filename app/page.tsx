"use client";

import { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import HowFletcherLPs from "./components/sections/HowFletcherLPs";
import ZeroCustody from "./components/sections/ZeroCustody";
import FletchTiers from "./components/sections/FletchTiers";
import Agents from "./components/sections/Agents";
import Safety from "./components/sections/Safety";
import Roadmap from "./components/sections/Roadmap";
import Cta from "./components/sections/Cta";
import Footer from "./components/layout/Footer";

export default function Home() {
  // Global Reveal Observer
  useEffect(() => {
    const ioReveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            ioReveal.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => ioReveal.observe(el));

    return () => {
      ioReveal.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <HowFletcherLPs />
      <Agents />
      <Safety />
      <ZeroCustody />
      <FletchTiers />
      <Roadmap />
      <Cta />
      <Footer />
    </>
  );
}
