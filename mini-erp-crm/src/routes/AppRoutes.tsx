import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router";

import AppLayout from "../components/layout/AppLayout";

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
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/inventory"
            element={<Inventory />}
          />

          <Route
            path="/challans"
            element={<Challans />}
          />

          <Route
            path="/invoices"
            element={<Invoices />}
          />

          <Route
            path="/users"
            element={<Users />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

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
      </Routes>
    </BrowserRouter>
  );
}