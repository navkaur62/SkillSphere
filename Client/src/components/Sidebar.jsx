import {
  LayoutDashboard,
  Code2,
  BookOpen,
  Target,
  Award,
  User,
  ChevronRight,
  ArrowRight,
  Settings,
} from "lucide-react";

import { useAuth } from "../context/authContext";
import studentAvatar from "../assets/student-3d.png";

function Sidebar() {
  const { user } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Skills",
      path: "/skills",
      icon: Code2,
    },
    {
      name: "Learning Paths",
      path: "/learning-paths",
      icon: BookOpen,
    },
    {
      name: "Goals",
      path: "/goals",
      icon: Target,
    },
    {
      name: "Certifications",
      path: "/certifications",
      icon: Award,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  
  ];

  const currentPath = window.location.pathname;

  return (
    <aside className="sidebar">

      {/* USER CARD */}
      <div className="sidebar-user-card">

        <div className="sidebar-avatar">
          <User size={25} />
          <span className="online-dot"></span>
        </div>

        <div className="sidebar-user-info">
          <h4>
            {user?.name || "Navdeep Kaur"}
          </h4>

          <span>Student</span>
        </div>

        <ChevronRight
          size={18}
          className="sidebar-user-arrow"
        />

      </div>


      {/* MENU */}
      <div className="sidebar-menu-title">
        MENU
      </div>

      <nav className="sidebar-nav">

        {menuItems.map((item) => {

          const Icon = item.icon;

          const isActive =
            currentPath === item.path ||
            (
              item.path !== "/dashboard" &&
              currentPath.startsWith(item.path)
            );

          return (
            <a
              key={item.name}
              href={item.path}
              className={`sidebar-link ${
                isActive ? "active" : ""
              }`}
            >
              <Icon size={21} />
              <span>{item.name}</span>
            </a>
          );
        })}

      </nav>


      {/* BOTTOM LEARNING SECTION */}
      <div className="sidebar-bottom">

        <img
          className="sidebar-student-image"
          src={studentAvatar}
          alt="Student learning"
        />

        <div className="keep-learning-card">

          <div className="keep-learning-content">

            <h4>Keep Learning</h4>

            <p>
              Small steps every day
              <br />
              lead to big results!
            </p>

          </div>

          <button className="keep-learning-button">
            <ArrowRight size={17} />
          </button>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;