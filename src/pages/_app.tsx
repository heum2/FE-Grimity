import type { AppProps } from "next/app";
import Script from "next/script";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Layout from "@/components/Layout/Layout";
import Modal from "@/components/Modal/Modal";
import Toast from "@/components/Toast/Toast";
import ModalProvider from "@/components/Modal/Provider";

import { useInitializeDevice } from "@/hooks/useInitializeDevice";

import "@/styles/globals.scss";
import "@/styles/reset.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  useInitializeDevice();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <div className="body">
            <ModalProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ModalProvider>
          </div>
          <Modal />
          <Toast />
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');
              `,
            }}
          />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </>
  );
}
