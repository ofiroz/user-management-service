import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, Field, ID, registerEnumType } from "type-graphql";

export enum City {
    MAALE_ADUMIM = "MAALE_ADUMIM",
    NEW_YORK = "NEW_YORK",
    LONDON = "LONDON",
    PARIS = "PARIS",
    TOKYO = "TOKYO",
    BERLIN = "BERLIN"
}

registerEnumType(City, {
    name: "City",
    description: "The list of available cities"
});

@ObjectType()
@Entity()
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    first_name: string;

    @Field()
    @Column()
    last_name: string;

    @Field()
    @Column({ type: 'timestamp with time zone' })
    birth_date: Date;

    @Field(() => City)
    @Column({
        type: "enum",
        enum: City,
        default: City.MAALE_ADUMIM
    })
    city: City;

    @Field()
    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @Field()
    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;
} 