/**
 * Dashboard Layout
 *
 * Provides consistent layout structure for all dashboard pages.
 * Includes sidebar navigation, header with user info, and content area.
 */
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import SvgIcon from "@atoms/SvgIcon";
import ThemeToggle from "@molecules/ThemeToggle";
import { useThemeContext } from "@context/ThemeContext";

interface NavItem {
  to: string;
  label: string;
  icon: string;
  badge?: string;
  isNew?: boolean;
}

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Mi Progreso", icon: "graph-bar-increase" },
  { to: "/horarios", label: "Mis Horarios", icon: "calendar-check", isNew: true },
  { to: "/generador", label: "Generador", icon: "sparkles", isNew: true },
];

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
}: DashboardLayoutProps) {
  const location = useLocation();
  const { isDark, toggleDarkMode } = useThemeContext();

  return (
    <div className="relative min-h-screen bg-base-100 dark:bg-base-dark">

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar - Desktop */}
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-base-content/5 bg-base-100/80 backdrop-blur-lg dark:border-white/5 dark:bg-base-dark/80 lg:flex">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-base-content/5 px-6 dark:border-white/5">
            <img 
              src="/icons/favicon.svg" 
              alt="Semestrix Logo" 
              className="h-9 w-9 rounded-lg transition-transform hover:scale-110" 
            />
            <span className="text-lg font-bold text-base-content dark:text-white">
              Semestrix
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={clsx(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "text-base-content/70 hover:bg-base-200/50 hover:text-base-content dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
                  )}
                >
                  <SvgIcon
                    name={item.icon}
                    className={clsx(
                      "h-5 w-5 transition-transform group-hover:scale-110",
                      isActive ? "text-primary" : "opacity-70"
                    )}
                  />
                  <span>{item.label}</span>
                  {item.isNew && (
                    <span className="ml-auto rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-bold text-secondary">
                      PRONTO
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-base-content/5 p-4 dark:border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-base-content/50 dark:text-white/50">
                Tema
              </span>
              <ThemeToggle isDark={isDark} onToggle={toggleDarkMode} />
            </div>
          </div>
        </aside>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-base-content/10 bg-base-100/95 backdrop-blur-lg dark:border-white/10 dark:bg-base-dark/95 lg:hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={clsx(
                  "flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-base-content/60 dark:text-white/60"
                )}
              >
                <SvgIcon name={item.icon} className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-64">
          {/* Top Header Bar */}
          {(title || actions) && (
            <header className="sticky top-0 z-30 border-b border-base-content/5 bg-base-100/80 backdrop-blur-lg dark:border-white/5 dark:bg-base-dark/80">
              <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
                <div>
                  {title && (
                    <h1 className="text-lg font-bold text-base-content dark:text-white md:text-xl">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-xs text-base-content/60 dark:text-white/60">
                      {subtitle}
                    </p>
                  )}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
                
                {/* Theme Toggle in Header */}
                <div className="ml-2 lg:hidden">
                  <ThemeToggle isDark={isDark} onToggle={toggleDarkMode} />
                </div>
              </div>
            </header>
          )}

          {/* Page Content */}
          <main className="mx-auto max-w-7xl p-4 pb-24 md:p-8 lg:pb-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
