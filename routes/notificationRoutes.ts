import { Router } from 'express';
import {
  createNotification,
  getAdminSentNotifications,
  deleteNotification,
  getNotificationsForUser,
  markNotificationAsRead,
  getUserById, // Yeni eklenen fonksiyon
} from '../controllers/notificationController';

const router = Router();

// 🛠️ Admin Rotaları
router.post('/', createNotification);
router.get('/admin', getAdminSentNotifications);
router.delete('/:id', deleteNotification);

// 👤 Kullanıcı Rotaları
router.get('/user/:userId', getNotificationsForUser);
router.put('/:id/read', markNotificationAsRead);

// 🆕 Kullanıcı bilgisi için endpoint
router.get('/users/:id', getUserById);

export default router;
