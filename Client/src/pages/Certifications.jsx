import { useEffect, useState } from "react";
import "./Certifications.css";
import api from "../services/api";

const emptyForm = {
  title: "",
  issuer: "",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",
};

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  // =========================
  // FETCH ON PAGE LOAD
  // =========================

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        const response = await api.get("/certifications");

        const data = response.data;

        setCertifications(data.certifications || data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch certifications"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCertifications();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // OPEN ADD FORM
  // =========================

  const handleAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================

  const handleEdit = (certification) => {
    setEditingId(certification._id);

    setFormData({
      title: certification.title || "",
      issuer: certification.issuer || "",
      issueDate: certification.issueDate
        ? certification.issueDate.substring(0, 10)
        : "",
      expiryDate: certification.expiryDate
        ? certification.expiryDate.substring(0, 10)
        : "",
      credentialId: certification.credentialId || "",
      credentialUrl: certification.credentialUrl || "",
    });

    setError("");
    setShowForm(true);
  };

  // =========================
  // ADD / UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.issuer || !formData.issueDate) {
      setError("Title, issuer and issue date are required");
      return;
    }

    setFormLoading(true);
    setError("");

    try {
      const certificationData = {
        title: formData.title,
        issuer: formData.issuer,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate || undefined,
        credentialId: formData.credentialId || undefined,
        credentialUrl: formData.credentialUrl || undefined,
      };

      // UPDATE
      if (editingId) {
        const response = await api.put(
          `/certifications/${editingId}`,
          certificationData
        );

        const data = response.data;

        const updatedCertification =
          data.certification || data;

        setCertifications((prev) =>
          prev.map((certification) =>
            certification._id === editingId
              ? updatedCertification
              : certification
          )
        );
      }

      // CREATE
      else {
        const response = await api.post(
          "/certifications",
          certificationData
        );

        const data = response.data;

        const newCertification =
          data.certification || data;

        setCertifications((prev) => [
          ...prev,
          newCertification,
        ]);
      }

      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save certification"
      );
    } finally {
      setFormLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this certification?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/certifications/${id}`);

      setCertifications((prev) =>
        prev.filter(
          (certification) =>
            certification._id !== id
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete certification"
      );
    }
  };

  // =========================
  // CLOSE FORM
  // =========================

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="certifications-page">
        <div className="certifications-loading">
          Loading certifications...
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="certifications-page">

      <div className="certifications-header">
        <div>
          <h1>Certifications</h1>

          <p>
            Track your professional certifications and achievements.
          </p>
        </div>

        <button
          className="add-certification-btn"
          onClick={handleAdd}
        >
          + Add Certification
        </button>
      </div>

      {error && (
        <div className="certification-error">
          {error}
        </div>
      )}

      {certifications.length === 0 ? (
        <div className="empty-certifications">

          <div className="empty-icon">
            🏆
          </div>

          <h2>No Certifications Yet</h2>

          <p>
            Add your certifications to keep all your
            achievements organized in one place.
          </p>

          <button
            className="add-certification-btn"
            onClick={handleAdd}
          >
            + Add Your First Certification
          </button>

        </div>
      ) : (
        <div className="certifications-grid">

          {certifications.map((certification) => (

            <div
              className="certification-card"
              key={certification._id}
            >

              <div className="certification-icon">
                🏆
              </div>

              <div className="certification-content">

                <h2>
                  {certification.title}
                </h2>

                <p className="certification-issuer">
                  {certification.issuer}
                </p>

                {certification.issueDate && (
                  <p className="certification-date">
                    Issued:{" "}
                    {new Date(
                      certification.issueDate
                    ).toLocaleDateString()}
                  </p>
                )}

                {certification.expiryDate && (
                  <p className="certification-date">
                    Expires:{" "}
                    {new Date(
                      certification.expiryDate
                    ).toLocaleDateString()}
                  </p>
                )}

                {certification.credentialId && (
                  <p className="credential-id">
                    Credential ID:{" "}
                    {certification.credentialId}
                  </p>
                )}

                {certification.credentialUrl && (
                  <a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-credential-btn"
                  >
                    View Credential
                  </a>
                )}

                <div className="certification-actions">

                  <button
                    className="edit-certification-btn"
                    onClick={() =>
                      handleEdit(certification)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-certification-btn"
                    onClick={() =>
                      handleDelete(certification._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

      {showForm && (

        <div
          className="certification-modal-overlay"
          onClick={handleCloseForm}
        >

          <div
            className="certification-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>
                  {editingId
                    ? "Edit Certification"
                    : "Add Certification"}
                </h2>

                <p>
                  {editingId
                    ? "Update your certification details."
                    : "Add your certification details below."}
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={handleCloseForm}
              >
                ×
              </button>

            </div>

            <form
              className="certification-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label>
                  Certification Name *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Python Essentials 1"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Issuing Organization *
                </label>

                <input
                  type="text"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  placeholder="e.g. Cisco"
                  required
                />

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Issue Date *
                  </label>

                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Credential ID
                </label>

                <input
                  type="text"
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={handleChange}
                  placeholder="e.g. ABC123456"
                />

              </div>

              <div className="form-group">

                <label>
                  Credential URL
                </label>

                <input
                  type="url"
                  name="credentialUrl"
                  value={formData.credentialUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/certificate"
                />

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-certification-btn"
                  disabled={formLoading}
                >
                  {formLoading
                    ? "Saving..."
                    : editingId
                    ? "Update Certification"
                    : "Save Certification"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Certifications;