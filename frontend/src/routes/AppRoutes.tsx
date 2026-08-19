import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router";

import { AuthProvider } from "../context/AuthContext";

import AppLayout from "../components/layout/AppLayout";

import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Products from "../pages/Products";
import Inventory from "../pages/Inventory";
import Challans from "../pages/Challans";
import Invoices from "../pages/Invoices";
import Users from "../pages/Users";
import Settings from "../pages/Settings";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                path="/"
                element={
                  <Navigate to="/dashboard" replace />
                }
              />

              <Route
                element={
                  <RoleProtectedRoute permission="VIEW_DASHBOARD" />
                }
              >
                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />
              </Route>

              <Route
                element={
                  <RoleProtectedRoute permission="VIEW_CUSTOMERS" />
                }
              >
                <Route
                  path="/customers"
                  element={<Customers />}
                />
              </Route>

              <Route
                element={
                  <RoleProtectedRoute permission="VIEW_PRODUCTS" />
                }
              >
                <Route
                  path="/products"
                  element={<Products />}
                />
              </Route>

              <Route
                element={
                  <RoleProtectedRoute permission="VIEW_INVENTORY" />
                }
              >
                <Route
                  path="/inventory"
                  element={<Inventory />}
                />
              </Route>

              <Route
                element={
                  <RoleProtectedRoute permission="VIEW_CHALLANS" />
                }
              >
                <Route
                  path="/challans"
                  element={<Challans />}
                />
              </Route>

              <Route
                element={
                  <RoleProtectedRoute permission="VIEW_INVOICES" />
                }
              >
                <Route
                  path="/invoices"
                  element={<Invoices />}
                />
              </Route>

              <Route
                element={
                  <RoleProtectedRoute permission="MANAGE_USERS" />
                }
              >
                <Route path="/users" element={<Users />} />
              </Route>

              <Route path="/profile" element={<Profile />} />

              <Route
                element={
                  <RoleProtectedRoute permission="MANAGE_SETTINGS" />
                }
              >
                <Route
                  path="/settings"
                  element={<Settings />}
                />
              </Route>

              <Route
                path="*"
                element={
                  <Navigate to="/dashboard" replace />
                }
              />
            </Route>
          </Route>

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
