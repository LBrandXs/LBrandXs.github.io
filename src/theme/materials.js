import * as THREE from 'three';

/*
 * Paleta revisada: la superficie no debe leerse "toda negra". El acento cian
 * se reserva para la pantalla (que sí debe brillar) y como indicador sutil
 * en piezas interactivas. Todo lo que no esté listado explícitamente
 * conserva su color original del modelo — así plantas, decoración, etc.
 * no se ven forzadas a un tono que no les corresponde.
 */
export const NEUTRAL_LIGHT = '#e7e9eb';
export const NEUTRAL_MID = '#c7cbcf';
export const NEON_CYAN = '#00e5ff';
export const NEON_MAGENTA = '#c400ff';
// Tono cálido y de baja saturación para el "llamado de atención" de los
// libros en reposo/hover — a diferencia del cian, no tapa el color real de
// la portada, solo le agrega un borde sutil que se nota.
export const BOOK_ACCENT = '#ffb454';
// Glow del monitor: mismo espíritu de "pantalla encendida" pero menos
// saturado que el cian puro — coincide con --accent-cool del CSS.
export const SCREEN_GLOW = '#5ec8d8';

// Estructura del escritorio: superficie y patas → gris claro mate, no negro.
const STRUCTURE = ['Material', 'Material.001', 'Material.002'];

// Gabinetes/marcos de monitores → gris claro con algo de metal.
const HOUSING = ['Material.018', 'Material.020', 'Material.021', 'Material.022'];

// Pantalla de monitor: el material puede estar compartido con otros objetos
// del modelo (por eso el brillo se filtraba a las macetas). En vez de pintar
// por nombre de material, esto se aplica por MESH específico una vez lo
// identifiques — ver MONITOR_SCREEN_MESH más abajo en DeskScene.jsx.
const SCREENS = [];

// Periféricos → color neutro base + un cian sutil que sube con hover/selección.
// (Material.007 es la portada del libro blanco — se saca de acá para que
// conserve su blanco real; el brillo de hover ya se aplica aparte, por mesh.)
const ACCENTS = ['Material.006', 'Material.008'];

export function applyMeshGlow(scene, meshName, { color = NEON_CYAN, intensity = 1.6 } = {}) {
  const target = scene.getObjectByName(meshName);
  if (!target || !target.isMesh) return;
  const mats = Array.isArray(target.material) ? target.material : [target.material];
  mats.forEach((mat) => {
    mat.color = new THREE.Color('#001014');
    mat.emissive = new THREE.Color(color);
    mat.emissiveIntensity = intensity;
    mat.toneMapped = false;
  });
}

export function applyMeshColor(scene, meshName, hex) {
  const target = scene.getObjectByName(meshName);
  if (!target || !target.isMesh) return;
  const mats = Array.isArray(target.material) ? target.material : [target.material];
  mats.forEach((mat) => {
    mat.color = new THREE.Color(hex);
  });
}
export function applyDeskTheme(root) {
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.material) return;

    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];

    obj.material = materials.map((mat) => {
      const clone = mat.clone();
      const name = mat.name;

      if (STRUCTURE.includes(name)) {
        clone.color = new THREE.Color(NEUTRAL_LIGHT);
        clone.roughness = 0.75;
        clone.metalness = 0.05;
      } else if (HOUSING.includes(name)) {
        clone.color = new THREE.Color(NEUTRAL_MID);
        clone.roughness = 0.35;
        clone.metalness = 0.5;
      } else if (SCREENS.includes(name)) {
        clone.color = new THREE.Color('#001014');
        clone.emissive = new THREE.Color(NEON_CYAN);
        clone.emissiveIntensity = 1.6;
        clone.toneMapped = false;
      } else if (ACCENTS.includes(name)) {
        clone.color = new THREE.Color(NEUTRAL_MID);
        clone.emissive = new THREE.Color(NEON_CYAN);
        clone.emissiveIntensity = 0.25;
        clone.toneMapped = false;
      }
      // Cualquier otro material (plantas, decoración, etc.) queda intacto.

      return clone;
    });

    if (obj.material.length === 1) obj.material = obj.material[0];
  });
}
