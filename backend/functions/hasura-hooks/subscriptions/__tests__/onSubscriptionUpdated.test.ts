import { SubscriptionsByStudentId } from '../../../common/apollo/subscriptions';
import { SubscriptionStatus } from '../../../common/apollo/types';
import { callHook, DeepPartial, randomString } from '../../../common/test-helpers';

import { onSubscriptionUpdated } from '../onSubscriptionUpdated';

const rs = () => randomString(10);
type SubscriptionStudent = DeepPartial<NonNullable<SubscriptionsByStudentId['student']>>;
describe('hooks/subscriptions/onSubscriptionUpdated', () => {
    const current = {
        id: randomString(10),
        student_id: randomString(10),
        parent_id: randomString(10),
        status: SubscriptionStatus.ACTIVE,
    };
    const old = {
        ...current,
        status: SubscriptionStatus.CANCELED,
    };

    const student = {
        id: current.student_id,
        email: rs(),
        firstName: rs(),
        lastName: rs(),
    } as SubscriptionStudent;

    const DATA = {
        student,
    };

    it('should return false if no subscription or student found', async () => {
        const { response } = await callHook(onSubscriptionUpdated, [current, old]);
        expect(response).toBeFalsy();
    });

    it('should remove parent from shopify `subscribed users` list', async () => {
        student.parent = {
            id: rs(),
            shopifyCustomerId: rs(),
        };
        const { response } = await callHook(onSubscriptionUpdated, [current, old], (apollo) => {
            apollo.query.mockResolvedValueOnce({
                data: DATA,
            } as any);
        });

        expect(response).toBeTruthy();
    });

    it('should remove student from shopify `subscribed users` list', async () => {
        student.shopifyCustomerId = rs();
        const { response } = await callHook(onSubscriptionUpdated, [current, old], (apollo) => {
            apollo.query.mockResolvedValueOnce({
                data: DATA,
            } as any);
        });

        expect(response).toBeTruthy();
    });

    it('should return false if subscription status has not changed', async () => {
        old.status = current.status;
        const { response } = await callHook(onSubscriptionUpdated, [current, old], (apollo) => {
            apollo.query.mockResolvedValueOnce({
                data: DATA,
            } as any);
        });
        expect(response).toBeFalsy();
    });
});
