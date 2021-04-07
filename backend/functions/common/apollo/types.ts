import Stripe from 'stripe';

export enum UserRole {
    STUDENT = 'student',
    PARENT = 'parent',
    DASHBOARD = 'dashboard',
    TEACHER = 'teacher',
    ANONYMOUS = 'anonymous',
    ADMIN = 'admin',
}

export enum UserCustomAttribute {
    ROLE = 'custom:role',
    SIGNUP_STARTED = 'custom:signup_started',
    GRADE = 'custom:grade',
}

type One<T> = { [name: string]: Partial<T> };

export type QueryResults<T, F extends keyof any> = Record<F, T>;

export type AffectedRows<F extends keyof any = 'results'> = QueryResults<{ affected_rows: number }, F>;
export type InsertId<F extends keyof any> = QueryResults<{ id: string | number }, F>;
export type Returning<T, F extends keyof any> = QueryResults<{ returning: T[] }, F>;

export enum FrequencyType {
    WEEKLY = 'weekly',
    TWICE_WEEKLY = 'twice_weekly',
    WEEKDAYS = 'weekdays',
}
export enum CourseType {
    STANDARD = 'standard',
    IMMERSIVE = 'immersive',
}

export interface Course {
    id: string;
    name: string;
    description: string;
    subjectId: string;
    grades?: {
        gradeId: number;
    }[];
    frequencyType: FrequencyType;
    capacity: number;
    duration: {
        minutes: number;
    };
    totalClasses: number;
    price?: number;
    kind?: CourseType;
}

export interface ZoomMeeting {
    id: string;
    startDate: string;
    endDate: string;
    internalZoomMeetingId: string;
}
export interface Schedule {
    id: string;
    startTime: string;
    endTime: string;
    zoomMeetingId: string;
    zoomOccurrenceId: string;
    course?: Course;
    instructorEnrollmentId: string;
}
export interface Cohort {
    id: string;
    capacity: number;
    courseId: string;
    course?: Course;
    instructorId: string;
    startTime: string;
    endTime: string;
    instructor?: User;
    zoomMeetings?: ZoomMeeting[];
}

export interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    paying?: boolean;
    email?: string;
    parentId?: string;
    parent_id?: string;
    parent?: User;
    shopifyCustomerId?: string;
}
export interface User extends Profile {
    hasConfirmed?: boolean;
    zoomId?: string;
    thinkificId?: number;
    bio?: string;
    avatar?: {
        url: string;
    };
    provisioning?: boolean;
    personal_zoom?: boolean;
    emailAlias?: string;
}

export interface Student extends Omit<User, 'zoomId' | 'avatar' | 'bio'> {
    internalId: string;
    currentGradeId: number;
    organizationId?: string;
    paying?: boolean;
    dob?: string;
    genderType?: string;
    organization?: Organization;
}

export interface ZoomMeetingEnrollment {
    id: string;
    zoomRegistrantId: string;
    zoomMeeting: ZoomMeeting;
}

export interface Grade {
    id: number;
    name: string;
}

interface SchoolConfig {
    samlCert?: string;
    clever?: {
        schoolId: string;
    };
}
export interface Organization {
    id: string;
    name: string;
    provider: string;
    timeZone: string;
    config: SchoolConfig;
    isSchool?: boolean;
}
export enum GenderType {
    MALE = 'male',
    FEMALE = 'female',
    NOT_LISTED = 'not_listed',
    PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum EnrollmentCheck {
    GRADE = 'grade',
    SUBJECT = 'subject',
    COURSE = 'course',
}

export enum EnrollmentCheckComparison {
    ONCE = 'once',
    // OR = 'or',
    AMOUNT = 'amount',
}
export interface EnrollmentRule {
    organizationId: string;
    studentInternalId?: string;
    data: {
        /**
         * @deprecated
         */
        entityId?: string | number;
        amount?: number;
        entityIds?: string[] | number[];
        comparison: EnrollmentCheckComparison;
        check: EnrollmentCheck;
    };
}

export enum EnrollmentStatusKind {
    SUBJECT = 'subject',
    COURSE = 'course',
}
export interface EnrollmentStatus {
    kind: EnrollmentStatusKind;
    count: number;
    name: string; // subject id
    id: string | number;
}

export interface StripeCustomer {
    customerId: string;
    students?: Student[];
}

export interface Coupon extends StripeBacked<Stripe.Coupon> {
    id: string;
    name: string;
}

export interface PromoCode extends StripeBacked<Stripe.PromotionCode> {
    id: string;
    code: string;
    active: boolean;
    couponId: string;
    boo?: boolean;
    coupon?: Coupon;
}

export interface RelInsert<T> {
    data: T;
    on_conflict: {
        constraint: string;
        update_columns: [string];
        where?: any;
    };
}

export interface Unit {
    id: string;
    capacity: number;
    frequencyType: FrequencyType;
    price: number;
    name: string;
    duration: {
        id: number;
        minutes: number;
    };
    totalSessions: number;
}

export interface StripeBacked<T> {
    stripeObject: T;
}
export interface Product extends StripeBacked<Stripe.Product> {
    id: string;

    name: string;
    title: string;
    details: string;
}
export interface ProductPrice extends StripeBacked<Stripe.Price> {
    id: string;
    productId: string;
    active: boolean;
    amount: number;
}

export enum SubscriptionStatus {
    ACTIVE = 'active',
    CANCELED = 'canceled',
    INCOMPLETE = 'incomplete',
    INCOMPLETE_EXPIRED = 'incomplete_expired',
    PAST_DUE = 'past_due',
    TRIALING = 'trialing',
    UNPAID = 'unpaid',
}
export interface Subscription extends StripeBacked<Stripe.Subscription> {
    id: string;
    stripeSubscriptionId: string;
    studentId: string;
    parentId?: string;
    cancelAt?: string | null;
    status: SubscriptionStatus;
}
