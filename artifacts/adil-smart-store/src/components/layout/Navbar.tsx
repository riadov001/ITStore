import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, MapPin, Phone, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CONTACT, waLink } from "@/lib/contact";

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
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Topbar Desktop */}
      <div className="hidden md:flex h-8 bg-[#070707] border-b border-[#222] items-center justify-between px-4 container mx-auto text-[10px] uppercase tracking-widest text-[#888]">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-primary" />
          <span>{CONTACT.address}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 text-primary" />
            <span>{CONTACT.tel1}</span>
          </div>
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <span>@{CONTACT.instagram}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 h-[68px] bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#2a2a2a] ${
          scrolled ? "shadow-[0_4px_30px_rgba(0,0,0,0.8)]" : ""
        }`}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col justify-center">
            <span className="font-serif text-2xl font-black tracking-[0.15em] text-primary leading-none">
              ADIL
            </span>
            <span className="text-[10px] font-medium tracking-[0.35em] text-[#666] leading-none mt-1">
              SMART STORE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-8">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-all relative py-1 ${
                    isActive ? "text-primary" : "text-[#888] hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs text-[#888] tracking-widest font-bold">
              {CONTACT.tel1}
            </span>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-transform hover:scale-105 shadow-[0_0_15px_-3px_rgba(37,211,102,0.3)]"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
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
              className="md:hidden border-t border-[#2a2a2a] bg-[#0A0A0A] overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = location === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-base uppercase tracking-[0.2em] font-bold py-4 border-b border-[#222] ${
                        isActive ? "text-primary" : "text-[#888]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <div className="pt-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-3 mb-2">
                    <div className="flex items-start gap-3 text-sm text-[#888]">
                      <MapPin className="w-5 h-5 text-primary shrink-0" />
                      <span>{CONTACT.address}</span>
                    </div>
                    <a
                      href={CONTACT.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-[#888] hover:text-white"
                    >
                      <ExternalLink className="w-5 h-5 text-primary shrink-0" />
                      <span>@{CONTACT.instagram}</span>
                    </a>
                  </div>

                  <a
                    href={`https://wa.me/${CONTACT.wa1}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded text-sm font-bold uppercase tracking-wider"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {CONTACT.tel1}
                  </a>
                  <a
                    href={`https://wa.me/${CONTACT.wa2}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] px-4 py-3 rounded text-sm font-bold uppercase tracking-wider"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {CONTACT.tel2}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
