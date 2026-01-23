import { Inter } from "next/font/google";
import "./globals.css";
// Context Imports
import { AuthContextProvider } from "@/context/AuthContext"; 
import { ModalProvider } from "@/context/ModalContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Al-Asad Education Foundation",
  description: "Transforming education through Qur'an values and community empowerment.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fixed Eruda Script: Uses standard DOM injection instead of document.write */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                // Check if ?eruda=true is in URL OR if localStorage flag is set
                var isActive = /eruda=true/.test(window.location) || localStorage.getItem('active-eruda') === 'true';
                
                if (isActive) {
                  var script = document.createElement('script');
                  script.src = "//cdn.jsdelivr.net/npm/eruda";
                  script.onload = function() { eruda.init(); };
                  document.head.appendChild(script);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthContextProvider>
          <ModalProvider> 
            {children}
          </ModalProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
