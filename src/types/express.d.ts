declare global {
    namespace Express {
        interface Request {
            data?: {
                fullname: string;
                username: string;
                email: string;
                Image: string | null | undefined;
                bio: string | null | undefined;
            };
        }
    }
}

export { };
