import { APIGatewayEvent } from 'aws-lambda';
import withSentry from 'serverless-sentry-lib';
import { getSecrets } from '../common/enhancers';

import { SubscriptionRow } from './rows';

import { onSubscriptionUpdated } from './subscriptions';

type HookInvocations = Promise<any>[];
const collect = <T = any>(handler: (hooks: HookInvocations, updated: T, old: T) => void) => {
    return (updated: T, old: T) => {
        const hooks: HookInvocations = [];
        handler(hooks, updated, old);
        return Promise.all(hooks);
    };
};

const triggersHandle = {
    INSERT: {},
    UPDATE: {
        subscriptions: collect<SubscriptionRow>((hooks, inserted, old) => {
            hooks.push(onSubscriptionUpdated(inserted, old));
        }),
    },
    DELETE: {},
};

let secrets: Record<string, any> | undefined;
export const handler = withSentry(async (args: APIGatewayEvent) => {
    const secretName = process.env.HASURA_HOOKS_SECRET_NAME;
    if (!secretName) {
        return {
            statusCode: 400,
            body: 'Invalid configuration',
        };
    }
    if (!secrets) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        secrets = await getSecrets([secretName]);
    }
    if (!secrets) {
        return {
            statusCode: 400,
            body: 'Invalid configuration',
        };
    }
    if (!args.body) {
        return {
            statusCode: 400,
            body: 'Invalid Request',
        };
    }
    const authorization = args.headers.authorization?.replace('Bearer', '').trim();

    if (authorization !== secrets[secretName]) {
        return {
            statusCode: 403,
            body: 'Not Authorized',
        };
    }
    const body = JSON.parse(args.body);
    const {
        event: {
            op,
            data: { old: oldData, new: newData },
        },
        table,
    } = body;

    if (triggersHandle[op] && triggersHandle[op][table.name]) {
        return triggersHandle[op][table.name](newData, oldData)
            .then(() => {
                return {
                    statusCode: 200,
                    body: 'success',
                };
            })
            .catch((error) => {
                console.log('error', error);
                return {
                    statusCode: 404,
                    body: error,
                };
            });
    }
    return {
        statusCode: 404,
        body: 'No trigger associated',
    };
});
