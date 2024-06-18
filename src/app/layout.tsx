import { AdminContextWrapper } from "@/app/context/admin";
import { AppContextWrapper } from "@/app/context/app";
import { AuthContextWrapper } from "@/app/context/auth";
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
import { Metadata } from "next";
import Loading from "./components/loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Geo Market - ქართული ხელოვნების ბაზარი",
  description:
    "Discover and purchase unique Georgian art and crafts on Geo Market.",
};

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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff0000" />
        <meta name="msapplication-navbutton-color" content="#ff0000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-status-bar-color" content="#ff0000" />
      </Head>
      <body className={inter.className}>
        <AppContextWrapper>
          <Loading />
          <AuthContextWrapper>
            <NotificationsContextWrapper>
              <ChatContextWrapper>
                <ProductsContextWrapper>
                  <UserContextWrapper>
                    <AdminContextWrapper>
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
