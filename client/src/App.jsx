import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Links from "./pages/Links";
import PublicProfile from "./pages/PublicProfile";
import Customize from "./pages/Customize";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
        path="/links"
        element={
          <ProtectedRoute>
            <Links />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customize"
        element={
          <ProtectedRoute>
            <Customize />
          </ProtectedRoute>
        }
      />
      <Route
          path="/:username"
          element={<PublicProfile />}
      />
      </Routes>
    </BrowserRouter>
  );
};

export default App;