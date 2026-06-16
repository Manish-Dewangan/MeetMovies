import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  StarIcon,
  Ticket,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
import { useAppContext } from "../context/AppContext";
import { getGenreNames } from "../lib/tmdbGenres";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext();

  const movieId = movie?._id || movie?.id;
  const movieImage = movie?.poster_path || movie?.backdrop_path;
  const releaseYear = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const genreNames = getGenreNames(movie);
  const genresText = genreNames.slice(0, 2).join(" • ");
  const duration = movie?.runtime ? timeFormat(movie.runtime) : "TBA";
  const rating = (movie?.vote_average || 0).toFixed(1);

  const handleNavigate = () => {
    navigate(`/movies/${movieId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="group relative flex h-full w-full max-w-[290px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-2 hover:border-red-500/30 hover:shadow-[0_20px_60px_rgba(229,9,20,0.18)]">
      <div className="relative overflow-hidden">
        {movieImage ? (
          <img
            onClick={handleNavigate}
            src={image_base_url + movieImage}
            alt={movie?.title}
            loading="lazy"
            className="h-56 w-full cursor-pointer object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-56 w-full items-center justify-center bg-zinc-800 text-sm text-gray-400">
            No Image Available
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

        <div className="absolute left-3 top-3">
          <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {releaseYear}
          </span>
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-yellow-400/20 bg-black/60 px-3 py-1 text-xs font-semibold text-yellow-400 backdrop-blur-md">
          <StarIcon className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          {rating}
        </div>

        <button
          onClick={handleNavigate}
          className="absolute right-3 bottom-3 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-red-700"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>

        <div className="absolute bottom-4 left-4 right-14">
          <h3
            onClick={handleNavigate}
            className="cursor-pointer truncate text-lg font-semibold text-white transition-colors duration-300 group-hover:text-red-400"
            title={movie?.title}
          >
            {movie?.title}
          </h3>

          {genresText && (
            <p className="mt-1 truncate text-xs text-gray-300">{genresText}</p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
              <CalendarDays className="h-3.5 w-3.5 text-red-400" />
              {releaseYear}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
              <Clock3 className="h-3.5 w-3.5 text-red-400" />
              {duration}
            </span>
          </div>

          <p className="mt-3 min-h-[44px] text-sm leading-6 text-gray-400">
            {genreNames.length > 0
              ? `Experience ${genreNames.slice(0, 2).join(", ").toLowerCase()} on the big screen.`
              : "Book your seat now and enjoy the cinematic experience."}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleNavigate}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30"
          >
            <Ticket className="h-4 w-4" />
            Buy Tickets
          </button>

          <button
            onClick={handleNavigate}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
