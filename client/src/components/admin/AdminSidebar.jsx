import React from "react";
import { assets } from "../../assets/assets";
import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  LogOutIcon,
  PlusSquareIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const user = {
    firstName: "Admin",
    lastName: "User",
    imageUrl: assets.profile,
  };

  const adminNavlinks = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Add Shows",
      path: "/admin/add-shows",
      icon: PlusSquareIcon,
    },
    {
      name: "List Shows",
      path: "/admin/list-shows",
      icon: ListIcon,
    },
    {
      name: "Bookings",
      path: "/admin/list-bookings",
      icon: ListCollapseIcon,
    },
  ];

  return (
    <aside className="h-[calc(100vh-64px)] bg-[#0f172a]/70 backdrop-blur-xl border-r border-white/10 flex flex-col w-[80px] md:w-[260px] transition-all duration-300">
      {/* Profile */}
      <div className="flex flex-col items-center px-4 py-8 border-b border-white/10">
        <img
          src={user.imageUrl}
          alt="Admin"
          className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-primary/40"
        />

        <h3 className="hidden md:block mt-3 text-white font-semibold">
          {user.firstName} {user.lastName}
        </h3>

        <span className="hidden md:block mt-1 px-3 py-1 text-xs rounded-full bg-primary/20 text-primary">
          Administrator
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {adminNavlinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) =>
              `group relative flex items-center gap-3 mx-2 px-4 py-3 rounded-xl transition-all duration-200
              ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-primary" : ""
                  }`}
                />

                <span className="hidden md:block font-medium">{link.name}</span>

                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button className="flex items-center justify-center md:justify-start gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition">
          <LogOutIcon className="w-5 h-5" />
          <span className="hidden md:block">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
