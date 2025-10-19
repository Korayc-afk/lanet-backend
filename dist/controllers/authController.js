"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function generateReferralCode(username) {
    return `${username}-${Math.floor(1000 + Math.random() * 9000)}`;
}
const register = async (req, res) => {
    const { username, email, password, firstName, lastName, referredByCode } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Tüm alanlar zorunludur." });
    }
    try {
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Bu email adresi zaten kayıtlı." });
        }
        let referredBy = null;
        if (referredByCode) {
            const refOwner = await prisma_1.default.user.findUnique({
                where: { referralCode: referredByCode },
                select: { username: true },
            });
            if (refOwner)
                referredBy = refOwner.username;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const generatedReferralCode = generateReferralCode(username);
        const user = await prisma_1.default.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName,
                referralCode: generatedReferralCode,
                joinedReferralOwner: referredBy,
                role: "USER",
            },
        });
        res.status(201).json({
            success: true,
            message: "Kayıt başarılı!",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                referralCode: user.referralCode,
                joinedReferralOwner: user.joinedReferralOwner,
            },
        });
    }
    catch (error) {
        console.error("Kayıt olurken hata:", error);
        res.status(500).json({ message: "Kayıt başarısız." });
    }
};
exports.register = register;
