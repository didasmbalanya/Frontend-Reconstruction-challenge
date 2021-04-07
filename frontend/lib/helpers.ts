
export enum Features {
    LOGIN = 'login',
    SIGN_UP = 'sign-up',
    MANAGE_USER = 'manage-user',
    MANAGE_STUDENT = 'manage-student',
    PAYMENTS = 'payments',
    SUBSCRIPTIONS = 'subscriptions',
    ALL = 'all',
}
export const isFeatureEnabled = (feature: Features) => {
    const check = process.env.ENABLED_FEATURES || '';
    return !check.includes(`-${feature}`) && (check.includes(feature) || check.includes(Features.ALL));
};

const _ENABLED_FEATURES = {
    LOGIN: isFeatureEnabled(Features.LOGIN),
    SIGN_UP: isFeatureEnabled(Features.SIGN_UP),
    MANAGE_USER: isFeatureEnabled(Features.MANAGE_USER),
    MANAGE_STUDENT: isFeatureEnabled(Features.MANAGE_STUDENT),
    PAYMENTS: isFeatureEnabled(Features.PAYMENTS),
    SUBSCRIPTIONS: isFeatureEnabled(Features.SUBSCRIPTIONS),
};


export const ENABLED_FEATURES: Readonly<typeof _ENABLED_FEATURES> = _ENABLED_FEATURES;

export const DEFAULT_SUBSCRIPTION_PLAN = 'Pay As You Go';
