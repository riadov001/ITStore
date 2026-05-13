export const CONTACT = {
  wa1: "212708912524",
  wa2: "212611124015",
  tel1: "+212 7 08 91 25 24",
  tel2: "+212 6 11 12 40 15",
  address: "48 Bd Al Maqdiss, Quartier Al Qods, Oujda",
  city: "Oujda, Maroc",
  instagram: "adil_smart_store",
  instagramUrl: "https://instagram.com/adil_smart_store",
  hours: "Lun – Sam : 9h00 – 21h00 • Dim : 10h00 – 18h00",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.123456789!2d-1.9083!3d34.6814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd75a6b5555555555%3A0xaaaaaaaaaaaaaaaa!2s48%20Bd%20Al%20Maqdiss%2C%20Oujda!5e0!3m2!1sfr!2sma!4v1700000000000!5m2!1sfr!2sma",
  mapsUrl:
    "https://www.google.com/maps/search/48+Bd+Al+Maqdiss+Quartier+Al+Qods+Oujda",
};

export function waLink(productName?: string) {
  const msg = productName
    ? encodeURIComponent(
        `Bonjour Adil Smart Store, je voudrais connaître le prix de : ${productName}`
      )
    : encodeURIComponent(
        "Bonjour Adil Smart Store, j'aimerais avoir plus d'informations."
      );
  return `https://wa.me/${CONTACT.wa1}?text=${msg}`;
}
