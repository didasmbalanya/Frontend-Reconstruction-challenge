import * as Sentry from '@sentry/node';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import AWS from 'aws-sdk';
import { Parameter } from 'aws-sdk/clients/ssm';
import * as process from 'process';
import withSentry from 'serverless-sentry-lib';
import { createApolloClient } from './apollo';
import { UserRole } from './apollo/types';
import error from './error';
import {
    ActionHandler,
    ApolloClientType,
    AwsEventTypes,
    DEFAULT_CONTEXT_CONFIG,
    ExtendedContext,
    GraphQLArgs,
    GraphQLContext,
    GraphQLHandler,
    JwtActionHandler,
    WithContextHandler,
} from './types';
import * as response from './utils/response';
import verifyExtractToken from './utils/verify-extract-token';

const ssm = new AWS.SSM();

interface Secrets extends Record<string, any> {
    HASURA_ADMIN_SECRET: string | undefined;
}

let apollo: ApolloClientType;
const { SERVICE_NAME, STAGE } = process.env;

const secretsManager = new AWS.SecretsManager();

let secrets: Secrets = {
    HASURA_ADMIN_SECRET: process.env.HASURA_GRAPHQL_ADMIN_SECRET,
};
const mask = `/${SERVICE_NAME}/${STAGE}/`;
export const getSecrets = async (SecretIds: string[], strip = false): Promise<Record<string, any>> => {
    if (SecretIds.length === 0) {
        return {};
    }

    const promises = SecretIds.map((SecretId) => secretsManager.getSecretValue({ SecretId }).promise());

    const data = await Promise.all(promises);

    const values = data?.reduce((acc: Record<string, string>, param: AWS.SecretsManager.GetSecretValueResponse) => {
        if (param.Name) {
            const name = strip ? param.Name.replace(mask, '') : param.Name;
            acc[name] = param.SecretString!;
        }

        return acc;
    }, {});

    return values ?? {};
};
export const getParameters = async (names: string[]) => {
    const res = await ssm
        .getParameters({
            Names: names.map((name) => `${mask}${name}`),
            WithDecryption: true,
        })
        .promise();

    return (
        res?.Parameters?.reduce((accumulator: Record<string, any>, p: Parameter) => {
            const name = p.Name?.replace(mask, '');
            if (name && !accumulator[name] && p.Value) {
                accumulator[name] = p.Value;
            }
            return accumulator;
        }, {}) ?? {}
    );
};
export const buildContext = async <TContext extends Record<string, any> = any>(
    context: TContext,
    config = DEFAULT_CONTEXT_CONFIG,
) => {
    if (config.params.length) {
        secrets = (await getParameters(config.params)) as Secrets;
    }

    if (!apollo) {
        if (!secrets.HASURA_ADMIN_SECRET) {
            const s = await getSecrets([`${mask}HASURA_ADMIN_SECRET`], true);
            secrets = {
                ...secrets,
                ...s,
            };
        }
        apollo = createApolloClient({
            uri: process.env.GRAPHQL_API_ENDPOINT,
            token: secrets.HASURA_ADMIN_SECRET,
        });
    }
    const updatedContext: ExtendedContext & TContext = {
        ...context,
        secrets,
        apollo,
        sentry: Sentry,
    } as any;
    return updatedContext;
};

export const withApolloClient = async () => {
    const context = await buildContext({});
    return context.apollo;
};
export const withContext = <TEvent extends AwsEventTypes = AwsEventTypes, TResult = never>(
    handler: WithContextHandler<TEvent, TResult>,
    config = DEFAULT_CONTEXT_CONFIG,
): Handler<TEvent, TResult> => {
    return async (event: TEvent, context, callback): Promise<TResult> => {
        const extendedContext = await buildContext(context, config);

        const results = handler(event, extendedContext, callback) as any;
        return results as TResult;
    };
};

interface ActionRequestBody<T> {
    session_variables: Record<string, any>;
    input: T;
}
const handleError = (e) => {
    if (e.message.includes('ssl3_get_record')) {
        return false;
    }
    return e.name === 'UserInputError' || e.code === 'data-exception';
};
export const withJwtAction = <TArgs = any>(
    handler: ActionHandler<TArgs, APIGatewayProxyResult>,
    roles: UserRole[],
    config = DEFAULT_CONTEXT_CONFIG,
): JwtActionHandler<TArgs> => {
    return withSentry(
        async (event: APIGatewayProxyEvent, context): Promise<APIGatewayProxyResult> => {
            const { session_variables: session, input: args }: ActionRequestBody<TArgs> = JSON.parse(event.body!);
            const token = event.headers.authorization?.replace('Bearer', '').trim();
            const newContext = (await buildContext(context, config)) as GraphQLContext;
            newContext.jwt = await verifyExtractToken(token);

            return handler(args, newContext).catch((e) => {
                console.log('withJwtAction->catch', e.code, e);
                console.log(JSON.stringify(e, null, 2));
                if (handleError(e)) {
                    if (e.originalError) {
                        Sentry.captureException(e.originalError);
                    }
                    return response.error(e);
                }

                Sentry.captureException(e);
                return response.error(new Error('An Unexpected error has occurred.'));
            });

            //
        },
    );
};

export const withJwt = <TArgs = any, TResult = any>(
    handler: GraphQLHandler<TArgs, TResult>,
    roles: UserRole[],
    config = DEFAULT_CONTEXT_CONFIG,
): GraphQLHandler<TArgs, TResult> => {
    return async (parent: any, args: GraphQLArgs<TArgs>, context): Promise<TResult> => {
        const token = context.headers.authorization?.replace('Bearer', '').trim();
        const newContext = (await buildContext(context, config)) as GraphQLContext;

        newContext.jwt = await verifyExtractToken(token);
        if (!roles.includes(newContext.jwt.role)) {
            error.apolloThrow(error.ERRORS.rs_invalid_token_permission);
        }

        return handler(parent, args, newContext);
        //
    };
};
