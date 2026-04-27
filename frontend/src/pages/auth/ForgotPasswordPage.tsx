import { useState } from "react";
import publicApi from "../../apiPublic.ts";
import styles from "../../styles/Form.module.scss";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await publicApi.post("/api/accounts/password-reset/", {
                email,
            });

            setMessage(res.data.message);
            setEmail("");
        } catch (error) {
            setMessage("A apărut o eroare. Încearcă din nou.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.form_page}>
            <form onSubmit={handleSubmit} className={styles.form_container}>
                <h1>Resetare parolă</h1>

                <p className={styles.form_text}>
                    Introdu adresa de email asociată contului tău și îți trimitem un link de resetare.
                </p>

                <input
                    type="email"
                    className={styles.form_container__input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />

                {message && <p className={styles.form_message}>{message}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={styles.form_container__submit_button}
                >
                    {loading ? "Se trimite..." : "Trimite linkul"}
                </button>

                <div className={styles.form_container__redirect}>
                    <p>
                        Ți-ai amintit parola? <Link to="/login">Autentifică-te</Link>
                    </p>
                </div>
            </form>
        </main>
    );
}

export default ForgotPasswordPage;