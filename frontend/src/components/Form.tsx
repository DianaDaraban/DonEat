import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Form.module.scss'
import LoadingIndicator from "./LoadingIndicator.tsx";
import { useAuth } from "../context/useAuth.ts";

type FormProps = {
    method: "login" | "register"
    onSuccess?: () => void
}

function Form({ method, onSuccess }: FormProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState<"vendor" | "buyer">("vendor")
    const navigate = useNavigate()
    const { user, login, register } = useAuth()

    const name = method === 'login' ? 'Autentificare' : 'Înregistrare'


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSuccess?.()
        setLoading(true)

        try {
            if (method === 'register') {
                await register(username, password, role)
            } else {
                await login(username, password)
            }
        }
        catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!user) return

        if (user.role === 'vendor') {
            navigate('/dashboard')
        } else {
            navigate('/')
        }
    }, [user, navigate])


    return <form onSubmit={handleSubmit} className={`${styles.form_container}`}>
        <h1>{name}</h1>
        <input
            type="text"
            className={`${styles.form_container__input}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nume de utilizator"
        />
        <input
            type="password"
            className={`${styles.form_container__input}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parolă"
        />
        {method === 'register' && (
            <select
                value={role}
                onChange={(e) => setRole(e.target.value as "vendor" | "buyer")}
                className={`${styles.form_container__input}`}
            >
                <option value="vendor">Vendor</option>
                <option value="buyer">Buyer</option>
            </select>
        )}
        {loading && <LoadingIndicator />}
        <button type="submit" className={`${styles.form_container__submit_button}`}>{name}</button>
    </form>
}

export default Form