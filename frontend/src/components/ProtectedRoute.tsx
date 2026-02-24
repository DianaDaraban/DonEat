import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api from '../api.ts'
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants.ts'
import { useState, useEffect, ReactNode } from 'react'
// import { ACCESS_TOKEN } from '../constants.ts'
// import { ReactNode } from 'react'
import type { JWTPayload } from '../types/jwt.d.ts'

interface ProtectedRouteProps {
    children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    const refreshToken = async (): Promise<void> => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post('/api/token/refresh/', { refresh: refreshToken })
            if (res.status == 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    }

    useEffect(() => {
        const checkAuth = async (): Promise<void> => {
            const auth = async (): Promise<void> => {
                const token = localStorage.getItem(ACCESS_TOKEN)
                if (!token) {
                    setIsAuthorized(false)
                    return
                }

                const decoded = jwtDecode<JWTPayload>(token)
                const tokenExpiration = decoded.exp
                const now = Date.now() / 1000

                if (tokenExpiration < now) {
                    await refreshToken()
                } else {
                    setIsAuthorized(true)
                }
            }

            try {
                await auth()
            } catch {
                setIsAuthorized(false)
            }
        }
        checkAuth()
    }, [])

    if (isAuthorized == null) {
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to='/login' />

}
export default ProtectedRoute