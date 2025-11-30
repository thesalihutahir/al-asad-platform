// app/layout.js (Modified to include AuthProvider)

import { AuthProvider } from '../components/AuthContext'; // Adjust path if needed

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap content with AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
