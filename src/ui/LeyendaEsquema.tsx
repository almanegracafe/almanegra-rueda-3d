// Mini-leyenda esquemática en la esquina inferior izquierda.
// Tres anillos concéntricos dibujados en SVG, con etiquetas
// explicando qué representa cada anillo. Pedagogía a primera vista.

export function LeyendaEsquema() {
  return (
    <div className="pointer-events-none absolute bottom-6 left-6 z-20 select-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl">
      <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#a39281]">
        Estructura
      </div>
      <div className="flex items-center gap-3">
        <svg width="64" height="64" viewBox="-32 -32 64 64">
          {/* Anillo categorías */}
          <circle cx="0" cy="0" r="10" fill="none" stroke="#d94a2a" strokeWidth="6" />
          {/* Anillo subcategorías */}
          <circle cx="0" cy="0" r="18" fill="none" stroke="#c08a4f" strokeWidth="4.5" opacity="0.85" />
          {/* Notas: 8 bandas exteriores */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a0 = (i / 8) * Math.PI * 2;
            const a1 = ((i + 1) / 8) * Math.PI * 2 - 0.04;
            const r0 = 22;
            const r1 = 26 + (i % 3) * 2;
            const path = `
              M ${Math.cos(a0) * r0} ${Math.sin(a0) * r0}
              A ${r0} ${r0} 0 0 1 ${Math.cos(a1) * r0} ${Math.sin(a1) * r0}
              L ${Math.cos(a1) * r1} ${Math.sin(a1) * r1}
              A ${r1} ${r1} 0 0 0 ${Math.cos(a0) * r1} ${Math.sin(a0) * r1}
              Z
            `;
            return <path key={i} d={path} fill="#d9a324" opacity={0.75} />;
          })}
        </svg>
        <div className="flex flex-col gap-1.5 text-[10.5px] leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ background: "#d94a2a" }}
            />
            <span className="text-[#e7d9c4]">Categoría</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ background: "#c08a4f" }}
            />
            <span className="text-[#e7d9c4]">Subcategoría</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ background: "#d9a324" }}
            />
            <span className="text-[#e7d9c4]">Nota sensorial</span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-[9.5px] italic leading-tight text-[#7a6a5a]">
        altura del cluster ∝ número de notas
      </div>
    </div>
  );
}
