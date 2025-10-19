// backend/routes/testRoute.ts
import express from 'express';
import prisma from '../lib/prisma'; // Doğru Prisma Client importu

const router = express.Router();

// FooterLink tablosuna test verisi ekleyen endpoint
router.get('/create-test-footer-link', async (req, res) => {
  try {
    const newLink = await prisma.footerLink.create({
      data: {
        widget: 1,
        title: 'Test Link - ' + Date.now(), // Her seferinde farklı bir başlık için Date.now() eklendi
        url: 'http://test.com/' + Date.now(), // Her seferinde farklı bir URL için Date.now() eklendi
        order: 1,
      },
    });
    res.status(200).json({ message: 'Test FooterLink başarıyla oluşturuldu!', link: newLink });
  } catch (error: any) {
    console.error('Test FooterLink oluşturulurken hata:', error);
    res.status(500).json({ message: 'Test FooterLink oluşturulamadı: ' + error.message });
  }
});

export default router;