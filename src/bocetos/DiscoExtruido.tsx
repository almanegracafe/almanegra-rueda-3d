// Boceto A — Disco extruido (rueda Counter Culture en 3D)
//
// Estructura igual a la rueda 2D ya consolidada:
//   anillo 1 — Categorías (cuña gruesa, color saturado, texto grande)
//   anillo 2 — Subcategorías (cuña media)
//   anillo 3 — Notas: bandas exteriores AGRUPADAS por subcategoría,
//             con altura radial por cluster proporcional al número de notas
//             (como Counter Culture / la rueda D3 actual).
//
// Idle: rotación lenta del disco. Hover sobre cluster: el cluster se eleva
// y sus notas se iluminan. Click en cualquier cuña: ficha flotante.

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Html,
  Text,
} from "@react-three/drei";
import { preloadFont } from "troika-three-text";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { rueda } from "../data/rueda";
import type { Categoria, Nota, Subcategoria } from "../lib/types";
import { HoverTooltip, type HoverInfo } from "../ui/HoverTooltip";
import { LeyendaEsquema } from "../ui/LeyendaEsquema";

// Cormorant Garamond italic local. Mantiene la voz editorial del proyecto
// en los tres niveles del léxico (categorías ya están en HTML/CSS; aquí
// servimos las TTF a troika-three-text para subs y notas).
const SERIF_500 = "/fonts/CormorantGaramond-Italic-500.ttf";
const SERIF_600 = "/fonts/CormorantGaramond-Italic-600.ttf";

// Preload one-shot: troika empieza a descargar ambas fuentes antes de que
// el componente intente renderizarlas. Combinado con <Suspense>, garantiza
// que el árbol del Disco solo aparece cuando las fuentes están listas
// (en lugar de aparecer un instante sin texto).
preloadFont({ font: SERIF_500, characters: "" }, () => {});
preloadFont({ font: SERIF_600, characters: "" }, () => {});

const TWO_PI = Math.PI * 2;

// Geometría: cuña anular extruida entre dos radios y dos ángulos.
// Las coordenadas del Shape están en el plano XY; el grupo padre se rota
// luego con [-π/2, 0, 0] para que el disco quede en plano XZ (horizontal).
// `padAngle` recorta un pequeño margen a cada lado para crear un gap real
// entre cuñas adyacentes — eso las distingue sin necesidad de hover.
function makeRingWedge(
  innerR: number,
  outerR: number,
  startA: number,
  endA: number,
  depth: number,
  bevel = 0.025,
  padAngle = 0,
) {
  const a0 = startA + padAngle / 2;
  const a1 = endA - padAngle / 2;
  // Si el pad come toda la cuña (ángulo demasiado chico), abortamos
  if (a1 <= a0) {
    return new THREE.BufferGeometry();
  }
  const segments = Math.max(8, Math.ceil(((a1 - a0) / TWO_PI) * 256));
  const shape = new THREE.Shape();
  for (let i = 0; i <= segments; i++) {
    const a = a0 + (a1 - a0) * (i / segments);
    const x = Math.cos(a) * outerR;
    const y = Math.sin(a) * outerR;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  for (let i = segments; i >= 0; i--) {
    const a = a0 + (a1 - a0) * (i / segments);
    shape.lineTo(Math.cos(a) * innerR, Math.sin(a) * innerR);
  }
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 16,
  });
}

// Aclara o oscurece un color HEX para derivar los tonos del anillo medio
function shade(hex: string, factor: number) {
  const c = new THREE.Color(hex);
  c.lerp(new THREE.Color("#f5ede0"), factor);
  return `#${c.getHexString()}`;
}

