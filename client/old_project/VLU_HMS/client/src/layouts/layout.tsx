import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  LogOut,
  User,
  Database,
  FilePlus,
  Users,
  Menu,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Shield,
  HelpCircle,
} from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import vluLogo from "../assets/vlu-logo.png";

const Layout = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle
  const [hoveredItem, setHoveredItem] = useState<{ label: string; top: number } | null>(null);

  // Initialize from localStorage or default to false (expanded)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState === "true";
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { to: "/repository", label: "Bệnh án", icon: <Database size={20} /> },
    {
      to: "/patient-management",
      label: "Bệnh Nhân",
      icon: <FilePlus size={20} />,
    },
    {
      to: "/accountmanager",
      label: "Quản Lý Tài Khoản",
      icon: <Users size={20} />,
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 1. Header (Full Width, Fixed at Top) */}
      <header className="bg-white shadow-sm border-b border-gray-200 h-16 shrink-0 z-50 relative print-hide">
        <div className="flex items-center justify-between px-4 md:px-6 h-full">
          {/* Left: Logo & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
            >
              <Menu size={24} />
            </button>

            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src={vluLogo} alt="VLU Logo" className="h-10 w-auto object-contain" />
              <h2 className="text-lg md:text-xl font-bold text-vlu-red uppercase hidden sm:block tracking-tight">
                Hồ Sơ Bệnh Án Điện Tử
              </h2>
            </div>
          </div>

          {/* Right: Empty now as user info moved to sidebar */}
          <div></div>
        </div>
      </header>

      {/* 2. Main Layout Container (Below Header) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar (Left, below header) */}
        <aside
          className={`bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out z-40 print-hide
            ${
              isSidebarOpen
                ? "absolute inset-y-0 left-0 w-64 shadow-xl"
                : "hidden lg:flex"
            } 
            ${!isSidebarOpen && isCollapsed ? "lg:w-20" : "lg:w-64"}
          `}
        >
          {/* Sidebar Toggle Button (Desktop Only) */}
          <div
            className={`hidden lg:flex p-2 border-b border-slate-800 items-center ${
              isCollapsed ? "justify-center" : "justify-end"
            }`}
          >
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center"
              title={isCollapsed ? "Mở rộng" : "Thu gọn"}
            >
              {isCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 overflow-x-hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsSidebarOpen(false)} // Close mobile menu on click
                onMouseEnter={(e) => {
                  if (isCollapsed) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredItem({ label: item.label, top: rect.top });
                  }
                }}
                onMouseLeave={() => setHoveredItem(null)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group mb-1
                  ${
                    isActive
                      ? "bg-vlu-red text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                  `
                }
              >
                <span className={`${isCollapsed ? "" : "mr-3"} shrink-0`}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden transition-all duration-200">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* User Info & Logout (Bottom of Sidebar) */}
          <div className="p-4 border-t border-slate-800">
            <div
              className={`flex ${
                isCollapsed
                  ? "justify-center flex-col gap-3 items-center"
                  : "justify-between items-start"
              }`}
            >
              {/* User Profile */}
              <div
                className={`flex items-start ${
                  isCollapsed ? "justify-center" : "space-x-3"
                } overflow-hidden max-w-full`}
              >
                <div className="bg-slate-800 p-2 rounded-full shrink-0 border border-slate-700 mt-0.5">
                  <User size={18} className="text-vlu-red" />
                </div>

                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-200 whitespace-normal wrap-break-word leading-snug">
                      {user?.name || "Guest"}
                    </p>
                    <p className="text-xs text-slate-500 capitalize truncate mt-0.5">
                      {user?.role}
                    </p>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0
                    ${
                      isCollapsed
                        ? "p-2 w-full flex justify-center"
                        : "p-2 mt-0.5"
                    }
                  `}
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </aside>

        {/* Floating Tooltip (Fixed position outside of sidebar overflow) */}
        {isCollapsed && hoveredItem && (
          <div
            className="fixed left-20 z-50 ml-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded shadow-xl border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
            style={{ top: hoveredItem.top }}
          >
            {hoveredItem.label}
            {/* Little arrow pointing left */}
            <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-slate-800"></div>
          </div>
        )}

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Right Side: Main Content + Footer Wrapper */}
        <div className="flex flex-col flex-1 min-w-0 bg-gray-50 overflow-hidden relative z-0">
          {/* Scrollable Content */}
          <main
            id="main-content"
            className="flex-1 overflow-y-auto bg-gray-50 scroll-smooth flex flex-col"
          >
            <div className="flex-1 p-4 md:p-6 lg:p-8">
              <Outlet />
            </div>

            {/* Footer (Now inside scrollable area, pushed to bottom) */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* Left: Copyright & Branding */}
                  <div className="flex items-center space-x-2">
                    <div className="bg-red-50 p-1.5 rounded-full">
                      <HeartPulse size={16} className="text-vlu-red" />
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-bold text-gray-700 block sm:inline mr-1">
                        Hồ sơ bệnh án điện tử
                      </span>
                      <span>&copy; 2025 Nhóm Anh Em văn phòng (AEVP).</span>
                    </div>
                  </div>

                  {/* Right: Links & Info */}
                  <div className="flex items-center space-x-4 text-xs font-medium text-gray-500">
                    <a
                      href="#"
                      className="hover:text-vlu-red transition-colors flex items-center"
                    >
                      <Shield size={14} className="mr-1" /> Bảo mật
                    </a>
                    <a
                      href="#"
                      className="hover:text-vlu-red transition-colors flex items-center"
                    >
                      <HelpCircle size={14} className="mr-1" /> Hỗ trợ
                    </a>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <span className="font-mono text-gray-400">v1.0.2-beta</span>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
