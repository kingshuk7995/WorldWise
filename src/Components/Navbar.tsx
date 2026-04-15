import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { type RootState } from "../Store";
import { Theme, toggleTheme } from "../Store/themeSlice";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

function ToggleTheme() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);
  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      aria-label="Toggle theme"
      className="text-2xl transition-transform hover:scale-110"
    >
      {theme === Theme.Dark ? "🌙" : "☀️"}
    </button>
  );
}

export default function Navbar() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/explore", label: "Explore" },
    { to: "/compare", label: "Compare" },
    { to: "/quiz", label: "Quiz" },
    { to: "/about", label: "About" },
  ];

  const isDark = theme === Theme.Dark;

  return (
    <nav
      className={`sticky top-0 z-50 h-16 flex justify-between items-center px-6 transition-colors duration-300 ${
        isDark ? "glass-dark text-white" : "glass text-black"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold flex items-center gap-2 tracking-tight">
        <img src="/worldwise.svg" alt="WorldWise logo" className="w-8 h-8 drop-shadow-md" />
        WorldWise
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-2 text-md font-medium">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }: { isActive: boolean }) =>
              `relative px-4 py-2 rounded-full transition-all duration-300 ${
                isActive
                  ? isDark
                    ? "bg-yellow-400/20 text-yellow-300"
                    : "bg-blue-600/10 text-blue-700"
                  : "hover:bg-gray-500/10"
              }`
            }
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                {label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className={`absolute inset-0 rounded-full border border-b-2 ${
                      isDark ? "border-yellow-400/50" : "border-blue-600/50"
                    }`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
        <div className="ml-4 border-l pl-4 border-gray-400/30">
          <ToggleTheme />
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="md:hidden text-2xl transition hover:scale-105"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute top-16 left-0 w-full shadow-2xl md:hidden transition-all duration-300 backdrop-blur-2xl ${
            isDark ? "bg-gray-900/90 text-white border-b border-gray-700" : "bg-white/90 text-black border-b border-gray-200"
          }`}
        >
          <div className="flex flex-col items-center gap-6 px-6 py-8 text-lg font-medium">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }: { isActive: boolean }) =>
                  `px-6 py-2 w-full text-center rounded-xl transition-all ${
                    isActive
                      ? isDark
                        ? "bg-yellow-400/20 text-yellow-300"
                        : "bg-blue-600/10 text-blue-700"
                      : "hover:bg-gray-500/10"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <ToggleTheme />
          </div>
        </motion.div>
      )}
    </nav>
  );
}
