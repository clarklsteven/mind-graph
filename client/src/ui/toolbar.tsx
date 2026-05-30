import { getMindGraphTitleStyle, getSecondaryButtonStyle } from "./utils/styles";
import {
    FilePlus,
    FolderOpen,
    Save,
    Settings,
    CircleHelp
} from "lucide-react";

type ToolbarProps = {
    onSave: () => void;
    onCreate: () => void;
    onSettings: () => void;
    onHelp: () => void;
    onLoadGraph: () => void;
};

export default function Toolbar({
    onSave,
    onCreate,
    onSettings,
    onHelp,
    onLoadGraph
}: ToolbarProps) {
    return (
        <div className="toolbar">
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px",
                    padding: "8px"
                }}
            >
                <button
                    onClick={onCreate}
                    style={getSecondaryButtonStyle()}
                    title={"New Graph"}
                >
                    <FilePlus size={16} />
                </button>
                <button
                    onClick={onLoadGraph}
                    style={getSecondaryButtonStyle()}
                    title={"Load Graph"}
                >
                    <FolderOpen size={16} />
                </button>
                <button
                    onClick={onSave}
                    style={getSecondaryButtonStyle()}
                    title={"Save Graph"}>
                    <Save size={16} />
                </button>
            </div>
            <div
                style={getMindGraphTitleStyle()}
            >
                Mind Graph
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px",
                    padding: "8px"
                }}
            >
                <button
                    onClick={onSettings}
                    style={getSecondaryButtonStyle()}
                    title={"Settings"}
                >
                    <Settings size={16} />
                </button>
                <button
                    onClick={onHelp}
                    style={getSecondaryButtonStyle()}
                    title={"Help"}
                >
                    <CircleHelp size={16} />
                </button>
            </div>
        </div >
    );
}