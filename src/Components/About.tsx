import { useSelector } from "react-redux";
import { type RootState } from "../Store";
import { Theme } from "../Store/themeSlice";
import { motion } from "framer-motion";

export default function AboutPage() {
  const theme = useSelector((state: RootState) => state.theme.theme);

  return (
    <div
      className={`min-h-screen px-6 py-12 transition-colors duration-300 ${
        theme === Theme.Dark
          ? "bg-gray-900 text-gray-100"
          : "bg-blue-50 text-gray-900"
      }`}
    >
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-6 text-blue-700 dark:text-yellow-300 text-center">
          📘 About WorldWise
        </h1>

        <p className="text-lg leading-relaxed mb-4">
          <strong>WorldWise</strong> is a modern web application that helps you explore the world
          in a smart and interactive way. From comparing countries and discovering geographic facts,
          to testing your knowledge with fun quizzes — it's a one-stop hub for curious minds 🌍.
        </p>

        <p className="text-lg leading-relaxed mb-4">
          The app uses real-time data from the{" "}
          <a
            href="https://restcountries.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 dark:text-yellow-400"
          >
            REST Countries API
          </a>
          , ensuring that you're always exploring the most up-to-date information.
        </p>

        <p className="text-lg leading-relaxed mb-4">
          Built with 💻 <strong>React</strong>, styled using <strong>TailwindCSS</strong>, animated via <strong>Framer Motion</strong>, and designed with performance and aesthetics in mind.
        </p>

        <p className="text-lg leading-relaxed mb-8">
          Developed with ❤️ by a passionate dev — blending code, curiosity, and creativity.
        </p>

        <div className="text-center">
          <span className="inline-block px-4 py-2 bg-blue-600 text-white dark:bg-yellow-400 dark:text-black rounded-full shadow">
            Keep exploring. Stay curious. Be WorldWise.
          </span>
        </div>
      </motion.div>
    </div>
  );
}
