import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router";

import AppLayout from "../components/layout/AppLayout";

import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Products from "../pages/Products";
import Inventory from "../pages/Inventory";
import Challans from "../pages/Challans";
import Invoices from "../pages/Invoices";
import Users from "../pages/Users";
import Settings from "../pages/Settings";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
            ===================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =====================================================
            PROTECTED APPLICATION
            ===================================================== */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            {/* Root */}

            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />


            {/* =================================================
                DASHBOARD
                ================================================= */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* =================================================
                CUSTOMERS
                ================================================= */}

            <Route
              path="/customers"
              element={<Customers />}
            />


            {/* =================================================
                PRODUCTS
                ================================================= */}

            <Route
              path="/products"
              element={<Products />}
            />


            {/* =================================================
                INVENTORY
                ================================================= */}

            <Route
              path="/inventory"
              element={<Inventory />}
            />


            {/* =================================================
                CHALLANS
                ================================================= */}

            <Route
              path="/challans"
              element={<Challans />}
            />


            {/* =================================================
                INVOICES
                ================================================= */}

            <Route
              path="/invoices"
              element={<Invoices />}
            />


            {/* =================================================
                USERS
                ADMIN ONLY
                ================================================= */}

            <Route
              element={
                <RoleProtectedRoute
                  permission="MANAGE_USERS"
                />
              }
            >
              <Route
                path="/users"
                element={<Users />}
              />
            </Route>


            {/* =================================================
                PROFILE
                ================================================= */}

            <Route
              path="/profile"
              element={<Profile />}
            />


            {/* =================================================
                SETTINGS
                ================================================= */}

            <Route
              path="/settings"
              element={<Settings />}
            />


            {/* =================================================
                UNKNOWN ROUTES
                ================================================= */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}