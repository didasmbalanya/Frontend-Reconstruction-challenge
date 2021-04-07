import { UserInputError, ApolloError } from 'apollo-server-lambda';
import { throwable } from 'ts-throwable';
import { format } from 'util';

const ERRORS = {
    rs_account_dont_exists: 'rs_account_dont_exists',
    rs_account_already_exists: 'rs_account_already_exists',
    rs_account_disabled: 'rs_account_disabled',
    rs_token_expired: 'rs_token_expired',
    rs_password_used: 'rs_password_used',
    rs_invalid_token_permission: 'rs_invalid_token_permission',
    rs_invalid_email: 'rs_invalid_email',
    rs_invalid_operation: 'rs_invalid_operation',
    rs_missing_reference: 'rs_missing_reference',
    rs_unable_to_create: 'rs_unable_to_create',
    rs_unable_to_delete: 'rs_unable_to_delete',
    rs_schedule_overlaps: 'rs_schedule_overlaps',
    rs_unable_to_update: 'rs_unable_to_update',
    rs_no_seats_available: 'rs_no_seats_available',
    rs_enrollment_disabled: 'rs_enrollment_disabled',
    rs_already_enrolled: 'rs_already_enrolled',
    rs_enroll_verification_failed: 'rs_enroll_verification_failed',

    rs_invalid_request: 'rs_invalid_request',
    rs_unable_to_enroll: 'rs_unable_to_enroll',
    rs_no_zoom_linked: 'rs_no_zoom_linked',
    rs_missing_argument: 'rs_missing_argument',
    rs_validation_failed: 'rs_validation_failed',
    rs_invalid_user_create_permission: 'rs_invalid_user_create_permission',
    rs_user_signup_failed: 'rs_user_signup_failed',
    rs_invalid_value: 'rs_invalid_value',
    rs_invalid_password: 'rs_invalid_password',
    rs_not_allowed_to_change_email: 'rs_not_allowed_to_change_email',
    rs_unable_to_change_email: 'rs_unable_to_change_email',
    rs_invalid_age: 'rs_invalid_age',
    rs_unexpected_error: 'rs_unexpected_error',
    rs_no_stripe_account: 'rs_no_stripe_account',
    rs_stripe_payment: 'rs_stripe_payment',
    rs_stripe_subscription: 'rs_stripe_subscription',
    rs_invalid_coupon: 'rs_invalid_coupon',
    rs_already_subscribed: 'rs_already_subscribed',
    rs_subscribed_enrollment_failed: 'rs_subscribed_enrollment_failed',
    rs_subscription_not_active: 'rs_subscription_not_active',
    rs_no_pending_invoices: 'rs_no_pending_invoices',
    rs_retry_payment_failed: 'rs_retry_payment_failed',
    rs_subscription_scheduled_cancel: 'rs_subscription_scheduled_cancel',
    rs_unexpected_error_code: 'rs_unexpected_error_code',
};

type StringValueOf<T> = T[keyof T] & string;
type ErrorMap<T extends string[]> = Record<StringValueOf<T>, string>;
const errorMap = <T extends string[]>(keys: T): ErrorMap<T> => {
    return keys.reduce((acc, key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        acc[key] = key;
        return acc;
    }, {}) as ErrorMap<T>;
};

