import { Header } from "./StaticHeader";
import Footer from "./StaticFooter";
import { Layout, ConfigProvider } from "antd";
import Head from "next/head";
import { initGA, logPageView } from "@components/common/googleAnalytics";
import React, { useEffect } from "react";
import { loadIntercom } from "intercom-next";
import en_US from 'antd/es/locale/en_US';
export interface LayoutsProps {
  className?: string;
  title?: string;
}

export interface MainLayoutProps {
  layoutProps: LayoutsProps;
  children: React.ReactNode | null;
}

function StaticMainLayout({ layoutProps, children }: MainLayoutProps) {

  useEffect(() => {
    initGA();
    logPageView();

    loadIntercom({
      appId: "jl8cb2mw", // default : ''
      initWindow: true, // default: true
      delay: 0, // default: 0  - usefull for mobile devices to prevent blocking the main thread
    });
  });
  return (
    <Layout
      className={
        layoutProps && layoutProps.className ? layoutProps.className : ""
      }
    >
      <Head>
          <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/favicon/manifest.json" />
          <meta name="msapplication-TileColor" content="#3F0D28" />
          <meta name="msapplication-TileImage" content="/favicon/ms-icon-144x144.png" />
          <meta name="theme-color" content="#3F0D28" />
          {layoutProps && layoutProps.title ? (
            <title>{layoutProps.title}</title>
          ) : null}
      </Head>
      <Header />
      <Layout.Content>{children}</Layout.Content>
      <Footer />
    </Layout>
  );
}

export default StaticMainLayout;

