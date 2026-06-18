# Brief para Claude Design — Rueda de Sabor del Café Mexicano

**Para usar en:** [claude.ai/design](https://claude.ai/design)
**Propósito:** prototipar la versión "Ruta B" — la interpretación de Claude Design con factor *wow* máximo — para comparar contra la Ruta A local que ya vive en este repo.

Pega este brief completo como primer mensaje al agente de Claude Design. No omitas secciones.

---

## El proyecto

Soy Octavio "Tato" Ruiz, fundador de **Almanegra Café** (Ciudad de México). Estoy construyendo la **Rueda de Sabor del Café Mexicano** — una alternativa local y científicamente rigurosa al Coffee Tasters' Flavor Wheel de la SCA y al WCR Sensory Lexicon. Es una pieza con base intelectual: un marco teórico decolonial (Janer, Liberman, Dussel, Maffie) más un léxico de 120 descriptores documentados con etimología originaria, geografía mexicana de producción y referencia material accesible en mercados mexicanos.

Quiero un **componente React único** con factor visual *wow*: una visualización 3D interactiva de la rueda. **No un sitio**, no un design system. Un solo componente, impresionante en demo y presentación, que después podamos empotrar donde queramos. Eventualmente vive en el dominio [rueda.cafe](http://rueda.cafe) (registrado).

## Postura — léela antes de diseñar

Esto no es ciencia sensorial occidental traducida al español. Es **ciencia sensorial local con rigor propio**. La frase que organiza el proyecto: *"No estamos separados de la ciencia sensorial. Solo nos toca generar conocimiento local."* Diseña con esto presente:

- **Nada de blueberry, raspberry, hazelnut como ejemplos.** Aquí: capulín, cempasúchil, hoja santa, pasilla mixe, chocolate de mesa oaxaqueño, piloncillo, cacao criollo de Tabasco.
- **Nada de tipografía SaaS azul fría.** Aquí: serif elegante para títulos (Cormorant Garamond), sans humano para UI (Inter). Paleta cálida con identidad mexicana: rojo tezontle, ámbar piloncillo, verde nopal, cacao oscuro, rosa cempasúchil, naranja canela.
- **Nada de "official", "premium", "world-class".** Tono: serio, propio, honesto. Si hubiera microcopy, en español neutro mexicano. *Cata. Catador. Productor. Mercado. Milpa. Olla.* No "tasting flight", no "barista journey".
- **Nada de "100 puntos", rankings, scoring numérico con énfasis.** Las intensidades 0-15 (escala Spectrum™ del WCR) son una herramienta, no un cierre. La rueda invita a **recorrer, no a calificar**.

Referencia visual posicional: si Counter Culture o Onyx son tu reflejo automático, **desvíate**. Aquí pensamos más cerca de Adrià-en-elBulli + Nara cerámica + Oaxaca textil + Apple-vision-pro en lo que respecta a profundidad y materiales. Sobrio, denso, cálido.

## Las 11 categorías y sus colores canónicos

| Categoría             | HEX       | Significante |
|-----------------------|-----------|--------------|
| Frutal mexicano       | `#d94a2a` | rojo tezontle |
| Floral mexicano       | `#c93f7a` | rosa cempasúchil |
| Herbal y verde        | `#5c8a3a` | verde nopal |
| Maíz y masa           | `#d9a324` | amarillo elote |
| Dulce tradicional     | `#e0931d` | ámbar piloncillo |
| Panadería             | `#c08a4f` | crema horno |
| Nuez y semilla        | `#8a5a35` | marrón pecana |
| Cacao y chocolate     | `#5e3a22` | cacao oscuro |
| Ahumado y resinoso    | `#6e5848` | gris copal |
| Especias              | `#c87024` | naranja canela |
| Chiles secos          | `#9c2a20` | rojo profundo |

Orden canónico arriba; respétalo. Cada categoría tiene 3-4 subcategorías; cada subcategoría tiene 3-7 notas. Total ~120 descriptores.

## Dataset

Te paso el JSON al final de este brief. Es esquema:

```ts
type Nota = {
  name: string;
  nameNah?: string;       // náhuatl
  etymology?: string;     // origen lingüístico
  geography?: string[];   // estados mexicanos productores
  reference?: string;     // qué pedir y dónde, para calibrar paladar
  intensityAroma?: number;  // 0-15 (provisional)
  intensityFlavor?: number;
};

type Subcategoria = { name: string; notas: Nota[] };
type Categoria = { name: string; color: string; subcategorias: Subcategoria[] };
type RuedaData = { categorias: Categoria[] };
```

Tres ejemplos de entradas ricas (Capulín, Cempasúchil, Pasilla mixe) tienen todos los campos; el resto solo tiene `name`. Cuando renderices la ficha, usa los datos reales — si están vacíos, muestra estado elegante "calibración pendiente" en español, no placeholder en inglés.

## La metáfora central

**Una rueda 3D que el catador habita, no que mira.** El usuario debe sentir profundidad real, materiales con presencia, movimiento sutil, luz cálida — como pasar de una infografía a un objeto sensorial.

Tres conceptos que ya bocetamos (puedes adoptar uno, hibridar, o proponer algo radicalmente distinto):

**A. Disco extruido.** Las 11 categorías como cuñas extruidas hacia arriba con altura proporcional a la densidad de notas. Idle: rotación lenta. Hover sobre cuña: pausa rotación, se eleva, su color se satura. Click: la ficha del descriptor emerge como tarjeta flotante 3D enfrente del disco.

**B. Dome orbital.** La rueda envuelta sobre una semiesfera. Categorías como gajos meridianos. Las notas son pins luminosos sobre la superficie. La cámara orbita libre. Metáfora: "el mundo aromático mexicano". Útil si quieres factor *wow* tipo Globo Apple.

**D. Tarjetas flotantes.** 11 órbitas concéntricas, una por categoría. Cada nota es una tarjeta 3D pequeña que levita en su órbita. Velocidades alternas, sentidos opuestos. Click pausa órbita, levita tarjeta hacia adelante. Más rebelde, menos jerárquico — sistema planetario aromático.

Mi favorito narrativo es **A** porque preserva la pedagogía de la rueda mientras suma depth. Pero **propón lo que tú harías si tuvieras que ganar un premio de diseño con esto.** No tengas miedo de subvertir la metáfora — pero si la subviertes, defiende por qué.

## Lo que debe funcionar al final

- 3D real (Three.js / R3F), no fake-3D-CSS.
- Idle motion sutil (rotación, levitación, partículas).
- Hover: feedback visual claro, no toy-ish.
- Click en categoría/nota: abre **ficha del descriptor**. La ficha muestra: nombre, nombre náhuatl si aplica, etimología, etiquetas de geografía (chips), referencia material, intensidades (si hay).
- Cierre de ficha sin trauma (esc o click afuera).
- Tipografía: Cormorant Garamond + Inter, vía Google Fonts.
- Paleta: la de arriba, no toques los HEX.
- Iluminación: cálida key, rim fría sutil, ambient bajo. ACES tone mapping.
- Postprocesamiento: Bloom muy moderado en acentos, Vignette sutil. **No** chromatic aberration (no es videojuego).
- Mobile/touch: aceptable, no perfecto (este componente es para presentación en pantalla grande primero).
- Performance: 60 fps en una MacBook Pro M-series. Si necesitas reducir geometría, reduce.

## Microcopy obligatorio

- Título: *"Rueda de Sabor del Café Mexicano"*
- Subtítulo: *"Almanegra · prototipo 3D · v0.1"*
- Botones: *cerrar*, *limpiar*, *buscar*, *imprimir*. (Verbos en infinitivo lowercase, sin íconos preferiblemente.)
- Para notas sin etimología: *"calibración pendiente con productores"*. No *"data missing"*.
- Si hay tooltip, microcopy elegante: *"toca una categoría para entrar"*, no *"click here"*.

## Lo que NO quiero ver

- Cubos genéricos, esferas obvias, tres.js demo. Pensamos como objeto sensorial, no como tech demo.
- Botones azul Tailwind sin tematizar.
- Inglés en cualquier parte visible.
- Animaciones nerviosas o easings bouncy/elastic. Aquí todo es slow, smooth, intencional. *In-out cubic* máximo.
- Confeti, glitch, neon, vapor wave. No es eso.

## Cómo proponer

Diseña libre. Cuando muestres el prototipo, explica en 3-5 frases:
1. Qué metáfora elegiste y por qué.
2. Qué hiciste con la iluminación / materiales / movimiento para que se sintiera objeto y no infografía.
3. Una decisión donde te apartaste del brief (si la hubo) y por qué.

Después, espera mi feedback para iterar.

---

## Dataset completo

```json
[DATASET — ver `src/data/rueda.ts` en este repo, copiar el array exportado y convertir a JSON; o pídeme el archivo y lo pego aquí literal.]
```

(Cuando uses este brief, sustituye este bloque por el contenido del archivo `src/data/rueda.ts` convertido a JSON.)
