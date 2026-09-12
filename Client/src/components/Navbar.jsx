import {
  Bell,
  Search,
  ChevronDown,
  User,
} from "lucide-react";

import { useAuth } from "../context/authContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">

      {/* =========================
          LOGO
      ========================= */}

      <div className="navbar-logo">

        <div className="navbar-logo-icon">
          ◆
        </div>

        <h2>SkillSphere</h2>

      </div>


      {/* =========================
          SEARCH
      ========================= */}

      <div className="navbar-search">

        <Search
          size={18}
          className="navbar-search-icon"
        />

        <input
          type="text"
          placeholder="Search skills, courses, or goals..."
        />

      </div>


      {/* =========================
          RIGHT ACTIONS
      ========================= */}

      <div className="navbar-actions">

        {/* Notification */}

        <button
          className="notification-button"
          aria-label="Notifications"
        >

          <Bell size={19} />

          <span className="notification-dot"></span>

        </button>


        {/* Profile */}

        <button
          className="navbar-profile"
          aria-label="User profile"
        >

          <div className="navbar-avatar">
            <User size={18} />
          </div>

          <div className="navbar-user-info">

            <span className="navbar-user-name">
              {user?.name || "Navdeep Kaur"}
            </span>

            <span className="navbar-user-role">
              Student
            </span>

          </div>

          <ChevronDown
            size={16}
            className="navbar-chevron"
          />

        </button>

      </div>

    </nav>
  );
}

export default Navbar;