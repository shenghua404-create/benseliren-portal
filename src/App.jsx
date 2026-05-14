import { useState } from 'react';
import CapabilitySection from './components/CapabilitySection';
import DualEntry from './components/DualEntry';
import Hero from './components/Hero';
import NavBar from './components/NavBar';
import PhilosophyContact from './components/PhilosophyContact';
import ProcessSection from './components/ProcessSection';
import ProductSeries from './components/ProductSeries';
import {
  capabilities,
  contactOptions,
  entryCards,
  hero,
  navItems,
  philosophy,
  processSteps,
  productSeries
} from './data/siteContent';

export default function App() {
  const [submitted, setSubmitted] = useState(false);

  function handleConsultSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="app-shell">
      <NavBar items={navItems} />
      <main>
        <Hero content={hero} />
        <DualEntry cards={entryCards} />
        <CapabilitySection items={capabilities} />
        <ProductSeries items={productSeries} />
        <ProcessSection steps={processSteps} />
        <PhilosophyContact
          contactOptions={contactOptions}
          onSubmit={handleConsultSubmit}
          philosophy={philosophy}
          submitted={submitted}
        />
      </main>
    </div>
  );
}
