import apollo from '../../common/apollo';

import { User } from '../../common/apollo/types';
import { withApolloClient } from '../../common/enhancers';
import newLogger from '../../common/newLogger';

import { SubscriptionRow } from '../rows';

const logger = newLogger('subscriptions/onSubscriptionDeleted');

export const onSubscriptionUpdated = async (updated: SubscriptionRow, old: SubscriptionRow) => {
    const client = await withApolloClient();
    const subscriptions = await apollo.subscriptions.byStudentId(client, updated.student_id);

    logger.info("Subscription's student data retrieved: ", subscriptions);

    if (!subscriptions || !subscriptions.student) {
        logger.error("Subscription's student data not found");
        return false;
    }

    const user = (subscriptions.student.parent || subscriptions.student) as User;

    return true;
};
