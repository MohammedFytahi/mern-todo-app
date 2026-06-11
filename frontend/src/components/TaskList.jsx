import React, { useState } from "react";
import api from "../axiosConfig";
import EditModal from "./EditModal";

const TaskList = ({ tasks, setTasks }) => {
  const [editingTask, setEditingTask] = useState(null);

  // ✅ Fonction pour vérifier si une tâche est en retard
  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  // ✅ Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const toggleComplete = async (task) => {
    try {
      const res = await api.put(`/tasks/${task._id}`, { 
        completed: !task.completed 
      });
      setTasks((prev) => 
        prev.map((t) => (t._id === task._id ? res.data : t))
      );
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

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
          <li key={task._id} className={isOverdue(task) ? "overdue" : ""}>
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
            
            {/* ✅ Affichage de la date d'échéance */}
            {task.dueDate && (
              <span className={`due-date ${isOverdue(task) ? "overdue-text" : ""}`}>
                📅 {formatDate(task.dueDate)}
              </span>
            )}
            
            <div className="task-actions">
              <button onClick={() => setEditingTask(task)} className="edit-btn">
                ✏️
              </button>
              <button onClick={() => deleteTask(task._id)} className="delete-btn">
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      {tasks.length > 0 && (
        <div className="task-stats">
          📊 {remainingTasks} tâche(s) restante(s) sur {tasks.length}
        </div>
      )}

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