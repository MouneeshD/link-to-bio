import { useEffect, useState } from "react";

import {
  getMyProfile,
  updateMyProfile,
} from "../services/userService";

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      const response =
        await updateMyProfile(formData);

      const user = response.user;

      setFormData({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });

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

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h1>Edit Profile</h1>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name */}

        <div>
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            maxLength={50}
            required
          />
        </div>

        {/* Username */}

        <div>
          <label>Username</label>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            minLength={3}
            maxLength={30}
            required
          />
        </div>

        {/* Bio */}

        <div>
          <label>Bio</label>

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            maxLength={160}
            rows={4}
          />

          <small>
            {formData.bio.length}/160
          </small>
        </div>

        {/* Avatar */}

        <div>
          <label>Avatar URL</label>

          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : "Save Profile"}
        </button>
      </form>

      {/* Public URL */}

      {formData.username && (
        <div>
          <h3>Your public profile</h3>

          <p>
            /{formData.username}
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;