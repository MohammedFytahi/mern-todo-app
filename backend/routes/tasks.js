const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Récupérer les tâches de l'utilisateur connecté
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Ajouter une tâche
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({ title: req.body.title, user: req.user.id });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer une tâche
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
    }
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
});
// Modifier une tâche (gère à la fois le titre et le statut completed)
router.put("/:id", auth, async (req, res) => {
  try {
    console.log("PUT reçu - ID:", req.params.id);
    console.log("Données reçues:", req.body);
    
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    
    // Mettre à jour le titre si fourni
    if (req.body.title !== undefined) {
      task.title = req.body.title;
    }
    
    // Mettre à jour le statut completed si fourni
    if (req.body.completed !== undefined) {
      task.completed = req.body.completed;
    }
    
    await task.save();
    console.log("Tâche mise à jour:", task);
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la modification" });
  }
});
module.exports = router;