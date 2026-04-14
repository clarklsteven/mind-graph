import { useEffect, useState } from "react";
import { GraphInterpretation } from "../core/model/graph-interpretation";
import { Modal } from "./modal";
import { getScrollableHelpStyle } from "./styles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function InterpretationHelpModal({
    isOpen,
    onClose,
    interpretation,
}: {
    isOpen: boolean;
    onClose: () => void;
    interpretation: GraphInterpretation;
}) {
    const [helpText, setHelpText] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        if (!interpretation?.helpMarkdown) {
            setHelpText(null);
            return;
        }

        async function loadHelp() {
            try {
                const response = await fetch("../config/" + interpretation.helpMarkdown);
                const text = await response.text();
                setHelpText(text);
            } catch (err) {
                console.error("Failed to load help", err);
                setHelpText("Failed to load help content.");
            }
        }

        setHelpText(null);
        loadHelp();
    }, [isOpen, interpretation]);

    if (!interpretation || !interpretation.helpMarkdown) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            title={`${interpretation.label} Help`}
            onClose={onClose}
        >
            <div style={getScrollableHelpStyle()}>
                {helpText ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {helpText}
                    </ReactMarkdown>
                ) : (
                    "Loading help..."
                )}
            </div>
        </Modal>
    );
}