import {
    FilePlus,
    FolderOpen,
    Save,
    Settings,
    CircleHelp,
    SquareLibrary
} from "lucide-react";

type ToolbarProps = {
    onSave: () => void;
    onCreate: () => void;
    onSettings: () => void;
    onHelp: () => void;
    onLoadGraph: () => void;
    onCreateFlexibleSchema: () => void;
};

export default function Toolbar({
    onSave,
    onCreate,
    onSettings,
    onHelp,
    onLoadGraph,
    onCreateFlexibleSchema
}: ToolbarProps) {
    return (
        <div className="toolbar">
            <div className="toolbar-actions">
                <button
                    onClick={onCreate}
                    className="toolbar-button"
                    title={"New Graph"}
                >
                    <FilePlus size={16} />
                </button>
                <button
                    onClick={onLoadGraph}
                    className="toolbar-button"
                    title={"Load Graph"}
                >
                    <FolderOpen size={16} />
                </button>
                <button
                    onClick={onSave}
                    className="toolbar-button"
                    title={"Save Graph"}>
                    <Save size={16} />
                </button>
                <button
                    onClick={onCreateFlexibleSchema}
                    className="toolbar-button"
                    title={"Create Flexible Schema"}>
                    <SquareLibrary size={16} />
                </button>
            </div>
            <div className="toolbar-title">
                Mind Graph
            </div>
            <div className="toolbar-actions">
                <button
                    onClick={onSettings}
                    className="toolbar-button"
                    title={"Settings"}
                >
                    <Settings size={16} />
                </button>
                <button
                    onClick={onHelp}
                    className="toolbar-button"
                    title={"Help"}
                >
                    <CircleHelp size={16} />
                </button>
            </div>
        </div >
    );
}