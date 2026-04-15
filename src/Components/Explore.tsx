import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { type RootState } from "../Store";
import { Theme } from "../Store/themeSlice";
import { Search, MapPin, Users, Globe2, Network, ExternalLink } from "lucide-react";

type Country = {
  name: { common: string; official: string };
  flags: { png: string; svg: string };
  capital: string[];
  population: number;
  region: string;
  subregion: string;
  languages: Record<string, string>;
  borders: string[];
  maps: { googleMaps: string };
};

export default function ExplorePage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selected, setSelected] = useState<string>("India");
  const [country, setCountry] = useState<Country | null>(null);
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const theme = useSelector((state: RootState) => state.theme.theme);
  const isDark = theme === Theme.Dark;

  // Fetch all countries for the autocomplete
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((res) => {
      const sorted = res.data.sort((a: Country, b: Country) =>
        a.name.common.localeCompare(b.name.common)
      );
      setCountries(sorted);
    });
  }, []);

  // Fetch specific country
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://restcountries.com/v3.1/name/${selected}?fullText=true`)
      .then((res) => {
        setCountry(res.data[0]);
        setLoading(false);
      })
      .catch(() => {
        setCountry(null);
        setLoading(false);
      });
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.name.common.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`min-h-screen px-6 py-12 transition-colors duration-500 ${isDark ? "bg-gray-950 text-gray-100" : "bg-[#f8fafc] text-slate-900"}`}>
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Explore the <span className={isDark ? "text-blue-400" : "text-blue-600"}>World</span>
          </h1>
          <p className="text-lg opacity-70">Search for any country to reveal its details.</p>
        </div>

        {/* Autocomplete Search */}
        <div className="max-w-xl mx-auto mb-16 relative z-30" ref={dropdownRef}>
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
            <input
              type="text"
              placeholder="Search country..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl shadow-lg border text-lg focus:outline-none transition-all ${
                isDark
                  ? "bg-gray-900/80 border-gray-700 focus:border-blue-500 text-white placeholder-gray-500 backdrop-blur-xl"
                  : "bg-white/80 border-gray-200 focus:border-blue-500 text-black placeholder-gray-400 backdrop-blur-xl"
              }`}
            />
          </div>

          <AnimatePresence>
            {isDropdownOpen && query.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute mt-2 w-full rounded-2xl shadow-2xl border max-h-72 overflow-y-auto overflow-x-hidden backdrop-blur-2xl ${
                  isDark ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-gray-200"
                }`}
              >
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => (
                    <button
                      key={c.name.common}
                      onClick={() => {
                        setSelected(c.name.common);
                        setQuery("");
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-6 py-3 flex items-center gap-3 transition-colors ${
                        isDark ? "hover:bg-blue-600/20" : "hover:bg-blue-50"
                      }`}
                    >
                      <img src={c.flags.svg} alt={c.name.common} className="w-8 h-5 object-cover rounded shadow-sm" />
                      {c.name.common}
                    </button>
                  ))
                ) : (
                  <div className="px-6 py-4 opacity-50">No countries found</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bento Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="relative flex h-10 w-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-10 w-10 bg-blue-500"></span>
            </span>
          </div>
        ) : country ? (
          <motion.div
            key={country.name.common}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Main Identity Card */}
            <div className={`md:col-span-2 p-8 rounded-3xl border shadow-sm flex flex-col sm:flex-row items-center gap-8 ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-100"}`}>
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                src={country.flags.svg}
                alt={country.name.common}
                className="w-48 sm:w-64 rounded-xl shadow-md border border-black/10"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-4xl sm:text-5xl font-bold mb-2">{country.name.common}</h2>
                <h3 className="text-xl opacity-70 mb-4">{country.name.official}</h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                  <div className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                    <MapPin className="w-4 h-4 text-red-500" />
                    {country.capital?.[0] || "No Capital"}
                  </div>
                  <a
                    href={country.maps.googleMaps}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full font-medium flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 transition shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" /> Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Geography & Region */}
            <div className={`p-8 rounded-3xl border shadow-sm flex flex-col justify-center ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-100"}`}>
              <Globe2 className="w-8 h-8 text-emerald-500 mb-4" />
              <p className="text-sm opacity-60 font-semibold uppercase tracking-wider mb-1">Region</p>
              <h4 className="text-2xl font-bold mb-1">{country.region}</h4>
              <p className="text-lg opacity-80">{country.subregion}</p>
            </div>

            {/* Population */}
            <div className={`p-8 rounded-3xl border shadow-sm ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-100"}`}>
              <Users className="w-8 h-8 text-blue-500 mb-4" />
              <p className="text-sm opacity-60 font-semibold uppercase tracking-wider mb-1">Population</p>
              <h4 className="text-3xl font-bold">{country.population.toLocaleString()}</h4>
            </div>

            {/* Languages */}
            <div className={`p-8 rounded-3xl border shadow-sm ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-100"}`}>
              <p className="text-sm opacity-60 font-semibold uppercase tracking-wider mb-4">Languages</p>
              <div className="flex flex-wrap gap-2">
                {country.languages ? (
                  Object.values(country.languages).map((lang) => (
                    <span key={lang} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${isDark ? "bg-gray-800 text-gray-200" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="opacity-50">None</span>
                )}
              </div>
            </div>

            {/* Borders */}
            <div className={`p-8 rounded-3xl border shadow-sm ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-100"}`}>
              <Network className="w-8 h-8 text-purple-500 mb-4" />
              <p className="text-sm opacity-60 font-semibold uppercase tracking-wider mb-4">Borders</p>
              <div className="flex flex-wrap gap-2">
                {country.borders && country.borders.length > 0 ? (
                  country.borders.map((border) => (
                    <span key={border} className={`px-3 py-1 text-sm font-mono font-medium rounded border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"}`}>
                      {border}
                    </span>
                  ))
                ) : (
                  <span className="opacity-50 italic">Island or Isolated</span>
                )}
              </div>
            </div>

          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
