import { ApolloQueryResult, NetworkStatus } from "@apollo/client/core";

import { UserInputError } from "apollo-server-lambda";
import { Context } from "aws-lambda/handler";

import { AWSError, Request as AwsRequest } from "aws-sdk";
import { UserRole } from "./apollo/types";
import { buildContext, withApolloClient } from "./enhancers";
import error from "./error";
import {
    ActionHandler,
    ApolloClientType,
    AwsEventTypes,
    ExtendedContext,
    GraphQLArgs,
    GraphQLHandler,
    MockContextKeys,
    WithContextHandler
} from "./types";

import verifyExtractToken from "./utils/verify-extract-token";

jest.mock('./utils/verify-extract-token');

interface MockedExtendedContext extends Context {
    apollo: jest.Mocked<ApolloClientType>;
    secrets: Record<string, any>;

    [key: string]: any;
}
export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export const toAction = (input: any) => ({
    body: JSON.stringify({
        input,
    }),
});
export const currentContext = () => buildContext[MockContextKeys.CURRENT_CONTEXT] as MockedExtendedContext;

export const callHandler = async <TEvent extends AwsEventTypes = AwsEventTypes, TResult = any, T = any>(
    handler: ActionHandler<TEvent, TResult> | WithContextHandler<TEvent, TResult>,
    event: DeepPartial<TResult> | DeepPartial<TEvent>,
    configure?: (context: MockedExtendedContext) => MockedExtendedContext | void,
) => {
    buildContext[MockContextKeys.CONFIGURE] = configure;
    const response = await handler(event as TEvent, { headers: {} } as any);
    delete buildContext[MockContextKeys.CONFIGURE];
    const context = buildContext[MockContextKeys.CURRENT_CONTEXT] as MockedExtendedContext;
    const client = withApolloClient[MockContextKeys.CURRENT_APOLLO] as ApolloClientType;
    return { response: response as TResult, context, ctx: context, client };
};

export const callGraphHandler = async <TArgs = any, TResult = any>(
    handler: GraphQLHandler<TArgs, TResult>,
    args: TArgs,
    configure?: (context: MockedExtendedContext) => MockedExtendedContext | void,
) => {
    buildContext[MockContextKeys.CONFIGURE] = configure;
    const response = await handler(null, args as GraphQLArgs<TArgs>, { headers: {} } as any);
    delete buildContext[MockContextKeys.CONFIGURE];
    const context = buildContext[MockContextKeys.CURRENT_CONTEXT] as ExtendedContext;
    return { response: response as TResult, context, ctx: context };
};

type MockedApollo = jest.Mocked<ApolloClientType>;
export const callHook = async <TArgs = any, TResult = any | void>(
    handler: (...arg: Array<TArgs>) => TResult,
    args: TArgs | TArgs[],
    configure?: (apollo: MockedApollo) => void,
) => {
    withApolloClient[MockContextKeys.CONFIGURE] = configure;
    const params = Array.isArray(args) ? args : [args];
    const response = await handler(...params);
    delete withApolloClient[MockContextKeys.CONFIGURE];
    const apollo = withApolloClient[MockContextKeys.CURRENT_APOLLO] as ApolloClientType;
    return { response, apollo };
};

export const queryResult = <T = any>(data: T = {} as T): ApolloQueryResult<T> => ({
    data,
    loading: false,
    networkStatus: NetworkStatus.ready,
});

type ThenArg<T> = T extends PromiseLike<infer U> ? Promise<DeepPartial<U>> : DeepPartial<T>;
type MockedFunction<T extends (...args: any) => any> = jest.MockInstance<ThenArg<ReturnType<T>>, jest.ArgsType<T>>;
type Mocked<T> = {
    [P in keyof T]: T[P] extends (...args: any[]) => any
        ? MockedFunction<T[P]>
        : T[P] extends jest.Constructable
        ? jest.MockedClass<T[P]>
        : T[P];
} &
    T;

export type OfGraphArgs<T extends GraphQLHandler> = jest.ArgsType<T>[1];

export const mocked = <T = any>(fn: any): jest.Mock => fn as jest.Mock<T>;
export const makeMock = <T = any>(object: T) => object as Mocked<T>;
export const mockedFn = <T extends (...args: any) => any>(fn: T): MockedFunction<T> => (fn as any) as MockedFunction<T>;

export const newApolloMock = () => makeMock<ApolloClientType>({ mutate: jest.fn(), query: jest.fn() } as any);
export const verifyExtractedTokenMock = verifyExtractToken as jest.MockedFunction<typeof verifyExtractToken>;
export const { ERRORS } = error;
export const { apolloError, errorMessage } = error;
export const toError = (id, ...args) => {
    return error.errorMessage(id, ...args);
};

type AbstractFunction<T = any> = (...args: any) => T;
type AwsServiceMethod = AbstractFunction<AwsRequest<any, AWSError>>;
type AwsMethodReturnType<T extends AwsServiceMethod> = ReturnType<T> extends AwsRequest<infer R, any>
    ? DeepPartial<R> | AWSError
    : DeepPartial<ReturnType<T>>;
export const awsMock = <T extends AwsServiceMethod>(fn: T, value?: AwsMethodReturnType<T> | AWSError) => {
    mocked(fn).mockReturnValueOnce({
        promise() {
            if (!value) {
                return Promise.resolve();
            }
            return value instanceof Error ? Promise.reject(value) : Promise.resolve(value);
        },
    });
};

export const expectActionResponse = async (v: any, object: any) => {
    let response = v;
    if (v instanceof Promise) {
        response = (await v).response;
    }
    const body = object instanceof UserInputError ? { message: object.message, code: object.code } : object;
    expect(response).toEqual({
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
        statusCode: object instanceof UserInputError ? 400 : 200,
    });
};

const invokeJwtTest = async <THandler, TArgs = any, TResult = any>(
    handler: () => any,

    allowedRoles: UserRole[],
) => {
    const roles = Object.values(UserRole) as UserRole[];
    for (const currentRole of roles.filter((role) => !allowedRoles.includes(role as UserRole))) {
        verifyExtractedTokenMock.mockResolvedValueOnce({
            role: currentRole,
            userId: '10',
        });
        // eslint-disable-next-line no-await-in-loop
        await expect(handler()).rejects.toEqual(error.apolloError(error.ERRORS.rs_invalid_token_permission));
    }
};

export const testJwtAction = async <TEvent extends AwsEventTypes = AwsEventTypes, TResult = any>(
    handler: ActionHandler<TEvent, TResult> | WithContextHandler<TEvent, TResult>,
    event: Partial<TResult>,
    allowedRoles: UserRole[],
) => {
    await invokeJwtTest(() => callHandler(handler, event), allowedRoles);
};

export const testJwt = async <TArgs = any, TResult = any>(
    handler: GraphQLHandler<TArgs, TResult>,
    args: TArgs,
    allowedRoles: UserRole[],
) => {
    await invokeJwtTest(() => callGraphHandler(handler, args), allowedRoles);
};

export const randomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const mockQuery = <T>(ctx: MockedExtendedContext, data: DeepPartial<T>) => {
    ctx.apollo.query.mockResolvedValueOnce({
        data,
    } as any);
};
