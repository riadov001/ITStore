import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useLocation } from "wouter";
import { MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/contact";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#0A0A0A] text-white selection:bg-primary/30 selection:text-primary relative overflow-hidden">
      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[200] origin-left"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <main className="flex-1 flex flex-col relative z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${CONTACT.wa1}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg transition-transform hover:scale-110 animate-[pulse_2s_infinite]"
        aria-label="Contact WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
