import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ExternalLink,
  Link as LinkIcon,
  User,
} from "lucide-react";

import { getPublicProfile } from "../services/userService";

import "../styles/PublicProfile.css";

const PublicProfile = () => {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        setAvatarError(false);

        const data = await getPublicProfile(username);

        setProfile(data.profile);
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Profile not found"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="public-profile-page">
        <div className="public-profile-loading">
          <div className="public-profile-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="public-profile-page">
        <div className="public-profile-error">
          <div className="error-icon">
            <User size={28} />
          </div>

          <h1>Profile not found</h1>

          <p>
            {error ||
              "This profile does not exist."}
          </p>
        </div>
      </div>
    );
  }

  // Get customization settings
  const customization = {
    backgroundColor:
      profile.customization?.backgroundColor ||
      "#ffffff",

    buttonStyle:
      profile.customization?.buttonStyle ||
      "rounded",

    theme:
      profile.customization?.theme ||
      "light",
  };

  const isDark =
    customization.theme === "dark";

  const initial =
    profile.name?.charAt(0)?.toUpperCase() ||
    "U";

  const getButtonRadius = () => {
    switch (customization.buttonStyle) {
      case "square":
        return "4px";

      case "pill":
        return "999px";

      case "rounded":
      default:
        return "12px";
    }
  };

  return (
    <div
      className={`public-profile-page ${
        isDark ? "public-profile-dark" : ""
      }`}
      style={{
        backgroundColor:
          customization.backgroundColor,
      }}
    >
      <main className="public-profile-container">
        {/* PROFILE HEADER */}
        <section className="public-profile-header">
          <div className="public-avatar">
            {profile.avatar &&
            !avatarError ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                onError={() =>
                  setAvatarError(true)
                }
              />
            ) : (
              initial
            )}
          </div>

          <h1>{profile.name}</h1>

          <p className="public-username">
            @{profile.username}
          </p>

          {profile.bio && (
            <p className="public-bio">
              {profile.bio}
            </p>
          )}
        </section>

        {/* LINKS */}
        <section className="public-links">
          {profile.links.length === 0 ? (
            <div className="no-links">
              <LinkIcon size={22} />

              <p>No links available yet.</p>
            </div>
          ) : (
            profile.links.map((link) => (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="public-link"
                style={{
                  borderRadius:
                    getButtonRadius(),
                }}
              >
                <span className="public-link-title">
                  {link.title}
                </span>

                <ExternalLink
                  size={17}
                  className="public-link-icon"
                />
              </a>
            ))
          )}
        </section>

        {/* FOOTER */}
        <footer className="public-profile-footer">
          <span>
            <LinkIcon size={14} />
            Link-in-Bio
          </span>
        </footer>
      </main>
    </div>
  );
};

export default PublicProfile;