import { useNavigate } from "react-router-dom"
import styles from "../styles/NotFound.module.scss"

function NotFound() {
    const navigate = useNavigate()

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.code}>404</h1>

                <h2>Pagina nu a fost găsită</h2>

                <p>
                    Se pare că ai ajuns într-un loc unde nu există produse
                </p>

                <button
                    className={styles.button}
                    onClick={() => navigate("/")}
                >
                    Înapoi la pagina de pornire
                </button>
            </div>
        </div>
    )
}

export default NotFound