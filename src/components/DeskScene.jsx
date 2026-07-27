import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, CameraControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { applyDeskTheme, applyMeshGlow, applyMeshColor, NEON_MAGENTA, BOOK_ACCENT, SCREEN_GLOW } from '../theme/materials';
import { SECTION_CONTENT } from '../content.jsx';

/*
 * IMPORTANTE: three.js GLTFLoader "sanea" los nombres de cada nodo al
 * cargarlos — les saca los puntos (los usa como separador de rutas para
 * animaciones). O sea que "Cube.002_Material.009_0" en Blender/el archivo
 * .glb llega a la escena como "Cube002_Material009_0" (sin puntos). Todos
 * los nombres de acá abajo ya están escritos como llegan REALMENTE.
 */
const MONITOR_SCREEN_MESH = 'Plane001_Material019_0';
// Es el "asiento" central del modelo (Cylinder.001), la única pieza a X=0
// entre la cámara y el monitor — por eso bloqueaba la vista.
const CHAIR_MESH = ['Cylinder001_Material002_0', 'Cylinder001_Material003_0'];
const CHAIR_COLOR = '#111214';
// Qué tan visible queda la silla cuando hay una sección activa (cámara
// "sentada"). No se oculta del todo — queda como un fantasma sutil — así
// se puede seguir viendo dónde está mientras se ajusta la cámara.
const CHAIR_OPACITY_ACTIVE = 0.08;
// Empuja la silla hacia atrás (lejos de la cámara) una sola vez al cargar
// el modelo, para que deje de meterse en el encuadre de CHAIR_VIEW. Es un
// desplazamiento fijo en espacio LOCAL de cada malla de la silla, no depende
// de la cámara. Si se corre para el lado equivocado, cambiá el signo del
// eje correspondiente (probá con Z primero, que suele ser "hacia el
// jugador" en este modelo; X movería la silla a los costados).
const CHAIR_PUSH_BACK = new THREE.Vector3(0, 0, -0.05);

/*
 * MAPA DE OBJETOS → SECCIÓN
 * ---------------------------------------------------------------
 * El modelo trae nombres genéricos de Blender (Cube, Cube.001, Cylinder...).
 * Esto es solo para uso nuestro mientras armamos el mapa — nunca se le
 * muestra al usuario final.
 */
const MESH_TO_SECTION = {
  // Libro portada café + hojas → Sobre mí
  'Cube002_Material009_0': 'sobre',
  'Cube002_Material008_0': 'sobre',

  // Libro portada blanca + hojas → Habilidades
  'Cube003_Material007_0': 'tecnologias',
  'Cube003_Material008_0': 'tecnologias',

  // Libro portada celeste + hojas → Experiencia
  'Cube004_Material010_0': 'experiencia',
  'Cube004_Material008_0': 'experiencia',

  // Libro portada verde + hojas → Proyectos
  'Cube011_Material014_0': 'proyectos',
  'Cube011_Material008_0': 'proyectos',

  // Libro portada rojo (arriba) + hojas → Contacto
  'Cube010_Material013_0': 'contacto',
  'Cube010_Material008_0': 'contacto',

  // Libro portada rojo (debajo) + hojas → CV
  'Cube009_Material012_0': 'cv',
  'Cube009_Material008_0': 'cv',

  // Libro portada azul + hojas → sección "extra": su contenido se muestra
  // embebido sobre la pantalla del monitor en vez de abrir el panel HUD
  // (ver SECTION_CONTENT.extra y el bloque monitorScreen más abajo).
  'Cube008_Material011_0': 'extra',
  'Cube008_Material008_0': 'extra',
};

const OPACITY_LERP_SPEED = 6;

// Vista fija hacia la computadora — a mano, para evitar que la cámara
// "traspase" geometría como pasaba con fitToBox automático.
// Vista tipo "sentado en la silla": altura de ojos baja, cerca del
// escritorio, mirando ligeramente hacia el monitor.
// Recalculado usando el centro real de la pantalla del monitor en el
// modelo (~x:0, y:0.53, z:-0.42). Como la silla ahora se vuelve
// transparente mientras hay una sección activa, la cámara puede ubicarse
// prácticamente donde estaba sin que nada tape el monitor.
// Sigue siendo un punto de partida — afinar corriendo el proyecto (podés
// usar `logCameraView()` en la consola, ver más abajo).
// Vista general frente al escritorio (la que pasó el usuario probando en
// consola con logCameraView()).
const DEFAULT_VIEW = [0.004, 0.574, -0.045, 0.003, 0.562, -0.107];

