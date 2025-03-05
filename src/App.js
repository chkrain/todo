import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const getStoredTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];
const getStoredTheme = () => localStorage.getItem("theme") || "light";

export default function App() {
    const [tasks, setTasks] = useState(getStoredTasks);
    const [theme, setTheme] = useState(getStoredTheme);
    const [taskText, setTaskText] = useState("");
    const [urgent, setUrgent] = useState(false);
    const [important, setImportant] = useState(false);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const addTask = () => {
        if (!taskText.trim()) return;
        const newTask = { id: Date.now(), text: taskText, urgent, important };
        setTasks([...tasks, newTask]);
        setTaskText("");
        setUrgent(false);
        setImportant(false);
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    const getCategory = (task) => {
        if (task.important && task.urgent) return "do";
        if (task.important && !task.urgent) return "schedule";
        if (!task.important && task.urgent) return "delegate";
        return "eliminate";
    };

    const categories = {
        do: { title: "Срочно и Важно", color: "bg-red-500" },
        schedule: { title: "Не срочно и Важно", color: "bg-blue-500" },
        delegate: { title: "Срочно и Не важно", color: "bg-yellow-500" },
        eliminate: { title: "Не срочно и Не важно", color: "bg-gray-500" },
    };

    return (
        <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition">
            <button onClick={toggleTheme} className="mb-4 px-4 py-2 bg-gray-800 text-white rounded">
                {theme === "light" ? "Темная тема" : "Светлая тема"}
            </button>

            <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
                <input
                    type="text"
                    className="border p-2 rounded w-full dark:bg-gray-700"
                    placeholder="Введите задачу..."
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                />
                <div className="flex gap-4 mt-2">
                    <label>
                        <input type="checkbox" checked={urgent} onChange={() => setUrgent(!urgent)} /> Срочно
                    </label>
                    <label>
                        <input type="checkbox" checked={important} onChange={() => setImportant(!important)} /> Важно
                    </label>
                    <button onClick={addTask} className="px-4 py-2 bg-green-500 text-white rounded">
                        Добавить
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {Object.entries(categories).map(([key, { title, color }]) => (
                    <div key={key} className={`p-4 ${color} text-white rounded shadow`}>
                        <h2 className="text-lg font-bold">{title}</h2>
                        {tasks
                            .filter((task) => getCategory(task) === key)
                            .map((task) => (
                                <motion.div
                                    key={task.id}
                                    className="mt-2 p-2 bg-white text-gray-900 rounded shadow flex justify-between"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    {task.text}
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="ml-2 bg-red-600 text-white px-2 py-1 rounded"
                                    >
                                        ✕
                                    </button>
                                </motion.div>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
