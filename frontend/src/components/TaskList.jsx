import React, { useState } from "react";
import api from "../axiosConfig";
import EditModal from "./EditModal";
import { useToast } from "../context/ToastContext";  // ✅ Importer

const TaskList = ({ tasks, setTasks }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const { showToast } = useToast();  // ✅ Utiliser le hook

  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const toggleComplete = async (task) => {
    setLoadingAction(task._id);
    try {
      const res = await api.put(`/tasks/${task._id}`, { 
        completed: !task.completed 
      });
      setTasks((prev) => 
        prev.map((t) => (t._id === task._id ? res.data : t))
      );
      const status = !task.completed ? "complétée" : "décochée";
      showToast(`Tâche ${status} !`, "success");  // ✅ Toast
    } catch (err) {
      showToast("Erreur lors de la mise à jour", "error");  // ✅ Toast
    } finally {
      setLoadingAction(null);
    }
  };

  const deleteTask = async (id, title) => {
    setLoadingAction(id);
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      showToast(`"${title}" supprimée`, "warning");  // ✅ Toast
    } catch (err) {
      showToast("Erreur lors de la suppression", "error");  // ✅ Toast
    } finally {
      setLoadingAction(null);
    }
  };

  const updateTask = async (id, newTitle, newDueDate) => {
    setLoadingAction(id);
    try {
      const res = await api.put(`/tasks/${id}`, { 
        title: newTitle,
        dueDate: newDueDate
      });
      setTasks((prev) => 
        prev.map((t) => (t._id === id ? res.data : t))
      );
      setEditingTask(null);
      showToast("Tâche modifiée avec succès !", "success");  // ✅ Toast
    } catch (err) {
      showToast("Erreur lors de la modification", "error");  // ✅ Toast
    } finally {
      setLoadingAction(null);
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
              disabled={loadingAction === task._id}
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
            
            {task.dueDate && (
              <span className={`due-date ${isOverdue(task) ? "overdue-text" : ""}`}>
                📅 {formatDate(task.dueDate)}
              </span>
            )}
            
            <div className="task-actions">
              <button 
                onClick={() => setEditingTask(task)} 
                className="edit-btn"
                disabled={loadingAction === task._id}
              >
                ✏️
              </button>
              <button 
                onClick={() => deleteTask(task._id, task.title)} 
                className="delete-btn"
                disabled={loadingAction === task._id}
              >
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