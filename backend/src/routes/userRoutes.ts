import express, { Request, Response } from 'express';
import { User } from '../models/user';
import { getZitadelAccessToken, createZitadelUser, assignZitadelRole } from '../services/zitadelService';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: 'Bad request' });
  }
});

router.post('/sync', async (req: Request, res: Response) => {
  try {
    const accessToken = await getZitadelAccessToken();
    const users = await User.findAll();

    for (const user of users) {
      try {
        const zitadelUserId = await createZitadelUser(user, accessToken);
        await assignZitadelRole(zitadelUserId, user.role, accessToken);
        console.log(`User ${user.username} synced successfully`);
      } catch (error) {
        console.error(`Error syncing user ${user.username}:`, error);
      }
    }

    res.json({ message: 'Users sync process completed' });
  } catch (error) {
    console.error('Error in sync process:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/sync/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const accessToken = await getZitadelAccessToken();
    const zitadelUserId = await createZitadelUser(user, accessToken);
    await assignZitadelRole(zitadelUserId, user.role, accessToken);

    res.json({ message: `User ${user.username} synced successfully` });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;