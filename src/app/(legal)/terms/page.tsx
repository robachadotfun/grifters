import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = { title: "Terms — GRIFTERS" };

export default function Terms() {
  return (
    <LegalPage title="Terms of Use">
      <p>
        GRIFTERS is a collection of 2,222 digital collectibles on Robinhood Chain.
        By minting or holding a GRIFTERS NFT you agree to the terms published with
        the collection metadata at launch.
      </p>
      <p>
        NFTs are collectibles, not investments. Rarity, traits and unlockable
        experiences describe collectible attributes only and carry no promise of
        financial value. Unlockable experiences, where applicable, are subject to
        eligibility requirements and terms disclosed with the relevant NFT.
      </p>
      <p>
        The GRIFTERS name refers to the collectible archetype of the collection and
        does not characterize any participating individual. Celebrity likenesses
        appear under authorization from the participating individuals.
      </p>
      <p>Complete terms will be published before mint opens.</p>
    </LegalPage>
  );
}
