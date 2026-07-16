import {
    getModalBodyStyle,
    getModalCloseButtonStyle,
    getModalContentStyle,
    getModalHeaderStyle,
    getModalOverlayStyle,
    getModalTitleStyle
} from "../utils/styles";

type ModalProps = {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    width?: string; // Optional width prop
};

export function Modal({ isOpen, title, onClose, children, width }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div style={getModalOverlayStyle()} onClick={onClose} role="dialog" aria-label={title}>
            <div
                style={getModalContentStyle(width)}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={getModalHeaderStyle()}>
                    <div style={getModalTitleStyle()}>{title}</div>
                    <button style={getModalCloseButtonStyle()} onClick={onClose} role="button" aria-label="Close modal">
                        ×
                    </button>
                </div>

                <div style={getModalBodyStyle()}>
                    {children}
                </div>
            </div>
        </div>
    );
}