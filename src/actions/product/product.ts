"use server";

import { Category, ProductData } from "@/interfaces";
import prisma from "@/lib/db";

// ------------------ CATEGORY ------------------
export const createCategory = async (name: string, img: string) => {
  try {
    const category = await prisma.category.create({ data: { name, img } });
    return { ok: true, category, message: "CategorÃ­a creada" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error al crear categorÃ­a" };
  }
};

export const getCategories = async () => prisma.category.findMany();
export const getCategoryById = async (id: string) =>
  prisma.category.findUnique({ where: { id } });
export const updateCategory = async (id: string, data: Category) =>
  prisma.category.update({ where: { id }, data });
export const deleteCategory = async (id: string) =>
  prisma.category.delete({ where: { id } });

// ------------------ PRODUCT ------------------
// FunciÃ³n para agregar o actualizar un producto
export const getTotalProductsCount = async () => {
  try {
    const totalProducts = await prisma.product.count();
    return { ok: true, totalProducts }; // Retorna el nÃºmero de productos
  } catch (error) {
    console.error("Error al obtener el nÃºmero de productos:", error);
    return { ok: false, message: "Error al obtener el nÃºmero de productos" };
  }
};

export const addOrUpdateProduct = async (product: ProductData) => {
  try {
    // Verificar si el producto ya existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        size: true,
        color: true,
        features: true,
        specifications: true,
        categories: true,
        images: true, // Traer las imÃ¡genes asociadas al producto
      },
    });

    // Buscar las categorÃ­as por nombre para obtener sus IDs
    const categoryIds = await Promise.all(
      product.category.split(", ").map(async (categoryName) => {
        const category = await prisma.category.findFirst({
          where: { name: categoryName },
        });
        if (category) return category.id;
        throw new Error(`CategorÃ­a ${categoryName} no encontrada`);
      })
    );

    // Si el producto ya existe, lo actualizamos
    if (existingProduct) {
      // Actualizamos el producto
      const updatedProduct = await prisma.product.update({
        where: { id: product.id },
        data: {
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          featured: product.featured,
          descuento: product.descuento || 0,
          envioPrecio: product.envioPrecio || 0,
          categories: {
            connect: categoryIds.map((id) => ({ id })),
          },
          size: {
            connect: product.size.map((s) => ({ id: s.id })),
            create: product.size
              .filter((s) => !s.id)
              .map((s) => ({
                name: s.name,
                image: s.image,
                price: s.price,
              })),
          },
          color: {
            connect: product.color.map((c) => ({ id: c.id })),
            create: product.color
              .filter((c) => !c.id)
              .map((c) => ({ name: c.name, code: c.code })),
          },
          features: {
            connect: product.features.map((f) => ({ id: f.id })),
            create: product.features
              .filter((f) => !f.id)
              .map((f) => ({ name: f.name })),
          },
          specifications: {
            connect: product.specifications.map((spec) => ({ id: spec.id })),
            create: product.specifications
              .filter((spec) => !spec.id)
              .map((spec) => ({
                title: spec.name,
                description: spec.descripction,
              })),
          },
          images: {
            connect: product.images.map((img) => ({ id: img.id })), // Conectamos las imÃ¡genes existentes por su ID
          },
        },
      });

      return {
        ok: true,
        product: updatedProduct,
        message: "Producto actualizado con Ã©xito",
      };
    } else {
      // Si el producto no existe, lo creamos
      const newProduct = await prisma.product.create({
        data: {
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          featured: product.featured,
          descuento: product.descuento || 0,
          envioPrecio: product.envioPrecio || 0,
          categories: {
            connect: categoryIds.map((id) => ({ id })),
          },
          size: {
            create: product.size.map((s) => ({
              name: s.name,
              image: s.image,
              price: s.price,
            })),
          },
          color: {
            create: product.color.map((c) => ({
              name: c.name,
              code: c.code,
            })),
          },
          features: {
            create: product.features.map((f) => ({
              name: f.name,
            })),
          },
          specifications: {
            create: product.specifications.map((spec) => ({
              title: spec.name,
              description: spec.descripction,
            })),
          },
          images: {
            connect: product.images.map((img) => ({ id: img.id })), // Conectamos las imÃ¡genes existentes por su ID
          },
        },
      });

      return {
        ok: true,
        product: newProduct,
        message: "Producto creado con Ã©xito",
      };
    }
  } catch (error) {
    console.error("Error al procesar el producto:", error);
    return { ok: false, message: "Error al procesar el producto" };
  }
};

export const createProduct = async (
  name: string,
  price: number,
  image: string,
  description: string,
  featured: boolean,
  categoryIds: string[],
  size?: { name: string; image: string; price: number },
  color?: { name: string; code: string },
  feature?: { title: string; description: string },
  specification?: { title: string; description: string }
) => {
  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        image,
        description,
        size: size
          ? {
              create: { name: size.name, image: size.image, price: size.price },
            }
          : undefined,
        color: color
          ? { create: { name: color.name, code: color.name } }
          : undefined,
        featured,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
        features: feature ? { create: { name: feature.title } } : undefined,
        specifications: specification
          ? {
              create: {
                title: specification.title,
                description: specification.description,
              },
            }
          : undefined,
      },
    });
    return { ok: true, product, message: "Producto creado" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error al crear producto" };
  }
};

