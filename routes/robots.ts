// 🔧 Dinamik robots.txt endpoint'i - settings tablosundaki allowSearchEngines alanına göre yanıt döner
import express from "express";
import prisma from "../lib/prisma"; // Prisma client

const router = express.Router();

router.get("/robots.txt", async (req, res) => {
  try {
    const settings = await prisma.settings.findFirst();

    const allow = settings?.allowSearchEngines;
    let content = "";

    if (allow) {
      // Arama motorlarına izin ver
      content = `User-agent: *\nDisallow:`;
    } else {
      // Arama motorlarını engelle
      content = `User-agent: *\nDisallow: /`;
    }

    res.type("text/plain").send(content);
  } catch (error) {
    console.error("robots.txt oluşturulurken hata:", error);
    res.status(500).send("User-agent: *\nDisallow: /"); // Hata durumunda tümünü engelle
  }
});

export default router;
