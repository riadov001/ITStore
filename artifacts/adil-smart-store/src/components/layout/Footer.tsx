import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-serif text-xl font-bold tracking-wider text-primary block mb-4">Adil Smart Store</span>
            <p className="text-muted-foreground text-sm max-w-xs">
              La destination premium pour les accessoires de smartphones et smartwatches à Oujda, Maroc.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-foreground">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link href="/boutique" className="hover:text-primary transition-colors">Boutique</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Oujda, Maroc</li>
              <li>
                <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors">
                  WhatsApp: +212 600 000 000
                </a>
              </li>
              <li>
                <a href="https://instagram.com/adilsmartstore" target="_blank" rel="noopener noreferrer" className="hover:text-[#E1306C] transition-colors">
                  Instagram: @adilsmartstore
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Adil Smart Store. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
