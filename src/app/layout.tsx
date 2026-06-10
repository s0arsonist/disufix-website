import type React from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Provider } from "@/components";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "Disufix | %s   ",
    default: "Disufix | Productos de Alta TecnologÃ­a",
  },
  description:
    "Disufix ofrece productos quÃ­micos de alta tecnologÃ­a e innovaciÃ³n para mantenimiento y prevenciÃ³n en construcciones",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <Script
        strategy="afterInteractive" // Script de Wompi (se mantiene)
        src="https://checkout.wompi.co/widget.js"
      />
      <body
        className={`${montserrat.variable} font-sans min-h-screen flex flex-col`}
      >
        <Analytics />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#EF7D30",
              color: "#fff",
            },
          }}
        />
        <Provider>{children}</Provider>

        {/* ============================================== */}
        {/* === INICIO: PÃXEL 1 (Madecril) === */}
        {/* ============================================== */}
        <Script id="meta-pixel-madecril" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', '839398378098924');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=839398378098924&ev=PageView&noscript=1"
          />
        </noscript>
        {/* === FIN: PÃXEL 1 === */}

        {/* ============================================== */}
        {/* === INICIO: PÃXEL 2 (Aguacero) === */}
        {/* ============================================== */}
        <Script id="meta-pixel-aguacero" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', '1118401999737118');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1118401999737118&ev=PageView&noscript=1"
          />
        </noscript>
        {/* === FIN: PÃXEL 2 === */}
      </body>
    </html>
  );
}
