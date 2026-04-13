import styles from "./AnimatedBackground.module.scss";

export default function AnimatedBackground() {
    return (
        <div className={styles.background}>
            <span className={styles.blob}></span>
            <span className={styles.blob}></span>
            <span className={styles.blob}></span>
            <span className={styles.blob}></span>
        </div>
    );
}