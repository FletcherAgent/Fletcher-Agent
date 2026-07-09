import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import Marquee from "./components/ui/Marquee";
import Pipeline from "./components/sections/Pipeline";
import Layers from "./components/sections/Layers";
import Features from "./components/sections/Features";

export default function Home() {
  return (
    <div id="landing-view">
      <Navbar />
      <Hero />
      <Marquee />
      <Pipeline />
      <Layers />
      <Features />
      <Footer />
    </div>
  );
}
