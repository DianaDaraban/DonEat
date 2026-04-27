// components/ConfirmModal.tsx
import styles from "../styles/ConfirmModal.module.scss";

type ConfirmModalProps = {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

function ConfirmModal({
    open,
    title,
    message,
    confirmText = "Confirmă",
    cancelText = "Renunță",
    danger = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!open) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>{title}</h3>
                <p>{message}</p>

                <div className={styles.actions}>
                    <button className={styles.cancel} onClick={onCancel}>
                        {cancelText}
                    </button>

                    <button
                        className={danger ? styles.danger : styles.confirm}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;