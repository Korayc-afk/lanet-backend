import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// ✅ Admin tarafından yeni bildirim oluştur
export const createNotification = async (req: Request, res: Response) => {
  const { title, message, targetUserId, targetRole } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: 'Başlık ve mesaj zorunludur.' });
  }

  try {
    const newNotification = await prisma.notification.create({
      data: {
        title,
        message,
        targetUserId: targetUserId ? parseInt(targetUserId) : null,
        targetRole: targetRole || null,
      },
    });
    res.status(201).json({ message: 'Bildirim başarıyla gönderildi.', notification: newNotification });
  } catch (error) {
    console.error('Bildirim oluşturulurken hata:', error);
    res.status(500).json({ message: 'Bildirim gönderilemedi.' });
  }
};

// ✅ Admin tarafından gönderilen tüm bildirimleri listele
export const getAdminSentNotifications = async (_req: Request, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Admin bildirimleri alınırken hata:', error);
    res.status(500).json({ message: 'Bildirimler yüklenemedi.' });
  }
};

// ✅ Belirli bir kullanıcıya ait bildirimleri getir
export const getNotificationsForUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const userIdNum = parseInt(userId);

  if (isNaN(userIdNum)) {
    return res.status(400).json({ message: 'Geçersiz kullanıcı ID.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userIdNum },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { targetUserId: userIdNum },          // Bu kullanıcıya özel
          { targetUserId: null },               // Herkese gönderilenler
          { targetRole: user.role || undefined } // Rolüne uygun bildirimler
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(`Kullanıcı (${userId}) bildirimleri alınırken hata:`, error);
    res.status(500).json({ message: 'Bildirimler yüklenirken bir hata oluştu.' });
  }
};

// ✅ Bildirimi okundu olarak işaretle
export const markNotificationAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updatedNotification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true },
    });
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error(`Bildirim (ID: ${id}) okundu olarak işaretlenirken hata:`, error);
    res.status(500).json({ message: 'Bildirim okundu olarak işaretlenemedi.' });
  }
};

// ✅ Admin tarafından bildirim sil
export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.notification.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(`Bildirim (ID: ${id}) silinirken hata:`, error);
    res.status(500).json({ message: 'Bildirim silinemedi.' });
  }
};

// 🆕 Kullanıcı bilgilerini getir (ID ile)
export const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) return res.status(400).json({ message: "Geçersiz kullanıcı ID." });

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, email: true, role: true },
    });

    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

    res.status(200).json(user);
  } catch (error) {
    console.error("Kullanıcı alınırken hata:", error);
    res.status(500).json({ message: "Kullanıcı alınırken hata oluştu." });
  }
};
