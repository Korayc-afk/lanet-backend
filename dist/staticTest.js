"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = 5001; // Farklı bir port kullanalım çakışma olmasın
// uploads klasörünüzün doğru yolunu loglayın
// staticTest.ts, Backend klasörünün içindeyse, uploads da yanındadır.
const uploadsPath = path_1.default.resolve(__dirname, "./uploads"); // Buradaki `./Backend/uploads` ifadesi `./uploads` olarak değiştirildi.
console.log("Statik test klasör yolu:", uploadsPath);
// Sadece static dosyaları sunan middleware
app.use("/test-uploads", express_1.default.static(uploadsPath));
app.listen(PORT, () => {
    console.log(`🚀 Statik test sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});
