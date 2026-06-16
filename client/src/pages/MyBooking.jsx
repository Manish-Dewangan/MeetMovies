import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Sparkles,
  Calendar,
  Clock3,
  Armchair,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Film,
  ArrowRight,
  ReceiptText,
  Popcorn,
  Download,
} from "lucide-react";

const MyBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { axios, getToken, user, image_base_url } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/user/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      getMyBookings();
    }
  }, [user]);

  if (isLoading) return <Loading />;

  return (
    <section className="relative min-h-screen overflow-hidden px-6 md:px-16 lg:px-24 xl:px-36 pt-32 pb-24">
      {/* Background */}
      <BlurCircle top="80px" left="-60px" />
      <BlurCircle bottom="100px" right="-40px" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(229,9,20,0.06),transparent_40%)]" />

      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium mb-4">
          <Ticket className="w-4 h-4" />
          Your Tickets
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              My Bookings
            </h1>
            <p className="text-gray-400 mt-3 max-w-xl text-sm md:text-base">
              View all your movie ticket bookings. Keep track of upcoming shows
              and past experiences.
            </p>
          </div>

          {/* Booking count */}
          {bookings.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md self-start md:self-auto">
              <ReceiptText className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-white">
                {bookings.length}
              </span>
              <span className="text-sm text-gray-400">
                {bookings.length === 1 ? "Booking" : "Bookings"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="flex flex-col gap-5 max-w-4xl">
          {bookings.map((item, index) => {
            const movie = item?.show?.movie;
            const showTime = item?.show?.showDateTime;
            const isPaid = item?.isPaid;
            const seats = item?.bookedSeats || [];

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.05] to-white/[0.02] backdrop-blur-md transition-all duration-300 hover:border-red-500/20"
              >
                {/* Glow */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

                <div className="relative flex flex-col md:flex-row">
                  {/* Poster */}
                  <div className="relative flex-shrink-0 overflow-hidden md:w-56">
                    {movie?.poster_path ? (
                      <img
                        src={image_base_url + movie.poster_path}
                        alt={movie?.title}
                        className="w-full h-48 md:h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-48 md:h-full bg-zinc-800 flex items-center justify-center">
                        <Film className="w-10 h-10 text-gray-600" />
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />

                    {/* Payment badge on poster */}
                    <div className="absolute top-3 left-3">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold backdrop-blur-md">
                          <CheckCircle2 className="w-3 h-3" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-semibold backdrop-blur-md">
                          <AlertCircle className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col md:flex-row justify-between p-5 md:p-6 gap-5">
                    {/* Left Info */}
                    <div className="flex flex-col gap-3 flex-1">
                      {/* Title */}
                      <h2
                        onClick={() => navigate(`/movies/${item?.show?._id}`)}
                        className="text-xl font-bold text-white cursor-pointer hover:text-red-400 transition-colors leading-tight"
                      >
                        {movie?.title}
                      </h2>

                      {/* Meta pills */}
                      <div className="flex flex-wrap items-center gap-2">
                        {movie?.runtime && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300">
                            <Clock3 className="w-3 h-3 text-red-400" />
                            {timeFormat(movie.runtime)}
                          </span>
                        )}

                        {showTime && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300">
                            <Calendar className="w-3 h-3 text-red-400" />
                            {dateFormat(showTime)}
                          </span>
                        )}
                      </div>

                      {/* Seats */}
                      <div className="mt-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Armchair className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">
                            {seats.length}{" "}
                            {seats.length === 1 ? "Seat" : "Seats"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {seats.map((seat, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold"
                            >
                              {seat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right - Price & Actions */}
                    <div className="flex flex-col items-start md:items-end justify-between gap-4 md:min-w-[160px]">
                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">
                          Total Amount
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {currency}
                          {item.amount}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        {!isPaid ? (
                          <button className="flex-1 md:flex-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-600/20 transition-all duration-300 hover:scale-105 cursor-pointer">
                            <CreditCard className="w-4 h-4" />
                            Pay Now
                          </button>
                        ) : (
                          <button className="flex-1 md:flex-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all duration-300 cursor-pointer">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className={`h-0.5 w-full ${
                    isPaid
                      ? "bg-gradient-to-r from-green-500/40 via-green-500/20 to-transparent"
                      : "bg-gradient-to-r from-yellow-500/40 via-yellow-500/20 to-transparent"
                  }`}
                />
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="relative mx-auto mb-8">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
                <Popcorn className="h-12 w-12 text-gray-600" />
              </div>
              <div className="absolute inset-0 mx-auto h-28 w-28 rounded-full border border-red-500/10 animate-ping opacity-20" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white">
              No bookings yet
            </h2>

            <p className="mt-4 text-gray-400 text-sm md:text-base leading-relaxed">
              You haven't booked any movie tickets yet. Browse our collection
              and book your first show!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <button
                onClick={() => {
                  navigate("/movies");
                  scrollTo(0, 0);
                }}
                className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-600/20 transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                Browse Movies
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  navigate("/");
                  scrollTo(0, 0);
                }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-gray-200 text-sm font-medium transition-all duration-300"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyBooking;
