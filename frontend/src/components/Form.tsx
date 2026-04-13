import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Form.module.scss'
import LoadingIndicator from "./LoadingIndicator.tsx";
import { useAuth } from "../context/useAuth.ts";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react'

type FormProps = {
    method: "login" | "register"
    onSuccess?: () => void
}

function Form({ method, onSuccess }: FormProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState<"vendor" | "buyer">("vendor")
    const navigate = useNavigate()
    const { user, login, register } = useAuth()
    const [showPassword, setShowPassword] = useState(false)

    const name = method === 'login' ? 'Autentificare' : 'Înregistrare'


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (method === 'register') {
                await register(
                    username,
                    email,
                    password,
                    firstName,
                    lastName,
                    role
                )
            } else {
                await login(username, password)
            }

            onSuccess?.()

        } catch (error) {
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
            minLength={3}
            required
        />
        {method === 'register' && (
            <>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Prenume"
                    className={styles.form_container__input}
                    minLength={3}
                    required
                />

                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nume"
                    className={styles.form_container__input}
                    minLength={3}
                    required
                />

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className={styles.form_container__input}
                    minLength={3}
                    required
                />
            </>
        )}
        <div className={styles.password_input_container}>
            <input
                type={showPassword ? "text" : "password"}
                className={`${styles.form_container__input}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolă"
                minLength={6}
                required
            />
            <div
                className={styles.password_visibility}
                onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <Eye size={20} color="rgba(var(--color-secondary-rgb), .9)" /> : <EyeOff size={20} color="var(--color-grey)" />}
            </div>
        </div>

        {method === 'register' && (
            <select
                value={role}
                onChange={(e) => setRole(e.target.value as "vendor" | "buyer")}
                className={`${styles.form_container__input}`}
                required
            >
                <option value="vendor">Vendor</option>
                <option value="buyer">Buyer</option>
            </select>
        )}
        {loading && <LoadingIndicator />}
        <button type="submit" className={`${styles.form_container__submit_button}`}>{name}</button>

        <div className={styles.form_container__redirect}>
            {method === "login" ? (
                <p>
                    Nu ai cont? <Link to="/register">Creează unul</Link>
                </p>
            ) : (
                <p>
                    Ai deja cont? <Link to="/login">Autentifică-te</Link>
                </p>
            )}
        </div>
    </form>
}

export default Form