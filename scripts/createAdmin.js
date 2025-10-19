const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10); // şifreyi hashle

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
    },
  });

  console.log("✅ Admin kullanıcı oluşturuldu:", admin);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
