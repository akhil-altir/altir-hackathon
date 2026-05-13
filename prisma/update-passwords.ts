import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, employeeId: true },
  });

  let updated = 0;
  for (const user of users) {
    if (!user.employeeId) {
      console.log(`SKIP ${user.email} — no employeeId`);
      continue;
    }
    const local = user.email.split("@")[0];
    const newPassword = `${local}_${user.employeeId}`;
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newPassword },
    });
    console.log(`OK   ${user.email} → ${newPassword}`);
    updated++;
  }

  console.log(`\nUpdated ${updated}/${users.length} users.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
