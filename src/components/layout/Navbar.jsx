import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/context/CurrentUserContext";
import { Button, Badge } from "@/components/ui";
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
    <nav className="bg-purple-500 text-white border-b-4 p-2 rounded-2xl border-mint-500 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center 
                bg-linear-to-br from-purple-500 to-mint-500 shadow-md"
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

              {/* <Button variant="nav" to="/design-system">
              Design System
            </Button> */}

              {isAdmin && (
                <>
                  <Button variant="nav" to="/admin-dashboard">
                    Admin
                  </Button>
                  <Button variant="nav" to="/manage-employees">
                    Employees
                  </Button>
                  <Button variant="nav" to="/manage-exams">
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
            <div className="hidden lg:block w-px h-16 bg-mint-300/70 mx-3" />

            {/* USER SECTION */}
            <div className="hidden lg:flex items-center gap-4">
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
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded focus-ring-inverse"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-white" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-purple-800/40 backdrop-blur-md py-4 rounded-xl mt-2 shadow-xl">
            <div className="flex flex-col gap-3 text-white">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-purple-700/40 hover-glow rounded transition"
              >
                Dashboard
              </Link>

              {isAdmin && (
                <>
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 hover:bg-purple-700/40 hover-glow rounded transition"
                  >
                    Admin Dashboard
                  </Link>

                  <Link
                    to="/manage-employees"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 hover:bg-purple-700/40 hover-glow rounded transition"
                  >
                    Manage Employees
                  </Link>

                  <Link
                    to="/manage-exams"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 hover:bg-purple-700/40 hover-glow rounded transition"
                  >
                    Manage Exams
                  </Link>
                </>
              )}

              <Link
                to="/new-appointment"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-purple-700/40 hover-glow rounded transition"
              >
                New Appointment
              </Link>

              <Link
                to="/proctoring"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 hover:bg-purple-700/40 hover-glow rounded transition"
              >
                Daily Proctoring
              </Link>

              {/* User Section */}
              <div className="px-4 py-3 mt-4 border-t border-white/30">
                {/* Clickable Profile Button */}
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
