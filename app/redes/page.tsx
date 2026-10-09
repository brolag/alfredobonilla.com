import type { Metadata } from "next";
import SocialPaper from "../components/paper/SocialPaper";

export const metadata: Metadata = {
  title: "Alfredo Bonilla — Redes y contacto",
  description: "Enlaces oficiales para conversar con Alfredo Bonilla, seguir su trabajo y conocer Indie Mind.",
};

export default function SocialLinksPage() {
  return <SocialPaper />;
}
