import type { Metadata } from "next";
import PaperSite from "../components/paper/PaperSite";

export const metadata: Metadata = {
  title: "Alfredo Bonilla — Founder @ Indie Mind",
  description:
    "Software engineer and educator from Costa Rica building AI-first products at Indie Mind. Services, work, skills and contact — on paper.",
};

// Visual version of the site for visitors who'd rather not type commands.
export default function PaperPage() {
  return <PaperSite />;
}
