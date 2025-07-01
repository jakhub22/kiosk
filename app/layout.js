import "./globals.css";

export const metadata = {
  title: "Kiosk App",
  viewport: {
    width: "1080",
    height: "1920",
    initialScale: 1,
    maximumScale: 1,
    userScalable: "no",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white w-[1080px] h-[1920px] mx-auto overflow-hidden select-none touch-none">
        {children}
      </body>
    </html>
  );
}
