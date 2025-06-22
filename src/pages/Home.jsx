import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-4">Welcome to TaskX Pro</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        TaskX Pro helps you manage your day-to-day tasks efficiently with easy tracking, priority tagging, and real-time updates.
        Create, update, and organize your work effortlessly.
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="btn-primary">Login</Link>
        <Link to="/register" className="btn-secondary">Register</Link>
      </div>
    </div>
  );
};

export default Home;
