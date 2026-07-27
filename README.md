# Portafolio 3D — Brando Xiloj

Portafolio personal interactivo construido con **Vite + React + react-three-fiber**.
El hero principal es un escritorio 3D navegable (`desk.glb`) donde cada objeto
de la escena abre una sección del portafolio (Sobre mí, Habilidades,
Experiencia, Proyectos, Contacto, CV).

## 🔗 Demo en vivo

https://<tu-usuario>.github.io/

## 🛠️ Stack

- React 19 + Vite
- react-three-fiber / drei / postprocessing (escena 3D)
- Framer Motion (transiciones de UI)
- Formspree (formulario de contacto)
- oxlint (linting)
- pnpm (gestor de paquetes)

## 📁 Estructura

src/
components/ # DeskScene, SideNav, SectionOverlay, ContactForm
theme/ # materiales de la escena 3D
content.jsx # contenido de cada sección
public/
models/ # desk.glb
proyectos/ # páginas HTML de cada proyecto + capturas


## 🚀 Cómo correrlo localmente

```bash
pnpm install
pnpm dev
```

## 📦 Build de producción

```bash
pnpm build
pnpm preview
```

## ☁️ Despliegue

El sitio se despliega automáticamente en GitHub Pages con cada push a `main`
mediante GitHub Actions (`.github/workflows/deploy.yml`). Al ser un repositorio
tipo `<usuario>.github.io`, se publica directamente en la raíz del dominio,
sin necesidad de configurar un `base` en Vite.

## 🎨 Crédito obligatorio del modelo 3D

Licencia CC BY 4.0 — el crédito ya está visible en el sitio (footer fijo en
la esquina inferior izquierda, y también en el panel "Más" del libro azul):

> "Stylized computer desk" by New Light is licensed under Creative Commons Attribution (CC BY 4.0).
> https://sketchfab.com/3d-models/stylized-computer-desk-d618d0816dec416ead339f1d8b6a97f0