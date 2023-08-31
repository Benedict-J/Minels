import "@/styles/globals.scss";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useContext, useEffect } from "react";
import "@/firebase/init-firebase";
import { AuthContext, AuthProvider } from "@/context/auth";
import { Noto_Sans } from "next/font/google";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const notoSans = Noto_Sans({ subsets: ["latin"], weight: ['400', '700'] });

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AuthProvider>
      <main className={notoSans.className}>
        {getLayout(<Component {...pageProps} />)}
      </main>
    </AuthProvider>  
  );
}
