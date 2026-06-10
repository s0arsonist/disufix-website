"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function SocialNetworks() {
  const [isVisible, setIsVisible] = useState(false);

  // Detectar scroll para animaciÃ³n de entrada
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 200) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Verificar posiciÃ³n inicial

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Redes sociales (reemplazar con los enlaces reales)
  const socialNetworks = [
    {
      name: "Facebook",
      url: "https://facebook.com/disufix",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
        </svg>
      ),
      color: "#1877F2",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/disufix",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.987.01-4.04.059-.977.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.88-.344 1.857-.047 1.053-.059 1.37-.059 4.04 0 2.67.01 2.988.059 4.04.045.977.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.88.3 1.857.344 1.054.047 1.37.059 4.04.059 2.67 0 2.987-.01 4.04-.059.977-.045 1.504-.207 1.857-.344.467-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.88.344-1.857.047-1.053.059-1.37.059-4.04 0-2.67-.01-2.987-.059-4.04-.045-.977-.207-1.504-.344-1.857a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.88-.3-1.857-.344-1.053-.047-1.37-.059-4.04-.059zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.469a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
        </svg>
      ),
      color: "#E4405F",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/disufix",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 2H1l8.26 11.015L1.45 22H4.1l6.388-7.349L16 22h7l-8.608-11.478L21.8 2h-2.65l-5.986 6.886L8 2Zm9 18L5 4h2l12 16h-2Z" />
        </svg>
      ),
      color: "#1DA1F2",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/disufix",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
        </svg>
      ),
      color: "#0A66C2",
    },
    {
      name: "YouTube",
      url: "https://youtube.com/disufix",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12.244 4c.534.003 1.87.016 3.29.073l.504.022c1.429.067 2.857.183 3.566.38.945.266 1.687 1.04 1.938 2.022.4 1.56.458 4.662.458 5.503v.001c0 .84-.057 3.942-.458 5.502-.25.981-.993 1.756-1.938 2.022-.709.197-2.137.313-3.566.38l-.504.023c-1.42.056-2.756.07-3.29.072h-.49c-.533-.003-1.87-.016-3.29-.073l-.504-.022c-1.429-.067-2.857-.183-3.565-.38-.945-.266-1.687-1.04-1.939-2.022-.4-1.56-.457-4.662-.457-5.502v-.001c0-.84.057-3.943.457-5.503.252-.981.994-1.756 1.939-2.022.708-.197 2.136-.313 3.565-.38l.504-.022c1.42-.057 2.757-.07 3.29-.073h.49zM10 8.5v7l6-3.5-6-3.5z" />
        </svg>
      ),
      color: "#FF0000",
    },
  ];

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-[#222222] to-[#333333]">
      <div className="container-custom relative">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F7B733]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F7B733]/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Encabezado */}
          <div className="text-center mb-12">
            <div className="inline-block">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Nuestras <span className="text-[#F7B733]">Redes Sociales</span>
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-[#F7B733] to-[#F7B733]/50 rounded-full mx-auto mt-4" />
            </div>
            <p className="text-gray-300 mt-6 max-w-2xl mx-auto">
              SÃ­guenos en nuestras redes sociales para estar al dÃ­a con nuestros
              productos, promociones y consejos tÃ©cnicos especializados.
            </p>
          </div>

          {/* Iconos de redes sociales */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {socialNetworks.map((social) => (
              <motion.div
                key={social.name}
                variants={itemVariants}
                className="flex justify-center"
              >
                <Link
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center"
                >
                  <div
                    className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-lg mb-3 overflow-hidden transition-transform duration-300 group-hover:scale-110"
                    style={{
                      boxShadow: `0 10px 15px -3px ${social.color}20, 0 4px 6px -2px ${social.color}10`,
                    }}
                  >
                    {/* Efecto de hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: social.color }}
                    />

                    {/* Icono */}
                    <div className="relative z-10 text-[#333] group-hover:text-white transition-colors duration-300">
                      {social.icon}
                    </div>
                  </div>
                  <span className="text-white text-sm font-medium group-hover:text-[#F7B733] transition-colors duration-300">
                    {social.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Hashtag */}
          <div className="mt-16 text-center">
            <p className="text-lg md:text-xl text-[#F7B733] font-semibold tracking-wide">
              #DISUFIX <span className="text-white">en tus proyectos</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
