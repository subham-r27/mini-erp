import {
    Navigate,
    Outlet,
  } from "react-router";
  
  import {
    useAuth,
  } from "../context/AuthContext";
  
  import {
    hasPermission,
    type Permission,
  } from "../utils/permissions";
  
  interface RoleProtectedRouteProps {
    permission: Permission;
  }
  
  export default function RoleProtectedRoute({
    permission,
  }: RoleProtectedRouteProps) {
    const {
      user,
    } = useAuth();
  
    if (!user) {
      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }
  
    if (
      !hasPermission(
        user.role,
        permission,
      )
    ) {
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }
  
    return <Outlet />;
  }