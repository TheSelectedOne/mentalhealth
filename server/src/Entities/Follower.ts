import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Follower extends BaseEntity {
    //username who is following that person
    @Column()
    tUserId: string;

    //user id of the user who is being followed
    @PrimaryColumn()
    userId: string;

    @ManyToOne(() => User, (user) => user.followers, { onDelete: "CASCADE" })
    user: User;
}