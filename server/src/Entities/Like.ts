import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Like extends BaseEntity {
    @Column({ type: "int" })
    value: number;

    @PrimaryColumn()
    userId: string;

    @ManyToOne(() => User, (user) => user.likes)
    user: User;

    @PrimaryColumn()
    postId: string;

    @ManyToOne(() => Post, (post) => post.likes, { onDelete: "CASCADE" })
    post: Post;
}