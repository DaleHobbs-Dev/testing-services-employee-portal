import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/context/CurrentUserContext";
import { Button, Badge } from "@/components/ui";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export function Navbar() {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("testing_services_user");
    navigate("/login");
  };

  const isAdmin = currentUser?.role === "admin";

  return (
    <nav className="bg-primary text-white border-b-4 p-2 rounded-2xl border-accent shadow-sm dark:bg-primary-dark dark:border-accent-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center 
                bg-gradient-to-br from-primary to-accent shadow-md"
            >
              <span className="text-white font-bold text-xl">TS</span>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">Testing Services</h1>
              <p className="text-xs opacity-90">Employee Portal</p>
            </div>
          </Link>

          {/* NAVIGATION LEFT + USER RIGHT */}
          <div className="hidden md:flex items-center gap-4">
            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="nav" to="/">
                Dashboard
              </Button>

              {isAdmin && (
                <>
                  <Button variant="nav" to="/employee-list">
                    Employees
                  </Button>
                  <Button variant="nav" to="/exam-list">
                    Exams
                  </Button>
                </>
              )}

              <Button variant="nav" to="/new-appointment">
                New Appointment
              </Button>

              <Button variant="nav" to="/proctoring-dashboard">
                Proctoring
              </Button>
            </div>

            {/* SEPARATOR */}
            <div className="hidden lg:block w-px h-16 bg-accent-light/70 mx-3" />

            {/* USER SECTION + DARK MODE */}
            <div className="hidden lg:flex items-center gap-3">
              {/* ✅ NEW: Dark Mode Toggle */}
              <DarkModeToggle />

              {/* Profile Badge */}
              <Button
                to={`/profile/${currentUser?.id}`}
                variant="profile"
                className="flex items-center gap-3"
              >
                <div className="flex flex-col items-center leading-tight">
                  <p className="text-sm font-semibold">{currentUser?.name}</p>
                  <Badge variant={currentUser?.role} size="sm" className="mt-1">
                    {currentUser?.role}
                  </Badge>
                </div>
              </Button>

              {/* Logout */}
              <Button variant="nav" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* ✅ NEW: Dark Mode Toggle (Mobile) */}
            <DarkModeToggle />
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded focus-ring-inverse"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-white" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-primary-dark/40 backdrop-blur-md py-4 rounded-xl mt-2 shadow-xl dark:bg-gray-800/60">
            <div className="flex flex-col gap-3 text-white">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-primary-darker/40 rounded transition"
              >
                Dashboard
              </Link>

              {isAdmin && (
                <>
                  <Link
                    to="/employee-list"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 hover:bg-primary-darker/40 rounded transition"
                  >
                    Employees
                  </Link>

                  <Link
                    to="/exam-list"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 hover:bg-primary-darker/40 rounded transition"
                  >
                    Exams
                  </Link>
                </>
              )}

              <Link
                to="/new-appointment"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-primary-darker/40 rounded transition"
              >
                New Appointment
              </Link>

              <Link
                to="/proctoring-dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-primary-darker/40 rounded transition"
              >
                Proctoring
              </Link>

              {/* User Section */}
              <div className="px-4 py-3 mt-4 border-t border-white/30">
                <Button
                  to={`/profile/${currentUser?.id}`}
                  variant="profile"
                  className="w-full flex items-center justify-center px-4 py-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold">{currentUser?.name}</p>
                    <Badge
                      variant={currentUser?.role}
                      size="sm"
                      className="inline-flex"
                    >
                      {currentUser?.role}
                    </Badge>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full mt-3 bg-white/10 hover:bg-white/20 text-white border-white"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}