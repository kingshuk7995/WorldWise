import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { type RootState } from '../Store';
import { Theme } from '../Store/themeSlice';

const features = [
  {
    title: "🌐 Country Data",
    description: "Access GDP, population, borders, languages, and more. All live and visual.",
    image: "/images/country-data.jpg",
  },
  {
    title: "🧠 Interactive Quizzes",
    description: "Test your knowledge of flags, capitals, and borders with gamified quizzes.",
    image: "/images/quiz.jpg",
  },
  {
    title: "⚖️ Compare Countries",
    description: "Visually compare countries across economy, geography, and culture.",
    image: "/images/compare.jpg",
  },
];

export default function HomePage() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const isDark = theme === Theme.Dark;

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section
        className={`min-h-[70vh] flex flex-col items-center justify-center px-6 text-center ${
          isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-100 to-white'
        }`}
      >
        <h1
          className={`text-5xl font-extrabold mb-4 tracking-wide ${
            isDark ? 'text-yellow-300 drop-shadow-lg' : 'text-blue-700'
          }`}
        >
          Discover the World, Smarter.
        </h1>
        <p className={`text-xl max-w-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          🌍 Explore countries, 📊 compare stats, and 🧠 challenge your knowledge — all in one place.
        </p>
        <div className="flex gap-4 mt-8">
          <a
            href="/explore"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 shadow-md transition"
          >
            Start Exploring
          </a>
          <a
            href="/quiz"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl text-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition"
          >
            Take a Quiz
          </a>
        </div>
      </section>

      {/* Feature Sections */}
      {features.map((feature, idx) => (
        <motion.section
          key={idx}
          className="min-h-[100vh] snap-start relative bg-cover bg-center bg-no-repeat flex items-center justify-center px-6"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${feature.image}')`,
          }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: idx * 0.2 }}
        >
          <div className="text-center text-white max-w-2xl px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">{feature.title}</h2>
            <p className="text-xl md:text-2xl text-gray-200 font-light drop-shadow-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        </motion.section>
      ))}

      {/* Footer */}
      <section className="text-center py-10 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900">
        Built with ❤️ using React, Vite, Tailwind, and Framer Motion.
      </section>
    </main>
  );
}
