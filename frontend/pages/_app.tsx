import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React from 'react';
import '../assets/css/style.less';

type AppPropsWithError = AppProps & { err: any };

const MyApp = ({ Component, pageProps, err }: AppPropsWithError) => {
    const router = useRouter();
    // Initiate GTM

    return <Component {...pageProps} err={err} />;
};

export default MyApp;