// Vista "sentado", cuando hay una sección activa — la pantalla del monitor
// ocupa casi todo el encuadre en altura. El usuario notó que en ancho
// faltaba un poco, así que se aleja levemente la cámara sobre su propio
// eje de mirada (mismo target, posición un poco más atrás) para ganar
// campo horizontal sin perder el encuadre vertical logrado.
const CHAIR_VIEW_RAW = [0.006, 0.534, -0.221, 0.005, 0.532, -0.277];
const CHAIR_VIEW_PULLBACK = 1.12; // >1 aleja la cámara del target, a lo largo de la misma línea de mirada
const CHAIR_VIEW = (() => {
  const [px, py, pz, tx, ty, tz] = CHAIR_VIEW_RAW;
  const pos = new THREE.Vector3(px, py, pz);
  const target = new THREE.Vector3(tx, ty, tz);
  const pulled = target.clone().add(pos.clone().sub(target).multiplyScalar(CHAIR_VIEW_PULLBACK));
  return [pulled.x, pulled.y, pulled.z, tx, ty, tz];
})();

// Vista amplia de arranque — desde donde la cámara "aterriza" antes de
// deslizarse hacia DEFAULT_VIEW. Es DEFAULT_VIEW pero más atrás y más
// arriba, para que la primera impresión sea ver el escritorio completo
// (con los libros) y recién después la cámara se acomode.
const INTRO_START_VIEW = [0.05, 0.95, 0.9, 0.003, 0.5, -0.107];

// Cuánto más grande que la geometría real es la zona de clic invisible.
// Súbelo si sigue costando acertarle a una pieza; bájalo si empieza a
// robarle clics a la pieza de al lado.
const HITBOX_PADDING = 1.4;

