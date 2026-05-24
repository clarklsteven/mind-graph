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
};

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div style={getModalOverlayStyle()} onClick={onClose}>
            <div
                style={getModalContentStyle()}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={getModalHeaderStyle()}>
                    <div style={getModalTitleStyle()}>{title}</div>
                    <button style={getModalCloseButtonStyle()} onClick={onClose}>
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