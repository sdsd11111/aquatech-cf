const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.blogCategory.findMany();
  console.log('Categorías existentes:', categories);
  
  if (categories.length === 0) {
    console.log('No hay categorías. Creando algunas por defecto...');
    await prisma.blogCategory.createMany({
      data: [
        { name: 'Mantenimiento', slug: 'mantenimiento' },
        { name: 'Innovación', slug: 'innovacion' },
        { name: 'Tratamiento de Agua', slug: 'tratamiento' },
        { name: 'Equipamiento', slug: 'equipamiento' }
      ]
    });
    console.log('Categorías creadas.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
