import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { type RootState } from "../Store";
import { Theme, toggleTheme } from "../Store/themeSlice";
import { Menu, X } from "lucide-react";

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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-1 pb-1 transition-all duration-300 ${
      isActive
        ? theme === Theme.Dark
          ? "text-yellow-300 font-semibold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-yellow-300"
          : "text-blue-700 font-semibold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-700"
        : "text-gray-500 hover:text-inherit"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 h-16 flex justify-between items-center px-6 shadow-md transition-colors duration-300 ${
        theme === Theme.Light
          ? "bg-gray-300 text-black"
          : "bg-gray-800 text-white"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="text-3xl font-bold flex items-center gap-2">
        <img src="/worldwise.svg" alt="WorldWise logo" className="w-8 h-8" />
        WorldWise
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6 text-lg">
        {links.map(({ to, label }) => (
          <NavLink key={to} to={to} className={navLinkClass}>
            {label}
          </NavLink>
        ))}
        <ToggleTheme />
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="md:hidden text-2xl"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div
          className={`absolute top-16 left-0 w-full bg-inherit shadow-md md:hidden transition-all duration-300 ${
            theme === Theme.Light ? "text-black" : "text-white"
          }`}
        >
          <div className="flex flex-col items-start gap-4 px-6 py-4 text-lg">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <ToggleTheme />
          </div>
        </div>
      )}
    </nav>
  );
}
