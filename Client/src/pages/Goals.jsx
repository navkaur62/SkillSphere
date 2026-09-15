import { useEffect, useState } from "react";
import {
  Target,
  CheckCircle2,
  Clock3,
  Circle,
  Plus,
  X,
  Pencil,
  Trash2,
} from "lucide-react";

import goalService from "../services/goalService";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetDate: "",
    progress: 0,
    status: "Not Started",
  });

  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  // =========================
  // FETCH GOALS
  // =========================

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await goalService.getGoals();

      setGoals(data.goals || []);
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

  // =========================
  // OPEN CREATE MODAL
  // =========================

  const openCreateModal = () => {
    setEditingGoal(null);

    setFormData({
      title: "",
      description: "",
      targetDate: "",
      progress: 0,
      status: "Not Started",
    });

    setFormError("");
    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (goal) => {
    setEditingGoal(goal);

    setFormData({
      title: goal.title || "",
      description: goal.description || "",
      targetDate: goal.targetDate
        ? new Date(goal.targetDate)
            .toISOString()
            .split("T")[0]
        : "",
      progress: Number(goal.progress || 0),
      status: goal.status || "Not Started",
    });

    setFormError("");
    setShowModal(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    if (creating) return;

    setShowModal(false);
    setEditingGoal(null);
    setFormError("");
  };

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // PROGRESS CHANGE
  // =========================

  const handleProgressChange = (e) => {
    const progress = Number(e.target.value);

    let status = formData.status;

    if (progress === 0) {
      status = "Not Started";
    } else if (progress === 100) {
      status = "Completed";
    } else {
      status = "In Progress";
    }

    setFormData((prev) => ({
      ...prev,
      progress,
      status,
    }));
  };

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Please enter a goal title.");
      return;
    }

    if (!formData.targetDate) {
      setFormError("Please select a target date.");
      return;
    }

    try {
      setCreating(true);

      if (editingGoal) {
        // UPDATE EXISTING GOAL

        const data = await goalService.updateGoal(
          editingGoal._id,
          {
            title: formData.title.trim(),
            description: formData.description.trim(),
            targetDate: formData.targetDate,
            progress: Number(formData.progress),
            status: formData.status,
          }
        );

        if (data.goal) {
          setGoals((prev) =>
            prev.map((goal) =>
              goal._id === editingGoal._id
                ? data.goal
                : goal
            )
          );
        }
      } else {
        // CREATE NEW GOAL

        const data = await goalService.createGoal({
          title: formData.title.trim(),
          description: formData.description.trim(),
          targetDate: formData.targetDate,
        });

        if (data.goal) {
          setGoals((prev) => [
            data.goal,
            ...prev,
          ]);
        }
      }

      setShowModal(false);
      setEditingGoal(null);

      setFormData({
        title: "",
        description: "",
        targetDate: "",
        progress: 0,
        status: "Not Started",
      });
    } catch (err) {
      console.error(
        "Error saving goal:",
        err
      );

      setFormError(
        err.response?.data?.message ||
          "Unable to save goal. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // DELETE GOAL
  // =========================

  const handleDelete = async (goalId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this goal?"
    );

    if (!confirmed) return;

    try {
      await goalService.deleteGoal(goalId);

      setGoals((prev) =>
        prev.filter(
          (goal) => goal._id !== goalId
        )
      );
    } catch (err) {
      console.error(
        "Error deleting goal:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to delete goal."
      );
    }
  };

  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "completed";
    }

    if (status === "In Progress") {
      return "in-progress";
    }

    return "not-started";
  };

  // =========================
  // STATUS ICON
  // =========================

  const getStatusIcon = (status) => {
    if (status === "Completed") {
      return <CheckCircle2 size={15} />;
    }

    if (status === "In Progress") {
      return <Clock3 size={15} />;
    }

    return <Circle size={15} />;
  };

  // =========================
  // PAGE
  // =========================

  return (
    <div className="goals-page">

      {/* PAGE HEADER */}

      <div className="goals-page-header">

        <div className="goals-page-title">

          <span>LEARNING</span>

          <h1>My Goals</h1>

          <p>
            Set goals, track your progress,
            and stay focused.
          </p>

        </div>

        <div className="goals-header-icon">
          <Target size={28} />
        </div>

      </div>

      {/* MAIN CONTAINER */}

      <section className="goals-container">

        <div className="goals-section-header">

          <div>
            <h2>My Goals</h2>

            <p>
              Track your learning objectives.
            </p>
          </div>

          <button
            className="goals-add-header-button"
            onClick={openCreateModal}
          >
            <Plus size={17} />
            Add Goal
          </button>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="goals-state">

            <div className="goals-loader"></div>

            <p>
              Loading your goals...
            </p>

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="goals-state goals-error">

            <Target size={30} />

            <h3>
              Something went wrong
            </h3>

            <p>
              {error}
            </p>

            <button
              onClick={fetchGoals}
              className="goals-retry-button"
            >
              Try Again
            </button>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          goals.length === 0 && (
            <div className="goals-state">

              <div className="empty-goal-icon">
                <Target size={30} />
              </div>

              <h3>
                No goals yet
              </h3>

              <p>
                Start by creating your first
                learning goal.
              </p>

              <button
                className="add-goal-button"
                onClick={openCreateModal}
              >
                <Plus size={17} />
                Add Goal
              </button>

            </div>
          )}

        {/* GOALS */}

        {!loading &&
          !error &&
          goals.length > 0 && (
            <div className="goals-list">

              {goals.map((goal) => {

                const progress = Math.min(
                  Math.max(
                    Number(
                      goal.progress || 0
                    ),
                    0
                  ),
                  100
                );

                const status =
                  goal.status ||
                  "Not Started";

                return (
                  <div
                    className="goal-card"
                    key={goal._id}
                  >

                    {/* TOP */}

                    <div className="goal-card-top">

                      <div className="goal-title-wrapper">

                        <div className="goal-icon">
                          <Target size={21} />
                        </div>

                        <div>

                          <h3>
                            {goal.title}
                          </h3>

                          {goal.description && (
                            <p>
                              {goal.description}
                            </p>
                          )}

                        </div>

                      </div>

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

                      <div className="goal-card-actions">

                        <button
                          className="goal-edit-button"
                          onClick={() =>
                            openEditModal(goal)
                          }
                          title="Edit goal"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          className="goal-delete-button"
                          onClick={() =>
                            handleDelete(
                              goal._id
                            )
                          }
                          title="Delete goal"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

      </section>

      {/* =================================================
          CREATE / EDIT MODAL
      ================================================= */}

      {showModal && (
        <div
          className="goal-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !creating
            ) {
              closeModal();
            }
          }}
        >

          <div className="goal-modal">

            {/* HEADER */}

            <div className="goal-modal-header">

              <div>

                <span>
                  LEARNING
                </span>

                <h2>
                  {editingGoal
                    ? "Edit Goal"
                    : "Create New Goal"}
                </h2>

                <p>
                  {editingGoal
                    ? "Update your goal and track your progress."
                    : "Set a learning objective and choose a target date."}
                </p>

              </div>

              <button
                className="goal-modal-close"
                onClick={closeModal}
                disabled={creating}
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              className="goal-form"
              onSubmit={handleSubmit}
            >

              {/* TITLE */}

              <div className="goal-form-group">

                <label htmlFor="title">
                  Goal Title
                  <span>*</span>
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Complete React course"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={creating}
                />

              </div>

              {/* DESCRIPTION */}

              <div className="goal-form-group">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  placeholder="Describe what you want to achieve..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={creating}
                />

              </div>

              {/* TARGET DATE */}

              <div className="goal-form-group">

                <label htmlFor="targetDate">
                  Target Date
                  <span>*</span>
                </label>

                <input
                  id="targetDate"
                  name="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={handleChange}
                  disabled={creating}
                />

              </div>

              {/* PROGRESS */}

              {editingGoal && (
                <div className="goal-form-group">

                  <div className="goal-progress-form-header">

                    <label htmlFor="progress">
                      Progress
                    </label>

                    <strong>
                      {formData.progress}%
                    </strong>

                  </div>

                  <input
                    id="progress"
                    name="progress"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.progress}
                    onChange={handleProgressChange}
                    className="goal-progress-slider"
                    disabled={creating}
                  />

                  <div className="goal-range-labels">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>

                </div>
              )}

              {/* STATUS */}

              {editingGoal && (
                <div className="goal-form-group">

                  <label htmlFor="status">
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={creating}
                  >
                    <option value="Not Started">
                      Not Started
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>

                </div>
              )}

              {/* ERROR */}

              {formError && (
                <div className="goal-form-error">
                  {formError}
                </div>
              )}

              {/* ACTIONS */}

              <div className="goal-form-actions">

                <button
                  type="button"
                  className="goal-cancel-button"
                  onClick={closeModal}
                  disabled={creating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="goal-create-button"
                  disabled={creating}
                >

                  {creating ? (
                    <>
                      <span className="goal-button-loader"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingGoal ? (
                        <Pencil size={16} />
                      ) : (
                        <Plus size={17} />
                      )}

                      {editingGoal
                        ? "Save Changes"
                        : "Create Goal"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Goals;