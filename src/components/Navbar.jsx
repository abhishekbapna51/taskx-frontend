import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
      {/* Left: Logo + Brand */}
      <Link to="/" className="flex items-center space-x-2">
        <img src="/my-logo.svg" alt="Logo" className="h-8 w-8" />
        <span className="text-xl font-bold tracking-wide">TaskX Pro</span>
      </Link>

      {/* Right: Auth Buttons */}
      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-white text-indigo-600 rounded hover:bg-gray-100 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-white text-indigo-600 rounded hover:bg-gray-100 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
