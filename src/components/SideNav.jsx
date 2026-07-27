import { useState } from 'react';
import { User, Code2, Briefcase, FolderKanban, Mail, FileText } from 'lucide-react';
import { SECTION_CONTENT } from '../content.jsx';

const ICONS = {
  sobre: User,
  tecnologias: Code2,
  experiencia: Briefcase,
  proyectos: FolderKanban,
  contacto: Mail,
  cv: FileText,
};

const ORDER = ['sobre', 'tecnologias', 'experiencia', 'proyectos', 'contacto', 'cv'];

export default function SideNav({ activeSection, onSelectSection }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`side-nav ${open ? 'side-nav--open' : ''}`}>
      <button
        className="side-nav-tab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      >
        {open ? '✕' : '☰'}
      </button>

      <nav className="side-nav-links">
        <strong className="side-nav-brand">BR</strong>
        {ORDER.map((id) => {
          const Icon = ICONS[id];
          return (
            <button
              key={id}
              className={activeSection === id ? 'is-active' : ''}
              onClick={() => {
                onSelectSection(id);
                setOpen(false);
              }}
            >
              <Icon size={16} strokeWidth={1.75} />
              <span>{SECTION_CONTENT[id].label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
