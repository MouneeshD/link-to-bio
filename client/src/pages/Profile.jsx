import { useEffect, useState } from "react";
import {
  User,
  AtSign,
  FileText,
  Image,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import {
  getMyProfile,
  updateMyProfile,
} from "../services/userService";
import BackButton from "../components/BackButton";
import "../styles/Profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [avatarError, setAvatarError] = useState(false);

  // ========================================
  // GET PROFILE
  // ========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMyProfile();
        const user = response.user;

        setFormData({
          name: user.name || "",
          username: user.username || "",
          bio: user.bio || "",
          avatar: user.avatar || "",
        });

        setAvatarError(false);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ========================================
  // HANDLE CHANGE
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "avatar") {
      setAvatarError(false);
    }

    setMessage("");
    setError("");
  };

  // ========================================
  // UPDATE PROFILE
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const response = await updateMyProfile(formData);
      const user = response.user;

      setFormData({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });

      setAvatarError(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // AVATAR FALLBACK
  // ========================================

  const initial =
    formData.name?.charAt(0)?.toUpperCase() || "U";

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="profile-page">
      {/* =========================
          HEADER
      ========================== */}
      <BackButton />
      <header className="profile-header">
        <div>
          <p className="profile-eyebrow">
            PROFILE SETTINGS
          </p>

          <h1>Edit Profile</h1>

          <p className="profile-subtitle">
            Update the information people see on
            your public profile.
          </p>
        </div>
      </header>

      {/* =========================
          ALERTS
      ========================== */}

      {message && (
        <div className="profile-alert success">
          <CheckCircle size={19} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="profile-alert error">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      <div className="profile-layout">
        {/* =========================
            FORM
        ========================== */}

        <section className="profile-form-card">
          <div className="profile-card-heading">
            <div>
              <h2>Personal Information</h2>

              <p>
                Keep your profile information
                up to date.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* NAME */}

            <div className="profile-form-field">
              <label htmlFor="name">
                <User size={16} />
                Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={50}
                placeholder="Your name"
                required
              />

              <span className="field-help">
                This is the name displayed on your
                profile.
              </span>
            </div>

            {/* USERNAME */}

            <div className="profile-form-field">
              <label htmlFor="username">
                <AtSign size={16} />
                Username
              </label>

              <div className="username-input">
                <span>@</span>

                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={30}
                  placeholder="username"
                  required
                />
              </div>

              <span className="field-help">
                Letters, numbers and underscores
                only.
              </span>
            </div>

            {/* BIO */}

            <div className="profile-form-field">
              <div className="field-label-row">
                <label htmlFor="bio">
                  <FileText size={16} />
                  Bio
                </label>

                <span className="character-count">
                  {formData.bio.length}/160
                </span>
              </div>

              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                maxLength={160}
                rows={5}
                placeholder="Tell people a little about yourself..."
              />

              <span className="field-help">
                A short description that appears
                below your name.
              </span>
            </div>

            {/* AVATAR */}

            <div className="profile-form-field">
              <label htmlFor="avatar">
                <Image size={16} />
                Profile Image URL
              </label>

              <input
                id="avatar"
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />

              <span className="field-help">
                Use a publicly accessible image URL.
              </span>
            </div>

            {/* SAVE */}

            <div className="profile-save-area">
              <button
                type="submit"
                className="save-profile-button"
                disabled={saving}
              >
                <Save size={18} />

                {saving
                  ? "Saving..."
                  : "Save Profile"}
              </button>
            </div>
          </form>
        </section>

        {/* =========================
            PREVIEW
        ========================== */}

        <aside className="profile-preview-card">
          <div className="preview-heading">
            <div>
              <h2>Profile Preview</h2>

              <p>
                This is how your profile
                information looks.
              </p>
            </div>
          </div>

          <div className="profile-preview">
            <div className="preview-avatar">
              {formData.avatar &&
              !avatarError ? (
                <img
                  src={formData.avatar}
                  alt={
                    formData.name ||
                    "Profile preview"
                  }
                  onError={() =>
                    setAvatarError(true)
                  }
                />
              ) : (
                initial
              )}
            </div>

            <h3>
              {formData.name ||
                "Your Name"}
            </h3>

            <p className="preview-username">
              @{formData.username || "username"}
            </p>

            <p className="preview-bio">
              {formData.bio ||
                "Your bio will appear here."}
            </p>

            <div className="preview-links">
              <div className="preview-link"></div>
              <div className="preview-link"></div>
            </div>
          </div>

          {/* PUBLIC PROFILE */}

          {formData.username && (
            <a
              href={`/${formData.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="public-profile-button"
            >
              View Public Profile
              <ExternalLink size={17} />
            </a>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Profile;