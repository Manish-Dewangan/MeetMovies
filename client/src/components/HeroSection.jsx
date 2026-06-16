import React, { useRef, useState } from "react";
import { assets } from "../assets/assets";
import { ArrowRight, CalendarIcon, ClockIcon, Play, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const HeroSection = () => {
  const navigate = useNavigate();
  const swiperRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const movieData = [
    {
      id: 1,
      title: "SpiderMan Far From Home",
      genre: ["Action", "Adventure", "Sci-Fi"],
      year: "2019",
      duration: "2h 9m",
      rating: "7.4",
      description:
        "Peter Parker's European vacation takes an unexpected turn when Nick Fury shows up with an urgent mission that Spider-Man can't refuse.",
      bgImage: "/Spider-Man-Far-From-Home.jpg",
      logo: assets.marvelLogo,
      accentColor: "#E50914",
    },
    {
      id: 2,
      title: "A MineCraft Movie",
      genre: ["Fantasy", "Adventure", "Family"],
      year: "2025",
      duration: "1h 44m",
      rating: "6.8",
      description:
        "A mysterious portal pulls four misfits into the Overworld, a bizarre, cubic wonderland that thrives on imagination.",
      bgImage: "/MineCraft_bg.jpg",
      logo: assets.minecraftLogo,
      accentColor: "#4CAF50",
    },
    {
      id: 3,
      title: "Deadpool & Wolverine",
      genre: ["Action", "Comedy"],
      year: "2024",
      duration: "2h 8m",
      rating: "7.9",
      description:
        "Deadpool's peaceful existence comes crashing down when the TVA recruits him to safeguard the multiverse alongside his frenemy Wolverine.",
      bgImage: "/DeadPool.png",
      logo: assets.marvelLogo,
      accentColor: "#E50914",
    },
    {
      id: 4,
      title: "Demon Slayer Infinity Castle",
      genre: ["Action", "Animation"],
      year: "2025",
      duration: "2h 35m",
      rating: "9.1",
      description:
        "Tanjiro Kamado and the Demon Slayer Corps find themselves in an epic, breathtaking battle at the legendary Infinity Castle.",
      bgImage: "/Demons-slayer.png",
      logo: assets.DemonSlayerLogo,
      accentColor: "#FF6B35",
    },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* ── SWIPER ── */}
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={false}
        className="h-full w-full"
      >
        {movieData.map((movie, idx) => (
          <SwiperSlide key={movie.id}>
            {({ isActive }) => (
              <div className="relative h-full w-full overflow-hidden">
                {/* ── Background with Ken Burns zoom ── */}
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-transform
                    ${isActive ? "animate-kenBurns" : "scale-100"}`}
                  style={{ backgroundImage: `url(${movie.bgImage})` }}
                />

                {/* ── Multi-layer gradient overlay ── */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/10 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10" />

                {/* ── Accent color glow (bottom left) ── */}
                <div
                  className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px] opacity-20 z-10"
                  style={{ backgroundColor: movie.accentColor }}
                />

                {/* ── CONTENT ── */}
                <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-16 lg:px-36 pb-32">
                  {/* Logo */}
                  <div
                    className={`mb-4 ${
                      isActive ? "animate-slideDown" : "opacity-0"
                    }`}
                  >
                    <img
                      src={movie.logo}
                      alt="Studio Logo"
                      className="max-h-10 object-contain"
                    />
                  </div>

                  {/* Title */}
                  <h1
                    className={`text-4xl sm:text-5xl md:text-[68px] font-black text-white
                      leading-tight max-w-[640px] tracking-tight drop-shadow-2xl
                      ${isActive ? "animate-slideUp delay-100" : "opacity-0"}`}
                  >
                    {movie.title}
                  </h1>

                  {/* Rating + Genre + Meta */}
                  <div
                    className={`mt-4 flex flex-wrap items-center gap-3
                      ${isActive ? "animate-slideUp delay-200" : "opacity-0"}`}
                  >
                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5 bg-yellow-400/15 border border-yellow-400/30 rounded-full px-3 py-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-semibold">
                        {movie.rating}
                      </span>
                    </div>

                    {/* Genre Pills */}
                    {movie.genre.map((g) => (
                      <span
                        key={g}
                        className="text-xs font-medium text-gray-300 bg-white/10 border border-white/10 rounded-full px-3 py-1 backdrop-blur-sm"
                      >
                        {g}
                      </span>
                    ))}

                    {/* Separator */}
                    <span className="text-gray-600 hidden sm:block">|</span>

                    {/* Year */}
                    <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      {movie.year}
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      {movie.duration}
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className={`mt-4 max-w-[480px] text-gray-400 text-base leading-relaxed
                      ${isActive ? "animate-slideUp delay-300" : "opacity-0"}`}
                  >
                    {movie.description}
                  </p>

                  {/* CTA Buttons */}
                  <div
                    className={`mt-7 flex items-center gap-4
                      ${isActive ? "animate-slideUp delay-500" : "opacity-0"}`}
                  >
                    <button
                      onClick={() => navigate("/movies")}
                      className="group flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-red-600/40 hover:shadow-xl"
                      style={{ backgroundColor: movie.accentColor }}
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Book Tickets
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      onClick={() => navigate("/movies")}
                      className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white border border-white/25 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105"
                    >
                      Explore All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── BOTTOM CONTROL BAR ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 md:px-16 lg:px-36 pb-6">
        <div className="flex items-end justify-between gap-4">
          {/* Thumbnails */}
          <div className="flex items-center gap-3">
            {movieData.map((movie, index) => (
              <button
                key={movie.id}
                onClick={() => swiperRef.current?.slideTo(index)}
                className={`relative overflow-hidden rounded-lg transition-all duration-300 border-2
                  ${
                    activeIndex === index
                      ? "w-24 h-14 opacity-100 border-red-500 shadow-lg shadow-red-600/30"
                      : "w-16 h-10 opacity-40 border-transparent hover:opacity-70 hover:w-20 hover:h-12"
                  }`}
              >
                <img
                  src={movie.bgImage}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                {activeIndex === index && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                )}
              </button>
            ))}
          </div>

          {/* Progress Dots */}
          <div className="flex items-center gap-2 pb-1">
            {movieData.map((_, index) => (
              <button
                key={index}
                onClick={() => swiperRef.current?.slideTo(index)}
                className={`rounded-full transition-all duration-300
                  ${
                    activeIndex === index
                      ? "w-8 h-2 bg-red-500"
                      : "w-2 h-2 bg-white/30 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-px w-full bg-white/10">
          <div
            className="h-full bg-red-500 transition-all duration-300"
            style={{
              width: `${((activeIndex + 1) / movieData.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        /* Ken Burns zoom effect */
        @keyframes kenBurns {
          from { transform: scale(1.08); }
          to   { transform: scale(1); }
        }
        .animate-kenBurns {
          animation: kenBurns 6s ease-out forwards;
        }

        /* Slide up fade-in */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.75s ease forwards;
        }

        /* Slide down fade-in (for logo) */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.6s ease forwards;
        }

        /* Delays */
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.35s; opacity: 0; }
        .delay-500 { animation-delay: 0.55s; opacity: 0; }

        /* Hide default swiper pagination */
        .swiper-pagination { display: none; }
      `}</style>
    </div>
  );
};

export default HeroSection;
