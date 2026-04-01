const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.blogCategory.findMany();
  console.log('Categories:', categories);
  
  const target = categories.find(c => c.name === 'Innovación y Tecnología');
  if (target) {
    console.log(`Eliminando categoría: ${target.name} (id: ${target.id})`);
    
    // First, update posts that have this category to null
    await prisma.blogPost.updateMany({
      where: { categoryId: target.id },
      data: { categoryId: null }
    });
    
    // Then delete the category
    await prisma.blogCategory.delete({
      where: { id: target.id }
    });
    console.log('Categoría eliminada con éxito.');
  } else {
    console.log('No se encontró la categoría "Innovación y Tecnología".');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
