import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
} from "typeorm";
import { Follower } from "./Follower";
import { Following } from "./Following";
import { Post } from "./Post";
import { Like } from "./Like";
import { Comment } from "./Comment";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn({ unique: true })
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    userWallet: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Follower, (follower) => follower.user)
    followers: Follower[];

    @Column({ type: "int", default: 0 })
    followersAmount: number;

    @OneToMany(() => Following, (following) => following.user)
    following: Following[];

    @Column({ type: "int", default: 0 })
    followingAmount: number;

    @OneToMany(() => Post, (post) => post.author)
    posts: Post[];

    @Column({ type: "int", default: 0 })
    postsAmount: number;

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];
}