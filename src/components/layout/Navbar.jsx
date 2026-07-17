import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/context";
import { Button, Badge, DarkModeToggle } from "@/components";
import { logout } from "@/services";
import { TOKEN_KEY } from "@/services/apiSettings";
import {
  getEmployeeDisplayName,
  getEmployeeInitials,
} from "@/utils/employeeUtils";
import { formatRole, getEmployeeRoles } from "@/utils/roleUtils";

export function Navbar() {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    setCurrentUser(null);
    localStorage.removeItem(TOKEN_KEY);
    navigate("/login");
  };

  const userRoles = getEmployeeRoles(currentUser);

  return (
    <nav className="bg-primary text-white border-b-4 p-2 rounded-2xl border-accent shadow-sm dark:bg-primary-dark dark:border-accent-dark">
      <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
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
          </div>

          <div className="flex items-center gap-3">
            <Button variant="nav" to="/employee-dashboard">
              Home Dashboard
            </Button>

            <DarkModeToggle />

            <Button
              variant="profile"
              to="/change-password"
              aria-label="Change password"
              title="Change password"
              className="min-w-10 h-10 rounded-lg text-sm font-bold"
            >
              {getEmployeeInitials(currentUser)}
            </Button>

            <div className="hidden sm:flex flex-col items-center leading-tight">
              <p className="text-sm font-semibold">
                {getEmployeeDisplayName(currentUser)}
              </p>
              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {userRoles.map((role) => (
                  <Badge key={role} variant={role} size="sm">
                    {formatRole(role)}
                  </Badge>
                ))}
              </div>
            </div>

            <Button variant="nav" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
