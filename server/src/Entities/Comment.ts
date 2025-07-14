import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @PrimaryColumn()
    userId: string;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;

    @PrimaryColumn()
    postId: string;

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
    post: Post;
}