import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../Store";
import { Theme } from "../Store/themeSlice";
import { motion } from "framer-motion";

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
  const [countries, setCountries] = useState<Country[]>([]);
  const [country1, setCountry1] = useState<string>("");
  const [country2, setCountry2] = useState<string>("");
  const [data1, setData1] = useState<Country | null>(null);
  const [data2, setData2] = useState<Country | null>(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) =>
        setCountries(data.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common)
        ))
      );
  }, []);

  useEffect(() => {
    setData1(countries.find((c) => c.name.common === country1) || null);
    setData2(countries.find((c) => c.name.common === country2) || null);
  }, [country1, country2, countries]);

  const cardClass =
    "w-full md:w-[45%] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4";

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        theme === Theme.Dark ? "bg-gray-900 text-white" : "bg-blue-50 text-black"
      }`}
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-700 dark:text-yellow-300">
        ⚖️ Compare Countries
      </h1>

      {/* Select Dropdowns */}
      <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
        <select
          value={country1}
          onChange={(e) => setCountry1(e.target.value)}
          className="p-3 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="">Select First Country</option>
          {countries.map((c) => (
            <option key={c.name.common} value={c.name.common}>
              {c.name.common}
            </option>
          ))}
        </select>
        <select
          value={country2}
          onChange={(e) => setCountry2(e.target.value)}
          className="p-3 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="">Select Second Country</option>
          {countries.map((c) => (
            <option key={c.name.common} value={c.name.common}>
              {c.name.common}
            </option>
          ))}
        </select>
      </div>

      {/* Comparison Section */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
        {[data1, data2].map((country, idx) =>
          country ? (
            <motion.div
              key={idx}
              className={cardClass}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <img
                src={country.flags.svg}
                alt={`${country.name.common} flag`}
                className="w-32 h-20 object-contain mb-4 mx-auto"
              />
              <h2 className="text-2xl font-bold text-center mb-2">{country.name.common}</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Region:</strong> {country.region}
                </li>
                <li>
                  <strong>Population:</strong> {country.population.toLocaleString()}
                </li>
                <li>
                  <strong>Area:</strong> {country.area.toLocaleString()} km²
                </li>
                <li>
                  <strong>Currency:</strong>{" "}
                  {country.currencies
                    ? Object.values(country.currencies)
                        .map((c) => c.name)
                        .join(", ")
                    : "N/A"}
                </li>
                <li>
                  <strong>Languages:</strong>{" "}
                  {country.languages
                    ? Object.values(country.languages).join(", ")
                    : "N/A"}
                </li>
              </ul>
            </motion.div>
          ) : null
        )}
      </div>
    </div>
  );
}
