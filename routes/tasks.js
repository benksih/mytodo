const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// All task routes are protected
router.use(authenticateToken);

// Create a new task
router.post('/', async (req, res) => {
  const { title, points, dueDate, reminderTime, priority, categoryId, parentId } = req.body;
  const authorId = req.user.userId;

  if (!title || points == null) {
    return res.status(400).json({ error: 'Title and points are required' });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        points,
        authorId,
        dueDate: dueDate ? new Date(dueDate) : null,
        reminderTime: reminderTime ? new Date(reminderTime) : null,
        priority,
        categoryId,
        parentId,
      },
      include: {
        category: true,
        subTasks: true,
      }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error("Task creation error:", error);
    res.status(500).json({ error: 'Internal server error while creating task' });
  }
});

// Get all top-level tasks for the logged-in user
router.get('/', async (req, res) => {
  const authorId = req.user.userId;
  try {
    const tasks = await prisma.task.findMany({
      where: { authorId, parentId: null },
      include: {
        category: true,
        subTasks: { // You can even nest includes
          include: {
            category: true
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error("Fetch tasks error:", error);
    res.status(500).json({ error: 'Internal server error while fetching tasks' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  // Destructure all possible fields from the body
  const { title, points, completed, dueDate, reminderTime, priority, categoryId } = req.body;
  const authorId = req.user.userId;

  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });

    if (!task || task.authorId !== authorId) {
      return res.status(404).json({ error: 'Task not found or you do not have permission to edit it' });
    }

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (points !== undefined) dataToUpdate.points = points;
    if (completed !== undefined) dataToUpdate.completed = completed;
    if (dueDate !== undefined) dataToUpdate.dueDate = dueDate ? new Date(dueDate) : null;
    if (reminderTime !== undefined) dataToUpdate.reminderTime = reminderTime ? new Date(reminderTime) : null;
    if (priority !== undefined) dataToUpdate.priority = priority;
    if (categoryId !== undefined) dataToUpdate.categoryId = categoryId;


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
          data: dataToUpdate,
        }),
      ]);
      res.json(updatedTask);
    } else {
      // Just update the task without changing the score
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(id) },
        data: dataToUpdate,
      });
      res.json(updatedTask);
    }
  } catch (error) {
    console.error("Update task error:", error);
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
