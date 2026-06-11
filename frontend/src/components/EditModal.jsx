import React, { useState } from "react";

const EditModal = ({ task, onSave, onClose }) => {
  const [newTitle, setNewTitle] = useState(task.title);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onSave(task._id, newTitle);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Modifier la tâche</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
            className="modal-input"
          />
          <div className="modal-buttons">
            <button type="submit" className="save-btn">Enregistrer</button>
            <button type="button" onClick={onClose} className="cancel-btn">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;