import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import LinkWithPrefetch from "./LinkWithPrefetch";
import { prefetchComponent } from "../lib/prefetch";
import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  logo?: string;
  navLinks?: Array<{ label: string; href: string; hasDropdown?: boolean }>;
}

const Header = ({
  logo = "/vite.svg",
  navLinks = [
    { label: "Главная", href: "/" },
    { label: "Каталог тортов", href: "/#catalog" },
    { label: "Для кондитеров", href: "/courses" },
    { label: "Контакты", href: "/#contacts" },
  ],
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Предварительно загружаем страницы курсов при монтировании компонента
  useEffect(() => {
    prefetchComponent("./components/CourseDetail");
    prefetchComponent("./components/FinishingCreamCourse");
    prefetchComponent("./components/FlowerVaseCourse");

    // Закрываем выпадающее меню при клике вне его области
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (label: string) => {
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

  return (
    <header className="w-full h-20 bg-white/80 backdrop-blur-lg border-b border-gray-100/50 fixed top-0 left-0 z-50 shadow-sm transition-all duration-500">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <LinkWithPrefetch
            href="/"
            prefetchPath="./components/home"
            className="flex items-center"
          >
            <img src={logo} alt="Кондитерские курсы" className="h-10" />
            <span className="ml-2 text-xl font-display font-semibold text-gray-800 hidden sm:inline-block whitespace-nowrap">
              Дело Вкуса
            </span>
          </LinkWithPrefetch>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group dropdown-container">
              <a
                href={link.href}
                className={cn(
                  "text-gray-600 hover:text-pink-600 transition-all duration-300 font-medium cursor-pointer hover:tracking-wide",
                  {
                    "flex items-center": link.hasDropdown,
                  },
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

              {/* Dropdown for desktop */}
              {link.hasDropdown && (
                <div
                  className={cn(
                    "absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-200 origin-top-right z-50 dropdown-container",
                    activeDropdown === link.label
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none",
                  )}
                >
                  <div className="py-2" onClick={(e) => e.stopPropagation()}>
                    <a
                      href="/courses"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer font-semibold"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveDropdown(null);
                        navigate("/courses");
                      }}
                    >
                      Все курсы
                    </a>
                    <div className="border-t border-gray-200 my-1"></div>
                    <a
                      href="/courses/roses"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveDropdown(null);
                        navigate("/courses/roses");
                      }}
                    >
                      Курс «Лепестками роз»
                    </a>
                    <a
                      href="/courses/cream"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveDropdown(null);
                        navigate("/courses/cream");
                      }}
                    >
                      Курс «Финишный крем»
                    </a>
                    <a
                      href="/courses/vase"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveDropdown(null);
                        navigate("/courses/vase");
                      }}
                    >
                      Курс «Ваза с цветами»
                    </a>
                    <a
                      href="/courses/ostrov"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveDropdown(null);
                        navigate("/courses/ostrov");
                      }}
                    >
                      Курс «Остров»
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="outline"
                className="border-pink-200 text-pink-600 hover:bg-pink-50"
                onClick={() => navigate("/dashboard")}
              >
                <User className="w-4 h-4 mr-2" />
                Личный кабинет
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-gray-500 hover:text-red-600"
                title="Выйти"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => navigate("/auth")}
            >
              Войти
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden bg-white absolute w-full left-0 transition-all duration-300 ease-in-out border-b border-gray-100 shadow-md",
          isMenuOpen ? "top-20 opacity-100" : "-top-96 opacity-0",
        )}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <div key={link.label} className="py-2">
                <div
                  className="flex justify-between items-center"
                  onClick={() => {
                    if (link.hasDropdown) {
                      toggleDropdown(link.label);
                    }
                  }}
                >
                  <a
                    href={link.href}
                    className="text-gray-600 font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      if (link.hasDropdown) {
                        // handled by parent div
                      } else if (link.href.startsWith("/#")) {
                        setIsMenuOpen(false);
                        const id = link.href.slice(2);
                        if (window.location.pathname === "/") {
                          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                        } else {
                          navigate("/");
                          setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
                        }
                      } else {
                        setIsMenuOpen(false);
                        navigate(link.href);
                      }
                    }}
                  >
                    {link.label}
                  </a>
                  {link.hasDropdown && (
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-gray-500 transition-transform",
                        {
                          "rotate-180": activeDropdown === link.label,
                        },
                      )}
                    />
                  )}
                </div>

                {/* Mobile dropdown */}
                {link.hasDropdown && activeDropdown === link.label && (
                  <div
                    className="mt-2 ml-4 border-l-2 border-gray-200 pl-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href="/courses/roses"
                      className="block py-2 text-gray-600 hover:text-primary cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        setActiveDropdown(null);
                        navigate("/courses/roses");
                      }}
                    >
                      Курс «Лепестками роз»
                    </a>
                    <a
                      href="/courses/cream"
                      className="block py-2 text-gray-600 hover:text-primary cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        setActiveDropdown(null);
                        navigate("/courses/cream");
                      }}
                    >
                      Курс «Финишный крем»
                    </a>
                    <a
                      href="/courses/vase"
                      className="block py-2 text-gray-600 hover:text-primary cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        setActiveDropdown(null);
                        navigate("/courses/vase");
                      }}
                    >
                      Курс «Ваза с цветами»
                    </a>
                    <a
                      href="/courses/ostrov"
                      className="block py-2 text-gray-600 hover:text-primary cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        setActiveDropdown(null);
                        navigate("/courses/ostrov");
                      }}
                    >
                      Курс «Остров»
                    </a>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Личный кабинет
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/auth");
                  }}
                >
                  Войти
                </Button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
