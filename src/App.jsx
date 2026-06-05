import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import "./index.css";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("lucario");
  const [escuadron, setEscuadron] = useState([]);

  const agregarAlEscuadron = () => {
  if (escuadron.length >= 6) {
    alert("Tu escuadrón ya está lleno! Máximo 6 integrantes.");
    return;
  }
  setEscuadron([...escuadron, pokemonData]);
  };

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
      .then((response) => response.json())
      .then((pokemon) => {
        setPokemonData({
          name: pokemon.name,
          image: pokemon.sprites.other['official-artwork'].front_default,
          types: pokemon.types,
          stats: pokemon.stats
        });
        setIsLoading(false); 
      })
      .catch((error) => console.error("Error al cargar la API:", error));
  }, [query]);

  if (isLoading) {
    return <div>Cargando datos de la PokéAPI...</div>;
  }

  const obtenerDatosGrafico = () => {
    // Si no hay nadie, devolvemos un arreglo vacío
    if (escuadron.length === 0) return [];

    let totales = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

    // Sumamos las estadísticas de cada integrante
    escuadron.forEach(pkm => {
      totales.hp += pkm.stats[0].base_stat;
      totales.atk += pkm.stats[1].base_stat;
      totales.def += pkm.stats[2].base_stat;
      totales.spa += pkm.stats[3].base_stat;
      totales.spd += pkm.stats[4].base_stat;
      totales.spe += pkm.stats[5].base_stat;
    });

    // Formateamos los datos para Recharts
    return [
      { stat: 'HP', valor: totales.hp },
      { stat: 'Ataque', valor: totales.atk },
      { stat: 'Defensa', valor: totales.def },
      { stat: 'Velocidad', valor: totales.spe },
      { stat: 'Def. Esp.', valor: totales.spd },
      { stat: 'Atq. Esp.', valor: totales.spa },
    ];
  };

  return (
    <>
    <div className="flex justify-center gap-2 mt-10">
        <input 
          type="search" 
          value={searchInput} 
          onChange={(e) => setSearchInput(e.target.value.toLowerCase())}
          className="px-4 py-2 rounded-lg text-black"
          placeholder="Ej. charizard"
        />
        <button 
          onClick={() => setQuery(searchInput)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold"
        >
          Buscar
        </button>
    </div>

    <div className="bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm mx-auto text-white text-center mt-10">
      <h1 style={{ textTransform: 'capitalize' }}>{pokemonData.name}</h1>
      <img src={pokemonData.image} alt={`Imagen de ${pokemonData.name}`} width="250" />

      <div className="types-container">
        <h3>Tipos:</h3>
        <ul className="flex justify-center gap-2 mb-4">
          {pokemonData.types.map((item, index) => (
            <li key={index} className="capitalize bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
              {item.type.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="stats-container">
        <h3>Estadísticas Base:</h3>
        <ul>
          {pokemonData.stats.map((item, index) => (
            <li key={index} className="flex justify-between border-b border-white/10 py-1">
              <strong style={{ textTransform: 'capitalize' }}>{item.stat.name}:</strong> {item.base_stat}
            </li>
          ))}
        </ul>
      </div>
      <button 
      onClick={agregarAlEscuadron}
      className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-bold transition-colors"
      >
      Agregar al Escuadrón
      </button>
      </div>
      <div className="max-w-4xl mx-auto mt-12 w-full">
      <h2 className="text-2xl font-bold text-white text-center mb-6">Tu Escuadrón ({escuadron.length}/6)</h2>
  
  {/* CSS Grid para ponerlos en columnas */}
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {escuadron.map((miembro, index) => (
      <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center shadow-lg">
        <img src={miembro.image} alt={miembro.name} className="w-24 h-24 object-contain" />
        <h3 className="capitalize text-white font-bold mt-2">{miembro.name}</h3>
      </div>
    ))}
  </div>
  </div>
  {/* SECCIÓN DEL GRÁFICO (Solo visible si hay escuadrón) */}
{escuadron.length > 0 && (
  <div className="max-w-xl mx-auto mt-12 bg-slate-800 p-6 rounded-2xl shadow-xl w-full">
    <h2 className="text-2xl font-bold text-white text-center mb-4">Sinergia del Equipo</h2>
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={obtenerDatosGrafico()}>
          {/* La red de fondo */}
          <PolarGrid stroke="#475569" />
          {/* Los nombres de los vértices */}
          <PolarAngleAxis dataKey="stat" tick={{ fill: '#e2e8f0', fontSize: 14, fontWeight: 'bold' }} />
          {/* Ocultamos los números del radio para un look más limpio */}
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} opacity={0} />
          {/* El polígono de color */}
          <Radar name="Equipo" dataKey="valor" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  </div>
)}
    </>
  );
}