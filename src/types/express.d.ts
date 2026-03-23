import type { User } from "../generated/client.ts";

declare global {
    namespace Express {
         interface Request {
            data?: UserData;
        }
    }
}
