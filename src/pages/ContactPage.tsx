import React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import Logo from "../components/Logo";

const BrandIcon: React.FC<{ kind: "twitter" | "instagram" | "youtube" | "github" }> = ({ kind }) => {
  if (kind === "twitter") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2H21l-6.49 7.41L22 22h-6.94l-4.51-5.96L4.8 22H2.04l6.98-7.98L2 2h7.06l4.08 5.4L18.24 2zm-2.43 18h1.84L7.27 4H5.32l10.5 16z" />
      </svg>
    );
  }
  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 .5C5.7.5.7 5.5.7 11.8c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.6v-2.1c-3.1.7-3.8-1.5-3.8-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.5.1-3 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.7.1 3 .8.8 1.2 1.8 1.2 3 0 4.3-2.6 5.2-5.1 5.5.4.3.8 1 .8 2v3c0 .4.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.3 5.5 18.3.5 12 .5z" />
    </svg>
  );
};

const ContactPage: React.FC = () => {
  React.useEffect(() => {
    document.title = "Contact Absolute Cinema";
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
          className="text-center mb-16"
        >
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-hero-primary font-display font-bold text-gradient-cinema mb-6">
            Contact Us
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/70">
            Have feedback, suggestions, partnership inquiries, or want to report an issue? We'd love to hear from you. Reach out and let's create something amazing together.
          </p>
        </motion.div>

        {/* Introductory Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mb-12 text-center"
        >
          <p className="text-white/70 text-lg">
            For feedback, partnership inquiries, bug reports, or suggestions, please contact us via email or social media.
          </p>
        </motion.div>

        {/* Contact Info & Social Links - Centered Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-6"
        >
            {/* Email Contact */}
            <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Get in touch directly</h2>
              <p className="text-white/60 mb-6">
                Prefer email? Reach out to us directly at:
              </p>
              <a
                href="mailto:contact@absolutecinema.com"
                className="inline-flex items-center gap-3 rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-5 py-3 text-fuchsia-200 hover:bg-fuchsia-500/20 hover:border-fuchsia-400/50 transition"
              >
                <Mail className="h-5 w-5" />
                <span className="font-medium">contact@absolutecinema.com</span>
              </a>
            </div>

            {/* Social Media */}
            <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Follow us</h2>
              <p className="text-white/60 mb-6">
                Stay updated with the latest releases, behind-the-scenes content, and more by following us on social media.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { kind: "instagram" as const, label: "Instagram", href: "#" },
                  { kind: "twitter" as const, label: "X (Twitter)", href: "#" },
                  { kind: "youtube" as const, label: "YouTube", href: "#" },
                  { kind: "github" as const, label: "GitHub", href: "#" },
                ].map((social) => (
                  <a
                    key={social.kind}
                    href={social.href}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/70 hover:border-fuchsia-400/40 hover:bg-white/10 hover:text-white transition"
                  >
                    <BrandIcon kind={social.kind} />
                    <span className="text-sm font-medium">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">Response Time</h3>
              <p className="text-white/60 text-sm">
                We typically respond to all inquiries within 24-48 hours. For urgent matters, please use the email contact above.
              </p>
            </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
