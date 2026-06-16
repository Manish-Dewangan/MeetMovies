import React from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Heart, Sparkles, Film, ArrowRight, Popcorn } from "lucide-react";

const Favorite = () => {
  const { favoriteMovies } = useAppContext();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden px-6 md:px-16 lg:px-24 xl:px-36 pt-32 pb-24">
      {/* Background effects */}
      <BlurCircle top="100px" left="-60px" />
      <BlurCircle bottom="80px" right="-40px" />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(229,9,20,0.06),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.03),transparent_30%)]" />

      {favoriteMovies.length > 0 ? (
        <>
          {/* Header */}
          <div className="relative mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium mb-4">
              <Heart className="w-4 h-4 fill-red-400" />
              Your Collection
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Favorite Movies
                </h1>

                <p className="text-gray-400 mt-3 max-w-xl text-sm md:text-base">
                  Movies you've loved and saved. Your personal watchlist is
                  ready — book tickets anytime.
                </p>
              </div>

              {/* Stats pill */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                  <Film className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-white">
                    {favoriteMovies.length}
                  </span>
                  <span className="text-sm text-gray-400">
                    {favoriteMovies.length === 1 ? "Movie" : "Movies"} saved
                  </span>
                </div>

                <button
                  onClick={() => {
                    navigate("/movies");
                    scrollTo(0, 0);
                  }}
                  className="group hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 text-sm font-medium backdrop-blur-md transition-all duration-300"
                >
                  Discover More
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {favoriteMovies.map((movie, index) => (
              <div
                key={movie._id}
                className="relative group"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Glow */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

                {/* Card wrapper */}
                <div className="relative rounded-3xl border border-white/8 bg-white/[0.03] p-2 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-red-500/20">
                  <MovieCard movie={movie} />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center mt-16">
            <button
              onClick={() => {
                navigate("/movies");
                scrollTo(0, 0);
              }}
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-600/20 transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              Explore More Movies
              <ArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </>
      ) : (
        /* ── Empty State ── */
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            {/* Animated Icon */}
            <div className="relative mx-auto mb-8">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
                <Heart className="h-12 w-12 text-gray-600" />
              </div>

              {/* Decorative ring */}
              <div className="absolute inset-0 mx-auto h-28 w-28 rounded-full border border-red-500/10 animate-ping opacity-20" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white">
              No favorites yet
            </h2>

            <p className="mt-4 text-gray-400 text-sm md:text-base leading-relaxed">
              You haven't added any movies to your favorites. Browse our
              collection and tap the heart icon to save movies you love.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <button
                onClick={() => {
                  navigate("/movies");
                  scrollTo(0, 0);
                }}
                className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-600/20 transition-all duration-300 hover:scale-105"
              >
                <Popcorn className="w-4 h-4" />
                Browse Movies
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  navigate("/");
                  scrollTo(0, 0);
                }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-gray-200 text-sm font-medium backdrop-blur-sm transition-all duration-300"
              >
                Go Home
              </button>
            </div>

            {/* Hint */}
            <div className="mt-10 mx-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03]">
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              <span className="text-xs text-gray-400">
                Tip: Click the heart icon on any movie to add it here
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Favorite;
