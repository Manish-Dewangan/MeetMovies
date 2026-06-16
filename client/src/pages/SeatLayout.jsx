import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import {
  ArrowRightIcon,
  ClockIcon,
  CalendarDays,
  Armchair,
  Ticket,
  Sparkles,
  Info,
} from "lucide-react";
import isoTimeFormat from "../lib/IsoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const { id, date } = useParams();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const navigate = useNavigate();
  const { axios, getToken, user } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);

      if (data.success) {
        setShow(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load show details");
    }
  };

  const availableTimes = useMemo(() => {
    return show?.dateTime?.[date] || [];
  }, [show, date]);

  const selectedDateLabel = useMemo(() => {
    if (!date) return "Selected Date";

    const dateObj = new Date(date);

    if (Number.isNaN(dateObj.getTime())) return date;

    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, [date]);

  const selectedTimeLabel = selectedTime
    ? isoTimeFormat(selectedTime.time)
    : "Choose a time";

  const handleTimeSelect = (item) => {
    setSelectedTime(item);
    setSelectedSeats([]);
    setOccupiedSeats([]);
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select a time first", { icon: "⚠️" });
    }

    const currentOccupied = occupiedSeats || [];

    if (currentOccupied.includes(seatId)) {
      return toast.error("This seat is already booked");
    }

    const isAlreadySelected = selectedSeats.includes(seatId);

    if (!isAlreadySelected && selectedSeats.length >= 5) {
      return toast("You can select maximum 5 seats", { icon: "⚠️" });
    }

    setSelectedSeats((prev) =>
      isAlreadySelected
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId],
    );
  };

  const getOccupiedSeats = async () => {
    try {
      if (!selectedTime?.showId) return;

      const { data } = await axios.get(
        `/api/booking/seats/${selectedTime.showId}`,
      );

      if (data.success) {
        const seats = data.occupiedSeats || data.message || [];
        setOccupiedSeats(Array.isArray(seats) ? seats : []);
      } else {
        setOccupiedSeats([]);
        toast.error(data.message || "Failed to fetch seats");
      }
    } catch (error) {
      console.log("Error fetching seats:", error);
      setOccupiedSeats([]);
    }
  };

  const bookTickets = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");

      if (!selectedTime) {
        return toast.error("Please select a show time");
      }

      if (!selectedSeats.length) {
        return toast.error("Please select at least one seat");
      }

      const token = await getToken();

      const { data } = await axios.post(
        "/api/booking/create",
        {
          showId: selectedTime.showId,
          selectedSeats,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex items-center gap-3">
      {/* Row Label */}
      <span className="w-6 text-center text-xs font-semibold text-gray-500">
        {row}
      </span>

      {/* Seats */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isOccupied = occupiedSeats?.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);

          return (
            <button
              key={seatId}
              type="button"
              onClick={() => handleSeatClick(seatId)}
              aria-pressed={isSelected}
              title={
                isOccupied
                  ? "Already booked"
                  : isSelected
                    ? "Selected"
                    : "Available"
              }
              className={`relative h-9 w-9 rounded-lg border text-[10px] font-semibold transition-all duration-300
                ${i === 4 ? "mr-5" : ""}
                ${
                  isOccupied
                    ? "cursor-not-allowed border-zinc-700 bg-zinc-800/90 text-zinc-500 opacity-60"
                    : isSelected
                      ? "border-red-500 bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                      : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-red-500/40 hover:bg-red-500/10 hover:text-white"
                }`}
            >
              {seatId}

              {isSelected && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-white ring-2 ring-red-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  useEffect(() => {
    getShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTime]);

  if (!show) return <Loading />;

  return (
    <section className="relative min-h-screen overflow-hidden px-6 md:px-16 lg:px-24 xl:px-36 pt-32 pb-24">
      {/* Background Effects */}
      <BlurCircle top="100px" left="-80px" />
      <BlurCircle bottom="120px" right="-80px" />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(229,9,20,0.06),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_30%)]" />

      {/* Page Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Seat Booking
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Select Your Seats
        </h1>

        <p className="text-gray-400 mt-3 max-w-2xl text-sm md:text-base">
          Choose your preferred show time and pick the best seats for your movie
          experience.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Available Timings Sidebar */}
        <aside className="w-full lg:w-72 h-max lg:sticky lg:top-28 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm font-semibold">Selected Date</span>
            </div>

            <p className="text-xl font-bold text-white">{selectedDateLabel}</p>
          </div>

          {/* Timings */}
          <div className="p-6">
            <p className="text-sm font-semibold text-gray-300 mb-4">
              Available Timings
            </p>

            {availableTimes.length > 0 ? (
              <div className="space-y-2">
                {availableTimes.map((item, index) => {
                  const isActive =
                    selectedTime?.showId === item.showId ||
                    selectedTime?.time === item.time;

                  return (
                    <button
                      key={item.showId || item.time || index}
                      type="button"
                      onClick={() => handleTimeSelect(item)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-all duration-300
                        ${
                          isActive
                            ? "border-red-500/40 bg-red-600 text-white shadow-lg shadow-red-600/20"
                            : "border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.08] hover:border-red-500/25"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {isoTimeFormat(item.time)}
                        </span>
                      </span>

                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <p className="text-sm text-yellow-300">
                    No show timings available for this date.
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Seat Layout Main */}
        <main className="relative flex-1">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/30 p-5 md:p-8">
            {/* Top Info Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Theater Layout
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Maximum 5 seats can be selected at once.
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/10 bg-white/[0.04]">
                <ClockIcon className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-400">Time:</span>
                <span className="text-sm font-semibold text-white">
                  {selectedTimeLabel}
                </span>
              </div>
            </div>

            {/* Screen */}
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-3xl">
                <div className="absolute inset-x-8 top-2 h-10 bg-red-500/20 blur-3xl" />

                <img
                  src={assets.screenImage}
                  alt="Screen"
                  className="relative mx-auto w-full max-w-2xl opacity-90"
                />

                <p className="text-center text-xs tracking-[0.35em] text-gray-500 mt-2">
                  SCREEN SIDE
                </p>
              </div>

              {/* Legend */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-md border border-white/10 bg-white/[0.04]" />
                  <span className="text-gray-400">Available</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-md bg-red-600 shadow shadow-red-600/30" />
                  <span className="text-gray-400">Selected</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-md bg-zinc-800 opacity-70" />
                  <span className="text-gray-400">Booked</span>
                </div>
              </div>

              {/* Seats Area */}
              <div className="mt-10 w-full overflow-x-auto no-scrollbar pb-4">
                <div className="min-w-[680px] flex flex-col items-center">
                  {/* Front Rows */}
                  <div className="space-y-3 mb-8">
                    {groupRows[0].map((row) => renderSeats(row))}
                  </div>

                  {/* Middle + Back Rows */}
                  <div className="grid grid-cols-2 gap-x-14 gap-y-3">
                    {groupRows.slice(1).map((group, index) => (
                      <div key={index} className="space-y-3">
                        {group.map((row) => renderSeats(row))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Ticket className="w-4 h-4 text-red-400" />
                    <h3 className="font-semibold text-white">
                      Booking Summary
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {selectedSeats.length > 0 ? (
                      selectedSeats.map((seat) => (
                        <span
                          key={seat}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold"
                        >
                          <Armchair className="w-3 h-3" />
                          {seat}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No seats selected yet.
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Selected Seats:{" "}
                    <span className="text-gray-300 font-medium">
                      {selectedSeats.length}/5
                    </span>
                  </p>
                </div>

                <button
                  onClick={bookTickets}
                  className={`group flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95
                    ${
                      selectedTime && selectedSeats.length
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25 hover:scale-105"
                        : "bg-white/10 text-gray-400 hover:bg-white/15"
                    }`}
                >
                  Proceed to Checkout
                  <ArrowRightIcon
                    strokeWidth={3}
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default SeatLayout;
