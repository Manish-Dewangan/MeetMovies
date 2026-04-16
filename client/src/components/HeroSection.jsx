//Ye wala origional
// return (
//   <div className="flex flex-col  items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url('/backgroundImage.png')] bg-cover bg-center h-screen">
//     <img
//       src={assets.marvelLogo}
//       alt="Marvel Logo"
//       className="max-h-11 lg:h-11 mt-20"
//     />
//     <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">
//       Guardians <br /> of the Galaxy
//     </h1>
//     <div className="flex items-center gap-4 text-gray-300">
//       <span>Action | Adventure | Sci-Fi</span>
//       <div className="flex items-center gap-1">
//         <p>2018</p>
//         <CalendarIcon className="w-4.5 h-4.5"></CalendarIcon>
//       </div>
//       <div className="flex items-center gap-1">
//         <ClockIcon className="w-4.5 h-4.5" />
//         2h 10m
//       </div>
//     </div>
//     <p className="max-w-md text-gray-300">
//       In a post-apocalyptic world where cities rides on wheels and consume
//       each other to survive, two people meet in London and try to stop a
//       catastrophic event.
//     </p>
//     <button
//       onClick={() => navigate("/movies")}
//       className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
//     >
//       Explores Movies <ArrowRight className="w-5 h-5" />
//     </button>
//   </div>
// );

