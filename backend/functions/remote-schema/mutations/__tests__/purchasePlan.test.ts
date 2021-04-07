import { UserRole } from '../../../common/apollo/types';
import stripe from '../../../common/stripe';
import { callGraphHandler, verifyExtractedTokenMock, makeMock as mm, randomString } from '../../../common/test-helpers';
import purchasePlan, { Args } from '../purchasePlan';
import apollo from '../../../common/apollo';

// NOTE: This is how you tell jest to mock a js file, do the same for your shopify common lib
jest.mock('../../../common/stripe');
jest.mock('../../../common/apollo');

describe('remote-schema/mutations/purchasePlan', () => {
    const userId = 'some-id';
    const planId = 'planId';
    const subscriptionId = 'subscriptionId';
    const args: Args = {
        planId,
        studentId: userId,
    };
    const shopifyCustomerId = randomString(10);
    beforeEach(() => {
        verifyExtractedTokenMock.mockResolvedValue({
            role: UserRole.STUDENT,
            userId,
        });
        // NOTE : This is how you would mock your shopify common lib.. wrap the exported default object with
        // `mm(...)` mock out your functions with the expected response. This can be done beforeEach function or
        // you can mock out the response in the individual test it self
        mm(stripe).createOrAddSubscription.mockResolvedValueOnce(subscriptionId);
    });

    // NOTE: you can use this test case to setup you other 2 test cases
    it('should create a shopify customer and add it to the shopify `subscribed` list (parent)', async () => {
        verifyExtractedTokenMock.mockResolvedValueOnce({
            role: UserRole.PARENT,
            userId,
        });

        const data = {
            promoCodes: [],
            student: {
                id: 'studentId',
                parentId: userId,
                parent: {
                    stripe: {
                        customerId: 'customerId',
                    },
                },
            },
            product: {
                prices: [{ id: 'price-id' }],
            },
        };

        const { context, response } = await callGraphHandler(purchasePlan, args, (ctx) => {
            ctx.apollo.query.mockResolvedValueOnce({
                data,
            } as any);
        });
        expect(response).toEqual(subscriptionId);
        expect(stripe.createOrAddSubscription).toBeCalledWith({
            customerId: data.student.parent.stripe.customerId,
            stripePriceId: data.product.prices[0].id,
            client: context.apollo,
            student: data.student,
        });

        expect(apollo.users.update).toBeCalledWith(
            context.apollo,
            userId,
            expect.objectContaining({
                shopifyCustomerId,
            }),
        );
    });

    it('should create a shopify customer and add it to the shopify `subscribed` list (student)', async () => {
        verifyExtractedTokenMock.mockResolvedValueOnce({
            role: UserRole.STUDENT,
            userId,
        });

        const data = {
            promoCodes: [],
            student: {
                id: 'studentId',
                parentId: userId,
                stripe: {
                    customerId: 'customerId',
                },
            },
            product: {
                prices: [{ id: 'price-id' }],
            },
        };

        const { context, response } = await callGraphHandler(purchasePlan, args, (ctx) => {
            ctx.apollo.query.mockResolvedValueOnce({
                data,
            } as any);
        });
        expect(response).toEqual(subscriptionId);
        expect(stripe.createOrAddSubscription).toBeCalledWith({
            customerId: data.student.stripe.customerId,
            stripePriceId: data.product.prices[0].id,
            client: context.apollo,
            student: data.student,
        });

        expect(apollo.students.update).toBeCalledWith(
            context.apollo,
            userId,
            expect.objectContaining({
                shopifyCustomerId,
            }),
        );
    });
});
