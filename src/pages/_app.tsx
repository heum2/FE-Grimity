import { useEffect } from "react";
import type { AppProps } from "next/app";
import "@/styles/globals.scss";
import "@/styles/reset.css";
import Layout from "@/components/Layout/Layout";
import Modal from "@/components/Modal/Modal";
import { RecoilRoot, useRecoilTransactionObserver_UNSTABLE, useSetRecoilState } from "recoil";
import { authState } from "@/states/authState";
import { QueryClient, QueryClientProvider } from "react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Toast from "@/components/Toast/Toast";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

function InitializeAuthState() {
  const setAuth = useSetRecoilState(authState);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const user_id = localStorage.getItem("user_id");

    if (access_token && user_id) {
      setAuth({
        access_token,
        isLoggedIn: true,
        user_id,
      });
    }
  }, [setAuth]);

  return null;
}

function PersistAuthState() {
  useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
    const auth = snapshot.getLoadable(authState).contents;

    if (auth.isLoggedIn) {
      localStorage.setItem("access_token", auth.access_token);
      if (auth.id) {
        localStorage.setItem("user_id", auth.id);
      }
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
    }
  });

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <InitializeAuthState />
      <PersistAuthState />
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <div className="body">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </div>
          <Modal />
          <Toast />
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-315CM7P7E5"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-315CM7P7E5');
          `,
            }}
          />
          <Analytics />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
