import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Following extends BaseEntity {
    //username who this person follows
    @Column()
    tUserId: string;

    //user id of the user who is following
    @PrimaryColumn()
    userId: string;

    @ManyToOne(() => User, (user) => user.following, { onDelete: "CASCADE" })
    user: User;
}