// Devuelve los productos como tipo Product (resumen)
export const getProducts = async () => {
  const products = await prisma.product.findMany({
    include: { categories: true, size: true },
  });
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    size: p.size[0],
    featured: p.featured,
    category: p.categories.map((c) => c.name).join(", "),
    description: p.description,
    descuento: p.descuento || 0,
    envioPrecio: p.envioPrecio || 0,
  }));
};

// Devuelve productos destacados (featured)
export const getFeaturedProducts = async () => {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: { categories: true, size: true },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    featured: p.featured,
    size: p.size[0],
    category: p.categories.map((c) => c.name).join(", "),
    description: p.description,
    descuento: p.descuento || 0,
    envioPrecio: p.envioPrecio || 0,
  }));
};

// Devuelve producto detallado tipo ProductData
export const getProductById = async (
  id: string
): Promise<ProductData | null> => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      categories: true,
      features: true,
      specifications: true,
      size: true,
      color: true,
      images: true,
    },
  });
  

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    size: product.size.map((s) => ({
      id: s.id,
      name: s.name,
      image: s.image,
      price: s.price,
    })),
    color: product.color.map((col) => ({
      id: col.id,
      name: col.name,
      code: col.code,
    })),
    featured: product.featured,
    category: product.categories.map((c) => c.name).join(", "),
    description: product.description,
    features: product.features.map((feature) => ({
      id: feature.id,
      name: feature.name,
    })),
    specifications: product.specifications.map((spec) => ({
      id: spec.id,
      name: spec.title,
      descripction: spec.description,
    })),
    images: product.images.map((img) => ({
      id: img.id,
      src: img.src, // Ahora devolvemos el objeto correctamente
    })),
    envioPrecio: product.envioPrecio || 0,
    descuento: product.descuento || 0,
  };
};

export const getProductByCatagory = async (
  category: string
) => {
  const products = await prisma.product.findMany({
    where: { categories: { some: { name: category } } }
  });
  return products;
}

export const getProductsData = async (): Promise<ProductData[]> => {
  const products = await prisma.product.findMany({
    include: {
      categories: true,
      features: true,
      specifications: true,
      size: true,
      color: true,
      images: true,
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    descuento: product.descuento || 0,
    envioPrecio: product.envioPrecio || 0,
    size:
      product.size?.map((s) => ({
        id: s.id,
        name: s.name,
        image: s.image,
        price: s.price,
      })) || [],
    color:
      product.color?.map((col) => ({
        id: col.id,
        name: col.name,
        code: col.code,
      })) || [],
    featured: product.featured,
    category: product.categories.map((c) => c.name).join(", "),
    description: product.description,
    features: product.features.map((feature) => ({
      id: feature.id,
      name: feature.name,
    })),
    specifications: product.specifications.map((spec) => ({
      id: spec.id,
      name: spec.title, // AsegÃºrate de que sea 'title' o 'name' segÃºn tu base de datos
      descripction: spec.description,
    })),
    images: product.images.map((img) => ({
      id: img.id,
      src: img.src, // Ahora devolvemos el objeto correctamente
    })),
  }));
};

export const updateProduct = async (id: string, data: any) =>
  prisma.product.update({ where: { id }, data });
export const deleteProduct = async (id: string) =>
  prisma.product.delete({ where: { id } });

// ------------------ PRODUCT SPECIFICATION ------------------
export const createProductSpecification = async (
  name: string,
  description: string
) => {
  try {
    const specification = await prisma.productSpecification.create({
      data: {
        title: name,
        description,
      },
    });
    return { ok: true, specification, message: "Specification creada" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error al crear specification" };
  }
};

export const getProductSpecifications = async () =>
  prisma.productSpecification.findMany();
export const getProductSpecificationById = async (id: string) =>
  prisma.productSpecification.findUnique({ where: { id } });
export const updateProductSpecification = async (id: string, data: any) =>
  prisma.productSpecification.update({ where: { id }, data });
export const deleteProductSpecification = async (id: string) =>
  prisma.productSpecification.delete({ where: { id } });

// Crear una imagen
export const createImage = async (src: string) => {
  try {
    const image = await prisma.images.create({
      data: { src },
    });
    return { ok: true, image, message: "Imagen creada" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error al crear imagen" };
  }
};

// Obtener todas las imÃ¡genes
export const getImages = async () => prisma.images.findMany();

// Obtener una imagen por ID
export const getImageById = async (id: string) =>
  prisma.images.findUnique({ where: { id } });

// Actualizar una imagen
export const updateImage = async (id: string, data: { src?: string }) =>
  prisma.images.update({ where: { id }, data });

// Eliminar una imagen
export const deleteImage = async (id: string) =>
  prisma.images.delete({ where: { id } });
