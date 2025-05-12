import { Field, InputType } from 'type-graphql';
import { City } from '../entity/User';
import gql from 'graphql-tag';

@InputType()
export class CreateUserInput {
    @Field()
    first_name: string;

    @Field()
    last_name: string;

    @Field()
    birth_date: string;

    @Field(() => City)
    city: City;
}

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    first_name?: string;

    @Field({ nullable: true })
    last_name?: string;

    @Field({ nullable: true })
    birth_date?: string;

    @Field(() => City, { nullable: true })
    city?: City;
}

export const userTypeDefs = gql`
    enum City {
        NEW_YORK
        LONDON
        PARIS
        TOKYO
        BERLIN
    }

    type User {
        id: Int!
        first_name: String!
        last_name: String!
        birth_date: String!
        city: City!
        created_at: String!
        updated_at: String!
    }

    input CreateUserInput {
        first_name: String!
        last_name: String!
        birth_date: String!
        city: City!
    }

    input UpdateUserInput {
        first_name: String
        last_name: String
        birth_date: String
        city: City
    }

    type Query {
        users: [User!]!
        user(id: Int!): User
    }

    type Mutation {
        createUser(input: CreateUserInput!): User!
        updateUser(id: Int!, input: UpdateUserInput!): User!
        deleteUser(id: Int!): Boolean!
    }
`;