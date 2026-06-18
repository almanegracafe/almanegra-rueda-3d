import DiscoExtruido from "./bocetos/DiscoExtruido";

export default function App() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#14100a] text-[#f5ede0]">
      <DiscoExtruido />

      <div className="pointer-events-none absolute left-6 top-6 z-10 select-none">
        <h1 className="serif text-[22px] leading-none tracking-tight">
          Rueda de Sabor del Café Mexicano
        </h1>
        <p className="mt-1 text-[11px] tracking-[0.18em] text-[#a39281] uppercase">
          Almanegra · v0.1
        </p>
      </div>
    </div>
  );
}
