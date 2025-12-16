// This Provider component wraps our entire app and manages the currentEmployee state.
// When the app loads, it checks localStorage for a logged-in employee and fetches their full data from the API.
// It provides both currentEmployee (the data) and setCurrentEmployee (to update it) to all child components.
// This runs automatically on app load and whenever someone logs in/out.
// Use the useCurrentUser() hook in any component to access the employee data.
// Wrap your app with <CurrentUserProvider> in src/main.jsx after importing it.
import { CurrentUserContext } from "./CurrentUserContext.js";
import { useState, useEffect } from "react";
import { getEmployeeById } from "@/services";

export function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize isLoading based on whether there's a user in localStorage
  const [isLoading, setIsLoading] = useState(() => {
    return localStorage.getItem("testing_services_user") !== null;
  });

  useEffect(() => {
    const localUser = localStorage.getItem("testing_services_user");

    if (localUser) {
      const userObject = JSON.parse(localUser);
      getEmployeeById(userObject.id)
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          setCurrentUser(null);
          localStorage.removeItem("testing_services_user");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, isLoading }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}
