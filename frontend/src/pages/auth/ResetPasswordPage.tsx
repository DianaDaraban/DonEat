import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import publicApi from "../../apiPublic.ts";
import styles from "../../styles/Form.module.scss";

function ResetPasswordPage() {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Parolele nu coincid.");
            return;
        }

        setLoading(true);

        try {
            const res = await publicApi.post(
                `/api/accounts/password-reset-confirm/${uidb64}/${token}/`,
                { password }
            );

            setMessage(res.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error: any) {
            setMessage(
                error.response?.data?.error || "Link invalid sau expirat."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.form_page}>
            <form onSubmit={handleSubmit} className={styles.form_container}>
                <h1>Parolă nouă</h1>

                <input
                    type="password"
                    className={styles.form_container__input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolă nouă"
                    minLength={6}
                    required
                />

                <input
                    type="password"
                    className={styles.form_container__input}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmă parola"
                    minLength={6}
                    required
                />

                {message && <p className={styles.form_message}>{message}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={styles.form_container__submit_button}
                >
                    {loading ? "Se salvează..." : "Resetează parola"}
                </button>

                <div className={styles.form_container__redirect}>
                    <p>
                        Înapoi la <Link to="/login">autentificare</Link>
                    </p>
                </div>
            </form>
        </main>
    );
}

export default ResetPasswordPage;