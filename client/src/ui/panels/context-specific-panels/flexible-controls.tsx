import type { Mode } from "../../../app";
import type { GraphLookupSet } from "../../../core/model/graph-data";
import type { GraphInterpretation } from "../../../core/model/graph-interpretation";
import CreationControls from "./creation-controls";

type FlexibleControlsProps = {
    graphLookupSets: GraphLookupSet[];
    mode: string;
    setMode: (mode: Mode) => void;
    interpretation: GraphInterpretation | null;
    addNodeType: string;
    setAddNodeType: (type: string) => void;
    addEdgeType: string;
    setAddEdgeType: (type: string) => void;

}

export default function FlexibleControls({
    graphLookupSets,
    mode,
    setMode,
    interpretation,
    addNodeType,
    setAddNodeType,
    addEdgeType,
    setAddEdgeType
}: FlexibleControlsProps) {
    return (
        <CreationControls
            graphLookupSets={graphLookupSets}
            mode={mode}
            setMode={setMode}
            interpretation={interpretation}
            addNodeType={addNodeType}
            setAddNodeType={setAddNodeType}
            addEdgeType={addEdgeType}
            setAddEdgeType={setAddEdgeType}
        />
    );
}