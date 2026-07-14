import { Navigate, Outlet } from "react-router-dom"
import { useCurrentUser } from "@/context"
import { LoadingPage } from "@/components"

export const AuthorizedRoutes = () => {
  const storedUser = localStorage.getItem("testing_services_user")
  const { currentUser, isLoading } = useCurrentUser()

  if (!storedUser) {
    return <Navigate to="/login" replace />
  }

  if (isLoading) return <LoadingPage />
  if (!currentUser) return <Navigate to="/login" replace />

  return <Outlet />
}
