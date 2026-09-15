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

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;