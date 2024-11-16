import type { Metadata } from "next";
import localFont from "next/font/local";
import 'react-toastify/dist/ReactToastify.css'
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import {ToastContainer, Slide} from 'react-toastify'
import { ConfirmProvider } from "@/context/ConfirmContext";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Dongle Party",
  description: "Who has the biggest dongle energy?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfirmProvider>
          <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              // closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable={false}
              pauseOnHover
              transition={Slide}
            />
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
        </ConfirmProvider>
      </body>
    </html>
  );
}
