import React, { useState } from "react";
import api from "../axiosConfig";

const TaskForm = ({ setTasks }) => {
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");  // ✅ Nouvel état

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await api.post("/tasks", { 
        title: newTask,
        dueDate: dueDate || null  // ✅ Envoyer dueDate
      });
      setTasks((prev) => [...prev, res.data]);
      setNewTask("");
      setDueDate("");  // ✅ Réinitialiser la date
    } catch (err) {
      alert("Erreur lors de l'ajout de la tâche");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Nouvelle tâche"
        required
        className="task-input"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="date-input"
      />
      <button type="submit" className="btn btn-primary">
        Ajouter
      </button>
    </form>
  );
};

export default TaskForm;