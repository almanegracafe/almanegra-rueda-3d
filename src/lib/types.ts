export interface Nota {
  name: string;
  nameNah?: string;
  etymology?: string;
  geography?: string[];
  reference?: string;
  intensityAroma?: number;
  intensityFlavor?: number;
}

export interface Subcategoria {
  name: string;
  notas: Nota[];
}

export interface Categoria {
  name: string;
  color: string;
  subcategorias: Subcategoria[];
}

export interface RuedaData {
  categorias: Categoria[];
}
