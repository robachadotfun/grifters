import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = { title: "Privacy — GRIFTERS" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This site does not require accounts and does not collect personal
        information beyond what your browser and wallet share when you choose to
        connect.
      </p>
      <p>
        Wallet connections happen locally between your browser and your wallet
        extension. Wallet addresses are used only to display connection state and to
        submit transactions you explicitly approve.
      </p>
      <p>A complete privacy policy will be published before mint opens.</p>
    </LegalPage>
  );
}
