import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import subscriptions from './subscriptions';
import users from './users';
import students from './students';

import { fetch } from 'cross-fetch';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createApolloClient = ({ uri, token }): ApolloClient<NormalizedCacheObject> => {
    const httpLink = new HttpLink({
        uri,
        fetch,
        headers: {
            'x-hasura-admin-secret': token,
        },
    });
    return new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),

        defaultOptions: {
            query: {
                fetchPolicy: 'no-cache',
            },
            mutate: {
                fetchPolicy: 'no-cache',
            },
        },
    });
};
export default {
    subscriptions,
    users,
    students,
};
