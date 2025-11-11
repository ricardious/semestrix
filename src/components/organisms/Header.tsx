import { useRef } from "react";
import { Link } from "react-router-dom";
import { Img } from "react-image";
import SvgIcon from "@atoms/SvgIcon";
import ThemeToggle from "@molecules/ThemeToggle";
import AuthModal from "@organisms/AuthModal";
import routesConstants from "@lib/constants/routeConstants";
import { useThemeContext } from "@context/ThemeContext";
import { menuItems } from "@lib/constants/menuItems";

const Header: React.FC = () => {
  const menuRef = useRef<HTMLUListElement | null>(null);
  const { isDark, toggleDarkMode } = useThemeContext();

  const openMenu = () => {
    if (menuRef.current) {
      menuRef.current.style.transform = "translateX(-16rem)";
    }
  };

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.style.transform = "translateX(16rem)";
    }
  };

  return (
    <nav className="w-full fixed px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[8%] 2xl:px-[12%] py-3 sm:py-4 flex justify-between items-center z-50">
      <Link to={routesConstants.HOME} className="flex items-center z-[1] group">
        <Img
          src="/icons/favicon.svg"
          alt="logo"
          className="w-10 sm:w-14 md:w-16 lg:w-18 xl:w-20 transition-all duration-300 group-hover:scale-105"
        />
        <span className="text-base sm:text-lg md:hidden lg:block lg:text-lg xl:text-xl 2xl:text-lg font-semibold ml-1">
          Semestrix
        </span>
      </Link>

      {/* Desktop Navigation */}
      <ul className="liquid-glass hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 rounded-full px-6 lg:px-8 xl:px-12 py-2 lg:py-3z-[1]">
        {menuItems.map((item) => (
          <li key={item.label} className="relative group">
            <a
              href={item.href}
              className="relative block text-xs lg:text-sm xl:text-base transition-all duration-300 hover:text-secondary dark:hover:text-accent group whitespace-nowrap"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary dark:bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          </li>
        ))}
      </ul>

      {/* Controls Container */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-5 z-[1]">
        <ThemeToggle isDark={isDark} onToggle={toggleDarkMode} />
        <Link
          to="https://github.com/ricardious/Semestrix.git"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <SvgIcon name="github" size="md" className="text-current" />
        </Link>
        <label
          htmlFor="auth-modal"
          className="hidden lg:flex items-center gap-3 px-10 py-2.5 border border-gray-500 rounded-full ml-4 transition-all duration-300 hover:border-gray-400 hover:shadow-lg hover:scale-105 active:scale-95 group cursor-pointer"
        >
          Ingresar
          <SvgIcon
            name="arrow-up-right"
            size="sm"
            className="text-current transition-transform duration-300 group-hover:scale-110"
          />
        </label>
        <button className="block md:hidden ml-3" onClick={openMenu}>
          <SvgIcon name="menu" size="md" className="text-current" />
        </button>
      </div>

      {/* Mobile Menu */}
      <ul
        ref={menuRef}
        className="flex md:hidden flex-col gap-4 py-20 px-10 fixed -right-64 top-0 bottom-0 w-64 z-50 h-screen bg-primary text-white dark:bg-[#070A35] transition-transform duration-500"
      >
        <div className="absolute top-6 right-6" onClick={closeMenu}>
          <SvgIcon name="x" size="sm" className="text-white" />
        </div>
        {menuItems.map((item) => (
          <li key={item.label}>
            <a href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          </li>
        ))}
        <li className="mt-4 pt-4 border-t border-white/20">
          <label
            htmlFor="auth-modal"
            className="flex items-center gap-3 text-white font-semibold cursor-pointer"
          >
            Ingresar
            <SvgIcon name="arrow-up-right" size="sm" className="text-white" />
          </label>
        </li>
      </ul>

      {/* Auth Modal */}
      <AuthModal />
    </nav>
  );
};

export default Header;
