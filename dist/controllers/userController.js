"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCount = exports.deleteUser = exports.updateUserPassword = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// 🎉 userSelectFields - SADECE SCHEMA.PRISMA'DAN GELDİĞİ GİBİ OLAN ALANLAR 🎉
// Bu alanlar schema.prisma'nızda yoksa, LÜTFEN ONLARI BURADAN KALDIRIN
const userSelectFields = {
    id: true,
    username: true,
    email: true,
    isEmailVerified: true,
    lastLoginAt: true,
    role: true,
    isBanned: true,
    banReason: true,
    bannedUntil: true,
    customBonus: true,
    joinedReferralOwner: true,
    referralCode: true,
    firstName: true,
    lastName: true,
    phone: true,
    telegram: true,
    level: true, // level'ın schema'da Int ve zorunlu olduğunu varsayarak
    createdAt: true,
    updatedAt: true,
    // NOT: avatarUrl, bio, ekoCoin, isPhoneVerified, facebookUrl, xUrl, linkedinUrl, instagramUrl, country, cityState, postalCode, taxId
    // BU ALANLAR SİZİN VERDİĞİNİZ SCHEMA.PRISMA'DA YOK. BU YÜZDEN BURADAN KALDIRILMIŞTIR.
    // Eğer bunları kullanmak istiyorsanız, LÜTFEN ÖNCE SCHEMA.PRISMA'YA EKLEYİN.
};
// 🔹 Tüm kullanıcıları listele
const getAllUsers = async (req, res) => {
    const { search, role, isBanned, isEmailVerified, page, pageSize } = req.query;
    const pageNum = parseInt(page) || 1;
    const sizeNum = parseInt(pageSize) || 10;
    const skip = (pageNum - 1) * sizeNum;
    const take = sizeNum;
    const where = {};
    if (search) {
        where.OR = [
            { username: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
        ];
    }
    if (role)
        where.role = role.toUpperCase();
    if (isBanned !== undefined)
        where.isBanned = isBanned === "true";
    if (isEmailVerified !== undefined)
        where.isEmailVerified = isEmailVerified === "true";
    try {
        const totalUsers = await prisma_1.default.user.count({ where });
        const users = await prisma_1.default.user.findMany({
            where,
            select: userSelectFields,
            orderBy: { createdAt: "desc" },
            skip,
            take,
        });
        res.status(200).json({
            users,
            totalUsers,
            page: pageNum,
            pageSize: sizeNum,
            totalPages: Math.ceil(totalUsers / sizeNum),
        });
    }
    catch (error) {
        console.error("🧨 Kullanıcılar getirilirken hata:", error);
        res.status(500).json({ message: "Kullanıcılar yüklenirken bir hata oluştu." });
    }
};
exports.getAllUsers = getAllUsers;
// 🔹 Belirli ID ile kullanıcı getir
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: parseInt(id) },
            select: userSelectFields,
        });
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error(`🧨 Kullanıcı (ID: ${id}) getirilirken hata:`, error);
        res.status(500).json({ message: "Kullanıcı bilgileri alınamadı." });
    }
};
exports.getUserById = getUserById;
// 🔹 Kullanıcı bilgilerini güncelle (şifre hariç)
const updateUser = async (req, res) => {
    const { id } = req.params;
    // 🎉 SADECE SCHEMA.PRISMA'DAN GELEN ALANLARI KULLANIYORUZ 🎉
    const { email, firstName, lastName, phone, telegram, // isEmailVerified ve isPhoneVerified de schema'da var
    isEmailVerified, isBanned, banReason, bannedUntil, customBonus, level // Bu alanları da güncelleyebiliyoruz
    // NOT: avatarUrl, bio, ekoCoin, facebookUrl, xUrl, linkedinUrl, instagramUrl, country, cityState, postalCode, taxId
    // BU ALANLAR SİZİN VERDİĞİNİZ SCHEMA.PRISMA'DA YOK. BU YÜZDEN BURADA GÜNCELLENEMEZ.
     } = req.body;
    try {
        if (email) {
            const existingEmailUser = await prisma_1.default.user.findFirst({
                where: {
                    email,
                    NOT: { id: parseInt(id) },
                },
            });
            if (existingEmailUser) {
                return res.status(400).json({ message: "Bu email zaten kullanımda." });
            }
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { id: parseInt(id) },
            data: {
                email: email ?? undefined,
                firstName: firstName ?? undefined,
                lastName: lastName ?? undefined,
                phone: phone ?? undefined,
                telegram: telegram ?? undefined,
                isEmailVerified: isEmailVerified ?? undefined,
                isBanned: isBanned ?? undefined,
                banReason: banReason ?? undefined,
                bannedUntil: bannedUntil ?? undefined,
                customBonus: customBonus ?? undefined,
                level: level ?? undefined,
            },
            select: userSelectFields,
        });
        res.status(200).json({
            message: "Kullanıcı başarıyla güncellendi.",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("🧨 Kullanıcı güncellenemedi:", error);
        res.status(500).json({ message: "Kullanıcı güncellenemedi." });
    }
};
exports.updateUser = updateUser;
// 🔹 Kullanıcı şifresini güncelle
const updateUserPassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: parseInt(id) },
            select: { password: true }, // 🎉 Şifreyi seçmeyi unutma!
        });
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
        // user.password null olabilir, kontrol etmeliyiz
        if (!user.password) {
            return res.status(500).json({ message: "Kullanıcının şifresi veritabanında yok." });
        }
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mevcut şifre yanlış." });
        }
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.default.user.update({
            where: { id: parseInt(id) },
            data: { password: hashedNewPassword },
        });
        res.status(200).json({ message: "Şifre başarıyla güncellendi." });
    }
    catch (error) {
        console.error("🧨 Şifre güncellenirken hata:", error);
        res.status(500).json({ message: "Şifre güncellenemedi." });
    }
};
exports.updateUserPassword = updateUserPassword;
// 🔹 Kullanıcıyı sil
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.default.user.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    }
    catch (error) {
        console.error(`🧨 Kullanıcı (ID: ${id}) silinirken hata:`, error);
        res.status(500).json({ message: "Kullanıcı silinemedi." });
    }
};
exports.deleteUser = deleteUser;
// 🔹 Kullanıcı sayısı
const getUserCount = async (_req, res) => {
    try {
        const count = await prisma_1.default.user.count();
        res.json({ success: true, count });
    }
    catch (error) {
        console.error("🧨 Kullanıcı sayısı alınırken hata:", error);
        res.status(500).json({ message: "Kullanıcı sayısı alınamadı." });
    }
};
exports.getUserCount = getUserCount;
