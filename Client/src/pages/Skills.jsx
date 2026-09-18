import { useEffect, useState } from "react";
import api from "../services/api";

function Skills() {
  // ===============================
  // STATE
  // ===============================

  const [skills, setSkills] = useState([]);
  const [mySkills, setMySkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedSkill, setSelectedSkill] = useState(null);

  const [formData, setFormData] = useState({
    level: "Beginner",
    progress: 0,
    status: "Not Started",
    experience: 0,
  });


  

  // ===============================
  // LOAD DATA WHEN PAGE OPENS
  // ===============================

useEffect(() => {
  const loadSkills = async () => {
    try {
      const [skillsResponse, mySkillsResponse] = await Promise.all([
        api.get("/skills"),
        api.get("/skills/my-skills"),
      ]);

      setSkills(skillsResponse.data?.skills || []);
      setMySkills(mySkillsResponse.data?.skills || []);
    } catch (error) {
      console.error("Error fetching skills:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load skills."
      );
    } finally {
      setLoading(false);
    }
  };

  loadSkills();
}, []);
  // ===============================
  // CHECK WHETHER SKILL IS ADDED
  // ===============================

  const isSkillAdded = (skillId) => {
    return mySkills.some((item) => {
      const existingSkillId =
        typeof item.skill === "object"
          ? item.skill?._id
          : item.skill;

      return (
        String(existingSkillId) ===
        String(skillId)
      );
    });
  };


  // ===============================
  // OPEN ADD SKILL FORM
  // ===============================

  const openAddSkill = (skill) => {
    setSelectedSkill(skill);

    setError("");
    setSuccess("");

    setFormData({
      level: "Beginner",
      progress: 0,
      status: "Not Started",
      experience: 0,
    });
  };


  // ===============================
  // CLOSE ADD SKILL FORM
  // ===============================

  const closeAddSkill = () => {
    setSelectedSkill(null);

    setFormData({
      level: "Beginner",
      progress: 0,
      status: "Not Started",
      experience: 0,
    });
  };


  // ===============================
  // HANDLE FORM CHANGE
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ===============================
  // ADD SKILL TO PROFILE
  // ===============================

  const handleAddSkill = async () => {
    if (!selectedSkill) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await api.post("/skills/add", {
        skillId: selectedSkill._id,
        level: formData.level,
        progress: Number(formData.progress),
        status: formData.status,
        experience: Number(formData.experience),
      });


      // Update My Skills immediately
      const updatedSkills =
        response.data?.user?.skills;

      setMySkills(
        Array.isArray(updatedSkills)
          ? updatedSkills
          : []
      );


      // Update localStorage
      if (response.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }


      setSuccess(
        response.data?.message ||
        "Skill added successfully!"
      );


      // Close form
      setSelectedSkill(null);

    } catch (err) {
      console.error("Add skill error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to add skill."
      );
    }
  };


  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <h2>My Skills</h2>
          <p>Loading skills...</p>
        </div>
      </div>
    );
  }


  // ===============================
  // PAGE
  // ===============================

  return (
    <div className="dashboard-page">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="page-header">
        <div>
          <p>LEARNING</p>

          <h1>My Skills</h1>

          <span>
            Build your skills and track your learning progress.
          </span>
        </div>

        <div className="page-header-icon">
          💻
        </div>
      </div>


      {/* =========================
          ERROR MESSAGE
      ========================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* =========================
          SUCCESS MESSAGE
      ========================== */}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}


      {/* =========================
          MY SKILLS
      ========================== */}

      <div className="dashboard-card">

        <div className="card-header">
          <div>
            <h2>My Skills</h2>

            <p>
              Skills you are currently learning.
            </p>
          </div>

          <span>⭐</span>
        </div>


        {mySkills.length === 0 ? (

          <div className="empty-state">
            <div className="empty-icon">
              🎯
            </div>

            <h3>
              No skills added yet
            </h3>

            <p>
              Choose a skill below to start tracking it.
            </p>
          </div>

        ) : (

          <div className="skills-grid">

            {mySkills.map((item) => {

              const skill =
                typeof item.skill === "object"
                  ? item.skill
                  : null;

              if (!skill) {
                return null;
              }

              return (
                <div
                  className="skill-card"
                  key={skill._id}
                >

                  <div className="skill-card-top">

                    <div className="skill-icon">
                      💻
                    </div>

                    <span className="skill-level">
                      {item.level || "Beginner"}
                    </span>

                  </div>


                  <h3>
                    {skill.name}
                  </h3>


                  <p>
                    {skill.description}
                  </p>


                  <div className="skill-progress">

                    <div className="progress-info">
                      <span>
                        Progress
                      </span>

                      <span>
                        {item.progress || 0}%
                      </span>
                    </div>

                    <progress
                      value={item.progress || 0}
                      max="100"
                    />
                  </div>


                  <div className="skill-details">

                    <span>
                      Status:{" "}
                      {item.status || "Not Started"}
                    </span>

                    <span>
                      Experience:{" "}
                      {item.experience || 0} years
                    </span>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>


      {/* =========================
          AVAILABLE SKILLS
      ========================== */}

      <div className="dashboard-card">

        <div className="card-header">

          <div>

            <h2>
              Available Skills
            </h2>

            <p>
              Add a skill to your personal learning profile.
            </p>

          </div>

          <span>💡</span>

        </div>


        <div className="skills-grid">

          {skills.map((skill) => {

            const alreadyAdded =
              isSkillAdded(skill._id);

            return (

              <div
                className="skill-card"
                key={skill._id}
              >

                <div className="skill-card-top">

                  <div className="skill-icon">
                    💻
                  </div>

                  <span className="skill-level">
                    Beginner
                  </span>

                </div>


                <h3>
                  {skill.name}
                </h3>


                <p>
                  {skill.description}
                </p>


                <div className="skill-category">
                  {skill.category}
                </div>


                {alreadyAdded ? (

                  <button
                    className="added-button"
                    disabled
                  >
                    ✓ Added
                  </button>

                ) : (

                  <button
                    className="primary-button"
                    onClick={() =>
                      openAddSkill(skill)
                    }
                  >
                    Add Skill
                  </button>

                )}

              </div>

            );
          })}

        </div>

      </div>


      {/* =========================
          ADD SKILL FORM
      ========================== */}

      {selectedSkill && (

        <div className="modal-overlay">

          <div className="modal">

            <button
              className="modal-close"
              onClick={closeAddSkill}
            >
              ×
            </button>


            <h2>
              Add {selectedSkill.name}
            </h2>

            <p>
              Set your current skill level.
            </p>


            {/* LEVEL */}

            <label>
              Skill Level
            </label>

            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
            >
              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>
            </select>


            {/* PROGRESS */}

            <label>
              Current Progress: {formData.progress}%
            </label>

            <input
              type="range"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
            />


            {/* STATUS */}

            <label>
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
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


            {/* EXPERIENCE */}

            <label>
              Experience (years)
            </label>

            <input
              type="number"
              name="experience"
              min="0"
              value={formData.experience}
              onChange={handleChange}
            />


            {/* BUTTONS */}

            <div className="modal-actions">

              <button
                className="secondary-button"
                onClick={closeAddSkill}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={handleAddSkill}
              >
                Add Skill
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Skills;