"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
console.log("✅ userRoutes yüklendi");
const router = (0, express_1.Router)();
router.get("/count", userController_1.getUserCount); // 🔹 Kullanıcı sayısı
router.get("/", userController_1.getAllUsers); // 🔹 Tüm kullanıcılar
router.get("/:id", userController_1.getUserById); // 🔹 ID ile kullanıcı
router.put("/:id", userController_1.updateUser); // 🔹 Bilgi güncelle
router.put("/:id/password", userController_1.updateUserPassword); // 🔹 Şifre güncelle
router.delete("/:id", userController_1.deleteUser); // 🔹 Sil
exports.default = router;
