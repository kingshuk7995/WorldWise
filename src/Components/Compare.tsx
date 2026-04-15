import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../Store";
import { Theme } from "../Store/themeSlice";
import { motion } from "framer-motion";
import { Scale, Users, Maximize, ArrowRightLeft } from "lucide-react";

interface Country {
  name: { common: string };
  flags: { svg: string };
  region: string;
  population: number;
  area: number;
  currencies?: { [key: string]: { name: string } };
  languages?: { [key: string]: string };
}

export default function ComparePage() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const isDark = theme === Theme.Dark;
  const [countries, setCountries] = useState<Country[]>([]);
  const [country1, setCountry1] = useState<string>("China");
  const [country2, setCountry2] = useState<string>("India");
  const [data1, setData1] = useState<Country | null>(null);
  const [data2, setData2] = useState<Country | null>(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) =>
        setCountries(
          data.sort((a: Country, b: Country) =>
            a.name.common.localeCompare(b.name.common)
          )
        )
      );
  }, []);

  useEffect(() => {
    if (countries.length > 0) {
      setData1(countries.find((c) => c.name.common === country1) || null);
      setData2(countries.find((c) => c.name.common === country2) || null);
    }
  }, [country1, country2, countries]);

  const maxPopulation = Math.max(data1?.population || 0, data2?.population || 0);
  const maxArea = Math.max(data1?.area || 0, data2?.area || 0);

  return (
    <div className={`min-h-screen px-6 py-12 transition-colors duration-500 ${isDark ? "bg-gray-950 text-gray-100" : "bg-[#f8fafc] text-slate-900"}`}>
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Compare <span className={isDark ? "text-emerald-400" : "text-emerald-600"}>Nations</span>
          </h1>
          <p className="text-lg opacity-70">Analyze key metrics side-by-side.</p>
        </div>

        {/* Selection Area */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-16 relative z-10 w-full max-w-4xl mx-auto">
          <div className="w-full md:w-2/5">
            <select
              value={country1}
              onChange={(e) => setCountry1(e.target.value)}
              className={`w-full p-4 rounded-2xl shadow-lg border text-lg focus:outline-none transition-all cursor-pointer ${
                isDark ? "bg-gray-900/80 border-gray-700 text-white" : "bg-white/80 border-gray-200 text-black"
              }`}
            >
              {countries.map((c) => (
                <option key={c.name.common} value={c.name.common}>{c.name.common}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white shadow-lg mx-4 flex-shrink-0 z-20">
            <ArrowRightLeft className="w-6 h-6" />
          </div>

          <div className="w-full md:w-2/5">
            <select
              value={country2}
              onChange={(e) => setCountry2(e.target.value)}
              className={`w-full p-4 rounded-2xl shadow-lg border text-lg focus:outline-none transition-all cursor-pointer ${
                isDark ? "bg-gray-900/80 border-gray-700 text-white" : "bg-white/80 border-gray-200 text-black"
              }`}
            >
              {countries.map((c) => (
                <option key={c.name.common} value={c.name.common}>{c.name.common}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Dashboard */}
        {data1 && data2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Country Cards */}
            <div className={`p-8 rounded-3xl border shadow-xl flex flex-col items-center text-center backdrop-blur-xl ${isDark ? "bg-gray-900/60 border-gray-800" : "bg-white/80 border-gray-100"}`}>
              <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} src={data1.flags.svg} alt={data1.name.common} className="h-40 w-auto rounded-xl shadow-md mb-6 object-cover border border-black/10" />
              <h2 className="text-4xl font-bold mb-4">{data1.name.common}</h2>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>{data1.region}</span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                  {data1.currencies ? Object.values(data1.currencies)[0]?.name : "No Currency"}
                </span>
              </div>
            </div>

            <div className={`p-8 rounded-3xl border shadow-xl flex flex-col items-center text-center backdrop-blur-xl ${isDark ? "bg-gray-900/60 border-gray-800" : "bg-white/80 border-gray-100"}`}>
              <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} src={data2.flags.svg} alt={data2.name.common} className="h-40 w-auto rounded-xl shadow-md mb-6 object-cover border border-black/10" />
              <h2 className="text-4xl font-bold mb-4">{data2.name.common}</h2>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>{data2.region}</span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                  {data2.currencies ? Object.values(data2.currencies)[0]?.name : "No Currency"}
                </span>
              </div>
            </div>

            {/* Visual Comparisons: Span 2 cols */}
            <div className={`md:col-span-2 p-8 md:p-12 rounded-3xl shadow-xl border backdrop-blur-xl ${isDark ? "bg-gray-900/60 border-gray-800" : "bg-white/80 border-gray-100"} space-y-12`}>
              
              {/* Population Comparison */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl"><Users /></div>
                  <h3 className="text-2xl font-bold">Population</h3>
                </div>
                
                <div className="space-y-6 relative">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-lg">{data1.name.common}</span>
                      <span className="font-mono text-lg">{data1.population.toLocaleString()}</span>
                    </div>
                    <div className={`h-4 w-full rounded-full overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-200"}`}>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${maxPopulation === 0 ? 0 : (data1.population / maxPopulation) * 100}%` }} 
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-blue-500 rounded-full" 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-lg">{data2.name.common}</span>
                      <span className="font-mono text-lg">{data2.population.toLocaleString()}</span>
                    </div>
                    <div className={`h-4 w-full rounded-full overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-200"}`}>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${maxPopulation === 0 ? 0 : (data2.population / maxPopulation) * 100}%` }} 
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-emerald-500 rounded-full" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Area Comparison */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-500/20 text-purple-500 rounded-xl"><Maximize /></div>
                  <h3 className="text-2xl font-bold">Land Area (km²)</h3>
                </div>
                
                <div className="space-y-6 relative">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-lg">{data1.name.common}</span>
                      <span className="font-mono text-lg">{data1.area.toLocaleString()}</span>
                    </div>
                    <div className={`h-4 w-full rounded-full overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-200"}`}>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${maxArea === 0 ? 0 : (data1.area / maxArea) * 100}%` }} 
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-purple-500 rounded-full" 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-lg">{data2.name.common}</span>
                      <span className="font-mono text-lg">{data2.area.toLocaleString()}</span>
                    </div>
                    <div className={`h-4 w-full rounded-full overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-200"}`}>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${maxArea === 0 ? 0 : (data2.area / maxArea) * 100}%` }} 
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-amber-500 rounded-full" 
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