function RadialText({
  text,
  angle,
  radius,
  yTop,
  size,
  color = "#fdf8ee",
  weight = "medium" as const,
  maxWidth,
}: {
  text: string;
  angle: number;
  radius: number;
  yTop: number;
  size: number;
  color?: string;
  weight?: "medium" | "bold";
  maxWidth?: number;
}) {
  // Texto orientado radialmente, paralelo al borde radial de la cuña
  // (la línea que va del centro hacia afuera). Útil para notas: aprovecha
  // toda la dimensión radial del cluster.
  const flip = angle > Math.PI / 2 && angle < (3 * Math.PI) / 2;
  return (
    <Text
      font={weight === "bold" ? SERIF_600 : SERIF_500}
      position={[
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        // +0.04 = un poco más que el bevelSize (0.025) de la cuña extruida,
        // si no el texto queda hundido bajo el bevel y no se renderiza.
        yTop + 0.04,
      ]}
      rotation={[0, 0, angle + (flip ? Math.PI : 0)]}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.02}
      maxWidth={maxWidth}
      outlineWidth={size * 0.05}
      outlineColor="#1c130c"
      outlineOpacity={0.45}
      renderOrder={2}
    >
      {text}
    </Text>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Geometría de la rueda
// ───────────────────────────────────────────────────────────────────────────
const CAT_INNER = 0.72;
const CAT_OUTER = 1.78;
const SUB_INNER = 1.84;
const SUB_OUTER = 2.62;
const LEAF_INNER = 2.7;
const LEAF_HEIGHT_PER_NOTE = 0.26;
const LEAF_MIN = 0.6;
const LEAF_MAX = 1.85;

// Las alturas crecen hacia afuera para crear una topografía visible que
// invite a la lectura: categorías base, subcategorías sobresalen, notas
// rematan como bandas. La escala hacia arriba refuerza la jerarquía.
const CAT_DEPTH = 0.20;
const SUB_DEPTH = 0.30;
const LEAF_DEPTH = 0.22;

interface Layout {
  cat: Categoria;
  catStart: number;
  catEnd: number;
  subs: {
    sub: Subcategoria;
    start: number;
    end: number;
    notes: { nota: Nota; start: number; end: number }[];
    clusterOuterR: number;
  }[];
  totalNotes: number;
}

function buildLayout(): { layouts: Layout[]; grandTotal: number } {
  const grandTotal = rueda.categorias.reduce(
    (a, c) =>
      a + c.subcategorias.reduce((s, sub) => s + sub.notas.length, 0),
    0,
  );

  let cursor = -Math.PI / 2; // arrancar arriba (12 en punto)
  const layouts: Layout[] = rueda.categorias.map((cat) => {
    const totalNotes = cat.subcategorias.reduce(
      (a, s) => a + s.notas.length,
      0,
    );
    const arc = (totalNotes / grandTotal) * TWO_PI;
    const catStart = cursor;
    const catEnd = cursor + arc;
    cursor = catEnd;

    let subCursor = catStart;
    const subs = cat.subcategorias.map((sub) => {
      const subArc = (sub.notas.length / totalNotes) * arc;
      const start = subCursor;
      const end = subCursor + subArc;
      subCursor = end;

      const notes = sub.notas.map((nota, i) => {
        const noteArc = subArc / sub.notas.length;
        return {
          nota,
          start: start + i * noteArc,
          end: start + (i + 1) * noteArc,
        };
      });

      const clusterHeight = Math.max(
        LEAF_MIN,
        Math.min(LEAF_MAX, LEAF_HEIGHT_PER_NOTE * sub.notas.length),
      );
      const clusterOuterR = LEAF_INNER + clusterHeight;
      return { sub, start, end, notes, clusterOuterR };
    });

    return { cat, catStart, catEnd, subs, totalNotes };
  });

  return { layouts, grandTotal };
}

// ───────────────────────────────────────────────────────────────────────────
// Damping suave para el lift al hover
// ───────────────────────────────────────────────────────────────────────────
// Envuelve cualquier subtree y aplica una transición exponencial en Z al
// valor `target`. Sin librerías de animación externas — solo lerp por frame.
// `speed` controla qué tan rápido alcanza el destino (8-10 = mantequilla).
function DampedLift({
  target,
  speed = 9,
  children,
}: {
  target: number;
  speed?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null!);
  const current = useRef(0);
  useFrame((_, dt) => {
    if (!ref.current) return;
    // Critically damped lerp: alpha = 1 - exp(-speed * dt)
    const alpha = 1 - Math.exp(-speed * dt);
    current.current += (target - current.current) * alpha;
    ref.current.position.z = current.current;
  });
  return <group ref={ref}>{children}</group>;
}

// ───────────────────────────────────────────────────────────────────────────
// Cuña base (re-usable)
// ───────────────────────────────────────────────────────────────────────────
function Wedge({
  innerR,
  outerR,
  startA,
  endA,
  depth,
  color,
  padAngle = 0,
  hovered = false,
  onPointerOver,
  onPointerOut,
  onClick,
  emissiveBase = 0.06,
}: {
  innerR: number;
  outerR: number;
  startA: number;
  endA: number;
  depth: number;
  color: string;
  padAngle?: number;
  hovered?: boolean;
  onPointerOver?: (e: any) => void;
  onPointerOut?: (e: any) => void;
  onClick?: (e: any) => void;
  emissiveBase?: number;
}) {
  const geometry = useMemo(
    () => makeRingWedge(innerR, outerR, startA, endA, depth, 0.025, padAngle),
    [innerR, outerR, startA, endA, depth, padAngle],
  );
  return (
    <mesh
      geometry={geometry}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color={color}
        metalness={0.06}
        roughness={hovered ? 0.32 : 0.55}
        clearcoat={hovered ? 0.7 : 0.25}
        clearcoatRoughness={0.4}
        emissive={color}
        emissiveIntensity={hovered ? 0.2 : emissiveBase}
      />
    </mesh>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Disco principal
// ───────────────────────────────────────────────────────────────────────────
function Disco({
  onPick,
  onHover,
  pickedNoteId,
}: {
  onPick: (nota: Nota, cat: Categoria, sub: Subcategoria) => void;
  onHover: (info: HoverInfo | null) => void;
  pickedNoteId: string | null;
}) {
  const group = useRef<THREE.Group>(null!);
  // El hover de categoría se almacena por NOMBRE (no por índice) para que el
  // lift se pueda propagar hacia arriba derivándolo del id de sub/nota.
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);
  const speedRef = useRef(0.045);

  const { layouts } = useMemo(buildLayout, []);

  // Derivación: el lift se propaga hacia los ancestros.
  //   hover en nota  → eleva su subcategoría y su categoría
  //   hover en sub   → eleva su categoría
  //   pick (click)   → mismo comportamiento que hover
  // El visual "hovered" (cambio de color/emissive) sigue siendo directo —
  // solo el ítem bajo el cursor se ilumina. Lo que se propaga es solo la
  // elevación, para reforzar el contexto jerárquico.
  const downStreamCat =
    hoveredSub?.split("::")[0] ??
    hoveredNote?.split("::")[0] ??
    pickedNoteId?.split("::")[0] ??
    null;
  const activeCatName: string | null = hoveredCat ?? downStreamCat;

  const noteToSubId = (id: string | null) =>
    id ? id.split("::").slice(0, 2).join("::") : null;
  const activeSubId: string | null =
    hoveredSub ?? noteToSubId(hoveredNote) ?? noteToSubId(pickedNoteId);

  useFrame((_, dt) => {
    if (!group.current) return;
    const idle =
      hoveredCat === null &&
      hoveredSub === null &&
      hoveredNote === null &&
      pickedNoteId === null;
    const target = idle ? 0.045 : 0;
    speedRef.current += (target - speedRef.current) * dt * 2.5;
    group.current.rotation.z += speedRef.current * dt; // Z porque grupo padre rota X=-π/2
  });

  return (
    <group ref={group} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Base oscura del disco para sombra */}
      <mesh position={[0, 0, -0.005]}>
        <ringGeometry args={[CAT_INNER - 0.02, LEAF_INNER + LEAF_MAX + 0.05, 96]} />
        <meshBasicMaterial color="#0d0805" />
      </mesh>

      {layouts.map((L) => {
        const isHoverCat = hoveredCat === L.cat.name;
        // Lift propagado: la categoría sube cuando ELLA está bajo el cursor
        // O cuando cualquiera de sus subcategorías/notas/picked lo está.
        const catLift = activeCatName === L.cat.name ? 0.08 : 0;
        return (
          <group key={L.cat.name}>
            {/* Anillo 1 — Categoría (lift por hover propio o de descendientes) */}
            <DampedLift target={catLift}>
              <Wedge
                innerR={CAT_INNER}
                outerR={CAT_OUTER}
                startA={L.catStart}
                endA={L.catEnd}
                depth={CAT_DEPTH}
                color={L.cat.color}
                padAngle={0.014}
                hovered={isHoverCat}
                onPointerOver={(e: any) => {
                  e.stopPropagation();
                  setHoveredCat(L.cat.name);
                  onHover({ type: "cat", cat: L.cat });
                }}
                onPointerOut={() => {
                  setHoveredCat((v) => (v === L.cat.name ? null : v));
                  onHover(null);
                }}
                onClick={(e: any) => {
                  e.stopPropagation();
                  const sub = L.subs[0];
                  onPick(sub.notes[0].nota, L.cat, sub.sub);
                }}
              />
              {/* Nombre de la categoría como overlay HTML — billboarding
                  garantiza que sea legible desde cualquier ángulo de cámara.
                  Vive dentro del grupo elevado para subir con la cuña. */}
              <Html
                position={[
                  Math.cos((L.catStart + L.catEnd) / 2) *
                    ((CAT_INNER + CAT_OUTER) / 2),
                  Math.sin((L.catStart + L.catEnd) / 2) *
                    ((CAT_INNER + CAT_OUTER) / 2),
                  CAT_DEPTH + 0.01,
                ]}
                center
                distanceFactor={9}
                zIndexRange={[0, 0]}
                style={{ pointerEvents: "none" }}
              >
                <div
                  className="select-none whitespace-nowrap text-center text-[13px] sm:text-[16px]"
                  style={{
                    color: "#fdf8ee",
                    fontFamily:
                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    fontWeight: 600,
                    fontStyle: "italic",
                    letterSpacing: "0.015em",
                    textShadow:
                      "0 0 8px rgba(28,19,12,0.9), 0 0 16px rgba(28,19,12,0.7)",
                    lineHeight: 1.05,
                    maxWidth: 140,
                    whiteSpace: "normal",
                  }}
                >
                  {L.cat.name}
                </div>
              </Html>
            </DampedLift>

            {/* Anillo 2 — Subcategorías
                Cada subcategoría recibe un tono ligeramente distinto dentro
                de su categoría (lerp 0.24/0.32/0.40 hacia crema) y un gap
                angular real, para que se distingan SIN hover. */}
            {L.subs.map((S, subIdx) => {
              const subId = `${L.cat.name}::${S.sub.name}`;
              const isHoverSub = hoveredSub === subId;
              // Lift propagado: la sub sube por hover propio, por hover en
              // alguna de sus notas, o por pick activo en una de sus notas.
              const lift = activeSubId === subId ? 0.08 : 0;
              // Variación tonal cíclica entre 0.24 y 0.40 para crear bandas
              // distinguibles aun en categorías con muchas subcategorías
              const tone = 0.24 + (subIdx % 3) * 0.08;
              return (
                <DampedLift key={subId} target={lift}>
                  <Wedge
                    innerR={SUB_INNER}
                    outerR={SUB_OUTER}
                    startA={S.start}
                    endA={S.end}
                    depth={SUB_DEPTH}
                    color={shade(L.cat.color, tone)}
                    padAngle={0.012}
                    hovered={isHoverSub}
                    onPointerOver={(e: any) => {
                      e.stopPropagation();
                      setHoveredSub(subId);
                      onHover({ type: "sub", cat: L.cat, sub: S.sub });
                    }}
                    onPointerOut={() => {
                      setHoveredSub((v) => (v === subId ? null : v));
                      onHover(null);
                    }}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onPick(S.notes[0].nota, L.cat, S.sub);
                    }}
                  />
                  {/* Subcategoría: paralela al borde radial — el texto se
                      lee desde el centro del disco hacia afuera, alineado
                      con la cuña, usando todo el ancho radial del anillo
                      (0.78 unidades) que es siempre el mismo. */}
                  <RadialText
                    text={S.sub.name}
                    angle={(S.start + S.end) / 2}
                    radius={(SUB_INNER + SUB_OUTER) / 2}
                    yTop={SUB_DEPTH}
                    size={0.078}
                    color="#1c130c"
                    weight="bold"
                    maxWidth={SUB_OUTER - SUB_INNER - 0.08}
                  />

                  {/* Anillo 3 — Notas
                      Cada nota dentro de un cluster alterna tono claro/medio
                      (0.42 ↔ 0.50). Gap angular fino. El hover y el "picked"
                      resaltan SOLO la nota individual — no contagian al
                      cluster. */}
                  {S.notes.map(({ nota, start, end }, noteIdx) => {
                    const noteId = `${subId}::${nota.name}`;
                    const isHoverNote = hoveredNote === noteId;
                    const isPickedNote = pickedNoteId === noteId;
                    const isActive = isHoverNote || isPickedNote;
                    const noteTone = 0.42 + (noteIdx % 2) * 0.08;
                    // Solo la nota activa se eleva ligeramente; las demás
                    // del cluster permanecen en su plano original.
                    const noteLift = isActive ? 0.05 : 0;
                    return (
                      <DampedLift key={nota.name} target={noteLift} speed={12}>
                        <Wedge
                          innerR={LEAF_INNER}
                          outerR={S.clusterOuterR}
                          startA={start}
                          endA={end}
                          depth={LEAF_DEPTH}
                          color={
                            isActive
                              ? shade(L.cat.color, 0.62)
                              : shade(L.cat.color, noteTone)
                          }
                          padAngle={0.005}
                          hovered={isActive}
                          emissiveBase={isActive ? 0.22 : 0.04}
                          onPointerOver={(e: any) => {
                            e.stopPropagation();
                            setHoveredNote(noteId);
                            onHover({
                              type: "note",
                              cat: L.cat,
                              sub: S.sub,
                              nota,
                            });
                          }}
                          onPointerOut={() => {
                            setHoveredNote((v) => (v === noteId ? null : v));
                            onHover(null);
                          }}
                          onClick={(e: any) => {
                            e.stopPropagation();
                            onPick(nota, L.cat, S.sub);
                          }}
                        />
                        <RadialText
                          text={nota.name}
                          angle={(start + end) / 2}
                          radius={(LEAF_INNER + S.clusterOuterR) / 2}
                          yTop={LEAF_DEPTH}
                          size={0.065}
                          color={isActive ? "#14100a" : "#1c130c"}
                          weight={isActive ? "bold" : "medium"}
                          maxWidth={S.clusterOuterR - LEAF_INNER - 0.05}
                        />
                      </DampedLift>
                    );
                  })}

                  {/* Marco superior del cluster: aro ámbar siempre visible.
                      Hace que cada subcategoría se lea como un bloque distinto.
                      Respeta el padAngle de las subcategorías para que entre
                      clusters haya un corte limpio. */}
                  <mesh position={[0, 0, LEAF_DEPTH + 0.001]}>
                    <ringGeometry
                      args={[
                        S.clusterOuterR + 0.005,
                        S.clusterOuterR + 0.04,
                        64,
                        1,
                        S.start + 0.006,
                        S.end - S.start - 0.012,
                      ]}
                    />
                    <meshBasicMaterial
                      color={isHoverSub ? "#fdf8ee" : "#d9a324"}
                      transparent
                      opacity={isHoverSub ? 1 : 0.72}
                    />
                  </mesh>
                </DampedLift>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Núcleo
// ───────────────────────────────────────────────────────────────────────────
function Nucleo() {
  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={0.18}>
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[CAT_INNER - 0.05, CAT_INNER - 0.05, 0.16, 96]} />
        <meshPhysicalMaterial
          color="#1c130c"
          metalness={0.85}
          roughness={0.18}
          clearcoat={1}
          emissive="#d9a324"
          emissiveIntensity={0.1}
        />
      </mesh>
      <Html
        position={[0, 0.14, 0]}
        center
        distanceFactor={9}
        style={{ pointerEvents: "none" }}
      >
        <div
          className="select-none text-center"
          style={{
            color: "#d9a324",
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            textShadow: "0 0 14px rgba(217,163,36,0.45)",
            lineHeight: 1.05,
          }}
        >
          Café
          <br />
          Mexicano
        </div>
      </Html>
    </Float>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Ficha 2D lateral (más confiable que <Html transform> 3D)
// ───────────────────────────────────────────────────────────────────────────
function FichaLateral({
  nota,
  cat,
  sub,
  onClose,
}: {
  nota: Nota;
  cat: Categoria;
  sub: Subcategoria;
  onClose: () => void;
}) {
  return (
    <div className="pointer-events-auto absolute right-6 top-1/2 z-30 w-[340px] -translate-y-1/2 rounded-2xl border border-white/10 bg-[#1c130c]/90 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: cat.color }}
      >
        {cat.name} · {sub.name}
      </div>
      <div className="serif mt-1 text-[28px] leading-tight text-[#f5ede0]">
        {nota.name}
      </div>
      {nota.nameNah && (
        <div className="mt-1 text-[12px] italic text-[#a39281]">
          náhuatl · {nota.nameNah}
        </div>
      )}
      {nota.etymology ? (
        <p className="mt-3 text-[13px] leading-relaxed text-[#e7d9c4]">
          {nota.etymology}
        </p>
      ) : (
        <p className="mt-3 text-[12px] italic text-[#7a6a5a]">
          calibración pendiente con productores
        </p>
      )}
      {nota.geography && (
        <div className="mt-3 flex flex-wrap gap-1">
          {nota.geography.map((g) => (
            <span
              key={g}
              className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#a39281]"
            >
              {g}
            </span>
          ))}
        </div>
      )}
      {nota.reference && (
        <div className="mt-3 rounded-lg bg-black/40 p-2.5 text-[11px] leading-relaxed text-[#a39281]">
          <span className="mr-1 font-medium text-[#d9a324]">Ref.</span>
          {nota.reference}
        </div>
      )}
      {(nota.intensityAroma != null || nota.intensityFlavor != null) && (
        <div className="mt-3 flex gap-3 text-[11px] text-[#a39281]">
          {nota.intensityAroma != null && (
            <div>
              Aroma <span className="text-[#f5ede0]">{nota.intensityAroma}</span>
              <span className="opacity-50">/15</span>
            </div>
          )}
          {nota.intensityFlavor != null && (
            <div>
              Sabor <span className="text-[#f5ede0]">{nota.intensityFlavor}</span>
              <span className="opacity-50">/15</span>
            </div>
          )}
        </div>
      )}
      <button
        onClick={onClose}
        className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[#a39281] hover:text-[#d9a324]"
      >
        cerrar
      </button>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Componente exportado
// ───────────────────────────────────────────────────────────────────────────
function HintInvitacion({ visible }: { visible: boolean }) {
  return (
    <div
      className={
        "pointer-events-none absolute left-1/2 top-[55%] z-10 -translate-x-1/2 select-none text-center transition-opacity duration-700 " +
        (visible ? "opacity-100" : "opacity-0")
      }
    >
      <div className="serif text-[18px] italic text-[#d9a324]/85">
        toca una cuña para entrar
      </div>
      <div className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-[#a39281]">
        explora las 11 categorías → subcategorías → notas
      </div>
    </div>
  );
}

export default function DiscoExtruido() {
  const [picked, setPicked] = useState<{
    nota: Nota;
    cat: Categoria;
    sub: Subcategoria;
  } | null>(null);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hasInteracted, setHasInteracted] = useState(false);

  // Después de 12s o primer hover/click, ocultar la invitación
  useEffect(() => {
    const t = setTimeout(() => setHasInteracted(true), 12000);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (hover || picked) setHasInteracted(true);
  }, [hover, picked]);

  const cursorClass = hover ? "cursor-pointer" : "cursor-grab active:cursor-grabbing";

  return (
    <div
      className={"absolute inset-0 " + cursorClass}
      onPointerMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        camera={{ position: [0, 6.8, 8.2], fov: 36 }}
      >
        {/* Iluminación cálida */}
        <ambientLight intensity={0.22} />
        <directionalLight
          castShadow
          position={[3.5, 7.5, 3]}
          intensity={1.9}
          color="#ffd6a1"
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 3, -3]} intensity={0.4} color="#9ab0c8" />

        {/* Suelo papel */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.45, 0]}
          receiveShadow
        >
          <circleGeometry args={[12, 80]} />
          <meshStandardMaterial color="#1a120b" roughness={1} />
        </mesh>

        {/* Suspense espera a que troika cargue las TTFs de Cormorant antes
            de renderizar el disco — evita que aparezcan cuñas sin texto
            mientras la fuente se descarga. */}
        <Suspense fallback={null}>
          <Disco
            onPick={(nota, cat, sub) => setPicked({ nota, cat, sub })}
            onHover={setHover}
            pickedNoteId={
              picked
                ? `${picked.cat.name}::${picked.sub.name}::${picked.nota.name}`
                : null
            }
          />
          <Nucleo />
        </Suspense>

        <Environment preset="warehouse" />
        <OrbitControls
          enablePan={false}
          minDistance={5.5}
          maxDistance={14}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.2}
        />
        <EffectComposer>
          <Bloom mipmapBlur intensity={0.28} luminanceThreshold={0.75} />
          <Vignette eskil={false} offset={0.25} darkness={0.78} />
        </EffectComposer>
      </Canvas>

      {/* Affordances UI */}
      <LeyendaEsquema />
      <HintInvitacion visible={!hasInteracted} />
      {hover && <HoverTooltip info={hover} pos={cursor} />}
      {picked && (
        <FichaLateral
          nota={picked.nota}
          cat={picked.cat}
          sub={picked.sub}
          onClose={() => setPicked(null)}
        />
      )}
    </div>
  );
}
