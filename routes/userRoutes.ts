import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserCount,
  updateUserPassword,
} from "../controllers/userController";

console.log("✅ userRoutes yüklendi");

const router = Router();

router.get("/count", getUserCount);             // 🔹 Kullanıcı sayısı
router.get("/", getAllUsers);                   // 🔹 Tüm kullanıcılar
router.get("/:id", getUserById);                // 🔹 ID ile kullanıcı
router.put("/:id", updateUser);                 // 🔹 Bilgi güncelle
router.put("/:id/password", updateUserPassword);// 🔹 Şifre güncelle
router.delete("/:id", deleteUser);              // 🔹 Sil

export default router;
