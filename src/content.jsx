import ContactForm from './components/ContactForm.jsx';

// Orden de secciones para listados de navegación (side-nav, menú del
// monitor). "extra" (libro azul) se agrega al final: sigue sin tener botón
// propio en el side-nav, pero sí aparece como opción en el menú del monitor.
export const SECTION_ORDER = ['sobre', 'tecnologias', 'experiencia', 'proyectos', 'contacto', 'cv', 'extra'];

export const SECTION_CONTENT = {
  sobre: {
    label: 'Sobre mí',
    body: (
      <div>
        <div className="panel-about">
          <img
            className="panel-portrait"
            src="/img/brando.jpg"
            alt="Retrato de Louis Brando Xiloj Subuyu"
          />
          <div>
            <p>
              Soy Louis Brando Xiloj Subuyu, estudiante de Sexto Informática
              en Fundación Kinal, Guatemala. Construyo proyectos full stack
              combinando microservicios en Node.js y .NET, interfaces en
              React y apps móviles con React Native/Expo.
            </p>
            <p>
              Trabajo tanto en proyectos individuales como en equipo (bajo
              NexusCodeKin), y en un proyecto social real: la digitalización
              de una veterinaria que antes trabajaba con hojas de cálculo.
            </p>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Ubicación</span>
            <span className="info-value">Ciudad de Guatemala, Guatemala</span>
          </div>
          <div className="info-item">
            <span className="info-label">Idiomas</span>
            <span className="info-value">Español (nativo), Inglés (intermedio)</span>
          </div>
          <div className="info-item">
            <span className="info-label">Estudios</span>
            <span className="info-value">Perito en Informática — Fundación Kinal</span>
          </div>
          <div className="info-item">
            <span className="info-label">Disponibilidad</span>
            <span className="info-value">Proyectos freelance y prácticas</span>
          </div>
        </div>
      </div>
    ),
  },
  tecnologias: {
    label: 'Habilidades',
    body: (
      <ul className="panel-list">
        <li>Node.js / Express</li>
        <li>React / Vite</li>
        <li>React Native / Expo</li>
        <li>.NET / C#</li>
        <li>Java / JavaFX</li>
        <li>MongoDB</li>
        <li>PostgreSQL / MySQL</li>
        <li>Docker</li>
      </ul>
    ),
  },
  experiencia: {
    label: 'Experiencia',
    body: (
      <div className="panel-projects">
        <div className="panel-project-card">
          <h4>Proyecto social — Criaturitas Pet Shop</h4>
          <p>
            Digitalización de una veterinaria real que antes trabajaba con
            hojas de cálculo. Arquitectura de microservicios (registro,
            historial médico, finanzas) con panel web y facturación ligada
            al estado de pago.
          </p>
          <ul className="panel-list">
            <li>Node.js</li>
            <li>Express</li>
            <li>MongoDB</li>
            <li>React</li>
          </ul>
          {/* Repo privado a pedido: solo se menciona el proyecto, sin
              mostrar el código. */}
        </div>
        <div className="panel-project-card">
          <h4>Trabajo en equipo — NexusCodeKin</h4>
          <p>
            Desarrollo colaborativo de sistemas por microservicios (Sistema
            Bancario NexusBank y Sistema Restaurante) junto a Christian
            Xicara y Alejandro Echeverría, sobre una base de código de
            Braulio Echeverría — como parte de la formación en Fundación
            Kinal.
          </p>
          <ul className="panel-list">
            <li>.NET 8</li>
            <li>Node.js</li>
            <li>React</li>
            <li>React Native</li>
          </ul>
        </div>
      </div>
    ),
  },
  proyectos: {
    label: 'Proyectos',
    body: (
      <div className="panel-projects">
        <div className="panel-project-card">
          <h4>Criaturitas Pet Shop</h4>
          <p>
            Sistema de clínica veterinaria por microservicios: registro de
            clientes, historial médico, finanzas y facturación. Repo privado
            — se menciona el proyecto pero no se comparte el código.
          </p>
          <ul className="panel-list">
            <li>Node.js</li>
            <li>Express</li>
            <li>MongoDB</li>
          </ul>
        </div>
        <div className="panel-project-card">
          <h4>Sistema Bancario — NexusBank</h4>
          <p>
            Plataforma bancaria por microservicios con doble partida
            contable, panel web y app móvil. Proyecto en equipo, desplegado
            en producción (Firebase + Vercel).
          </p>
          <ul className="panel-list">
            <li>.NET 8</li>
            <li>Node.js</li>
            <li>React</li>
            <li>React Native</li>
            <li>PostgreSQL</li>
            <li>MongoDB</li>
          </ul>
          <a className="panel-project-link" href="/proyectos/nexusbank.html" target="_blank" rel="noreferrer">Ver caso ↗</a>
        </div>
        <div className="panel-project-card">
          <h4>Sistema Restaurante — La Tabla</h4>
          <p>
            Plataforma de restaurante por microservicios: administración,
            pedidos, reservas, reportes, panel web y app móvil para clientes.
            Proyecto en equipo.
          </p>
          <ul className="panel-list">
            <li>.NET 8</li>
            <li>Node.js</li>
            <li>React</li>
            <li>React Native / Expo</li>
            <li>MongoDB</li>
          </ul>
          <a className="panel-project-link" href="/proyectos/la-tabla.html" target="_blank" rel="noreferrer">Ver caso ↗</a>
        </div>
        <div className="panel-project-card">
          <h4>WildCare</h4>
          <p>
            Sistema de gestión veterinaria de escritorio: clientes, mascotas,
            citas, historiales, recetas, vacunación y facturación.
          </p>
          <ul className="panel-list">
            <li>Java</li>
            <li>JavaFX</li>
            <li>MySQL</li>
          </ul>
          <a className="panel-project-link" href="/proyectos/wildcare.html" target="_blank" rel="noreferrer">Ver caso ↗</a>
        </div>
        <div className="panel-project-card">
          <h4>WorldTech</h4>
          <p>
            Sitio web informativo sobre tecnología: gadgets, comparativas de
            productos y novedades del sector.
          </p>
          <ul className="panel-list">
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript</li>
          </ul>
          <a className="panel-project-link" href="/proyectos/worldtech.html" target="_blank" rel="noreferrer">Ver caso ↗</a>
        </div>
        <div className="panel-project-card">
          <h4>Juego del Ahorcado</h4>
          <p>
            Clásico juego de palabras con 3 niveles de dificultad y dibujo
            animado del muñeco con Canvas API.
          </p>
          <ul className="panel-list">
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript</li>
          </ul>
          <a className="panel-project-link" href="/proyectos/ahorcado.html" target="_blank" rel="noreferrer">Ver caso ↗</a>
        </div>
        <div className="panel-project-card">
          <h4>Conecta 4</h4>
          <p>
            Juego de estrategia contra la PC, jugado por consola, con
            detección de líneas ganadoras horizontales, verticales y
            diagonales.
          </p>
          <ul className="panel-list">
            <li>Java</li>
          </ul>
          <a className="panel-project-link" href="/proyectos/conecta4.html" target="_blank" rel="noreferrer">Ver caso ↗</a>
        </div>
      </div>
    ),
  },
  contacto: {
    label: 'Contacto',
    body: (
      <div className="contact-links">
        <a
          className="contact-link"
          href="https://github.com/LBrandXs"
          target="_blank"
          rel="noreferrer"
        >
          <span className="contact-link-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12c0 5.08 3.29 9.39 7.86 10.9 0.57 0.1 0.78-0.25 0.78-0.55 0-0.27-0.01-1.16-0.02-2.11-3.2 0.7-3.88-1.36-3.88-1.36-0.52-1.33-1.28-1.68-1.28-1.68-1.04-0.72 0.08-0.7 0.08-0.7 1.16 0.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36 0.96 0.1-0.75 0.4-1.25 0.73-1.54-2.55-0.29-5.24-1.28-5.24-5.68 0-1.26 0.45-2.28 1.19-3.09-0.12-0.29-0.52-1.47 0.11-3.06 0 0 0.97-0.31 3.18 1.18 0.92-0.26 1.91-0.38 2.9-0.39 0.98 0.01 1.97 0.13 2.9 0.39 2.2-1.49 3.17-1.18 3.17-1.18 0.63 1.59 0.23 2.77 0.11 3.06 0.74 0.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67 0.41 0.36 0.78 1.07 0.78 2.15 0 1.55-0.01 2.8-0.01 3.18 0 0.31 0.21 0.66 0.79 0.55 4.57-1.52 7.85-5.83 7.85-10.9C23.5 5.65 18.35 0.5 12 0.5z" />
            </svg>
          </span>
          <span>
            <span className="contact-link-label">GitHub</span>
            <span className="contact-link-value">github.com/LBrandXs</span>
          </span>
        </a>

        <a
          className="contact-link"
          href="https://www.linkedin.com/in/brando-xiloj-7254a83a8"
          target="_blank"
          rel="noreferrer"
        >
          <span className="contact-link-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-0.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h0.05c0.48-0.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43c-1.14 0-2.07-0.93-2.07-2.08 0-1.15 0.93-2.08 2.07-2.08 1.15 0 2.08 0.93 2.08 2.08 0 1.15-0.93 2.08-2.08 2.08zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
          </span>
          <span>
            <span className="contact-link-label">LinkedIn</span>
            <span className="contact-link-value">Brando Xiloj</span>
          </span>
        </a>

        <p className="contact-form-lead">O escribime directo desde acá:</p>
        <ContactForm />
      </div>
    ),
  },
  cv: {
    label: 'Descargar CV',
    body: (
      <a className="panel-cta" href="/cv.pdf" target="_blank" rel="noreferrer">
        Ver / descargar CV ↗
      </a>
    ),
  },
  // Libro azul: ahora abre el mismo panel animado que cualquier otro libro
  // (antes se embebía chiquito sobre la pantalla del monitor y no se sentía
  // igual de "importante" que el resto — por eso se saca esa excepción).
  extra: {
    label: 'Más',
    body: (
      <div className="panel-projects">
        <div className="panel-project-card">
          <h4>Ahora mismo estoy construyendo</h4>
          <p>
            Criaturitas Pet Shop: la digitalización real de una veterinaria
            que antes llevaba todo en hojas de cálculo. No es un proyecto de
            práctica — hay una clínica de verdad usando esto, así que cada
            bug corregido (sincronización entre finanzas e historial médico,
            generación de PDFs, validaciones de pago) tiene efecto directo
            en cómo trabaja alguien mañana.
          </p>
          <ul className="panel-list">
            <li>Node.js</li>
            <li>React</li>
            <li>.NET</li>
            <li>MongoDB</li>
            <li>Docker</li>
          </ul>
        </div>

        <div className="panel-project-card">
          <h4>Cómo trabajo</h4>
          <p>Minimizar clics: si algo se puede resolver sin que el usuario navegue tres pantallas, se resuelve así.</p>
          <p>Cero adivinar: si una acción no es obvia, la interfaz está mal — no el usuario.</p>
          <p>Los bugs de integración importan más que los de UI: un botón feo se nota; un pago mal sincronizado entre dos microservicios, no — hasta que es demasiado tarde.</p>
        </div>

        <div className="panel-project-card">
          <h4>Este portafolio</h4>
          <p>
            Está hecho con React Three Fiber sobre un modelo 3D de un
            escritorio — cada libro es una sección real. Otro ejercicio del
            mismo principio: que explorar no dependa de adivinar dónde hacer
            clic.
          </p>
        </div>

        <div className="panel-project-card">
          <h4>Crédito del modelo 3D</h4>
          <p>
            El escritorio de esta escena es{' '}
            <a
              href="https://sketchfab.com/3d-models/stylized-computer-desk-d618d0816dec416ead339f1d8b6a97f0"
              target="_blank"
              rel="noreferrer"
            >
              "Stylized computer desk"
            </a>{' '}
            de New Light, publicado en Sketchfab bajo licencia Creative
            Commons Attribution (CC BY 4.0). Gracias por dejarlo disponible —
            sin este modelo esta idea no hubiera sido posible.
          </p>
        </div>
      </div>
    ),
  },
};
