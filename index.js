const express = require("express");
const app = express();
const PORT = 5002;
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = "super_secret_key"; // .env dosyasına taşı istersen

app.use(cors());
app.use(express.json());

// ✅ DB Test Route
app.get("/api/db-test", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`; // basit sorgu çalıştır
    res.json({ success: true, message: "✅ DB bağlantısı OK!" });
  } catch (error) {
    console.error("DB bağlantısı hatası:", error);
    res.status(500).json({ success: false, message: "❌ DB bağlantısı HATALI!" });
  }
});

// ✅ Login Route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Şifre yanlış" });
    }

    // JWT Token oluştur
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
});

// ✅ Protected Route (örnek)
app.get("/api/admin", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: "Token yok" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, message: `Merhaba ${decoded.username}` });
  } catch (err) {
    return res.status(403).json({ success: false, message: "Token geçersiz" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
