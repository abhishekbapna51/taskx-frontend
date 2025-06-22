import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-100 dark:bg-gray-950">
      <form
        onSubmit={handleRegister}
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-full p-6 sm:p-8 rounded-lg shadow-md space-y-4 max-w-md"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <input
          name="name"
          type="text"
          placeholder="Name"
          onChange={handleChange}
          required
          className="input-field"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="input-field"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="input-field"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
