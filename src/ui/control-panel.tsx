import React from "react";

type Mode = "select" | "add" | "link";

type ControlPanelProps = {
    mode: Mode;
    setMode: (mode: Mode) => void;
    onSave: () => void;
    onLoad: () => void;
};

export default function ControlPanel({
    mode,
    setMode,
    onSave,
    onLoad,
}: ControlPanelProps) {
    return (
        <aside
            style={{
                backgroundColor: "rgb(245, 239, 217)",
                borderRight: "1px solid rgb(210, 205, 190)",
                padding: "16px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "220px",
                minWidth: "220px",
            }}
        >
            <div>
                <h2
                    style={{
                        marginTop: 0,
                        fontSize: "18px",
                        color: "rgb(70, 50, 60)",
                        textAlign: "center",
                    }}
                >
                    Mind Graph
                </h2>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <button
                        onClick={() => setMode("select")}
                        style={getButtonStyle(mode === "select")}
                    >
                        Select
                    </button>

                    <button
                        onClick={() => setMode("add")}
                        style={getButtonStyle(mode === "add")}
                    >
                        Add Node
                    </button>

                    <button
                        onClick={() => setMode("link")}
                        style={getButtonStyle(mode === "link")}
                    >
                        Link Nodes
                    </button>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >
                <button onClick={onLoad} style={getSecondaryButtonStyle()}>
                    Load Graph
                </button>

                <button onClick={onSave} style={getSecondaryButtonStyle()}>
                    Save Graph
                </button>
            </div>
        </aside>
    );
}

function getButtonStyle(isActive: boolean): React.CSSProperties {
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

function getSecondaryButtonStyle(): React.CSSProperties {
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