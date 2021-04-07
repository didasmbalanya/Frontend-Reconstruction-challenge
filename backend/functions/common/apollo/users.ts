import gql from "graphql-tag";
import { ApolloClientType } from "../types";
import { QueryResults, User } from "./types";

export const UPDATE_USER = gql`
    mutation UpdateUser($id: uuid!, $object: users_set_input!) {
        user: update_user(pk_columns: { id: $id }, _set: $object) {
            id
            firstName
            lastName
            email
            role
            emailAlias
            hasConfirmed
            zoomId
            thinkificId
        }
    }
`;

type UserUpdates = Partial<
    Pick<
        User,
        | 'firstName'
        | 'lastName'
        | 'email'
        | 'hasConfirmed'
        | 'zoomId'
        | 'thinkificId'
        | 'provisioning'
        | 'personal_zoom'
    >
>;

const update = async (client: ApolloClientType, id: string, updates: UserUpdates) => {
    const { data } = await client.mutate<QueryResults<User, 'user'>>({
        mutation: UPDATE_USER,
        variables: {
            id,
            object: updates,
        },
    });
    return data?.user;
};

export default {
    update,
};
