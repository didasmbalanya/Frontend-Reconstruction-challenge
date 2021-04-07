import { SubscriptionStatus, UserRole } from '../common/apollo/types';

export interface ScheduleRow {
    course_id: string;
    zoom_occurrence_id: string;
    zoom_meeting_id: string;
    instructor_enrollment_id: string;
    instructor_id?: number;
    start_time: string;
    end_time: string;
    cancelled: boolean;
    id: string;
}
export interface CohortRow {
    id: string;
    course_id: string;
    instructor_id: string;
    start_time: string;
    end_time: string;
    published: boolean;
    capacity: number;
    unit_id?: string;
}

export interface ZoomMeetingRow {
    id: string;
    start_url: string;
    internal_zoom_meeting_id: string;
}

export interface StudentEnrollmentRow {
    id: string;
    student_id: string;
    course_id: string;
    instructor_enrollment_id: string;
}
export interface StudentMeetingEnrollmentRow {
    zoom_registrant_id: string;
    zoom_meeting_id: string;
}

export interface UserRow {
    id: string;
    zoom_id: string;
    email: string;
    role: UserRole;
    personal_zoom: boolean;
}
export interface StudentRow {
    id: string;
    email: string;
    organization_id: string;
    paying: boolean;
}

export interface SubscriptionRow {
    id: string;
    student_id: string;
    parent_id: string;
    status: SubscriptionStatus;
}
