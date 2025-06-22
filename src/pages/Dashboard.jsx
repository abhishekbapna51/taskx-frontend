import React, { useEffect, useState } from "react";
import API from "../api/api";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "Medium",
        status: "Todo",
    });
    const [editId, setEditId] = useState(null);

    const token = localStorage.getItem("token");

    const fetchTasks = async () => {
        try {
            const res = await API.get("/tasks", {
                headers: { Authorization: token },
            });
            setTasks(res.data);
        } catch (err) {
            alert("Failed to fetch tasks");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await API.put(`/tasks/${editId}`, form, {
                    headers: { Authorization: token },
                });
                setEditId(null);
            } else {
                await API.post("/tasks", form, {
                    headers: { Authorization: token },
                });
            }
            fetchTasks();
            setForm({ title: "", description: "", priority: "Medium", status: "Todo" });
        } catch (err) {
            alert("Failed to submit task");
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/tasks/${id}`, {
                headers: { Authorization: token },
            });
            fetchTasks();
        } catch {
            alert("Delete failed");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Task Manager</h1>

                <div className="card p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        {editId ? "Edit Task" : "Create New Task"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Task title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            className="input-field"
                        />

                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="input-field min-h-[100px]"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                className="input-field"
                                value={form.priority}
                                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                            >
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                            </select>

                            <select
                                className="input-field"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" className="btn-primary">
                                {editId ? "Update Task" : "Create Task"}
                            </button>
                            {editId && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setEditId(null);
                                        setForm({ title: "", description: "", priority: "Medium", status: "Todo" });
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <h2 className="text-xl font-semibold mb-4 text-gray-700">My Tasks</h2>

                {tasks.length === 0 ? (
                    <div className="card p-6 text-center text-gray-500">
                        No tasks found. Create your first task!
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {tasks.map((task) => (
                            <li key={task._id} className="card p-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{task.title}</h3>
                                        {task.description && (
                                            <p className="text-gray-600 mt-1">{task.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.priority === "High" ? "priority-high" :
                                                task.priority === "Medium" ? "priority-medium" : "priority-low"
                                                }`}>
                                                {task.priority} Priority
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === "Todo" ? "status-todo" :
                                                task.status === "In Progress" ? "status-in-progress" : "status-done"
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditId(task._id);
                                                setForm({
                                                    title: task.title,
                                                    description: task.description || "",
                                                    priority: task.priority,
                                                    status: task.status,
                                                });
                                            }}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task._id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
