import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPublicProfile } from "../services/userService";

const PublicProfile = () => {
  const { username } = useParams();

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getPublicProfile(username);

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


  // Loading

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
        }}
      >
        Loading profile...
      </div>
    );
  }


  // Error

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
        }}
      >
        <h1>Profile not found</h1>

        <p>{error}</p>
      </div>
    );
  }


  // Profile

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >

        {/* AVATAR */}

        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              fontSize: "40px",
            }}
          >
            {profile.name
              ?.charAt(0)
              ?.toUpperCase()}
          </div>
        )}


        {/* NAME */}

        <h1>
          {profile.name}
        </h1>


        {/* USERNAME */}

        <p>
          @{profile.username}
        </p>


        {/* BIO */}

        {profile.bio && (
          <p
            style={{
              marginBottom: "30px",
            }}
          >
            {profile.bio}
          </p>
        )}


        {/* LINKS */}

        <div>
          {profile.links.length === 0 ? (
            <p>
              No links available.
            </p>
          ) : (
            profile.links.map(
              (link) => (
                <a
                  key={link._id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    padding: "16px",
                    marginBottom: "12px",
                    background: "#fff",
                    color: "#111",
                    textDecoration: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                  }}
                >
                  {link.title}
                </a>
              )
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default PublicProfile;