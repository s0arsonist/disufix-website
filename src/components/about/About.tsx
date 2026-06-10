"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Award, MapPin, Target } from "lucide-react";
import { useAnimateOnScroll } from "@/hooks/use-animation";

export default function About() {
  useAnimateOnScroll();

  // // Team members
  // const team = [
  //   {
  //     name: "Carlos RodrÃ­guez",
  //     position: "CEO & Fundador",
  //     image: "/team/team1.jpg",
  //   },
  //   {
  //     name: "MarÃ­a GÃ³mez",
  //     position: "Directora de Operaciones",
  //     image: "/team/team2.jpg",
  //   },
  //   {
  //     name: "Juan PÃ©rez",
  //     position: "Jefe de InvestigaciÃ³n",
  //     image: "/team/team3.jpg",
  //   },
  //   {
  //     name: "Ana MartÃ­nez",
  //     position: "Gerente Comercial",
  //     image: "/team/team4.jpg",
  //   },
  // ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/imgs/home.png"
            alt="Acerca de Disufix"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/60"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl animate-slide-right">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Sobre <span className="text-primary">Nosotros</span>
            </h1>
            <div className="w-20 h-1 bg-gradient-brand rounded-full mb-6"></div>
            <p className="text-lg text-gray-200 mb-8">
              Conoce nuestra historia, misiÃ³n y visiÃ³n. Descubre por quÃ© somos
              lÃ­deres en soluciones quÃ­micas para la construcciÃ³n.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <h2 className="text-3xl font-bold mb-6">
                Nuestra <span className="text-primary">Historia</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-brand rounded-full mb-6"></div>
              <p className="mb-4">
                Disufix naciÃ³ en 2010 con una visiÃ³n clara: crear productos
                quÃ­micos innovadores que resolvieran problemas reales en el
                sector de la construcciÃ³n. Lo que comenzÃ³ como un pequeÃ±o
                laboratorio con un equipo de tres personas, ha crecido hasta
                convertirse en una empresa reconocida a nivel nacional.
              </p>
              <p className="mb-4">
                A lo largo de los aÃ±os, hemos invertido constantemente en
                investigaciÃ³n y desarrollo, lo que nos ha permitido crear
                fÃ³rmulas Ãºnicas y altamente efectivas que se han ganado la
                confianza de profesionales y usuarios domÃ©sticos.
              </p>
              <p>
                Hoy, con presencia en mÃ¡s de 30 ciudades de Colombia, seguimos
                comprometidos con la innovaciÃ³n y la calidad, manteniendo
                siempre el mismo espÃ­ritu emprendedor que nos impulsÃ³ desde el
                principio.
              </p>
            </div>
            <div className="relative animate-on-scroll">
              <div className="bg-gray-100 p-4 rounded-xl -rotate-3 transform hover:rotate-0 transition-transform duration-300">
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <Image
                    src="/imgs/cambiodisufix.jpg"
                    alt="Nuestra Historia"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-primary/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">
              MisiÃ³n y <span className="text-primary">VisiÃ³n</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-brand mx-auto rounded-full mb-4"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all animate-on-scroll">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Nuestra MisiÃ³n</h3>
              <p className="text-black/70">
                Proporcionar soluciones quÃ­micas innovadoras y de alta calidad
                que mejoren la durabilidad, seguridad y estÃ©tica de las
                construcciones, contribuyendo al bienestar de nuestros clientes
                y al desarrollo sostenible del sector.
              </p>
            </div>

            <div
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all animate-on-scroll"
              style={{ transitionDelay: "0.1s" }}
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Nuestra VisiÃ³n</h3>
              <p className="text-black/70">
                Ser reconocidos como lÃ­deres en la industria de productos
                quÃ­micos para la construcciÃ³n en toda LatinoamÃ©rica,
                destacÃ¡ndonos por nuestra innovaciÃ³n constante, excelencia en el
                servicio y compromiso con la sostenibilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-95 z-0"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Nuestros <span className="text-secondary">Valores</span>
            </h2>
            <div className="w-20 h-1 bg-secondary mx-auto rounded-full mb-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "InnovaciÃ³n",
                description:
                  "Buscamos constantemente nuevas formas de mejorar nuestros productos y procesos.",
              },
              {
                title: "Calidad",
                description:
                  "Nos comprometemos a ofrecer productos de la mÃ¡s alta calidad que superen las expectativas.",
              },
              {
                title: "Integridad",
                description:
                  "Actuamos con honestidad y transparencia en todas nuestras relaciones comerciales.",
              },
              {
                title: "Sostenibilidad",
                description:
                  "Desarrollamos productos respetuosos con el medio ambiente y procesos sostenibles.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all animate-on-scroll"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-bold mb-3 text-white">
                  {value.title}
                </h3>
                <p className="text-white/80">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {/* <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">
              Nuestro <span className="text-primary">Equipo</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-brand mx-auto rounded-full mb-4"></div>
            <p className="text-black/70 max-w-2xl mx-auto">
              Conoce a las personas que hacen posible que Disufix ofrezca productos de la mÃ¡s alta calidad
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all animate-on-scroll"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-primary">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Presence */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <h2 className="text-3xl font-bold mb-6">
                Nuestra <span className="text-primary">Presencia</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-brand rounded-full mb-6"></div>
              <p className="mb-6">
                Contamos con presencia en mÃ¡s de 30 ciudades de Colombia, lo que
                nos permite estar cerca de nuestros clientes y brindarles un
                servicio rÃ¡pido y eficiente.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-1" />
                  <div>
                    <p className="font-medium">RegiÃ³n Andina</p>
                    <p className="text-sm text-black/70">
                      BogotÃ¡, MedellÃ­n, Bucaramanga, CÃºcuta
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-1" />
                  <div>
                    <p className="font-medium">RegiÃ³n Caribe</p>
                    <p className="text-sm text-black/70">
                      Barranquilla, Cartagena, Santa Marta
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-1" />
                  <div>
                    <p className="font-medium">RegiÃ³n PacÃ­fica</p>
                    <p className="text-sm text-black/70">
                      Cali, Buenaventura, Pasto
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Otras Regiones</p>
                    <p className="text-sm text-black/70">
                      Villavicencio, Yopal, San AndrÃ©s
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="relative animate-on-scroll">
              <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
                <Image src="/colombia-map.jpg" alt="Mapa de Colombia" fill className="object-cover" />
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-brand">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto animate-on-scroll">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Â¿Quieres formar parte de nuestra historia?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              ContÃ¡ctanos hoy mismo y descubre cÃ³mo nuestros productos pueden
              transformar tus proyectos
            </p>
            <Link
              href="/contacto"
              className="btn bg-white text-primary hover:bg-neutral hover:text-white transition-colors px-8 py-3 rounded-full inline-flex items-center"
            >
              ContÃ¡ctanos
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
