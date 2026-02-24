import { useEffect, useState, ReactNode } from "react";
import api from "../api.ts";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants.ts";
import { AuthContext } from "./AuthContext.tsx";
import { UserType, UserRole } from "../types/UserType.ts";

interface Props {
    children: ReactNode;
}

function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<UserType | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchMe = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setUser(null)
            setLoading(false)
            return
        }
        try {
            const res = await api.get('api/accounts/me/')
            setUser(res.data)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (username: string, password: string) => {
        const res = await api.post('/api/token/', { username, password })

        localStorage.setItem(ACCESS_TOKEN, res.data.access)
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh)

        await fetchMe()
    }

    const register = async (
        username: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        role: UserRole
    ) => {
        await api.post('/api/accounts/register/', {
            username,
            password,
            email,
            first_name: firstName,
            last_name: lastName,
            role_input: role
        })

        await login(username, password)
    }

    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN)
        localStorage.removeItem(REFRESH_TOKEN)
        setUser(null)
    }

    useEffect(() => {
        fetchMe()
    }, [])


    return (
        <AuthContext.Provider
            value={{ user, setUser, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider