interface UserData {
    id: number;
    fullname: string;
    username: string;
    email: string;
    Image: string | null;
    bio: string;
}

declare global {
    namespace Express {
        interface Request {
            data?: UserData;
        }
    }
}

export {};
