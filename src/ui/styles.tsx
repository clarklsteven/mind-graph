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