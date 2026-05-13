import { Link } from "wouter";
import { MessageCircle, Instagram, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#333]">
      {/* Marquee */}
      <div className="w-full overflow-hidden py-3 border-b border-[#333] bg-[#111]">
        <motion.div
          animate={{ x: [0, -1035] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="flex whitespace-nowrap text-primary font-serif font-bold text-sm tracking-[0.3em] uppercase"
        >
          <span className="px-4">ADIL SMART STORE • ACCESSOIRES PREMIUM • OUJDA, MAROC • SMARTWATCHES • ÉCOUTEURS • CHARGEURS •</span>
          <span className="px-4">ADIL SMART STORE • ACCESSOIRES PREMIUM • OUJDA, MAROC • SMARTWATCHES • ÉCOUTEURS • CHARGEURS •</span>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Col 1 */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="font-serif text-3xl font-black tracking-[0.15em] text-primary leading-none">
                ADIL
              </span>
              <span className="text-xs font-medium tracking-[0.3em] text-[#888] leading-none mt-2">
                SMART STORE
              </span>
            </div>
            <p className="text-[#888] text-sm leading-relaxed max-w-xs">
              La destination premium pour les accessoires de smartphones et smartwatches à Oujda, Maroc.
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/212600000000" className="text-[#888] hover:text-[#25D366] transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" className="text-[#888] hover:text-[#E1306C] transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="tel:+212600000000" className="text-[#888] hover:text-white transition-colors" aria-label="Phone">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-serif text-white text-xl font-bold tracking-widest mb-6">NAVIGATION</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="group inline-flex items-center text-[#888] hover:text-primary transition-colors text-sm uppercase tracking-widest">
                  <span className="relative">
                    Accueil
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="group inline-flex items-center text-[#888] hover:text-primary transition-colors text-sm uppercase tracking-widest">
                  <span className="relative">
                    Boutique
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-serif text-white text-xl font-bold tracking-widest mb-6">CONTACT</h4>
            <ul className="space-y-4 text-sm text-[#888]">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Oujda, Maroc</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span>+212 600 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 border border-primary flex items-center justify-center rounded-sm">
                  <span className="block w-1.5 h-1.5 bg-primary rounded-sm"></span>
                </div>
                <span>Lun-Sam 9h-21h</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#333]">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#555] tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} ADIL SMART STORE</p>
          <p>ACCESSOIRES PREMIUM • OUJDA, MAROC</p>
        </div>
      </div>
    </footer>
  );
}
