import * as Sentry from '@sentry/node';
import { ApolloServer, AuthenticationError, UserInputError } from 'apollo-server-lambda';

import { applyMiddleware } from 'graphql-middleware';
import { sentry } from 'graphql-middleware-sentry';
import { makeExecutableSchema } from 'graphql-tools';

import errorHelper from '../common/error';
import Mutation from './mutations';

import typeDefs from './types.graphql';

const { SENTRY_DSN, STAGE } = process.env;
const sentryMiddleware = sentry({
    config: {
        dsn: SENTRY_DSN,
        environment: STAGE,
    },
    withScope: (scope, error, { userId, body, headers }) => {
        if (userId) {
            scope.setUser({
                id: userId,
            });
        }

        scope.setTag('service', 'backend:remote-service');

        scope.setExtra('body', body);
        if (headers['x-apollo-operation-name']) {
            scope.setExtra('operationName', headers['x-apollo-operation-name']);
        }

        scope.setExtra('headers', headers);
    },
    forwardErrors: true,

    reportError: (res) => {
        return (
            !(res instanceof AuthenticationError) &&
            !(res instanceof UserInputError) &&
            res.code !== 'BAD_USER_INPUT' &&
            res.code !== 'UserNotFoundException' &&
            res.code !== 'UsernameExistsException'
        );
    },
});

// Provide resolver functions for your schema fields
const resolvers = {
    Mutation,
};

const schema = applyMiddleware(makeExecutableSchema({ typeDefs, resolvers }), sentryMiddleware);

const index = new ApolloServer({
    schema,
    introspection: true,
    playground: STAGE === 'dev',
    debug: STAGE === 'dev',
    formatError: (err) => {
        // Don't give the specific errors to the client.
        const code = err?.extensions?.code;
        if (code === 'unexpected') {
            return errorHelper.apolloError(errorHelper.ERRORS.rs_unexpected_error);
        }
        // Otherwise return the original error.  The error can also
        // be manipulated in other ways, so long as it's returned.
        return err;
    },
    context: ({ event, context }) => ({
        headers: event.headers,
        functionName: context.functionName,
        body: event.body,
        event,
        context,
        Sentry,
    }),
    uploads: false,
});

export const handler = index.createHandler({
    cors: {
        origin: '*',
        credentials: true,
    },
});
