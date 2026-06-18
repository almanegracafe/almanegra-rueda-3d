// Datos derivados del léxico consolidado en
// /home/tacvbo/CLAUDE/ALMANEGRA-FILOSOFIA/lexico-rueda-mexicana.md
// y de la rueda D3 actual (rueda_sabor_cafe_mexicano_d3.html).
// Esta es la estructura que consumen los tres bocetos.
import type { RuedaData } from "../lib/types";
import { categoryColors } from "../lib/palette";

export const rueda: RuedaData = {
  categorias: [
    {
      name: "Frutal mexicano",
      color: categoryColors["Frutal mexicano"],
      subcategorias: [
        {
          name: "Tropical",
          notas: [
            { name: "Mango" },
            { name: "Piña" },
            { name: "Papaya" },
            { name: "Plátano" },
            { name: "Mamey" },
            { name: "Chicozapote" },
            { name: "Pitahaya" },
          ],
        },
        {
          name: "Cítrico ácido",
          notas: [
            { name: "Tamarindo" },
            { name: "Naranja agria" },
            { name: "Lima" },
            { name: "Toronja" },
            { name: "Limón verde" },
          ],
        },
        {
          name: "Frutal dulce",
          notas: [
            { name: "Guayaba" },
            { name: "Tejocote" },
            { name: "Zapote negro" },
            {
              name: "Capulín",
              nameNah: "Capolcuahuitl",
              etymology: "Náhuatl: capolcuahuitl, 'árbol de capulín'.",
              geography: ["Edomex", "Puebla", "Veracruz", "CDMX", "Jalisco"],
              reference: "Fruto fresco mayo–julio. Mercados de la Merced y Jamaica (CDMX).",
              intensityAroma: 6,
              intensityFlavor: 7,
            },
            { name: "Granada" },
          ],
        },
        {
          name: "Criolla",
          notas: [
            { name: "Ciruela criolla" },
            { name: "Nanche" },
            { name: "Tuna" },
            { name: "Xoconostle" },
          ],
        },
      ],
    },
    {
      name: "Floral mexicano",
      color: categoryColors["Floral mexicano"],
      subcategorias: [
        {
          name: "Flores rituales",
          notas: [
            {
              name: "Cempasúchil",
              nameNah: "Cempōhualxōchitl",
              etymology: "Náhuatl: cempōhualli (veinte) + xōchitl (flor).",
              geography: ["Puebla", "Edomex", "Oaxaca", "Michoacán", "CDMX"],
              reference: "Flor fresca oct–nov. Mercado de Sonora (CDMX).",
              intensityAroma: 9,
            },
            { name: "Jamaica" },
            { name: "Bugambilia" },
            { name: "Rosa Castilla" },
          ],
        },
        {
          name: "Azahares",
          notas: [
            { name: "Azahar" },
            { name: "Jazmín" },
            { name: "Magnolia" },
            { name: "Hierba dulce" },
          ],
        },
        {
          name: "Resinoso floral",
          notas: [
            { name: "Copal blanco" },
            { name: "Palo santo" },
            { name: "Vainilla flor" },
          ],
        },
      ],
    },
    {
      name: "Herbal y verde",
      color: categoryColors["Herbal y verde"],
      subcategorias: [
        {
          name: "Hojas aromáticas",
          notas: [
            { name: "Hoja santa" },
            { name: "Hoja aguacate" },
            { name: "Epazote" },
            { name: "Pápalo" },
          ],
        },
        {
          name: "Verde fresco",
          notas: [
            { name: "Hierbabuena" },
            { name: "Yerbabuena" },
            { name: "Té limón" },
          ],
        },
        {
          name: "Verde crudo",
          notas: [
            { name: "Nopal" },
            { name: "Verdolaga" },
            { name: "Quintonil" },
            { name: "Cáscara verde" },
          ],
        },
      ],
    },
    {
      name: "Maíz y masa",
      color: categoryColors["Maíz y masa"],
      subcategorias: [
        {
          name: "Masa nixtamal",
          notas: [
            { name: "Tortilla" },
            { name: "Masa cruda" },
            { name: "Totopo dorado" },
            { name: "Comal limpio" },
          ],
        },
        {
          name: "Atoles",
          notas: [
            { name: "Atole blanco" },
            { name: "Atole granillo" },
            { name: "Champurrado" },
            { name: "Pinole" },
            { name: "Tejate" },
          ],
        },
        {
          name: "Elote",
          notas: [
            { name: "Elote tierno" },
            { name: "Esquite" },
            { name: "Hoja de elote" },
          ],
        },
        {
          name: "Fermentados",
          notas: [
            { name: "Pozol" },
            { name: "Tejuino" },
            { name: "Tepache" },
          ],
        },
      ],
    },
    {
      name: "Dulce tradicional",
      color: categoryColors["Dulce tradicional"],
      subcategorias: [
        {
          name: "Azúcares cocidos",
          notas: [
            { name: "Piloncillo" },
            { name: "Panela" },
            { name: "Melaza" },
            { name: "Azúcar quemada" },
          ],
        },
        {
          name: "Dulces de leche",
          notas: [
            { name: "Cajeta" },
            { name: "Dulce de leche" },
            { name: "Jamoncillo" },
            { name: "Glorias" },
          ],
        },
        {
          name: "Dulces secos",
          notas: [
            { name: "Ate" },
            { name: "Cocada" },
            { name: "Alfeñique" },
            { name: "Chongos" },
          ],
        },
        {
          name: "Mieles",
          notas: [
            { name: "Miel melipona" },
            { name: "Miel de agave" },
            { name: "Miel mezquite" },
          ],
        },
      ],
    },
    {
      name: "Panadería",
      color: categoryColors["Panadería"],
      subcategorias: [
        {
          name: "Pan dulce",
          notas: [
            { name: "Concha" },
            { name: "Pan de yema" },
            { name: "Mantecada" },
            { name: "Oreja" },
          ],
        },
        {
          name: "Galletería",
          notas: [{ name: "Polvorón" }, { name: "Marranito" }, { name: "Picón" }],
        },
        {
          name: "Horneado",
          notas: [
            { name: "Trigo dulce" },
            { name: "Levadura" },
            { name: "Mantequilla" },
          ],
        },
      ],
    },
    {
      name: "Nuez y semilla",
      color: categoryColors["Nuez y semilla"],
      subcategorias: [
        {
          name: "Nueces",
          notas: [
            { name: "Nuez pecana" },
            { name: "Nuez Castilla" },
            { name: "Avellana" },
            { name: "Almendra" },
          ],
        },
        {
          name: "Semillas",
          notas: [
            { name: "Ajonjolí" },
            { name: "Pepita" },
            { name: "Cacahuate" },
            { name: "Piñón rosa" },
          ],
        },
        {
          name: "Praliné",
          notas: [
            { name: "Garapiñado" },
            { name: "Mazapán" },
            { name: "Palanqueta" },
          ],
        },
      ],
    },
    {
      name: "Cacao y chocolate",
      color: categoryColors["Cacao y chocolate"],
      subcategorias: [
        {
          name: "Chocolate",
          notas: [
            { name: "Chocolate de mesa" },
            { name: "Chocolate amargo" },
            { name: "Cocoa" },
            { name: "Mole dulce" },
          ],
        },
        {
          name: "Cacao puro",
          notas: [
            { name: "Cacao criollo" },
            { name: "Cacao fermentado" },
            { name: "Cacao tostado" },
          ],
        },
        {
          name: "Tostado seco",
          notas: [
            { name: "Maíz tostado" },
            { name: "Pan tostado" },
            { name: "Nuez tostada" },
          ],
        },
      ],
    },
    {
      name: "Ahumado y resinoso",
      color: categoryColors["Ahumado y resinoso"],
      subcategorias: [
        {
          name: "Humo de leña",
          notas: [
            { name: "Leña de encino" },
            { name: "Comal ahumado" },
            { name: "Brasa" },
          ],
        },
        {
          name: "Resinas",
          notas: [{ name: "Copal seco" }, { name: "Ocote" }, { name: "Breña" }],
        },
        {
          name: "Mineral",
          notas: [
            { name: "Tierra mojada" },
            { name: "Piedra comal" },
            { name: "Arcilla cocida" },
          ],
        },
      ],
    },
    {
      name: "Especias",
      color: categoryColors["Especias"],
      subcategorias: [
        {
          name: "Dulces",
          notas: [{ name: "Canela" }, { name: "Vainilla Papantla" }, { name: "Anís" }],
        },
        {
          name: "Cálidas",
          notas: [
            { name: "Clavo" },
            { name: "Pimienta gorda" },
            { name: "Pimienta Tabasco" },
            { name: "Nuez moscada" },
          ],
        },
        {
          name: "Terrosas",
          notas: [{ name: "Achiote" }, { name: "Comino" }, { name: "Cilantro" }],
        },
      ],
    },
    {
      name: "Chiles secos",
      color: categoryColors["Chiles secos"],
      subcategorias: [
        {
          name: "Dulces",
          notas: [{ name: "Ancho" }, { name: "Mulato" }, { name: "Pasilla" }],
        },
        {
          name: "Frutales",
          notas: [{ name: "Guajillo" }, { name: "Costeño" }, { name: "Cascabel" }],
        },
        {
          name: "Ahumados",
          notas: [{ name: "Chipotle" }, { name: "Morita" }, { name: "Pasilla mixe" }],
        },
      ],
    },
  ],
};
