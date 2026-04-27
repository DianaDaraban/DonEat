import styles from '../styles/LoadingIndicator.module.scss'

const LoadingIndicator = () => {
    return (
        <div className={styles.overlay}>
            <div className={styles.loader}></div>
        </div>
    )
}

export default LoadingIndicator