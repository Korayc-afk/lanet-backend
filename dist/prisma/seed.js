"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.promotionCard.createMany({
        data: [
            {
                type: "BONUS",
                title: "Bir fidan, bir nefes...",
                description: "Temmuz ayında her yatırımda Tema Vakfı’na 1 fidan bağışı!",
                image: "https://example.com/fidan.jpg",
                modalTitle: "Bir fidan, bir nefes...",
                modalDescription: "Her yatırım, geleceğe umut bırakır.",
                modalImage: "https://example.com/fidan-modal.jpg",
                date: new Date("2025-07-12"),
                promotionLink: "https://t2m.io/meritek",
                order: 1,
            },
            {
                type: "MINI",
                title: "Hoşgeldin Bonusu %200",
                description: "İlk yatırımınıza özel süper fırsat!",
                image: "https://example.com/hosgeldin.png",
                modalTitle: "Hoşgeldin Bonusu",
                modalDescription: "İlk yatırımda %200 bonus kazanın!",
                modalImage: "https://example.com/hosgeldin-modal.png",
                promotionLink: "https://t2m.io/bonus1",
                order: 2,
            },
        ],
    });
}
main()
    .then(() => {
    console.log("✅ Seed tamamlandı");
    prisma.$disconnect();
})
    .catch((err) => {
    console.error("❌ Seed hatası:", err);
    prisma.$disconnect();
    process.exit(1);
});
