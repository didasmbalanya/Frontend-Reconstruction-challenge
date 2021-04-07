import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { UserRole } from '../apollo/types';

const COGNITO_JWKS: string = process.env.COGNITO_JWKS!;

export default async (token: string | undefined) => {
    if (!COGNITO_JWKS) {
        throw new Error('JWKS not provided');
    }
    if (!token) {
        return {
            role: UserRole.ANONYMOUS,
            userId: undefined,
        };
    }

    const decoded: any = jwt.decode(token, { complete: true });

    const jwks = JSON.parse(COGNITO_JWKS);

    const jwk = jwks.keys.find((key: any) => key.kid === decoded.header.kid);

    if (!jwk) {
        throw new Error('Invalid kid');
    }

    const pem = jwkToPem(jwk);

    jwt.verify(token, pem, { algorithms: ['RS256'] });

    return {
        userId: decoded.payload.sub,
        role: decoded.payload['custom:role'] as UserRole,
    };
};
