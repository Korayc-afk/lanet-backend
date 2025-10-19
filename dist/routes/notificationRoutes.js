"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const router = (0, express_1.Router)();
// 🛠️ Admin Rotaları
router.post('/', notificationController_1.createNotification);
router.get('/admin', notificationController_1.getAdminSentNotifications);
router.delete('/:id', notificationController_1.deleteNotification);
// 👤 Kullanıcı Rotaları
router.get('/user/:userId', notificationController_1.getNotificationsForUser);
router.put('/:id/read', notificationController_1.markNotificationAsRead);
// 🆕 Kullanıcı bilgisi için endpoint
router.get('/users/:id', notificationController_1.getUserById);
exports.default = router;
