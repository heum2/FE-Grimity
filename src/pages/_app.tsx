import Layout from "@/components/Layout/Layout";
import "@/styles/globals.scss";
import "@/styles/reset.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="body">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}
