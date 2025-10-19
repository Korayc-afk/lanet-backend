"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv")); // .env dosyasını yüklemek için (EN BAŞTA OLMALI)
// .env dosyasını uygulama başında yüklüyoruz - ÇOK ERKEN YAPILMALI
dotenv_1.default.config();
// Debug: PORT değerini kontrol etmek için. Normalde bu satırı canlıda tutmayız.
console.log(`DEBUG: Backend PORT after dotenv.config(): ${process.env.PORT}`);
// Rota importları
const upload_1 = __importDefault(require("./routes/upload"));
const auth_1 = __importDefault(require("./routes/auth"));
const settings_1 = __importDefault(require("./routes/settings"));
const robots_1 = __importDefault(require("./routes/robots"));
const footerLinks_1 = __importDefault(require("./routes/footerLinks"));
const testRoute_1 = __importDefault(require("./routes/testRoute")); // Test rotası (isteğe bağlı, kaldırılabilir)
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const marquee_1 = __importDefault(require("./routes/marquee"));
const mainCardRoutes_1 = __importDefault(require("./routes/mainCardRoutes"));
const partnerBrand_1 = __importDefault(require("./routes/partnerBrand"));
const sponsorRoutes_1 = __importDefault(require("./routes/sponsorRoutes"));
const promotionCardRoutes_1 = __importDefault(require("./routes/promotionCardRoutes"));
const videoCardRoutes_1 = __importDefault(require("./routes/videoCardRoutes")); //
const app = (0, express_1.default)();
// Middleware'ler (Sırası önemlidir: CORS, JSON/URL parsing genelde en başta olur)
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // frontend URL'in
    credentials: true, // Cookie / Authorization gibi şeyler için gerekli
})); // CORS ayarları
app.use(express_1.default.json()); // JSON body parsing
app.use(express_1.default.urlencoded({ extended: true })); // URL-encoded body parsing
// 💡 Gelen tüm API çağrılarını logla (geliştirme için faydalı, isteğe bağlı)
app.use((req, res, next) => {
    console.log("💡 API çağrısı geldi:", req.method, req.url);
    next();
});
// Statik uploads klasörü için doğru yol tanımlaması
const uploadsPath = path_1.default.join(__dirname, "uploads"); // __dirname, server.ts dosyasının dizinidir.
console.log("Statik uploads klasör yolu:", uploadsPath);
app.use("/uploads", express_1.default.static(path_1.default.resolve("uploads")));
// API Rotaları (Tüm rotaları buraya ekleyin)
// Genel olarak, daha spesifik rotalar (örn: /api/users/:id) daha genel rotalardan (örn: /api/users) önce gelmelidir.
// Ancak Express'te app.use ile router eklerken, router içindeki sıralama önemlidir.
// Burada genel sıralama: Auth, Settings, Footer Links, Users, Notifications, Uploads, Test, Robots
app.use("/api/auth", auth_1.default); // Kimlik doğrulama rotaları (/api/login, /api/register vb.)
app.use("/api", settings_1.default); // Site ayarları rotaları
app.use("/api/marquee", marquee_1.default);
app.use("/api/maincards", mainCardRoutes_1.default);
app.use("/api/partnerbrands", partnerBrand_1.default);
app.use("/api/sponsors", sponsorRoutes_1.default);
app.use("/api/promotion-cards", promotionCardRoutes_1.default); // bonuscard link yönetimi rotaları
app.use("/api/videos", videoCardRoutes_1.default); // youtube / Video yönetim
app.use("/api/footer-links", footerLinks_1.default); // Footer link yönetimi rotaları
app.use("/api/users", userRoutes_1.default); // Kullanıcı yönetimi rotaları
app.use("/api/notifications", notificationRoutes_1.default); // Bildirim yönetimi rotaları
app.use("/api/upload", upload_1.default); // Resim/dosya yükleme rotaları
app.use("/api/test", testRoute_1.default); // Test rotası (geliştirme için, kaldırılabilir)
// Robots.txt gibi özel rotalar (genellikle en altta veya statik dosya sunumundan önce)
app.use("/", robots_1.default); // robots.txt endpoint'i kök dizinde çalışmalı
// Portu .env dosyasından al (yoksa 5002 varsayılan olur)
const PORT = process.env.PORT || 5002;
// Sunucuyu başlat
const server = app
    .listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("✅ Tüm API rotaları aktif!");
    console.log("✅ Statik dosyalar aktif!");
})
    .on("error", (err) => {
    // Sunucu başlatılırken oluşabilecek hataları yakala
    if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} zaten kullanımda. Başka bir uygulama bu portu kullanıyor olabilir.`);
    }
    else {
        console.error("❌ Sunucu başlatılırken bilinmeyen bir hata oluştu:", err.message);
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
