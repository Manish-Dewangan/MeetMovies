import React from "react";
import { Link } from "react-router-dom";
import { BellIcon, SearchIcon } from "lucide-react";
import { assets } from "../../assets/assets";

const AdminNavbar = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-xl">
      <Link to="/" className="flex items-center gap-3">
        <img
          src={assets.MeetMoviesLogo}
          alt="MeetMovies"
          className="w-36 h-auto"
        />
      </Link>

      <div className="flex items-center gap-3">
        <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
          <SearchIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Search</span>
        </button>

        <button className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
          <BellIcon className="w-5 h-5 text-gray-300" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
