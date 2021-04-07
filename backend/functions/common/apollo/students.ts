import gql from 'graphql-tag';
import { ApolloClientType } from '../types';

import {
    EnrollmentRule,
    EnrollmentStatus,
    GenderType,
    QueryResults,
    Student,
    User,
    ZoomMeetingEnrollment,
} from './types';



export const UPDATE_STUDENT = gql`
    mutation UpdateUser($id: uuid!, $object: students_set_input!) {
        student: update_student(pk_columns: { id: $id }, _set: $object) {
            id
            firstName
            lastName
            email
            currentGradeId
            organizationId
            hasConfirmed
        }
    }
`;
type StudentUpdates = Partial<Pick<Student, 'id' | 'hasConfirmed' | 'email'>>;
const update = async (client: ApolloClientType, id: string, updates: StudentUpdates) => {
    const { data } = await client.mutate<QueryResults<Student, 'student'>>({
        mutation: UPDATE_STUDENT,
        variables: {
            id,
            object: updates,
        },
    });
    return data?.student;
};

export default {
    update,
};
