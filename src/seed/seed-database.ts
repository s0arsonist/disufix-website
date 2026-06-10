import prisma from "../lib/db";
import bcryptjs from "bcryptjs";

async function main() {
  console.log("ð§¹ Limpiando base de datos...");

  await prisma.orderProduct.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productFeature.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productSize.deleteMany();

  console.log("â Base de datos limpia.");

  // Crear categorÃ­as\
  const paramadera = await prisma.category.create({
    data: { name: "Para madera", img: "/imgs/madera.jpg" },
  });
  const paratechos = await prisma.category.create({
    data: { name: "Para techos", img: "/imgs/techo.jpeg" },
  });
  const paraterrazas = await prisma.category.create({
    data: { name: "Para terrazas enchapadas", img: "/imgs/terraza.jpg" },
  });
  const parafachadas = await prisma.category.create({
    data: { name: "Para Fachadas", img: "/imgs/fachadas.jpeg" },
  });
  // const herramientas = await prisma.category.create({ data: { name: 'Para Herramientas', img: '/imgs/herramientas.webp' } });

  // Crear usuario admin
  await prisma.user.create({
    data: {
      nombreCompleto: "Admin Seed",
      email: "admin@seed.com",
      password: bcryptjs.hashSync("admin123"),
      role: "Admin",
      active: true,
      createDate: new Date().toISOString(),
    },
  });

  //prouct1
  //prodcto2.
  // Crear features
  const featureP1 = await prisma.productFeature.create({
    data: { name: "FÃ³rmula 2 en 1" },
  });
  const featureP2 = await prisma.productFeature.create({
    data: { name: "Mata comejÃ©n e inmunizante" },
  });
  const featureP3 = await prisma.productFeature.create({
    data: { name: "FÃ¡cil de aplicar" },
  });

  // Crear especificaciones
  const spec1P = await prisma.productSpecification.create({
    data: {
      title: "TamaÃ±o",
      description: "Disponible en 125 ML, 250 ML, y 1 GalÃ³n",
    },
  });
  const spec2P = await prisma.productSpecification.create({
    data: {
      title: "Usos",
      description:
        "ReparaciÃ³n de madera, mata comejÃ©n y previene futuras infestaciones.",
    },
  });

  // Crear tamaÃ±os
  const litroAspersor = await prisma.productSize.create({
    data: {
      name: "Litro Aspersor",
      image: "/imgs/products/madera/inmunizantelitroaspersor.jpg",
      price: 170000,
    },
  });
  const size125ml = await prisma.productSize.create({
    data: {
      name: "125 ML",
      image: "/imgs/products/madera/inmunizante125ml.jpg",
      price: 25000,
    },
  });
  const size250ml = await prisma.productSize.create({
    data: {
      name: "250 ML",
      image: "/imgs/products/madera/inmunizante250ml.jpg",
      price: 35000,
    },
  });
  const size1galon = await prisma.productSize.create({
    data: {
      name: "1 GalÃ³n",
      image: "/imgs/products/madera/inmunizantegalon.jpg",
      price: 150000,
    },
  });
  const litro = await prisma.productSize.create({
    data: {
      name: "1 Litro",
      image: "/imgs/products/madera/inmunizantelitro.jpg",
      price: 160000,
    },
  });

  //crear imagenes
  const imagen = await prisma.images.create({
    data: { src: "/imgs/products/madera/inmunizantelitro.jpg" },
  });

  // Crear producto "Madecril - Mata ComejÃ©n e Inmunizante" con features, specifications, colores y tamaÃ±os conectados
  await prisma.product.create({
    data: {
      name: "Madecril - Mata ComejÃ©n e Inmunizante",
      price: 58000,
      image: "/imgs/products/madera/inmunizantelitroaspersor.jpg",
      description:
        "FÃ³rmula 2 en 1 para detectar y eliminar comejÃ©n e inmunizar la madera. Se usa para Ã¡reas carcomidas que no se ven a simple vista.",
      featured: true,
      size: {
        connect: [
          { id: litroAspersor.id },
          { id: size250ml.id },
          { id: size1galon.id },
          { id: litro.id },
          { id: size125ml.id },
        ],
      },
      categories: {
        connect: [{ id: paramadera.id }],
      },
      features: {
        connect: [
          { id: featureP1.id },
          { id: featureP2.id },
          { id: featureP3.id },
        ],
      },
      specifications: {
        connect: [{ id: spec1P.id }, { id: spec2P.id }],
      },
      images: {
        connect: [{ id: imagen.id }],
      },
    },
  });

  //prodyct2
  // Crear features
  const feature1 = await prisma.productFeature.create({
    data: { name: "FÃ¡cil de lijar" },
  });
  const feature2 = await prisma.productFeature.create({
    data: { name: "Resistente al agua" },
  });
  const feature3 = await prisma.productFeature.create({
    data: { name: "Pintable" },
  });
  const feature4 = await prisma.productFeature.create({
    data: { name: "Uso en interiores y exteriores" },
  });

  // Crear especificaciones
  const spec1 = await prisma.productSpecification.create({
    data: { title: "TamaÃ±o", description: "Disponible en 820 gr y 220 gr" },
  });
  const spec2 = await prisma.productSpecification.create({
    data: {
      title: "Usos",
      description: "ReparaciÃ³n de madera, fÃ¡cil aplicaciÃ³n y acabado",
    },
  });

  /// Crear colores
  const negro = await prisma.productColor.create({
    data: { name: "Negro", code: "#000000" },
  });
  const blanco = await prisma.productColor.create({
    data: { name: "Blanco", code: "#FFFFFF" },
  });
  const miel = await prisma.productColor.create({
    data: { name: "Miel", code: "#D4A15C" },
  });
  const castaÃ±o = await prisma.productColor.create({
    data: { name: "CastaÃ±o", code: "#8B5E3C" },
  });
  const incienso = await prisma.productColor.create({
    data: { name: "Incienso", code: "#6A4E2F" },
  });
  const caoba = await prisma.productColor.create({
    data: { name: "Caoba", code: "#9A4E3E" },
  });
  const granadillo = await prisma.productColor.create({
    data: { name: "Granadillo", code: "#7B3F00" },
  });
  const zapan = await prisma.productColor.create({
    data: { name: "ZapÃ¡n", code: "#734F32" },
  });
  const guaimaro = await prisma.productColor.create({
    data: { name: "Guaimaro", code: "#B58A67" },
  });
  const wengue = await prisma.productColor.create({
    data: { name: "Wengue", code: "#2F2B2A" },
  });
  const grisHumo = await prisma.productColor.create({
    data: { name: "Gris humo", code: "#B4B4B4" },
  });
  const amarillo = await prisma.productColor.create({
    data: { name: "Amarillo", code: "#F8D800" },
  });

  // Crear tamaÃ±os
  const masillasize1 = await prisma.productSize.create({
    data: {
      name: "820 gr",
      image: "/imgs/products/madera/madecril-masilla-madera-820.jpg",
      price: 32500,
    },
  });
  const masillasize2 = await prisma.productSize.create({
    data: {
      name: "220 gr",
      image: "/imgs/products/madera/madecril-masilla-madera-220-G.jpg",
      price: 18500,
    },
  });

  // Crear productos con features, specifications y colores conectados
  await prisma.product.create({
    data: {
      name: "Masilla para Madera (Madecril)",
      price: 58000,
      image: "/imgs/products/madera/madecril-masilla-madera-220-G.jpg",
      description:
        "Masilla para madera, ideal para la reparaciÃ³n de imperfecciones en la madera.",
      featured: true,
      color: {
        connect: [
          { id: negro.id },
          { id: blanco.id },
          { id: miel.id },
          { id: castaÃ±o.id },
          { id: incienso.id },
          { id: caoba.id },
          { id: granadillo.id },
          { id: zapan.id },
          { id: guaimaro.id },
          { id: wengue.id },
          { id: grisHumo.id },
          { id: amarillo.id },
        ],
      },
      size: {
        connect: [{ id: masillasize1.id }, { id: masillasize2.id }],
      },
      categories: {
        connect: [{ id: paramadera.id }],
      },
      features: {
        connect: [
          { id: feature1.id },
          { id: feature2.id },
          { id: feature3.id },
          { id: feature4.id },
        ],
      },
      specifications: {
        connect: [{ id: spec1.id }, { id: spec2.id }],
      },
    },
  });

  //producto3
  // Crear featuresa
  const feature31 = await prisma.productFeature.create({
    data: { name: "Cera pura de Abeja" },
  });
  const feature32 = await prisma.productFeature.create({
    data: { name: "FÃ¡cil aplicaciÃ³n" },
  });
  const feature33 = await prisma.productFeature.create({
    data: { name: "Alto rendimiento" },
  });
  const feature34 = await prisma.productFeature.create({
    data: { name: "Nutre en profundidad" },
  });
  const feature35 = await prisma.productFeature.create({
    data: { name: "Hidratante natural" },
  });
  const feature36 = await prisma.productFeature.create({
    data: { name: "Protege e impermeabiliza" },
  });
  const feature37 = await prisma.productFeature.create({
    data: { name: "Rechaza el polvo ambiental" },
  });

  // Crear especificaciones
  const spec31 = await prisma.productSpecification.create({
    data: {
      title: "TamaÃ±o",
      description: "Disponible en 85 ML, 200 ML, y 340 ML / Litro",
    },
  });
  const spec32 = await prisma.productSpecification.create({
    data: {
      title: "Usos",
      description:
        "Renueva muebles de madera y cuero, realzando el brillo y la hidrataciÃ³n",
    },
  });

  // Crear tamaÃ±os
  const size85ml = await prisma.productSize.create({
    data: {
      name: "85 ML",
      image: "/imgs/products/madera/ceraml.jpg",
      price: 25000,
    },
  });
  const size200ml = await prisma.productSize.create({
    data: {
      name: "200 ML",
      image: "/imgs/products/madera/ceraml.jpg",
      price: 35000,
    },
  });
  const size340ml = await prisma.productSize.create({
    data: {
      name: "340 ML / Litro",
      image: "/imgs/products/madera/ceraml.jpg",
      price: 72000,
    },
  });
  const size1l = await prisma.productSize.create({
    data: {
      name: "1 L / Litro",
      image: "/imgs/products/madera/ceral.jpg",
      price: 120000,
    },
  });

  // Crear producto "Madecril - Cera de Abejas" con features, specifications y tamaÃ±os conectados
  await prisma.product.create({
    data: {
      name: "Madecril - Cera de Abejas",
      price: 35000, // El precio puede ajustarse
      image: "/imgs/products/madecril-cera-abejas.png",
      description:
        "Renueva muebles de madera y cuero, realzando el brillo e hidratÃ¡ndolos.",
      featured: false,
      color: {
        connect: [], // No se mencionan colores en la imagen, por lo dejamos vacÃ­o
      },
      size: {
        connect: [
          { id: size85ml.id },
          { id: size200ml.id },
          { id: size340ml.id },
          { id: size1l.id },
        ],
      },
      categories: {
        connect: [{ id: paramadera.id }],
      },
      features: {
        connect: [
          { id: feature31.id },
          { id: feature32.id },
          { id: feature33.id },
          { id: feature34.id },
          { id: feature35.id },
          { id: feature36.id },
          { id: feature37.id },
        ],
      },
      specifications: {
        connect: [{ id: spec31.id }, { id: spec32.id }],
      },
    },
  });

  //producto 4
  // Crear features
  const feature41 = await prisma.productFeature.create({
    data: { name: "Alto rendimiento" },
  });
  const feature42 = await prisma.productFeature.create({
    data: { name: "Altamente concentrado" },
  });
  const feature43 = await prisma.productFeature.create({
    data: { name: "FÃ³rmula innovadora" },
  });
  const feature44 = await prisma.productFeature.create({
    data: { name: "Previene y elimina comejÃ©n, polilla y gorgojo" },
  });
  const feature45 = await prisma.productFeature.create({
    data: { name: "AcciÃ³n fulminante y preventiva de plagas y hongos" },
  });

  // Crear especificaciones
  const spec41 = await prisma.productSpecification.create({
    data: {
      title: "TamaÃ±o",
      description: "Disponible en 40 ML, 250 ML, y 1 Lt",
    },
  });
  const spec42 = await prisma.productSpecification.create({
    data: { title: "Rendimiento", description: "AspersiÃ³n e InmersiÃ³n" },
  });

  // Crear tamaÃ±os
  const size40ml4 = await prisma.productSize.create({
    data: {
      name: "40 ML",
      image: "/imgs/products/madera/inmunizantecon.jpg",
      price: 20000,
    },
  });
  const size250ml4 = await prisma.productSize.create({
    data: {
      name: "250 ML",
      image: "/imgs/products/madera/inmunizantecon.jpg",
      price: 35000,
    },
  });
  const size1lt4 = await prisma.productSize.create({
    data: {
      name: "1 Litro",
      image: "/imgs/products/madera/inmunizantecon.jpg",
      price: 70000,
    },
  });

  // Crear producto "Madecril - Mata ComejÃ©n e Inmunizante Concentrado" con features, specifications, tamaÃ±os conectados
  await prisma.product.create({
    data: {
      name: "Madecril - Mata ComejÃ©n e Inmunizante Concentrado",
      price: 35000, // El precio puede ajustarse
      image: "/imgs/products/madera/inmunizantecon.jpg",
      description:
        "Previene y elimina comejÃ©n, polilla y gorgojo. FÃ³rmula innovadora, se gasifica, penetrando en nidos y tÃºneles de maderas infestadas.",
      featured: false,
      color: {
        connect: [], // No se mencionan colores en la imagen, por lo dejamos vacÃ­o
      },
      size: {
        connect: [
          { id: size40ml4.id },
          { id: size250ml4.id },
          { id: size1lt4.id },
        ],
      },
      categories: {
        connect: [{ id: paramadera.id }],
      },
      features: {
        connect: [
          { id: feature41.id },
          { id: feature42.id },
          { id: feature43.id },
          { id: feature44.id },
          { id: feature45.id },
        ],
      },
      specifications: {
        connect: [{ id: spec41.id }, { id: spec42.id }],
      },
    },
  });

  //product 5
  // Crear features
  const feature51 = await prisma.productFeature.create({
    data: {
      name: "Desarrollado con resinas de gran elasticidad, adherencia y resistencia",
    },
  });
  const feature52 = await prisma.productFeature.create({
    data: { name: "Reforzado con fibras" },
  });
  const feature53 = await prisma.productFeature.create({
    data: { name: "Excelente durabilidad y cobertura" },
  });
  const feature54 = await prisma.productFeature.create({
    data: { name: "Alta resistencia a los cambios de clima" },
  });

  // Crear especificaciones
  const spec51 = await prisma.productSpecification.create({
    data: {
      title: "TamaÃ±o",
      description: "Disponible en 1/4 GalÃ³n, 1 GalÃ³n y CuÃ±ete",
    },
  });
  const spec52 = await prisma.productSpecification.create({
    data: {
      title: "Uso",
      description: "AplicaciÃ³n en techos, loza y terrazas",
    },
  });
  const spec53 = await prisma.productSpecification.create({
    data: {
      title: "DuraciÃ³n",
      description: "7 aÃ±os en 1/4 GalÃ³n y 10 aÃ±os en CuÃ±ete y GalÃ³n",
    },
  });

  // Crear colores
  const rojoColonial = await prisma.productColor.create({
    data: { name: "Rojo Colonial", code: "#D8382B" },
  });
  const gris = await prisma.productColor.create({
    data: { name: "Gris", code: "#B4B4B4" },
  });
  const blanco5 = await prisma.productColor.create({
    data: { name: "Blanco", code: "#FFFFFF" },
  });

  // Crear tamaÃ±os
  const sizeQuarterGallon = await prisma.productSize.create({
    data: {
      name: "1/4 GalÃ³n",
      image: "/imgs/products/techo/aguacero1.jpg",
      price: 15000,
    },
  });
  const sizeOneGallon = await prisma.productSize.create({
    data: {
      name: "1 GalÃ³n",
      image: "/imgs/products/techo/aguacero2.jpg",
      price: 35000,
    },
  });
  const sizeCunete = await prisma.productSize.create({
    data: {
      name: "CuÃ±ete",
      image: "/imgs/products/techo/aguacero1.jpg",
      price: 100000,
    },
  });

  // Crear producto "Aguacero - Impermeabilizante Inteligente" con features, specifications, tamaÃ±os conectados
  await prisma.product.create({
    data: {
      name: "Aguacero - Impermeabilizante Inteligente",
      price: 35000, // El precio puede ajustarse
      image: "/imgs/products/aguacero1.jpg",
      description:
        "Detecta minigrietas y porosidades que a simple vista no se ven, con gran elasticidad, adherencia y resistencia, ideal para techos, loza y terrazas.",
      featured: false,
      color: {
        connect: [{ id: rojoColonial.id }, { id: gris.id }, { id: blanco5.id }],
      },
      size: {
        connect: [
          { id: sizeQuarterGallon.id },
          { id: sizeOneGallon.id },
          { id: sizeCunete.id },
        ],
      },
      categories: {
        connect: [{ id: paratechos.id }],
      },
      features: {
        connect: [
          { id: feature51.id },
          { id: feature52.id },
          { id: feature53.id },
          { id: feature54.id },
        ],
      },
      specifications: {
        connect: [{ id: spec51.id }, { id: spec52.id }, { id: spec53.id }],
      },
    },
  });

  //producto 6
  // Crear features
  const feature61 = await prisma.productFeature.create({
    data: {
      name: "Cristalino, no altera el color ni la presentaciÃ³n del Ã¡rea aplicada",
    },
  });
  const feature62 = await prisma.productFeature.create({
    data: { name: "Sella fisuras y paredes con humedad" },
  });
  const feature63 = await prisma.productFeature.create({
    data: { name: "Alta resistencia a los cambios de clima" },
  });
  const feature64 = await prisma.productFeature.create({
    data: { name: "Protege terrazas enchapadas" },
  });

  // Crear especificaciones
  const spec61 = await prisma.productSpecification.create({
    data: { title: "TamaÃ±o", description: "Disponible en 1 GalÃ³n y CuÃ±ete" },
  });
  const spec62 = await prisma.productSpecification.create({
    data: {
      title: "Uso",
      description:
        "Para techar, baÃ±os, cocinas, paredes con humedad, y ladrillos",
    },
  });

  // Crear tamaÃ±os
  const sizeOneGallon6 = await prisma.productSize.create({
    data: {
      name: "1 GalÃ³n",
      image: "/imgs/products/terraza/aguacerotransparente1.jpg",
      price: 60000,
    },
  });
  const sizeCuÃ±ete6 = await prisma.productSize.create({
    data: {
      name: "CuÃ±ete",
      image: "/imgs/products/terraza/aguacerotransparente2.jpg",
      price: 150000,
    },
  });

  // Crear producto "Aguacero - Sellante e Impermeabilizante Transparente Cristalino" con features, specifications, tamaÃ±os conectados
  await prisma.product.create({
    data: {
      name: "Aguacero - Sellante e Impermeabilizante Transparente Cristalino",
      price: 60000, // El precio puede ajustarse
      image: "/imgs/products/aguacero-sellante.png",
      description:
        "Sellante e impermeabilizante transparente cristalino. OlvÃ­date de las filtraciones, desaparecen mÃ¡gicamente sin notarse. Ideal para proteger terrazas enchapadas.",
      featured: true,
      color: {
        connect: [], // No se mencionan colores en la imagen, por lo dejamos vacÃ­o
      },
      size: {
        connect: [{ id: sizeCuÃ±ete6.id }, { id: sizeOneGallon6.id }],
      },
      categories: {
        connect: [{ id: paraterrazas.id }],
      },
      features: {
        connect: [
          { id: feature61.id },
          { id: feature62.id },
          { id: feature63.id },
          { id: feature64.id },
        ],
      },
      specifications: {
        connect: [{ id: spec61.id }, { id: spec62.id }],
      },
    },
  });

  //product7
  // Crear features
  const feature71 = await prisma.productFeature.create({
    data: { name: "Protege de sol, lluvia, hongos y descascaramiento" },
  });
  const feature72 = await prisma.productFeature.create({
    data: { name: "Reacciona al color natural de la pared" },
  });
  const feature73 = await prisma.productFeature.create({
    data: { name: "DuraciÃ³n de 8 aÃ±os" },
  });
  const feature74 = await prisma.productFeature.create({
    data: { name: "Resistente y de alto rendimiento" },
  });

  // Crear especificaciones
  const spec71 = await prisma.productSpecification.create({
    data: {
      title: "TamaÃ±o",
      description: "Disponible en 1/4 GalÃ³n, 1 GalÃ³n y CuÃ±ete",
    },
  });
  const spec72 = await prisma.productSpecification.create({
    data: {
      title: "Uso",
      description: "Ideal para fachadas de ladrillo, cemento, piedra y mÃ¡rmol",
    },
  });
  const spec73 = await prisma.productSpecification.create({
    data: { title: "DuraciÃ³n", description: "8 aÃ±os de durabilidad" },
  });

  // Crear colores
  const transparente = await prisma.productColor.create({
    data: { name: "Transparente", code: "#FFFFFF" },
  });
  const tonotaRoja = await prisma.productColor.create({
    data: { name: "Tonota Roja", code: "#D15C2B" },
  });
  const terracota = await prisma.productColor.create({
    data: { name: "Terracota", code: "#E26328" },
  });

  // Crear tamaÃ±os
  const sizeQuarterGallon7 = await prisma.productSize.create({
    data: {
      name: "1/4 GalÃ³n",
      image: "/imgs/products/fachada/cristalmuro1.jpg",
      price: 25000,
    },
  });
  const sizeOneGallon7 = await prisma.productSize.create({
    data: {
      name: "1 GalÃ³n",
      image: "/imgs/products/fachada/cristalmuro1.jpg",
      price: 45000,
    },
  });
  const sizeCunete7 = await prisma.productSize.create({
    data: {
      name: "CuÃ±ete",
      image: "/imgs/products/fachada/cristalmuro1.jpg",
      price: 100000,
    },
  });

  // Crear producto "Cristal Muro - Impermeabilizante Transparente para Paredes" con features, specifications, tamaÃ±os conectados
  await prisma.product.create({
    data: {
      name: "Cristal Muro - Impermeabilizante Transparente para Paredes",
      price: 25000, // El precio puede ajustarse
      image: "/imgs/products/cristal-muro.png",
      description:
        "Producto denso que protege el ladrillo del sol, lluvia, hongos y descascaramiento, con una duraciÃ³n de 8 aÃ±os.",
      featured: true,
      color: {
        connect: [
          { id: transparente.id },
          { id: tonotaRoja.id },
          { id: terracota.id },
        ],
      },
      size: {
        connect: [
          { id: sizeQuarterGallon7.id },
          { id: sizeOneGallon7.id },
          { id: sizeCunete7.id },
        ],
      },
      categories: {
        connect: [{ id: parafachadas.id }],
      },
      features: {
        connect: [
          { id: feature71.id },
          { id: feature72.id },
          { id: feature73.id },
          { id: feature74.id },
        ],
      },
      specifications: {
        connect: [{ id: spec71.id }, { id: spec72.id }, { id: spec73.id }],
      },
    },
  });

  //product8
  // Crear features
  const feature81 = await prisma.productFeature.create({
    data: { name: "Protege sin afectar la apariencia de la fachada" },
  });
  const feature82 = await prisma.productFeature.create({
    data: { name: "HidrÃ³fugo incoloro" },
  });
  const feature83 = await prisma.productFeature.create({
    data: { name: "DuraciÃ³n de 8 aÃ±os" },
  });
  const feature84 = await prisma.productFeature.create({
    data: { name: "Resistencia a los cambios de clima" },
  });

  // Crear especificaciones
  const spec81 = await prisma.productSpecification.create({
    data: {
      title: "TamaÃ±o",
      description: "Disponible en 1 Litro, 1 GalÃ³n y CuÃ±ete",
    },
  });
  const spec82 = await prisma.productSpecification.create({
    data: {
      title: "Uso",
      description:
        "Ideal para ladrillo, piedra natural, concreto, paÃ±os y tejas de barro",
    },
  });
  const spec83 = await prisma.productSpecification.create({
    data: { title: "DuraciÃ³n", description: "8 aÃ±os de protecciÃ³n" },
  });

  // Crear tamaÃ±os
  const sizeOneLitre = await prisma.productSize.create({
    data: {
      name: "1 Litro",
      image: "/imgs/products/fachada/cristalmuro2.jpg",
      price: 30000,
    },
  });
  const sizeOneGallon8 = await prisma.productSize.create({
    data: {
      name: "1 GalÃ³n",
      image: "/imgs/products/fachada/cristalmuro3.jpg",
      price: 65000,
    },
  });
  const sizeCunete8 = await prisma.productSize.create({
    data: {
      name: "CuÃ±ete",
      image: "/imgs/products/fachada/cristalmuro4.jpg",
      price: 120000,
    },
  });

  // Crear producto "Cristal Muro - HidrÃ³fugo Incoloro Siliconado" con features, specifications, tamaÃ±os conectados
  await prisma.product.create({
    data: {
      name: "Cristal Muro - HidrÃ³fugo Incoloro Siliconado",
      price: 30000, // El precio puede ajustarse
      image: "/imgs/products/cristal-muro-hidrofugo.png",
      description:
        "HidrÃ³fugo incoloro siliconado que protege sin afectar la apariencia de la fachada, ideal para ladrillo, piedra natural, concreto, paÃ±os y tejas de barro.",
      featured: false,
      color: {
        connect: [], // No se mencionan colores en la imagen, por lo dejamos vacÃ­o
      },
      size: {
        connect: [
          { id: sizeOneLitre.id },
          { id: sizeOneGallon8.id },
          { id: sizeCunete8.id },
        ],
      },
      categories: {
        connect: [{ id: parafachadas.id }],
      },
      features: {
        connect: [
          { id: feature81.id },
          { id: feature82.id },
          { id: feature84.id },
          { id: feature83.id },
        ],
      },
      specifications: {
        connect: [{ id: spec81.id }, { id: spec82.id }, { id: spec83.id }],
      },
    },
  });

  console.log("ð¦ Productos, features y especificaciones creados.");
}

(async () => {
  if (process.env.NODE_ENV !== "production") {
    await main();
  }
})();
