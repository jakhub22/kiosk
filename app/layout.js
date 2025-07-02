import ToastProvider from "../components/ToastProvider";
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
      <body className="bg-black text-white h-screen w-screen overflow-hidden mx-auto select-none touch-none">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
