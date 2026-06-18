// Tooltip que sigue al cursor cuando hay un nodo bajo el puntero.
// Muestra: eyebrow con el nivel jerárquico + nombre + hint si es nota.

import type { Categoria, Nota, Subcategoria } from "../lib/types";

export type HoverInfo =
  | { type: "cat"; cat: Categoria }
  | { type: "sub"; cat: Categoria; sub: Subcategoria }
  | { type: "note"; cat: Categoria; sub: Subcategoria; nota: Nota };

export function HoverTooltip({
  info,
  pos,
}: {
  info: HoverInfo;
  pos: { x: number; y: number };
}) {
  let eyebrow = "";
  let title = "";
  if (info.type === "cat") {
    eyebrow = "Categoría";
    title = info.cat.name;
  } else if (info.type === "sub") {
    eyebrow = `${info.cat.name} › Subcategoría`;
    title = info.sub.name;
  } else {
    eyebrow = `${info.cat.name} › ${info.sub.name} › Nota`;
    title = info.nota.name;
  }

  // Mantén el tooltip dentro de la ventana
  const offsetX = 18;
  const offsetY = 18;
  const left = Math.min(pos.x + offsetX, window.innerWidth - 280);
  const top = Math.min(pos.y + offsetY, window.innerHeight - 120);

  const color =
    info.type === "cat"
      ? info.cat.color
      : info.type === "sub"
        ? info.cat.color
        : info.cat.color;

  return (
    <div
      className="pointer-events-none fixed z-40 w-[260px] rounded-xl border border-white/10 bg-[#1c130c]/95 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      style={{ left, top }}
    >
      <div
        className="text-[10px] uppercase tracking-[0.16em]"
        style={{ color }}
      >
        {eyebrow}
      </div>
      <div className="serif mt-1 text-[20px] leading-tight text-[#f5ede0]">
        {title}
      </div>
      {info.type === "note" && info.nota.nameNah && (
        <div className="mt-1 text-[11px] italic text-[#a39281]">
          náhuatl · {info.nota.nameNah}
        </div>
      )}
      {info.type === "note" && (
        <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#d9a324]/80">
          click para ver ficha
        </div>
      )}
      {info.type !== "note" && (
        <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#a39281]">
          {info.type === "cat"
            ? `${info.cat.subcategorias.reduce((a, s) => a + s.notas.length, 0)} notas en ${info.cat.subcategorias.length} subcategorías`
            : `${info.sub.notas.length} notas`}
        </div>
      )}
    </div>
  );
}
