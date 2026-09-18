import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Skills from "../pages/Skills";
import LearningPaths from "../pages/LearningPaths";
import Goals from "../pages/Goals";
import Layout from "../components/Layout";
import Certifications from "../pages/Certifications";
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard";
import Settings from "../pages/Settings";
import AdminRoute from "./AdminRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>

          {/* Layout wraps all protected pages */}
          <Route element={<Layout />}>

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* Skills */}
            <Route
              path="/skills"
              element={<Skills />}
            />

            {/* Learning Paths */}
            <Route
              path="/learning-paths"
              element={<LearningPaths />}
            />

            {/* Goals */}
            <Route
              path="/goals"
              element={<Goals />}
            />

            {/* Certifications */}
            <Route
              path="/certifications"
              element={<Certifications />}
            />
            {/* Profile */}
            <Route
              path="/profile"
              element={<Profile />}
            />
            <Route 
              element={<AdminRoute />}>
              <Route path="/admin"
               element={<AdminDashboard />}
              />
            </Route>
            <Route 
              path="/settings" 
              element={<Settings />}
            />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;