import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/context/CurrentUserContext";
import { Button, Badge } from "@/components/ui";

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
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-mint-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">TS</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-purple-700">
                  Testing Services
                </h1>
                <p className="text-xs text-gray-500">Employee Portal</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Dashboard
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/admin-dashboard"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Admin
                </Link>
                <Link
                  to="/manage-employees"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Employees
                </Link>
                <Link
                  to="/manage-exams"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Exams
                </Link>
              </>
            )}

            <Link
              to="/new-appointment"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              New Appointment
            </Link>
            <Link
              to="/proctoring"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Proctoring
            </Link>
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {currentUser?.name}
              </p>
              {isAdmin && (
                <Badge variant="primary" className="text-xs">
                  Admin
                </Badge>
              )}
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-sm">
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>

              {isAdmin && (
                <>
                  <Link
                    to="/admin-dashboard"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/manage-employees"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Employees
                  </Link>
                  <Link
                    to="/manage-exams"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Exams
                  </Link>
                </>
              )}

              <Link
                to="/new-appointment"
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                New Appointment
              </Link>
              <Link
                to="/proctoring"
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Daily Proctoring
              </Link>

              <div className="px-4 py-2 border-t border-gray-200 mt-2">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {currentUser?.name}
                </p>
                {isAdmin && (
                  <Badge variant="primary" className="text-xs mb-3">
                    Admin
                  </Badge>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full text-sm"
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
