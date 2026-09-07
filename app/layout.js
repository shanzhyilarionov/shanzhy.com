import Shell from "../components/shell";
import "./globals.css";

export const metadata = {
  title: "Shanzhy",
  description: "Independent developer based in Edmonton, Canada.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
