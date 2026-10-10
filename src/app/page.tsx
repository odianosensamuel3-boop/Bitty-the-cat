import { ScrollReveal } from "@/components/ScrollReveal";
import { ToastProvider } from "@/components/ui/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import TokenInfo from "@/components/sections/TokenInfo";
import Tokenomics from "@/components/sections/Tokenomics";
import HowToBuy from "@/components/sections/HowToBuy";
import Community from "@/components/sections/Community";
import Gallery from "@/components/sections/Gallery";
import Roadmap from "@/components/sections/Roadmap";
import Faq from "@/components/sections/Faq";
import { getSocialLinks, getBuyUrl, siteConfig } from "@/config/site.config";

export default function HomePage() {
  const socials = getSocialLinks().filter((link) => link.href);
  const buyUrl = getBuyUrl();

  /* Structured data helps search engines understand the project correctly. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brand.name,
    alternateName: `${siteConfig.brand.name} ${siteConfig.brand.ticker}`,
    url: siteConfig.brand.url,
    logo: `${siteConfig.brand.url}/brand/mascot-512.jpg`,
    image: `${siteConfig.brand.url}${siteConfig.brand.ogImage}`,
    description: siteConfig.brand.description,
    slogan: siteConfig.brand.tagline,
    sameAs: socials.map((link) => link.href),
  };

  // The buy destination is only advertised to search engines once it is official.
  const buyAction = buyUrl ? { "@type": "BuyAction", target: buyUrl } : undefined;

  return (
    <ToastProvider>
      <ScrollReveal />
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-pill focus:bg-golden focus:px-5 focus:py-3 focus:font-display focus:text-sm focus:font-black focus:uppercase focus:text-ink"
      >
        Skip to content
      </a>

      <Navbar />

      <main>
        <Hero />
        <Marquee />
        <About />
        <TokenInfo />
        <Tokenomics />
        <HowToBuy />
        <Gallery />
        <Community />
        <Roadmap />
        <Faq />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...jsonLd, potentialAction: buyAction }) }}
      />
    </ToastProvider>
  );
}
