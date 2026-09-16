import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Code,
  Edit3,
  X,
  Save,
  GraduationCap,
} from "lucide-react";

import { useAuth } from "../context/authContext";
import profileService from "../services/profileService";
import "./Profile.css";

function Profile() {
  const { user, login } = useAuth();

  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);

  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: "",
  });

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();

        setProfile(data.user);

        setFormData({
          name: data.user.name || "",
          bio: data.user.bio || "",
          profileImage: data.user.profileImage || "",
        });

        // Keep localStorage user updated
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.error("Error fetching profile:", error);

        // Use existing AuthContext data if API fails
        if (user) {
          setProfile(user);

          setFormData({
            name: user.name || "",
            bio: user.bio || "",
            profileImage: user.profileImage || "",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Open edit modal
  const handleEdit = () => {
    setFormData({
      name: profile?.name || "",
      bio: profile?.bio || "",
      profileImage: profile?.profileImage || "",
    });

    setShowEdit(true);
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = await profileService.updateProfile(formData);

      setProfile(data.user);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      setShowEdit(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Profile not found.
        </div>
      </div>
    );
  }

  const displayRole =
    profile.role
      ? profile.role.charAt(0).toUpperCase() +
        profile.role.slice(1)
      : "Student";

  return (
    <div className="profile-page">

      {/* Page Header */}
      <div className="profile-header">
        <div>
          <span className="profile-label">
            ACCOUNT
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and learning profile.
          </p>
        </div>

        <div className="profile-header-icon">
          👤
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">

        {/* Profile Top */}
        <div className="profile-top">

          <div className="profile-avatar">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <User size={48} />
            )}

            {!profile.profileImage && (
              <User size={48} />
            )}
          </div>

          <div className="profile-name-section">
            <h2>{profile.name || "User"}</h2>

            <p>{displayRole}</p>
          </div>

          <button
            className="edit-profile-btn"
            onClick={handleEdit}
          >
            <Edit3 size={17} />
            Edit Profile
          </button>

        </div>

        <div className="profile-divider"></div>

        {/* Information */}
        <div className="profile-info">

          <div className="profile-info-item">
            <div className="info-icon">
              <Mail size={20} />
            </div>

            <div>
              <span>Email</span>

              <strong>
                {profile.email || "Not available"}
              </strong>
            </div>
          </div>

          <div className="profile-info-item">
            <div className="info-icon">
              <Shield size={20} />
            </div>

            <div>
              <span>Role</span>

              <strong>{displayRole}</strong>
            </div>
          </div>

          <div className="profile-info-item">
            <div className="info-icon">
              <Code size={20} />
            </div>

            <div>
              <span>Skills</span>

              <strong>
                {profile.skills?.length || 0} Skills
              </strong>
            </div>
          </div>

        </div>

        {/* Bio */}
        <div className="profile-bio">

          <h3>About Me</h3>

          <p>
            {profile.bio ||
              "Add a short description about yourself and your learning journey."}
          </p>

        </div>

      </div>

      {/* Learning Profile */}
      <div className="learning-profile-card">

        <div className="section-heading">

          <div>
            <h2>Learning Profile</h2>

            <p>
              Your SkillSphere learning information.
            </p>
          </div>

          <span className="learning-icon">
            <GraduationCap size={28} />
          </span>

        </div>

        <div className="learning-profile-grid">

          <div className="learning-item">
            <span>Learning Paths</span>

            <strong>
              {profile.learningPaths?.length || 0}
            </strong>
          </div>

          <div className="learning-item">
            <span>Goals</span>

            <strong>
              {profile.goals?.length || 0}
            </strong>
          </div>

          <div className="learning-item">
            <span>Skills</span>

            <strong>
              {profile.skills?.length || 0}
            </strong>
          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="profile-modal-overlay">

          <div className="profile-modal">

            <div className="profile-modal-header">

              <div>
                <h2>Edit Profile</h2>

                <p>
                  Update your personal information.
                </p>
              </div>

              <button
                className="close-modal-btn"
                onClick={() => setShowEdit(false)}
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleSave}>

              {/* Name */}
              <div className="form-group">
                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={profile.email || ""}
                  disabled
                />

                <small>
                  Email cannot be changed here.
                </small>
              </div>

              {/* Bio */}
              <div className="form-group">
                <label htmlFor="bio">
                  About Me
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>

              {/* Profile Image */}
              <div className="form-group">
                <label htmlFor="profileImage">
                  Profile Image URL
                </label>

                <input
                  id="profileImage"
                  type="text"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://example.com/profile.jpg"
                />

                <small>
                  Paste a public image URL.
                </small>
              </div>

              {/* Buttons */}
              <div className="profile-modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-profile-btn"
                  disabled={saving}
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Profile;