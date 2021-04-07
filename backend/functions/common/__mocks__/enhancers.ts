import { APIGatewayProxyEvent } from 'aws-lambda';
import { UserRole } from '../apollo/types';
import error from '../error';
import { DEFAULT_CONTEXT_CONFIG, MockContextKeys } from '../types';
import * as response from '../utils/response';
import verifyExtractToken from '../utils/verify-extract-token';

type Jwt = {
    userId: string;
    role: UserRole;
};
type TokenFunction = (token?: string) => Jwt;

export const buildContext = jest.fn().mockImplementation(async (context: any, config: any) => {
    let newContext = {
        ...context,
        apollo: {
            query: jest.fn().mockResolvedValue({ data: {} }),
            mutate: jest.fn().mockResolvedValue({ data: {} }),
        },
    };
    if (buildContext[MockContextKeys.CONFIGURE]) {
        newContext = buildContext[MockContextKeys.CONFIGURE](newContext) || newContext;
    }
    buildContext[MockContextKeys.CURRENT_CONTEXT] = newContext;
    return newContext;
});

export const withContext = jest.fn().mockImplementation((handler: any, config: any = DEFAULT_CONTEXT_CONFIG) => {
    return async (event: any, context: any, callback: any) => {
        const newContext = await buildContext(context, config);
        return handler(event, newContext, callback);
    };
});

export const withJwtAction = jest
    .fn()
    .mockImplementation((handler: any, roles: UserRole[], config: any = DEFAULT_CONTEXT_CONFIG) => {
        return async (event: APIGatewayProxyEvent, context: any) => {
            const token = event.headers?.authorization?.replace('Bearer', '').trim();
            const { input: args } = JSON.parse(event.body!);
            const newContext = await buildContext(context, config);

            if (!newContext.jwt) {
                newContext.jwt = await verifyExtractToken(token);
            }
            if (!roles.includes(newContext.jwt.role)) {
                error.apolloThrow(error.ERRORS.rs_invalid_token_permission);
            }
            return handler(args, newContext).catch((e) => {
                if (!['UserInputError', 'LogicError'].includes(e.name)) {
                    return response.error(e);
                }
                return response.error(e);
            });
        };
    });

export const withJwt = jest
    .fn()
    .mockImplementation((handler: any, roles: UserRole[], config: any = DEFAULT_CONTEXT_CONFIG) => {
        return async (parent, args: any, context: any) => {
            const token = context.headers?.authorization?.replace('Bearer', '').trim();

            const newContext = await buildContext(context, config);
            newContext.jwt = await verifyExtractToken(token);
            if (!roles.includes(newContext.jwt.role)) {
                error.apolloThrow(error.ERRORS.rs_invalid_token_permission);
            }
            return handler(parent, args, newContext);
        };
    });
export const withApolloClient = jest.fn().mockImplementation(() => {
    const apollo = {
        query: jest.fn().mockResolvedValue({ data: {} }),
        mutate: jest.fn().mockResolvedValue({ data: {} }),
    };

    if (withApolloClient[MockContextKeys.CONFIGURE]) {
        withApolloClient[MockContextKeys.CONFIGURE](apollo);
    }
    withApolloClient[MockContextKeys.CURRENT_APOLLO] = apollo;
    return apollo;
});
export default {
    withContext,
    withJwtAction,
    withJwt,
    withApolloClient,
};
