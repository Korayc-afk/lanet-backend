// src/server.ts
import * as express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv"; // .env dosyasını yüklemek için (EN BAŞTA OLMALI)

// .env dosyasını uygulama başında yüklüyoruz - ÇOK ERKEN YAPILMALI
dotenv.config();

// Debug: PORT değerini kontrol etmek için. Normalde bu satırı canlıda tutmayız.
console.log(`DEBUG: Backend PORT after dotenv.config(): ${process.env.PORT}`);

// Rota importları
import uploadRoutes from "./routes/upload";
import authRoutes from "./routes/auth";
import settingsRoutes from "./routes/settings";
import robotsRoute from "./routes/robots";
import footerLinksRoutes from "./routes/footerLinks";
import testRoute from "./routes/testRoute"; // Test rotası (isteğe bağlı, kaldırılabilir)
import userRoutes from "./routes/userRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import marqueeRoutes from "./routes/marquee";
import mainCardRoutes from "./routes/mainCardRoutes";
import partnerBrandRoutes from "./routes/partnerBrand";
import sponsorRoutes from "./routes/sponsorRoutes";
import promotionCardRoutes from "./routes/promotionCardRoutes";
import videoCardRoutes from "./routes/videoCardRoutes"; //

const app = express.default();

// Middleware'ler (Sırası önemlidir: CORS, JSON/URL parsing genelde en başta olur)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL'in
    credentials: true, // Cookie / Authorization gibi şeyler için gerekli
  })
); // CORS ayarları
app.use(express.default.json()); 
app.use(express.default.urlencoded({ extended: true })); 

// 💡 Gelen tüm API çağrılarını logla (geliştirme için faydalı, isteğe bağlı)
app.use((req, res, next) => {
  console.log("💡 API çağrısı geldi:", req.method, req.url);
  next();
});

// Statik uploads klasörü için doğru yol tanımlaması
const uploadsPath = path.join(__dirname, "uploads"); // __dirname, server.ts dosyasının dizinidir.
console.log("Statik uploads klasör yolu:", uploadsPath);
app.use("/uploads", express.default.static(path.resolve("uploads"))); // <-- Değişiklik
// API Rotaları (Tüm rotaları buraya ekleyin)
// Genel olarak, daha spesifik rotalar (örn: /api/users/:id) daha genel rotalardan (örn: /api/users) önce gelmelidir.
// Ancak Express'te app.use ile router eklerken, router içindeki sıralama önemlidir.
// Burada genel sıralama: Auth, Settings, Footer Links, Users, Notifications, Uploads, Test, Robots
app.use("/api/auth", authRoutes); // Kimlik doğrulama rotaları (/api/login, /api/register vb.)
app.use("/api", settingsRoutes); // Site ayarları rotaları
app.use("/api/marquee", marqueeRoutes);
app.use("/api/maincards", mainCardRoutes);
app.use("/api/partnerbrands", partnerBrandRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/promotion-cards", promotionCardRoutes); // bonuscard link yönetimi rotaları
app.use("/api/videos", videoCardRoutes); // youtube / Video yönetim
app.use("/api/footer-links", footerLinksRoutes); // Footer link yönetimi rotaları
app.use("/api/users", userRoutes); // Kullanıcı yönetimi rotaları
app.use("/api/notifications", notificationRoutes); // Bildirim yönetimi rotaları
app.use("/api/upload", uploadRoutes); // Resim/dosya yükleme rotaları
app.use("/api/test", testRoute); // Test rotası (geliştirme için, kaldırılabilir)

// Robots.txt gibi özel rotalar (genellikle en altta veya statik dosya sunumundan önce)
app.use("/", robotsRoute); // robots.txt endpoint'i kök dizinde çalışmalı

// Portu .env dosyasından al (yoksa 5002 varsayılan olur)
const PORT = process.env.PORT ? Number(process.env.PORT) : 5002;
app.listen(PORT, () => console.log('API listening on ' + PORT));

// Sunucuyu başlat
const server = app
  .listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("✅ Tüm API rotaları aktif!");
    console.log("✅ Statik dosyalar aktif!");
  })
  .on("error", (err: NodeJS.ErrnoException) => {
    // Sunucu başlatılırken oluşabilecek hataları yakala
    if (err.code === "EADDRINUSE") {
      console.error(
        `❌ Port ${PORT} zaten kullanımda. Başka bir uygulama bu portu kullanıyor olabilir.`
      );
    } else {
      console.error(
        "❌ Sunucu başlatılırken bilinmeyen bir hata oluştu:",
        err.message
      );
    }
    process.exit(1); // Hata durumunda uygulamadan çık
  });

// ZORUNLU: Yakalanmayan hataları ve Promise rejection'larını logla
// Bu, uygulamanın neden çöktüğünü anlamak için çok kritiktir.
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Yakalanmamış Promise Reddi:", reason);
  // process.exit(1); // Geliştirme ortamında hemen çıkmak istemeyebiliriz, ama üretimde önemlidir.
});
process.on("uncaughtException", (error) => {
  console.error("❌ Yakalanmamış Hata (Uygulama Çöktü):", error);
  process.exit(1); // Uygulamadan çık
});
