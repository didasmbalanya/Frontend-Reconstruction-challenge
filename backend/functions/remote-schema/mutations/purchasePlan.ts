import { gql } from '@apollo/client/core';
import { StripeCustomer, UserRole } from '../../common/apollo/types';
import { withJwt } from '../../common/enhancers';
import error from '../../common/error';
import stripe from '../../common/stripe';

export interface Args {
    studentId: string;
    planId: string;
    promoCode?: string;
}

export interface GetPlanAndStudentResults {
    promoCodes: {
        id: string;
    }[];

    product: {
        id: string;
        prices: {
            id: string;
        }[];
    };
    student: {
        id: string;
        parentId: string;
        shopifyCustomerId?: string;
        subscription: {
            stripeSubscriptionId: string;
            cancelAt?: string;
        };
        stripe?: Pick<StripeCustomer, 'customerId'>;
        parent?: {
            id: string;
            shopifyCustomerId?: string;
            stripe?: Pick<StripeCustomer, 'customerId'>;
            subscriptions: {
                stripeSubscriptionId: string;
            }[];
        };
    };
}
export const GET_PLAN_AND_STUDENT = gql`
    query GetPlanAndStudent($studentId: uuid!, $planId: String!, $promoCode: String) {
        promoCodes: promo_codes(where: { code: { _eq: $promoCode } }) {
            id
        }
        product(id: $planId) {
            id
            prices(where: { active: { _eq: true } }) {
                id
            }
        }
        student(id: $studentId) {
            id
            stripe {
                customerId
            }
            subscription {
                stripeSubscriptionId
                cancelAt
            }
            shopifyCustomerId
            parentId: parent_id
            parent {
                id
                shopifyCustomerId
                stripe {
                    customerId
                }
                subscriptions(order_by: [{ createdAt: asc }]) {
                    stripeSubscriptionId
                }
            }
        }
    }
`;

const purchasePlan = withJwt<Args>(
    async (parent, { studentId, planId, promoCode }, ctx) => {
        const { data } = await ctx.apollo.query<GetPlanAndStudentResults>({
            query: GET_PLAN_AND_STUDENT,
            variables: {
                studentId,
                planId,
                promoCode: promoCode || '', // graphql treats _eq+null as ALL values (pre-1.4.0)
            },
        });

        if (!data) {
            throw error.apolloError(error.ERRORS.rs_unexpected_error);
        }
        const isParent = ctx.jwt.role === UserRole.PARENT;
        const { student, product, promoCodes } = data;
        if (!student || (isParent && student.parentId !== ctx.jwt.userId)) {
            throw error.apolloError(error.ERRORS.rs_missing_reference, 'student');
        }
        if (!product) {
            throw error.apolloError(error.ERRORS.rs_missing_reference, 'plan');
        }
        if (!product.prices.length) {
            throw error.apolloError(error.ERRORS.rs_unexpected_error, '(plan_price)');
        }
        const stripeInfo = isParent ? student.parent?.stripe : student.stripe;

        if (!stripeInfo) {
            throw error.apolloError(error.ERRORS.rs_no_stripe_account);
        }

        if (student.subscription) {
            throw error.apolloError(error.ERRORS.rs_already_subscribed);
        }

        // returns subscription id
        const subscriptionId = stripe.createOrAddSubscription({
            customerId: stripeInfo.customerId,
            stripePriceId: product.prices[0].id,
            client: ctx.apollo,
            student,
            promoCodeId: promoCodes[0]?.id,
        });

        //TODO : implement integration with shopify
        // it should include the following
        // 1. Creating a customer with shopify( a new `common` lib) if not already created reference
        // Profile.shopifyCustomerId
        // 2. If already created then omit shopify setup
        // 2a. If a student has a `parent` then `student.shopifyCustomerId` should remain null and should update the
        // parent.shopifyCustomerId entry in the db from the return customerId from your create shopify customer api
        // call
        // 2b. If student doesn't have a parent then `student.shopifyCustomerId` should be populated with the
        // customerId from create shopify customer api call
        // 3. Add 2 new test cases that covers #1 and #2
        return subscriptionId;
    },
    [UserRole.PARENT, UserRole.STUDENT],
);

export default purchasePlan;
