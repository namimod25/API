import type { User } from "../generated/client.ts";

declare global {
    namespace Express {
        interface Request {
            user: User;
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
