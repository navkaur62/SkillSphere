import { useState } from "react";
import { useAuth } from "../context/authContext";
import { Bell, Lock, User, LogOut, Eye, EyeOff } from "lucide-react";
import userService from "../services/userService";
import authService from "../services/authService";
import "./Settings.css";

const Settings = () => {
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");

  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ===============================
  // CHANGE PASSWORD STATES
  // ===============================
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ===============================
  // SAVE PROFILE
  // ===============================
  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const data = await userService.updateProfile({
        name,
        bio,
      });

      // Update stored user information
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Update settings error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // CHANGE PASSWORD
  // ===============================
  const handleChangePassword = async () => {
    setPasswordMessage("");
    setPasswordError("");

    // Check empty fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    // Check new password length
    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters long."
      );
      return;
    }

    // Check password confirmation
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setPasswordSaving(true);

      const data = await authService.changePassword({
        currentPassword,
        newPassword,
      });

      setPasswordMessage(
        data.message || "Password changed successfully!"
      );

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error("Change password error:", error);

      setPasswordError(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="settings-page">

      {/* HEADER */}
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and preferences</p>
        </div>
      </div>


      {/* ACCOUNT SETTINGS */}
      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <User size={20} />
          </div>

          <div>
            <h2>Account Settings</h2>
            <p>Update your basic account information</p>
          </div>

        </div>


        <div className="settings-form">

          {/* NAME */}
          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>


          {/* EMAIL */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              disabled
            />

            <small>
              Email cannot be changed from Settings.
            </small>
          </div>


          {/* BIO */}
          <div className="form-group full-width">
            <label>Bio</label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us something about yourself"
              rows="4"
            />
          </div>


          {/* SAVE BUTTON */}
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>


        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}


        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

      </div>


      {/* NOTIFICATIONS */}
      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <Bell size={20} />
          </div>

          <div>
            <h2>Notifications</h2>
            <p>Manage how you receive notifications</p>
          </div>

        </div>


        <div className="setting-option">

          <div>
            <h3>Push Notifications</h3>

            <p>
              Receive notifications about your learning progress
            </p>
          </div>


          <label className="switch">

            <input
              type="checkbox"
              checked={notifications}
              onChange={() =>
                setNotifications(!notifications)
              }
            />

            <span className="slider"></span>

          </label>

        </div>


        <div className="setting-option">

          <div>
            <h3>Email Notifications</h3>

            <p>
              Receive learning reminders and updates by email
            </p>
          </div>


          <label className="switch">

            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() =>
                setEmailNotifications(!emailNotifications)
              }
            />

            <span className="slider"></span>

          </label>

        </div>

      </div>


      {/* SECURITY */}
      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <Lock size={20} />
          </div>

          <div>
            <h2>Security</h2>
            <p>Manage your account security</p>
          </div>

        </div>


        <div className="security-row">

          <div>
            <h3>Password</h3>

            <p>
              Change your account password
            </p>
          </div>


          <button
            className="secondary-btn"
            onClick={() => {
              setShowPasswordForm(!showPasswordForm);
              setPasswordMessage("");
              setPasswordError("");
            }}
          >
            {showPasswordForm ? "Cancel" : "Change Password"}
          </button>

        </div>


        {/* CHANGE PASSWORD FORM */}
        {showPasswordForm && (
          <div className="password-form">

            {/* CURRENT PASSWORD */}
            <div className="form-group">
              <label>Current Password</label>

              <div className="password-input-wrapper">

                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>


            {/* NEW PASSWORD */}
            <div className="form-group">
              <label>New Password</label>

              <div className="password-input-wrapper">

                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() =>
                    setShowNewPassword(!showNewPassword)
                  }
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              <small>
                Password must be at least 6 characters.
              </small>
            </div>


            {/* CONFIRM PASSWORD */}
            <div className="form-group">
              <label>Confirm New Password</label>

              <div className="password-input-wrapper">

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* PASSWORD SUCCESS */}
            {passwordMessage && (
              <div className="success-message">
                {passwordMessage}
              </div>
            )}


            {/* PASSWORD ERROR */}
            {passwordError && (
              <div className="error-message">
                {passwordError}
              </div>
            )}


            {/* CHANGE PASSWORD BUTTON */}
            <button
              className="save-btn"
              onClick={handleChangePassword}
              disabled={passwordSaving}
            >
              {passwordSaving
                ? "Changing Password..."
                : "Update Password"}
            </button>

          </div>
        )}

      </div>


      {/* LOGOUT */}
      <div className="settings-card logout-card">

        <div className="settings-card-header">

          <div className="settings-icon logout-icon">
            <LogOut size={20} />
          </div>

          <div>
            <h2>Account</h2>

            <p>
              Sign out from your SkillSphere account
            </p>
          </div>

        </div>


        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>
  );
};

export default Settings;