import { Layout } from "@/components/layout/Layout";
import { motion, useInView } from "framer-motion";
import { MapPin, MessageCircle, ExternalLink, ShieldCheck, TrendingDown, Truck } from "lucide-react";
import { CONTACT, waLink } from "@/lib/contact";
import { useRef, useState, useEffect } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      setCount(c => { 
        if (c >= target) { 
          clearInterval(interval); 
          return target; 
        } 
        return Math.min(c + step, target); 
      });
    }, 30);
    return () => clearInterval(interval);
  }, [inView, target]);
  
  return <span ref={ref} className="stat-number">{count}{suffix}</span>;
}

export default function Contact() {
  const heroVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };
  
  const heroItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const gridItem = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <Layout>
      {/* Hero section */}
      <section className="bg-[#0D0D0D] border-b border-[#222] py-20 pt-32">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={heroItem} className="inline-block border border-primary/30 text-primary uppercase text-[10px] tracking-[0.3em] px-4 py-1.5 rounded-full mb-6 font-bold bg-[#111]/50">
              CONTACT
            </motion.div>
            <motion.h1 variants={heroItem} className="font-serif text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-6">
              Parlons <span className="gold-shimmer">Premium</span>
            </motion.h1>
            <motion.p variants={heroItem} className="text-[#888] text-sm md:text-base uppercase tracking-widest max-w-2xl mx-auto">
              Notre équipe est disponible 7j/7 pour répondre à vos questions et vous guider dans le choix de vos accessoires.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2 colonnes */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Col gauche : infos contact */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-[#111] border border-[#222] p-8 space-y-8 corner-accent relative"
            >
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-white uppercase">Notre Boutique</h3>
                <div className="flex items-start gap-4 text-[#888]">
                  <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-white mb-2">{CONTACT.address}</p>
                    <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-primary hover:underline font-bold">
                      Voir sur Google Maps →
                    </a>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-[#222] w-full" />

              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-white uppercase">WhatsApp</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#222]">
                    <div className="flex items-center gap-3 text-white">
                      <MessageCircle className="w-5 h-5 text-[#25D366]" />
                      <span className="font-mono">{CONTACT.tel1}</span>
                    </div>
                    <a href={waLink()} target="_blank" rel="noopener noreferrer" className="text-xs bg-[#25D366] text-white px-4 py-2 font-bold uppercase tracking-wider hover:bg-[#20bd5a] transition-colors">
                      Écrire
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#222]">
                    <div className="flex items-center gap-3 text-white">
                      <MessageCircle className="w-5 h-5 text-[#25D366]" />
                      <span className="font-mono">{CONTACT.tel2}</span>
                    </div>
                    <a href={`https://wa.me/${CONTACT.wa2}`} target="_blank" rel="noopener noreferrer" className="text-xs border border-[#25D366] text-[#25D366] px-4 py-2 font-bold uppercase tracking-wider hover:bg-[#25D366] hover:text-white transition-colors">
                      Écrire
                    </a>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-[#222] w-full" />

              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-white uppercase">Réseaux Sociaux</h3>
                <div className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#222]">
                  <div className="flex items-center gap-3 text-white">
                    <ExternalLink className="w-5 h-5 text-[#E1306C]" />
                    <span className="font-mono">@{CONTACT.instagram}</span>
                  </div>
                  <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs border border-[#E1306C] text-[#E1306C] px-4 py-2 font-bold uppercase tracking-wider hover:bg-[#E1306C] hover:text-white transition-colors">
                    Visiter le profil
                  </a>
                </div>
              </div>

              <div className="h-[1px] bg-[#222] w-full" />

              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-white uppercase">Horaires</h3>
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-[#222]">
                    <tr className="text-[#888]">
                      <td className="py-3 font-bold uppercase tracking-widest text-white">Lundi – Samedi</td>
                      <td className="py-3 text-right font-mono">9h00 – 21h00</td>
                    </tr>
                    <tr className="text-[#888]">
                      <td className="py-3 font-bold uppercase tracking-widest text-primary">Dimanche</td>
                      <td className="py-3 text-right font-mono">10h00 – 18h00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Col droite : Google Maps iframe */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="h-full min-h-[400px] lg:min-h-[500px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.5!2d-1.9083!3d34.6814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd75a6b0000000001%3A0x1!2s48+Bd+Al+Maqdiss%2C+Oujda!5e0!3m2!1sfr!2sma!4v1700000000000!5m2!1sfr!2sma"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border border-[#222] bg-[#111]"
              title="Adil Smart Store - Carte"
            />
          </motion.div>
        </div>
      </section>

      {/* À Propos */}
      <section className="py-24 bg-[#0D0D0D] border-t border-[#222]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-8">
            Notre <span className="text-primary">Histoire</span>
          </h2>
          <p className="text-[#888] leading-relaxed text-lg mb-16">
            Adil Smart Store est né de la passion pour la technologie et de la volonté d'apporter des accessoires premium aux habitants d'Oujda et de la région orientale du Maroc. Installés au cœur du Quartier Al Qods, nous proposons une sélection rigoureuse des meilleures marques mondiales : Itel, Oraimo, Xiaomi, Apple, Ugreen, Soundpeats et plus encore.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-[#222] py-12">
            <div className="space-y-2">
              <div className="font-serif text-5xl font-black text-white"><AnimatedCounter target={500} suffix="+" /></div>
              <div className="text-primary text-xs uppercase tracking-[0.2em] font-bold">Clients</div>
            </div>
            <div className="space-y-2">
              <div className="font-serif text-5xl font-black text-white"><AnimatedCounter target={50} suffix="+" /></div>
              <div className="text-primary text-xs uppercase tracking-[0.2em] font-bold">Marques</div>
            </div>
            <div className="space-y-2">
              <div className="font-serif text-5xl font-black text-white"><AnimatedCounter target={6} /></div>
              <div className="text-primary text-xs uppercase tracking-[0.2em] font-bold">Catégories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-24 bg-[#0A0A0A] border-t border-[#222]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
              Pourquoi nous choisir
            </h2>
            <div className="h-[2px] w-24 bg-primary mx-auto" />
          </div>

          <motion.div 
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={gridItem} className="bg-[#111] p-8 border border-[#222] text-center space-y-4 hover:border-primary/50 transition-colors group card-3d scan-hover">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white uppercase">Produits 100% Authentiques</h3>
              <p className="text-[#888] text-sm">Garantie d'originalité sur toutes nos marques.</p>
            </motion.div>
            
            <motion.div variants={gridItem} className="bg-[#111] p-8 border border-[#222] text-center space-y-4 hover:border-primary/50 transition-colors group card-3d scan-hover">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <TrendingDown className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white uppercase">Prix Imbattables à Oujda</h3>
              <p className="text-[#888] text-sm">Le meilleur rapport qualité-prix de la région.</p>
            </motion.div>

            <motion.div variants={gridItem} className="bg-[#111] p-8 border border-[#222] text-center space-y-4 hover:border-primary/50 transition-colors group card-3d scan-hover">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white uppercase">Support WhatsApp 7j/7</h3>
              <p className="text-[#888] text-sm">Une équipe toujours à votre écoute.</p>
            </motion.div>

            <motion.div variants={gridItem} className="bg-[#111] p-8 border border-[#222] text-center space-y-4 hover:border-primary/50 transition-colors group card-3d scan-hover">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white uppercase">Livraison Rapide en Ville</h3>
              <p className="text-[#888] text-sm">Vos accessoires directement chez vous.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
