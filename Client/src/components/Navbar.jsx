import {
  Bell,
  Search,
  ChevronDown,
  User,
  Code,
  BookOpen,
  Target,
  Award,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const searchItems = [
    {
      name: "Dashboard",
      keywords: ["dashboard", "home", "overview"],
      description: "View your SkillSphere dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Skills",
      keywords: ["skill", "skills", "progress"],
      description: "Manage your skills and progress",
      path: "/skills",
      icon: Code,
    },
    {
      name: "Learning Paths",
      keywords: ["learning", "learning path", "course", "courses"],
      description: "Explore your learning paths",
      path: "/learning-paths",
      icon: BookOpen,
    },
    {
      name: "Goals",
      keywords: ["goal", "goals", "target"],
      description: "Manage your learning goals",
      path: "/goals",
      icon: Target,
    },
    {
      name: "Certifications",
      keywords: [
        "certificate",
        "certification",
        "cert",
        "certifications",
      ],
      description: "View your certifications",
      path: "/certifications",
      icon: Award,
    },
  ];

  const filteredResults =
    search.trim() === ""
      ? []
      : searchItems.filter((item) => {
          const searchText = search.toLowerCase();

          return (
            item.name.toLowerCase().includes(searchText) ||
            item.keywords.some((keyword) =>
              keyword.includes(searchText)
            )
          );
        });

  // =========================
  // SEARCH RESULT CLICK
  // =========================
  const handleResultClick = (path) => {
    setSearch("");
    navigate(path);
  };

  // =========================
  // PROFILE DROPDOWN
  // =========================
  const handleProfileClick = () => {
    setProfileOpen((prev) => !prev);
  };

  const handleProfileNavigate = (path) => {
    setProfileOpen(false);
    navigate(path);
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

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
      <div className="navbar-search-container">

        <div className="navbar-search">

          <Search
            size={18}
            className="navbar-search-icon"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills, courses, or goals..."
          />

        </div>


        {/* Search Results */}

        {search.trim() !== "" && (
          <div className="search-results">

            {filteredResults.length > 0 ? (

              filteredResults.map((item) => {

                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    type="button"
                    className="search-result-item"
                    onClick={() => handleResultClick(item.path)}
                  >

                    <div className="search-result-icon">
                      <Icon size={18} />
                    </div>

                    <div className="search-result-content">

                      <span className="search-result-name">
                        {item.name}
                      </span>

                      <span className="search-result-description">
                        {item.description}
                      </span>

                    </div>

                  </button>
                );
              })

            ) : (

              <div className="search-no-results">
                No results found
              </div>

            )}

          </div>
        )}

      </div>


      {/* =========================
          RIGHT ACTIONS
      ========================= */}
      <div className="navbar-actions">

        {/* Notification */}

        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
        >

          <Bell size={19} />

          <span className="notification-dot"></span>

        </button>


        {/* Profile Wrapper */}

        <div className="navbar-profile-wrapper">

          {/* Profile Button */}

          <button
            type="button"
            className="navbar-profile"
            aria-label="User profile"
            onClick={handleProfileClick}
          >

            <div className="navbar-avatar">
              <User size={18} />
            </div>

            <div className="navbar-user-info">

              <span className="navbar-user-name">
                {user?.name || "Navdeep Kaur"}
              </span>

              <span className="navbar-user-role">
                {user?.role || "Student"}
              </span>

            </div>

            <ChevronDown
              size={16}
              className={`navbar-chevron ${
                profileOpen ? "profile-chevron-open" : ""
              }`}
            />

          </button>


          {/* =========================
              PROFILE DROPDOWN
          ========================= */}

          {profileOpen && (
            <div className="profile-dropdown">

              <div className="profile-dropdown-header">

                <div className="profile-dropdown-avatar">
                  <User size={20} />
                </div>

                <div>
                  <strong>
                    {user?.name || "Navdeep Kaur"}
                  </strong>

                  <span>
                    {user?.email || ""}
                  </span>
                </div>

              </div>


              <div className="profile-dropdown-divider"></div>


              <button
                type="button"
                className="profile-dropdown-item"
                onClick={() =>
                  handleProfileNavigate("/profile")
                }
              >
                <User size={17} />
                <span>Profile</span>
              </button>


              <button
                type="button"
                className="profile-dropdown-item"
                onClick={() =>
                  handleProfileNavigate("/settings")
                }
              >
                <Settings size={17} />
                <span>Settings</span>
              </button>


              <div className="profile-dropdown-divider"></div>


              <button
                type="button"
                className="profile-dropdown-item logout-item"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>

            </div>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;