import React, { useRef } from "react";
import { assets } from "../assets/assets";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const HeroSection = () => {
  const navigate = useNavigate();
  const swiperRef = useRef();

  const movieData = [
    {
      id: 1,
      title: "SpiderMan Far From Home",
      genre: "Action | Adventure | Sci-Fi",
      year: "2019",
      duration: "2h 9m",
      description:
        "Peter Parker’s European vacation takes an unexpected turn when Nick Fury shows up.",
      bgImage: "/Spider-Man-Far-From-Home.jpg",
      logo: assets.marvelLogo,
    },
    {
      id: 2,
      title: "A MineCraft Movie",
      genre: "Fantasy | Adventure | Sci-Fi",
      year: "2025",
      duration: "1h 44m",
      description:
        "A mysterious portal pulls four misfits into the Overworld, a bizarre, cubic wonderland that thrives on imagination. To get back home, they'll have to master the terrain while embarking on a magical quest with an unexpected crafter named Steve.",
      bgImage: "/MineCraft_bg.jpg",
      logo: assets.minecraftLogo,
    },
    {
      id: 3,
      title: "Deadpool & Wolverine",
      genre: "Action | Comedy ",
      year: "2024",
      duration: "2h 8m",
      description:
        "Deadpool's peaceful existence comes crashing down when the Time Variance Authority recruits him to help safeguard the multiverse. He soon unites with his would-be pal, Wolverine, to complete the mission and save his world from an existential threat.",
      bgImage: "/DeadPool.png",
      logo: assets.marvelLogo,
    },
    {
      id: 4,
      title: "Demon Slayer Infinity Castle",
      genre: "Action | Animation ",
      year: "2025",
      duration: "2h 35m",
      description:
        "Tanjiro Kamado and other members of the Demon Slayer Corps find themselves in an epic battle at Infinity Castle.",
      bgImage: "/Demons-slayer.png",
      logo: assets.DemonSlayerLogo,
    },
  ];

  //Deadpool's peaceful existence comes crashing down when the Time Variance Authority recruits him to help safeguard the multiverse. He soon unites with his would-be pal, Wolverine, to complete the mission and save his world from an existential threat.

  // return (
  //   <div className="flex flex-col  items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url('/backgroundImage.png')] bg-cover bg-center h-screen">
  //     <img
  //       src={assets.marvelLogo}
  //       alt="Marvel Logo"
  //       className="max-h-11 lg:h-11 mt-20"
  //     />
  //     <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">
  //       Guardians <br /> of the Galaxy
  //     </h1>
  //     <div className="flex items-center gap-4 text-gray-300">
  //       <span>Action | Adventure | Sci-Fi</span>
  //       <div className="flex items-center gap-1">
  //         <p>2018</p>
  //         <CalendarIcon className="w-4.5 h-4.5"></CalendarIcon>
  //       </div>
  //       <div className="flex items-center gap-1">
  //         <ClockIcon className="w-4.5 h-4.5" />
  //         2h 10m
  //       </div>
  //     </div>
  //     <p className="max-w-md text-gray-300">
  //       In a post-apocalyptic world where cities rides on wheels and consume
  //       each other to survive, two people meet in London and try to stop a
  //       catastrophic event.
  //     </p>
  //     <button
  //       onClick={() => navigate("/movies")}
  //       className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
  //     >
  //       Explores Movies <ArrowRight className="w-5 h-5" />
  //     </button>
  //   </div>
  // );

  // return (
  //   <div className="relative h-screen w-full overflow-hidden">
  //     {/* SWIPER */}
  //     <Swiper
  //       onSwiper={(swiper) => (swiperRef.current = swiper)}
  //       modules={[Autoplay, Pagination, EffectFade]}
  //       effect="fade"
  //       speed={800}
  //       autoplay={{ delay: 5000, disableOnInteraction: false }}
  //       pagination={{ clickable: true, dynamicBullets: true }}
  //       className="h-full w-full"
  //     >
  //       {movieData.map((movie) => (
  //         <SwiperSlide key={movie.id}>
  //           {({ isActive }) => (
  //             <div
  //               className="h-full w-full relative flex items-center"
  //               style={{
  //                 backgroundImage: `url(${movie.bgImage})`,
  //                 backgroundSize: "cover",
  //                 backgroundPosition: "center",
  //               }}
  //             >
  //               {/* Overlay */}
  //               <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/20 z-10"></div>

  //               {/* Background Zoom Animation */}
  //               <div
  //                 className={`absolute inset-0 ${
  //                   isActive ? "animate-zoomOut" : ""
  //                 }`}
  //               ></div>

  //               {/* CONTENT */}
  //               <div className="relative z-20 px-6 md:px-16 lg:px-36 flex flex-col gap-4 max-w-2xl">
  //                 <img
  //                   src={movie.logo}
  //                   alt="logo"
  //                   loading="lazy"
  //                   className={`max-h-11 mt-10 ${
  //                     isActive ? "animate-fadeInUp" : ""
  //                   }`}
  //                 />

  //                 <h1
  //                   className={`text-5xl md:text-[70px] font-semibold text-white leading-tight ${
  //                     isActive ? "animate-fadeInUp delay-100" : ""
  //                   }`}
  //                 >
  //                   {movie.title}
  //                 </h1>

  //                 <div
  //                   className={`flex items-center gap-4 text-gray-300 ${
  //                     isActive ? "animate-fadeInUp delay-200" : ""
  //                   }`}
  //                 >
  //                   <span>{movie.genre}</span>

  //                   <span className="flex items-center gap-1">
  //                     {movie.year} <CalendarIcon className="w-4 h-4" />
  //                   </span>

  //                   <span className="flex items-center gap-1">
  //                     <ClockIcon className="w-4 h-4" />
  //                     {movie.duration}
  //                   </span>
  //                 </div>

  //                 <p
  //                   className={`text-gray-400 text-lg ${
  //                     isActive ? "animate-fadeInUp delay-300" : ""
  //                   }`}
  //                 >
  //                   {movie.description}
  //                 </p>

  //                 <button
  //                   onClick={() => navigate("/movies")}
  //                   className={`mt-4 flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 rounded-full text-white font-bold shadow-lg ${
  //                     isActive ? "animate-fadeInUp delay-500" : ""
  //                   }`}
  //                 >
  //                   Explore Movies <ArrowRight className="w-5 h-5" />
  //                 </button>
  //               </div>
  //             </div>
  //           )}
  //         </SwiperSlide>
  //       ))}
  //     </Swiper>

  //     {/* THUMBNAILS */}
  //     <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
  //       {movieData.map((movie, index) => (
  //         <img
  //           key={movie.id}
  //           src={movie.bgImage}
  //           onClick={() => swiperRef.current.slideTo(index)}
  //           className="w-20 h-12 object-cover rounded cursor-pointer opacity-70 hover:opacity-100 border border-white/20"
  //         />
  //       ))}
  //     </div>

  //     {/* CUSTOM STYLES */}
  //     <style>{`
  //       .swiper-pagination-bullet {
  //         background: white !important;
  //         opacity: 0.5;
  //       }
  //       .swiper-pagination-bullet-active {
  //         background: #E50914 !important;
  //         opacity: 1;
  //         width: 25px;
  //         border-radius: 5px;
  //       }

  //       @keyframes fadeInUp {
  //         from {
  //           opacity: 0;
  //           transform: translateY(30px);
  //         }
  //         to {
  //           opacity: 1;
  //           transform: translateY(0);
  //         }
  //       }

  //       .animate-fadeInUp {
  //         animation: fadeInUp 0.8s ease forwards;
  //       }

  //       .delay-100 { animation-delay: 0.1s; }
  //       .delay-200 { animation-delay: 0.2s; }
  //       .delay-300 { animation-delay: 0.3s; }
  //       .delay-500 { animation-delay: 0.5s; }

  //       @keyframes zoomOut {
  //         from {
  //           transform: scale(1.1);
  //         }
  //         to {
  //           transform: scale(1);
  //         }
  //       }

  //       .animate-zoomOut {
  //         animation: zoomOut 5s linear;
  //       }
  //     `}</style>
  //   </div>
  // );

  // return (
  //   <div className="relative h-screen w-full overflow-hidden">
  //     <Swiper
  //       onSwiper={(swiper) => (swiperRef.current = swiper)}
  //       modules={[Autoplay, Pagination, EffectFade]}
  //       effect="fade"
  //       speed={800}
  //       autoplay={{ delay: 5000, disableOnInteraction: false }}
  //       pagination={{ clickable: true, dynamicBullets: true }}
  //       className="h-full w-full"
  //     >
  //       {movieData.map((movie) => (
  //         <SwiperSlide key={movie.id}>
  //           {({ isActive }) => (
  //             <div
  //               className="h-full w-full relative flex flex-col items-start justify-center px-6 md:px-16 lg:px-36" // Purana layout restore kiya
  //               style={{
  //                 backgroundImage: `url(${movie.bgImage})`,
  //                 backgroundSize: "cover",
  //                 backgroundPosition: "center",
  //               }}
  //             >
  //               {/* Overlay - Content visibility ke liye zaroori h */}
  //               <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10"></div>

  //               {/* Background Zoom Animation */}
  //               <div
  //                 className={`absolute inset-0 bg-cover bg-center -z-0 ${
  //                   isActive ? "animate-zoomOut" : ""
  //                 }`}
  //                 style={{ backgroundImage: `url(${movie.bgImage})` }}
  //               ></div>

  //               {/* CONTENT - Ab yeh exactly purane position pe aayega */}
  //               <div className="relative z-20 flex flex-col gap-4 max-w-2xl">
  //                 <img
  //                   src={movie.logo}
  //                   alt="logo"
  //                   className={`max-h-11 mt-20 self-start ${
  //                     // Logo ko left rakha
  //                     isActive ? "animate-fadeInUp" : "opacity-0"
  //                   }`}
  //                 />

  //                 <h1
  //                   className={`text-5xl md:text-[70px] font-semibold text-white leading-tight ${
  //                     isActive ? "animate-fadeInUp delay-100" : "opacity-0"
  //                   }`}
  //                 >
  //                   {movie.title}
  //                 </h1>

  //                 <div
  //                   className={`flex items-center gap-4 text-gray-300 ${
  //                     isActive ? "animate-fadeInUp delay-200" : "opacity-0"
  //                   }`}
  //                 >
  //                   <span>{movie.genre}</span>
  //                   <div className="flex items-center gap-1">
  //                     <p>{movie.year}</p>
  //                     <CalendarIcon className="w-4.5 h-4.5" />
  //                   </div>
  //                   <div className="flex items-center gap-1">
  //                     <ClockIcon className="w-4.5 h-4.5" />
  //                     {movie.duration}
  //                   </div>
  //                 </div>

  //                 <p
  //                   className={`max-w-md text-gray-300 text-lg ${
  //                     isActive ? "animate-fadeInUp delay-300" : "opacity-0"
  //                   }`}
  //                 >
  //                   {movie.description}
  //                 </p>

  //                 <button
  //                   onClick={() => navigate("/movies")}
  //                   className={`mt-4 flex items-center self-start gap-1 px-6 py-3 text-sm bg-red-600 hover:bg-red-700 transition rounded-full font-medium cursor-pointer text-white ${
  //                     isActive ? "animate-fadeInUp delay-500" : "opacity-0"
  //                   }`}
  //                 >
  //                   Explore Movies <ArrowRight className="w-5 h-5" />
  //                 </button>
  //               </div>
  //             </div>
  //           )}
  //         </SwiperSlide>
  //       ))}
  //     </Swiper>

  //     {/* THUMBNAILS - Inhe thoda right shift kiya h taaki bullets se na takrayein */}
  //     <div className="absolute bottom-10 left-6 md:left-16 lg:left-36 flex gap-3 z-30">
  //       {movieData.map((movie, index) => (
  //         <img
  //           key={movie.id}
  //           src={movie.bgImage}
  //           onClick={() => swiperRef.current.slideTo(index)}
  //           className="w-20 h-12 object-cover rounded cursor-pointer opacity-50 hover:opacity-100 border border-white/20 transition-all"
  //         />
  //       ))}
  //     </div>

  //     {/* CUSTOM STYLES remain the same */}
  //     <style>{`
  //      /* ... aapka purana style block ... */
  //      .opacity-0 { opacity: 0; }
  //   `}</style>
  //   </div>
  // );

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={800}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        className="h-full w-full"
      >
        {movieData.map((movie) => (
          <SwiperSlide key={movie.id}>
            {({ isActive }) => (
              <div
                className="h-full w-full relative flex flex-col items-start justify-center px-6 md:px-16 lg:px-36"
                style={{
                  backgroundImage: `url(${movie.bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10"></div>

                <div
                  className={`absolute inset-0 bg-cover bg-center -z-0 ${
                    isActive ? "animate-zoomOut" : ""
                  }`}
                  style={{ backgroundImage: `url(${movie.bgImage})` }}
                ></div>

                <div className="relative z-20 flex flex-col gap-4">
                  <img
                    src={movie.logo}
                    alt="logo"
                    className={`max-h-25 mt-20 self-start ${
                      isActive ? "animate-fadeInUp" : "opacity-0"
                    }`}
                  />

                  {/* FIX 1: Max-width added for Title Control */}
                  <h1
                    className={`text-5xl md:text-[70px] font-semibold text-white leading-tight max-w-[600px] ${
                      isActive ? "animate-fadeInUp delay-100" : "opacity-0"
                    }`}
                  >
                    {movie.title}
                  </h1>

                  <div
                    className={`flex items-center gap-4 text-gray-300 ${
                      isActive ? "animate-fadeInUp delay-200" : "opacity-0"
                    }`}
                  >
                    <span>{movie.genre}</span>
                    <div className="flex items-center gap-1">
                      <p>{movie.year}</p>
                      <CalendarIcon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4.5 h-4.5" />
                      {movie.duration}
                    </div>
                  </div>

                  <p
                    className={`max-w-md text-gray-300 text-lg ${
                      isActive ? "animate-fadeInUp delay-300" : "opacity-0"
                    }`}
                  >
                    {movie.description}
                  </p>

                  <button
                    onClick={() => navigate("/movies")}
                    className={`mt-4 flex items-center self-start gap-1 px-6 py-3 text-sm bg-red-600 hover:bg-red-700 transition rounded-full font-medium cursor-pointer text-white ${
                      isActive ? "animate-fadeInUp delay-500" : "opacity-0"
                    }`}
                  >
                    Explore Movies <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* FIX 2: Thumbnails centered at the bottom */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {movieData.map((movie, index) => (
          <img
            key={movie.id}
            src={movie.bgImage}
            onClick={() => swiperRef.current.slideTo(index)}
            className="w-20 h-12 object-cover rounded-md cursor-pointer opacity-50 hover:opacity-100 border border-white/20 transition-all hover:scale-110"
          />
        ))}
      </div>

      <style>{`
       .opacity-0 { opacity: 0; }
       /* Swiper pagination ko thoda niche shift karne ke liye agar thumbnails ke upar aa raha ho */
       .swiper-pagination { bottom: 5px !important; }
    `}</style>
    </div>
  );
};

export default HeroSection;
// export default HeroSection;
