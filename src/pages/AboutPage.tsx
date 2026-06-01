import React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Heart, Film, Compass, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import Logo from "../components/Logo";

const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-fuchsia-400/40 hover:bg-white/10"
  >
    <div className="mb-4 inline-flex rounded-xl bg-fuchsia-500/10 p-3 text-fuchsia-300 ring-1 ring-fuchsia-400/30 group-hover:bg-fuchsia-500/20 group-hover:scale-110 transition">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
    <p className="text-sm text-white/60">{description}</p>
  </motion.div>
);

const AboutPage: React.FC = () => {
  React.useEffect(() => {
    document.title = "About Absolute Cinema | OTT Discovery Platform";
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Persistent ambient gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 no-x-overflow">
        <div className="absolute inset-0 cinema-radial" />
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 h-[30rem] w-[30rem] rounded-full bg-purple-700/15 blur-[140px]" />
      </div>

      <Navbar />

      <main className="relative mx-auto max-w-7xl px-3 sm:px-4 pt-32 pb-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-hero-primary font-display font-bold text-gradient-cinema mb-6">
            About Absolute Cinema
          </h1>
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-white/70 leading-relaxed">
            Absolute Cinema is a curated OTT discovery platform that helps users discover movies and series across streaming platforms including Netflix, Prime Video, JioHotstar, Sony LIV, Zee5, Aha, and more.
          </p>
        </motion.div>

        {/* Our Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="glass-strong rounded-3xl p-8 sm:p-12 border border-fuchsia-400/20">
            <h2 className="text-section-title font-display font-bold text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-white/70 leading-relaxed max-w-4xl">
              We believe that great entertainment should be easy to discover. In a world with dozens of streaming platforms, finding the perfect movie or series can feel overwhelming. Absolute Cinema bridges this gap by curating and organizing content across all major OTT platforms, making your discovery journey seamless and enjoyable.
            </p>
          </div>
        </motion.section>

        {/* What We Offer Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-section-title font-display font-bold text-white mb-8 text-center">
            What We Offer
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Sparkles}
              title="Weekly OTT Releases"
              description="Stay updated with the latest movies and series released across all streaming platforms every week."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Trending Movies & Series"
              description="Discover what's hot right now with our curated trending section featuring the most-watched content."
            />
            <FeatureCard
              icon={Heart}
              title="Mood-Based Discovery"
              description="Find the perfect watch based on your mood - whether you need a laugh, a thrill, or something emotional."
            />
            <FeatureCard
              icon={Film}
              title="Telugu Picks"
              description="Specialized collection of Telugu cinema gems curated for regional language enthusiasts."
            />
            <FeatureCard
              icon={Compass}
              title="Platform Browsing"
              description="Browse content by your favorite streaming platform - Netflix, Prime Video, Disney+ Hotstar, and more."
            />
            <FeatureCard
              icon={Zap}
              title="Quick Discovery"
              description="Fast and intuitive search to find exactly what you're looking for in seconds."
            />
          </div>
        </motion.section>

        {/* Why Absolute Cinema Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass rounded-3xl p-8 sm:p-12 border border-white/10">
            <h2 className="text-section-title font-display font-bold text-white mb-6">
              Why Absolute Cinema
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-fuchsia-500/20 flex items-center justify-center ring-1 ring-fuchsia-400/30">
                  <span className="text-fuchsia-300 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Curated Content</h3>
                  <p className="text-white/60">Every title is carefully selected and organized for the best discovery experience.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-fuchsia-500/20 flex items-center justify-center ring-1 ring-fuchsia-400/30">
                  <span className="text-fuchsia-300 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">All Platforms in One Place</h3>
                  <p className="text-white/60">No more switching between apps - find content across all OTT platforms here.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-fuchsia-500/20 flex items-center justify-center ring-1 ring-fuchsia-400/30">
                  <span className="text-fuchsia-300 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Built for Cinephiles</h3>
                  <p className="text-white/60">Designed by movie lovers, for movie lovers who appreciate quality cinema.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-fuchsia-500/20 flex items-center justify-center ring-1 ring-fuchsia-400/30">
                  <span className="text-fuchsia-300 font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Always Updated</h3>
                  <p className="text-white/60">Regular updates ensure you never miss the latest releases and trending content.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
