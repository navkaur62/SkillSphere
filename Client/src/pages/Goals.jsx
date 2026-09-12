import { useEffect, useState } from "react";
import {
  Target,
  CheckCircle2,
  Clock3,
  Circle,
  Plus,
} from "lucide-react";

import goalService from "../services/goalService";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await goalService.getGoals();

      setGoals(data.goals || data || []);
    } catch (err) {
      console.error("Error fetching goals:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load your goals."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "completed";
    }

    if (
      status === "In Progress" ||
      status === "Learning"
    ) {
      return "in-progress";
    }

    return "not-started";
  };

  const getStatusIcon = (status) => {
    if (status === "Completed") {
      return <CheckCircle2 size={15} />;
    }

    if (
      status === "In Progress" ||
      status === "Learning"
    ) {
      return <Clock3 size={15} />;
    }

    return <Circle size={15} />;
  };

  return (
    <div className="goals-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="goals-page-header">

        <div className="goals-page-title">

          <span>LEARNING</span>

          <h1>My Goals</h1>

          <p>
            Set goals, track your progress, and stay focused.
          </p>

        </div>

        <div className="goals-header-icon">
          <Target size={28} />
        </div>

      </div>


      {/* =========================
          MAIN GOALS SECTION
      ========================= */}

      <section className="goals-container">

        <div className="goals-section-header">

          <div>

            <h2>My Goals</h2>

            <p>
              Track your learning objectives.
            </p>

          </div>

          <div className="goals-section-icon">
            🎯
          </div>

        </div>


        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="goals-state">
            <div className="goals-loader"></div>
            <p>Loading your goals...</p>
          </div>
        )}


        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (
          <div className="goals-state goals-error">

            <Target size={30} />

            <h3>Something went wrong</h3>

            <p>{error}</p>

            <button
              onClick={fetchGoals}
              className="goals-retry-button"
            >
              Try Again
            </button>

          </div>
        )}


        {/* =========================
            EMPTY STATE
        ========================= */}

        {!loading &&
          !error &&
          goals.length === 0 && (

            <div className="goals-state">

              <div className="empty-goal-icon">
                <Target size={30} />
              </div>

              <h3>No goals yet</h3>

              <p>
                Start by creating your first learning goal.
              </p>

              <button className="add-goal-button">
                <Plus size={17} />
                Add Goal
              </button>

            </div>
          )}


        {/* =========================
            GOALS LIST
        ========================= */}

        {!loading &&
          !error &&
          goals.length > 0 && (

            <div className="goals-list">

              {goals.map((goal) => {

                const progress = Math.min(
                  Math.max(
                    Number(goal.progress || 0),
                    0
                  ),
                  100
                );

                const status =
                  goal.status || "Not Started";

                return (

                  <div
                    className="goal-card"
                    key={goal._id || goal.id}
                  >

                    {/* TOP */}

                    <div className="goal-card-top">

                      <div className="goal-title-wrapper">

                        <div className="goal-icon">
                          <Target size={21} />
                        </div>

                        <div>

                          <h3>
                            {goal.title ||
                              goal.name ||
                              "Learning Goal"}
                          </h3>

                          {goal.description && (
                            <p>
                              {goal.description}
                            </p>
                          )}

                        </div>

                      </div>


                      {/* STATUS */}

                      <div
                        className={`goal-status ${getStatusClass(
                          status
                        )}`}
                      >

                        {getStatusIcon(status)}

                        <span>
                          {status}
                        </span>

                      </div>

                    </div>


                    {/* PROGRESS */}

                    <div className="goal-progress-area">

                      <div className="goal-progress-label">

                        <span>
                          Progress
                        </span>

                        <strong>
                          {progress}%
                        </strong>

                      </div>

                      <div className="goal-progress-track">

                        <div
                          className="goal-progress-value"
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                    </div>


                    {/* FOOTER */}

                    <div className="goal-card-footer">

                      <span>
                        Target:{" "}
                        {goal.targetDate
                          ? new Date(
                              goal.targetDate
                            ).toLocaleDateString()
                          : "Not set"}
                      </span>

                      <span>
                        {progress === 100
                          ? "Goal completed"
                          : "Keep going!"}
                      </span>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

      </section>

    </div>
  );
}

export default Goals;