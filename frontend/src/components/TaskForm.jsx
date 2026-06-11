import React, { useState } from "react";
import api from "../axiosConfig";
import { useToast } from "../context/ToastContext";  // ✅ Importer

const TaskForm = ({ setTasks }) => {
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();  // ✅ Utiliser le hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.post("/tasks", { 
        title: newTask,
        dueDate: dueDate || null
      });
      setTasks((prev) => [...prev, res.data]);
      setNewTask("");
      setDueDate("");
      showToast("Tâche ajoutée avec succès !", "success");  // ✅ Toast
    } catch (err) {
      showToast("Erreur lors de l'ajout de la tâche", "error");  // ✅ Toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Nouvelle tâche"
        required
        disabled={loading}
        className="task-input"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        disabled={loading}
        className="date-input"
      />
      <button type="submit" disabled={loading} className="btn btn-primary"> 
        {loading ? "Ajout..." : "Ajouter"}
      </button>
    </form>
  );
};

export default TaskForm;