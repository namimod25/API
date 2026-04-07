import { User } from "./auth";

export interface item {
    likes?: number;
    username: string;
    avatar: string;
    id: number;
    caption: string;
    commentCount?: string;
    createdAt?: Date;
    image: string;
    imageId?: string;
    likeCount?: number;
    user: User;
}