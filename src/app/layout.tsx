import { AppContextWrapper } from "@/app/context/app";
import { AuthContextWrapper } from "@/app/context/auth";
import { Inter } from "next/font/google";
import SimpleBackdrop from "./components/backdrop";
import Footer from "./components/footer";
import Header from "./components/header";
import Menu from "./components/menu";
import Navigator from "./components/navigator";
import NavigatorMobile from "./components/navigator-mobile";
import { ChatContextWrapper } from "./context/chat";
import { NotificationsContextWrapper } from "./context/notifications";
import { ProductsContextWrapper } from "./context/products";
import { UserContextWrapper } from "./context/user";
import "./globals.css";
import { Metadata } from "next";
import Loading from "./components/loading";
import { Analytics } from "@vercel/analytics/react";
import { AdsContextWrapper } from "./context/advertisments";
import { AddFields } from "./(pages)/(auth)/addFields";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const getMetadata = (title: string): Metadata => ({
  title: title,
  description: "უნიკალური ქართული პროდუქცია",
});

export const metadata: Metadata = {
  title: "Geo Market - ქართული ბაზარი",
  description: "უნიკალური ქართული პროდუქცია",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  themeColor: "#ff0000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Geo Market - ქართული ბაზარი",
    description: "უნიკალური ქართული პროდუქცია",
    url: "https://geomarket.shop",
    type: "website",
    siteName: "Geo Market",
    images: [
      {
        url: "/banner.webp",
        width: 800,
        height: 600,
        alt: "Geo Market",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Geo Market - ქართული ბაზარი",
    description: "უნიკალური ქართული პროდუქცია",
    images: ["/banner.webp"],
  },
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <AppContextWrapper>
          <Loading />
          <GoogleAnalytics gaId="G-RMKWTM0RLX" />
          <AdsContextWrapper>
            <AuthContextWrapper>
              <AddFields />
              <NotificationsContextWrapper>
                <ChatContextWrapper>
                  <ProductsContextWrapper>
                    <UserContextWrapper>
                      <Analytics />
                      <div className="pb-16" style={{ minHeight: "90vh" }}>
                        <Header />
                        <Menu />
                        <SimpleBackdrop />
                        <main
                          className={
                            "flex-1 flex p-2 pt-0 laptop:pt-2 mt-20 h-full relative"
                          }
                        >
                          {children}
                          <Navigator />
                          <NavigatorMobile />
                        </main>
                        <Footer />
                      </div>
                    </UserContextWrapper>
                  </ProductsContextWrapper>
                </ChatContextWrapper>
              </NotificationsContextWrapper>
            </AuthContextWrapper>
          </AdsContextWrapper>
        </AppContextWrapper>
      </body>
    </html>
  );
}
