import { Navigate, Outlet } from "react-router-dom"
import { useCurrentUser } from "@/context"
import { LoadingPage } from "@/components"
import { AUTH_FAILURE_KEY, TOKEN_KEY } from "@/services/apiSettings"

export const AuthorizedRoutes = () => {
  const storedUser = localStorage.getItem(TOKEN_KEY)
  const { currentUser, isLoading } = useCurrentUser()

  if (!storedUser) {
    if (sessionStorage.getItem(AUTH_FAILURE_KEY)) {
      return <Navigate to="/unauthorized" replace />
    }
    return <Navigate to="/login" replace />
  }

  if (isLoading) return <LoadingPage />
  if (!currentUser) return <Navigate to="/unauthorized" replace />

  return <Outlet />
}
