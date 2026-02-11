import { createContext } from "react";
import { UserRole, UserType } from "../types/UserType.ts";

export interface AuthContextType{
    user: UserType | null;
    loading: boolean;
    login: (username:string, password: string) => Promise<void>
    register:(
        username: string,
        password: string,
        role: UserRole
    ) => Promise<void>
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
