import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import {
  PlayCircleIcon,
  StarIcon,
  Heart,
  Clock3,
  CalendarDays,
  Globe,
  ArrowRight,
  Sparkles,
  Users,
  Film,
  ChevronRight,
} from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const {
    shows,
    axios,
    getToken,
    user,
    fetchFavoriteMovies,
    favoriteMovies,
    image_base_url,
  } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
      }
    } catch (error) {
      console.error("Error fetching show:", error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please Login to Proceed");

      const { data } = await axios.post(
        "/api/user/update-favorite",
        { movieId: id },
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );

      if (data.success) {
        await fetchFavoriteMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  const isFavorite = favoriteMovies?.some(
    (movie) => String(movie._id) === String(id),
  );

  if (!show || !show.movie) return <Loading />;

  const movie = show.movie;
  const rating = (movie.vote_average || 0).toFixed(1);
  const releaseYear = movie.release_date?.split("-")[0];
  const duration = timeFormat(movie.runtime);
  const genres = movie.genres?.map((g) => g.name) || [];

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      {/* ── Hero Banner Background ── */}
      <div className="absolute inset-x-0 top-0 h-[70vh] overflow-hidden -z-10">
        <img
          src={image_base_url + movie.backdrop_path}
          alt=""
          className="h-full w-full object-cover object-top opacity-30 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
      </div>

      {/* ── Main Content ── */}
      <div className="relative px-6 md:px-16 lg:px-24 xl:px-36 pt-28 md:pt-40">
        <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
          {/* ── Poster ── */}
          <div className="relative flex-shrink-0 mx-auto lg:mx-0">
            {/* Poster glow */}
            <div className="absolute -inset-3 rounded-3xl bg-red-600/10 blur-2xl opacity-50" />

            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
              {!imgLoaded && (
                <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-2xl" />
              )}
              <img
                src={image_base_url + movie.poster_path}
                alt={movie.title}
                onLoad={() => setImgLoaded(true)}
                className={`h-[420px] md:h-[480px] w-[280px] md:w-[320px] object-cover transition-opacity duration-500 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Rating overlay on poster */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-yellow-400/20">
                <StarIcon className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-yellow-400 text-xs font-bold">
                  {rating}
                </span>
              </div>
            </div>
          </div>

          {/* ── Details ── */}
          <div className="relative flex flex-col gap-4 flex-1 max-w-2xl">
            <BlurCircle top="-100px" left="-100px" />

            {/* Language badge */}
            <div className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold uppercase tracking-wider">
              <Globe className="w-3 h-3" />
              English
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              {movie.title}
            </h1>

            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-2.5 mt-1">
              {/* Rating */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yellow-400/20 bg-yellow-400/10">
                <StarIcon className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-semibold">
                  {rating}
                </span>
                <span className="text-gray-400 text-xs">Rating</span>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
                <Clock3 className="w-3.5 h-3.5 text-red-400" />
                <span className="text-gray-300 text-sm">{duration}</span>
              </div>

              {/* Year */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
                <CalendarDays className="w-3.5 h-3.5 text-red-400" />
                <span className="text-gray-300 text-sm">{releaseYear}</span>
              </div>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 text-xs font-medium text-gray-300 bg-white/5 border border-white/10 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mt-3">
              <h3 className="text-sm font-semibold text-gray-200 mb-2">
                Storyline
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {movie.overview}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-md">
                <PlayCircleIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                Watch Trailer
              </button>

              <a
                href="#dateSelect"
                className="group flex items-center gap-2 px-7 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-600/25 transition-all duration-300 hover:scale-105"
              >
                Buy Tickets
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <button
                onClick={handleFavorite}
                className={`flex items-center justify-center h-12 w-12 rounded-full border transition-all duration-300 hover:scale-110 cursor-pointer ${
                  isFavorite
                    ? "bg-red-500/20 border-red-500/40 shadow-lg shadow-red-600/20"
                    : "bg-white/5 border-white/15 hover:bg-white/10"
                }`}
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-gray-300 hover:text-red-400"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ── Cast Section ── */}
        {movie.casts && movie.casts.length > 0 && (
          <div className="max-w-7xl mx-auto mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium mb-3">
                  <Users className="w-4 h-4" />
                  Top Cast
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Your Favorite Cast
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar pb-4">
              <div className="flex items-start gap-5 w-max">
                {movie.casts.slice(0, 12).map((cast, index) => (
                  <div
                    key={index}
                    className="group flex flex-col items-center text-center w-24"
                  >
                    {/* Cast Image */}
                    <div className="relative overflow-hidden rounded-full border-2 border-white/10 group-hover:border-red-500/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-600/10">
                      {cast.profile_path ? (
                        <img
                          src={image_base_url + cast.profile_path}
                          alt={cast.name}
                          className="h-20 w-20 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="h-20 w-20 flex items-center justify-center bg-zinc-800 text-gray-500">
                          <Users className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Cast Name */}
                    <p className="text-xs font-medium text-white mt-3 leading-tight line-clamp-2">
                      {cast.name}
                    </p>

                    {/* Character name */}
                    {cast.character && (
                      <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                        {cast.character}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Date Selection ── */}
        <div className="max-w-7xl mx-auto mt-16" id="dateSelect">
          <DateSelect dateTime={show.dateTime} id={id} />
        </div>

        {/* ── Similar Movies ── */}
        {shows.length > 0 && (
          <div className="max-w-7xl mx-auto mt-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium mb-3">
                  <Sparkles className="w-4 h-4" />
                  Recommended
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  You May Also Like
                </h2>
              </div>

              <button
                onClick={() => {
                  navigate("/movies");
                  scrollTo(0, 0);
                }}
                className="group hidden md:flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {shows.slice(0, 4).map((movie, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
                  <div className="relative rounded-3xl border border-white/8 bg-white/[0.03] p-2 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-red-500/20">
                    <MovieCard movie={movie} />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="flex justify-center mt-14">
              <button
                onClick={() => {
                  navigate("/movies");
                  scrollTo(0, 0);
                }}
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-600/20 transition-all duration-300 hover:scale-105"
              >
                <Film className="w-4 h-4" />
                Explore More Movies
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
