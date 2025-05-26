import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { type RootState } from "../Store";
import { Theme } from "../Store/themeSlice";

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

  const theme = useSelector((state: RootState) => state.theme.theme);
  const isDark = theme === Theme.Dark;

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((res) => {
      const sorted = res.data.sort((a: Country, b: Country) =>
        a.name.common.localeCompare(b.name.common)
      );
      setCountries(sorted);
    });
  }, []);

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/name/${selected}?fullText=true`)
      .then((res) => setCountry(res.data[0]))
      .catch(() => setCountry(null));
  }, [selected]);

  return (
    <div
      className={`min-h-screen px-6 py-10 transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-b from-blue-50 to-white text-gray-800"
      }`}
    >
      <h1
        className={`text-5xl font-extrabold text-center mb-12 tracking-tight ${
          isDark ? "text-yellow-300" : "text-blue-700"
        }`}
      >
        🌍 Explore Countries
      </h1>

      {/* Country Selector */}
      <div className="max-w-md mx-auto mb-12">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className={`w-full p-4 rounded-xl shadow-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border transition-all duration-300 ${
            isDark
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
        >
          {countries.map((c) => (
            <option key={c.name.common} value={c.name.common}>
              {c.name.common}
            </option>
          ))}
        </select>
      </div>

      {/* Country Data */}
      {country && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`max-w-5xl mx-auto rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-10 border transition-all duration-500 ${
            isDark
              ? "bg-gray-900 text-white border-gray-700"
              : "bg-white text-black border-gray-200"
          }`}
        >
          <div className="flex justify-center items-center">
            <img
              src={country.flags.svg}
              alt={country.name.common}
              className={`w-64 h-auto rounded-lg shadow-md border ${
                isDark ? "border-gray-600" : "border-gray-300"
              }`}
            />
          </div>

          <div>
            <h2
              className={`text-4xl font-bold mb-4 ${
                isDark ? "text-yellow-200" : "text-blue-800"
              }`}
            >
              {country.name.official}
            </h2>
            <ul className="space-y-3 text-lg leading-relaxed">
              <li>
                <strong className={isDark ? "text-yellow-300" : "text-blue-600"}>Capital:</strong> {country.capital?.[0] || "N/A"}
              </li>
              <li>
                <strong className={isDark ? "text-yellow-300" : "text-blue-600"}>Population:</strong> {country.population.toLocaleString()}
              </li>
              <li>
                <strong className={isDark ? "text-yellow-300" : "text-blue-600"}>Region:</strong> {country.region} ({country.subregion})
              </li>
              <li>
                <strong className={isDark ? "text-yellow-300" : "text-blue-600"}>Languages:</strong> {country.languages ? Object.values(country.languages).join(", ") : "N/A"}
              </li>
              <li>
                <strong className={isDark ? "text-yellow-300" : "text-blue-600"}>Borders:</strong> {country.borders ? country.borders.join(", ") : "None"}
              </li>
            </ul>
            <a
              href={country.maps.googleMaps}
              target="_blank"
              rel="noreferrer"
              className={`inline-block mt-6 underline transition text-lg ${
                isDark
                  ? "text-blue-400 hover:text-yellow-300"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              🌐 View on Google Maps
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
