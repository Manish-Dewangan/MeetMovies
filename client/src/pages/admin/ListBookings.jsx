import React, { useEffect, useState, useCallback } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  SearchIcon,
  RefreshCwIcon,
  TicketIcon,
  UserIcon,
  FilmIcon,
  CalendarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  InboxIcon,
  TrendingUpIcon,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 8;

const COLUMNS = [
  { key: "user", label: "User", icon: UserIcon, sortable: true },
  { key: "movie", label: "Movie", icon: FilmIcon, sortable: true },
  { key: "time", label: "Show Time", icon: CalendarIcon, sortable: true },
  { key: "seats", label: "Seats", icon: TicketIcon, sortable: false },
  { key: "amount", label: "Amount", icon: null, sortable: true },
];

// ─── Safe Accessors ───────────────────────────────────────────────────────────

/**
 * Safely read nested booking fields so a null user / show
 * never crashes the render or sort comparisons.
 */
const safeUser = (item) => item?.user ?? null;
const safeShow = (item) => item?.show ?? null;
const safeUserName = (item) => safeUser(item)?.name ?? "Unknown User";
const safeMovieTitle = (item) =>
  safeShow(item)?.movie?.title ?? "Unknown Movie";
const safeDateTime = (item) => safeShow(item)?.showDateTime ?? "";
const safeSeats = (item) => Object.values(item?.bookedSeats ?? {});
const safeAmount = (item) => item?.amount ?? 0;

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

const SummaryCard = ({ icon: Icon, label, value, highlight = false }) => (
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
    </div>
  </div>
);

const StatusBadge = ({ amount }) => {
  const tier =
    amount >= 500
      ? {
          label: "Premium",
          color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
        }
      : amount >= 200
        ? {
            label: "Standard",
            color: "text-blue-400   bg-blue-400/10   border-blue-400/20",
          }
        : {
            label: "Basic",
            color: "text-gray-400   bg-gray-400/10   border-gray-400/20",
          };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${tier.color}`}
    >
      {tier.label}
    </span>
  );
};

const EmptyState = ({ query }) => (
  <tr>
    <td colSpan={COLUMNS.length + 1}>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <InboxIcon className="w-12 h-12 text-primary/20 mb-3" />
        <p className="text-gray-400 font-medium">
          {query ? `No bookings match "${query}"` : "No bookings found"}
        </p>
        <p className="text-gray-600 text-sm mt-1">
          {query
            ? "Try a different search term."
            : "Bookings will appear here once made."}
        </p>
      </div>
    </td>
  </tr>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const getAllBookings = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);

        const { data } = await axios.get("/api/admin/all-bookings", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });

        // Defensively filter out any booking whose user or show failed to
        // populate — these would crash the render otherwise.
        const safe = (data.bookings ?? []).filter(
          (b) => b?.user && b?.show?.movie,
        );

        setBookings(safe);
        if (isRefresh) toast.success("Bookings refreshed");
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch bookings");
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [axios, getToken],
  );

  useEffect(() => {
    if (user) getAllBookings();
  }, [user, getAllBookings]);

  // ── Sort ───────────────────────────────────────────────────────────────────
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  // ── Derived Data ───────────────────────────────────────────────────────────
  const filtered = bookings.filter((item) => {
    const q = query.toLowerCase();
    return (
      safeUserName(item).toLowerCase().includes(q) ||
      safeMovieTitle(item).toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const dir = sortConfig.direction === "asc" ? 1 : -1;

    const map = {
      user: [safeUserName(a), safeUserName(b)],
      movie: [safeMovieTitle(a), safeMovieTitle(b)],
      time: [safeDateTime(a), safeDateTime(b)],
      amount: [safeAmount(a), safeAmount(b)],
    };

    const [va, vb] = map[sortConfig.key] ?? ["", ""];
    return va < vb ? -dir : va > vb ? dir : 0;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  const totalRevenue = bookings.reduce((s, b) => s + safeAmount(b), 0);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <Title text1="List" text2="Bookings" />

        <button
          onClick={() => getAllBookings(true)}
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
          icon={TicketIcon}
          label="Total Bookings"
          value={bookings.length.toLocaleString()}
        />
        <SummaryCard
          icon={FilmIcon}
          label="Filtered Results"
          value={filtered.length.toLocaleString()}
        />
        <SummaryCard
          icon={TrendingUpIcon}
          label="Total Revenue"
          value={`${currency}${totalRevenue.toLocaleString()}`}
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
          placeholder="Search by user or movie…"
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg
                     text-sm text-white placeholder-gray-500 outline-none
                     focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left">
              <th className="p-3 pl-5 text-xs font-semibold text-gray-300 uppercase tracking-wider w-8">
                #
              </th>

              {COLUMNS.map(({ key, label, icon: Icon, sortable }) => (
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
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {paginated.length > 0 ? (
              paginated.map((item, index) => {
                const userName = safeUserName(item);
                const movieTitle = safeMovieTitle(item);
                const showTime = safeDateTime(item);
                const seats = safeSeats(item);
                const amount = safeAmount(item);
                const rowNum = (page - 1) * ITEMS_PER_PAGE + index + 1;

                return (
                  <tr
                    key={item._id ?? index}
                    className="bg-white/3 hover:bg-primary/10 transition-colors duration-150"
                  >
                    {/* # */}
                    <td className="p-3 pl-5 text-gray-500 text-xs">{rowNum}</td>

                    {/* User */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-white">
                          {userName}
                        </span>
                      </div>
                    </td>

                    {/* Movie */}
                    <td className="p-3 text-gray-200">{movieTitle}</td>

                    {/* Show Time */}
                    <td className="p-3 text-gray-400">
                      {showTime ? dateFormat(showTime) : "—"}
                    </td>

                    {/* Seats */}
                    <td className="p-3">
                      {seats.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {seats.map((seat) => (
                            <span
                              key={seat}
                              className="px-1.5 py-0.5 text-xs rounded bg-primary/20 text-primary border border-primary/20 font-mono"
                            >
                              {seat}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {currency}
                          {amount.toLocaleString()}
                        </span>
                        <StatusBadge amount={amount} />
                      </div>
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
            results
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

export default ListBookings;
