export const metadata = {
  title: "Al Asad Platform",
  description: "Education foundation platform"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}