import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import {
  CheckIcon,
  StarIcon,
  X,
  Plus,
  CalendarPlus,
  Clock3,
  IndianRupee,
  Film,
  Sparkles,
  Clapperboard,
  Loader2,
  CalendarDays,
  Info,
} from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddShows = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);

  const fetchNowPlayingMovies = async (retries = 3) => {
    try {
      const { data } = await axios.get("/api/show/now-playing", {
        headers: { Authorization: `Bearer ${await getToken()}` },
        timeout: 5000,
      });

      if (data.success) {
        setNowPlayingMovies(data.movies);
      } else {
        throw new Error("API failed");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      if (retries > 0) {
        await new Promise((res) => setTimeout(res, 1000));
        return fetchNowPlayingMovies(retries - 1);
      }
    }
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput)
      return toast("Please select a date and time", { icon: "⚠️" });

    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (times.includes(time)) {
        toast("This time slot already exists", { icon: "⚠️" });
        return prev;
      }
      return { ...prev, [date]: [...times, time] };
    });

    setDateTimeInput("");
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    });
  };

  const handleSubmit = async () => {
    try {
      setAddingShow(true);

      if (!selectedMovie) return toast.error("Please select a movie");
      if (Object.keys(dateTimeSelection).length === 0)
        return toast.error("Please add at least one date & time");
      if (!showPrice) return toast.error("Please enter a show price");

      const showsInput = Object.entries(dateTimeSelection).map(
        ([date, time]) => ({ date, time }),
      );

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice),
      };

      const { data } = await axios.post("/api/show/add", payload, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success(data.message);
        setSelectedMovie(null);
        setDateTimeSelection({});
        setShowPrice("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setAddingShow(false);
    }
  };

  const selectedMovieData = nowPlayingMovies.find(
    (m) => m.id === selectedMovie,
  );

  const totalSlots = Object.values(dateTimeSelection).reduce(
    (sum, times) => sum + times.length,
    0,
  );

  useEffect(() => {
    if (user) fetchNowPlayingMovies();
  }, [user]);

  if (nowPlayingMovies.length === 0) return <Loading />;

  return (
    <div className="space-y-10">
      <Title text1="Add" text2="Shows" />

      {/* ── Step 1: Select Movie ── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
            1
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Select Movie</h2>
            <p className="text-gray-400 text-sm">
              Choose from currently playing movies on TMDB
            </p>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar pb-2">
          <div className="flex gap-4 w-max">
            {nowPlayingMovies.map((movie) => {
              const isSelected = selectedMovie === movie.id;

              return (
                <div
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie.id)}
                  className={`group relative flex-shrink-0 w-40 cursor-pointer transition-all duration-300
                    ${isSelected ? "scale-[1.03]" : "hover:-translate-y-1 opacity-70 hover:opacity-100"}`}
                >
                  {/* Card */}
                  <div
                    className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300
                      ${
                        isSelected
                          ? "border-red-500 shadow-lg shadow-red-600/20"
                          : "border-transparent hover:border-white/15"
                      }`}
                  >
                    <img
                      src={image_base_url + movie.poster_path}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Rating */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3">
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-yellow-400 text-xs font-semibold">
                          {movie.vote_average?.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {kConverter(movie.vote_count)}
                      </span>
                    </div>

                    {/* Selected Checkmark */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 shadow-lg shadow-red-600/30">
                        <CheckIcon
                          className="w-4 h-4 text-white"
                          strokeWidth={3}
                        />
                      </div>
                    )}
                  </div>

                  {/* Info below card */}
                  <div className="mt-2 px-1">
                    <p
                      className={`text-sm font-medium truncate transition-colors ${
                        isSelected ? "text-red-400" : "text-white"
                      }`}
                    >
                      {movie.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {movie.release_date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected movie summary */}
        {selectedMovieData && (
          <div className="mt-6 flex items-center gap-3 px-4 py-3 rounded-2xl border border-red-500/20 bg-red-500/10">
            <CheckIcon className="w-4 h-4 text-red-400" />
            <p className="text-sm text-red-300">
              Selected:{" "}
              <span className="font-semibold text-white">
                {selectedMovieData.title}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* ── Step 2: Show Price ── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
            2
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Set Ticket Price
            </h2>
            <p className="text-gray-400 text-sm">
              Set the price per ticket for this show
            </p>
          </div>
        </div>

        <div className="relative max-w-sm">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
            {currency}
          </div>
          <input
            min={0}
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter show price"
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-gray-500 text-sm outline-none focus:border-red-500/40 focus:bg-white/8 transition-all duration-300"
          />
        </div>

        {showPrice && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
            <Info className="w-3.5 h-3.5" />
            <span>
              Ticket price:{" "}
              <span className="text-white font-medium">
                {currency}
                {showPrice}
              </span>{" "}
              per seat
            </span>
          </div>
        )}
      </div>

      {/* ── Step 3: Date & Time ── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
            3
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Schedule Show Times
            </h2>
            <p className="text-gray-400 text-sm">
              Add date and time slots for this show
            </p>
          </div>
        </div>

        {/* DateTime Input */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <CalendarPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="datetime-local"
              value={dateTimeInput}
              onChange={(e) => setDateTimeInput(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-red-500/40 focus:bg-white/8 transition-all duration-300"
            />
          </div>

          <button
            onClick={handleDateTimeAdd}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Slot
          </button>
        </div>

        {/* Selected Date-Times */}
        {Object.keys(dateTimeSelection).length > 0 && (
          <div className="mt-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-300">
                Scheduled Slots
              </h3>
              <span className="text-xs text-gray-500">
                {totalSlots} {totalSlots === 1 ? "slot" : "slots"} added
              </span>
            </div>

            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <div
                key={date}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-white">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {times.map((time) => (
                    <div
                      key={time}
                      className="group/chip flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/10 transition-all duration-200 hover:border-red-500/40"
                    >
                      <Clock3 className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-sm font-medium text-red-300">
                        {time}
                      </span>
                      <button
                        onClick={() => handleRemoveTime(date, time)}
                        className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Submit Summary ── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
            4
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Review & Submit
            </h2>
            <p className="text-gray-400 text-sm">
              Verify all details before adding the show
            </p>
          </div>
        </div>

        {/* Summary Table */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-gray-500 mb-1">Movie</p>
            <p className="text-sm font-semibold text-white truncate">
              {selectedMovieData?.title || "Not selected"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-gray-500 mb-1">Ticket Price</p>
            <p className="text-sm font-semibold text-white">
              {showPrice ? `${currency}${showPrice}` : "Not set"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-gray-500 mb-1">Time Slots</p>
            <p className="text-sm font-semibold text-white">
              {totalSlots} {totalSlots === 1 ? "slot" : "slots"}
            </p>
          </div>
        </div>

        {/* Validation Checks */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { ok: !!selectedMovie, label: "Movie selected" },
            { ok: !!showPrice, label: "Price set" },
            { ok: totalSlots > 0, label: "Time slots added" },
          ].map(({ ok, label }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                ok
                  ? "border-green-500/20 bg-green-500/10 text-green-400"
                  : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {ok ? (
                <CheckIcon className="w-3 h-3" />
              ) : (
                <Info className="w-3 h-3" />
              )}
              {label}
            </span>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={addingShow}
          className={`group flex items-center justify-center gap-2 px-10 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95
            ${
              addingShow
                ? "bg-white/10 text-gray-400 cursor-not-allowed"
                : selectedMovie && showPrice && totalSlots > 0
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25 hover:scale-105 cursor-pointer"
                  : "bg-white/10 text-gray-400 cursor-not-allowed"
            }`}
        >
          {addingShow ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding Show...
            </>
          ) : (
            <>
              <Clapperboard className="w-4 h-4" />
              Add Show
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddShows;
