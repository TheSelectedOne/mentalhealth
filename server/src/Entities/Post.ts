import { Entity, PrimaryColumn, Column, BaseEntity, CreateDateColumn, OneToMany } from "typeorm";
import { Like } from "./Like";
import { Comment } from "./Comment";

@Entity()
export class Post extends BaseEntity {
    @PrimaryColumn({ unique: true })
    id: string;

    @Column()
    author: string;

    @Column()
    title: string;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Like, (like) => like.post)
    likes: Like[];

    @Column({ type: "int", default: 0 })
    likeAmount!: number;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @Column({ type: "int", default: 0 })
    commentAmount: number;
}

