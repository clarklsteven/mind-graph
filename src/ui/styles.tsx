export function getButtonStyle(isActive: boolean): React.CSSProperties {
    return {
        width: "100%",
        padding: "10px 12px",
        textAlign: "center",
        border: "1px solid rgb(160, 150, 140)",
        borderRadius: "8px",
        backgroundColor: isActive
            ? "rgb(101, 26, 44)"
            : "rgb(255, 250, 231)",
        color: isActive ? "rgb(255, 250, 231)" : "rgb(70, 50, 60)",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
    };
}

export function getSecondaryButtonStyle(): React.CSSProperties {
    return {
        width: "100%",
        padding: "10px 12px",
        textAlign: "center",
        border: "1px solid rgb(160, 150, 140)",
        borderRadius: "8px",
        backgroundColor: "rgb(255, 250, 231)",
        color: "rgb(70, 50, 60)",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
    };
}

export function getDangerButtonStyle(): React.CSSProperties {
    return {
        width: "100%",
        padding: "10px 12px",
        textAlign: "center",
        border: "1px solid rgb(140, 70, 70)",
        borderRadius: "8px",
        backgroundColor: "rgb(240, 220, 220)",
        color: "rgb(120, 30, 30)",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 600,
    };
}

export function getPropertyLabelStyle(): React.CSSProperties {
    return {
        fontSize: "12px",
        fontWeight: 600,
        color: "rgb(120, 110, 100)",
        marginBottom: "4px",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    };
}

export function getPropertyInputStyle(): React.CSSProperties {
    return {
        width: "100%",
        padding: "8px 10px",
        border: "1px solid rgb(210, 205, 190)",
        borderRadius: "8px",
        backgroundColor: "rgb(255, 250, 231)",
        color: "rgb(70, 50, 60)",
        fontSize: "14px",
        boxSizing: "border-box",
    };
}

export function getPropertyDisplayStyle(): React.CSSProperties {
    return {
        padding: "8px 10px",
        border: "1px solid rgb(210, 205, 190)",
        borderRadius: "8px",
        backgroundColor: "rgb(236, 231, 214)",
        color: "rgb(140, 135, 130)",
        fontFamily: "monospace",
        fontSize: "13px",
    };
}

export function getPropertyDropdownStyle(): React.CSSProperties {
    return {
        width: "100%",
        padding: "8px 10px",
        border: "1px solid rgb(210, 205, 190)",
        borderRadius: "8px",
        backgroundColor: "rgb(255, 250, 231)",
        color: "rgb(70, 50, 60)",
        fontSize: "14px",
        boxSizing: "border-box",
    };
}

export function getModalOverlayStyle(): React.CSSProperties {
    return {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    };
}

export function getModalContentStyle(): React.CSSProperties {
    return {
        width: "480px",
        maxWidth: "90vw",
        maxHeight: "80vh",
        overflowY: "auto",
        backgroundColor: "#fffaf0",
        border: "1px solid #d6c7a1",
        borderRadius: "10px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        padding: "16px",
    };
}

export function getModalHeaderStyle(): React.CSSProperties {
    return {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
    };
}

export function getModalTitleStyle(): React.CSSProperties {
    return {
        fontSize: "18px",
        fontWeight: 600,
        color: "#651A2C",
    };
}

export function getModalCloseButtonStyle(): React.CSSProperties {
    return {
        border: "none",
        background: "transparent",
        fontSize: "20px",
        cursor: "pointer",
        color: "#651A2C",
    };
}

export function getModalBodyStyle(): React.CSSProperties {
    return {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    };
}

export function getScrollableHelpStyle(): React.CSSProperties {
    return {
        maxHeight: "60vh",
        overflowY: "auto",
        lineHeight: 1.5,
    };
}

export function getHelpButtonStyle(disabled: boolean): React.CSSProperties {
    return {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        border: "1px solid #651A2C",
        backgroundColor: disabled ? "#f0f0f0" : "#fffaf0",
        color: "#651A2C",
        fontWeight: 700,
        fontSize: "14px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        lineHeight: 1,
    };
}