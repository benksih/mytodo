const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// All category routes are protected
router.use(authenticateToken);

// Create a new category
router.post('/', async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    // Check if category with the same name already exists for this user
    const existingCategory = await prisma.category.findUnique({
      where: {
        name_userId: {
          name,
          userId,
        },
      },
    });

    if (existingCategory) {
      return res.status(409).json({ error: 'Category with this name already exists' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        userId,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all categories for the logged-in user
router.get('/', async (req, res) => {
  const userId = req.user.userId;
  try {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    console.error("Fetch categories error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.userId;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    const category = await prisma.category.findUnique({ where: { id: parseInt(id) } });

    if (!category || category.userId !== userId) {
      return res.status(404).json({ error: 'Category not found or permission denied' });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json(updatedCategory);
  } catch (error) {
    // Handle potential unique constraint violation on update
    if (error.code === 'P2002') {
        return res.status(409).json({ error: 'A category with this name already exists.' });
    }
    console.error("Update category error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const category = await prisma.category.findUnique({ where: { id: parseInt(id) } });

    if (!category || category.userId !== userId) {
      return res.status(404).json({ error: 'Category not found or permission denied' });
    }

    // Note: The schema is set to `onDelete: SetNull` for tasks,
    // so deleting a category will not delete its tasks.
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
