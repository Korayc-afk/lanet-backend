import express from 'express';
import path from 'path';

const app = express();
const PORT = 5001; // Farklı bir port kullanalım çakışma olmasın

// uploads klasörünüzün doğru yolunu loglayın
// staticTest.ts, Backend klasörünün içindeyse, uploads da yanındadır.
const uploadsPath = path.resolve(__dirname, "./uploads"); // Buradaki `./Backend/uploads` ifadesi `./uploads` olarak değiştirildi.
console.log("Statik test klasör yolu:", uploadsPath);

// Sadece static dosyaları sunan middleware
app.use("/test-uploads", express.static(uploadsPath));

app.listen(PORT, () => {
  console.log(`🚀 Statik test sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});