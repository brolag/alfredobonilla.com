import type { Metadata } from "next";
import PaperSite from "../components/paper/PaperSite";

export const metadata: Metadata = {
  title: "Alfredo Bonilla — Sobre mí y mi trabajo",
  description:
    "Ingeniero de software y educador de Costa Rica. Conoce mis colaboraciones, servicios, herramientas y formas de contacto en una vista simple.",
};

// Visual version of the site for visitors who'd rather not type commands.
export default function PaperPage() {
  return <PaperSite />;
}
