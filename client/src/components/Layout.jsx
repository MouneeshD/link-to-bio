import {
LayoutDashboard,
User,
Link as LinkIcon,
Palette,
LogOut,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import "./Layout.css";

const Layout = ({ children }) => {
const navigate = useNavigate();

const handleLogout = async () => {
try {
await fetch(
"http://localhost:5000/api/auth/logout",
{
method: "POST",
credentials: "include",
}
);

  navigate("/login");

} catch (error) {
  console.error(
    "Logout failed:",
    error
  );
}

};

return ( <div className="app-layout">


  {/* SIDEBAR */}

  <aside className="sidebar">

    <div className="sidebar-logo">
      <div className="logo-icon">
        L
      </div>

      <span>
        LinkFlow
      </span>
    </div>


    {/* NAVIGATION */}

    <nav className="sidebar-nav">

      <Link
        to="/dashboard"
        className="nav-item"
      >
        <LayoutDashboard size={20} />

        Dashboard
      </Link>


      <Link
        to="/profile"
        className="nav-item"
      >
        <User size={20} />

        Profile
      </Link>


      <Link
        to="/links"
        className="nav-item"
      >
        <LinkIcon size={20} />

        My Links
      </Link>


      <Link
        to="/customize"
        className="nav-item"
      >
        <Palette size={20} />

        Customize
      </Link>

    </nav>


    {/* LOGOUT */}

    <button
      className="logout-button"
      onClick={handleLogout}
    >
      <LogOut size={20} />

      Logout
    </button>

  </aside>


  {/* MAIN CONTENT */}

  <main className="main-content">
    {children}
  </main>

</div>


);
};

export default Layout;
