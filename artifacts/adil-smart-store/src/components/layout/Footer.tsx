import { Link } from "wouter";
import { MessageCircle, Phone, MapPin, ExternalLink } from "lucide-react";
import { CONTACT, waLink } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#222]">
      {/* Marquee */}
      <div className="w-full overflow-hidden py-3 border-b border-[#222] bg-[#070707]">
        <div className="flex whitespace-nowrap text-primary font-serif font-bold text-sm tracking-[0.3em] uppercase animate-[marquee_20s_linear_infinite]">
          <span className="px-4">ADIL SMART STORE • ACCESSOIRES PREMIUM • OUJDA, MAROC • SMARTWATCHES • ÉCOUTEURS • CHARGEURS • POWERBANKS •</span>
          <span className="px-4">ADIL SMART STORE • ACCESSOIRES PREMIUM • OUJDA, MAROC • SMARTWATCHES • ÉCOUTEURS • CHARGEURS • POWERBANKS •</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Col 1 */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="font-serif text-3xl font-black tracking-[0.15em] text-primary leading-none">
                ADIL
              </span>
              <span className="text-[10px] font-medium tracking-[0.35em] text-[#888] leading-none mt-2">
                SMART STORE
              </span>
            </div>
            <p className="text-[#888] text-sm leading-relaxed max-w-xs">
              La destination premium pour les accessoires de smartphones et smartwatches à Oujda, Maroc.
            </p>
            <div className="bg-[#111] border border-[#222] p-4 text-xs space-y-2">
              <div className="text-primary font-bold uppercase tracking-widest mb-2 border-b border-[#222] pb-2">Horaires</div>
              {CONTACT.hours.split(" • ").map((h, i) => (
                <div key={i} className="text-[#888]">{h}</div>
              ))}
              <div className="inline-block mt-2 bg-primary/10 text-primary border border-primary/20 px-2 py-1 uppercase tracking-widest text-[10px] font-bold">
                Ouvert Aujourd'hui
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-8">
            <div>
              <h4 className="font-serif text-white text-xl font-bold tracking-widest mb-6">NAVIGATION</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="group inline-flex items-center text-[#888] hover:text-primary transition-colors text-xs uppercase tracking-widest">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/boutique" className="group inline-flex items-center text-[#888] hover:text-primary transition-colors text-xs uppercase tracking-widest">
                    Boutique
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="group inline-flex items-center text-[#888] hover:text-primary transition-colors text-xs uppercase tracking-widest">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="group inline-flex items-center text-[#555] hover:text-white transition-colors text-[10px] uppercase tracking-widest">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-serif text-white text-xl font-bold tracking-widest mb-6">CATÉGORIES</h4>
              <ul className="space-y-4 text-xs uppercase tracking-widest text-[#888]">
                <li>Smartwatches</li>
                <li>Écouteurs</li>
                <li>Chargeurs</li>
                <li>Powerbanks</li>
                <li>Coques</li>
              </ul>
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-serif text-white text-xl font-bold tracking-widest mb-6">CONTACTEZ-NOUS</h4>
            <ul className="space-y-4 text-sm text-[#888]">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span>{CONTACT.address}</span>
                  <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline uppercase tracking-widest font-bold">
                    Voir sur Google Maps
                  </a>
                </div>
              </li>
              
              <li className="pt-4 border-t border-[#222]">
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span className="font-bold">{CONTACT.tel1}</span>
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${CONTACT.wa2}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span className="font-bold">{CONTACT.tel2}</span>
                </a>
              </li>
              <li className="pt-4 border-t border-[#222]">
                <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  <span className="font-bold">@{CONTACT.instagram}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1a1a1a]">
        <div className="container mx-auto px-4 py-4 text-xs text-[#444] text-center tracking-widest uppercase">
          © {new Date().getFullYear()} Adil Smart Store · {CONTACT.address} · Tous droits réservés
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}
