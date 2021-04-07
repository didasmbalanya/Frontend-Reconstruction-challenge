require('dotenv').config();

// Use the hidden-source-map option when you don't want the source maps to be
// publicly available on the servers, only to the error reporting
const withSourceMaps = require('@zeit/next-source-maps')();

// Use the SentryWebpack plugin to upload the source maps during build step
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

/* eslint-disable */
const path = require('path');
const withLess = require('@zeit/next-less');
const withCSS = require('@zeit/next-css');
const lessToJS = require('less-vars-to-js');

const fs = require('fs');

const themeVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './assets/css/globals/_vars.less'), 'utf8'));

if (typeof require !== 'undefined') {
    require.extensions['.less'] = (file) => {};
}

const {
    COGNITO_USER_POOL_ID,
    COGNITO_CLIENT_ID,
    AWS_REGION,
    GRAPHQL_ENDPOINT,
    GA_ID,
    OAUTH_SIGNIN_URL,
    OAUTH_SIGNOUT_URL,
    GRAPHQL_ADMIN_SECRET,
    ENABLED_FEATURES,
    OAUTH_COGNITO_DOMAIN,
    STRIPE_PUBLIC_KEY,
    MIXPANEL_PROJECT_TOKEN,
    SENTRY_DSN,
    SENTRY_ORG,
    SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN,
    NODE_ENV,
    GTM_ID,
    GTM_ENROLL_CONVERSION_ID,
    LOGROCKET_APP_ID,
    HOTJAR_VERSION,
    HOTJAR_ID,
    COMMIT_SHA,
    SERVERLESS_STAGE,
    PIXEL_ID,
    GOOGLE_OPTIMIZE_CONTAINER_ID,
    MIXPANEL_ENV_CHECK,
} = process.env;

module.exports = withCSS({
    // withSourceMaps({
    cssModules: true,
    ...withLess({
        lessLoaderOptions: {
            javascriptEnabled: true,
            modifyVars: themeVariables, // make your antd custom effective
            importLoaders: 0,
        },
        cssLoaderOptions: {
            importLoaders: 3,
            localIdentName: '[local]___[hash:base64:5]',
        },
        webpack: (config, nextConfig) => {
            //Make Ant styles work with less
            if (nextConfig.isServer) {
                const antStyles = /(antd\/.*?\/style).*(?<![.]js)$/;
                const origExternals = [...config.externals];
                config.externals = [
                    (context, request, callback) => {
                        if (request.match(antStyles)) return callback();
                        if (typeof origExternals[0] === 'function') {
                            origExternals[0](context, request, callback);
                        } else {
                            callback();
                        }
                    },
                    ...(typeof origExternals[0] === 'function' ? [] : origExternals),
                ];

                config.module.rules.unshift({
                    test: antStyles,
                    use: 'null-loader',
                });
            } else {
                config.resolve.alias['@sentry/node'] = '@sentry/browser';
            }
            /* if (!nextConfig.dev) {
                // if deploying on dev then allow source maps to be loaded
                config.devtool = SERVERLESS_STAGE === 'dev' ? 'source-map' : 'hidden-source-map';
                for (const plugin of config.plugins) {
                    if (plugin.constructor.name === 'UglifyJsPlugin') {
                        plugin.options.sourceMap = true;
                        break;
                    }
                }
            }*/

            if (SENTRY_DSN && SENTRY_ORG && SENTRY_PROJECT && SENTRY_AUTH_TOKEN && NODE_ENV === 'production') {
                config.plugins.push(
                    new SentryWebpackPlugin({
                        include: '.next',
                        ignore: ['node_modules'],
                        urlPrefix: '~/_next',
                        release: COMMIT_SHA,
                    }),
                );
            }

            return config;
        },
    }),
    env: {
        COGNITO_USER_POOL_ID,
        COGNITO_CLIENT_ID,
        AWS_REGION,
        GRAPHQL_ENDPOINT,
        OAUTH_SIGNIN_URL,
        OAUTH_SIGNOUT_URL,
        GA_ID,
        GRAPHQL_ADMIN_SECRET,
        OAUTH_COGNITO_DOMAIN,
        ENABLED_FEATURES,
        STRIPE_PUBLIC_KEY,
        MIXPANEL_PROJECT_TOKEN,
        SENTRY_DSN,
        GTM_ID,
        GTM_ENROLL_CONVERSION_ID,
        HOTJAR_VERSION,
        HOTJAR_ID,
        LOGROCKET_APP_ID,
        SERVERLESS_STAGE,
        PIXEL_ID,
        GOOGLE_OPTIMIZE_CONTAINER_ID,
        MIXPANEL_ENV_CHECK,
    },
});
// );
