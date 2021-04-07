import gql from 'graphql-tag';
import { ApolloClientType } from '../types';

export const GET_SUBSCRIPTIONS_BY_STUDENT_ID = gql`
    query GetSubscriptionsbyStudentId($studentId: uuid!) {
        student(id: $studentId) {
            id
            email
            firstName
            lastName
            dob
            genderType
            shopifyCustomerId
            parent {
                id
                email
                firstName
                lastName
                shopifyCustomerId
                role
                subscriptions_aggregate {
                    aggregate {
                        count
                    }
                }
            }
        }
    }
`;

export type SubscriptionsByStudentId = {
    student?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        dob: string;
        genderType: string;
        shopifyCustomerId?: string;
        parent?: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            shopifyCustomerId?: string;
            subscriptions_aggregate: {
                aggregate: {
                    count: number;
                };
            };
        };
    };
};

const byStudentId = async (
    client: ApolloClientType,
    studentId: string,
): Promise<SubscriptionsByStudentId | undefined> => {
    const { data } = await client.query<SubscriptionsByStudentId>({
        query: GET_SUBSCRIPTIONS_BY_STUDENT_ID,
        variables: {
            studentId,
        },
    });
    return data;
};

export default {
    byStudentId,
};
