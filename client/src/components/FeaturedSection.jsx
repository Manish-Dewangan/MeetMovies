import { ArrowRight, Clapperboard, Sparkles } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import { useAppContext } from "../context/AppContext";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { shows } = useAppContext();

  const featuredShows = shows?.slice(0, 4) || [];

  return (
    <section className="relative px-6 md:px-16 lg:px-24 xl:px-36 py-20 overflow-hidden">
      {/* Background Effects */}
      <BlurCircle top="40px" right="-100px" />
      <BlurCircle bottom="60px" left="-120px" />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(229,9,20,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_25%)]" />

      {/* Header */}
      <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Now Showing
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Featured Movies
          </h2>

          <p className="text-gray-400 mt-3 max-w-2xl text-sm md:text-base">
            Discover the hottest movies currently playing in theaters. Book your
            tickets instantly and enjoy the big screen experience with
            MeetMovies.
          </p>
        </div>

        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="group self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 text-sm font-medium backdrop-blur-md transition-all duration-300"
        >
          View All Movies
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Movies Grid */}
      {featuredShows.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {featuredShows.map((show, index) => (
            <div
              key={show._id}
              className="relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

              {/* Card Wrapper */}
              <div className="relative rounded-3xl border border-white/8 bg-white/[0.03] p-2 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-red-500/20">
                <MovieCard movie={show} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md px-6 py-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <Clapperboard className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            No movies available
          </h3>
          <p className="text-gray-400 mt-2 text-sm max-w-md mx-auto">
            We couldn’t find any featured movies right now. Please check back in
            a bit.
          </p>
          <button
            onClick={() => {
              navigate("/movies");
              scrollTo(0, 0);
            }}
            className="mt-6 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all duration-300"
          >
            Browse All Movies
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      {featuredShows.length > 0 && (
        <div className="flex justify-center mt-14">
          <button
            onClick={() => {
              navigate("/movies");
              scrollTo(0, 0);
            }}
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-600/20 transition-all duration-300 hover:scale-105"
          >
            Explore More Movies
            <ArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;
