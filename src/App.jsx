import { useState, useCallback } from 'react';
import DeskScene from './components/DeskScene';
import SideNav from './components/SideNav';
import SectionOverlay from './components/SectionOverlay';

export default function App() {
  const [activeSection, setActiveSection] = useState(null);

  const handleClose = useCallback(() => setActiveSection(null), []);

  return (
    <>
      <SideNav activeSection={activeSection} onSelectSection={setActiveSection} />

      {!activeSection && (
        <div className="hero-hint">
          Arrastra para rotar el escritorio<br />
          Elegí una acción en el menú, o tocá un objeto del escritorio
        </div>
      )}

      <DeskScene activeSection={activeSection} onSelectSection={setActiveSection} />
      <SectionOverlay section={activeSection} onClose={handleClose} onSelectSection={setActiveSection} />

      {/* Crédito del modelo 3D — CC BY 4.0 exige atribución visible en el sitio. */}
      <a
        className="model-credit"
        href="https://sketchfab.com/3d-models/stylized-computer-desk-d618d0816dec416ead339f1d8b6a97f0"
        target="_blank"
        rel="noreferrer"
      >
        Modelo 3D: "Stylized computer desk" por New Light (CC BY 4.0)
      </a>
    </>
  );
}
