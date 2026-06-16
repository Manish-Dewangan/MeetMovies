import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  MenuIcon,
  SearchIcon,
  TicketPlus,
  XIcon,
  Heart,
  Film,
  Home,
  Theater,
  Clapperboard,
  X,
} from "lucide-react";
import { UserButton, useUser, useClerk } from "@clerk/react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const { favoriteMovies } = useAppContext();

  // ── Ref to avoid stale closures in scroll handler ──
  const scrolledRef = useRef(false);
  const rafRef = useRef(null);

  // ── Scroll detection with hysteresis + rAF batching ──
  // Uses two thresholds (20px down, 10px up) to prevent jitter
  const handleScroll = useCallback(() => {
    if (rafRef.current) return; // skip if a frame is already queued

    rafRef.current = requestAnimationFrame(() => {
      const y = window.scrollY;

      // Hysteresis: different thresholds for scrolling down vs up
      // prevents rapid toggling at the exact threshold
      if (!scrolledRef.current && y > 20) {
        scrolledRef.current = true;
        setIsScrolled(true);
      } else if (scrolledRef.current && y < 10) {
        scrolledRef.current = false;
        setIsScrolled(false);
      }

      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  // ── Close mobile menu + search on route change ──
  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // ── Lock body scroll when mobile menu is open ──
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── Escape key to close search ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    if (searchOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [searchOpen]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
    { label: "Movies", path: "/movies", icon: <Film className="w-4 h-4" /> },
    {
      label: "Theaters",
      path: "/theaters",
      icon: <Clapperboard className="w-4 h-4" />,
    },
    {
      label: "Releases",
      path: "/releases",
      icon: <Theater className="w-4 h-4" />,
    },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${searchQuery.trim()}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* ── MAIN NAVBAR ──
          FIX: replaced border-b with a pseudo-element (box-shadow)
          so there's never a discrete "line" that flickers.
          The shadow fades in/out smoothly via opacity transition. */}
      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ease-out
          ${
            isScrolled
              ? "py-3 bg-black/85 backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.06),0_8px_32px_rgba(0,0,0,0.4)]"
              : "py-5 bg-transparent shadow-none"
          }`}
        style={{
          // GPU-accelerated — prevents paint jank during fast scroll
          willChange: "background-color, padding, box-shadow",
        }}
      >
        <div className="flex items-center justify-between px-6 md:px-16 lg:px-36">
          {/* ── LOGO ── */}
          <Link
            to="/"
            onClick={() => scrollTo(0, 0)}
            className="max-md:flex-1 z-50 relative"
          >
            <img
              src={assets.MeetMoviesLogo}
              alt="MeetMovies Logo"
              className="w-36 h-auto hover:opacity-80 transition-opacity duration-200"
            />
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          <div className="hidden md:flex items-center gap-1 px-4 py-2 rounded-full backdrop-blur-md bg-white/5 border border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => scrollTo(0, 0)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${
                    isActive(link.path)
                      ? "text-white bg-red-600/90 shadow-lg shadow-red-600/20"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Favorites */}
            {favoriteMovies.length > 0 && (
              <Link
                to="/favorites"
                onClick={() => scrollTo(0, 0)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${
                    isActive("/favorites")
                      ? "text-white bg-red-600/90 shadow-lg shadow-red-600/20"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                Favorites
                <span className="ml-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {favoriteMovies.length}
                </span>
              </Link>
            )}
          </div>

          {/* ── RIGHT SIDE ACTIONS ── */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-200 cursor-pointer"
              aria-label="Search"
            >
              <SearchIcon className="w-4 h-4 text-gray-300" />
            </button>

            {/* Auth */}
            {!user ? (
              <button
                onClick={openSignIn}
                className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 cursor-pointer"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="My Bookings"
                      labelIcon={<TicketPlus width={15} />}
                      onClick={() => navigate("/my-bookings")}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-200 cursor-pointer"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── SEARCH OVERLAY ── */}
      <div
        className={`fixed inset-0 z-[60] flex items-start justify-center pt-24 px-6 transition-all duration-300
          ${
            searchOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => {
            setSearchOpen(false);
            setSearchQuery("");
          }}
        />

        <form
          onSubmit={handleSearchSubmit}
          className={`relative w-full max-w-2xl transition-all duration-300
            ${
              searchOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
            }`}
        >
          <div className="flex items-center gap-3 bg-zinc-900 border border-white/15 rounded-2xl px-5 py-4 shadow-2xl">
            <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, genres, actors..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-lg outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200"
            >
              Search
            </button>
          </div>
          <p className="text-gray-500 text-xs text-center mt-3">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-400 font-mono">
              Esc
            </kbd>{" "}
            to close
          </p>
        </form>
      </div>

      {/* ── MOBILE MENU OVERLAY ── */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300
          ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-0 left-0 h-full w-72 bg-zinc-950 border-r border-white/10
            shadow-2xl flex flex-col transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <img
              src={assets.MeetMoviesLogo}
              alt="MeetMovies Logo"
              className="w-28 h-auto"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <SearchIcon className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    navigate(`/movies?search=${e.target.value.trim()}`);
                    setIsOpen(false);
                  }
                }}
              />
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
            {navLinks.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  scrollTo(0, 0);
                  setIsOpen(false);
                }}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive(link.path)
                      ? "bg-red-600/20 text-red-400 border border-red-600/30"
                      : "text-gray-300 hover:text-white hover:bg-white/8"
                  }`}
              >
                <span
                  className={
                    isActive(link.path) ? "text-red-400" : "text-gray-500"
                  }
                >
                  {link.icon}
                </span>
                {link.label}
                {isActive(link.path) && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />
                )}
              </Link>
            ))}

            {/* Favorites */}
            {favoriteMovies.length > 0 && (
              <Link
                to="/favorites"
                onClick={() => {
                  scrollTo(0, 0);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive("/favorites")
                      ? "bg-red-600/20 text-red-400 border border-red-600/30"
                      : "text-gray-300 hover:text-white hover:bg-white/8"
                  }`}
              >
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                Favorites
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {favoriteMovies.length}
                </span>
              </Link>
            )}
          </nav>

          {/* Panel Footer */}
          <div className="px-6 py-5 border-t border-white/10">
            {!user ? (
              <button
                onClick={() => {
                  openSignIn();
                  setIsOpen(false);
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer"
              >
                Login / Sign Up
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <UserButton />
                <div>
                  <p className="text-sm font-medium text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <button
                    onClick={() => {
                      navigate("/my-bookings");
                      setIsOpen(false);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    My Bookings →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
