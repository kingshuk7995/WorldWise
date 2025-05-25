import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../Store";
import { Theme, toggleTheme } from "../Store/themeSlice";

function ToggleTheme() {
  const MOON_IMAGE = <span>🌙</span>;
  const SUN_IMAGE = <span>☀️</span>;
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);
  return (
    <button onClick={() => dispatch(toggleTheme())}>
      {theme === Theme.Dark ? MOON_IMAGE : SUN_IMAGE}
    </button>
  );
}

export default function Navbar() {
  const theme = useSelector((state: RootState) => state.theme.theme);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:underline ${
      isActive
        ? theme === Theme.Dark
          ? "text-yellow-300"
          : "text-blue-700"
        : ""
    }`;
  return (
    <div
      className={`h-16 flex justify-between items-center px-6 shadow-md ${
        theme === Theme.Light
          ? "bg-gray-300 text-black"
          : "bg-gray-800 text-white"
      }`}
    >
      {/* Logo */}
      <div className="text-3xl font-semibold">
        <NavLink to="/">🌍 WorldWise</NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 text-lg">
        <NavLink to="/explore" className={navLinkClass}>
          Explore
        </NavLink>
        <NavLink to="/compare" className={navLinkClass}>
          Compare
        </NavLink>
        <NavLink to="/quiz" className={navLinkClass}>
          Quiz
        </NavLink>
        <NavLink to="/about" className={navLinkClass}>
          About
        </NavLink>
        <ToggleTheme />
      </div>
    </div>
  );
}
