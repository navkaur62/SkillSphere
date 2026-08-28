import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import dashboardService from "../services/dashboardService";

function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <h2>Loading dashboard...</h2>
          <p>Please wait while we load your learning data.</p>
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

      {/* Welcome Section */}

      <section className="welcome-section">
        <div>
          <p className="welcome-label">
            WELCOME BACK 👋
          </p>

          <h1>
            Hello, {dashboardUser?.name || "Learner"}!
          </h1>

          <p>
            Continue your learning journey and achieve your goals.
          </p>
        </div>

        <div className="welcome-icon">
          🎓
        </div>
      </section>


      {/* Statistics */}

      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">
            💻
          </div>

          <div>
            <p>Total Skills</p>
            <h2>{totalSkills}</h2>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">
            📈
          </div>

          <div>
            <p>Overall Progress</p>
            <h2>{overallProgress}%</h2>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">
            📚
          </div>

          <div>
            <p>Learning</p>
            <h2>{learningSkills}</h2>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">
            🏆
          </div>

          <div>
            <p>Completed</p>
            <h2>{completedSkills}</h2>
          </div>
        </div>

      </section>


      {/* Progress + Skill Status */}

      <section className="dashboard-grid">

        {/* Overall Progress */}

        <div className="dashboard-card progress-card">

          <div className="card-header">

            <div>
              <h2>Learning Progress</h2>

              <p>
                Your overall learning performance
              </p>
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
            ></div>

          </div>


          <div className="progress-info">
            <span>0%</span>
            <span>100%</span>
          </div>

        </div>


        {/* Skill Status */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h2>Skill Status</h2>

              <p>
                Your current skill progress
              </p>
            </div>

            <span className="card-icon">
              📊
            </span>

          </div>


          <div className="skill-list">

            <div className="skill-row">
              <span>Completed</span>
              <strong>{completedSkills}</strong>
            </div>

            <div className="skill-row">
              <span>Learning</span>
              <strong>{learningSkills}</strong>
            </div>

            <div className="skill-row">
              <span>Not Started</span>
              <strong>{notStartedSkills}</strong>
            </div>

            <div className="skill-row">
              <span>Total</span>
              <strong>{totalSkills}</strong>
            </div>

          </div>

        </div>

      </section>


      {/* Recent Skills */}

      <section className="dashboard-card recent-card">

        <div className="card-header">

          <div>
            <h2>Recent Skills</h2>

            <p>
              Your recently added skills
            </p>
          </div>

          <span className="card-icon">
            💡
          </span>

        </div>


        {recentSkills.length === 0 ? (

          <div className="empty-state">
            <p>
              No skills added yet.
            </p>

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
                💻
              </div>

              <div>

                <strong>
                  {item.skill?.name || "Skill"}
                </strong>

                <p>
                  {item.status || "Not Started"}
                  {" • "}
                  {item.progress || 0}% progress
                </p>

              </div>

            </div>

          ))

        )}

      </section>


      {/* Account Information */}

      <section className="dashboard-card">

        <div className="card-header">

          <div>
            <h2>Account Overview</h2>

            <p>
              Your SkillSphere account information
            </p>
          </div>

          <span className="card-icon">
            👤
          </span>

        </div>


        <div className="skill-list">

          <div className="skill-row">
            <span>Name</span>
            <strong>
              {dashboardUser?.name || "—"}
            </strong>
          </div>

          <div className="skill-row">
            <span>Email</span>
            <strong>
              {dashboardUser?.email || "—"}
            </strong>
          </div>

          <div className="skill-row">
            <span>Level</span>
            <strong>
              {dashboardUser?.level || "—"}
            </strong>
          </div>

          <div className="skill-row">
            <span>Total Points</span>
            <strong>
              {dashboardUser?.totalPoints || 0}
            </strong>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;