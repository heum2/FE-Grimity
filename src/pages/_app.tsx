import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import "@/styles/globals.scss";
import "@/styles/reset.css";
import Layout from "@/components/Layout/Layout";
import Modal from "@/components/Modal/Modal";
import { useAuthStore } from "@/states/authStore";
import { QueryClient, QueryClientProvider } from "react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Toast from "@/components/Toast/Toast";
import Script from "next/script";
import Loader from "@/components/Layout/Loader/Loader";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUserId = useAuthStore((state) => state.setUserId);
  const [isInitializing, setIsInitializing] = useState(true);
  const access_token = useAuthStore((state) => state.access_token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("access_token");
    const storedUserId = localStorage.getItem("user_id");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      setIsLoggedIn(true);
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
    setIsInitializing(false);
  }, [setAccessToken, setIsLoggedIn, setUserId]);

  useEffect(() => {
    if (isInitializing) return;

    if (isLoggedIn) {
      localStorage.setItem("access_token", access_token);
      if (user_id) {
        localStorage.setItem("user_id", user_id);
      }
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
    }
  }, [isInitializing, access_token, isLoggedIn, user_id]);

  if (isInitializing) {
    return <Loader />;
  }

  return (
    <>
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
