// Paleta cálida mexicana — Almanegra Café
// Mapea las 11 categorías de la rueda a colores con identidad propia.
// HEX en sRGB; convertir a linear en R3F via Color(x).convertSRGBToLinear().

export const palette = {
  bg: "#14100a",
  surface: "#1c130c",
  ink: "#f5ede0",
  inkDim: "#a39281",
  accent: "#d9a324",
} as const;

export const categoryColors: Record<string, string> = {
  "Frutal mexicano":   "#d94a2a", // rojo tezontle
  "Floral mexicano":   "#c93f7a", // rosa cempasúchil
  "Herbal y verde":    "#5c8a3a", // verde nopal
  "Maíz y masa":       "#d9a324", // amarillo elote
  "Dulce tradicional": "#e0931d", // ámbar piloncillo
  "Panadería":         "#c08a4f", // crema horno
  "Nuez y semilla":    "#8a5a35", // marrón pecana
  "Cacao y chocolate": "#5e3a22", // cacao oscuro
  "Ahumado y resinoso":"#6e5848", // gris copal
  "Especias":          "#c87024", // naranja canela
  "Chiles secos":      "#9c2a20", // rojo profundo
};

export const categoryOrder: string[] = [
  "Frutal mexicano",
  "Floral mexicano",
  "Herbal y verde",
  "Maíz y masa",
  "Dulce tradicional",
  "Panadería",
  "Nuez y semilla",
  "Cacao y chocolate",
  "Ahumado y resinoso",
  "Especias",
  "Chiles secos",
];
