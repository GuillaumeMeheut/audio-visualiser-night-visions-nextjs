import type { Metadata } from "next";
import localFont from "next/font/local";
import { Roboto } from "next/font/google";
import "./globals.scss";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});
const devilBreeze = localFont({
  src: "../../public/fonts/DevilBreeze.ttf",
  variable: "--font-devilBreeze",
});

export const metadata: Metadata = {
  title: "Audio Visualization Night Visions",
  description:
    "An audio visualizer for the album of Imagines Dragons Night Visions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${devilBreeze.variable} ${roboto.variable}`}>
        {children}
      </body>
    </html>
  );
}
