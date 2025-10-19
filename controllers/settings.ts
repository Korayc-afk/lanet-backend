import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// Ayarları getirme
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.settings.findFirst();
    if (!settings) {
      return res.status(200).json({}); // Ayar yoksa boş obje dön
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Ayarlar çekilirken hata oluştu:", error);
    res.status(500).json({ message: "Ayarlar çekilirken sunucu hatası oluştu." });
  }
};

// Ayarları kaydetme/güncelleme
export const saveSettings = async (req: Request, res: Response) => {
  try {
    const {
      siteTitle,
      seoDescription,
      footerText,
      siteLogoUrl,
      faviconUrl,
      facebookLink,
      facebookText,
      instagramLink,
      instagramText,
      telegramLink,
      telegramText,
      youtubeLink,
      youtubeText,
      whatsappLink,
      whatsappText,
      skypeLink,
      skypeText,
      helpLink,
      helpText,
      twitterLink,
      twitterText,
      maintenanceMode,   // boolean
      popupText,        // string
      googleAnalyticsId,// string
      allowSearchEngines // boolean
    } = req.body;

    const dataToUpdate = {
      siteTitle: siteTitle ?? null,
      seoDescription: seoDescription ?? null,
      footerText: footerText ?? null,
      siteLogoUrl: siteLogoUrl ?? null,
      faviconUrl: faviconUrl ?? null,
      facebookLink: facebookLink ?? null,
      facebookText: facebookText ?? null,
      instagramLink: instagramLink ?? null,
      instagramText: instagramText ?? null,
      telegramLink: telegramLink ?? null,
      telegramText: telegramText ?? null,
      youtubeLink: youtubeLink ?? null,
      youtubeText: youtubeText ?? null,
      whatsappLink: whatsappLink ?? null,
      whatsappText: whatsappText ?? null,
      skypeLink: skypeLink ?? null,
      skypeText: skypeText ?? null,
      helpLink: helpLink ?? null,
      helpText: helpText ?? null,
      twitterLink: twitterLink ?? null,
      twitterText: twitterText ?? null,
      maintenanceMode: maintenanceMode ?? false,
      popupText: popupText ?? null,
      googleAnalyticsId: googleAnalyticsId ?? null,
      allowSearchEngines: allowSearchEngines ?? true,
    };

    // Önce ayar var mı kontrol et
    let settings = await prisma.settings.findFirst();

    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: dataToUpdate,
      });
    } else {
      settings = await prisma.settings.create({
        data: dataToUpdate,
      });
    }

    res.status(200).json({ message: "Ayarlar başarıyla kaydedildi.", settings });
  } catch (error) {
    console.error("Ayarlar kaydedilirken hata oluştu:", error);
    res.status(500).json({ message: "Ayarlar kaydedilirken sunucu hatası oluştu." });
  }
};
