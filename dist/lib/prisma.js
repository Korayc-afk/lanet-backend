"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Backend/lib/prisma.ts
const client_1 = require("@prisma/client");
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;
console.log(`--- PRISMA BAĞLANTI URL'si: ${process.env.DATABASE_URL} ---`);
exports.default = prisma;
