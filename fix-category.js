const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Buscamos la categoría idónea
  const cat = await prisma.blogCategory.findFirst({
    where: { name: { contains: 'Tratamiento de Agua' } }
  });

  if (!cat) {
    console.log('Error: No se encontró la categoría "Tratamiento de Agua"');
    return;
  }

  // 2. Buscamos el artículo por título
  const post = await prisma.blogPost.findFirst({
    where: { title: { contains: 'Tratamiento de Aguas' } }
  });

  if (!post) {
    console.log('Error: No se encontró el artículo "Innovación en el Tratamiento de Aguas"');
    return;
  }

  // 3. Actualizamos
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { categoryId: cat.id }
  });

  console.log(`Éxito: Artículo "${post.title}" asignado a "${cat.name}"`);
}

main()
  .catch(err => console.error('Error fatal:', err))
  .finally(() => prisma.$disconnect());
