import React, { useState, useMemo } from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";
import {
  Film,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ChevronDown,
  Clapperboard,
} from "lucide-react";
import { TMDB_GENRE_MAP, getGenreNames } from "../lib/tmdbGenres";

const GENRES = ["All", ...Object.values(TMDB_GENRE_MAP)];

const SORT_OPTIONS = [
  { label: "Latest First", value: "latest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Highest Rated", value: "rating_high" },
  { label: "Lowest Rated", value: "rating_low" },
  { label: "A → Z", value: "az" },
  { label: "Z → A", value: "za" },
];

const Movies = () => {
  const { shows } = useAppContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredShows = useMemo(() => {
    let result = [...(shows || [])];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      result = result.filter((movie) => {
        const genreNames = getGenreNames(movie);

        return (
          movie.title?.toLowerCase().includes(q) ||
          movie.overview?.toLowerCase().includes(q) ||
          genreNames.some((genre) => genre.toLowerCase().includes(q))
        );
      });
    }

    if (activeGenre !== "All") {
      result = result.filter((movie) => {
        const genreNames = getGenreNames(movie);
        return genreNames.includes(activeGenre);
      });
    }

    switch (sortBy) {
      case "latest":
        result.sort(
          (a, b) =>
            new Date(b.release_date || 0) - new Date(a.release_date || 0),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.release_date || 0) - new Date(b.release_date || 0),
        );
        break;
      case "rating_high":
        result.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        break;
      case "rating_low":
        result.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
        break;
      case "az":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "za":
        result.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      default:
        break;
    }

    return result;
  }, [shows, searchQuery, activeGenre, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveGenre("All");
    setSortBy("latest");
  };

  const hasActiveFilters =
    searchQuery || activeGenre !== "All" || sortBy !== "latest";

  return (
    <section className="relative min-h-screen overflow-hidden px-6 md:px-16 lg:px-24 xl:px-36 pt-32 pb-24">
      <BlurCircle top="100px" left="-60px" />
      <BlurCircle bottom="80px" right="-40px" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(229,9,20,0.06),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_30%)]" />

      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Now Showing
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              All Movies
            </h1>
            <p className="text-gray-400 mt-3 max-w-xl text-sm md:text-base">
              Browse all currently showing movies. Search, filter by genre, and
              sort to find your perfect watch.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md self-start md:self-auto">
            <Film className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-white">
              {filteredShows.length}
            </span>
            <span className="text-sm text-gray-400">
              {filteredShows.length === 1 ? "Movie" : "Movies"}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, genres..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white placeholder-gray-500 text-sm outline-none focus:border-red-500/40 focus:bg-white/8 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-gray-200 text-sm outline-none focus:border-red-500/40 transition-all duration-300 cursor-pointer min-w-[160px]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-zinc-900 text-white"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-300
              ${
                showFilters || activeGenre !== "All"
                  ? "border-red-500/40 bg-red-500/10 text-red-400"
                  : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeGenre !== "All" && (
              <span className="w-2 h-2 rounded-full bg-red-500 ml-1" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200
                  ${
                    activeGenre === genre
                      ? "bg-red-600 text-white shadow-md shadow-red-600/20 scale-105"
                      : "bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-500">Active filters:</span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")}>
                  <X className="w-3 h-3 text-gray-400 hover:text-red-400 transition-colors" />
                </button>
              </span>
            )}

            {activeGenre !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                Genre: {activeGenre}
                <button onClick={() => setActiveGenre("All")}>
                  <X className="w-3 h-3 text-gray-400 hover:text-red-400 transition-colors" />
                </button>
              </span>
            )}

            {sortBy !== "latest" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                <button onClick={() => setSortBy("latest")}>
                  <X className="w-3 h-3 text-gray-400 hover:text-red-400 transition-colors" />
                </button>
              </span>
            )}

            <button
              onClick={clearFilters}
              className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {filteredShows.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredShows.map((movie, index) => (
            <div
              key={movie._id || movie.id || index}
              className="relative group"
            >
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
              <div className="relative rounded-3xl border border-white/8 bg-white/[0.03] p-2 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-red-500/20">
                <MovieCard movie={movie} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="relative mx-auto mb-8">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
              <Clapperboard className="h-12 w-12 text-gray-600" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {shows.length === 0 ? "No movies available" : "No results found"}
          </h2>

          <p className="mt-3 text-gray-400 text-sm max-w-md">
            {shows.length === 0
              ? "We couldn't find any movies right now. Please check back later."
              : `No movies match your search or filter.`}
          </p>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all duration-300"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default Movies;
