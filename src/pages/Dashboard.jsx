import React, { useEffect, useState, useCallback } from "react";
import API from "../api/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "Medium",
        status: "Todo",
        dueDate: "",
    });
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("title");

    const token = localStorage.getItem("token");

    const fetchTasks = useCallback(async () => {
        try {
            const res = await API.get("/tasks", {
                headers: { Authorization: token },
            });
            setTasks(res.data);
        } catch (err) {
            alert("Failed to fetch tasks");
        }
    }, [token]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

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
            setForm({
                title: "",
                description: "",
                priority: "Medium",
                status: "Todo",
                dueDate: "",
            });
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

    const exportToExcel = () => {
        if (tasks.length === 0) return alert("No tasks to export!");

        const exportData = tasks.map((task) => ({
            Title: task.title,
            Description: task.description || "—",
            Priority: task.priority,
            Status: task.status,
            "Due Date": new Date(task.dueDate).toLocaleDateString(),
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Tasks");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "TaskX_Tasks.xlsx");
    };

    const filteredTasks = tasks
        .filter((task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "title") return a.title.localeCompare(b.title);
            if (sortBy === "priority") return a.priority.localeCompare(b.priority);
            if (sortBy === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
            return 0;
        });

    const taskStats = {
        Todo: tasks.filter((t) => t.status === "Todo").length,
        "In Progress": tasks.filter((t) => t.status === "In Progress").length,
        Done: tasks.filter((t) => t.status === "Done").length,
    };

    const pieData = {
        labels: ["Todo", "In Progress", "Done"],
        datasets: [
            {
                label: "Tasks",
                data: [taskStats.Todo, taskStats["In Progress"], taskStats.Done],
                backgroundColor: ["#f87171", "#facc15", "#4ade80"],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Task Manager</h1>

                {/* Create/Edit Form */}
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
                            <input
                                type="date"
                                value={form.dueDate}
                                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button type="submit" className="btn-primary">
                                {editId ? "Update Task" : "Create Task"}
                            </button>
                            {editId && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setEditId(null);
                                        setForm({
                                            title: "",
                                            description: "",
                                            priority: "Medium",
                                            status: "Todo",
                                            dueDate: "",
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Search / Sort / Export */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                    <button
                        onClick={exportToExcel}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        📥 Export to Excel
                    </button>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field"
                        />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input-field"
                        >
                            <option value="title">Sort by Title</option>
                            <option value="priority">Sort by Priority</option>
                            <option value="dueDate">Sort by Due Date</option>
                        </select>
                    </div>
                </div>

                {/* Tasks List */}
                <h2 className="text-xl font-semibold mb-4 text-gray-700">My Tasks</h2>
                {filteredTasks.length === 0 ? (
                    <div className="card p-6 text-center text-gray-500">
                        No tasks found. Create your first task!
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {filteredTasks.map((task) => (
                            <li key={task._id} className="card p-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{task.title}</h3>
                                        {task.description && (
                                            <p className="text-gray-600 mt-1">{task.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.priority === "High"
                                                ? "priority-high"
                                                : task.priority === "Medium"
                                                    ? "priority-medium"
                                                    : "priority-low"
                                                }`}
                                            >
                                                {task.priority} Priority
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === "Todo"
                                                ? "status-todo"
                                                : task.status === "In Progress"
                                                    ? "status-in-progress"
                                                    : "status-done"
                                                }`}
                                            >
                                                {task.status}
                                            </span>
                                            {task.dueDate && (
                                                <span className="text-xs text-gray-500">
                                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-end">
                                        <button
                                            onClick={() => {
                                                setEditId(task._id);
                                                setForm({
                                                    title: task.title,
                                                    description: task.description || "",
                                                    priority: task.priority,
                                                    status: task.status,
                                                    dueDate: task.dueDate || "",
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

                {/* Chart Section */}
                <div className="mt-12 bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Task Completion Stats</h2>
                    <div className="max-w-xs mx-auto">
                        <Pie data={pieData} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
