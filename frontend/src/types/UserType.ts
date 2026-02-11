export type UserRole = 'vendor' | 'buyer'

export type UserType = {
    id: number;
    username: string;
    role: UserRole;
}