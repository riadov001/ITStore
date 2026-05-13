import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/boutique", label: "Boutique" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 h-[72px] bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-[#333]/80 ${
        scrolled ? "shadow-[0_4px_30px_rgba(0,0,0,0.8)]" : ""
      }`}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col justify-center">
          <span className="font-serif text-2xl font-black tracking-[0.15em] text-primary leading-none">
            ADIL
          </span>
          <span className="text-xs font-medium tracking-[0.3em] text-[#888] leading-none mt-1">
            SMART STORE
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.2em] font-medium transition-all relative py-1 ${
                    isActive
                      ? "text-primary"
                      : "text-[#888] hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 border-l border-[#333] pl-6">
            <span className="text-xs text-[#888] tracking-widest">
              📞 +212 600 000 000
            </span>
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#333] bg-[#0A0A0A] overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm uppercase tracking-[0.2em] font-medium py-2 border-b border-[#222] ${
                      isActive ? "text-primary" : "text-[#888]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 flex flex-col gap-4">
                <span className="text-xs text-[#888] tracking-widest text-center">
                  📞 +212 600 000 000
                </span>
                <a
                  href="https://wa.me/212600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded text-sm font-bold uppercase tracking-wider"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
