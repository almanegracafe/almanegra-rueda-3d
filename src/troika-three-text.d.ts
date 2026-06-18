// Declaración mínima — troika-three-text no embarca .d.ts.
// Solo nombramos lo que usamos aquí (preloadFont) para que TypeScript
// no marque el import como any implícito.
declare module "troika-three-text" {
  export function preloadFont(
    options: {
      font?: string;
      characters?: string;
      sdfGlyphSize?: number;
    },
    callback?: () => void,
  ): void;
}
