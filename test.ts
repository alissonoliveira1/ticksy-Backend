import prisma from "./src/models/prismaClient";

async function main() {
  const usuarios = await prisma.Usuarios.findMany();
  console.log(usuarios);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());