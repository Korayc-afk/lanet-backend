// src/middleware/authMiddleware.ts (DÜZENLENMİŞ HALİ)
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ✅ dotenv kaldırıldı — artık server.ts içinde global olarak yükleniyor

// JWT secret key'inizi buraya veya çevre değişkenlerine ekleyin
const JWT_SECRET = process.env.JWT_SECRET || "supergizli_anahtar123";
// Lütfen bunu gerçek bir secret key ile değiştirin!

console.log("🔐 authenticateToken middleware çalıştı");

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"] || "";
  console.log("🔥 Gelen authHeader:", authHeader); // ← Burası lazım

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  if (!token) {
    console.warn("❌ Token eksik veya hatalı formatta:", authHeader);
    return res
      .status(401)
      .json({ message: "Yetkilendirme tokenı eksik veya hatalı formatta." });
  }

  console.log("JWT_SECRET:", JWT_SECRET);
  console.log("Gelen token:", token);
  console.log("🛡️ [authMiddleware] JWT_SECRET:", process.env.JWT_SECRET);

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.error("JWT doğrulama hatası:", err.name, err.message);
      return res
        .status(403)
        .json({ message: "Geçersiz veya süresi dolmuş token." });
    }

    if (
      typeof userPayload !== "object" ||
      userPayload === null ||
      !("userId" in userPayload)
    ) {
      console.error("JWT payload formatı beklenmiyor:", userPayload);
      return res.status(403).json({ message: "Geçersiz token formatı." });
    }

    req.user = userPayload as Express.Request["user"];
    next();
  });
};

// Rol bazlı yetkilendirme (isteğe bağlı ama önerilir, AuthContext.tsx'den geldi)
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bu işleme yetkiniz yok." });
    }
    next();
  };
};
