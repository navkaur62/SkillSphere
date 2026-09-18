import { useEffect, useState } from "react";
import {
  Laptop,
  ChartNoAxesCombined,
  BookOpen,
  Trophy,
  BarChart3,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

import "./Dashboard.css";
import { useAuth } from "../context/useAuth";
import dashboardService from "../services/dashboardService";
import StudentAvatar from "../components/StudentAvatar";

function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if this user has just registered
  const [isNewUser] = useState(() => {
    return sessionStorage.getItem("newUser") === "true";
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await dashboardService.getDashboard();

        setDashboard(data);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Remove the new-user flag after the dashboard has shown it
  useEffect(() => {
    if (isNewUser) {
      sessionStorage.removeItem("newUser");
    }
  }, [isNewUser]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <h2>Loading dashboard...</h2>
          <p>
            Please wait while we load your learning data.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const dashboardUser = dashboard?.user || user;
  const statistics = dashboard?.statistics || {};

  const totalSkills = statistics.totalSkills || 0;
  const completedSkills = statistics.completedSkills || 0;
  const learningSkills = statistics.learningSkills || 0;
  const notStartedSkills = statistics.notStartedSkills || 0;

  const overallProgress = dashboard?.overallProgress || 0;
  const recentSkills = dashboard?.recentSkills || [];

  return (
    <div className="dashboard-page">

      {/* =========================
          WELCOME BANNER
      ========================= */}

      <section className="welcome-section">

        <div className="welcome-content">

          <p className="welcome-label">
            {isNewUser
              ? "WELCOME 👋"
              : "WELCOME BACK 👋"}
          </p>

          <h1>
            Hello, {dashboardUser?.name || "Learner"}!
          </h1>

          <p className="welcome-description">
            Continue your learning journey and achieve your goals.
          </p>

        </div>

        <div className="welcome-illustration">

          <StudentAvatar />

          <div className="graduation-cap">
            🎓
          </div>

        </div>

      </section>


      {/* =========================
          STATISTICS
      ========================= */}

      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon blue-icon">
            <Laptop size={25} />
          </div>

          <div>
            <p>Total Skills</p>
            <h2>{totalSkills}</h2>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon purple-icon">
            <ChartNoAxesCombined size={25} />
          </div>

          <div>
            <p>Overall Progress</p>
            <h2>{overallProgress}%</h2>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon green-icon">
            <BookOpen size={25} />
          </div>

          <div>
            <p>Learning</p>
            <h2>{learningSkills}</h2>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon orange-icon">
            <Trophy size={25} />
          </div>

          <div>
            <p>Completed</p>
            <h2>{completedSkills}</h2>
          </div>

        </div>

      </section>


      {/* =========================
          PROGRESS + STATUS
      ========================= */}

      <section className="dashboard-grid">

        {/* Learning Progress */}

        <div className="dashboard-card progress-card">

          <div className="card-header">

            <div className="card-title-area">

              <div className="section-icon purple-section-icon">
                <ChartNoAxesCombined size={21} />
              </div>

              <div>
                <h2>Learning Progress</h2>

                <p>
                  Your overall learning performance
                </p>
              </div>

            </div>

            <span className="percentage">
              {overallProgress}%
            </span>

          </div>


          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${overallProgress}%`,
              }}
            />

          </div>


          <div className="progress-info">
            <span>0%</span>
            <span>100%</span>
          </div>

        </div>


        {/* Skill Status */}

        <div className="dashboard-card">

          <div className="card-header">

            <div className="card-title-area">

              <div className="section-icon blue-section-icon">
                <BarChart3 size={21} />
              </div>

              <div>
                <h2>Skill Status</h2>

                <p>
                  Your current skill progress
                </p>
              </div>

            </div>

            <div className="status-header-icon">
              📊
            </div>

          </div>


          <div className="skill-list">

            <div className="skill-row">

              <div className="status-label">

                <span className="status-dot completed-dot"></span>

                <span>Completed</span>

              </div>

              <strong>{completedSkills}</strong>

            </div>


            <div className="skill-row">

              <div className="status-label">

                <span className="status-dot learning-dot"></span>

                <span>Learning</span>

              </div>

              <strong>{learningSkills}</strong>

            </div>


            <div className="skill-row">

              <div className="status-label">

                <span className="status-dot not-started-dot"></span>

                <span>Not Started</span>

              </div>

              <strong>{notStartedSkills}</strong>

            </div>


            <div className="skill-row total-row">

              <div className="status-label">
                <span>Total</span>
              </div>

              <strong>{totalSkills}</strong>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          RECENT SKILLS
      ========================= */}

      <section className="dashboard-card recent-card">

        <div className="card-header">

          <div className="card-title-area">

            <div className="section-icon purple-section-icon">
              <Lightbulb size={21} />
            </div>

            <div>
              <h2>Recent Skills</h2>

              <p>
                Your recently added skills
              </p>
            </div>

          </div>

          <div className="recent-header-icon">
            💡
          </div>

        </div>


        {recentSkills.length === 0 ? (

          <div className="empty-state">

            <p>No skills added yet.</p>

            <p>
              Start adding skills to track your progress.
            </p>

          </div>

        ) : (

          recentSkills.map((item) => (

            <div
              className="activity-item"
              key={item._id || item.skill?._id}
            >

              <div className="activity-icon">
                <Laptop size={19} />
              </div>


              <div className="activity-content">

                <strong>
                  {item.skill?.name || "Skill"}
                </strong>

                <p>
                  {item.status || "Not Started"}
                  {" • "}
                  {item.progress || 0}% progress
                </p>

              </div>


              <ChevronRight
                className="activity-arrow"
                size={20}
              />

            </div>

          ))

        )}

      </section>

    </div>
  );
}

export default Dashboard;