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
declare function ConfirmModal({ open, title, message, confirmText, cancelText, danger, onConfirm, onCancel, }: ConfirmModalProps): import("react").JSX.Element | null;
export default ConfirmModal;
//# sourceMappingURL=ConfirmModal.d.ts.map