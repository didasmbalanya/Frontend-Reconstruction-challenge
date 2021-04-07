import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';
import * as Sentry from '@sentry/node';
import {
    ALBHandler,
    APIGatewayEvent,
    APIGatewayProxyEvent,
    APIGatewayProxyHandler,
    APIGatewayProxyResult,
    CognitoUserPoolTriggerEvent,
    Handler,
    SQSEvent,
    SQSHandler,
} from 'aws-lambda';
import { Callback, Context } from 'aws-lambda/handler';
import { UserRole } from './apollo/types';

export const DEFAULT_CONTEXT_CONFIG = {
    params: [],
    secrets: ['HASURA_ADMIN_SECRET'],
};

export type HandlerType = SQSHandler | ALBHandler | APIGatewayProxyHandler;

export type ApolloClientType = ApolloClient<NormalizedCacheObject>;

export interface ExtendedContext extends Context {
    apollo: ApolloClientType;
    secrets: Record<string, any>;
    sentry: typeof Sentry;

    [key: string]: any;
}

export type AwsEventTypes = APIGatewayProxyEvent | APIGatewayEvent | SQSEvent | CognitoUserPoolTriggerEvent;

export type WithContextHandler<TEvent extends AwsEventTypes = AwsEventTypes, TResult = any> = (
    event: TEvent,
    context: ExtendedContext,
    callback?: Callback<TResult>,
) => void | Promise<TResult>;

export type JwtActionHandler<TArgs = any> =
    | Handler<APIGatewayProxyEvent, APIGatewayProxyResult>
    | (Handler<APIGatewayProxyEvent, APIGatewayProxyResult> & { body: { input: TArgs } });

export type GraphQLHandler<TArgs = any, TResult = any> = (
    parent: any,
    args: GraphQLArgs<TArgs>,
    context: GraphQLContext,
) => Promise<TResult>;

export type ActionHandler<TArgs = any, TResult = any> = (
    args: GraphQLArgs<TArgs>,
    context: GraphQLContext,
    callback?: Callback<TResult>,
) => Promise<TResult>;

export enum MockContextKeys {
    CONFIGURE = '_configure',
    CURRENT_CONTEXT = '_currentContext',
    CURRENT_APOLLO = '_currentApollo',
}

export type GraphQLArgs<T> = {
    [P in keyof T]: T[P];
};

interface DecodedJwt {
    userId: string;
    role: UserRole;
}

export interface GraphQLContext extends ExtendedContext {
    jwt: DecodedJwt;
    apollo: ApolloClientType;
    headers: {
        authorization?: string;
    } & Record<string, any>;
}
