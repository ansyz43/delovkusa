import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Cake, Menu, X, ChevronDown, ChevronRight, User, LogOut } from "lucide-react";
import { prefetchComponent } from "../lib/prefetch";
import { useAuth } from "../lib/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemFadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface HeaderProps {
  navLinks?: Array<{ label: string; href: string; hasDropdown?: boolean }>;
}

const Header = ({
  navLinks = [
    { label: "Главная", href: "/" },
    { label: "Каталог тортов", href: "/#catalog" },
    { label: "Для кондитеров", href: "/courses" },
    { label: "Контакты", href: "/#contacts" },
  ],
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    prefetchComponent("./components/CourseDetail");
    prefetchComponent("./components/FinishingCreamCourse");
    prefetchComponent("./components/FlowerVaseCourse");

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow",
          scrollY > 50 && "shadow-md",
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="h-10 w-10 rounded-2xl bg-pink-600 flex items-center justify-center"
            >
              <Cake className="h-5 w-5 text-white" />
            </motion.div>
            <span className="font-display font-bold text-xl hidden sm:inline-block">
              Дело Вкуса
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group dropdown-container">
                <a
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-pink-600 cursor-pointer",
                    { "flex items-center": link.hasDropdown },
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    if (link.hasDropdown) {
                      e.stopPropagation();
                      toggleDropdown(link.label);
                    } else if (link.href.startsWith("/#")) {
                      const id = link.href.slice(2);
                      if (window.location.pathname === "/") {
                        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        navigate("/");
                        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
                      }
                    } else {
                      navigate(link.href);
                    }
                  }}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <ChevronDown
                      className={cn("ml-1 h-4 w-4 transition-transform", {
                        "rotate-180": activeDropdown === link.label,
                      })}
                    />
                  )}
                </a>

                {/* Dropdown */}
                {link.hasDropdown && (
                  <div
                    className={cn(
                      "absolute top-full left-0 mt-2 w-48 bg-background shadow-lg rounded-xl overflow-hidden transition-all duration-200 origin-top-right z-50 border dropdown-container",
                      activeDropdown === link.label
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none",
                    )}
                  >
                    <div className="py-2" onClick={(e) => e.stopPropagation()}>
                      <a
                        href="/courses"
                        className="block px-4 py-2 text-sm hover:bg-accent cursor-pointer font-semibold"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveDropdown(null); navigate("/courses"); }}
                      >
                        Все курсы
                      </a>
                      <div className="border-t my-1" />
                      {[
                        { href: "/courses/roses", label: "Курс «Лепестками роз»" },
                        { href: "/courses/cream", label: "Курс «Финишный крем»" },
                        { href: "/courses/vase", label: "Курс «Ваза с цветами»" },
                        { href: "/courses/ostrov", label: "Курс «Остров»" },
                      ].map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-sm hover:bg-accent cursor-pointer"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveDropdown(null); navigate(item.href); }}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Кабинет
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-muted-foreground hover:text-red-600 cursor-pointer"
                  onClick={handleSignOut}
                  title="Выйти"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="rounded-full bg-pink-600 hover:bg-pink-700 cursor-pointer"
                onClick={() => navigate("/auth")}
              >
                Войти
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex md:hidden cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Меню"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background md:hidden"
        >
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-pink-600 flex items-center justify-center">
                <Cake className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">Дело Вкуса</span>
            </Link>
            <button onClick={() => setIsMenuOpen(false)} className="cursor-pointer" aria-label="Закрыть">
              <X className="h-6 w-6" />
            </button>
          </div>
          <motion.nav
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="container grid gap-2 pb-8 pt-6"
          >
            {navLinks.map((link, index) => (
              <motion.div key={index} variants={itemFadeIn}>
                {link.hasDropdown ? (
                  <>
                    <div
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-medium hover:bg-accent cursor-pointer"
                      onClick={() => toggleDropdown(link.label)}
                    >
                      {link.label}
                      <ChevronDown className={cn("h-5 w-5 transition-transform", { "rotate-180": activeDropdown === link.label })} />
                    </div>
                    {activeDropdown === link.label && (
                      <div className="ml-4 border-l-2 border-muted pl-4 mt-1">
                        {[
                          { href: "/courses/roses", label: "Курс «Лепестками роз»" },
                          { href: "/courses/cream", label: "Курс «Финишный крем»" },
                          { href: "/courses/vase", label: "Курс «Ваза с цветами»" },
                          { href: "/courses/ostrov", label: "Курс «Остров»" },
                        ].map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            className="block py-2 text-muted-foreground hover:text-pink-600 cursor-pointer"
                            onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); setActiveDropdown(null); navigate(item.href); }}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : link.href.startsWith("/#") ? (
                  <a
                    href={link.href}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-medium hover:bg-accent cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      const id = link.href.slice(2);
                      if (window.location.pathname === "/") {
                        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        navigate("/");
                        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
                      }
                    }}
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-medium hover:bg-accent cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </motion.div>
            ))}
            <motion.div variants={itemFadeIn} className="flex flex-col gap-3 pt-4">
              {user ? (
                <>
                  <Button
                    className="w-full rounded-full cursor-pointer"
                    onClick={() => { setIsMenuOpen(false); navigate("/dashboard"); }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Кабинет
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                    onClick={() => { setIsMenuOpen(false); handleSignOut(); }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full rounded-full bg-pink-600 hover:bg-pink-700 cursor-pointer"
                  onClick={() => { setIsMenuOpen(false); navigate("/auth"); }}
                >
                  Войти
                </Button>
              )}
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </>
  );
};

export default Header;
