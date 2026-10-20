import type { Metadata } from "next";
import LinksPaper from "../components/paper/LinksPaper";

export const metadata: Metadata = {
  title: "Alfredo Bonilla — Indie Mind y enlaces",
  description: "Diagnóstico gratuito, Mentoría Aplicada y capacitación para equipos de Indie Mind.",
  alternates: { canonical: "https://alfredobonilla.com/links" },
};

export default function LinksPage() {
  return <LinksPaper />;
}
