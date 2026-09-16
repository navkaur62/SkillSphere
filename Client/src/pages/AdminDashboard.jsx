import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  ShieldCheck,
  Code,
  BookOpen,
  Target,
  Award,
} from "lucide-react";

import adminService from "../services/adminService";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);

        const [statsData, usersData] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(),
        ]);

        setStatistics(statsData.statistics);
        setUsers(usersData.users);
      } catch (error) {
        console.error("Admin dashboard error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: statistics?.totalUsers ?? 0,
      icon: Users,
    },
    {
      title: "Students",
      value: statistics?.totalStudents ?? 0,
      icon: UserCheck,
    },
    {
      title: "Admins",
      value: statistics?.totalAdmins ?? 0,
      icon: ShieldCheck,
    },
    {
      title: "Skills",
      value: statistics?.totalSkills ?? 0,
      icon: Code,
    },
    {
      title: "Learning Paths",
      value: statistics?.totalLearningPaths ?? 0,
      icon: BookOpen,
    },
    {
      title: "Goals",
      value: statistics?.totalGoals ?? 0,
      icon: Target,
    },
    {
      title: "Certifications",
      value: statistics?.totalCertifications ?? 0,
      icon: Award,
    },
  ];

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="admin-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Manage and monitor your SkillSphere platform.
          </p>
        </div>
      </div>


      {/* STATISTICS */}
      <div className="admin-stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className="admin-stat-card"
              key={card.title}
            >
              <div className="admin-stat-icon">
                <Icon size={24} />
              </div>

              <div className="admin-stat-content">
                <p>{card.title}</p>
                <h2>{card.value}</h2>
              </div>
            </div>
          );
        })}
      </div>


      {/* USER MANAGEMENT */}
      <div className="admin-users-section">

        <div className="admin-section-header">
          <div>
            <h2>User Management</h2>
            <p>
              View registered SkillSphere users.
            </p>
          </div>

          <span className="user-count">
            {users.length} Users
          </span>
        </div>


        <div className="admin-users-table-wrapper">

          <table className="admin-users-table">

            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Skills</th>
                <th>Learning Paths</th>
                <th>Level</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>

                    <td>
                      <div className="admin-user-info">

                        <div className="admin-user-avatar">
                          {user.name
                            ? user.name.charAt(0).toUpperCase()
                            : "U"}
                        </div>

                        <span>{user.name}</span>

                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`role-badge ${user.role}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.skills?.length || 0}
                    </td>

                    <td>
                      {user.learningPaths?.length || 0}
                    </td>

                    <td>
                      Level {user.level || 1}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="no-users"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>
      </div>


      {/* ADMIN INFORMATION */}
      <div className="admin-info-card">

        <div className="admin-info-icon">
          <ShieldCheck size={26} />
        </div>

        <div>
          <h3>Administrator Access</h3>

          <p>
            You are viewing the administrative section
            of SkillSphere. Use this dashboard to monitor
            users, skills, learning paths, goals, and
            certifications.
          </p>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;