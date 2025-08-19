const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// All task routes are protected
router.use(authenticateToken);

// Create a new task
router.post('/', async (req, res) => {
  const { title, dueDate, reminderTime, points } = req.body;
  const authorId = req.user.userId;

  if (!title || !dueDate || !reminderTime || points == null) {
    return res.status(400).json({ error: 'Title, dueDate, reminderTime, and points are required' });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        reminderTime: new Date(reminderTime),
        points,
        authorId,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error while creating task' });
  }
});

// Get all tasks for the logged-in user
router.get('/', async (req, res) => {
  const authorId = req.user.userId;
  try {
    const tasks = await prisma.task.findMany({
      where: { authorId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error while fetching tasks' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, dueDate, reminderTime, points, completed } = req.body;
  const authorId = req.user.userId;

  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });

    if (!task || task.authorId !== authorId) {
      return res.status(404).json({ error: 'Task not found or you do not have permission to edit it' });
    }

    // If task is being marked as complete for the first time
    if (completed && !task.completed) {
      // Use a transaction to update both the task and the user's score
      const [, updatedTask] = await prisma.$transaction([
        prisma.user.update({
          where: { id: authorId },
          data: { totalScore: { increment: task.points } },
        }),
        prisma.task.update({
          where: { id: parseInt(id) },
          data: { title, dueDate: new Date(dueDate), reminderTime: new Date(reminderTime), points, completed },
        }),
      ]);
      res.json(updatedTask);
    } else {
      // Just update the task without changing the score
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(id) },
        data: { title, dueDate: new Date(dueDate), reminderTime: new Date(reminderTime), points, completed },
      });
      res.json(updatedTask);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error while updating task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const authorId = req.user.userId;

  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });

    if (!task || task.authorId !== authorId) {
      return res.status(404).json({ error: 'Task not found or you do not have permission to delete it' });
    }

    await prisma.task.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Internal server error while deleting task' });
  }
});


module.exports = router;
