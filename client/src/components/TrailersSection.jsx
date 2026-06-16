import React, { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import ReactPlayer from "react-player";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon, Sparkles } from "lucide-react";

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <section className="relative px-6 md:px-16 lg:px-24 xl:px-36 py-20 overflow-hidden">
      <BlurCircle top="-100px" right="-100px" />
      <BlurCircle bottom="-80px" left="-80px" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Latest Trailers
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Watch Movie Trailers
          </h2>

          <p className="text-gray-400 mt-3 max-w-2xl">
            Explore the latest trailers and get ready for your next cinematic
            experience.
          </p>
        </div>

        {/* Main Video Player */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl">
          <div className="aspect-video w-full">
            <ReactPlayer
              src={currentTrailer.videoUrl}
              controls
              width="100%"
              height="100%"
              className="react-player"
            />
          </div>
        </div>

        {/* Trailer Thumbnails */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {dummyTrailers.map((trailer, index) => {
            const isActive = currentTrailer.videoUrl === trailer.videoUrl;

            return (
              <div
                key={index}
                onClick={() => setCurrentTrailer(trailer)}
                className={`relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 group
                  ${
                    isActive
                      ? "border-red-500 scale-[1.02] shadow-lg shadow-red-600/20"
                      : "border-white/10 hover:border-white/20 hover:-translate-y-1"
                  }`}
              >
                <div className="relative aspect-video">
                  <img
                    src={trailer.image}
                    alt={trailer.title || "Trailer"}
                    className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition duration-300" />

                  <PlayCircleIcon
                    strokeWidth={1.6}
                    className={`absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 transition duration-300
                      ${isActive ? "text-red-500" : "text-white"}
                    `}
                  />

                  {isActive && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-red-600 text-white text-[10px] font-semibold">
                      Now Playing
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrailersSection;
