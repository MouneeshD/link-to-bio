import { useEffect, useState } from "react";
import {
  Palette,
  Moon,
  Sun,
  Square,
  Circle,
  CheckCircle,
  Save,
  Smartphone,
} from "lucide-react";

import {
  getMyProfile,
  updateMyProfile,
} from "../services/userService";
import BackButton from "../components/BackButton";

import "../styles/Customize.css";

const Customize = () => {
  const [customization, setCustomization] = useState({
    backgroundColor: "#ffffff",
    buttonStyle: "rounded",
    theme: "light",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();

        if (data.user.customization) {
          setCustomization({
            backgroundColor:
              data.user.customization.backgroundColor ||
              "#ffffff",
            buttonStyle:
              data.user.customization.buttonStyle ||
              "rounded",
            theme:
              data.user.customization.theme ||
              "light",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        setError("Failed to load customization settings.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomization((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      await updateMyProfile({
        customization,
      });

      setMessage("Customization saved successfully!");
    } catch (error) {
      console.error(
        "Failed to save customization:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save customization."
      );
    } finally {
      setSaving(false);
    }
  };

  const getButtonRadius = () => {
    if (customization.buttonStyle === "square") {
      return "4px";
    }

    if (customization.buttonStyle === "pill") {
      return "999px";
    }

    return "12px";
  };

  if (loading) {
    return (
      <div className="customize-page">
        <div className="customize-loading">
          <div className="customize-spinner"></div>
          <p>Loading customization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customize-page">
        <BackButton fallback="/dashboard" />
      <header className="customize-header">
        <div>
          <p className="customize-eyebrow">
            PROFILE DESIGN
          </p>

          <h1>Customize Profile</h1>

          <p className="customize-subtitle">
            Personalize the look and feel of your
            public Link-in-Bio page.
          </p>
        </div>
      </header>

      {message && (
        <div className="customize-alert success">
          <CheckCircle size={19} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="customize-alert error">
          <span>{error}</span>
        </div>
      )}

      <div className="customize-layout">
        {/* SETTINGS */}
        <section className="customize-card">
          <div className="customize-card-heading">
            <div className="heading-icon">
              <Palette size={21} />
            </div>

            <div>
              <h2>Appearance</h2>
              <p>
                Choose how your public profile
                should look.
              </p>
            </div>
          </div>

          {/* THEME */}
          <div className="customize-field">
            <div className="customize-field-label">
              <div>
                <h3>Theme</h3>
                <p>
                  Choose between a light or dark
                  appearance.
                </p>
              </div>
            </div>

            <div className="theme-options">
              <button
                type="button"
                className={`theme-option ${
                  customization.theme === "light"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setCustomization((prev) => ({
                    ...prev,
                    theme: "light",
                  }))
                }
              >
                <Sun size={20} />

                <div>
                  <strong>Light</strong>
                  <span>Clean and bright</span>
                </div>

                {customization.theme === "light" && (
                  <CheckCircle
                    className="option-check"
                    size={18}
                  />
                )}
              </button>

              <button
                type="button"
                className={`theme-option ${
                  customization.theme === "dark"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setCustomization((prev) => ({
                    ...prev,
                    theme: "dark",
                  }))
                }
              >
                <Moon size={20} />

                <div>
                  <strong>Dark</strong>
                  <span>Modern and minimal</span>
                </div>

                {customization.theme === "dark" && (
                  <CheckCircle
                    className="option-check"
                    size={18}
                  />
                )}
              </button>
            </div>
          </div>

          {/* BACKGROUND */}
          <div className="customize-field">
            <div className="customize-field-label">
              <div>
                <h3>Background Color</h3>
                <p>
                  Pick the background color for
                  your profile.
                </p>
              </div>
            </div>

            <div className="color-picker-wrapper">
              <div
                className="color-preview"
                style={{
                  backgroundColor:
                    customization.backgroundColor,
                }}
              ></div>

              <input
                type="color"
                name="backgroundColor"
                value={
                  customization.backgroundColor
                }
                onChange={handleChange}
              />

              <span>
                {customization.backgroundColor.toUpperCase()}
              </span>
            </div>
          </div>

          {/* BUTTON STYLE */}
          <div className="customize-field">
            <div className="customize-field-label">
              <div>
                <h3>Button Style</h3>
                <p>
                  Choose the shape of your profile
                  buttons.
                </p>
              </div>
            </div>

            <div className="button-style-options">
              <button
                type="button"
                className={`button-style-option ${
                  customization.buttonStyle ===
                  "square"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setCustomization((prev) => ({
                    ...prev,
                    buttonStyle: "square",
                  }))
                }
              >
                <Square size={20} />
                <span>Square</span>
              </button>

              <button
                type="button"
                className={`button-style-option ${
                  customization.buttonStyle ===
                  "rounded"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setCustomization((prev) => ({
                    ...prev,
                    buttonStyle: "rounded",
                  }))
                }
              >
                <div className="rounded-icon"></div>
                <span>Rounded</span>
              </button>

              <button
                type="button"
                className={`button-style-option ${
                  customization.buttonStyle ===
                  "pill"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setCustomization((prev) => ({
                    ...prev,
                    buttonStyle: "pill",
                  }))
                }
              >
                <Circle size={20} />
                <span>Pill</span>
              </button>
            </div>
          </div>

          <div className="customize-save-area">
            <button
              type="button"
              className="customize-save-button"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={18} />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </section>

        {/* PREVIEW */}
        <aside className="customize-preview-card">
          <div className="preview-header">
            <div>
              <h2>Live Preview</h2>

              <p>
                See how your profile will look.
              </p>
            </div>

            <Smartphone size={20} />
          </div>

          <div
            className={`phone-preview ${
              customization.theme === "dark"
                ? "dark-preview"
                : ""
            }`}
            style={{
              backgroundColor:
                customization.backgroundColor,
            }}
          >
            <div className="phone-profile">
              <div className="preview-avatar">
                U
              </div>

              <h3>Your Name</h3>

              <p>@username</p>

              <span>
                Welcome to my profile 👋
              </span>
            </div>

            <div className="preview-buttons">
              <div
                className="preview-button"
                style={{
                  borderRadius: getButtonRadius(),
                }}
              >
                My Website
              </div>

              <div
                className="preview-button"
                style={{
                  borderRadius: getButtonRadius(),
                }}
              >
                Instagram
              </div>

              <div
                className="preview-button"
                style={{
                  borderRadius: getButtonRadius(),
                }}
              >
                YouTube
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Customize;