function Desk({ activeSection, onSelectSection, onReady }) {
  const { scene } = useGLTF('/models/desk.glb');
  const hoveredRef = useRef(null);
  const themed = useRef(false);
  const chairMeshesRef = useRef([]);
  const [hitboxes, setHitboxes] = useState([]);
  const [hoveredMesh, setHoveredMesh] = useState(null);
  const [hoveredMonitor, setHoveredMonitor] = useState(false);
  const [monitorScreen, setMonitorScreen] = useState(null);

  useEffect(() => {
    if (!themed.current) {
      applyDeskTheme(scene);
      if (MONITOR_SCREEN_MESH) {
        applyMeshGlow(scene, MONITOR_SCREEN_MESH, { color: SCREEN_GLOW, intensity: 0.9 });
      }

      if (CHAIR_MESH) {
        const chairMeshes = Array.isArray(CHAIR_MESH) ? CHAIR_MESH : [CHAIR_MESH];
        chairMeshesRef.current = chairMeshes
          .map((name) => {
            applyMeshColor(scene, name, CHAIR_COLOR);
            return scene.getObjectByName(name);
          })
          .filter(Boolean);
        // Deja las mallas de la silla listas para poder animar su opacidad
        // (transparent debe estar en true desde el arranque para que el
        // cambio de opacity se vea, si no three.js la sigue pintando opaca).
        chairMeshesRef.current.forEach((mesh) => {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            mat.transparent = true;
          });
          // Retroceder la silla — una sola vez, en el arranque.
          mesh.position.add(CHAIR_PUSH_BACK);
        });
      }

      themed.current = true;
    }

    // Clave del fix: hay que forzar el recálculo de matrices de mundo ANTES
    // de medir las cajas. Si no, Box3.setFromObject lee transforms todavía
    // "en blanco" (identity) porque three.js recién las actualiza en el
    // primer render.
    scene.updateMatrixWorld(true);

    // Ubica la pantalla del monitor en espacio de mundo, para poder anclar
    // ahí el html de la sección "extra" (en vez de una pestaña aparte).
    // La pantalla es un plano "plano": una de sus 3 dimensiones (el grosor,
    // en la dirección de la normal) es mucho más chica que las otras dos;
    // esas otras dos son el ancho y el alto reales, sin importar cómo
    // quedó orientado el plano tras exportarse desde Blender/FBX.
    if (MONITOR_SCREEN_MESH) {
      const screenMesh = scene.getObjectByName(MONITOR_SCREEN_MESH);
      if (screenMesh) {
        const box = new THREE.Box3().setFromObject(screenMesh);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const dims = [size.x, size.y, size.z].sort((a, b) => a - b);
        const [width, height] = [dims[2], dims[1]]; // los dos ejes más grandes
        setMonitorScreen({ center, width, height, size });
      }
    }

    // Construye una caja invisible, más grande y "limpia", sobre cada pieza
    // interactiva — así el clic no depende de la geometría real (que puede
    // tener varias piezas superpuestas y causar el "traspaso" visual).
    const boxes = Object.keys(MESH_TO_SECTION)
      .map((meshName) => {
        const target = scene.getObjectByName(meshName);
        if (!target) return null;
        const box = new THREE.Box3().setFromObject(target);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3()).multiplyScalar(HITBOX_PADDING);
        return { meshName, section: MESH_TO_SECTION[meshName], center, size };
      })
      .filter(Boolean);
    setHitboxes(boxes);

    // Recién acá el modelo está temeado, medido y con sus zonas de clic
    // armadas — es el momento correcto para que la cámara empiece a
    // moverse hacia su posición final, ya con todo el material visible.
    onReady?.();
  }, [scene, onReady]);

  useFrame(() => {
    scene.traverse((obj) => {
      if (!obj.isMesh) return;

      // Los libros ya NO se mueven al pasar el mouse — solo se resaltan
      // (glow) y aparece el cuadrito con el nombre de la sección (más abajo,
      // el <Html className="hover-tag">). Así se entiende qué es cada
      // objeto sin que la geometría se desplace ni "flote".
      const isHovered = hoveredRef.current === obj.uuid;

      // Glow: acento cálido sutil en reposo/hover → magenta si es la sección activa
      const section = MESH_TO_SECTION[obj.name];
      if (section && obj.material && 'emissive' in obj.material) {
        const isActive = activeSection === section;
        // Antes: cian fuerte en reposo/hover, que tapaba el color real de
        // cada portada. Ahora se usa un acento cálido y de baja intensidad
        // que solo "resalta el borde" — el magenta queda reservado para
        // marcar cuál sección está abierta en este momento.
        const targetColor = isActive ? NEON_MAGENTA : BOOK_ACCENT;
        const targetIntensity = isActive ? 1.1 : isHovered ? 0.55 : 0.12;
        obj.material.emissive.set(targetColor);
        obj.material.emissiveIntensity += (targetIntensity - obj.material.emissiveIntensity) * 0.15;
      }
    });

    // "Traspasar" la silla: en vez de esconderla de golpe, se desvanece
    // suavemente a casi-transparente cuando hay una sección activa (la
    // cámara se mueve a CHAIR_VIEW, justo donde está la silla) y vuelve a
    // aparecer en la vista general. depthWrite se apaga mientras está
    // desvanecida para que no bloquee el renderizado de lo que hay detrás.
    if (chairMeshesRef.current.length) {
      const targetOpacity = activeSection ? CHAIR_OPACITY_ACTIVE : 1;
      chairMeshesRef.current.forEach((mesh) => {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          mat.opacity += (targetOpacity - mat.opacity) * Math.min(1, OPACITY_LERP_SPEED * 0.016);
          mat.depthWrite = mat.opacity > 0.5;
        });
      });
    }
  });

  return (
    <>
      <primitive object={scene} />

      {/* Zonas de clic invisibles — más confiables que la geometría real */}
      {hitboxes.map(({ meshName, section, center, size }) => (
        <mesh
          key={meshName}
          position={center}
          onClick={(e) => {
            e.stopPropagation();
            onSelectSection(section);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            const target = scene.getObjectByName(meshName);
            if (target) hoveredRef.current = target.uuid;
            setHoveredMesh(meshName);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            hoveredRef.current = null;
            setHoveredMesh(null);
            document.body.style.cursor = 'auto';
          }}
        >
          <boxGeometry args={[size.x, size.y, size.z]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      ))}

      {/* Cuadrito informativo antes de seleccionar — qué es este objeto */}
      {hoveredMesh &&
        (() => {
          const hovered = hitboxes.find((h) => h.meshName === hoveredMesh);
          if (!hovered) return null;
          const label = SECTION_CONTENT[hovered.section]?.label ?? hovered.section;
          return (
            <Html
              position={[hovered.center.x, hovered.center.y + hovered.size.y / 2 + 0.05, hovered.center.z]}
              center
              style={{ pointerEvents: 'none' }}
            >
              <div className="hover-tag">{label}</div>
            </Html>
          );
        })()}

      {/* Monitor: pieza central del escritorio — al hacer clic abre un menú
          con todas las secciones, en vez de quedar decorativo/sin función. */}
      {monitorScreen && (
        <mesh
          position={monitorScreen.center}
          onClick={(e) => {
            e.stopPropagation();
            onSelectSection('menu');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredMonitor(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHoveredMonitor(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <boxGeometry
            args={[
              monitorScreen.size.x * HITBOX_PADDING,
              monitorScreen.size.y * HITBOX_PADDING,
              monitorScreen.size.z * HITBOX_PADDING,
            ]}
          />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}

      {hoveredMonitor && monitorScreen && (
        <Html
          position={[monitorScreen.center.x, monitorScreen.center.y + monitorScreen.height / 2 + 0.05, monitorScreen.center.z]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="hover-tag">Ver opciones</div>
        </Html>
      )}
    </>
  );
}

function CameraRig({ controlsRef, activeSection, sceneReady }) {
  // Primera vez que la escena queda lista: la cámara "aterriza" desde
  // INTRO_START_VIEW (vista amplia, ya con el material visible) y se
  // desliza sola hasta DEFAULT_VIEW. Antes de esto no animamos nada —
  // así el usuario no ve la cámara moverse mientras el modelo todavía se
  // está armando (texturas, hitboxes, etc.).
  const introPlayedRef = useRef(false);

  useEffect(() => {
    if (!controlsRef.current || !sceneReady) return;

    if (!introPlayedRef.current) {
      introPlayedRef.current = true;
      // Sin transición: arranca ya en la vista amplia (no animado desde el
      // origen del mundo, que se vería como un salto raro).
      controlsRef.current.setLookAt(...INTRO_START_VIEW, false);
      // Un frame después, recién ahí se desliza a la vista final — le da
      // tiempo al primer render de asentarse antes de animar.
      requestAnimationFrame(() => {
        controlsRef.current?.setLookAt(...(activeSection ? CHAIR_VIEW : DEFAULT_VIEW), true);
      });
      return;
    }

    const view = activeSection ? CHAIR_VIEW : DEFAULT_VIEW;
    controlsRef.current.setLookAt(...view, true);
  }, [activeSection, controlsRef, sceneReady]);

  return null;
}

export default function DeskScene({ activeSection, onSelectSection }) {
  const controlsRef = useRef(null);
  const [sceneReady, setSceneReady] = useState(false);
  const handleReady = useCallback(() => setSceneReady(true), []);

  // Herramienta de consola (F12) — mové la cámara con el mouse hasta que
  // quede como querés y escribí `logCameraView()` en la consola: te tira
  // el array [x, y, z, tx, ty, tz] listo para pegar en CHAIR_VIEW o
  // DEFAULT_VIEW más arriba en este archivo. Se borra sola al desmontar.
  useEffect(() => {
    window.logCameraView = () => {
      if (!controlsRef.current) {
        console.warn('La cámara todavía no está lista.');
        return;
      }
      const pos = new THREE.Vector3();
      const target = new THREE.Vector3();
      controlsRef.current.getPosition(pos);
      controlsRef.current.getTarget(target);
      const view = [pos.x, pos.y, pos.z, target.x, target.y, target.z].map(
        (n) => Math.round(n * 1000) / 1000
      );
      const line = `[${view.join(', ')}]`;
      console.log('Vista actual de la cámara (copiá este array):');
      console.log(line);
      navigator.clipboard?.writeText(line).catch(() => {});
      return view;
    };
    return () => {
      delete window.logCameraView;
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Canvas
        camera={{ position: INTRO_START_VIEW.slice(0, 3), fov: 40, near: 0.01 }}
        shadows
        dpr={[1, 1.8]}
      >
        <color attach="background" args={['#1c1f24']} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 5, 2]} intensity={0.9} color="#f2f4f6" castShadow />
        <pointLight position={[-2, 1.5, -1]} intensity={0.2} color="#ffffff" />

        <Suspense fallback={<Html center className="loading-label">Cargando escritorio…</Html>}>
          <Desk activeSection={activeSection} onSelectSection={onSelectSection} onReady={handleReady} />
          <Environment preset="city" environmentIntensity={0.25} />
          <ContactShadows position={[0, -0.01, 0]} opacity={0.6} blur={2.5} far={4} />
        </Suspense>

        <CameraControls
          ref={controlsRef}
          // minPolarAngle: qué tanto se puede mirar desde arriba hacia abajo.
          // maxPolarAngle: qué tanto se puede bajar la cámara y mirar hacia
          // arriba.
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI * 0.85}
          // Sin límite artificial de distancia — lo que impedía acercarse
          // del todo era el near-clip de la cámara, ya corregido arriba.
          minDistance={0.05}
          maxDistance={20}
          // Velocidades más bajas que el default — movimiento más lento y
          // predecible para que arrastrar o girar no desoriente.
          azimuthRotateSpeed={0.6}
          polarRotateSpeed={0.6}
          truckSpeed={0.8}
          dollySpeed={0.6}
          smoothTime={0.3}
        />
        <CameraRig controlsRef={controlsRef} activeSection={activeSection} sceneReady={sceneReady} />

        <EffectComposer>
          <Bloom intensity={0.7} luminanceThreshold={0.25} luminanceSmoothing={0.3} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/desk.glb');
