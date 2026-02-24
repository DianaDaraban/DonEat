export type UserRole = 'vendor' | 'buyer'

// export type UserProfileType = {
//     avatar: string | null
// }

export type UserType = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    avatar: string;
}