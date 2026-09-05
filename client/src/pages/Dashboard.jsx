
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

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

  return (
    <div>
        <h1>Dashboard</h1>

        <h2>Welcome, {user?.name}</h2>

        <p>Email: {user?.email}</p>

        <p>
        Username: @{user?.username}
        </p>
        <div>
        <Link to="/profile"> Edit Profile </Link>
        </div>

        <div>
          <Link to="/links">Manage Links</Link>
        </div>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;