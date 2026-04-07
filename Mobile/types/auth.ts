
 export interface User {
    caption: string;
    avatar: string | undefined;
    id: number,
    username: string,
    fullname: string,
    email: string,
    image?: string,
    bio?: string
}

  export interface AuthState {
    user: User | null,
    token: string | null,
    isLoading: boolean,

    setToken: (user: any, token: string) => Promise<void>
    loadToken: () => Promise<void>;
    removeToken: () => Promise<void>;

}