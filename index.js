require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Todoist Clone API is running!');
});

const authRoutes = require('./routes/auth');
const authenticateToken = require('./middleware/auth');
const taskRoutes = require('./routes/tasks');
const categoryRoutes = require('./routes/categories');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); // All routes in taskRoutes are already protected
app.use('/api/categories', categoryRoutes); // All routes in categoryRoutes are already protected

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
