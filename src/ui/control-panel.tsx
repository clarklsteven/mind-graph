import { Mode } from "../app";
import { getButtonStyle, getSecondaryButtonStyle } from "./styles";


type ControlPanelProps = {
    name: string;
    mode: Mode;
    setMode: (mode: Mode) => void;
    onSave: () => void;
    onLoad: () => void;
    onCreate: () => void;
};

export default function ControlPanel({
    name,
    mode,
    setMode,
    onSave,
    onLoad,
    onCreate,

}: ControlPanelProps) {
    console.log("Rendering ControlPanel with name:", name, "and mode:", mode);
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
                <p style={{
                    fontSize: "14px",
                    color: "rgb(70, 50, 60)",
                    textAlign: "center",
                    marginTop: "4px",
                }}
                >
                    {name || "Untitled Graph"}
                </p>

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
                <button onClick={onCreate} style={getSecondaryButtonStyle()}>
                    New Graph
                </button>
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