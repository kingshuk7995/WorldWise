import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { type RootState } from '../Store';
import { Theme } from '../Store/themeSlice';
import { Link } from 'react-router-dom';
import { Globe, Map, Target, ArrowRight } from 'lucide-react';

const features = [
  {
    title: "Country Data Insights",
    description: "Dive deep into GDP, population trends, borders, and spoken languages.",
    icon: <Globe className="w-10 h-10 text-blue-500" />,
    link: "/explore",
    color: "bg-blue-500/10 border-blue-500/20",
    delay: 0.1,
  },
  {
    title: "Interactive Geography",
    description: "Visually compare countries across economy, size, and demographics.",
    icon: <Map className="w-10 h-10 text-emerald-500" />,
    link: "/compare",
    color: "bg-emerald-500/10 border-emerald-500/20",
    delay: 0.2,
  },
  {
    title: "Knowledge Challenges",
    description: "Test your wits with dynamic quizzes on capitals, flags, and more.",
    icon: <Target className="w-10 h-10 text-yellow-500" />,
    link: "/quiz",
    color: "bg-yellow-500/10 border-yellow-500/20",
    delay: 0.3,
  },
];

export default function HomePage() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const isDark = theme === Theme.Dark;

  return (
    <main className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gray-950 text-gray-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white/5 border-gray-300/30 backdrop-blur-md shadow-sm"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <span className="text-sm font-medium">Live Global Data API</span>
        </motion.div>

        <motion.h1 
          className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          Discover the World, <br />
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-blue-400 to-emerald-400' : 'from-blue-600 to-emerald-600'}`}>
            Smarter.
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl max-w-2xl font-light mb-12 opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          An immersive platform to explore nations, compare vital statistics, and challenge your geographical knowledge.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            to="/explore"
            className={`group flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${
              isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Start Exploring <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/quiz"
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold border transition-all hover:-translate-y-1 ${
              isDark ? 'border-gray-700 bg-gray-900/50 hover:bg-gray-800' : 'border-gray-300 bg-white/50 hover:bg-white'
            } backdrop-blur-sm`}
          >
            Take a Quiz
          </Link>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 px-6 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ y: -5 }}
              className={`p-8 rounded-3xl border backdrop-blur-xl transition-all shadow-sm hover:shadow-md ${feature.color} ${isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white/60 border-gray-200'}`}
            >
              <div className="mb-6 p-4 rounded-2xl inline-block bg-white/50 dark:bg-black/20 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/5">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">{feature.title}</h3>
              <p className="opacity-75 leading-relaxed mb-6 font-medium">{feature.description}</p>
              <Link to={feature.link} className="inline-flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity">
                Explore <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      
    </main>
  );
}
