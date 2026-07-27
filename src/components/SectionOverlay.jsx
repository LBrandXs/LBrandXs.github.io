import { AnimatePresence, motion } from 'framer-motion';
import { User, Code2, Briefcase, FolderKanban, Mail, FileText, BookOpen } from 'lucide-react';
import { SECTION_CONTENT, SECTION_ORDER } from '../content.jsx';

const ICONS = {
  sobre: User,
  tecnologias: Code2,
  experiencia: Briefcase,
  proyectos: FolderKanban,
  contacto: Mail,
  cv: FileText,
  extra: BookOpen,
};

// Panel de pantalla completa — el 3D queda de fondo, visible a través del
// backdrop semitransparente. "menu" es una sección virtual (no vive en
// SECTION_CONTENT): es el hub que se abre al presionar el monitor, y desde
// ahí se puede saltar a cualquier sección real.
export default function SectionOverlay({ section, onClose, onSelectSection }) {
  const isMenu = section === 'menu';
  const data = section && !isMenu ? SECTION_CONTENT[section] : null;
  const showPanel = isMenu || Boolean(data);

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.div
          className="hud-overlay-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`hud-screen hud-overlay-card ${isMenu ? 'hud-overlay-card--menu' : ''}`}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <header className="hud-screen-bar">
              <div>
                <span className="eyebrow">{isMenu ? 'Monitor' : 'Sección'}</span>
                <h3>{isMenu ? '¿Qué querés ver?' : data.label}</h3>
              </div>
              <button className="hud-screen-close" onClick={onClose} aria-label="Cerrar">✕</button>
            </header>

            {isMenu ? (
              <div className="hud-screen-body">
                <div className="menu-grid">
                  {SECTION_ORDER.map((id) => {
                    const Icon = ICONS[id];
                    return (
                      <button
                        key={id}
                        className="menu-tile"
                        onClick={() => onSelectSection(id)}
                      >
                        <span className="menu-tile-icon"><Icon size={20} strokeWidth={1.75} /></span>
                        <span className="menu-tile-label">{SECTION_CONTENT[id].label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="hud-screen-body">{data.body}</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
