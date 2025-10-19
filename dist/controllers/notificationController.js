"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.deleteNotification = exports.markNotificationAsRead = exports.getNotificationsForUser = exports.getAdminSentNotifications = exports.createNotification = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// ✅ Admin tarafından yeni bildirim oluştur
const createNotification = async (req, res) => {
    const { title, message, targetUserId, targetRole } = req.body;
    if (!title || !message) {
        return res.status(400).json({ message: 'Başlık ve mesaj zorunludur.' });
    }
    try {
        const newNotification = await prisma_1.default.notification.create({
            data: {
                title,
                message,
                targetUserId: targetUserId ? parseInt(targetUserId) : null,
                targetRole: targetRole || null,
            },
        });
        res.status(201).json({ message: 'Bildirim başarıyla gönderildi.', notification: newNotification });
    }
    catch (error) {
        console.error('Bildirim oluşturulurken hata:', error);
        res.status(500).json({ message: 'Bildirim gönderilemedi.' });
    }
};
exports.createNotification = createNotification;
// ✅ Admin tarafından gönderilen tüm bildirimleri listele
const getAdminSentNotifications = async (_req, res) => {
    try {
        const notifications = await prisma_1.default.notification.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, username: true },
                },
            },
        });
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error('Admin bildirimleri alınırken hata:', error);
        res.status(500).json({ message: 'Bildirimler yüklenemedi.' });
    }
};
exports.getAdminSentNotifications = getAdminSentNotifications;
// ✅ Belirli bir kullanıcıya ait bildirimleri getir
const getNotificationsForUser = async (req, res) => {
    const { userId } = req.params;
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
        return res.status(400).json({ message: 'Geçersiz kullanıcı ID.' });
    }
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userIdNum },
            select: { role: true },
        });
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
        const notifications = await prisma_1.default.notification.findMany({
            where: {
                OR: [
                    { targetUserId: userIdNum }, // Bu kullanıcıya özel
                    { targetUserId: null }, // Herkese gönderilenler
                    { targetRole: user.role || undefined } // Rolüne uygun bildirimler
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error(`Kullanıcı (${userId}) bildirimleri alınırken hata:`, error);
        res.status(500).json({ message: 'Bildirimler yüklenirken bir hata oluştu.' });
    }
};
exports.getNotificationsForUser = getNotificationsForUser;
// ✅ Bildirimi okundu olarak işaretle
const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedNotification = await prisma_1.default.notification.update({
            where: { id: parseInt(id) },
            data: { isRead: true },
        });
        res.status(200).json(updatedNotification);
    }
    catch (error) {
        console.error(`Bildirim (ID: ${id}) okundu olarak işaretlenirken hata:`, error);
        res.status(500).json({ message: 'Bildirim okundu olarak işaretlenemedi.' });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
// ✅ Admin tarafından bildirim sil
const deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.default.notification.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error(`Bildirim (ID: ${id}) silinirken hata:`, error);
        res.status(500).json({ message: 'Bildirim silinemedi.' });
    }
};
exports.deleteNotification = deleteNotification;
// 🆕 Kullanıcı bilgilerini getir (ID ile)
const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ message: "Geçersiz kullanıcı ID." });
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id },
            select: { id: true, username: true, email: true, role: true },
        });
        if (!user)
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Kullanıcı alınırken hata:", error);
        res.status(500).json({ message: "Kullanıcı alınırken hata oluştu." });
    }
};
exports.getUserById = getUserById;
