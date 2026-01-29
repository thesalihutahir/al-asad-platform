import "./globals.css";
// Context Imports
import { AuthContextProvider } from "@/context/AuthContext"; 
import { ModalProvider } from "@/context/ModalContext"; 

export const metadata = {
  title: "Al-Asad Education Foundation",
  description: "Transforming education through Qur'an values and community empowerment.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fixed Eruda Script: Uses standard DOM injection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
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
      {/* UPDATE: Removed Inter, applied font-lato globally to match design system */}
      <body className="font-lato text-brand-brown-dark bg-brand-sand/10 antialiased">
        <AuthContextProvider>
          <ModalProvider> 
            {children}
          </ModalProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
