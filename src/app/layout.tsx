"use client";
import { AdminContextWrapper } from "@/app/context/admin";
import { AppContextWrapper } from "@/app/context/app";
import { AuthContextWrapper } from "@/app/context/auth";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Inter } from "next/font/google";
import Head from "next/head";
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

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Geo Market",
//   description: "ქართული ხელოვნების ბაზარი",
//   openGraph: {
//     title: "Geo Market",
//     description: "ქართული ხელოვნების ბაზარი",
//     images: [
//       {
//         url: "/favicon-32x32.png", // Replace with the actual path to your image
//         width: 1200,
//         height: 630,
//         alt: "Geo Market Image",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Geo Market",
//     description: "Hand made products",
//     images: "/favicon-32x32.png", // Replace with the actual path to your image
//   },
// };

// Ensure this file is client-side

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ff0000" />{" "}
        {/* Change to desired color */}
        <meta name="msapplication-navbutton-color" content="#ff0000" />{" "}
        {/* Change to desired color */}
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Head>
      <body className={inter.className}>
        <AppContextWrapper>
          <AuthContextWrapper>
            <NotificationsContextWrapper>
              <ChatContextWrapper>
                <ProductsContextWrapper>
                  <UserContextWrapper>
                    <AdminContextWrapper>
                      <ProgressBar
                        height="4px"
                        color="#ff0000"
                        options={{ showSpinner: false }}
                        shallowRouting
                      />
                      <div className="pb-10" style={{ minHeight: "90vh" }}>
                        <Header />
                        <Menu />
                        <SimpleBackdrop />
                        <main
                          className={
                            "flex-1 flex p-2 laptop:mt-20 h-full relative"
                          }
                        >
                          {children}
                          <Navigator />
                          <NavigatorMobile />
                        </main>
                        <Footer />
                      </div>
                    </AdminContextWrapper>
                  </UserContextWrapper>
                </ProductsContextWrapper>
              </ChatContextWrapper>
            </NotificationsContextWrapper>
          </AuthContextWrapper>
        </AppContextWrapper>
      </body>
    </html>
  );
}
