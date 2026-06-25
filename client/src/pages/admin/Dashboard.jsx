import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UserIcon,
  TrendingUpIcon,
  CalendarIcon,
  RefreshCwIcon,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, trend, color = "primary" }) => (
  <div className="group relative flex items-center justify-between px-5 py-4 bg-primary/10 border border-primary/20 rounded-xl w-full max-w-[220px] overflow-hidden hover:bg-primary/15 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
    {/* Background glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="relative z-10">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        {title}
      </p>
      <p className="text-2xl font-bold mt-1 text-white">{value}</p>
      {trend !== undefined && (
        <p
          className={`flex items-center gap-1 text-xs mt-1 font-medium ${
            trend >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          <TrendingUpIcon
            className={`w-3 h-3 ${trend < 0 ? "rotate-180" : ""}`}
          />
          {Math.abs(trend)}% this month
        </p>
      )}
    </div>

    <div className="relative z-10 p-2.5 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors duration-300">
      <Icon className="w-5 h-5 text-primary" />
    </div>
  </div>
);

// ─── Show Card ────────────────────────────────────────────────────────────────
const ShowCard = ({ show, currency, image_base_url }) => (
  <div className="group w-52 rounded-xl overflow-hidden bg-primary/10 border border-primary/20 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-300">
    {/* Poster */}
    <div className="relative overflow-hidden h-64">
      <img
        src={image_base_url + show.movie.poster_path}
        alt={show.movie.title}
        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Rating badge */}
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
        <StarIcon className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <span className="text-xs font-semibold text-white">
          {show.movie.vote_average.toFixed(1)}
        </span>
      </div>

      {/* Live badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-green-500/80 backdrop-blur-sm px-2 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span className="text-xs font-semibold text-white">Active</span>
      </div>
    </div>

    {/* Info */}
    <div className="p-3 space-y-2">
      <p className="font-semibold text-sm text-white truncate leading-tight">
        {show.movie.title}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-primary">
          {currency}
          {show.showPrice}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-400 border-t border-white/5 pt-2">
        <CalendarIcon className="w-3.5 h-3.5 text-primary/70 shrink-0" />
        <span className="truncate">{dateFormat(show.showDateTime)}</span>
      </div>
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyShows = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-primary/5 border border-dashed border-primary/20 rounded-xl w-full max-w-md">
    <PlayCircleIcon className="w-12 h-12 text-primary/30 mb-3" />
    <p className="text-gray-400 font-medium">No active shows right now</p>
    <p className="text-gray-500 text-sm mt-1">
      Active shows will appear here once scheduled.
    </p>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);

        const { data } = await axios.get("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });

        if (data.success) {
          setDashboardData(data.dashboardData);
          if (isRefresh) toast.success("Dashboard refreshed");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [axios, getToken],
  );

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user, fetchDashboardData]);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings.toLocaleString() || "0",
      icon: ChartLineIcon,
      trend: 12,
    },
    {
      title: "Total Revenue",
      value: `${currency}${(dashboardData.totalRevenue || 0).toLocaleString()}`,
      icon: CircleDollarSignIcon,
      trend: 8,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length || "0",
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser.toLocaleString() || "0",
      icon: UserIcon,
      trend: 5,
    },
  ];

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <Title text1="Admin" text2="Dashboard" />

        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <RefreshCwIcon
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Stat Cards */}
      <section className="relative">
        <BlurCircle top="-100px" left="0" />
        <div className="flex flex-wrap gap-4">
          {dashboardCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* Active Shows */}
      <section className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Active Shows</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {dashboardData.activeShows.length} show
              {dashboardData.activeShows.length !== 1 ? "s" : ""} currently
              running
            </p>
          </div>
        </div>

        <BlurCircle top="100px" left="-10%" />

        {dashboardData.activeShows.length > 0 ? (
          <div className="flex flex-wrap gap-5 max-w-5xl">
            {dashboardData.activeShows.map((show) => (
              <ShowCard
                key={show._id}
                show={show}
                currency={currency}
                image_base_url={image_base_url}
              />
            ))}
          </div>
        ) : (
          <EmptyShows />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
