import type { Metadata } from 'next';
import CyberCity from '../components/CyberCity';

export const metadata: Metadata = {
  title: 'Neo San José 2099 — Alfredo Bonilla',
  description:
    'Explora una ciudad cyberpunk 8-bit y descubre los proyectos, servicios y habilidades de Alfredo Bonilla visitando sus edificios.',
};

export default function CityPage() {
  return (
    <main className="w-full flex justify-center pt-2">
      <CyberCity />
    </main>
  );
}
