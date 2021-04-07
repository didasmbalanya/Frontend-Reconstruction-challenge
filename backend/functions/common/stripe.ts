import { ApolloClientType } from './types';

export interface CreateOrAddSubscriptionArgs {
    customerId: string;
    stripePriceId: string;
    paymentMethodId?: string;
    client: ApolloClientType;
    promoCodeId?: string;
    student: {
        id: string;
        subscription?: {
            stripeSubscriptionId: string;
        };
        parent?: {
            id: string;
            subscriptions: {
                stripeSubscriptionId: string;
            }[];
        };
    };
}

const createOrAddSubscription = async ({
    customerId,
    stripePriceId,
    paymentMethodId,
    client,
    student,
    promoCodeId,
}: CreateOrAddSubscriptionArgs) => {
    return 'subscription_id';
};

export default {
    createOrAddSubscription,
};