const ERRORS_MESSAGE = {
    [ERRORS.rs_account_dont_exists]: () => "Account doesn't exists",
    [ERRORS.rs_token_expired]: () => 'Authorization token expired',
    [ERRORS.rs_password_used]: () => 'You cannot reuse an old password',
    [ERRORS.rs_invalid_token_permission]: () => "You don't have permission to execute this action.",
    [ERRORS.rs_account_already_exists]: (email) => `An account with email ${email} already exists`,
    [ERRORS.rs_missing_reference]: (ref) => `Unable to validate ${ref}  existence`,
    [ERRORS.rs_unable_to_create]: (name) => `There was an error in trying to create a new ${name} object.`,
    [ERRORS.rs_unable_to_delete]: () => `There was an error in trying to delete.`,
    [ERRORS.rs_schedule_overlaps]: () => 'Unable to change schedule as it overlaps a meeting',
    [ERRORS.rs_no_seats_available]: () => 'Sorry, but all seats are taken.',
    [ERRORS.rs_invalid_operation]: (extra = '') => `${extra}`.trim(),
    [ERRORS.rs_enroll_verification_failed]: (message) => message,
    [ERRORS.rs_already_enrolled]: () =>
        'It looks like you have already enrolled into this class. Check your schedule to view details about this' +
        ' class.',
    [ERRORS.rs_invalid_request]: (msg = '') => `Invalid Request ${msg.length ? msg : ''}`,
    [ERRORS.rs_unable_to_enroll]: () =>
        'There was a problem registering this student to this class. Please contact support for assistance.',
    [ERRORS.rs_no_zoom_linked]: (instructor) => `${instructor.firstName} does not have their zoom account linked!`,
    [ERRORS.rs_enrollment_disabled]: () => 'Sorry but enrollment is currently disabled for this course.',
    [ERRORS.rs_invalid_email]: () => 'Invalid email',
    [ERRORS.rs_missing_argument]: (name) => `Missing value for ${name}`,
    [ERRORS.rs_validation_failed]: (name) => `Incorrect value for ${name}, please try again.`,
    [ERRORS.rs_user_signup_failed]: (message) => message,
    [ERRORS.rs_invalid_user_create_permission]: () => 'You are not allowed to create this user type.',
    [ERRORS.rs_invalid_password]: (message) => message,
    [ERRORS.rs_not_allowed_to_change_email]: () => 'You are not allowed to change your email.',
    [ERRORS.rs_unable_to_change_email]: (message) => message,
    [ERRORS.rs_invalid_password]: (message) => message,
    [ERRORS.rs_invalid_age]: () =>
        'Age does not meet requirements for an account. Students under 13 years old should be added to their parent/guardian’s account.',
    [ERRORS.rs_unexpected_error]: (message = '') =>
        `An unexpected error occurred. Please try again or contact support if issue persists. ${message}`,
    [ERRORS.rs_no_stripe_account]: () =>
        'Sorry, but you must link an credit card to your account. Please navigate to' +
        ' your account settings to add one.',
    [ERRORS.rs_stripe_payment]: (code) =>
        `An issue occurred when processing your payment method. Please try again or contact support for assistance (${
            code || 'unknown'
        }). `,
    [ERRORS.rs_stripe_payment]: (code) =>
        `An issue occurred when processing purchasing your subscription. Please try again or contact support for assistance (${
            code || 'unknown'
        }). `,
    [ERRORS.rs_unexpected_error_code]: (code) =>
        `An issue occurred when processing your request. Please try again or contact support for assistance (${
            code || 'unknown'
        }). `,
    [ERRORS.rs_invalid_coupon]: (id) => `This coupon is invalid or has expired.(${id})`,
    [ERRORS.rs_already_subscribed]: () => `This user is already subscribed to Reconstruction.`,
    [ERRORS.rs_subscribed_enrollment_failed]: () =>
        'Your subscription was successful, but we were unable to enroll you in this cohort. Please try again soon. If the issue persists, please contact our support team',
    [ERRORS.rs_subscription_not_active]: () =>
        'Sorry, your subscription has been suspended due to issues with your payment method. Please update your' +
        ' payment method on your Account Info section to resume your subscription or deactivate it. If this issue persists, please contact our support team.',
    [ERRORS.rs_no_pending_invoices]: () =>
        'Sorry, it looks like you have no pending invoices that need to be paid at this time.',
    [ERRORS.rs_retry_payment_failed]: () =>
        `Sorry, an unexpected error occurred while trying to update one or more of your pending subscriptions. Please contact support for assistance if this issue persists.`,
    [ERRORS.rs_subscription_scheduled_cancel]: () =>
        'Sorry, but this subscription has already been set to be cancelled at end of the current period.',
};
export const LOGIC_ERRORS = {
    l_user_attributes: 'logic_user_attributes',
    l_assign_cognito_id: 'l_assign_cognito_id',
    l_provider_no_school: 'l_provider_no_school',
    l_cognito_create_failed: 'l_cognito_create_failed',
    l_missing_reference: 'l_missing_reference',
    l_define_auth_challenge_failed: 'l_define_auth_challenge_failed',
    l_create_challenge_failed: 'l_create_challenge_failed',
    l_verify_auth_challenge_failed: 'l_verify_auth_challenge_failed',
};

