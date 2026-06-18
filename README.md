# almanegra-rueda-3d

> Rueda 3D en REACT

Prototipo del componente React 3D de la **Rueda de Sabor del Café Mexicano**.

Almanegra Café · Mayo 2026 · v0.1

**Dominio destino:** [rueda.cafe](http://rueda.cafe) (registrado, pendiente de publicación).

---

## Qué es esto

Un solo componente React con factor *wow*: visualización 3D interactiva de la Rueda de Sabor del Café Mexicano. **No es un sitio. No es un design system.** Es un componente de prototipo para demostrar la rueda como objeto sensorial 3D — navegable, calibrado con datos reales del léxico mexicano (etimología náhuatl, geografía mexicana por nota, referencia material, intensidades 0-15).

## Stack

- React 19 + TypeScript + Vite 6
- Three.js + `@react-three/fiber` + drei
- `@react-three/postprocessing` (Bloom, Vignette, ACES tone mapping)
- TailwindCSS para el HUD 2D superpuesto
- Tipografía: Cormorant Garamond italic (serif, los tres anillos de la rueda) + Inter (UI)

## El boceto actual: Disco Extruido

Después de iterar tres conceptos en bocetos (Disco extruido, Dome orbital, Tarjetas flotantes), el ganador es el **Disco extruido** — la rueda Counter Culture llevada a 3D real:

- Tres anillos concéntricos extruidos: categoría base, subcategoría más alta, notas como bandas exteriores con altura por cluster (proporcional al número de notas).
- 11 categorías con paleta cálida mexicana: rojo tezontle, ámbar piloncillo, verde nopal, cacao oscuro, rosa cempasúchil, naranja canela, etcétera.
- Material `MeshPhysicalMaterial` con clearcoat sutil, iluminación cálida key + rim fría tenue + ambient bajo.
- Rotación lenta idle que pausa en hover.
- Hover lift con damping suave en cascada hacia los ancestros (tocar una nota eleva su subcategoría y su categoría).
- Tooltip al cursor con breadcrumb jerárquico.
- Mini-leyenda esquemática esquina inferior izquierda.
- Hint de invitación al cargar (12 s o hasta el primer hover).
- Click sobre nota: ficha lateral con etimología, geografía, referencia material, intensidades.

## Datos

`src/data/rueda.ts` deriva del léxico consolidado en `../ALMANEGRA-FILOSOFIA/lexico-rueda-mexicana.md`. 11 categorías, ~120 descriptores.

Algunas entradas (Capulín, Cempasúchil) ya tienen etimología náhuatl, geografía, referencia material, intensidades — para mostrar cómo se ve una ficha completa al click. Falta poblar el resto: trivial, extraer del léxico.

## Postura

La rueda no traduce el WCR al español. **Es ciencia sensorial local**:

- No oposición a la ciencia sensorial occidental. Sí oposición a su pretensión universalista.
- Referencias materiales mexicanas (no Lorna Doone, no Smucker's — capulín fresco, chocolate de mesa, hoja santa).
- Etimología originaria (náhuatl, maya, zapoteca) cuando aplica.
- Geografía real de producción por entrada.

El visual refleja eso: serif italic editorial para el léxico, paleta cálida mexicana, iluminación tibia. Nada de azules fríos genéricos de SaaS.

Ver `../ALMANEGRA-FILOSOFIA/marco-teorico-rueda-mexicana.md` para el marco completo.

## Correr

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # bundle a dist/
npm run preview  # preview del build
```

## Estructura

```
src/
├── main.tsx
├── App.tsx                     título + Disco
├── index.css                   tailwind
├── data/
│   └── rueda.ts                dataset (cat → sub → nota)
├── lib/
│   ├── types.ts                RuedaData, Categoria, Subcategoria, Nota
│   └── palette.ts              paleta y orden canónico
├── bocetos/
│   └── DiscoExtruido.tsx       el componente principal
├── ui/
│   ├── HoverTooltip.tsx        tooltip al cursor con breadcrumb
│   └── LeyendaEsquema.tsx      mini-leyenda inferior izquierda
└── troika-three-text.d.ts      tipos mínimos para preloadFont
public/
└── fonts/                      Cormorant Garamond italic 500/600 TTF
```

## Pendientes / próximas iteraciones

- [ ] Poblar `rueda.ts` con etimología/geografía/referencias completas para los ~115 descriptores que aún sólo tienen `name`.
- [ ] Modo impresión (`@media print`) para imprimir pliego grande de cupping.
- [ ] Búsqueda (Cmd+K) con highlight de cuñas/notas matcheando texto.
- [ ] Deep linking por hash (`#capulin` abre la ficha al cargar).
- [ ] Toggle idioma (es / en / náhuatl) con sufijo de campo (`name_en`, `name_nah`).
- [ ] Export PNG/SVG de la vista actual.
- [ ] Audio de pronunciación náhuatl (capulín, cempasúchil, xoconostle).
- [ ] Mobile / touch optimizaciones.

## Documentos hermanos en `../ALMANEGRA-FILOSOFIA/`

- `rueda_sabor_cafe_mexicano_d3.html` — versión D3 plana (2D), funcional.
- `lexico-rueda-mexicana.md` — léxico de 120 descriptores con etimología, geografía, referencias.
- `marco-teorico-rueda-mexicana.md` — postura epistemológica del proyecto.
- `referencias-cientificas/` — 15 papers procesados + adaptación al español del Science of Taste.
