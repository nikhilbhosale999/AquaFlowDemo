import React, { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import Scene from './components/Scene';
import GlassCard from './components/GlassCard';
import { ArrowRight, Play, Sparkles, Code, Layout, Blocks } from 'lucide-react';

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    let frameId;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen text-white overflow-hidden">
      <div id="canvas-container">
        <Scene />
      </div>

      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center mix-blend-difference">
        <div className="text-xl font-bold tracking-tight">AquaFlow Studio</div>
        <button className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-sm font-medium">
          Get in touch
        </button>
      </nav>

      <main className="relative z-10">
        {/* Section 1: Hero */}
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto pt-20 pb-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
              Immersive websites that move like water.
            </h1>
            <p className="text-lg md:text-xl text-brand-light/80 mb-10 max-w-xl font-light">
              We design interactive digital experiences with 3D motion, storytelling, and performance-first engineering.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-brand-accent hover:bg-blue-600 transition-colors text-white font-medium shadow-lg shadow-brand-accent/20">
                Explore Work <ArrowRight size={18} />
              </button>
              <button className="flex items-center gap-2 px-8 py-4 rounded-full glass-card hover:bg-white/5 transition-colors font-medium">
                <Play size={18} className="fill-white" /> Showreel
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: About */}
        <section className="min-h-screen flex items-center px-6 md:px-20 max-w-7xl mx-auto py-20">
          <div className="w-full md:w-1/2 ml-auto">
            <GlassCard className="p-10 md:p-14">
              <Sparkles className="text-brand-accent mb-6 w-10 h-10" />
              <h2 className="text-3xl md:text-5xl font-semibold mb-6">Motion Philosophy</h2>
              <p className="text-lg text-white/70 leading-relaxed font-light">
                We believe the web shouldn't be flat. By combining WebGL, advanced shaders, and fluid DOM animations, we create digital spaces that feel alive, responsive, and truly immersive.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Section 3: Services */}
        <section className="min-h-screen py-32 px-6 md:px-20 max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-20 text-center">Our Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-8 transform hover:-translate-y-2 transition-transform duration-500">
              <Code className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="text-2xl font-medium mb-4">3D Landing Pages</h3>
              <p className="text-white/60 font-light">High-conversion product pages with interactive 3D elements that grab attention and tell a story.</p>
            </GlassCard>
            <GlassCard className="p-8 transform hover:-translate-y-2 transition-transform duration-500 md:mt-12">
              <Blocks className="w-10 h-10 text-purple-400 mb-6" />
              <h3 className="text-2xl font-medium mb-4">WebGL Experiences</h3>
              <p className="text-white/60 font-light">Custom shaders, particle systems, and real-time 3D environments built for performance.</p>
            </GlassCard>
            <GlassCard className="p-8 transform hover:-translate-y-2 transition-transform duration-500 md:mt-24">
              <Layout className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-2xl font-medium mb-4">Scroll Storytelling</h3>
              <p className="text-white/60 font-light">Cinematic narrative experiences driven by user interaction and smooth scrolling mechanics.</p>
            </GlassCard>
          </div>
        </section>

        {/* Section 4: Process */}
        <section className="min-h-screen flex items-center px-6 md:px-20 max-w-7xl mx-auto py-20">
          <div className="w-full">
            <h2 className="text-4xl md:text-6xl font-bold mb-16">The Process</h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
              {[
                { step: "01", title: "Discovery & Concept", desc: "Understanding your brand and brainstorming interactive mechanics." },
                { step: "02", title: "3D Prototyping", desc: "Creating low-poly models and defining the motion path." },
                { step: "03", title: "Creative Development", desc: "Bringing the vision to life with React, Three.js, and GSAP." }
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/30 bg-brand-dark text-white/50 group-hover:text-white group-hover:border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 transition-colors">
                    {item.step}
                  </div>
                  <GlassCard className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6">
                    <h4 className="text-xl font-medium mb-2">{item.title}</h4>
                    <p className="text-white/60 text-sm font-light">{item.desc}</p>
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Showcase */}
        <section className="min-h-screen py-32 px-6 md:px-20 max-w-7xl mx-auto flex items-center">
          <GlassCard className="w-full aspect-video md:aspect-[21/9] p-8 md:p-12 flex flex-col justify-end">
            <h3 className="text-3xl md:text-5xl font-bold mb-4">Project Atlas</h3>
            <div className="flex gap-8 border-t border-white/10 pt-6 mt-6">
              <div>
                <div className="text-2xl font-bold text-brand-accent">2M+</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Interactions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-accent">60fps</div>
                <div className="text-sm text-white/50 uppercase tracking-wider">Performance</div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Section 6: Final CTA */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
          <div className="max-w-2xl relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-8">Let's build your immersive website.</h2>
            <p className="text-xl text-white/60 mb-10 font-light">Push the boundaries of what's possible on the web.</p>
            <button className="px-10 py-5 rounded-full bg-white text-brand-dark font-bold text-lg hover:bg-brand-light transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Start a Project
            </button>
          </div>
          
          <footer className="absolute bottom-8 py-8 text-center text-white/30 text-sm w-full">
            <p>© {new Date().getFullYear()} AquaFlow Studio. All rights reserved.</p>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
