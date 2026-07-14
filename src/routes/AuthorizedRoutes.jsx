import { Navigate, Outlet } from "react-router-dom"
import { useCurrentUser } from "@/context"
import { LoadingPage } from "@/components"
import { TOKEN_KEY } from "@/services/apiSettings"

export const AuthorizedRoutes = () => {
  const storedUser = localStorage.getItem(TOKEN_KEY)
  const { currentUser, isLoading } = useCurrentUser()

  if (!storedUser) {
    return <Navigate to="/login" replace />
  }

  if (isLoading) return <LoadingPage />
  if (!currentUser) return <Navigate to="/login" replace />

  return <Outlet />
}
