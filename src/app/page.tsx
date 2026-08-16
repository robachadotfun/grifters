import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Ticker } from "@/components/Ticker";
import { Ribbon } from "@/components/Ribbon";
import { Showcase } from "@/components/Showcase";
import { TraitExplorer } from "@/components/TraitExplorer";
import { Lore } from "@/components/Lore";
import { CelebrityUniverse } from "@/components/CelebrityUniverse";
import { RaritySection } from "@/components/RaritySection";
import { Unlocks } from "@/components/Unlocks";
import { PreReveal } from "@/components/PreReveal";
import { ChainSection } from "@/components/ChainSection";
import { HowItWorks } from "@/components/HowItWorks";
import { MintSection } from "@/components/MintSection";
import { WhitelistSection } from "@/components/WhitelistSection";
import { WhitelistModal } from "@/components/WhitelistModal";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Ticker />
        <Showcase />
        <TraitExplorer />
        <Lore />
        <CelebrityUniverse />
        <Ribbon />
        <RaritySection />
        <Unlocks />
        <PreReveal />
        <ChainSection />
        <HowItWorks />
        <MintSection />
        <WhitelistSection />
        <FAQ />
      </main>
      <Footer />
      <WhitelistModal />
    </>
  );
}
