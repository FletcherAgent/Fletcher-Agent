"use client";

import { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import Architecture from "./components/sections/Architecture";
import Belief from "./components/sections/Belief";
import Agents from "./components/sections/Agents";
import Mind from "./components/sections/Mind";
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
      <Architecture />
      <Belief />
      <Agents />
      <Mind />
      <Safety />
      <Roadmap />
      <Cta />
      <Footer />
    </>
  );
}
