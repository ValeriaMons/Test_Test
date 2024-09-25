import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';
import userRoutes from './routes/userRoutes';
import initUser from './models/user';



dotenv.config();

const app = express();
app.use(express.json());

// Initialize User model
initUser(sequelize);

// Routes
app.use('/users', userRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Unable to connect to the database:', err));