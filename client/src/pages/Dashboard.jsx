import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Link as LinkIcon,
  Palette,
  LogOut,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const username = user?.username || "username";
  const firstName = user?.name?.split(" ")[0] || "User";
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const publicProfileUrl = `${window.location.origin}/${username}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicProfileUrl);
      alert("Profile link copied!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div className="dashboard-page">
      {/* =========================
          TOP HEADER
      ========================== */}
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">DASHBOARD</p>

          <h1>
            Welcome back, {firstName} 👋
          </h1>

          <p className="dashboard-subtitle">
            Manage your profile and links from one place.
          </p>
        </div>

        <div className="dashboard-profile-mini">
          <div className="mini-avatar">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "Profile"}
              />
            ) : (
              initial
            )}
          </div>

          <div className="mini-user-info">
            <strong>{user?.name || "Your Name"}</strong>

            <span>@{username}</span>
          </div>

          <button
            className="dashboard-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* =========================
          PROFILE OVERVIEW
      ========================== */}
      <section className="profile-overview-card">
        <div className="profile-card-left">
          <div className="profile-avatar-large">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "Profile"}
              />
            ) : (
              initial
            )}
          </div>

          <div>
            <h2>{user?.name || "Your Name"}</h2>

            <p className="profile-username">
              @{username}
            </p>

            <p className="profile-email">
              {user?.email || "No email available"}
            </p>
          </div>
        </div>

        <a
          href={`/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="view-profile-button"
        >
          View Public Profile
          <ExternalLink size={18} />
        </a>
      </section>

      {/* =========================
          QUICK ACTIONS
      ========================== */}
      <div className="section-heading">
        <div>
          <h2>Quick Actions</h2>

          <p>
            Manage and customize your Link-in-Bio page.
          </p>
        </div>
      </div>

      <section className="action-grid">
        {/* EDIT PROFILE */}
        <Link
          to="/profile"
          className="action-card"
        >
          <div className="action-icon purple">
            <User size={25} />
          </div>

          <div className="action-content">
            <h3>Edit Profile</h3>

            <p>
              Update your name, username, bio and avatar.
            </p>
          </div>

          <ArrowRight
            className="action-arrow"
            size={20}
          />
        </Link>

        {/* MANAGE LINKS */}
        <Link
          to="/links"
          className="action-card"
        >
          <div className="action-icon blue">
            <LinkIcon size={25} />
          </div>

          <div className="action-content">
            <h3>Manage Links</h3>

            <p>
              Add, edit, organize and manage your links.
            </p>
          </div>

          <ArrowRight
            className="action-arrow"
            size={20}
          />
        </Link>

        {/* CUSTOMIZE PROFILE */}
        <Link
          to="/customize"
          className="action-card"
        >
          <div className="action-icon orange">
            <Palette size={25} />
          </div>

          <div className="action-content">
            <h3>Customize Profile</h3>

            <p>
              Change themes, colors and button styles.
            </p>
          </div>

          <ArrowRight
            className="action-arrow"
            size={20}
          />
        </Link>
      </section>

      {/* =========================
          PUBLIC PROFILE LINK
      ========================== */}
      <section className="share-card">
        <div>
          <p className="share-label">
            YOUR PUBLIC LINK
          </p>

          <h3>{publicProfileUrl}</h3>
        </div>

        <button
          className="copy-button"
          onClick={handleCopyLink}
        >
          Copy Link
        </button>
      </section>
    </div>
  );
};

export default Dashboard;