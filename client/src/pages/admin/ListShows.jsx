import React, { useEffect, useState, useCallback } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  SearchIcon,
  RefreshCwIcon,
  FilmIcon,
  CalendarIcon,
  TicketIcon,
  CircleDollarSignIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  InboxIcon,
  TrendingUpIcon,
  ClockIcon,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 8;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const COLUMNS = [
  { key: "movie", label: "Movie", icon: FilmIcon },
  { key: "time", label: "Show Time", icon: CalendarIcon },
  { key: "bookings", label: "Total Bookings", icon: TicketIcon },
  { key: "earnings", label: "Earnings", icon: CircleDollarSignIcon },
  { key: "status", label: "Status", icon: null, sortable: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getShowStatus = (showDateTime) => {
  const now = new Date();
  const show = new Date(showDateTime);
  const diff = show - now;
  const hours = diff / (1000 * 60 * 60);

  if (diff < 0)
    return {
      label: "Completed",
      color: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    };
  if (hours <= 3)
    return {
      label: "Starting Soon",
      color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    };
  if (hours <= 24)
    return {
      label: "Today",
      color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    };
  return {
    label: "Upcoming",
    color: "text-green-400 bg-green-400/10 border-green-400/20",
  };
};

const getOccupancyColor = (rate) => {
  if (rate >= 80) return "bg-green-500";
  if (rate >= 50) return "bg-yellow-500";
  if (rate >= 20) return "bg-orange-500";
  return "bg-red-500";
};

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// ─── Sub-components ───────────────────────────────────────────────────────────
const SortIcon = ({ column, sortConfig }) => {
  if (sortConfig.key !== column)
    return <ChevronsUpDownIcon className="w-3.5 h-3.5 text-gray-500" />;
  return sortConfig.direction === "asc" ? (
    <ChevronUpIcon className="w-3.5 h-3.5 text-primary" />
  ) : (
    <ChevronDownIcon className="w-3.5 h-3.5 text-primary" />
  );
};

const SummaryCard = ({ icon: Icon, label, value, sub, highlight = false }) => (
  <div
    className={`flex items-center gap-3 px-5 py-4 rounded-xl border transition-all duration-200
      ${
        highlight
          ? "bg-primary/15 border-primary/30"
          : "bg-white/5 border-white/10"
      }`}
  >
    <div className="p-2 rounded-lg bg-primary/20">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const OccupancyBar = ({ occupied, total }) => {
  const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
  const barColor = getOccupancyColor(rate);

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 shrink-0">{occupied}</span>
    </div>
  );
};

const StatusBadge = ({ showDateTime }) => {
  const status = getShowStatus(showDateTime);
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${status.color}`}
    >
      {status.label === "Starting Soon" && (
        <ClockIcon className="w-3 h-3 animate-pulse" />
      )}
      {status.label}
    </span>
  );
};

const EmptyState = ({ query }) => (
  <tr>
    <td colSpan={COLUMNS.length + 1}>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <InboxIcon className="w-12 h-12 text-primary/20 mb-3" />
        <p className="text-gray-400 font-medium">
          {query ? `No shows match "${query}"` : "No shows found"}
        </p>
        <p className="text-gray-600 text-sm mt-1">
          {query
            ? "Try a different search term."
            : "Shows will appear here once added."}
        </p>
      </div>
    </td>
  </tr>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user } = useAppContext();

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // ── Fetch with retry ───────────────────────────────────────────────────────
  const getAllShows = useCallback(
    async (isRefresh = false, retries = MAX_RETRIES) => {
      try {
        if (isRefresh) setRefreshing(true);

        const { data } = await axios.get("/api/admin/all-shows", {
          headers: { Authorization: `Bearer ${await getToken()}` },
          timeout: 5000,
        });

        if (data.success) {
          setShows(data.shows || []);
          if (isRefresh) toast.success("Shows refreshed");
        } else {
          throw new Error(data.message || "Failed to fetch shows");
        }
      } catch (error) {
        if (retries > 0) {
          await sleep(RETRY_DELAY);
          return getAllShows(isRefresh, retries - 1);
        }
        console.error("All retries exhausted:", error);
        toast.error("Failed to fetch shows");
        setShows([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [axios, getToken],
  );

  useEffect(() => {
    if (user) getAllShows();
  }, [user, getAllShows]);

  // ── Sort ───────────────────────────────────────────────────────────────────
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const filtered = shows.filter((show) =>
    show.movie.title.toLowerCase().includes(query.toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const dir = sortConfig.direction === "asc" ? 1 : -1;

    const occupiedA = Object.keys(a.occupiedSeats).length;
    const occupiedB = Object.keys(b.occupiedSeats).length;

    const map = {
      movie: [a.movie.title, b.movie.title],
      time: [a.showDateTime, b.showDateTime],
      bookings: [occupiedA, occupiedB],
      earnings: [occupiedA * a.showPrice, occupiedB * b.showPrice],
    };

    const [va, vb] = map[sortConfig.key] ?? ["", ""];
    return va < vb ? -dir : va > vb ? dir : 0;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // ── Summary stats ──────────────────────────────────────────────────────────
  const totalBookings = shows.reduce(
    (sum, s) => sum + Object.keys(s.occupiedSeats).length,
    0,
  );
  const totalEarnings = shows.reduce(
    (sum, s) => sum + Object.keys(s.occupiedSeats).length * s.showPrice,
    0,
  );
  const upcomingCount = shows.filter(
    (s) => new Date(s.showDateTime) > new Date(),
  ).length;

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <Title text1="List" text2="Shows" />

        <button
          onClick={() => getAllShows(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300
                     bg-white/5 border border-white/10 rounded-lg hover:bg-white/10
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <RefreshCwIcon
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-3">
        <SummaryCard
          icon={FilmIcon}
          label="Total Shows"
          value={shows.length.toLocaleString()}
          sub={`${upcomingCount} upcoming`}
        />
        <SummaryCard
          icon={TicketIcon}
          label="Total Bookings"
          value={totalBookings.toLocaleString()}
        />
        <SummaryCard
          icon={TrendingUpIcon}
          label="Total Earnings"
          value={`${currency}${totalEarnings.toLocaleString()}`}
          highlight
        />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search by movie title…"
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg
                     text-sm text-white placeholder-gray-500 outline-none
                     focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm text-nowrap">
          {/* Head */}
          <thead>
            <tr className="bg-primary/20 text-left">
              <th className="p-3 pl-5 text-xs font-semibold text-gray-300 uppercase tracking-wider w-8">
                #
              </th>

              {COLUMNS.map(({ key, label, icon: Icon, sortable = true }) => (
                <th
                  key={key}
                  onClick={() => sortable && handleSort(key)}
                  className={`p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider
                    ${sortable ? "cursor-pointer hover:text-white select-none" : ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {label}
                    {sortable && (
                      <SortIcon column={key} sortConfig={sortConfig} />
                    )}
                  </div>
                </th>
              ))}

              {/* Occupancy column — no sort */}
              <th className="p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Occupancy
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-white/5">
            {paginated.length > 0 ? (
              paginated.map((show, index) => {
                const occupied = Object.keys(show.occupiedSeats).length;
                const earnings = occupied * show.showPrice;

                // Total seats — fall back gracefully if not provided
                const totalSeats =
                  show.totalSeats ?? show.seatsLayout?.flat().length ?? 100;
                const rowNum = (page - 1) * ITEMS_PER_PAGE + index + 1;

                return (
                  <tr
                    key={show._id ?? index}
                    className="bg-white/3 hover:bg-primary/10 transition-colors duration-150"
                  >
                    {/* Row number */}
                    <td className="p-3 pl-5 text-gray-500 text-xs">{rowNum}</td>

                    {/* Movie */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <FilmIcon className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="font-medium text-white">
                          {show.movie.title}
                        </span>
                      </div>
                    </td>

                    {/* Show Time */}
                    <td className="p-3 text-gray-400">
                      {dateFormat(show.showDateTime)}
                    </td>

                    {/* Total Bookings */}
                    <td className="p-3">
                      <span className="font-semibold text-white">
                        {occupied.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-xs ml-1">seats</span>
                    </td>

                    {/* Earnings */}
                    <td className="p-3">
                      <span className="font-bold text-primary">
                        {currency}
                        {earnings.toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <StatusBadge showDateTime={show.showDateTime} />
                    </td>

                    {/* Occupancy bar */}
                    <td className="p-3">
                      <OccupancyBar occupied={occupied} total={totalSeats} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <EmptyState query={query} />
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p>
            Showing{" "}
            <span className="text-white font-medium">
              {(page - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(page * ITEMS_PER_PAGE, sorted.length)}
            </span>{" "}
            of <span className="text-white font-medium">{sorted.length}</span>{" "}
            shows
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10
                         hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition
                  ${
                    page === p
                      ? "bg-primary text-white"
                      : "bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400"
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10
                         hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListShows;
