import {
  LayoutDashboard,
  Code,
  BookOpen,
  Target,
  Award,
  User,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <h3>Menu</h3>
      </div>

      <nav className="sidebar-menu">
        <a href="/dashboard">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </a>

        <a href="/skills">
          <Code size={20} />
          <span>Skills</span>
        </a>

        <a href="/learning-paths">
          <BookOpen size={20} />
          <span>Learning Paths</span>
        </a>

        <a href="/goals">
          <Target size={20} />
          <span>Goals</span>
        </a>

        <a href="/certifications">
          <Award size={20} />
          <span>Certifications</span>
        </a>

        <a href="/profile">
          <User size={20} />
          <span>Profile</span>
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;