import { useEffect, useState } from "react";
import learningPathService from "../services/learningPathServices";

function LearningPaths() {
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===============================
  // GET USER ID FROM TOKEN
  // ===============================

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return (
        payload.id ||
        payload.userId ||
        payload._id ||
        null
      );
    } catch (err) {
      console.error("Unable to read token:", err);
      return null;
    }
  };

  // ===============================
  // FETCH LEARNING PATHS
  // ===============================

  const fetchLearningPaths = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await learningPathService.getAllLearningPaths();

      setLearningPaths(
        Array.isArray(data.learningPaths)
          ? data.learningPaths
          : []
      );
    } catch (err) {
      console.error("Learning paths error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load learning paths."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOAD WHEN PAGE OPENS
  // ===============================

  useEffect(() => {
    const loadLearningPaths = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await learningPathService.getAllLearningPaths();

        setLearningPaths(
          Array.isArray(data.learningPaths)
            ? data.learningPaths
            : []
        );
      } catch (err) {
        console.error("Learning paths error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load learning paths."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLearningPaths();
  }, []);

  // ===============================
  // ENROLL
  // ===============================

  const handleEnroll = async (pathId) => {
    try {
      setError("");
      setSuccess("");

      await learningPathService.enrollInLearningPath(pathId);

      setSuccess("Successfully enrolled in this learning path.");

      await fetchLearningPaths();
    } catch (err) {
      console.error("Enrollment error:", err);

      const message =
        err.response?.data?.message ||
        "Failed to enroll in learning path.";

      setError(message);
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <h2>Learning Paths</h2>
          <p>Loading learning paths...</p>
        </div>
      </div>
    );
  }

  // ===============================
  // GET CURRENT USER
  // ===============================

  const userId = getUserIdFromToken();

  // ===============================
  // PAGE
  // ===============================

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <p>LEARNING</p>

          <h1>Learning Paths</h1>

          <span>
            Follow structured learning paths to improve
            your skills.
          </span>
        </div>

        <div className="page-header-icon">
          📚
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* LEARNING PATHS */}

      <div className="dashboard-card">

        <div className="card-header">
          <div>
            <h2>Available Learning Paths</h2>

            <p>
              Choose a path and start learning.
            </p>
          </div>

          <span>🎓</span>
        </div>

        {learningPaths.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              📚
            </div>

            <h3>
              No learning paths available
            </h3>

            <p>
              Learning paths will appear here when
              they are created.
            </p>

          </div>

        ) : (

          <div className="skills-grid">

            {learningPaths.map((path) => {

              // ===============================
              // CHECK IF USER IS ALREADY ENROLLED
              // ===============================

              const isEnrolled =
                Array.isArray(path.enrolledUsers) &&
                path.enrolledUsers.some((user) => {
                  const enrolledUserId =
                    typeof user === "object"
                      ? user._id
                      : user;

                  return (
                    String(enrolledUserId) ===
                    String(userId)
                  );
                });

              return (
                <div
                  className="skill-card"
                  key={path._id}
                >

                  {/* ICON */}

                  <div className="skill-card-top">

                    <div className="skill-icon">
                      📚
                    </div>

                    <span className="skill-level">
                      {path.level || "Beginner"}
                    </span>

                  </div>

                  {/* TITLE */}

                  <h3>
                    {path.title}
                  </h3>

                  {/* DESCRIPTION */}

                  <p>
                    {path.description}
                  </p>

                  {/* CATEGORY */}

                  <div className="skill-category">
                    {path.category}
                  </div>

                  {/* DETAILS */}

                  <div className="skill-details">

                    <span>
                      ⏱️ {path.duration}
                    </span>

                    <span>
                      🛠️{" "}
                      {Array.isArray(path.skills)
                        ? path.skills.length
                        : 0}{" "}
                      skills
                    </span>

                  </div>

                  {/* SKILLS */}

                  {Array.isArray(path.skills) &&
                    path.skills.length > 0 && (

                      <div className="path-skills">

                        <strong>
                          Skills covered:
                        </strong>

                        <div>
                          {path.skills.map((skill) => (

                            <span
                              key={skill._id}
                              className="skill-tag"
                            >
                              {skill.name}
                            </span>

                          ))}
                        </div>

                      </div>

                    )}

                  {/* ENROLL BUTTON */}

                  {isEnrolled ? (

                    <button
                      className="primary-button"
                      disabled
                    >
                      ✓ Already Enrolled
                    </button>

                  ) : (

                    <button
                      className="primary-button"
                      onClick={() =>
                        handleEnroll(path._id)
                      }
                    >
                      Enroll Now
                    </button>

                  )}

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default LearningPaths;