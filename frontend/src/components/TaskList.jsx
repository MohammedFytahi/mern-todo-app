import React, { useState } from "react";
import api from "../axiosConfig";
import EditModal from "./EditModal";

const TaskList = ({ tasks, setTasks }) => {
  const [editingTask, setEditingTask] = useState(null);

  // Basculer l'état complété
  const toggleComplete = async (task) => {
    try {
      const res = await api.put(`/tasks/${task._id}`, { 
        completed: !task.completed 
      });
      setTasks((prev) => 
        prev.map((t) => (t._id === task._id ? res.data : t))
      );
    } catch (err) {
      alert("Erreur lors de la mise à jour de la tâche");
    }
  };

  // Supprimer une tâche
  const deleteTask = async (id) => {
    if (!id) {
      alert("ID de tâche invalide");
      return;
    }
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  // Modifier une tâche
  const updateTask = async (id, newTitle) => {
    try {
      const res = await api.put(`/tasks/${id}`, { title: newTitle });
      setTasks((prev) => 
        prev.map((t) => (t._id === id ? res.data : t))
      );
      setEditingTask(null);
    } catch (err) {
      alert("Erreur lors de la modification");
    }
  };

  const remainingTasks = tasks.filter(t => !t.completed).length;

  return (
    <div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed || false}
              onChange={() => toggleComplete(task)}
              className="task-checkbox"
            />
            <span
              className="task-title"
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                opacity: task.completed ? 0.7 : 1,
              }}
            >
              {task.title}
            </span>
            <div className="task-actions">
              <button onClick={() => setEditingTask(task)} className="edit-btn">
                ✏️ Modifier
              </button>
              <button onClick={() => deleteTask(task._id)} className="delete-btn">
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      {tasks.length > 0 && (
        <div className="task-stats">
          📊 {remainingTasks} tâche(s) restante(s) sur {tasks.length}
          {remainingTasks === 0 && tasks.length > 0 && " 🎉 Félicitations !"}
        </div>
      )}

      {/* Modal d'édition */}
      {editingTask && (
        <EditModal
          task={editingTask}
          onSave={updateTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;