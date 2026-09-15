import { useEffect, useState } from "react";
import "./Certifications.css";

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

  useEffect(() => {
    fetchCertifications();
  }, []);

  // =========================
  // GET CERTIFICATIONS
  // =========================

  const fetchCertifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/certifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch certifications"
        );
      }

      setCertifications(data.certifications || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      const token = localStorage.getItem("token");

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
        const response = await fetch(
          `http://localhost:5000/api/certifications/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(certificationData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to update certification"
          );
        }

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
        const response = await fetch(
          "http://localhost:5000/api/certifications",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(certificationData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to add certification"
          );
        }

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
      setError(err.message);
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

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/certifications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete certification"
        );
      }

      setCertifications((prev) =>
        prev.filter(
          (certification) =>
            certification._id !== id
        )
      );

    } catch (err) {
      setError(err.message);
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

      {/* Header */}
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

      {/* Error */}
      {error && (
        <div className="certification-error">
          {error}
        </div>
      )}

      {/* Certification List */}
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

                {/* Actions */}
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

      {/* Add / Edit Modal */}
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

            {/* Modal Header */}
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

            {/* Form */}
            <form
              className="certification-form"
              onSubmit={handleSubmit}
            >

              {/* Title */}
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

              {/* Issuer */}
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

              {/* Dates */}
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

              {/* Credential ID */}
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

              {/* Credential URL */}
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

              {/* Actions */}
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