const LOGIC_MESSAGE = {
    [LOGIC_ERRORS.l_missing_reference]: (ref) => `Unable to validate ${ref}  existence`,
    [LOGIC_ERRORS.l_user_attributes]: (user, identities) => {
        return `Unable to parse user \`identities\`  User = ${user.id} Identities=${identities}`;
    },
    [LOGIC_ERRORS.l_assign_cognito_id]: (user, cognitoId) => {
        return `Unable to assign cognito id for ${user.id} with new ID = ${cognitoId}`;
    },
    [LOGIC_ERRORS.l_provider_no_school]: (identity) => {
        return format('There is no school setup in the db for %j', identity);
    },
    [LOGIC_ERRORS.l_cognito_create_failed]: () => 'Unable auth student',
    [LOGIC_ERRORS.l_define_auth_challenge_failed]: () => 'Unable to define auth challenge',
    [LOGIC_ERRORS.l_create_challenge_failed]: () => 'Unable to create auth challenge',
    [LOGIC_ERRORS.l_verify_auth_challenge_failed]: () => 'Unable to verify auth challenge answer',
};

const errorMessage = (errorId: string, ...arguments_: any) => {
    let handler: any = () => errorId;
    if (ERRORS_MESSAGE[errorId]) {
        handler = ERRORS_MESSAGE[errorId];
    } else if (LOGIC_MESSAGE[errorId]) {
        handler = LOGIC_MESSAGE[errorId];
    }
    return handler(...arguments_);
};
const apolloError = (errorId: string, ...arguments_: any) => {
    const message = errorMessage(errorId, ...arguments_);
    return new UserInputError(message, {
        code: errorId,
        validationErrors: { [errorId]: message },
    });
};

const apolloThrow = (errorId: string, ...arguments_: any): throwable<UserInputError> => {
    throw apolloError(errorId, ...arguments_);
};

export class LogicError extends ApolloError {
    constructor(message: string, errorId: string, extensions?: Record<string, any>) {
        super(message, errorId, extensions);

        Object.defineProperty(this, 'name', { value: 'UserInputError' });
    }
}
const TAG = '@ext';

type TrackedError = string | { id: string; meta: Record<string, any> };

const logicError = (error: TrackedError, ...arguments_: any) => {
    let extensions: Record<string, any> = {};
    let errorId;
    if (typeof error === 'object') {
        errorId = error.id;
        extensions = error.meta;
    } else {
        errorId = error as string;
    }

    const message = errorMessage(errorId, ...arguments_);
    return new LogicError(message, errorId, {
        ...extensions,
        code: errorId,
    });
};

/*
const captureError = (error: any, extra = {}) => {
    if (typeof error instanceof apollo.UserInputError) {
        return {
            code: Object.keys(error.validationErrors)[0],
            message: error.message,
            ...extra,
        };
    }

    return {
        code: error.code || ERRORS.rs_invalid_operation,
        message: error.message,
        ...extra,
    };
};  */

export default {
    ERRORS: {
        ...ERRORS,
        ...LOGIC_ERRORS,
    },
    UserInputError,
    apolloThrow,
    apolloError,
    logicError,
    errorMessage,

    ext: (data: Record<string, any>) => {
        // eslint-disable-next-line no-param-reassign
        data[TAG] = true;
        return data;
    },
    // captureError,
};
